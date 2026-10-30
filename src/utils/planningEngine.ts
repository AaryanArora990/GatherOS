import {
  ALL_BUDGET_CATEGORIES,
  BudgetCategoryName,
  BudgetRealityCheckItem,
  BudgetRealityCheckResult,
  BudgetSummary,
  CategoryBudgetBreakdown,
  CelebrationEvent,
  GuestItem,
  ScenarioSimulationInput,
  ScenarioSimulationResult,
  TimelineTask,
  VendorCategoryName,
  VendorItem,
  WhatIfCategoryDelta,
  WhatIfSimulationResult,
} from '../types/gatheros';

/**
 * Pure Budget Intelligence Engine
 * Enforces:
 * TOTAL BUDGET = SUM OF ALL CATEGORY ALLOCATIONS
 * REMAINING BUDGET = TOTAL BUDGET - ACTUAL EXPENSES
 */
export function calculateBudgetSummary(event: CelebrationEvent): BudgetSummary {
  const categoryMap = new Map<BudgetCategoryName, CategoryBudgetBreakdown>();

  for (const category of ALL_BUDGET_CATEGORIES) {
    categoryMap.set(category, {
      category,
      allocated: 0,
      planned: 0,
      quoted: 0,
      actual: 0,
      paid: 0,
      committed: 0,
      outstanding: 0,
      utilizationPercent: 0,
      isOverAllocated: false,
    });
  }

  for (const item of event.budgetItems) {
    const entry = categoryMap.get(item.category) ?? {
      category: item.category,
      allocated: 0,
      planned: 0,
      quoted: 0,
      actual: 0,
      paid: 0,
      committed: 0,
      outstanding: 0,
      utilizationPercent: 0,
      isOverAllocated: false,
    };

    entry.allocated += Number(item.allocatedAmount) || 0;
    entry.planned += Number(item.plannedAmount) || 0;
    entry.quoted += Number(item.vendorQuotationAmount) || 0;
    entry.actual += Number(item.actualAmount) || 0;
    entry.paid += Number(item.paidAmount) || 0;
    if (item.isCommitted) {
      entry.committed += Number(item.actualAmount || item.vendorQuotationAmount || item.plannedAmount) || 0;
    }
    categoryMap.set(item.category, entry);
  }

  const categoryBreakdowns: CategoryBudgetBreakdown[] = [];
  let totalAllocatedBudget = 0;
  let plannedExpenses = 0;
  let vendorQuotations = 0;
  let actualExpenses = 0;
  let paidExpenses = 0;
  let committedExpenses = 0;

  for (const entry of categoryMap.values()) {
    entry.outstanding = Math.max(0, entry.actual - entry.paid);
    entry.utilizationPercent =
      entry.allocated > 0 ? Math.round((entry.actual / entry.allocated) * 100) : entry.actual > 0 ? 100 : 0;
    entry.isOverAllocated = entry.actual > entry.allocated || entry.planned > entry.allocated;

    totalAllocatedBudget += entry.allocated;
    plannedExpenses += entry.planned;
    vendorQuotations += entry.quoted;
    actualExpenses += entry.actual;
    paidExpenses += entry.paid;
    committedExpenses += entry.committed;

    categoryBreakdowns.push(entry);
  }

  // Exact formulas specified in requirements:
  // TOTAL BUDGET = SUM OF ALL CATEGORY ALLOCATIONS
  // REMAINING BUDGET = TOTAL BUDGET - ACTUAL EXPENSES
  const remainingBudget = totalAllocatedBudget - actualExpenses;
  const targetRemainingBudget = event.targetBudget - actualExpenses;
  const outstandingPayments = Math.max(0, actualExpenses - paidExpenses);
  const utilizationPercentage =
    totalAllocatedBudget > 0 ? Math.round((actualExpenses / totalAllocatedBudget) * 100) : 0;

  const isOverTarget = totalAllocatedBudget > event.targetBudget || actualExpenses > event.targetBudget;
  const isActualExceedingAllocated = actualExpenses > totalAllocatedBudget;

  const warnings: string[] = [];
  if (totalAllocatedBudget > event.targetBudget) {
    const diff = totalAllocatedBudget - event.targetBudget;
    warnings.push(
      `Total category allocations exceed your target cap of ${event.currencySymbol}${event.targetBudget.toLocaleString()} by ${event.currencySymbol}${diff.toLocaleString()}.`
    );
  }
  if (actualExpenses > totalAllocatedBudget) {
    const diff = actualExpenses - totalAllocatedBudget;
    warnings.push(
      `Actual recorded expenses exceed your total allocated budget by ${event.currencySymbol}${diff.toLocaleString()}.`
    );
  }
  for (const cat of categoryBreakdowns) {
    if (cat.actual > cat.allocated && cat.allocated > 0) {
      warnings.push(
        `${cat.category} actual spend (${event.currencySymbol}${cat.actual.toLocaleString()}) exceeds its allocation (${event.currencySymbol}${cat.allocated.toLocaleString()}).`
      );
    }
  }

  return {
    targetBudget: event.targetBudget,
    totalAllocatedBudget,
    plannedExpenses,
    vendorQuotations,
    actualExpenses,
    paidExpenses,
    committedExpenses,
    outstandingPayments,
    remainingBudget,
    targetRemainingBudget,
    utilizationPercentage,
    isOverTarget,
    isActualExceedingAllocated,
    warnings,
    categoryBreakdowns,
  };
}

