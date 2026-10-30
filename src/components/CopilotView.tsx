import React, { useState } from 'react';
import {
  Check,
  Loader2,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  BudgetCategoryName,
  BudgetExpenseItem,
  CelebrationEvent,
  CopilotAction,
  CopilotMessage,
  CreativeIdea,
  IdeaCategoryName,
  TimelineTask,
} from '../types/gatheros';
import { calculateBudgetSummary } from '../utils/planningEngine';

interface CopilotViewProps {
  event: CelebrationEvent;
  aiStatus: { configured: boolean; provider: string; model: string; mode: string };
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

const CONTEXT_PROMPT_SUGGESTIONS = [
  'How can I reduce my expenses?',
  'What if my guest count increases?',
  'Generate a vegetarian menu.',
  'Create a rainy-weather backup plan.',
  'What should I finish this week?',
  'Am I exceeding my budget?',
];

export const CopilotView: React.FC<CopilotViewProps> = ({
  event,
  aiStatus,
  onUpdateEvent,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const budget = calculateBudgetSummary(event);

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...event.copilotHistory, userMsg];
    onUpdateEvent({
      ...event,
      copilotHistory: updatedHistory,
    });
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          userMessage: trimmed,
        }),
      });
      const data = await response.json();

      const assistantMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'I have analyzed your event details and updated recommendations.',
        reasoning: data.reasoning,
        actions: data.actions || [],
        timestamp: new Date().toISOString(),
        aiMode: data.aiMode || 'live',
      };

      onUpdateEvent({
        ...event,
        copilotHistory: [...updatedHistory, assistantMsg],
      });
    } catch (err) {
      const errMsg: CopilotMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          err instanceof Error
            ? `Unable to reach the AI service (${err.message}). Please try again.`
            : 'Unable to reach the AI service.',
        timestamp: new Date().toISOString(),
        aiMode: 'preview_fallback',
      };
      onUpdateEvent({
        ...event,
        copilotHistory: [...updatedHistory, errMsg],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCopilotAction = (messageId: string, action: CopilotAction) => {
    if (action.applied) return;

    let updatedBudgetItems = [...event.budgetItems];
    let updatedTasks = [...event.timelineTasks];
    let updatedIdeas = [...event.ideas];

    if (action.type === 'add_budget') {
      const newBudgetItem: BudgetExpenseItem = {
        id: `cop-b-${Date.now()}`,
        category: (action.payload.category as BudgetCategoryName) || 'Miscellaneous',
        title: String(action.payload.title || 'AI Recommended Buffer'),
        allocatedAmount: Number(action.payload.allocatedAmount) || 10000,
        plannedAmount: Number(action.payload.plannedAmount) || 10000,
        vendorQuotationAmount: 0,
        actualAmount: 0,
        paidAmount: 0,
        isCommitted: false,
        isAiEstimate: true,
        estimateAssumptions: 'Added via Gather AI Copilot recommendation.',
      };
      updatedBudgetItems = [newBudgetItem, ...updatedBudgetItems];
    } else if (action.type === 'add_task') {
      const newTask: TimelineTask = {
        id: `cop-t-${Date.now()}`,
        title: String(action.payload.title || 'Follow up on AI Copilot recommendation'),
        milestoneCategory:
          (action.payload.milestoneCategory as TimelineTask['milestoneCategory']) ||
          'Preparation milestone',
        dueDate: event.date,
        priority: (action.payload.priority as TimelineTask['priority']) || 'High',
        status: 'Pending',
        assignedPerson: 'Lead Organizer',
        progress: 0,
        notes: 'Created from Gather AI Copilot action',
      };
      updatedTasks = [newTask, ...updatedTasks];
    } else if (action.type === 'save_idea') {
      const newIdea: CreativeIdea = {
        id: `cop-i-${Date.now()}`,
        title: String(action.payload.title || 'Curated Celebration Idea'),
        category: (action.payload.category as IdeaCategoryName) || 'Memorable experiences',
        description: String(action.payload.description || ''),
        culturalContext: event.culturalPreferences,
        estimatedCost: Number(action.payload.estimatedCost) || 5000,
        isSaved: true,
        isFavorite: true,
      };
      updatedIdeas = [newIdea, ...updatedIdeas];
    }

    const updatedMessages = event.copilotHistory.map((m) => {
      if (m.id !== messageId || !m.actions) return m;
      return {
        ...m,
        actions: m.actions.map((a) => (a.id === action.id ? { ...a, applied: true } : a)),
      };
    });

    onUpdateEvent({
      ...event,
      budgetItems: updatedBudgetItems,
      timelineTasks: updatedTasks,
      ideas: updatedIdeas,
      copilotHistory: updatedMessages,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Honest AI Status Transparency */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            SIGNATURE FEATURE · CONTEXT-AWARE GATHER AI COPILOT
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Gather AI Celebration Copilot
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            Grounded in {event.name} · {event.guestCount} Guests · {event.location} · Allocated:{' '}
            {event.currencySymbol}
            {budget.totalAllocatedBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#F3EFEA] border border-[#D8D1C5] rounded-lg px-4 py-2.5 text-xs text-[#3D4340]">
          <div className="font-semibold text-[#143326]">
            AI Engine Mode:{' '}
            {aiStatus.configured
              ? `Live LLM (${aiStatus.model}) + Contextual Fallback`
              : 'Preview Contextual Engine Mode'}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5">
            {aiStatus.configured
              ? 'Server-side Gemini integration active with deterministic fallback if rate-limited.'
              : 'No API key detected. Running deterministic contextual engine—configure GEMINI_API_KEY in Settings > Secrets for live LLM calls.'}
          </div>
        </div>
      </div>

      {/* Quick Contextual Question Chips */}
      <div>
        <div className="text-xs font-medium text-[#5A605D] mb-2">
          Ask a context-aware question about {event.name}:
        </div>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_PROMPT_SUGGESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendPrompt(q)}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-medium bg-white hover:bg-[#F3EFEA] text-[#143326] border border-[#D8D1C5] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation History Stream */}
      <div className="bg-white border border-[#E4DFD7] rounded-2xl p-6 space-y-5 min-h-[420px] max-h-[600px] overflow-y-auto">
        {event.copilotHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-3xl rounded-xl p-5 ${
                msg.role === 'user'
                  ? 'bg-[#1B4332] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] border border-[#E4DFD7] text-[#1C1E1D]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 mb-2">
                <span className="font-semibold">
                  {msg.role === 'user' ? 'You (Organizer)' : 'Gather AI Copilot'}
                </span>
                {msg.role === 'assistant' && (
                  <span className="font-mono-num">
                    {msg.aiMode === 'live'
                      ? 'Live AI Response'
                      : 'Contextual Planning Engine (Preview Mode)'}
                  </span>
                )}
              </div>

              <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>

              {msg.reasoning && (
                <div className="mt-3 pt-3 border-t border-[#E4DFD7] text-xs text-[#5A605D]">
                  <span className="font-semibold text-[#143326]">Why this matches your event: </span>
                  {msg.reasoning}
                </div>
              )}

              {/* Actionable Copilot Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E4DFD7] space-y-2">
                  <div className="text-xs font-semibold text-[#143326]">
                    Apply Recommendations Directly to {event.name}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.actions.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleApplyCopilotAction(msg.id, act)}
                        disabled={Boolean(act.applied)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                          act.applied
                            ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                            : 'bg-[#1B4332] text-[#FAF8F5] hover:bg-[#143326]'
                        }`}
                      >
                        {act.applied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied: {act.label}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{act.label}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5A605D] p-4 bg-[#FAF8F5] rounded-xl border border-[#E4DFD7] max-w-md">
            <Loader2 className="w-4 h-4 animate-spin text-[#1B4332]" />
            <span>Analyzing {event.name} budget, guest count, and timeline...</span>
          </div>
        )}
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendPrompt(input);
        }}
        className="flex items-center gap-3 bg-white border border-[#D8D1C5] rounded-xl p-2.5"
      >
        <Sparkles className="w-5 h-5 text-[#8A6D3B] ml-2 shrink-0" />
        <label htmlFor="copilot-prompt-input" className="sr-only">
          Ask Gather AI Copilot a question
        </label>
        <input
          id="copilot-prompt-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${event.name} (e.g., "How can I save 10% on decoration?" or "What if 30 more guests arrive?")`}
          className="w-full text-sm bg-transparent focus:outline-none text-[#1C1E1D]"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
