import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { CelebrationEvent, TimelineTask } from '../types/gatheros';
import { analyzeTimelineHealth } from '../utils/planningEngine';

interface TimelineViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

const MILESTONE_CATEGORIES: TimelineTask['milestoneCategory'][] = [
  'Preparation milestone',
  'Booking deadline',
  'Payment deadline',
  'Invitation deadline',
  'Guest confirmation deadline',
  'Decoration planning',
  'Catering finalization',
  'Final event-day preparation',
];

export const TimelineView: React.FC<TimelineViewProps> = ({ event, onUpdateEvent }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('All');
  const [title, setTitle] = useState('');
  const [milestoneCategory, setMilestoneCategory] =
    useState<TimelineTask['milestoneCategory']>('Preparation milestone');
  const [dueDate, setDueDate] = useState('2026-11-25');
  const [priority, setPriority] = useState<TimelineTask['priority']>('High');
  const [assignedPerson, setAssignedPerson] = useState('');
  const [error, setError] = useState<string | null>(null);

  const health = analyzeTimelineHealth(event.timelineTasks, '2026-10-30');
  const overdueIds = new Set(health.overdueTasks.map((t) => t.id));

  const filteredTasks = event.timelineTasks.filter((task) => {
    if (filter === 'Completed') return task.status === 'Completed';
    if (filter === 'Pending') return task.status !== 'Completed';
    if (filter === 'Overdue') return overdueIds.has(task.id);
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a milestone task title.');
      return;
    }
    const newTask: TimelineTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      milestoneCategory,
      dueDate,
      priority,
      status: 'Pending',
      assignedPerson: assignedPerson.trim() || 'Lead Organizer',
      progress: 0,
    };

    onUpdateEvent({
      ...event,
      timelineTasks: [newTask, ...event.timelineTasks],
    });
    setTitle('');
    setAssignedPerson('');
    setError(null);
  };

  const handleToggleTaskComplete = (taskId: string) => {
    const updated = event.timelineTasks.map((t) => {
      if (t.id !== taskId) return t;
      const nextCompleted = t.status !== 'Completed';
      return {
        ...t,
        status: (nextCompleted ? 'Completed' : 'Pending') as TimelineTask['status'],
        progress: nextCompleted ? 100 : 25,
      };
    });
    onUpdateEvent({ ...event, timelineTasks: updated });
  };

  const handleChangePriority = (taskId: string, nextPriority: TimelineTask['priority']) => {
    const updated = event.timelineTasks.map((t) =>
      t.id === taskId ? { ...t, priority: nextPriority } : t
    );
    onUpdateEvent({ ...event, timelineTasks: updated });
  };

  const handleDeleteTask = (taskId: string) => {
    onUpdateEvent({
      ...event,
      timelineTasks: event.timelineTasks.filter((t) => t.id !== taskId),
    });
  };

  const handleApplyRecoverySchedule = () => {
    const recMap = new Map(
      health.recoverySuggestions.map((r) => [r.taskId, r.recommendedNewDueDate])
    );
    const updated = event.timelineTasks.map((t) => {
      const newDue = recMap.get(t.id);
      if (newDue) {
        return {
          ...t,
          dueDate: newDue,
          priority: 'High' as const,
          status: 'In Progress' as const,
        };
      }
      return t;
    });
    onUpdateEvent({ ...event, timelineTasks: updated });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            INTELLIGENT EVENT TIMELINE & TASK MANAGER
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Milestones & Execution Schedule — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1 font-mono-num">
            {health.completedTasks} / {health.totalTasks} Completed ({health.overallProgress}%) ·{' '}
            {health.overdueTasks.length} Overdue
          </p>
        </div>

        {/* Interactive Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#F3EFEA] border border-[#D8D1C5] rounded-lg">
          {(['All', 'Pending', 'Completed', 'Overdue'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-[#1B4332] text-[#FAF8F5]'
                  : 'text-[#4A4F4C] hover:text-[#143326]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Signature Feature: Timeline Intelligence & Missed Deadline Recovery */}
      <div className="bg-[#143326] text-[#FAF8F5] rounded-2xl p-6 border border-[#2D5A44] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#E6CFA0] font-mono-num">
            <Sparkles className="w-4 h-4" />
            <span>SIGNATURE FEATURE · TIMELINE INTELLIGENCE</span>
          </div>
          <h2 className="font-serif-display text-xl font-medium text-[#FAF8F5]">
            {health.overdueTasks.length > 0
              ? `Detected ${health.overdueTasks.length} Overdue Milestone(s) — Revised Recovery Plan Ready`
              : `All Active Milestones Are on Schedule for ${event.date}`}
          </h2>
          {health.recoverySuggestions.length > 0 ? (
            <ul className="space-y-1 text-xs text-[#FAF8F5]/85">
              {health.recoverySuggestions.map((rec) => (
                <li key={rec.taskId}>
                  · {rec.actionPlan} (New target date: {rec.recommendedNewDueDate})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#FAF8F5]/80">
              Your timeline is calibrated for {event.guestCount} guests in {event.location}. Keep booking and catering confirmations locked 21+ days before the celebration.
            </p>
          )}
        </div>

        {health.recoverySuggestions.length > 0 && (
          <button
            type="button"
            onClick={handleApplyRecoverySchedule}
            className="px-4 py-2.5 text-xs font-semibold text-[#143326] bg-[#E6CFA0] hover:bg-[#D4B475] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            Apply Revised Recovery Dates
          </button>
        )}
      </div>

      {/* Add Task Form */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Add Preparation Milestone or Deadline
        </h3>
        {error && (
          <div role="alert" className="mb-3 p-3 rounded-lg bg-[#FEF2F2] text-xs text-[#991B1B]">
            {error}
          </div>
        )}
        <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="task-title-input" className="block text-xs text-[#4A4F4C] mb-1">
              Task Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Confirm shuttle pickup schedule"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="task-category-select" className="block text-xs text-[#4A4F4C] mb-1">
              Milestone Stage
            </label>
            <select
              id="task-category-select"
              value={milestoneCategory}
              onChange={(e) =>
                setMilestoneCategory(e.target.value as TimelineTask['milestoneCategory'])
              }
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            >
              {MILESTONE_CATEGORIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-due-input" className="block text-xs text-[#4A4F4C] mb-1">
              Due Date
            </label>
            <input
              id="task-due-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="task-assignee-input" className="block text-xs text-[#4A4F4C] mb-1">
              Assigned Person
            </label>
            <input
              id="task-assignee-input"
              type="text"
              value={assignedPerson}
              onChange={(e) => setAssignedPerson(e.target.value)}
              placeholder="e.g., Meera"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tasks List */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#5A605D]">
            No tasks match the "{filter}" filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isOverdue = overdueIds.has(task.id);
            const isDone = task.status === 'Completed';
            return (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E4DFD7]"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTaskComplete(task.id)}
                    aria-label={`Mark '${task.title}' as ${isDone ? 'pending' : 'completed'}`}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center cursor-pointer shrink-0 ${
                      isDone
                        ? 'bg-[#1B4332] border-[#1B4332] text-[#FAF8F5]'
                        : 'bg-white border-[#8A8F8C]'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="text-xs text-[#5A605D] flex flex-wrap items-center gap-1.5">
                      <span>{task.milestoneCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">Due {task.dueDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>Assigned: {task.assignedPerson}</span>
                      {isOverdue && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#B91C1C] font-semibold inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Overdue
                          </span>
                        </>
                      )}
                      {!isOverdue && !isDone && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#4A4F4C] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.status} ({task.progress}%)
                          </span>
                        </>
                      )}
                    </div>

                    <div
                      className={`text-sm font-medium mt-0.5 ${
                        isDone ? 'line-through text-[#8A8F8C]' : 'text-[#143326]'
                      }`}
                    >
                      {task.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label htmlFor={`priority-${task.id}`} className="sr-only">
                    Priority for {task.title}
                  </label>
                  <select
                    id={`priority-${task.id}`}
                    value={task.priority}
                    onChange={(e) =>
                      handleChangePriority(task.id, e.target.value as TimelineTask['priority'])
                    }
                    className="px-2.5 py-1.5 text-xs bg-white border border-[#D8D1C5] rounded-md text-[#143326]"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete task '${task.title}'`}
                    className="p-2 text-[#5A605D] hover:text-[#B91C1C] rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