/**
 * Budget Reality Check Engine
 * Identifies overspending categories, explains financial impact, suggests realistic alternatives,
 * generates a revised allocation, and shows trade-offs.
 */
export function runBudgetRealityCheck(event: CelebrationEvent): BudgetRealityCheckResult {
  const summary = calculateBudgetSummary(event);
  const highestSpendTotal = Math.max(summary.totalAllocatedBudget, summary.actualExpenses, summary.plannedExpenses);
  const isExceeding =
    highestSpendTotal > event.targetBudget ||
    summary.categoryBreakdowns.some((c) => c.actual > c.allocated || c.planned > c.allocated);

  const excessAmount = Math.max(0, highestSpendTotal - event.targetBudget);

  const alternativeStrategies: Record<
    BudgetCategoryName,
    { alt: string; tradeOff: string; trimRatio: number }
  > = {
    Venue: {
      alt: 'Negotiate a bundled twilight/weekday slot or heritage courtyard package with in-house lighting included.',
      tradeOff: 'Slightly narrower setup window (4 hours instead of full-day access).',
      trimRatio: 0.14,
    },
    'Food and catering': {
      alt: 'Curate 3 signature regional live stations + refined plated main course instead of an oversized 40-item buffet.',
      tradeOff: 'Fewer redundant dishes, higher culinary freshness and zero food waste.',
      trimRatio: 0.16,
    },
    Decoration: {
      alt: 'Use seasonal local botanicals, brass heirloom lanterns, and architectural uplighting instead of imported florals.',
      tradeOff: 'Emphasizes warm atmospheric candle/amber light over dense floral walls.',
      trimRatio: 0.22,
    },
    Photography: {
      alt: 'Book a senior documentary lead photographer + 1 second shooter for peak 8 hours rather than 14-hour multi-crew coverage.',
      tradeOff: 'Early morning prep uses curated portrait sessions rather than full crew standby.',
      trimRatio: 0.15,
    },
    Entertainment: {
      alt: 'Pair an acoustic folk/jazz welcome duo with a curated high-energy DJ set instead of a 10-piece stage band.',
      tradeOff: 'More intimate acoustic welcome transitions into a versatile dance floor.',
      trimRatio: 0.18,
    },
    Transportation: {
      alt: 'Consolidate guest shuttles into two scheduled departure waves from central pickup hubs.',
      tradeOff: 'Guests depart on fixed 30-minute shuttle intervals rather than on-demand cars.',
      trimRatio: 0.2,
    },
    Invitations: {
      alt: 'Switch to bespoke illustrated digital RSVP suites with printed keepsake cards only for elders/VIPs.',
      tradeOff: 'Reduces printing & courier postage by 75% while speeding up RSVP tracking.',
      trimRatio: 0.35,
    },
    Accommodation: {
      alt: 'Secure a group room block rate at a partner boutique hotel 10 minutes from the venue.',
      tradeOff: 'Short shuttle ride required vs on-premise luxury suites.',
      trimRatio: 0.18,
    },
    Miscellaneous: {
      alt: 'Standardize welcome hampers using local artisanal treats and reusable linen pouches.',
      tradeOff: 'Streamlined packaging with higher local authenticity.',
      trimRatio: 0.2,
    },
    'Emergency reserve': {
      alt: 'Maintain a protected 5% contingency buffer; reallocate only excess unallocated buffer.',
      tradeOff: 'Keeps essential weather/vendor safety net intact.',
      trimRatio: 0.05,
    },
  };

  const overspendingCategories: BudgetRealityCheckItem[] = [];
  let revisedTotalAllocation = 0;

  for (const cat of summary.categoryBreakdowns) {
    const activeSpend = Math.max(cat.allocated, cat.actual, cat.planned);
    const isCatOver = cat.actual > cat.allocated || cat.planned > cat.allocated || (excessAmount > 0 && cat.allocated > event.targetBudget * 0.12);

    if (isCatOver && activeSpend > 0) {
      const strategy = alternativeStrategies[cat.category];
      const savingsAmount = Math.max(
        cat.actual > cat.allocated ? cat.actual - cat.allocated : 0,
        Math.round(activeSpend * strategy.trimRatio)
      );
      const recommendedAmount = Math.max(0, activeSpend - savingsAmount);
      revisedTotalAllocation += recommendedAmount;

      overspendingCategories.push({
        category: cat.category,
        currentAmount: activeSpend,
        recommendedAmount,
        savingsAmount,
        financialImpact:
          cat.actual > cat.allocated
            ? `Exceeds category allocation by ${event.currencySymbol}${(cat.actual - cat.allocated).toLocaleString()} (${cat.utilizationPercent}% utilized).`
            : `Accounts for ${Math.round((activeSpend / Math.max(1, highestSpendTotal)) * 100)}% of total projected spend.`,
        realisticAlternative: strategy.alt,
        tradeOff: strategy.tradeOff,
      });
    } else {
      revisedTotalAllocation += activeSpend;
    }
  }

  const totalSavings = overspendingCategories.reduce((sum, item) => sum + item.savingsAmount, 0);

  const summaryExplanation = isExceeding
    ? `Your active plan faces ${event.currencySymbol}${excessAmount.toLocaleString()} in target pressure across ${overspendingCategories.length} categories. Applying the recommended adjustments recovers ${event.currencySymbol}${totalSavings.toLocaleString()} while preserving the guest experience.`
    : `Your overall budget is within your ${event.currencySymbol}${event.targetBudget.toLocaleString()} target, though ${overspendingCategories.length} categories can still be optimized for extra contingency headroom.`;

  return {
    isExceeding,
    excessAmount,
    summaryExplanation,
    overspendingCategories,
    revisedTotalAllocation,
  };
}

