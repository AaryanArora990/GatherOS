import React, { useState } from 'react';
import { AlertTriangle, Plus, Scale, Trash2 } from 'lucide-react';
import {
  ALL_VENDOR_CATEGORIES,
  CelebrationEvent,
  VendorCategoryName,
  VendorItem,
} from '../types/gatheros';
import { compareVendorsByCategory } from '../utils/planningEngine';

interface VendorViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

export const VendorView: React.FC<VendorViewProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategoryName | 'All'>('All');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategoryName>('Venues');
  const [contactName, setContactName] = useState('');
  const [contactEmailOrPhone, setContactEmailOrPhone] = useState('');
  const [quotationAmount, setQuotationAmount] = useState<string>('');
  const [bookingStatus, setBookingStatus] = useState<VendorItem['bookingStatus']>('Shortlisted');
  const [availabilityStatus, setAvailabilityStatus] =
    useState<VendorItem['availabilityStatus']>('Available');
  const [serviceQualityScore, setServiceQualityScore] = useState<number>(4);
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const comparedList = compareVendorsByCategory(
    event.vendors,
    selectedCategory,
    event.targetBudget
  );

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a vendor name.');
      return;
    }

    const newVendor: VendorItem = {
      id: `ven-${Date.now()}`,
      name: name.trim(),
      category,
      contactName: contactName.trim() || 'Primary Coordinator',
      contactEmailOrPhone: contactEmailOrPhone.trim(),
      location: event.location,
      quotationAmount: Number(quotationAmount) || 0,
      bookingStatus,
      paymentStatus: bookingStatus === 'Booked' ? 'Deposit Paid' : 'Unpaid',
      serviceQualityScore,
      eventCompatibilityScore: 4,
      availabilityStatus,
      negotiationNotes: negotiationNotes.trim(),
      isSampleDemoData: false,
    };

    onUpdateEvent({
      ...event,
      vendors: [newVendor, ...event.vendors],
    });

    setName('');
    setContactName('');
    setContactEmailOrPhone('');
    setQuotationAmount('');
    setNegotiationNotes('');
    setError(null);
  };

  const handleUpdateBookingStatus = (vendorId: string, status: VendorItem['bookingStatus']) => {
    onUpdateEvent({
      ...event,
      vendors: event.vendors.map((v) => (v.id === vendorId ? { ...v, bookingStatus: status } : v)),
    });
  };

  const handleDeleteVendor = (vendorId: string) => {
    onUpdateEvent({
      ...event,
      vendors: event.vendors.filter((v) => v.id !== vendorId),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            VENDOR MANAGEMENT STUDIO & TRANSPARENT QUOTE COMPARISON
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Vendor Coordination — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            Record real quotations, negotiation notes, and booking statuses. Sample demonstration vendors are explicitly labelled.
          </p>
        </div>

        <div>
          <label htmlFor="vendor-category-filter" className="sr-only">
            Filter Vendors by Category
          </label>
          <select
            id="vendor-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as VendorCategoryName | 'All')}
            className="px-3.5 py-2 text-xs font-medium bg-white border border-[#D8D1C5] rounded-lg text-[#143326]"
          >
            <option value="All">All Categories ({event.vendors.length})</option>
            {ALL_VENDOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add User Vendor Form */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <h2 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Add Vendor Quotation & Contact Record
        </h2>
        {error && (
          <div role="alert" className="mb-3 p-3 rounded-lg bg-[#FEF2F2] text-xs text-[#991B1B]">
            {error}
          </div>
        )}
        <form onSubmit={handleAddVendor} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label htmlFor="vendor-name-input" className="block text-xs text-[#4A4F4C] mb-1">
                Vendor Name *
              </label>
              <input
                id="vendor-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Heritage Floral Co."
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="vendor-cat-select" className="block text-xs text-[#4A4F4C] mb-1">
                Category
              </label>
              <select
                id="vendor-cat-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategoryName)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              >
                {ALL_VENDOR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vendor-quote-input" className="block text-xs text-[#4A4F4C] mb-1">
                Quotation ({event.currencySymbol})
              </label>
              <input
                id="vendor-quote-input"
                type="number"
                min={0}
                value={quotationAmount}
                onChange={(e) => setQuotationAmount(e.target.value)}
                placeholder="85000"
                className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="vendor-contact-input" className="block text-xs text-[#4A4F4C] mb-1">
                Contact Phone / Email
              </label>
              <input
                id="vendor-contact-input"
                type="text"
                value={contactEmailOrPhone}
                onChange={(e) => setContactEmailOrPhone(e.target.value)}
                placeholder="contact@vendor.com"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="vendor-avail-select" className="block text-xs text-[#4A4F4C] mb-1">
                Availability
              </label>
              <select
                id="vendor-avail-select"
                value={availabilityStatus}
                onChange={(e) =>
                  setAvailabilityStatus(e.target.value as VendorItem['availabilityStatus'])
                }
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              >
                <option value="Available">Available</option>
                <option value="Tentative">Tentative</option>
                <option value="Unknown">Unknown (Unconfirmed)</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label htmlFor="vendor-notes-input" className="block text-xs text-[#4A4F4C] mb-1">
                Negotiation Notes & Package Inclusions
              </label>
              <input
                id="vendor-notes-input"
                type="text"
                value={negotiationNotes}
                onChange={(e) => setNegotiationNotes(e.target.value)}
                placeholder="e.g., Includes setup, teardown, and backup generator"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="vendor-rating-select" className="block text-xs text-[#4A4F4C] mb-1">
                Your Quality Rating (1–5)
              </label>
              <select
                id="vendor-rating-select"
                value={serviceQualityScore}
                onChange={(e) => setServiceQualityScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
              >
                <option value={5}>5 / 5 — Exceptional</option>
                <option value={4}>4 / 5 — Strong</option>
                <option value={3}>3 / 5 — Standard</option>
                <option value={2}>2 / 5 — Below Average</option>
                <option value={1}>1 / 5 — Poor</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-2 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Vendor</span>
            </button>
          </div>
        </form>
      </div>

      {/* Smart Vendor Comparison Matrix */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-[#E4DFD7] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B] mb-1">
              <Scale className="w-4 h-4" />
              <span>SMART VENDOR COMPARISON ENGINE</span>
            </div>
            <h2 className="font-serif-display text-xl font-medium text-[#143326]">
              Side-by-Side Quotation, Compatibility & Missing-Data Analysis
            </h2>
          </div>
        </div>

        {comparedList.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#5A605D]">
            No vendors recorded in "{selectedCategory}" yet. Add a vendor above to compare options.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {comparedList.map((item) => {
              const { vendor } = item;
              return (
                <div
                  key={vendor.id}
                  className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-[#5A605D]">
                          {vendor.category} · {vendor.location} ·{' '}
                          {vendor.isSampleDemoData
                            ? 'SAMPLE DEMO DATA (Fictional Illustration)'
                            : 'User Recorded Vendor'}
                        </div>
                        <h3 className="font-serif-display text-lg font-medium text-[#143326] mt-0.5">
                          {vendor.name}
                        </h3>
                      </div>

                      <div className="text-right font-mono-num shrink-0">
                        <div className="text-base font-semibold text-[#143326]">
                          {vendor.quotationAmount > 0
                            ? `${event.currencySymbol}${vendor.quotationAmount.toLocaleString()}`
                            : 'Quote Pending'}
                        </div>
                        <div className="text-[11px] text-[#5A605D]">
                          {item.budgetSharePercent}% of Target · Fit Score: {item.comparisonScore}/100
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-[#4A4F4C] space-y-1">
                      <div>
                        Contact: {vendor.contactName} ({vendor.contactEmailOrPhone || 'Not recorded'})
                      </div>
                      {vendor.negotiationNotes && <div>Notes: {vendor.negotiationNotes}</div>}
                    </div>

                    {/* Missing Information Transparency Alert */}
                    {item.missingFields.length > 0 && (
                      <div className="mt-3 p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Missing Information Identified: </span>
                          {item.missingFields.join(' · ')}
                        </div>
                      </div>
                    )}

                    {/* AI Advantages & Disadvantages */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E4DFD7] text-xs">
                      <div>
                        <div className="font-semibold text-[#137333] mb-1">Advantages</div>
                        <ul className="space-y-1 text-[#3D4340]">
                          {item.advantages.map((adv, i) => (
                            <li key={i}>· {adv}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold text-[#B45309] mb-1">
                          Watch-Outs / Trade-Offs
                        </div>
                        <ul className="space-y-1 text-[#3D4340]">
                          {item.disadvantages.length > 0 ? (
                            item.disadvantages.map((dis, i) => <li key={i}>· {dis}</li>)
                          ) : (
                            <li>· Complete documentation & balanced pricing</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E4DFD7] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`status-${vendor.id}`} className="text-xs text-[#5A605D]">
                        Status:
                      </label>
                      <select
                        id={`status-${vendor.id}`}
                        value={vendor.bookingStatus}
                        onChange={(e) =>
                          handleUpdateBookingStatus(
                            vendor.id,
                            e.target.value as VendorItem['bookingStatus']
                          )
                        }
                        className="px-2.5 py-1 text-xs bg-white border border-[#D8D1C5] rounded text-[#143326]"
                      >
                        <option value="Researching">Researching</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Negotiating">Negotiating</option>
                        <option value="Booked">Booked</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      aria-label={`Delete vendor '${vendor.name}'`}
                      className="p-1.5 text-[#5A605D] hover:text-[#B91C1C] rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
