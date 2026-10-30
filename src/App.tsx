/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Compass,
  FileText,
  Home,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Presentation,
  Sliders,
  Sparkles,
  Store,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { INITIAL_DEMO_EVENTS } from './data/demoEvents';
import { CelebrationEvent, EventCategory } from './types/gatheros';
import { GatherLogoMark } from './components/BrandIllustrations';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { BlueprintView } from './components/BlueprintView';
import { CopilotView } from './components/CopilotView';
import { BudgetView } from './components/BudgetView';
import { TimelineView } from './components/TimelineView';
import { VendorView } from './components/VendorView';
import { GuestView } from './components/GuestView';
import { IdeasView } from './components/IdeasView';
import { MomentMapView } from './components/MomentMapView';
import { ScenarioSimulatorView } from './components/ScenarioSimulatorView';
import { PresentationModeView } from './components/PresentationModeView';

const LOCAL_STORAGE_KEY = 'gatheros_celebration_events_v1';
const ACTIVE_EVENT_KEY = 'gatheros_active_event_id_v1';

type WorkspaceTab =
  | 'dashboard'
  | 'blueprint'
  | 'copilot'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'guests'
  | 'ideas'
  | 'moment-map'
  | 'simulator'
  | 'presentation';

export default function App() {
  // Support ?autostart=1 to skip intro/landing screen directly to main workspace
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return false;
      }
    }
    return true;
  });

  const [events, setEvents] = useState<CelebrationEvent[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial demo events
    }
    return INITIAL_DEMO_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_EVENT_KEY) || INITIAL_DEMO_EVENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingCategory, setOnboardingCategory] = useState<EventCategory>('wedding');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState({
    configured: false,
    provider: 'gemini',
    model: 'gemini-3.8-flash',
    mode: 'preview_fallback',
  });

  // Load initial server events & AI status
  useEffect(() => {
    fetch('/api/ai/status')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.configured === 'boolean') {
          setAiStatus(data);
        }
      })
      .catch(() => {});

    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.events) && data.events.length > 0) {
          const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (!localRaw) {
            setEvents(data.events);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.events));
          }
        }
      })
      .catch(() => {});
  }, []);

  const activeEvent =
    events.find((e) => e.id === activeEventId) || events[0] || INITIAL_DEMO_EVENTS[0];

  const handleUpdateEvent = (updated: CelebrationEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === updated.id);
      const next = exists
        ? prev.map((e) => (e.id === updated.id ? updated : e))
        : [updated, ...prev];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: updated }),
    }).catch(() => {});
  };

  const handleEventCreated = (newEvent: CelebrationEvent) => {
    handleUpdateEvent(newEvent);
    setActiveEventId(newEvent.id);
    localStorage.setItem(ACTIVE_EVENT_KEY, newEvent.id);
    setIsOnboardingOpen(false);
    setShowLanding(false);
    setActiveTab('blueprint');
  };

  const handleSelectEvent = (eventId: string) => {
    setActiveEventId(eventId);
    localStorage.setItem(ACTIVE_EVENT_KEY, eventId);
  };

  const handleResetDemoData = async () => {
    try {
      const res = await fetch('/api/events/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data && Array.isArray(data.events)) {
        setEvents(data.events);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.events));
        setActiveEventId(data.events[0].id);
        return;
      }
    } catch {
      // Fallback local reset
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS)) as CelebrationEvent[];
    setEvents(fresh);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fresh));
    setActiveEventId(fresh[0].id);
  };

  const navItems: Array<{ id: WorkspaceTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'blueprint', label: 'Event Blueprint', icon: <FileText className="w-4 h-4" /> },
    { id: 'copilot', label: 'Gather AI Copilot', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'budget', label: 'Smart Budget', icon: <Wallet className="w-4 h-4" /> },
    { id: 'timeline', label: 'Event Timeline', icon: <Calendar className="w-4 h-4" /> },
    { id: 'vendors', label: 'Vendor Studio', icon: <Store className="w-4 h-4" /> },
    { id: 'guests', label: 'Guest Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'ideas', label: 'Ideas Studio', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'moment-map', label: 'Moment Map', icon: <Compass className="w-4 h-4" /> },
    { id: 'simulator', label: 'Scenario Simulator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'presentation', label: 'Presentation Mode', icon: <Presentation className="w-4 h-4" /> },
  ];

  if (showLanding) {
    return (
      <>
        <LandingPage
          onPlanMyEvent={(cat) => {
            if (cat) setOnboardingCategory(cat);
            setIsOnboardingOpen(true);
          }}
          onExploreDemo={(demoId) => {
            if (demoId) handleSelectEvent(demoId);
            setShowLanding(false);
            setActiveTab('dashboard');
          }}
          onOpenPresentationMode={() => {
            setShowLanding(false);
            setActiveTab('presentation');
          }}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          initialCategory={onboardingCategory}
          onClose={() => setIsOnboardingOpen(false)}
          onEventCreated={handleEventCreated}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1E1D] flex flex-col lg:flex-row">
      {/* Desktop Sidebar Navigation (260px) */}
      <aside
        aria-label="Workspace Sidebar Navigation"
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#F3EFEA] border-r border-[#E4DFD7] justify-between p-5"
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <GatherLogoMark className="w-7 h-7" />
              <span className="font-serif-display text-xl font-semibold text-[#143326] tracking-tight">
                GatherOS
              </span>
            </button>
          </div>

          {/* Active Event Switcher Card */}
          <div className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl space-y-2">
            <label
              htmlFor="sidebar-event-select"
              className="block text-[11px] font-mono-num text-[#8A6D3B]"
            >
              ACTIVE CELEBRATION
            </label>
            <select
              id="sidebar-event-select"
              value={activeEvent.id}
              onChange={(e) => handleSelectEvent(e.target.value)}
              className="w-full text-xs font-semibold text-[#143326] bg-transparent focus:outline-none cursor-pointer truncate"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} {ev.isDemo ? '[DEMO]' : ''}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-[#5A605D] truncate">
              {activeEvent.location} · {activeEvent.guestCount} Guests
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Celebration Workspace Sections" className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1B4332] text-[#FAF8F5]'
                      : 'text-[#3D4340] hover:bg-[#E7E1D8] hover:text-[#143326]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-[#D8D1C5]">
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full py-2.5 px-4 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors cursor-pointer"
          >
            + Plan New Event
          </button>
          <button
            type="button"
            onClick={() => setShowLanding(true)}
            className="w-full py-2 px-3 text-xs font-medium text-[#4A4F4C] hover:text-[#143326] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Welcome Page</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#FAF8F5] border-b border-[#E4DFD7] px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-[#143326] rounded-lg hover:bg-[#F3EFEA]"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif-display text-lg font-semibold text-[#143326]">GatherOS</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOnboardingOpen(true)}
          className="px-3 py-1.5 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] rounded-lg whitespace-nowrap shrink-0"
        >
          + New Event
        </button>
      </header>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#143326]/50" onClick={() => setIsMobileSidebarOpen(false)}>
          <div
            className="w-72 h-full bg-[#F3EFEA] p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif-display text-xl font-semibold text-[#143326]">
                  GatherOS
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  aria-label="Close Menu"
                  className="p-1.5 text-[#4A4F4C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg ${
                      activeTab === item.id
                        ? 'bg-[#1B4332] text-[#FAF8F5]'
                        : 'text-[#3D4340] hover:bg-[#E7E1D8]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileSidebarOpen(false);
                setShowLanding(true);
              }}
              className="w-full py-2 text-xs text-[#4A4F4C] border-t border-[#D8D1C5] pt-4 text-left"
            >
              ← Back to Welcome Page
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Workspace Top Breadcrumb Bar (SaaS Top Bar Contract) */}
        <div className="hidden lg:flex items-center justify-between gap-8 px-10 py-3.5 bg-[#FAF8F5] border-b border-[#E4DFD7]">
          <div className="text-xs text-[#5A605D] flex items-center gap-2 truncate">
            <span>GatherOS Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#143326] font-medium truncate">{activeEvent.name}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#8A6D3B] font-medium">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('copilot')}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8A6D3B]" />
              <span>Gather AI Copilot</span>
            </button>
          </div>
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              event={activeEvent}
              allEvents={events}
              onSelectEvent={handleSelectEvent}
              onNavigateTab={(t) => setActiveTab(t as WorkspaceTab)}
              onOpenNewEventModal={() => setIsOnboardingOpen(true)}
            />
          )}

          {activeTab === 'blueprint' && (
            <BlueprintView
              event={activeEvent}
              onUpdateEvent={handleUpdateEvent}
              onNavigateTab={(t) => setActiveTab(t as WorkspaceTab)}
            />
          )}

          {activeTab === 'copilot' && (
            <CopilotView
              event={activeEvent}
              aiStatus={aiStatus}
              onUpdateEvent={handleUpdateEvent}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'timeline' && (
            <TimelineView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'vendors' && (
            <VendorView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'guests' && (
            <GuestView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'ideas' && (
            <IdeasView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'moment-map' && (
            <MomentMapView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'simulator' && (
            <ScenarioSimulatorView event={activeEvent} onUpdateEvent={handleUpdateEvent} />
          )}

          {activeTab === 'presentation' && (
            <PresentationModeView
              activeEvent={activeEvent}
              allEvents={events}
              aiStatus={aiStatus}
              onSelectEvent={handleSelectEvent}
              onNavigateTab={(t) => setActiveTab(t as WorkspaceTab)}
              onOpenNewEventModal={() => setIsOnboardingOpen(true)}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Intelligent Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialCategory={onboardingCategory}
        onClose={() => setIsOnboardingOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}