/**
 * What-If Guest Count Simulator
 * Simulates changing guest count (e.g. from 180 to 220) with explicit per-category scaling assumptions.
 */
export function simulateGuestCountChange(
  event: CelebrationEvent,
  newGuestCount: number
): WhatIfSimulationResult {
  const safeOriginalGuests = Math.max(1, event.guestCount);
  const safeNewGuests = Math.max(1, Math.round(newGuestCount));
  const guestDelta = safeNewGuests - safeOriginalGuests;
  const guestRatio = safeNewGuests / safeOriginalGuests;

  const summary = calculateBudgetSummary(event);

  // Scaling Elasticity per category:
  // 1.0 = strictly linear per-head (Food & catering)
  // 0.7 = semi-variable (Invitations, Accommodation, Transportation)
  // 0.35 = step-variable (Venue seating/tables, Decoration centerpieces, Miscellaneous favors)
  // 0.0 = fixed fee (Photography, Entertainment, Emergency reserve)
  const scalingFactorMap: Record<BudgetCategoryName, { elasticity: number; note: string }> = {
    'Food and catering': {
      elasticity: 1.0,
      note: 'Scales 100% linearly per guest plate, beverage pairing, and service staff ratio.',
    },
    Invitations: {
      elasticity: 0.75,
      note: 'Scales by household/invitation suite count (~1.8 guests per invitation).',
    },
    Transportation: {
      elasticity: 0.7,
      note: 'Requires additional shuttle capacity or van frequency for guest transfers.',
    },
    Accommodation: {
      elasticity: 0.65,
      note: 'Scales with out-of-town guest room blocks (double occupancy assumption).',
    },
    Decoration: {
      elasticity: 0.35,
      note: 'Adds guest dining tables, linen sets, and floral centerpieces (1 table per 8–10 guests).',
    },
    Venue: {
      elasticity: 0.25,
      note: 'Covers additional banquet seating, chair rentals, and venue support staff.',
    },
    Miscellaneous: {
      elasticity: 0.5,
      note: 'Adjusts welcome hampers, favors, and hospitality kits per attendee.',
    },
    Photography: {
      elasticity: 0.0,
      note: 'Fixed creative crew rate (unchanged unless adding an extra event function).',
    },
    Entertainment: {
      elasticity: 0.0,
      note: 'Fixed performance & sound engineering fee.',
    },
    'Emergency reserve': {
      elasticity: 0.4,
      note: 'Proportional buffer adjustment to protect against per-head overages.',
    },
  };

  const categoryDeltas: WhatIfCategoryDelta[] = [];
  let projectedTotalAllocated = 0;

  for (const cat of summary.categoryBreakdowns) {
    const rule = scalingFactorMap[cat.category];
    const scaledRatio = 1 + (guestRatio - 1) * rule.elasticity;
    const projectedAllocated = Math.max(0, Math.round(cat.allocated * scaledRatio));
    const delta = projectedAllocated - cat.allocated;
    projectedTotalAllocated += projectedAllocated;

    categoryDeltas.push({
      category: cat.category,
      currentAllocated: cat.allocated,
      projectedAllocated,
      delta,
      assumptionNote: `${rule.note} (AI/Engine estimate)`,
    });
  }

  const totalCostDelta = projectedTotalAllocated - summary.totalAllocatedBudget;
  const perAdditionalGuestCost =
    guestDelta !== 0 ? Math.round(Math.abs(totalCostDelta / guestDelta)) : 0;

  return {
    originalGuestCount: safeOriginalGuests,
    newGuestCount: safeNewGuests,
    guestDelta,
    originalTotalAllocated: summary.totalAllocatedBudget,
    projectedTotalAllocated,
    totalCostDelta,
    perAdditionalGuestCost,
    categoryDeltas,
    assumptions: [
      `All figures are labelled estimates based on ${safeOriginalGuests} → ${safeNewGuests} guests (${guestDelta >= 0 ? '+' : ''}${guestDelta} guests).`,
      'Food & catering scales 1:1 per guest; tables & decor scale at 1 centerpiece per 8–10 guests.',
      'Photography and Entertainment remain fixed unless venue zone size doubles.',
    ],
  };
}

