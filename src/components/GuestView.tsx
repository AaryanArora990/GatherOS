import React, { useState } from 'react';
import { Copy, Check, Download, Mail, Plus, Shield, Trash2 } from 'lucide-react';
import { CelebrationEvent, GuestItem } from '../types/gatheros';
import { exportGuestsToCsv } from '../utils/planningEngine';

interface GuestViewProps {
  event: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
}

export const GuestView: React.FC<GuestViewProps> = ({ event, onUpdateEvent }) => {
  const [fullName, setFullName] = useState('');
  const [group, setGroup] = useState('Family');
  const [attendingCount, setAttendingCount] = useState<number>(2);
  const [rsvpStatus, setRsvpStatus] = useState<GuestItem['rsvpStatus']>('Pending');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Privacy-First AI Invitation Drafter state
  const [draftGroup, setDraftGroup] = useState('Family & Close Friends');
  const [draftTone, setDraftTone] = useState('Warm, poetic & welcoming');
  const [inviteDraft, setInviteDraft] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalInvitedHouseholds = event.guests.length;
  const totalHeadcountConfirmed = event.guests
    .filter((g) => g.rsvpStatus === 'Confirmed')
    .reduce((sum, g) => sum + g.attendingCount, 0);
  const confirmedHouseholds = event.guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const pendingHouseholds = event.guests.filter((g) => g.rsvpStatus === 'Pending').length;
  const declinedHouseholds = event.guests.filter((g) => g.rsvpStatus === 'Declined').length;

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter a guest or family name.');
      return;
    }

    const newGuest: GuestItem = {
      id: `guest-${Date.now()}`,
      fullName: fullName.trim(),
      group: group.trim() || 'Friends',
      invitationSent: false,
      rsvpStatus,
      attendingCount: Math.max(0, Number(attendingCount) || 1),
      dietaryPreferences: dietaryPreferences.trim() || 'Standard / Not specified',
      isDemoData: false,
    };

    onUpdateEvent({
      ...event,
      guests: [newGuest, ...event.guests],
    });
    setFullName('');
    setDietaryPreferences('');
    setError(null);
  };

  const handleUpdateRsvp = (guestId: string, status: GuestItem['rsvpStatus']) => {
    onUpdateEvent({
      ...event,
      guests: event.guests.map((g) => (g.id === guestId ? { ...g, rsvpStatus: status } : g)),
    });
  };

  const handleToggleInviteSent = (guestId: string) => {
    onUpdateEvent({
      ...event,
      guests: event.guests.map((g) =>
        g.id === guestId ? { ...g, invitationSent: !g.invitationSent } : g
      ),
    });
  };

  const handleDeleteGuest = (guestId: string) => {
    onUpdateEvent({
      ...event,
      guests: event.guests.filter((g) => g.id !== guestId),
    });
  };

  const handleExportCsv = () => {
    const csvContent = exportGuestsToCsv(event.guests);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.name.toLowerCase().replace(/\s+/g, '-')}-guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateInviteDraft = async () => {
    setIsDrafting(true);
    try {
      const res = await fetch('/api/ai/invite-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: event.name,
          category: event.category,
          date: event.date,
          location: event.location,
          theme: event.preferredTheme,
          culturalPreferences: event.culturalPreferences,
          groupName: draftGroup,
          tone: draftTone,
        }),
      });
      const data = await res.json();
      setInviteDraft(data.draft || '');
    } catch (err) {
      console.error('Error drafting invitation:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopyDraft = () => {
    if (!inviteDraft) return;
    navigator.clipboard?.writeText(inviteDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD7]">
        <div>
          <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
            PRIVACY-FIRST GUEST MANAGEMENT & RSVP TRACKER
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#143326]">
            Guest Directory & Attendance — {event.name}
          </h1>
          <p className="text-xs text-[#4A4F4C] mt-1">
            Personal guest contact data stays local to your workspace and is never transmitted to external AI providers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 text-xs font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded-lg flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Attendance Overview KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Target Capacity</div>
          <div className="font-mono-num text-xl font-semibold text-[#143326] mt-1">
            {event.guestCount}
          </div>
        </div>
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Confirmed Attendance</div>
          <div className="font-mono-num text-xl font-semibold text-[#137333] mt-1">
            {totalHeadcountConfirmed} Guests
          </div>
          <div className="text-[11px] text-[#5A605D] font-mono-num">
            {confirmedHouseholds} Households
          </div>
        </div>
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Total Invited Groups</div>
          <div className="font-mono-num text-xl font-semibold text-[#143326] mt-1">
            {totalInvitedHouseholds}
          </div>
        </div>
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Pending RSVPs</div>
          <div className="font-mono-num text-xl font-semibold text-[#B45309] mt-1">
            {pendingHouseholds}
          </div>
        </div>
        <div className="bg-white border border-[#E4DFD7] rounded-xl p-4">
          <div className="text-xs text-[#5A605D]">Declined</div>
          <div className="font-mono-num text-xl font-semibold text-[#5A605D] mt-1">
            {declinedHouseholds}
          </div>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="bg-white border border-[#E4DFD7] rounded-xl p-6">
        <h2 className="font-serif-display text-lg font-medium text-[#143326] mb-4">
          Add Guest or Family Group
        </h2>
        {error && (
          <div role="alert" className="mb-3 p-3 rounded-lg bg-[#FEF2F2] text-xs text-[#991B1B]">
            {error}
          </div>
        )}
        <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="guest-name-input" className="block text-xs text-[#4A4F4C] mb-1">
              Guest / Household Name *
            </label>
            <input
              id="guest-name-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Arjun & Priya Verma Family"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="guest-group-input" className="block text-xs text-[#4A4F4C] mb-1">
              Guest Group
            </label>
            <input
              id="guest-group-input"
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="e.g., Bride Family"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="guest-count-input" className="block text-xs text-[#4A4F4C] mb-1">
              Guest Count
            </label>
            <input
              id="guest-count-input"
              type="number"
              min={1}
              max={500}
              value={attendingCount}
              onChange={(e) => setAttendingCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="guest-diet-input" className="block text-xs text-[#4A4F4C] mb-1">
              Dietary Preferences (Voluntary)
            </label>
            <input
              id="guest-diet-input"
              type="text"
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              placeholder="e.g., Jain / Vegan"
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>
        </form>
      </div>

      {/* Guest List & Privacy-First Invitation Drafter Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#E4DFD7] rounded-xl p-6 space-y-3">
          <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
            Guest & Household List ({event.guests.length})
          </h3>
          {event.guests.map((guest) => (
            <div
              key={guest.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E4DFD7]"
            >
              <div>
                <div className="text-xs text-[#5A605D]">
                  {guest.group} · <span className="font-mono-num">{guest.attendingCount} Guests</span> · Dietary: {guest.dietaryPreferences}
                </div>
                <div className="text-sm font-medium text-[#143326]">{guest.fullName}</div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleInviteSent(guest.id)}
                  className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                    guest.invitationSent
                      ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                      : 'bg-white text-[#4A4F4C] border-[#D8D1C5]'
                  }`}
                >
                  {guest.invitationSent ? 'Invite Sent' : 'Mark Invite Sent'}
                </button>

                <label htmlFor={`rsvp-${guest.id}`} className="sr-only">
                  RSVP Status for {guest.fullName}
                </label>
                <select
                  id={`rsvp-${guest.id}`}
                  value={guest.rsvpStatus}
                  onChange={(e) =>
                    handleUpdateRsvp(guest.id, e.target.value as GuestItem['rsvpStatus'])
                  }
                  className="px-2.5 py-1 text-xs bg-white border border-[#D8D1C5] rounded text-[#143326]"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Declined">Declined</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteGuest(guest.id)}
                  aria-label={`Remove guest '${guest.fullName}'`}
                  className="p-1.5 text-[#5A605D] hover:text-[#B91C1C] rounded cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy-First AI Invitation Drafter */}
        <div className="lg:col-span-5 bg-white border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-[#8A6D3B] mb-1">
              <Mail className="w-4 h-4" />
              <span>AI INVITATION MESSAGE DRAFTER</span>
            </div>
            <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
              Draft Personalized Cultural Invitations
            </h3>
            <div className="p-3 rounded-lg bg-[#F3EFEA] border border-[#D8D1C5] text-[11px] text-[#4A4F4C] flex items-start gap-2 mb-4">
              <Shield className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
              <span>
                Privacy Guarantee: Only your event theme and group label are used to draft copy. Personal guest names/contacts are never sent to AI, and messages are never sent automatically.
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="invite-group-input" className="block text-xs text-[#4A4F4C] mb-1">
                  Target Guest Group Label
                </label>
                <input
                  id="invite-group-input"
                  type="text"
                  value={draftGroup}
                  onChange={(e) => setDraftGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="invite-tone-input" className="block text-xs text-[#4A4F4C] mb-1">
                  Invitation Tone
                </label>
                <input
                  id="invite-tone-input"
                  type="text"
                  value={draftTone}
                  onChange={(e) => setDraftTone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D1C5] rounded-lg"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateInviteDraft}
                disabled={isDrafting}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg cursor-pointer"
              >
                {isDrafting ? 'Drafting Invitation Copy...' : 'Draft Personalized Invitation'}
              </button>
            </div>

            {inviteDraft && (
              <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#D8D1C5] space-y-3">
                <div className="text-xs whitespace-pre-line text-[#1C1E1D] leading-relaxed">
                  {inviteDraft}
                </div>
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="px-3 py-1.5 text-xs font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Invitation Text'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
