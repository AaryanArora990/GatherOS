import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Video,
} from 'lucide-react';
import { CelebrationEvent } from '../types/gatheros';

interface PresentationModeViewProps {
  activeEvent: CelebrationEvent;
  allEvents: CelebrationEvent[];
  aiStatus: { configured: boolean; provider: string; model: string; mode: string };
  onSelectEvent: (eventId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewEventModal: () => void;
  onResetDemoData: () => Promise<void>;
}

const WALKTHROUGH_STEPS = [
  {
    step: 1,
    title: 'Event Creation & Progressive Onboarding',
    targetTab: 'onboarding',
    talkingPoint:
      'Demonstrate how GatherOS adapts onboarding fields dynamically for Weddings, Birthdays, and Community Festivals—and generates a 14-part Celebration Blueprint.',
  },
  {
    step: 2,
    title: 'Structured 14-Part AI Celebration Blueprint',
    targetTab: 'blueprint',
    talkingPoint:
      'Show the tailored theme, color palette swatches, vegetarian/Jain menu strategy, risk safeguards, and explicit explanation of WHY each recommendation fits the budget.',
  },
  {
    step: 3,
    title: 'Gather AI Copilot with 1-Click Actions',
    targetTab: 'copilot',
    talkingPoint:
      'Ask "How can I reduce my expenses?" or "What if my guest count increases?" and click an AI Action button to add tasks or budget items directly to the live workspace.',
  },
  {
    step: 4,
    title: 'Smart Budget Reality Check & What-If Simulator',
    targetTab: 'budget',
    talkingPoint:
      'Walk through the 10-category ledger (TOTAL = SUM OF ALLOCATIONS; REMAINING = TOTAL - ACTUAL), run the Budget Reality Check, and drag the Guest Count slider from 180 to 220.',
  },
  {
    step: 5,
    title: 'Timeline Intelligence & Transparent Vendor Studio',
    targetTab: 'vendors',
    talkingPoint:
      'Compare sample vendor quotations side by side with missing information automatically flagged, and show overdue milestone recovery in Timeline Intelligence.',
  },
  {
    step: 6,
    title: 'Signature Differentiator: The 8-Stage Moment Map',
    targetTab: 'moment-map',
    talkingPoint:
      'Highlight how GatherOS plans the emotional guest journey from Arrival and Welcome to Highlight Moment and Farewell—with backup arrangements at every stage.',
  },
  {
    step: 7,
    title: 'Interactive Event Scenario Simulator',
    targetTab: 'simulator',
    talkingPoint:
      'Simulate a Heavy Rain / Monsoon disruption or Vendor Cancellation without overwriting the original plan until confirmed.',
  },
];

export const PresentationModeView: React.FC<PresentationModeViewProps> = ({
  activeEvent,
  allEvents,
  aiStatus,
  onSelectEvent,
  onNavigateTab,
  onOpenNewEventModal,
  onResetDemoData,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    setResetSuccess(false);
    await onResetDemoData();
    setIsResetting(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#143326] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#2D5A44] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono-num text-[#E6CFA0] mb-2">
            <Video className="w-4 h-4" />
            <span>INNOVATION CHALLENGE PRESENTATION & DEMO STUDIO</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#FAF8F5] mb-2">
            Live Evaluation & Guided Product Walkthrough
          </h1>
          <p className="text-sm text-[#FAF8F5]/85 leading-relaxed">
            Switch seamlessly across all three pre-loaded fictional celebration datasets (Wedding, Birthday, Community Festival), follow the 7-step live demonstration script, or reset all demo data to its clean starting state in one click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="px-4 py-2.5 text-xs font-semibold text-[#143326] bg-[#E6CFA0] hover:bg-[#D4B475] rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting Demo Data...' : 'Reset All Demo Data'}</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#CEEAD6] text-xs font-medium text-[#137333] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            All three demonstration events (Jaipur Wedding, 40th Botanical Soirée, Oakwood Harvest Festival) have been restored to their clean initial state.
          </span>
        </div>
      )}

      {/* Three Fictional Demo Datasets Switcher */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
          PRE-LOADED FICTIONAL DEMONSTRATION DATASETS (CLEARLY LABELLED DEMO DATA)
        </div>
        <h2 className="font-serif-display text-xl font-medium text-[#143326] mb-4">
          Select Active Demonstration Celebration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allEvents
            .filter((e) => e.isDemo)
            .map((demoEv) => {
              const isSelected = demoEv.id === activeEvent.id;
              return (
                <div
                  key={demoEv.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#143326] text-[#FAF8F5] border-[#143326]'
                      : 'bg-[#FAF8F5] text-[#1C1E1D] border-[#E4DFD7]'
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-mono-num mb-1 ${
                        isSelected ? 'text-[#E6CFA0]' : 'text-[#8A6D3B]'
                      }`}
                    >
                      DEMO DATA · {demoEv.category.toUpperCase()}
                    </div>
                    <h3 className="font-serif-display text-lg font-medium mb-1">
                      {demoEv.name}
                    </h3>
                    <p
                      className={`text-xs mb-4 ${
                        isSelected ? 'text-[#FAF8F5]/80' : 'text-[#4A4F4C]'
                      }`}
                    >
                      {demoEv.location} · {demoEv.guestCount} Guests · Budget:{' '}
                      {demoEv.currencySymbol}
                      {demoEv.targetBudget.toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectEvent(demoEv.id)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E6CFA0] text-[#143326]'
                        : 'bg-[#1B4332] text-[#FAF8F5] hover:bg-[#143326]'
                    }`}
                  >
                    {isSelected ? 'Currently Active Dataset' : 'Load This Demo Dataset'}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* 7-Step Guided Product Walkthrough */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
          INTERACTIVE 7-STEP VIDEO & JURY WALKTHROUGH
        </div>
        <h2 className="font-serif-display text-xl font-medium text-[#143326] mb-4">
          Guided Product Demonstration Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WALKTHROUGH_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E4DFD7] flex flex-col justify-between gap-4"
            >
              <div>
                <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
                  WALKTHROUGH STEP 0{item.step}
                </div>
                <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4A4F4C] leading-relaxed">{item.talkingPoint}</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  item.targetTab === 'onboarding'
                    ? onOpenNewEventModal()
                    : onNavigateTab(item.targetTab)
                }
                className="self-start px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Launch Step 0{item.step}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Honest AI Provider Configuration Status Card */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B] mb-1">
          <Sparkles className="w-4 h-4" />
          <span>HONEST AI CREDENTIAL & PROVIDER TRANSPARENCY</span>
        </div>
        <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
          Server-Side Generative AI Configuration
        </h3>
        <p className="text-xs text-[#4A4F4C] leading-relaxed mb-3">
          Current Status:{' '}
          <span className="font-semibold text-[#143326]">
            {aiStatus.configured
              ? `Configured (${aiStatus.provider} · ${aiStatus.model})`
              : 'Preview / Contextual Fallback Mode (No API key detected)'}
          </span>
        </p>
        <p className="text-xs text-[#5A605D] leading-relaxed">
          GatherOS handles all AI requests strictly on the server side (`server.ts`) using environment variables (`GEMINI_API_KEY`, `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`). When an API key is unavailable or quota-limited, GatherOS transparently informs you and uses its deterministic Contextual Planning Engine so every feature remains 100% interactive and testable.
        </p>
      </div>
    </div>
  );
};
