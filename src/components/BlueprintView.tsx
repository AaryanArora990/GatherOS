import React, { useState } from 'react';
import { Check, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { CelebrationEvent, TimelineTask } from '../types/gatheros';
import { calculateBudgetSummary } from '../utils/planningEngine';

interface BlueprintViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
  onNavigateTab: (tab: string) => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  event,
  onUpdateEvent,
  onNavigateTab,
}) => {
  const [addedChecklistItems, setAddedChecklistItems] = useState<Record<string, boolean>>({});
  const [isRegenerating, setIsRegenerating] = useState(false);

  const budget = calculateBudgetSummary(event);
  const { blueprint } = event;

  const handleAddChecklistToTimeline = (itemText: string, index: number) => {
    const key = `${index}-${itemText}`;
    if (addedChecklistItems[key]) return;

    const newTask: TimelineTask = {
      id: `bp-task-${Date.now()}-${index}`,
      title: itemText,
      milestoneCategory: 'Preparation milestone',
      dueDate: event.date,
      priority: 'High',
      status: 'Pending',
      assignedPerson: 'Lead Organizer',
      progress: 0,
      notes: 'Added directly from AI Celebration Blueprint Priority Checklist',
    };

    onUpdateEvent({
      ...event,
      timelineTasks: [newTask, ...event.timelineTasks],
    });
    setAddedChecklistItems((prev) => ({ ...prev, [key]: true }));
  };

  const handleRegenerateBlueprint = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      if (data.blueprint) {
        onUpdateEvent({
          ...event,
          blueprint: data.blueprint,
        });
      }
    } catch (err) {
      console.error('Error regenerating blueprint:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            STRUCTURED 14-PART CELEBRATION BLUEPRINT · {event.isDemo ? 'DEMO DATA' : 'CUSTOM EVENT'}
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            {event.name} — Event Blueprint
          </h1>
          <div className="text-xs text-[#4A4F4C] mt-1">
            {event.location} · {event.guestCount} Guests · Target Budget: {event.currencySymbol}
            {event.targetBudget.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRegenerateBlueprint}
            disabled={isRegenerating}
            className="px-4 py-2 text-xs font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Refreshing Blueprint...' : 'Regenerate AI Blueprint'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('copilot')}
            className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6CFA0]" />
            <span>Refine in Gather AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Why AI Chose This + Concept Banner */}
      <div className="bg-[#143326] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#2D5A44] grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs text-[#E6CFA0] font-mono-num">
            A. EVENT CONCEPT & B. PERSONALIZED THEME
          </div>
          <h2 className="font-serif-display text-2xl font-medium text-[#FAF8F5]">
            {blueprint.personalizedTheme}
          </h2>
          <p className="text-sm text-[#FAF8F5]/85 leading-relaxed">{blueprint.eventConcept}</p>
        </div>

        <div className="lg:col-span-5 bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-[#E6CFA0] mb-2">
              Why These Suggestions Match Your Event & Constraints
            </div>
            <p className="text-xs text-[#FAF8F5]/90 leading-relaxed">{blueprint.whyItMatches}</p>
          </div>
          <div className="pt-3 mt-3 border-t border-[#FAF8F5]/15 text-xs text-[#FAF8F5]/75">
            Restrictions Honored: {event.restrictionsOrRequirements}
          </div>
        </div>
      </div>

      {/* C. Color Palette Swatches */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">C. CURATED COLOR PALETTE</div>
        <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Editorial Palette & Material Direction
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {blueprint.colorPalette.map((swatch) => (
            <div
              key={swatch.name}
              className="border border-[#E4DFD7] rounded-lg p-3.5 bg-[#FAF8F5] flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-full h-14 rounded-md border border-black/10 mb-3"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#143326]">{swatch.name}</span>
                  <span className="text-xs font-mono-num text-[#5A605D]">{swatch.hex}</span>
                </div>
              </div>
              <p className="text-xs text-[#4A4F4C] mt-2 leading-snug">{swatch.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* D, E, F, G, H Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            D. DECORATION RECOMMENDATIONS
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
            Spatial Styling, Botanicals & Lighting
          </h3>
          <ul className="space-y-2.5 text-sm text-[#3D4340]">
            {blueprint.decorationRecommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                · {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">E. VENUE CONSIDERATIONS</div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
            Architecture, Capacity & Flow ({event.location})
          </h3>
          <ul className="space-y-2.5 text-sm text-[#3D4340]">
            {blueprint.venueConsiderations.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                · {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            F. FOOD & CATERING RECOMMENDATIONS
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
            Culinary Architecture & Dietary Care
          </h3>
          <ul className="space-y-2.5 text-sm text-[#3D4340]">
            {blueprint.foodAndCateringRecommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                · {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            G. ENTERTAINMENT & H. GUEST EXPERIENCE
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
            Music, Performance & Hospitality Touchpoints
          </h3>
          <ul className="space-y-2 text-sm text-[#3D4340] mb-4">
            {blueprint.entertainmentSuggestions.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                · {rec}
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-[#E4DFD7]">
            <div className="text-xs font-semibold text-[#143326] mb-2">Signature Guest Moments:</div>
            <ul className="space-y-1.5 text-xs text-[#4A4F4C]">
              {blueprint.guestExperienceIdeas.map((idea, i) => (
                <li key={i}>· {idea}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* I. Budget Snapshot, J. Timeline Link, K. Vendor Categories, L. Priority Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            L. PRIORITY EXECUTION CHECKLIST (AI ACTIONABLE)
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
            Convert Blueprint Priorities Directly into Timeline Tasks
          </h3>
          <div className="space-y-3">
            {blueprint.priorityChecklist.map((item, idx) => {
              const key = `${idx}-${item}`;
              const isAdded = Boolean(addedChecklistItems[key]);
              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E4DFD7]"
                >
                  <span className="text-sm text-[#1C1E1D]">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleAddChecklistToTimeline(item, idx)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                      isAdded
                        ? 'bg-[#E6F4EA] text-[#137333]'
                        : 'bg-[#1B4332] text-[#FAF8F5] hover:bg-[#143326]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Timeline</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Timeline</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
              I. ESTIMATED BUDGET & K. VENDOR CATEGORIES
            </div>
            <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
              Financial & Vendor Alignment
            </h3>
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E4DFD7] space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#5A605D]">Target Budget:</span>
                <span className="font-mono-num font-semibold text-[#143326]">
                  {event.currencySymbol}
                  {event.targetBudget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5A605D]">Total Category Allocations:</span>
                <span className="font-mono-num font-semibold text-[#143326]">
                  {event.currencySymbol}
                  {budget.totalAllocatedBudget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5A605D]">Remaining vs Actual:</span>
                <span className="font-mono-num font-semibold text-[#1B4332]">
                  {event.currencySymbol}
                  {budget.remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-xs font-semibold text-[#143326] mb-2">
              Required Vendor Categories ({blueprint.vendorCategoriesNeeded.length}):
            </div>
            <p className="text-xs text-[#4A4F4C] leading-relaxed">
              {blueprint.vendorCategoriesNeeded.join(' · ')}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#E4DFD7]">
            <button
              type="button"
              onClick={() => onNavigateTab('budget')}
              className="px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg cursor-pointer"
            >
              Inspect Smart Budget
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('vendors')}
              className="px-3.5 py-2 text-xs font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded-lg cursor-pointer"
            >
              Open Vendor Studio
            </button>
          </div>
        </div>
      </div>

      {/* M. Risk & Contingency & N. Personalized Strategic Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            M. RISK & CONTINGENCY CONSIDERATIONS
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
            Proactive Operational Safeguards
          </h3>
          <ul className="space-y-2.5 text-sm text-[#3D4340]">
            {blueprint.riskAndContingency.map((risk, i) => (
              <li key={i} className="leading-relaxed">
                · {risk}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            N. PERSONALIZED STRATEGIC RECOMMENDATIONS
          </div>
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-3">
            High-Leverage Planning Insights
          </h3>
          <ul className="space-y-2.5 text-sm text-[#3D4340]">
            {blueprint.personalizedRecommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                · {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