/**
 * Timeline Intelligence Engine
 * Detects overdue milestones, computes completion stats, and builds recovery plans.
 */
export function analyzeTimelineHealth(tasks: TimelineTask[], referenceDateIso = '2026-10-30') {
  const refTime = new Date(referenceDateIso).getTime();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    const dueTime = new Date(t.dueDate).getTime();
    return !Number.isNaN(dueTime) && dueTime < refTime;
  });

  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recoverySuggestions = overdueTasks.map((task) => {
    const newDue = new Date(refTime + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return {
      taskId: task.id,
      title: task.title,
      originalDueDate: task.dueDate,
      recommendedNewDueDate: newDue,
      actionPlan: `Escalate "${task.title}" to High Priority, assign direct follow-up to ${task.assignedPerson || 'Lead Coordinator'}, and compress vendor review window to 48 hours.`,
    };
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    overallProgress,
    recoverySuggestions,
  };
}

/**
 * Smart Vendor Comparison Engine
 * Transparently compares user-provided or sample vendors and flags missing data.
 */
export function compareVendorsByCategory(
  vendors: VendorItem[],
  category: VendorCategoryName | 'All',
  eventBudget: number
) {
  const filtered =
    category === 'All' ? vendors : vendors.filter((v) => v.category === category);

  return filtered.map((vendor) => {
    const missingFields: string[] = [];
    if (!vendor.quotationAmount || vendor.quotationAmount <= 0) {
      missingFields.push('Quotation price not yet recorded');
    }
    if (vendor.availabilityStatus === 'Unknown' || !vendor.availabilityStatus) {
      missingFields.push('Date availability unconfirmed');
    }
    if (!vendor.contactEmailOrPhone || vendor.contactEmailOrPhone.trim() === '') {
      missingFields.push('Direct contact details missing');
    }
    if (!vendor.negotiationNotes || vendor.negotiationNotes.trim() === '') {
      missingFields.push('Inclusions / negotiation notes missing');
    }

    const budgetSharePercent =
      eventBudget > 0 && vendor.quotationAmount > 0
        ? Math.round((vendor.quotationAmount / eventBudget) * 1000) / 10
        : 0;

    // Composite value score out of 100
    const qualityPart = (vendor.serviceQualityScore / 5) * 40;
    const compatPart = (vendor.eventCompatibilityScore / 5) * 40;
    const availBonus =
      vendor.availabilityStatus === 'Available'
        ? 20
        : vendor.availabilityStatus === 'Tentative'
        ? 10
        : 0;
    const comparisonScore = Math.round(qualityPart + compatPart + availBonus);

    return {
      vendor,
      budgetSharePercent,
      comparisonScore,
      missingFields,
      advantages: [
        vendor.serviceQualityScore >= 4
          ? `High service rating (${vendor.serviceQualityScore}/5)`
          : 'Competitive entry-level option',
        vendor.eventCompatibilityScore >= 4
          ? `Strong style match (${vendor.eventCompatibilityScore}/5) for event theme`
          : 'Standard package coverage',
        vendor.availabilityStatus === 'Available'
          ? 'Confirmed available for event date'
          : `Status: ${vendor.availabilityStatus}`,
      ],
      disadvantages: [
        ...(missingFields.length > 0 ? [`Missing info: ${missingFields.join(', ')}`] : []),
        ...(budgetSharePercent > 28
          ? [`High budget concentration (${budgetSharePercent}% of total target budget)`]
          : []),
        ...(vendor.availabilityStatus !== 'Available'
          ? [`Availability is currently ${vendor.availabilityStatus}`]
          : []),
      ],
    };
  });
}

/**
 * Interactive Event Scenario Simulator Engine
 */
export function runScenarioSimulation(
  event: CelebrationEvent,
  input: ScenarioSimulationInput
): ScenarioSimulationResult {
  const summary = calculateBudgetSummary(event);
  const baseBudget = summary.totalAllocatedBudget;

  switch (input.type) {
    case 'guest_increase': {
      const targetGuests = input.newGuestCount ?? Math.round(event.guestCount * 1.25);
      const whatIf = simulateGuestCountChange(event, targetGuests);
      return {
        scenarioTitle: `Guest Count Shift: ${event.guestCount} → ${targetGuests} Guests`,
        budgetImpactDelta: whatIf.totalCostDelta,
        newProjectedBudget: whatIf.projectedTotalAllocated,
        timelineImpactSummary:
          'Requires finalizing catering plate counts and extra table seating layout 10 days earlier than baseline.',
        newTasksRequired: [
          `Confirm revised headcount (${targetGuests}) with Caterer and Venue Manager`,
          `Add ${Math.max(1, Math.ceil(Math.abs(whatIf.guestDelta) / 8))} dining table setups & floral centerpieces`,
          'Update shuttle boarding manifest and welcome kit quantities',
        ],
        vendorRequirementsImpact: [
          'Caterer: Increase prep & service staff ratio (1 server per 12 guests)',
          'Venue: Verify banquet hall / lawn fire-safety seating capacity',
          'Rentals: Order supplemental linen, cutlery, and seating',
        ],
        guestExperienceImpact:
          whatIf.guestDelta > 0
            ? 'Higher celebratory energy; requires wider buffet circulation lanes and 2 additional welcome drink servers to prevent arrival bottlenecks.'
            : 'More intimate spatial flow with higher per-guest hospitality budget headroom.',
        aiRecommendations: [
          `Approve a ${event.currencySymbol}${Math.abs(whatIf.totalCostDelta).toLocaleString()} adjustment across Food, Decor, and Rentals, or switch to high-efficiency family-style platters to absorb 40% of the increase.`,
          'Stagger guest arrival check-in across two welcome stations in the Moment Map.',
        ],
      };
    }

    case 'budget_reduction': {
      const cutPercent = input.budgetCutPercent ?? 15;
      const delta = -Math.round(baseBudget * (cutPercent / 100));
      return {
        scenarioTitle: `Budget Optimization: -${cutPercent}% Target Reduction`,
        budgetImpactDelta: delta,
        newProjectedBudget: baseBudget + delta,
        timelineImpactSummary:
          'Requires immediate vendor scope renegotiation within the next 7 days before final deposits lock.',
        newTasksRequired: [
          'Replace imported floral installations with seasonal local foliage & brass candlelight',
          'Consolidate multi-course buffet into curated signature stations',
          'Convert printed invitation suites to digital interactive RSVPs',
        ],
        vendorRequirementsImpact: [
          'Decorators: Shift to architectural warm lighting + local marigolds/greenery (-22% decor spend)',
          'Caterers: Streamline appetizer count from 10 to 6 high-impact dishes',
        ],
        guestExperienceImpact:
          'Preserves core hospitality warmth, music, and food quality while removing low-visibility decorative excess.',
        aiRecommendations: [
          `Protect Food & Catering quality and Photography; trim ${event.currencySymbol}${Math.abs(delta).toLocaleString()} primarily from non-core Decor, Invitations, and off-peak transport.`,
          'Keep your 5% Emergency Reserve intact.',
        ],
      };
    }

    case 'weather_disruption': {
      const severity = input.weatherSeverity ?? 'Heavy Rain / Monsoon';
      const weatherCost = Math.round(baseBudget * 0.08);
      return {
        scenarioTitle: `Weather Contingency: ${severity}`,
        budgetImpactDelta: weatherCost,
        newProjectedBudget: baseBudget + weatherCost,
        timelineImpactSummary:
          'Triggers 72-hour pre-event weather lock milestone and 4-hour earlier rigging schedule for waterproof marquee/flooring.',
        newTasksRequired: [
          'Reserve clear-span waterproof marquee tenting or indoor heritage hall backup',
          'Arrange elevated wooden sub-flooring and covered walkway canopies for Arrival stage',
          'Move sound & lighting consoles to weather-protected risers',
        ],
        vendorRequirementsImpact: [
          'Venue & Decor: Deploy waterproof canopy & non-slip mats across all guest walkways',
          'Power & AV: Add covered generator backup and moisture-sealed cable runs',
        ],
        guestExperienceImpact:
          'Cozy, dramatic candlelit canopy atmosphere if managed proactively; avoids wet footwear and delayed ceremony starts.',
        aiRecommendations: [
          `Allocate ${event.currencySymbol}${weatherCost.toLocaleString()} from Emergency Reserve for a 48-hour tenting hold option.`,
          'Update Moment Map Stage 1 (Arrival) with umbrella valets and hot मसाला chai / spiced cider welcome service.',
        ],
      };
    }

    case 'vendor_cancellation': {
      const cat = input.cancelledVendorCategory ?? 'Caterers';
      const emergencyPremium = Math.round(baseBudget * 0.06);
      return {
        scenarioTitle: `Last-Minute Vendor Replacement: ${cat}`,
        budgetImpactDelta: emergencyPremium,
        newProjectedBudget: baseBudget + emergencyPremium,
        timelineImpactSummary:
          'Critical path alert: 48-hour rapid replacement sprint using shortlisted backup vendors.',
        newTasksRequired: [
          `Contact #2 shortlisted ${cat} vendor immediately with locked brief`,
          'Review contract refund / force majeure clause on cancelled booking',
          'Brief replacement team on Moment Map run-of-show and venue load-in rules',
        ],
        vendorRequirementsImpact: [
          `${cat}: Activate backup shortlist option; expect ~6% rush onboarding adjustment`,
          'Venue Coordinator: Share existing floorplan and power layout to avoid re-survey delays',
        ],
        guestExperienceImpact:
          'Zero visible disruption to guests if backup vendor receives the structured GatherOS Event Blueprint and Moment Map.',
        aiRecommendations: [
          `Always maintain at least 2 compared vendors in "${cat}" within the Vendor Studio so a 1-click fallback is ready.`,
          'Use your documented quotation comparison notes to match the original package price.',
        ],
      };
    }

    case 'venue_change': {
      const style = input.venueStyle ?? 'Indoor Heritage Hall';
      const venueDelta = style === 'Indoor Heritage Hall' ? -Math.round(baseBudget * 0.04) : Math.round(baseBudget * 0.07);
      return {
        scenarioTitle: `Venue Pivot: Transition to ${style}`,
        budgetImpactDelta: venueDelta,
        newProjectedBudget: baseBudget + venueDelta,
        timelineImpactSummary:
          'Requires updating guest location pins, acoustic plan, and decorator floor measurements within 5 days.',
        newTasksRequired: [
          `Conduct site walkthrough at ${style} with Decorator and Sound Engineer`,
          'Send updated venue directions & parking map to confirmed RSVP guests',
          'Adjust lighting plot for indoor/outdoor ceiling height differences',
        ],
        vendorRequirementsImpact: [
          'Decorators: Re-scale entryway arch and stage backdrop dimensions',
          'AV/Entertainment: Recalibrate speaker placement for room acoustics',
        ],
        guestExperienceImpact:
          style === 'Indoor Heritage Hall'
            ? 'Climate-controlled comfort and grand architectural acoustics, immune to weather shifts.'
            : 'Open-air under-the-stars ambiance with expansive garden mingling zones.',
        aiRecommendations: [
          'Re-align Moment Map Stage 3 (First Impressions) to highlight the new venue entryway architecture.',
        ],
      };
    }

    case 'date_change': {
      const days = input.dateShiftDays ?? 14;
      const dateDelta = Math.round(baseBudget * 0.03);
      return {
        scenarioTitle: `Date Shift: Move Event by ${days > 0 ? `+${days}` : days} Days`,
        budgetImpactDelta: dateDelta,
        newProjectedBudget: baseBudget + dateDelta,
        timelineImpactSummary:
          `Shifts all booking, payment, and RSVP confirmation deadlines by ${days} days.`,
        newTasksRequired: [
          'Verify date transfer availability across all booked and shortlisted vendors',
          'Issue date-change notification to guest list and request updated RSVPs',
          'Update accommodation room block dates',
        ],
        vendorRequirementsImpact: [
          'All Booked Vendors: Request written date-transfer addendum without deposit forfeiture',
        ],
        guestExperienceImpact:
          'Out-of-town guests require immediate notice to adjust travel bookings without penalty.',
        aiRecommendations: [
          'Prioritize Venue, Caterer, and Photographer date confirmation before announcing the shift to guests.',
        ],
      };
    }

    case 'add_function':
    default: {
      const funcName = input.additionalFunctionName || 'Welcome Sundowner & Acoustic Mixer';
      const funcCost = Math.round(baseBudget * 0.14);
      return {
        scenarioTitle: `Add Sub-Event: ${funcName}`,
        budgetImpactDelta: funcCost,
        newProjectedBudget: baseBudget + funcCost,
        timelineImpactSummary:
          'Adds a 3-hour pre-event hospitality block requiring separate menu, acoustic setup, and attire brief.',
        newTasksRequired: [
          `Finalize venue lawn/terrace zone for ${funcName}`,
          'Select passed tapas/chaat & craft mocktail/cocktail menu',
          'Book acoustic duo and warm festoon lighting',
        ],
        vendorRequirementsImpact: [
          'Caterers: Add 90-minute high-tea or sundowner grazing table',
          'Photographers: Add 2 hours of candid pre-event coverage',
        ],
        guestExperienceImpact:
          'Breaks the ice effortlessly so guests already know each other before the main celebration begins.',
        aiRecommendations: [
          `Repurpose floral & lantern elements from "${funcName}" into the main reception dining area to save 30% on decor.`,
        ],
      };
    }
  }
}

/**
 * Pure CSV Export Serializer for Guest List
 */
export function exportGuestsToCsv(guests: GuestItem[]): string {
  const headers = [
    'Full Name',
    'Group',
    'Invitation Sent',
    'RSVP Status',
    'Attending Count',
    'Dietary Preferences',
    'Notes',
  ];

  const escapeCsvCell = (val: string | number | boolean | undefined): string => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = guests.map((g) =>
    [
      escapeCsvCell(g.fullName),
      escapeCsvCell(g.group),
      escapeCsvCell(g.invitationSent ? 'Yes' : 'No'),
      escapeCsvCell(g.rsvpStatus),
      escapeCsvCell(g.attendingCount),
      escapeCsvCell(g.dietaryPreferences),
      escapeCsvCell(g.notes ?? ''),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
