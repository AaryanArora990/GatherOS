import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Calculator,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import {
  ALL_BUDGET_CATEGORIES,
  BudgetCategoryName,
  BudgetExpenseItem,
  CelebrationEvent,
} from '../types/gatheros';
import {
  calculateBudgetSummary,
  runBudgetRealityCheck,
  simulateGuestCountChange,
} from '../utils/planningEngine';

interface BudgetViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({ event, onUpdateEvent }) => {
  const [newCategory, setNewCategory] = useState<BudgetCategoryName>('Decoration');
  const [newTitle, setNewTitle] = useState('');
  const [newAllocated, setNewAllocated] = useState<string>('');
  const [newActual, setNewActual] = useState<string>('');
  const [newPaid, setNewPaid] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // What-if simulator state
  const [simulatedGuests, setSimulatedGuests] = useState<number>(event.guestCount + 40);
  const [appliedSimulationMessage, setAppliedSimulationMessage] = useState<string | null>(null);
  const [appliedRealityCheckMessage, setAppliedRealityCheckMessage] = useState<string | null>(null);

  const summary = calculateBudgetSummary(event);
  const realityCheck = runBudgetRealityCheck(event);
  const whatIfResult = simulateGuestCountChange(event, simulatedGuests);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter an expense title.');
      return;
    }
    const allocVal = Number(newAllocated) || 0;
    const actualVal = Number(newActual) || 0;
    const paidVal = Number(newPaid) || 0;
    if (allocVal <= 0 && actualVal <= 0) {
      setFormError('Please enter a positive allocated or actual expense amount.');
      return;
    }

    const newItem: BudgetExpenseItem = {
      id: `exp-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      allocatedAmount: allocVal,
      plannedAmount: allocVal,
      vendorQuotationAmount: actualVal || allocVal,
      actualAmount: actualVal,
      paidAmount: paidVal,
      isCommitted: actualVal > 0,
      isAiEstimate: false,
    };

    onUpdateEvent({
      ...event,
      budgetItems: [newItem, ...event.budgetItems],
    });

    setNewTitle('');
    setNewAllocated('');
    setNewActual('');
    setNewPaid('');
    setFormError(null);
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateEvent({
      ...event,
      budgetItems: event.budgetItems.filter((item) => item.id !== id),
    });
  };

  const handleApplyRealityCheckAllocations = () => {
    const recMap = new Map(
      realityCheck.overspendingCategories.map((c) => [c.category, c.recommendedAmount])
    );

    const updatedItems = event.budgetItems.map((item) => {
      const rec = recMap.get(item.category);
      if (rec !== undefined) {
        return {
          ...item,
          allocatedAmount: rec,
          plannedAmount: rec,
        };
      }
      return item;
    });

    onUpdateEvent({
      ...event,
      budgetItems: updatedItems,
    });
    setAppliedRealityCheckMessage(
      `Applied revised allocations across ${realityCheck.overspendingCategories.length} categories.`
    );
  };

  const handleApplyWhatIfSimulation = () => {
    const projMap = new Map(
      whatIfResult.categoryDeltas.map((d) => [d.category, d.projectedAllocated])
    );

    const updatedItems = event.budgetItems.map((item) => {
      const projected = projMap.get(item.category);
      if (projected !== undefined && item.allocatedAmount > 0) {
        return {
          ...item,
          allocatedAmount: projected,
          plannedAmount: projected,
        };
      }
      return item;
    });

    onUpdateEvent({
      ...event,
      guestCount: whatIfResult.newGuestCount,
      budgetItems: updatedItems,
    });
    setAppliedSimulationMessage(
      `Updated event guest count to ${whatIfResult.newGuestCount} and applied projected category allocations.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            SMART BUDGET INTELLIGENCE ENGINE · LIVE FINANCIAL LEDGER
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Smart Budget Planner — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            TOTAL BUDGET = SUM OF ALL CATEGORY ALLOCATIONS · REMAINING BUDGET = TOTAL BUDGET − ACTUAL EXPENSES
          </p>
        </div>

        <div className="text-xs text-[#5A605D] bg-[#F3EFEA] border border-[#D8D1C5] rounded-lg px-4 py-2.5">
          All AI-generated prices are labelled as <span className="font-semibold text-[#143326]">Estimates</span> with explicit assumptions.
        </div>
      </div>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Total Allocated Budget</div>
          <div
            data-testid="total-allocated-budget"
            className="font-mono-num text-xl font-semibold text-[#143326] mt-1"
          >
            {event.currencySymbol}
            {summary.totalAllocatedBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5 font-mono-num">
            Target Cap: {event.currencySymbol}
            {summary.targetBudget.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Actual Expenses</div>
          <div
            data-testid="actual-expenses"
            className="font-mono-num text-xl font-semibold text-[#143326] mt-1"
          >
            {event.currencySymbol}
            {summary.actualExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5 font-mono-num">
            {summary.utilizationPercentage}% of Allocated Used
          </div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Remaining Budget</div>
          <div
            data-testid="remaining-budget"
            className={`font-mono-num text-xl font-semibold mt-1 ${
              summary.remainingBudget < 0 ? 'text-[#B91C1C]' : 'text-[#137333]'
            }`}
          >
            {event.currencySymbol}
            {summary.remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5">Allocated − Actual</div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Committed Amount</div>
          <div className="font-mono-num text-xl font-semibold text-[#143326] mt-1">
            {event.currencySymbol}
            {summary.committedExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5">Locked Bookings</div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Paid Expenses</div>
          <div className="font-mono-num text-xl font-semibold text-[#143326] mt-1">
            {event.currencySymbol}
            {summary.paidExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5">Deposits & Settlements</div>
        </div>

        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Outstanding Balance</div>
          <div className="font-mono-num text-xl font-semibold text-[#B45309] mt-1">
            {event.currencySymbol}
            {summary.outstandingPayments.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5A605D] mt-0.5">Actual − Paid</div>
        </div>
      </div>

      {/* Warnings Banner */}
      {summary.warnings.length > 0 && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#92400E]">
            <AlertTriangle className="w-4 h-4" />
            <span>Active Budget Warnings</span>
          </div>
          <ul className="text-xs text-[#78350F] space-y-1">
            {summary.warnings.map((w, i) => (
              <li key={i}>· {w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Add New Expense Item Form */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
          LOG EXPENSE OR ALLOCATION
        </div>
        <h2 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Add Expense Item (Recalculates Totals Instantly)
        </h2>

        {formError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div>
            <label htmlFor="budget-category-select" className="block text-xs text-[#4A4F4C] mb-1">
              Category
            </label>
            <select
              id="budget-category-select"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as BudgetCategoryName)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            >
              {ALL_BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="budget-title-input" className="block text-xs text-[#4A4F4C] mb-1">
              Expense Description *
            </label>
            <input
              id="budget-title-input"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Additional Marigold Stage Garland"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="budget-allocated-input" className="block text-xs text-[#4A4F4C] mb-1">
              Allocated ({event.currencySymbol})
            </label>
            <input
              id="budget-allocated-input"
              type="number"
              min={0}
              value={newAllocated}
              onChange={(e) => setNewAllocated(e.target.value)}
              placeholder="15000"
              className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="budget-actual-input" className="block text-xs text-[#4A4F4C] mb-1">
              Actual Spend ({event.currencySymbol})
            </label>
            <input
              id="budget-actual-input"
              type="number"
              min={0}
              value={newActual}
              onChange={(e) => setNewActual(e.target.value)}
              placeholder="14500"
              className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </form>
      </div>

      {/* Category-Wise Allocation Breakdown Table */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#E4DFD7]">
          <div className="text-xs font-mono-num text-[#8A6D3B] mb-1">
            10-CATEGORY FINANCIAL ARCHITECTURE
          </div>
          <h2 className="font-serif-display text-lg font-medium text-[#143326]">
            Category-Wise Budget Allocation vs Committed, Paid & Actual
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3EFEA] border-b border-[#E4DFD7] text-[11px] font-semibold text-[#4A4F4C]">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Allocated</th>
                <th className="py-3 px-4 text-right">Vendor Quote</th>
                <th className="py-3 px-4 text-right">Actual Spend</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-right">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DFD7] text-xs">
              {summary.categoryBreakdowns.map((cat) => (
                <tr key={cat.category} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-4 font-medium text-[#143326]">
                    {cat.category}
                    {cat.isOverAllocated && (
                      <span className="ml-2 text-[11px] text-[#B91C1C]">· Over Allocation</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num">
                    {event.currencySymbol}
                    {cat.allocated.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#4A4F4C]">
                    {event.currencySymbol}
                    {cat.quoted.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#143326]">
                    {event.currencySymbol}
                    {cat.actual.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#137333]">
                    {event.currencySymbol}
                    {cat.paid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#B45309]">
                    {event.currencySymbol}
                    {cat.outstanding.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num">
                    {cat.utilizationPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Expense Line Items List */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Individual Expense Line Items ({event.budgetItems.length})
        </h3>
        <div className="space-y-2.5">
          {event.budgetItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E4DFD7]"
            >
              <div>
                <div className="text-xs text-[#5A605D]">
                  {item.category} ·{' '}
                  {item.isAiEstimate ? 'AI Estimate (With Assumptions)' : 'User/Committed Entry'} ·{' '}
                  {item.isCommitted ? 'Committed' : 'Estimated'}
                </div>
                <div className="text-sm font-medium text-[#143326]">{item.title}</div>
                {item.estimateAssumptions && (
                  <div className="text-[11px] text-[#5A605D] mt-0.5">
                    Assumption: {item.estimateAssumptions}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right font-mono-num text-xs">
                  <div>
                    Alloc: {event.currencySymbol}
                    {item.allocatedAmount.toLocaleString()}
                  </div>
                  <div className="text-[#4A4F4C]">
                    Actual: {event.currencySymbol}
                    {item.actualAmount.toLocaleString()} · Paid: {event.currencySymbol}
                    {item.paidAmount.toLocaleString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteExpense(item.id)}
                  aria-label={`Delete expense '${item.title}'`}
                  className="p-2 text-[#5A605D] hover:text-[#B91C1C] rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Feature 1: Budget Reality Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B] mb-1">
              <Calculator className="w-4 h-4" />
              <span>SIGNATURE FEATURE · BUDGET REALITY CHECK</span>
            </div>
            <h2 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
              Overspending Diagnosis & Trade-Off Analyzer
            </h2>
            <p className="text-xs text-[#4A4F4C] leading-relaxed mb-4">
              {realityCheck.summaryExplanation}
            </p>

            {appliedRealityCheckMessage && (
              <div className="mb-4 p-3 rounded-lg bg-[#E6F4EA] text-[#137333] text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{appliedRealityCheckMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              {realityCheck.overspendingCategories.slice(0, 3).map((item) => (
                <div
                  key={item.category}
                  className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E4DFD7] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-[#143326]">
                    <span>{item.category}</span>
                    <span className="font-mono-num text-[#137333]">
                      Save ~{event.currencySymbol}
                      {item.savingsAmount.toLocaleString()} (→ {event.currencySymbol}
                      {item.recommendedAmount.toLocaleString()})
                    </span>
                  </div>
                  <div className="text-[#4A4F4C]">{item.financialImpact}</div>
                  <div className="text-[#143326]">
                    <span className="font-semibold">Alternative:</span> {item.realisticAlternative}
                  </div>
                  <div className="text-[#5A605D]">
                    <span className="font-semibold">Trade-Off:</span> {item.tradeOff}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E4DFD7] flex items-center justify-between gap-4">
            <div className="text-xs text-[#4A4F4C] font-mono-num">
              Revised Total Allocation: {event.currencySymbol}
              {realityCheck.revisedTotalAllocation.toLocaleString()}
            </div>
            <button
              type="button"
              onClick={handleApplyRealityCheckAllocations}
              className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg cursor-pointer"
            >
              Apply Revised Allocations
            </button>
          </div>
        </div>

        {/* Signature Feature 2: What-If Guest Count Simulator */}
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B] mb-1">
              <Users className="w-4 h-4" />
              <span>WHAT-IF GUEST COUNT SIMULATOR</span>
            </div>
            <h2 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
              "What happens if I change my guest count from {event.guestCount} to {simulatedGuests}?"
            </h2>

            <div className="my-4 p-4 rounded-lg bg-[#F3EFEA] border border-[#D8D1C5]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#143326] mb-2">
                <label htmlFor="whatif-guest-slider">
                  Simulated Guest Count: {simulatedGuests} Guests ({whatIfResult.guestDelta >= 0 ? '+' : ''}
                  {whatIfResult.guestDelta})
                </label>
                <span className="font-mono-num">
                  Projected Delta: {whatIfResult.totalCostDelta >= 0 ? '+' : ''}
                  {event.currencySymbol}
                  {whatIfResult.totalCostDelta.toLocaleString()}
                </span>
              </div>
              <input
                id="whatif-guest-slider"
                type="range"
                min={Math.max(20, Math.round(event.guestCount * 0.5))}
                max={Math.round(event.guestCount * 1.8)}
                step={5}
                value={simulatedGuests}
                onChange={(e) => setSimulatedGuests(Number(e.target.value))}
                className="w-full accent-[#1B4332] cursor-pointer"
              />
            </div>

            {appliedSimulationMessage && (
              <div className="mb-4 p-3 rounded-lg bg-[#E6F4EA] text-[#137333] text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{appliedSimulationMessage}</span>
              </div>
            )}

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {whatIfResult.categoryDeltas
                .filter((d) => d.currentAllocated > 0)
                .map((d) => (
                  <div
                    key={d.category}
                    className="p-2.5 rounded bg-[#FAF8F5] border border-[#E4DFD7] text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium text-[#143326]">{d.category}</div>
                      <div className="text-[11px] text-[#5A605D]">{d.assumptionNote}</div>
                    </div>
                    <div className="text-right font-mono-num shrink-0">
                      <div className="font-semibold text-[#143326]">
                        {event.currencySymbol}
                        {d.projectedAllocated.toLocaleString()}
                      </div>
                      <div
                        className={`text-[11px] ${
                          d.delta > 0
                            ? 'text-[#B45309]'
                            : d.delta < 0
                            ? 'text-[#137333]'
                            : 'text-[#5A605D]'
                        }`}
                      >
                        {d.delta >= 0 ? '+' : ''}
                        {event.currencySymbol}
                        {d.delta.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E4DFD7] flex items-center justify-between gap-4">
            <div className="text-xs text-[#4A4F4C] font-mono-num">
              New Total: {event.currencySymbol}
              {whatIfResult.projectedTotalAllocated.toLocaleString()}
            </div>
            <button
              type="button"
              onClick={handleApplyWhatIfSimulation}
              className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg cursor-pointer"
            >
              Confirm & Apply {simulatedGuests} Guests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
