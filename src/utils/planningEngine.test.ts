import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBudgetSummary,
  runBudgetRealityCheck,
  simulateGuestCountChange,
  analyzeTimelineHealth,
  compareVendorsByCategory,
  runScenarioSimulation,
  exportGuestsToCsv,
} from './planningEngine';
import { CelebrationEvent } from '../types/gatheros';

const mockEvent: CelebrationEvent = {
  id: 'test-wedding-1',
  name: 'Test Jaipur Wedding',
  category: 'wedding',
  date: '2026-12-15',
  location: 'Jaipur, Rajasthan',
  guestCount: 180,
  targetBudget: 850000,
  currency: 'INR',
  currencySymbol: '₹',
  preferredTheme: 'Royal Heritage Courtyard',
  culturalPreferences: 'Traditional Rajasthani & Marwari customs',
  mustHaveExperiences: 'Folk welcome, live chaat counter, phere under stars',
  restrictionsOrRequirements: 'Pure vegetarian menu',
  planningPriorities: ['Venue', 'Food and catering', 'Decoration'],
  isDemo: true,
  blueprint: {
    eventConcept: 'Heritage courtyard celebration',
    personalizedTheme: 'Amber & Emerald Haveli Twilight',
    colorPalette: [{ name: 'Forest', hex: '#1B4332', usage: 'Primary' }],
    decorationRecommendations: ['Brass lanterns'],
    venueConsiderations: ['Haveli courtyard'],
    foodAndCateringRecommendations: ['Dal Baati Churma'],
    entertainmentSuggestions: ['Manganiyar folk ensemble'],
    guestExperienceIdeas: ['Ittar welcome'],
    vendorCategoriesNeeded: ['Venues', 'Caterers'],
    priorityChecklist: ['Lock venue'],
    riskAndContingency: ['Dew protection'],
    personalizedRecommendations: ['Book early'],
    whyItMatches: 'Fits 180 guests within ₹8.5L.',
  },
  budgetItems: [
    {
      id: 'b1',
      category: 'Venue',
      title: 'Haveli Courtyard Rental',
      allocatedAmount: 250000,
      plannedAmount: 250000,
      vendorQuotationAmount: 260000,
      actualAmount: 255000,
      paidAmount: 150000,
      isCommitted: true,
      isAiEstimate: false,
    },
    {
      id: 'b2',
      category: 'Food and catering',
      title: 'Royal Vegetarian Feast',
      allocatedAmount: 300000,
      plannedAmount: 320000,
      vendorQuotationAmount: 315000,
      actualAmount: 310000,
      paidAmount: 100000,
      isCommitted: true,
      isAiEstimate: false,
    },
    {
      id: 'b3',
      category: 'Decoration',
      title: 'Marigold & Brass Lantern Decor',
      allocatedAmount: 150000,
      plannedAmount: 160000,
      vendorQuotationAmount: 165000,
      actualAmount: 140000,
      paidAmount: 70000,
      isCommitted: true,
      isAiEstimate: true,
    },
    {
      id: 'b4',
      category: 'Photography',
      title: 'Documentary Wedding Cinema',
      allocatedAmount: 150000,
      plannedAmount: 150000,
      vendorQuotationAmount: 150000,
      actualAmount: 150000,
      paidAmount: 50000,
      isCommitted: true,
      isAiEstimate: false,
    },
  ],
  timelineTasks: [
    {
      id: 't1',
      title: 'Lock Haveli Venue Deposit',
      milestoneCategory: 'Booking deadline',
      dueDate: '2026-10-01',
      priority: 'High',
      status: 'Completed',
      assignedPerson: 'Aarav',
      progress: 100,
    },
    {
      id: 't2',
      title: 'Finalize Catering Tasting Menu',
      milestoneCategory: 'Catering finalization',
      dueDate: '2026-10-15',
      priority: 'High',
      status: 'Pending',
      assignedPerson: 'Meera',
      progress: 40,
    },
  ],
  vendors: [
    {
      id: 'v1',
      name: 'Samode Heritage Courtyard [DEMO]',
      category: 'Venues',
      contactName: 'Rajesh Rathore',
      contactEmailOrPhone: '+91 98290 00001',
      location: 'Jaipur Old City',
      quotationAmount: 255000,
      bookingStatus: 'Booked',
      paymentStatus: 'Deposit Paid',
      serviceQualityScore: 5,
      eventCompatibilityScore: 5,
      availabilityStatus: 'Available',
      negotiationNotes: 'Includes courtyard lighting and bridal room',
      isSampleDemoData: true,
    },
    {
      id: 'v2',
      name: 'Unconfirmed Lawn Option [DEMO]',
      category: 'Venues',
      contactName: 'Vikram',
      contactEmailOrPhone: '',
      location: 'Amer Road',
      quotationAmount: 0,
      bookingStatus: 'Researching',
      paymentStatus: 'Unpaid',
      serviceQualityScore: 3,
      eventCompatibilityScore: 4,
      availabilityStatus: 'Unknown',
      negotiationNotes: '',
      isSampleDemoData: true,
    },
  ],
  guests: [
    {
      id: 'g1',
      fullName: 'Rohan Sharma, Sr.',
      group: 'Family',
      invitationSent: true,
      rsvpStatus: 'Confirmed',
      attendingCount: 4,
      dietaryPreferences: 'Jain Vegetarian',
      notes: 'Arriving early morning',
    },
  ],
  ideas: [],
  momentMap: [],
  copilotHistory: [],
};

