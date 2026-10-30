import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  Sliders,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { CelebrationEvent } from '../types/gatheros';
import { analyzeTimelineHealth, calculateBudgetSummary } from '../utils/planningEngine';

interface DashboardViewProps {
  event: CelebrationEvent;
  allEvents: CelebrationEvent[];
  onSelectEvent: (eventId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewEventModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  event,
  allEvents,
  onSelectEvent,
  onNavigateTab,
  onOpenNewEventModal,
}) => {
  const budget = calculateBudgetSummary(event);
  const timeline = analyzeTimelineHealth(event.timelineTasks);

  // Days until event relative to current reference date
  const nowMs = new Date('2026-10-30T09:00:00Z').getTime();
  const eventMs = new Date(event.date).getTime();
  const daysUntil = Math.max(1, Math.ceil((eventMs - nowMs) / (1000 * 60 * 60 * 24)));

  // RSVP Statistics
  const totalInvitedGroups = event.guests.length;
  const confirmedGuests = event.guests
    .filter((g) => g.rsvpStatus === 'Confirmed')
    .reduce((sum, g) => sum + g.attendingCount, 0);
  const pendingGroups = event.guests.filter((g) => g.rsvpStatus === 'Pending').length;
  const declinedGroups = event.guests.filter((g) => g.rsvpStatus === 'Declined').length;

  const nextThreeActions = event.timelineTasks
    .filter((t) => t.status !== 'Completed')
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Celebration Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#5A605D] mb-1 flex items-center gap-2">
            <span>COMMAND CENTER DASHBOARD</span>
            <span aria-hidden="true">·</span>
            <span>{event.isDemo ? 'DEMO DATA WORKSPACE' : 'USER CELEBRATION WORKSPACE'}</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            {event.name}
          </h1>
          <div className="text-xs text-[#4A4F4C] mt-1 flex flex-wrap items-center gap-2">
            <span>{event.location}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{event.date}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{event.guestCount} Planned Guests</span>
            <span aria-hidden="true">·</span>
            <span>Theme: {event.preferredTheme}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="dashboard-event-switcher" className="sr-only">
            Switch Active Celebration
          </label>
          <select
            id="dashboard-event-switcher"
            value={event.id}
            onChange={(e) => onSelectEvent(e.target.value)}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#D8D1C5] rounded-lg text-[#143326] focus:outline-none focus:border-[#1B4332]"
          >
            {allEvents.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} {ev.isDemo ? '[DEMO DATA]' : ''}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onOpenNewEventModal}
            className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            + Plan New Event
          </button>
        </div>
      </div>

      {/* Top KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-[#5A605D] mb-2">
            <span>Countdown & Readiness</span>
            <Calendar className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="font-mono-num text-2xl font-semibold text-[#143326]">
            {daysUntil} Days
          </div>
          <div className="text-xs text-[#4A4F4C] mt-1 font-mono-num">
            {timeline.overallProgress}% Timeline Milestones Complete
          </div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-[#5A605D] mb-2">
            <span>Total Allocated Budget</span>
            <Wallet className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="font-mono-num text-2xl font-semibold text-[#143326]">
            {event.currencySymbol}
            {budget.totalAllocatedBudget.toLocaleString()}
          </div>
          <div className="text-xs text-[#4A4F4C] mt-1 font-mono-num">
            Target Cap: {event.currencySymbol}
            {event.targetBudget.toLocaleString()} · {budget.utilizationPercentage}% Actual Used
          </div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-[#5A605D] mb-2">
            <span>Actual vs Remaining Budget</span>
            <Sliders className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="font-mono-num text-2xl font-semibold text-[#143326]">
            {event.currencySymbol}
            {budget.remainingBudget.toLocaleString()}
          </div>
          <div className="text-xs text-[#4A4F4C] mt-1 font-mono-num">
            Actual: {event.currencySymbol}
            {budget.actualExpenses.toLocaleString()} · Paid: {event.currencySymbol}
            {budget.paidExpenses.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-[#5A605D] mb-2">
            <span>Guest RSVP & Attendance</span>
            <Users className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="font-mono-num text-2xl font-semibold text-[#143326]">
            {confirmedGuests} / {event.guestCount}
          </div>
          <div className="text-xs text-[#4A4F4C] mt-1 font-mono-num">
            {totalInvitedGroups} Households · {pendingGroups} Pending · {declinedGroups} Declined
          </div>
        </div>
      </div>

      {/* Prominent Section: "Your AI Planning Brief" */}
      <section
        aria-labelledby="ai-planning-brief-heading"
        className="bg-[#143326] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#2D5A44]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#FAF8F5]/15">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E6CFA0] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>EXECUTIVE INTELLIGENCE SUMMARY</span>
            </div>
            <h2
              id="ai-planning-brief-heading"
              className="font-serif-display text-2xl font-medium text-[#FAF8F5]"
            >
              Your AI Planning Brief
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('copilot')}
              className="px-4 py-2 text-xs font-semibold text-[#143326] bg-[#E6CFA0] hover:bg-[#D4B475] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Ask Gather AI Copilot
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('blueprint')}
              className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#255841] border border-[#FAF8F5]/20 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              View Full Blueprint
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">
          {/* 1. What is going well */}
          <div className="bg-[#1B4332]/70 border border-[#FAF8F5]/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A7F3D0] mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Is Going Well</span>
            </div>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/90 leading-relaxed">
              <li>
                · Core theme ({event.blueprint.personalizedTheme}) and 8-stage Moment Map are aligned for {event.guestCount} guests.
              </li>
              <li>
                · {timeline.completedTasks} of {timeline.totalTasks} timeline milestones completed ({timeline.overallProgress}% progress).
              </li>
              <li>
                · {event.currencySymbol}
                {budget.paidExpenses.toLocaleString()} in vendor deposits already paid and recorded.
              </li>
            </ul>
          </div>

          {/* 2. What needs attention */}
          <div className="bg-[#1B4332]/70 border border-[#FAF8F5]/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE68A] mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>What Needs Attention</span>
            </div>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/90 leading-relaxed">
              {timeline.overdueTasks.length > 0 ? (
                <li>
                  · {timeline.overdueTasks.length} milestone(s) past target date: "{timeline.overdueTasks[0].title}".
                </li>
              ) : (
                <li>
                  · {timeline.pendingTasks} upcoming milestones require confirmation before {event.date}.
                </li>
              )}
              <li>
                · Outstanding vendor balance of {event.currencySymbol}
                {budget.outstandingPayments.toLocaleString()} scheduled across upcoming payment milestones.
              </li>
              <li>
                · {pendingGroups} guest group(s) still awaiting final RSVP and dietary confirmation.
              </li>
            </ul>
          </div>

          {/* 3. Next three important actions */}
          <div className="bg-[#1B4332]/70 border border-[#FAF8F5]/10 rounded-xl p-5">
            <div className="text-xs font-semibold text-[#E6CFA0] mb-3">
              Next 3 Important Actions
            </div>
            <ol className="space-y-2.5 text-xs text-[#FAF8F5]/90 leading-relaxed">
              {nextThreeActions.map((task, idx) => (
                <li key={task.id} className="flex items-start gap-2">
                  <span className="font-mono-num text-[#E6CFA0] font-semibold">0{idx + 1}.</span>
                  <span>
                    {task.title} <span className="text-[#FAF8F5]/60">(Due {task.dueDate})</span>
                  </span>
                </li>
              ))}
              {nextThreeActions.length === 0 && (
                <li>All scheduled tasks are marked complete! Review Moment Map backup plans.</li>
              )}
            </ol>
          </div>

          {/* 4. Budget or scheduling risks */}
          <div className="bg-[#1B4332]/70 border border-[#FAF8F5]/10 rounded-xl p-5">
            <div className="text-xs font-semibold text-[#FCA5A5] mb-3">
              Budget & Scheduling Risks
            </div>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/90 leading-relaxed">
              {budget.warnings.length > 0 ? (
                budget.warnings.slice(0, 2).map((w, i) => <li key={i}>· {w}</li>)
              ) : (
                <li>
                  · Total allocations ({event.currencySymbol}
                  {budget.totalAllocatedBudget.toLocaleString()}) are within your {event.currencySymbol}
                  {event.targetBudget.toLocaleString()} cap.
                </li>
              )}
              {event.blueprint.riskAndContingency.slice(0, 2).map((r, i) => (
                <li key={i}>· {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Action Studio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">01 · FINANCIAL CONTROL</div>
            <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
              Smart Budget & What-If Simulator
            </h3>
            <p className="text-xs text-[#4A4F4C] leading-relaxed mb-4">
              Inspect all 10 expense categories, run a Budget Reality Check, or simulate changing your guest count from {event.guestCount} to {event.guestCount + 40}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('budget')}
            className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Smart Budget Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">02 · GUEST JOURNEY DESIGN</div>
            <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
              8-Stage Emotional Moment Map
            </h3>
            <p className="text-xs text-[#4A4F4C] leading-relaxed mb-4">
              Choreograph Arrival, Welcome, First Impressions, Social Interaction, Main Celebration, Highlight Moment, Dining, and Farewell.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('moment-map')}
            className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Moment Map Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">03 · RISK & CONTINGENCY</div>
            <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
              Interactive Scenario Simulator
            </h3>
            <p className="text-xs text-[#4A4F4C] leading-relaxed mb-4">
              Test weather disruptions, vendor cancellations, or 15% budget reductions and inspect trade-offs before modifying your plan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('simulator')}
            className="text-xs font-semibold text-[#1B4332] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch Scenario Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
