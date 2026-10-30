import React from 'react';
import { ArrowRight, CheckCircle2, Compass, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { CategoryEditorialArt, HeroCourtyardArtwork } from './BrandIllustrations';
import { EventCategory } from '../types/gatheros';

interface LandingPageProps {
  onPlanMyEvent: (defaultCategory?: EventCategory) => void;
  onExploreDemo: (demoEventId?: string) => void;
  onOpenPresentationMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlanMyEvent,
  onExploreDemo,
  onOpenPresentationMode,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1E1D]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E4DFD7] px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-serif-display text-xl font-semibold tracking-tight text-[#143326] whitespace-nowrap shrink-0"
        >
          GatherOS
        </a>

        <nav
          aria-label="Primary Marketing Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A4F4C]"
        >
          <a
            href="#how-it-works"
            className="hover:text-[#143326] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </a>
          <a
            href="#categories"
            className="hover:text-[#143326] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Categories
          </a>
          <a
            href="#capabilities"
            className="hover:text-[#143326] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Capabilities
          </a>
          <a
            href="#budget-engine"
            className="hover:text-[#143326] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Budget Engine
          </a>
          <a
            href="#stories"
            className="hover:text-[#143326] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Demo Stories
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onPlanMyEvent()}
            className="px-4 py-2 text-sm font-medium text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Plan My Event
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="text-xs font-medium text-[#526058] mb-4 flex items-center gap-2">
              <span>The Celebration Operating System</span>
              <span aria-hidden="true">·</span>
              <span>Big Moments Deserve Intelligent Planning</span>
            </div>

            <h1
              className="font-serif-display text-4xl sm:text-5xl lg:text-[3.5rem] font-medium text-[#143326] tracking-tight leading-[1.08] mb-6"
              style={{ textWrap: 'balance' }}
            >
              Your Celebration. Perfectly Planned.
            </h1>

            <p className="text-base sm:text-lg text-[#3D4340] leading-relaxed max-w-2xl mb-8">
              From the first idea to the final guest goodbye, let AI turn your celebration vision into a beautifully organized reality.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                type="button"
                onClick={() => onPlanMyEvent()}
                className="px-6 py-3.5 text-sm font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Plan My Event</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onExploreDemo('demo-jaipur-wedding')}
                className="px-6 py-3.5 text-sm font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Demo
              </button>

              <button
                type="button"
                onClick={onOpenPresentationMode}
                className="px-4 py-3.5 text-sm font-medium text-[#4A4F4C] hover:text-[#143326] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Presentation Mode Walkthrough
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E4DFD7] max-w-xl">
              <div>
                <div className="font-mono-num text-xl font-semibold text-[#143326]">14-Part</div>
                <div className="text-xs text-[#5A605D] mt-0.5">Structured AI Blueprint</div>
              </div>
              <div>
                <div className="font-mono-num text-xl font-semibold text-[#143326]">8 Stages</div>
                <div className="text-xs text-[#5A605D] mt-0.5">Emotional Moment Map</div>
              </div>
              <div>
                <div className="font-mono-num text-xl font-semibold text-[#143326]">100% Live</div>
                <div className="text-xs text-[#5A605D] mt-0.5">Budget & Scenario Math</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <HeroCourtyardArtwork />
          </div>
        </div>
      </section>

      {/* How GatherOS Works */}
      <section id="how-it-works" className="bg-[#F3EFEA] border-y border-[#E4DFD7] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <div className="text-xs text-[#5A605D] mb-2">End-to-End Celebration Architecture</div>
            <h2 className="font-serif-display text-3xl font-medium text-[#143326] tracking-tight">
              From raw idea to calm, confident execution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                num: '01. Progressive Onboarding',
                title: 'Share your vision, culture & real constraints',
                desc: 'Tell GatherOS your guest count, location, currency, cultural traditions, dietary requirements, and budget cap.',
              },
              {
                num: '02. AI Celebration Blueprint',
                title: 'Receive a 14-point tailored blueprint',
                desc: 'Get a complete theme, color palette, venue checklist, menu direction, and clear explanation of why every choice fits.',
              },
              {
                num: '03. Financial & Vendor Control',
                title: 'Balance every allocation & vendor quote',
                desc: 'Track committed vs paid spend, run a Budget Reality Check, compare vendor quotes transparently, and simulate headcount changes.',
              },
              {
                num: '04. Moment Map Execution',
                title: 'Choreograph the 8 stages of guest joy',
                desc: 'Design the emotional arc from Arrival and Welcome to Highlight Moment and Farewell—complete with backup plans.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono-num text-[#8A6D3B] mb-2">{step.num}</div>
                  <h3 className="font-serif-display text-lg font-medium text-[#143326] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#4A4F4C] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Event Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs text-[#5A605D] mb-2">Purpose-Built Workflows</div>
            <h2 className="font-serif-display text-3xl font-medium text-[#143326] tracking-tight">
              Three celebration categories, deeply understood
            </h2>
          </div>
          <p className="text-sm text-[#4A4F4C] max-w-md">
            Launch a fresh event with progressive onboarding or explore our rich interactive demo datasets immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <CategoryEditorialArt variant="wedding" />
              <div className="text-xs text-[#5A605D] mt-5 mb-1">
                Weddings · Multi-Function · Cultural Traditions
              </div>
              <h3 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
                Weddings & Ceremonies
              </h3>
              <p className="text-sm text-[#4A4F4C] leading-relaxed mb-6">
                Coordinate Mehendi, Sangeet, vows, vegetarian/Jain catering, outstation room blocks, and family rituals without blowing your budget.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#E4DFD7]">
              <button
                type="button"
                onClick={() => onPlanMyEvent('wedding')}
                className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Plan a Wedding
              </button>
              <button
                type="button"
                onClick={() => onExploreDemo('demo-jaipur-wedding')}
                className="px-3 py-2 text-xs font-medium text-[#143326] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Jaipur Wedding Demo →
              </button>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <CategoryEditorialArt variant="birthday" />
              <div className="text-xs text-[#5A605D] mt-5 mb-1">
                Birthdays · Milestone Soirées · Family Gatherings
              </div>
              <h3 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
                Birthdays & Milestones
              </h3>
              <p className="text-sm text-[#4A4F4C] leading-relaxed mb-6">
                Design intimate garden dinners, milestone 40th/50th toasts, kids’ creative parties, custom menus, and personalized place-card moments.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#E4DFD7]">
              <button
                type="button"
                onClick={() => onPlanMyEvent('birthday')}
                className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Plan a Birthday
              </button>
              <button
                type="button"
                onClick={() => onExploreDemo('demo-botanical-birthday')}
                className="px-3 py-2 text-xs font-medium text-[#143326] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open 40th Soirée Demo →
              </button>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <CategoryEditorialArt variant="community" />
              <div className="text-xs text-[#5A605D] mt-5 mb-1">
                Community · Civic Festivals · Cultural Showcases
              </div>
              <h3 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
                Community Events
              </h3>
              <p className="text-sm text-[#4A4F4C] leading-relaxed mb-6">
                Organize neighbourhood festivals, maker markets, sponsor budgets, volunteer shifts, zero-waste stations, and civic permits with ease.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#E4DFD7]">
              <button
                type="button"
                onClick={() => onPlanMyEvent('community')}
                className="px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Plan Community Event
              </button>
              <button
                type="button"
                onClick={() => onExploreDemo('demo-community-festival')}
                className="px-3 py-2 text-xs font-medium text-[#143326] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Harvest Festival Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities & Budget / Vendor / Timeline Intelligence Bento */}
      <section id="capabilities" className="bg-[#F3EFEA] border-y border-[#E4DFD7] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <div className="text-xs text-[#5A605D] mb-2">Intelligent Planning Engine</div>
            <h2 className="font-serif-display text-3xl font-medium text-[#143326] tracking-tight">
              More than a checklist: an operating system for human experiences
            </h2>
          </div>

          <div id="budget-engine" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-7">
              <div className="flex items-center gap-2 text-xs text-[#8A6D3B] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Context-Aware Gather AI Copilot & Budget Reality Check</span>
              </div>
              <h3 className="font-serif-display text-2xl font-medium text-[#143326] mb-3">
                Ask "What happens if my guest count rises from 180 to 220?" and see the exact math
              </h3>
              <p className="text-sm text-[#4A4F4C] leading-relaxed mb-6">
                GatherOS separates fixed vendor fees (Photography, Entertainment) from linear per-head costs (Food & Catering) and step-variable costs (Tables, Linens, Shuttles). When your plan exceeds its target, the Budget Reality Check identifies overspending categories and proposes realistic trade-offs before you commit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E4DFD7]">
                <div>
                  <div className="text-xs text-[#5A605D]">Formula Integrity</div>
                  <div className="text-sm font-semibold text-[#143326] mt-0.5">
                    Allocated · Committed · Paid · Remaining
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#5A605D]">Direct Copilot Actions</div>
                  <div className="text-sm font-semibold text-[#143326] mt-0.5">
                    1-Click Add to Budget, Timeline & Ideas
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#5A605D]">Honest Estimation</div>
                  <div className="text-sm font-semibold text-[#143326] mt-0.5">
                    Transparent Assumptions on Every Estimate
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8A6D3B] mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Signature Differentiator</span>
                </div>
                <h3 className="font-serif-display text-xl font-medium text-[#143326] mb-3">
                  The 8-Stage Moment Map
                </h3>
                <p className="text-sm text-[#4A4F4C] leading-relaxed">
                  Guests don’t remember spreadsheets—they remember how they felt upon Arrival, Welcome, First Impressions, Main Celebration, and Farewell. Map every stage with backup plans and owners.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#E4DFD7] text-xs text-[#5A605D]">
                Arrival → Welcome → First Impressions → Social → Main → Highlight → Dining → Farewell
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-7">
              <div className="flex items-center gap-2 text-xs text-[#8A6D3B] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Vendor & Timeline Intelligence</span>
              </div>
              <h3 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
                Transparent Vendor Comparison
              </h3>
              <p className="text-sm text-[#4A4F4C] leading-relaxed">
                Compare user-recorded quotes side by side across price, quality, and compatibility—with missing information flagged honestly and zero fabricated reviews.
              </p>
            </div>

            <div className="lg:col-span-2 bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-7">
              <div className="flex items-center gap-2 text-xs text-[#8A6D3B] mb-2">
                <Users className="w-4 h-4" />
                <span>Event Scenario Simulator & Privacy-First Guest Hub</span>
              </div>
              <h3 className="font-serif-display text-xl font-medium text-[#143326] mb-2">
                Stress-test monsoon rain, budget cuts, or vendor cancellations safely
              </h3>
              <p className="text-sm text-[#4A4F4C] leading-relaxed">
                Simulate 7 real-world disruptions without overwriting your active plan until you confirm. Track RSVPs, dietary needs, and export clean CSVs while keeping personal guest details protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative Demo Testimonials (Explicitly Labelled per Prompt Requirements) */}
      <section id="stories" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-2xl mb-10">
          <div className="text-xs text-[#8A6D3B] mb-2">
            Illustrative Demo Scenarios · Fictional Use-Case Examples
          </div>
          <h2 className="font-serif-display text-3xl font-medium text-[#143326] tracking-tight">
            How first-time organizers use GatherOS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'We had ₹8,50,000 for 180 guests in Jaipur and felt completely overwhelmed. GatherOS showed us how reusing our daytime Mehendi floral structures with evening brass lanterns saved ₹54,000 while keeping our pure vegetarian & Jain feast untouched.',
              author: 'Aarav & Meera K.',
              role: 'Heritage Courtyard Wedding Scenario · Jaipur (Illustrative Demo Content)',
              metric: 'Saved ₹54,000 via Decor Reuse Plan',
            },
            {
              quote:
                'Mapping out the 8 emotional stages in Moment Map changed everything for my 40th glasshouse dinner. We spotted an arrival bottleneck early and added a second botanical spritz greeting table and hurricane candle sleeves for fire compliance.',
              author: 'Elena V.',
              role: '40th Milestone Glasshouse Dinner · San Francisco (Illustrative Demo Content)',
              metric: '65 Guests · Zero Last-Minute Overruns',
            },
            {
              quote:
                'Coordinating 42 neighbourhood volunteers, 25 maker booths, and a zero-waste enamel mug wash station for 450 attendees used to live in 9 messy spreadsheets. The Scenario Simulator helped us prepare our rain pavilion plan in 3 minutes.',
              author: 'David M., Festival Chair',
              role: 'Oakwood Harvest Festival · Portland (Illustrative Demo Content)',
              metric: '450 Attendees · 98% Waste Diversion Plan',
            },
          ].map((item) => (
            <div
              key={item.author}
              className="bg-[#FAF8F5] border border-[#E4DFD7] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-[#8A6D3B] font-mono-num mb-3">{item.metric}</div>
                <p className="text-sm text-[#2C312E] leading-relaxed mb-6">“{item.quote}”</p>
              </div>
              <div className="pt-4 border-t border-[#E4DFD7]">
                <div className="text-sm font-semibold text-[#143326]">{item.author}</div>
                <div className="text-xs text-[#5A605D] mt-0.5">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call-To-Action */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="bg-[#143326] text-[#FAF8F5] rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-[#2D5A44]">
          <div className="max-w-xl">
            <div className="text-xs text-[#E6CFA0] mb-2">Ready to Start Planning?</div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-medium tracking-tight mb-3">
              Turn your celebration idea into an intelligent blueprint today.
            </h2>
            <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
              Create your custom celebration in 60 seconds or jump straight into our interactive Command Center with three pre-loaded demo events.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onPlanMyEvent()}
              className="px-6 py-3.5 text-sm font-semibold text-[#143326] bg-[#E6CFA0] hover:bg-[#D4B475] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Plan My Event
            </button>
            <button
              type="button"
              onClick={() => onExploreDemo('demo-jaipur-wedding')}
              className="px-6 py-3.5 text-sm font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#255841] border border-[#FAF8F5]/20 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Explore Live Demo Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E4DFD7] py-8 px-6 lg:px-12 text-xs text-[#5A605D]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif-display font-semibold text-[#143326]">GatherOS</span>
            <span aria-hidden="true">·</span>
            <span>Big Moments Deserve Intelligent Planning</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onPlanMyEvent()}
              className="hover:text-[#143326] underline cursor-pointer"
            >
              Create Event
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => onExploreDemo('demo-jaipur-wedding')}
              className="hover:text-[#143326] underline cursor-pointer"
            >
              Command Center
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenPresentationMode}
              className="hover:text-[#143326] underline cursor-pointer"
            >
              Presentation Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
