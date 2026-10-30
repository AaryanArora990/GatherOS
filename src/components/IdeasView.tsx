import React, { useState } from 'react';
import { Check, Heart, Plus, Sparkles, Trash2 } from 'lucide-react';
import {
  ALL_IDEA_CATEGORIES,
  BudgetExpenseItem,
  CelebrationEvent,
  CreativeIdea,
  IdeaCategoryName,
  TimelineTask,
} from '../types/gatheros';

interface IdeasViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategoryName | 'All' | 'Favorites'>(
    'All'
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IdeaCategoryName>('Memorable experiences');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<string>('8000');

  const filteredIdeas = event.ideas.filter((idea) => {
    if (selectedCategory === 'Favorites') return idea.isFavorite;
    if (selectedCategory === 'All') return true;
    return idea.category === selectedCategory;
  });

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIdea: CreativeIdea = {
      id: `idea-${Date.now()}`,
      title: title.trim(),
      category,
      description:
        description.trim() ||
        `Custom ${category.toLowerCase()} concept tailored for ${event.name}.`,
      culturalContext: event.culturalPreferences,
      estimatedCost: Number(estimatedCost) || 0,
      isSaved: true,
      isFavorite: false,
    };

    onUpdateEvent({
      ...event,
      ideas: [newIdea, ...event.ideas],
    });
    setTitle('');
    setDescription('');
  };

  const handleToggleFavorite = (ideaId: string) => {
    onUpdateEvent({
      ...event,
      ideas: event.ideas.map((i) =>
        i.id === ideaId ? { ...i, isFavorite: !i.isFavorite } : i
      ),
    });
  };

  const handleDeleteIdea = (ideaId: string) => {
    onUpdateEvent({
      ...event,
      ideas: event.ideas.filter((i) => i.id !== ideaId),
    });
  };

  const handleConvertToTask = (idea: CreativeIdea) => {
    if (idea.convertedToTask) return;
    const newTask: TimelineTask = {
      id: `idea-t-${Date.now()}`,
      title: `Execute Idea: ${idea.title}`,
      milestoneCategory: 'Decoration planning',
      dueDate: event.date,
      priority: 'Medium',
      status: 'Pending',
      assignedPerson: 'Creative Lead',
      progress: 0,
      notes: idea.description,
    };

    onUpdateEvent({
      ...event,
      timelineTasks: [newTask, ...event.timelineTasks],
      ideas: event.ideas.map((i) =>
        i.id === idea.id ? { ...i, convertedToTask: true } : i
      ),
    });
  };

  const handleAddIdeaToBudget = (idea: CreativeIdea) => {
    if (idea.addedToBudget) return;
    const newBudget: BudgetExpenseItem = {
      id: `idea-b-${Date.now()}`,
      category: 'Decoration',
      title: `Creative Studio Idea: ${idea.title}`,
      allocatedAmount: idea.estimatedCost,
      plannedAmount: idea.estimatedCost,
      vendorQuotationAmount: 0,
      actualAmount: 0,
      paidAmount: 0,
      isCommitted: false,
      isAiEstimate: true,
      estimateAssumptions: `Added from Personalized Ideas Studio (${idea.category}).`,
    };

    onUpdateEvent({
      ...event,
      budgetItems: [newBudget, ...event.budgetItems],
      ideas: event.ideas.map((i) => (i.id === idea.id ? { ...i, addedToBudget: true } : i)),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            PERSONALIZED IDEAS STUDIO & VISUAL INSPIRATION BOARD
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Creative Discovery Studio — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            Culturally grounded inspiration for {event.location}. Convert any saved concept directly into a Timeline Task or Budget Estimate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="idea-category-select" className="sr-only">
            Filter Ideas
          </label>
          <select
            id="idea-category-select"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as IdeaCategoryName | 'All' | 'Favorites')
            }
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#D8D1C5] rounded-lg text-[#143326]"
          >
            <option value="All">All Inspiration ({event.ideas.length})</option>
            <option value="Favorites">Favorites Only</option>
            {ALL_IDEA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Custom Idea Form */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <h2 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Pin New Creative Concept to Inspiration Board
        </h2>
        <form onSubmit={handleAddIdea} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label htmlFor="new-idea-title" className="block text-xs text-[#4A4F4C] mb-1">
              Idea Title *
            </label>
            <input
              id="new-idea-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Terracotta Kulhad Chai Bar"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="new-idea-cat" className="block text-xs text-[#4A4F4C] mb-1">
              Category
            </label>
            <select
              id="new-idea-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as IdeaCategoryName)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            >
              {ALL_IDEA_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="new-idea-desc" className="block text-xs text-[#4A4F4C] mb-1">
              Concept Notes
            </label>
            <input
              id="new-idea-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Handcrafted experience details..."
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="new-idea-cost" className="block text-xs text-[#4A4F4C] mb-1">
              Est. Cost ({event.currencySymbol})
            </label>
            <input
              id="new-idea-cost"
              type="number"
              min={0}
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Idea</span>
          </button>
        </form>
      </div>

      {/* Inspiration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs text-[#8A6D3B] font-mono-num">
                  {idea.category} · Est. {event.currencySymbol}
                  {idea.estimatedCost.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(idea.id)}
                    aria-label={`Favorite idea '${idea.title}'`}
                    className={`p-1.5 rounded cursor-pointer ${
                      idea.isFavorite ? 'text-[#B91C1C]' : 'text-[#8A8F8C] hover:text-[#143326]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${idea.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteIdea(idea.id)}
                    aria-label={`Remove idea '${idea.title}'`}
                    className="p-1.5 text-[#8A8F8C] hover:text-[#B91C1C] rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif-display text-xl font-medium text-[#143326] mt-1 mb-2">
                {idea.title}
              </h3>
              <p className="text-sm text-[#3D4340] leading-relaxed mb-3">{idea.description}</p>
              <div className="text-xs text-[#5A605D] bg-[#FAF8F5] border border-[#E4DFD7] rounded-lg p-3">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#8A6D3B]" />
                <span className="font-semibold text-[#143326]">Cultural & Event Fit: </span>
                {idea.culturalContext}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4DFD7] flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleConvertToTask(idea)}
                disabled={Boolean(idea.convertedToTask)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                  idea.convertedToTask
                    ? 'bg-[#E6F4EA] text-[#137333]'
                    : 'bg-[#1B4332] text-[#FAF8F5] hover:bg-[#143326]'
                }`}
              >
                {idea.convertedToTask ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Converted to Task</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Convert to Checklist Task</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleAddIdeaToBudget(idea)}
                disabled={Boolean(idea.addedToBudget)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                  idea.addedToBudget
                    ? 'bg-[#E6F4EA] text-[#137333]'
                    : 'bg-[#F3EFEA] text-[#143326] hover:bg-[#E7E1D8] border border-[#D8D1C5]'
                }`}
              >
                {idea.addedToBudget ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to Budget</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      Add Est. {event.currencySymbol}
                      {idea.estimatedCost.toLocaleString()} to Budget
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
