import React, { useState } from 'react';
import { Compass, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { CelebrationEvent, MomentStage, MomentStageKey } from '../types/gatheros';

interface MomentMapViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

export const MomentMapView: React.FC<MomentMapViewProps> = ({ event, onUpdateEvent }) => {
  const [activeStageKey, setActiveStageKey] = useState<MomentStageKey>(
    event.momentMap[0]?.stage || 'Arrival'
  );

  const activeStage =
    event.momentMap.find((m) => m.stage === activeStageKey) || event.momentMap[0];

  const handleUpdateStageField = (field: keyof MomentStage, value: string | number) => {
    if (!activeStage) return;
    const updatedMap = event.momentMap.map((m) =>
      m.stage === activeStage.stage ? { ...m, [field]: value } : m
    );
    onUpdateEvent({
      ...event,
      momentMap: updatedMap,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            SIGNATURE DIFFERENTIATOR · 8-STAGE EMOTIONAL & PRACTICAL GUEST JOURNEY
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Moment Map — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            Design how your {event.guestCount} guests feel from the first arrival step to the final farewell—with responsible owners and backup arrangements at every stage.
          </p>
        </div>
      </div>

      {/* 8-Stage Horizontal Journey Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {event.momentMap.map((stageItem, idx) => {
          const isSelected = stageItem.stage === activeStage?.stage;
          return (
            <button
              key={stageItem.stage}
              type="button"
              onClick={() => setActiveStageKey(stageItem.stage)}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#143326] text-[#FAF8F5] border-[#143326]'
                  : 'bg-white text-[#1C1E1D] border-[#E4DFD7] hover:bg-[#F3EFEA]'
              }`}
            >
              <div
                className={`text-[11px] font-mono-num ${
                  isSelected ? 'text-[#E6CFA0]' : 'text-[#8A6D3B]'
                }`}
              >
                STAGE 0{idx + 1}
              </div>
              <div className="font-serif-display text-sm font-medium mt-1 leading-snug">
                {stageItem.stage}
              </div>
              <div
                className={`text-[11px] font-mono-num mt-2 ${
                  isSelected ? 'text-[#FAF8F5]/75' : 'text-[#5A605D]'
                }`}
              >
                {event.currencySymbol}
                {stageItem.estimatedExpense.toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep Dive & Interactive Editor */}
      {activeStage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#143326] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-[#2D5A44] space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-num text-[#E6CFA0] mb-1">
                <Compass className="w-4 h-4" />
                <span>ACTIVE STAGE ARCHITECTURE · {activeStage.stage.toUpperCase()}</span>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#FAF8F5] mb-3">
                {activeStage.stage}: Desired Guest Experience
              </h2>
              <p className="text-base text-[#FAF8F5]/90 leading-relaxed">
                “{activeStage.desiredExperience}”
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#FAF8F5]/15">
              <div>
                <div className="text-xs font-semibold text-[#E6CFA0] mb-2">
                  Signature Stage Activities
                </div>
                <ul className="space-y-2 text-xs text-[#FAF8F5]/90">
                  {activeStage.activities.map((act, i) => (
                    <li key={i}>· {act}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#E6CFA0] mb-2">
                  Preparation Requirements
                </div>
                <ul className="space-y-2 text-xs text-[#FAF8F5]/90">
                  {activeStage.preparationRequirements.map((req, i) => (
                    <li key={i}>· {req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#FAF8F5]/15">
              <div className="bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FCA5A5] mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Potential Operational Issue</span>
                </div>
                <p className="text-xs text-[#FAF8F5]/85 leading-relaxed">
                  {activeStage.potentialIssues}
                </p>
              </div>

              <div className="bg-[#1B4332]/80 border border-[#FAF8F5]/15 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A7F3D0] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Ready Backup Arrangement</span>
                </div>
                <p className="text-xs text-[#FAF8F5]/85 leading-relaxed">
                  {activeStage.backupArrangements}
                </p>
              </div>
            </div>
          </div>

          {/* Stage Editor Form */}
          <div className="lg:col-span-5 bg-white border border-[#E4DFD7] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B]">
              <UserCheck className="w-4 h-4" />
              <span>CUSTOMIZE STAGE PARAMETERS</span>
            </div>
            <h3 className="font-serif-display text-lg font-medium text-[#143326]">
              Refine "{activeStage.stage}" Execution Plan
            </h3>

            <div>
              <label
                htmlFor="moment-experience-input"
                className="block text-xs font-semibold text-[#143326] mb-1"
              >
                Desired Emotional Experience
              </label>
              <textarea
                id="moment-experience-input"
                rows={2}
                value={activeStage.desiredExperience}
                onChange={(e) => handleUpdateStageField('desiredExperience', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="moment-owner-input"
                  className="block text-xs font-semibold text-[#143326] mb-1"
                >
                  Responsible Person
                </label>
                <input
                  id="moment-owner-input"
                  type="text"
                  value={activeStage.responsiblePerson}
                  onChange={(e) => handleUpdateStageField('responsiblePerson', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="moment-expense-input"
                  className="block text-xs font-semibold text-[#143326] mb-1"
                >
                  Estimated Stage Expense ({event.currencySymbol})
                </label>
                <input
                  id="moment-expense-input"
                  type="number"
                  min={0}
                  value={activeStage.estimatedExpense}
                  onChange={(e) =>
                    handleUpdateStageField('estimatedExpense', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="moment-backup-input"
                className="block text-xs font-semibold text-[#143326] mb-1"
              >
                Backup Arrangement
              </label>
              <textarea
                id="moment-backup-input"
                rows={2}
                value={activeStage.backupArrangements}
                onChange={(e) => handleUpdateStageField('backupArrangements', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Complete 8-Stage Overview Matrix */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Complete End-to-End Guest Experience Arc (All 8 Stages)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {event.momentMap.map((stage, i) => (
            <div
              key={stage.stage}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E4DFD7] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono-num text-[#8A6D3B]">
                  0{i + 1} · {stage.stage}
                </div>
                <p className="text-xs text-[#143326] font-medium mt-1 leading-relaxed">
                  {stage.desiredExperience}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#E4DFD7] text-[11px] text-[#5A605D] flex items-center justify-between">
                <span>Lead: {stage.responsiblePerson}</span>
                <span className="font-mono-num">
                  {event.currencySymbol}
                  {stage.estimatedExpense.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
