import React, { useState } from 'react';
import {
  Check,
  CloudRain,
  Plus,
  Sliders,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  ALL_VENDOR_CATEGORIES,
  BudgetExpenseItem,
  CelebrationEvent,
  ScenarioSimulationInput,
  ScenarioType,
  TimelineTask,
  VendorCategoryName,
} from '../types/gatheros';
import { calculateBudgetSummary, runScenarioSimulation } from '../utils/planningEngine';

interface ScenarioSimulatorViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

const SCENARIO_TABS: Array<{ id: ScenarioType; label: string }> = [
  { id: 'guest_increase', label: 'Increased Guest Count' },
  { id: 'budget_reduction', label: 'Reduced Budget' },
  { id: 'weather_disruption', label: 'Weather Disruption' },
  { id: 'vendor_cancellation', label: 'Vendor Cancellation' },
  { id: 'venue_change', label: 'Venue Change' },
  { id: 'date_change', label: 'Date Shift' },
  { id: 'add_function', label: 'Add Event Function' },
];

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({
  event,
  onUpdateEvent,
}) => {
  const [scenarioType, setScenarioType] = useState<ScenarioType>('guest_increase');
  const [newGuestCount, setNewGuestCount] = useState<number>(event.guestCount + 40);
  const [budgetCutPercent, setBudgetCutPercent] = useState<number>(15);
  const [weatherSeverity, setWeatherSeverity] =
    useState<ScenarioSimulationInput['weatherSeverity']>('Heavy Rain / Monsoon');
  const [cancelledVendorCategory, setCancelledVendorCategory] =
    useState<VendorCategoryName>('Caterers');
  const [venueStyle, setVenueStyle] =
    useState<ScenarioSimulationInput['venueStyle']>('Indoor Heritage Hall');
  const [dateShiftDays, setDateShiftDays] = useState<number>(14);
  const [additionalFunctionName, setAdditionalFunctionName] = useState<string>(
    'Welcome Sundowner & Acoustic Mixer'
  );
  const [appliedConfirmation, setAppliedConfirmation] = useState<string | null>(null);

  const summary = calculateBudgetSummary(event);
  const simResult = runScenarioSimulation(event, {
    type: scenarioType,
    newGuestCount,
    budgetCutPercent,
    weatherSeverity,
    cancelledVendorCategory,
    venueStyle,
    dateShiftDays,
    additionalFunctionName,
  });

  const handleConfirmAndApplyScenario = () => {
    const newTasks: TimelineTask[] = simResult.newTasksRequired.map((tTitle, idx) => ({
      id: `sim-t-${Date.now()}-${idx}`,
      title: `[Scenario Applied] ${tTitle}`,
      milestoneCategory: 'Preparation milestone',
      dueDate: event.date,
      priority: 'High',
      status: 'Pending',
      assignedPerson: 'Lead Organizer',
      progress: 0,
      notes: `Generated from Scenario Simulator: ${simResult.scenarioTitle}`,
    }));

    let updatedBudgetItems = [...event.budgetItems];
    if (simResult.budgetImpactDelta !== 0) {
      const adjustmentItem: BudgetExpenseItem = {
        id: `sim-b-${Date.now()}`,
        category:
          scenarioType === 'weather_disruption' ? 'Emergency reserve' : 'Miscellaneous',
        title: `Scenario Adjustment: ${simResult.scenarioTitle}`,
        allocatedAmount: Math.max(0, simResult.budgetImpactDelta),
        plannedAmount: Math.max(0, simResult.budgetImpactDelta),
        vendorQuotationAmount: 0,
        actualAmount: 0,
        paidAmount: 0,
        isCommitted: false,
        isAiEstimate: true,
        estimateAssumptions: `Applied after explicit user confirmation in Event Scenario Simulator.`,
      };
      if (simResult.budgetImpactDelta > 0) {
        updatedBudgetItems = [adjustmentItem, ...updatedBudgetItems];
      }
    }

    onUpdateEvent({
      ...event,
      guestCount:
        scenarioType === 'guest_increase' ? newGuestCount : event.guestCount,
      budgetItems: updatedBudgetItems,
      timelineTasks: [...newTasks, ...event.timelineTasks],
    });

    setAppliedConfirmation(
      `Applied "${simResult.scenarioTitle}" — added ${newTasks.length} action tasks to your Timeline.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            ADVANCED FEATURE · INTERACTIVE EVENT SCENARIO SIMULATOR
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Stress-Test & What-If Scenario Studio — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            Simulate disruptions or scope changes safely. Your active celebration plan is never overwritten without your explicit confirmation.
          </p>
        </div>
      </div>

      {/* 7 Scenario Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {SCENARIO_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setScenarioType(tab.id);
              setAppliedConfirmation(null);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              scenarioType === tab.id
                ? 'bg-[#1B4332] text-[#FAF8F5] border-[#1B4332]'
                : 'bg-white text-[#3D4340] border-[#D8D1C5] hover:bg-[#F3EFEA]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Parameter Control Panel + Simulation Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scenario Parameter Controls */}
        <div className="lg:col-span-5 bg-white border border-[#E4DFD7] rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B]">
              <Sliders className="w-4 h-4" />
              <span>SCENARIO INPUT CONTROLS</span>
            </div>
            <h2 className="font-serif-display text-xl font-medium text-[#143326]">
              Configure Simulation Parameters
            </h2>

            {scenarioType === 'guest_increase' && (
              <div>
                <label
                  htmlFor="sim-guest-input"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  Simulated Guest Count (Current: {event.guestCount})
                </label>
                <input
                  id="sim-guest-input"
                  type="number"
                  min={10}
                  max={5000}
                  value={newGuestCount}
                  onChange={(e) => setNewGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>
            )}

            {scenarioType === 'budget_reduction' && (
              <div>
                <label
                  htmlFor="sim-budget-cut-input"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  Target Budget Reduction Percentage ({budgetCutPercent}%)
                </label>
                <input
                  id="sim-budget-cut-input"
                  type="range"
                  min={5}
                  max={35}
                  step={5}
                  value={budgetCutPercent}
                  onChange={(e) => setBudgetCutPercent(Number(e.target.value))}
                  className="w-full accent-[#1B4332] cursor-pointer"
                />
              </div>
            )}

            {scenarioType === 'weather_disruption' && (
              <div>
                <label
                  htmlFor="sim-weather-select"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  Weather Condition to Simulate
                </label>
                <select
                  id="sim-weather-select"
                  value={weatherSeverity}
                  onChange={(e) =>
                    setWeatherSeverity(
                      e.target.value as ScenarioSimulationInput['weatherSeverity']
                    )
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                >
                  <option value="Heavy Rain / Monsoon">Heavy Rain / Unseasonal Monsoon</option>
                  <option value="Extreme Heatwave">Afternoon Heatwave</option>
                  <option value="High Winds">High Courtyard Winds / Dust</option>
                </select>
              </div>
            )}

            {scenarioType === 'vendor_cancellation' && (
              <div>
                <label
                  htmlFor="sim-vendor-cancel-select"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  Vendor Category Experiencing Cancellation
                </label>
                <select
                  id="sim-vendor-cancel-select"
                  value={cancelledVendorCategory}
                  onChange={(e) =>
                    setCancelledVendorCategory(e.target.value as VendorCategoryName)
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                >
                  {ALL_VENDOR_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scenarioType === 'venue_change' && (
              <div>
                <label
                  htmlFor="sim-venue-style-select"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  Alternative Venue Setting
                </label>
                <select
                  id="sim-venue-style-select"
                  value={venueStyle}
                  onChange={(e) =>
                    setVenueStyle(e.target.value as ScenarioSimulationInput['venueStyle'])
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                >
                  <option value="Indoor Heritage Hall">Indoor Heritage Hall</option>
                  <option value="Outdoor Botanical Lawn">Outdoor Botanical Lawn</option>
                  <option value="Boutique Civic Pavilion">Boutique Civic Pavilion</option>
                </select>
              </div>
            )}

            {scenarioType === 'date_change' && (
              <div>
                <label
                  htmlFor="sim-date-shift-input"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  Shift Event Date by Days (+/-)
                </label>
                <input
                  id="sim-date-shift-input"
                  type="number"
                  value={dateShiftDays}
                  onChange={(e) => setDateShiftDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>
            )}

            {scenarioType === 'add_function' && (
              <div>
                <label
                  htmlFor="sim-add-func-input"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  New Sub-Function Title
                </label>
                <input
                  id="sim-add-func-input"
                  type="text"
                  value={additionalFunctionName}
                  onChange={(e) => setAdditionalFunctionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4DFD7] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A605D]">Current Allocated Baseline:</span>
                <span className="font-mono-num font-semibold text-[#143326]">
                  {event.currencySymbol}
                  {summary.totalAllocatedBudget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A605D]">Simulated Budget Impact:</span>
                <span
                  className={`font-mono-num font-semibold ${
                    simResult.budgetImpactDelta > 0 ? 'text-[#B45309]' : 'text-[#137333]'
                  }`}
                >
                  {simResult.budgetImpactDelta >= 0 ? '+' : ''}
                  {event.currencySymbol}
                  {simResult.budgetImpactDelta.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E4DFD7]">
                <span className="font-semibold text-[#143326]">Projected Total Budget:</span>
                <span className="font-mono-num font-semibold text-[#143326]">
                  {event.currencySymbol}
                  {simResult.newProjectedBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4DFD7] space-y-3">
            {appliedConfirmation && (
              <div className="p-3 rounded-lg bg-[#E6F4EA] text-[#137333] text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{appliedConfirmation}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirmAndApplyScenario}
              className="w-full py-3 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Confirm & Apply Scenario Tasks to Plan</span>
            </button>
          </div>
        </div>

        {/* Right: Multi-Dimensional Impact Analysis */}
        <div className="lg:col-span-7 bg-[#143326] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#2D5A44] space-y-6">
          <div>
            <div className="text-xs font-mono-num text-[#E6CFA0] mb-1">
              MULTI-DIMENSIONAL IMPACT PROJECTION
            </div>
            <h2 className="font-serif-display text-2xl font-medium text-[#FAF8F5]">
              {simResult.scenarioTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-4">
              <div className="text-xs font-semibold text-[#E6CFA0] mb-1">
                1. Timeline & Schedule Effect
              </div>
              <p className="text-xs text-[#FAF8F5]/90 leading-relaxed">
                {simResult.timelineImpactSummary}
              </p>
            </div>

            <div className="bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-4">
              <div className="text-xs font-semibold text-[#E6CFA0] mb-1">
                2. Guest Experience Effect
              </div>
              <p className="text-xs text-[#FAF8F5]/90 leading-relaxed">
                {simResult.guestExperienceImpact}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-4">
              <div className="text-xs font-semibold text-[#E6CFA0] mb-2">
                3. New Task Requirements
              </div>
              <ul className="space-y-1.5 text-xs text-[#FAF8F5]/90">
                {simResult.newTasksRequired.map((t, i) => (
                  <li key={i}>· {t}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-4">
              <div className="text-xs font-semibold text-[#E6CFA0] mb-2">
                4. Vendor Requirements Impact
              </div>
              <ul className="space-y-1.5 text-xs text-[#FAF8F5]/90">
                {simResult.vendorRequirementsImpact.map((v, i) => (
                  <li key={i}>· {v}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#1B4332] border border-[#E6CFA0]/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E6CFA0] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Strategic Mitigation Recommendations</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#FAF8F5]/95">
              {simResult.aiRecommendations.map((rec, i) => (
                <li key={i}>· {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