test('calculateBudgetSummary enforces TOTAL BUDGET = SUM OF ALLOCATIONS and REMAINING = TOTAL - ACTUAL', () => {
  const summary = calculateBudgetSummary(mockEvent);
  // Sum of allocations: 250000 + 300000 + 150000 + 150000 = 850000
  assert.equal(summary.totalAllocatedBudget, 850000);
  // Sum of actuals: 255000 + 310000 + 140000 + 150000 = 855000
  assert.equal(summary.actualExpenses, 855000);
  // Remaining budget: 850000 - 855000 = -5000
  assert.equal(summary.remainingBudget, -5000);
  // Paid expenses: 150000 + 100000 + 70000 + 50000 = 370000
  assert.equal(summary.paidExpenses, 370000);
  // Outstanding: 855000 - 370000 = 485000
  assert.equal(summary.outstandingPayments, 485000);
  assert.equal(summary.isActualExceedingAllocated, true);
});

test('runBudgetRealityCheck detects overspending categories and computes savings', () => {
  const check = runBudgetRealityCheck(mockEvent);
  assert.equal(check.isExceeding, true);
  assert.ok(check.overspendingCategories.length >= 2);
  const foodCheck = check.overspendingCategories.find((c) => c.category === 'Food and catering');
  assert.ok(foodCheck);
  assert.ok(foodCheck.savingsAmount > 0);
});

test('simulateGuestCountChange scales per-guest variable costs while keeping fixed costs constant', () => {
  const sim = simulateGuestCountChange(mockEvent, 220);
  assert.equal(sim.originalGuestCount, 180);
  assert.equal(sim.newGuestCount, 220);
  assert.equal(sim.guestDelta, 40);
  assert.ok(sim.totalCostDelta > 0);

  const foodDelta = sim.categoryDeltas.find((c) => c.category === 'Food and catering');
  const photoDelta = sim.categoryDeltas.find((c) => c.category === 'Photography');
  assert.ok(foodDelta && foodDelta.delta > 0);
  assert.ok(photoDelta && photoDelta.delta === 0);
});

test('analyzeTimelineHealth flags overdue tasks and proposes recovery dates', () => {
  const health = analyzeTimelineHealth(mockEvent.timelineTasks, '2026-10-30');
  assert.equal(health.totalTasks, 2);
  assert.equal(health.completedTasks, 1);
  assert.equal(health.overdueTasks.length, 1);
  assert.equal(health.overdueTasks[0].id, 't2');
  assert.equal(health.recoverySuggestions.length, 1);
});

test('compareVendorsByCategory identifies missing vendor information transparently', () => {
  const compared = compareVendorsByCategory(mockEvent.vendors, 'Venues', 850000);
  assert.equal(compared.length, 2);
  assert.equal(compared[0].missingFields.length, 0);
  assert.ok(compared[1].missingFields.length >= 3);
});

test('runScenarioSimulation models weather disruption and guest count changes without mutating input', () => {
  const res = runScenarioSimulation(mockEvent, {
    type: 'weather_disruption',
    weatherSeverity: 'Heavy Rain / Monsoon',
  });
  assert.ok(res.budgetImpactDelta > 0);
  assert.equal(mockEvent.targetBudget, 850000);
});

test('exportGuestsToCsv properly escapes commas and quotes in guest records', () => {
  const csv = exportGuestsToCsv(mockEvent.guests);
  assert.ok(csv.includes('"Rohan Sharma, Sr."'));
  assert.ok(csv.includes('Jain Vegetarian'));
});
