import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';
import { CelebrationEvent, EventCategory } from '../types/gatheros';

interface OnboardingModalProps {
  isOpen: boolean;
  initialCategory?: EventCategory;
  onClose: () => void;
  onEventCreated: (newEvent: CelebrationEvent) => void;
}

const CURRENCY_MAP: Record<'INR' | 'USD' | 'EUR' | 'GBP', '₹' | '$' | '€' | '£'> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const PRIORITY_OPTIONS = [
  'Venue',
  'Food and catering',
  'Decoration',
  'Photography',
  'Entertainment',
  'Guest experience',
  'Cultural authenticity',
  'Strict budget control',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialCategory = 'wedding',
  onClose,
  onEventCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Core 12 fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EventCategory>(initialCategory);
  const [date, setDate] = useState('2026-12-20');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [targetBudget, setTargetBudget] = useState<number>(750000);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');
  const [preferredTheme, setPreferredTheme] = useState('');
  const [culturalPreferences, setCulturalPreferences] = useState('');
  const [mustHaveExperiences, setMustHaveExperiences] = useState('');
  const [restrictionsOrRequirements, setRestrictionsOrRequirements] = useState('');
  const [planningPriorities, setPlanningPriorities] = useState<string[]>([
    'Venue',
    'Food and catering',
    'Guest experience',
  ]);

  // Progressive disclosure category-specific fields
  // Wedding
  const [weddingStyle, setWeddingStyle] = useState('Heritage Courtyard & Intimate Luxury');
  const [numberOfFunctions, setNumberOfFunctions] = useState<number>(3);
  const [ceremonyPreferences, setCeremonyPreferences] = useState(
    'Outdoor sunset varmala & starlight phere'
  );
  const [familyTraditions, setFamilyTraditions] = useState(
    'Traditional folk welcome & organic marigold haldi'
  );

  // Birthday
  const [ageGroup, setAgeGroup] = useState('30th / 40th Milestone Celebration');
  const [birthdayTheme, setBirthdayTheme] = useState('Candlelit Botanical Garden Dinner');
  const [entertainmentPreferences, setEntertainmentPreferences] = useState(
    'Live acoustic trio & curated vinyl DJ'
  );
  const [foodPreferences, setFoodPreferences] = useState(
    'Family-style seasonal platters & craft mocktail/cocktail bar'
  );

  // Community
  const [eventPurpose, setEventPurpose] = useState('Neighbourhood Cultural & Culinary Festival');
  const [targetAudience, setTargetAudience] = useState('Local families, makers & seniors');
  const [communitySize, setCommunitySize] = useState('300–500 local attendees');
  const [activities, setActivities] = useState('Artisan booths, acoustic stage & youth craft tent');
  const [sponsorsOrVolunteers, setSponsorsOrVolunteers] = useState(
    '25 community volunteers & local business sponsors'
  );

  if (!isOpen) return null;

  const togglePriority = (item: string) => {
    setPlanningPriorities((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const applyQuickPreset = (presetType: EventCategory) => {
    setCategory(presetType);
    setValidationError(null);
    if (presetType === 'wedding') {
      setName('Kabir & Ananya’s Udaipur Courtyard Wedding');
      setLocation('Udaipur, Rajasthan');
      setGuestCount(180);
      setCurrency('INR');
      setTargetBudget(850000);
      setPreferredTheme('Lakeside Sandstone & Marigold Twilight');
      setCulturalPreferences('Rajasthani folk hospitality & traditional North Indian rituals');
      setMustHaveExperiences('Folk welcome, live chaat street, starlight phere, kulhad kesar milk');
      setRestrictionsOrRequirements('Pure vegetarian + dedicated Jain counter; elder step-free access');
    } else if (presetType === 'birthday') {
      setName('Maya’s 30th Starlight Rooftop Conservatory Dinner');
      setLocation('Bengaluru / Indiranagar');
      setGuestCount(70);
      setCurrency('INR');
      setTargetBudget(220000);
      setPreferredTheme('Terracotta & Botanical Candlelight');
      setCulturalPreferences('Modern Indian-Mediterranean tapas & storytelling toasts');
      setMustHaveExperiences('Botanical zero-proof bar, acoustic guitar duo, Polaroid wall');
      setRestrictionsOrRequirements('Vegan & gluten-free options clearly marked');
    } else {
      setName('Greenwood Neighbourhood Monsoon Craft & Music Mela');
      setLocation('Pune Civic Amphitheatre');
      setGuestCount(350);
      setCurrency('INR');
      setTargetBudget(450000);
      setPreferredTheme('Zero-Waste Handloom & Bamboo Commons');
      setCulturalPreferences('Inclusive regional folk arts, pottery makers & community dining');
      setMustHaveExperiences('20 artisan stalls, acoustic folk stage, reusable clay kulhad hub');
      setRestrictionsOrRequirements('100% plastic-free event; wheelchair accessible pathways');
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim() || !location.trim() || !date.trim()) {
        setValidationError('Please enter an event name, location, and date before continuing.');
        return;
      }
      if (guestCount <= 0) {
        setValidationError('Estimated number of guests must be at least 1.');
        return;
      }
      setValidationError(null);
      setStep(2);
    } else if (step === 2) {
      if (targetBudget <= 0) {
        setValidationError('Please enter a valid positive total budget.');
        return;
      }
      setValidationError(null);
      setStep(3);
    }
  };

  const handleGenerateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || guestCount <= 0 || targetBudget <= 0) {
      setValidationError('Please complete all required event details.');
      return;
    }

    setIsGenerating(true);
    setValidationError(null);

    const basePayload: Partial<CelebrationEvent> = {
      name: name.trim(),
      category,
      date,
      location: location.trim(),
      guestCount: Number(guestCount),
      targetBudget: Number(targetBudget),
      currency,
      currencySymbol: CURRENCY_MAP[currency],
      preferredTheme: preferredTheme.trim() || 'Warm Editorial Heritage & Candlelight',
      culturalPreferences:
        culturalPreferences.trim() || 'Thoughtful hospitality and local culinary traditions',
      mustHaveExperiences:
        mustHaveExperiences.trim() || 'Warm welcome ritual, signature dining & memorable farewell',
      restrictionsOrRequirements:
        restrictionsOrRequirements.trim() || 'Accessible seating and clearly labelled dietary options',
      planningPriorities,
      ...(category === 'wedding'
        ? {
            weddingSpecifics: {
              weddingStyle,
              numberOfFunctions: Number(numberOfFunctions) || 1,
              ceremonyPreferences,
              familyTraditions,
            },
          }
        : {}),
      ...(category === 'birthday'
        ? {
            birthdaySpecifics: {
              ageGroup,
              birthdayTheme,
              entertainmentPreferences,
              foodPreferences,
            },
          }
        : {}),
      ...(category === 'community'
        ? {
            communitySpecifics: {
              eventPurpose,
              targetAudience,
              communitySize,
              activities,
              sponsorsOrVolunteers,
            },
          }
        : {}),
    };

    try {
      const response = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basePayload),
      });
      const generated = await response.json();

      const newEvent: CelebrationEvent = {
        id: `event-${Date.now()}`,
        name: basePayload.name!,
        category: basePayload.category!,
        date: basePayload.date!,
        location: basePayload.location!,
        guestCount: basePayload.guestCount!,
        targetBudget: basePayload.targetBudget!,
        currency: basePayload.currency!,
        currencySymbol: basePayload.currencySymbol!,
        preferredTheme: basePayload.preferredTheme!,
        culturalPreferences: basePayload.culturalPreferences!,
        mustHaveExperiences: basePayload.mustHaveExperiences!,
        restrictionsOrRequirements: basePayload.restrictionsOrRequirements!,
        planningPriorities: basePayload.planningPriorities!,
        weddingSpecifics: basePayload.weddingSpecifics,
        birthdaySpecifics: basePayload.birthdaySpecifics,
        communitySpecifics: basePayload.communitySpecifics,
        isDemo: false,
        blueprint: generated.blueprint,
        budgetItems: generated.budgetItems || [],
        timelineTasks: generated.timelineTasks || [],
        vendors: [],
        guests: [],
        ideas: generated.ideas || [],
        momentMap: generated.momentMap || [],
        copilotHistory: [
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `I have generated your custom Celebration Blueprint for **${basePayload.name}** (${basePayload.guestCount} guests in ${basePayload.location} · ${basePayload.currencySymbol}${basePayload.targetBudget?.toLocaleString()} target budget). Explore your 14-point Blueprint, Smart Budget allocations, Timeline milestones, and 8-stage Moment Map—or ask me anything right here!`,
            timestamp: new Date().toISOString(),
            reasoning: generated.blueprint?.whyItMatches,
            aiMode: generated.aiMode || 'live',
          },
        ],
      };

      onEventCreated(newEvent);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Unable to generate blueprint. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 bg-[#143326]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-[#FAF8F5] border border-[#D8D1C5] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-xl my-8">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E4DFD7]">
          <div>
            <div className="text-xs text-[#8A6D3B] font-mono-num mb-1">
              EVENT CREATION STUDIO · STEP {step} OF 3
            </div>
            <h2
              id="onboarding-modal-title"
              className="font-serif-display text-2xl font-medium text-[#143326]"
            >
              {step === 1 && '01. Celebration Identity & Category'}
              {step === 2 && '02. Budget, Theme & Category Details'}
              {step === 3 && '03. Cultural Traditions, Priorities & AI Blueprint'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Event Creation Studio"
            className="p-2 text-[#5A605D] hover:text-[#143326] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Prefill Strip for Fast Testing & Live Demos */}
        <div className="mt-4 bg-[#F3EFEA] border border-[#E4DFD7] rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#4A4F4C]">
            Want to test with realistic pre-filled inputs? Load a template:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => applyQuickPreset('wedding')}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded text-[#143326] font-medium cursor-pointer"
            >
              Prefill Indian Wedding
            </button>
            <button
              type="button"
              onClick={() => applyQuickPreset('birthday')}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded text-[#143326] font-medium cursor-pointer"
            >
              Prefill 30th Birthday
            </button>
            <button
              type="button"
              onClick={() => applyQuickPreset('community')}
              className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E7E1D8] border border-[#D8D1C5] rounded text-[#143326] font-medium cursor-pointer"
            >
              Prefill Community Mela
            </button>
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#991B1B]"
          >
            {validationError}
          </div>
        )}

        <form onSubmit={handleGenerateBlueprint} className="mt-6 space-y-5">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#143326] mb-2">
                  Select Celebration Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'wedding', label: 'Wedding' },
                      { id: 'birthday', label: 'Birthday' },
                      { id: 'community', label: 'Community Event' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                        category === cat.id
                          ? 'bg-[#1B4332] text-[#FAF8F5] border-[#1B4332]'
                          : 'bg-[#FAF8F5] text-[#1C1E1D] border-[#D8D1C5] hover:bg-[#F3EFEA]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="event-name-input"
                    className="block text-xs font-semibold text-[#143326] mb-1.5"
                  >
                    1. Event Name *
                  </label>
                  <input
                    id="event-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Aarav & Meera’s Jaipur Wedding"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-location-input"
                    className="block text-xs font-semibold text-[#143326] mb-1.5"
                  >
                    4. Event Location (City / Venue Type) *
                  </label>
                  <input
                    id="event-location-input"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Jaipur, Rajasthan"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="event-date-input"
                    className="block text-xs font-semibold text-[#143326] mb-1.5"
                  >
                    3. Event Date *
                  </label>
                  <input
                    id="event-date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="event-guests-input"
                    className="block text-xs font-semibold text-[#143326] mb-1.5"
                  >
                    5. Estimated Number of Guests *
                  </label>
                  <input
                    id="event-guests-input"
                    type="number"
                    min={1}
                    max={10000}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="event-currency-select"
                    className="block text-xs font-semibold text-[#143326] mb-1.5"
                  >
                    7. Currency
                  </label>
                  <select
                    id="event-currency-select"
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value as 'INR' | 'USD' | 'EUR' | 'GBP')
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                  >
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                    <option value="EUR">EUR (€ Euro)</option>
                    <option value="GBP">GBP (£ British Pound)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="event-budget-input"
                    className="block text-xs font-semibold text-[#143326] mb-1.5"
                  >
                    6. Total Target Budget ({CURRENCY_MAP[currency]}) *
                  </label>
                  <input
                    id="event-budget-input"
                    type="number"
                    min={100}
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="event-theme-input"
                  className="block text-xs font-semibold text-[#143326] mb-1.5"
                >
                  8. Preferred Theme or Atmosphere
                </label>
                <input
                  id="event-theme-input"
                  type="text"
                  value={preferredTheme}
                  onChange={(e) => setPreferredTheme(e.target.value)}
                  placeholder="e.g., Elegant outdoor heritage courtyard with warm brass candlelight"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-lg focus:outline-none focus:border-[#1B4332]"
                />
              </div>

              {/* Progressive Disclosure by Event Type */}
              {category === 'wedding' && (
                <div className="p-4 bg-[#F3EFEA] border border-[#E4DFD7] rounded-xl space-y-4">
                  <div className="text-xs font-semibold text-[#143326]">
                    Wedding-Specific Planning Details (Progressive Disclosure)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="wedding-style-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Wedding Style
                      </label>
                      <input
                        id="wedding-style-input"
                        type="text"
                        value={weddingStyle}
                        onChange={(e) => setWeddingStyle(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="wedding-functions-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Number of Functions
                      </label>
                      <input
                        id="wedding-functions-input"
                        type="number"
                        min={1}
                        max={10}
                        value={numberOfFunctions}
                        onChange={(e) => setNumberOfFunctions(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm font-mono-num bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="wedding-ceremony-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Ceremony Preferences
                      </label>
                      <input
                        id="wedding-ceremony-input"
                        type="text"
                        value={ceremonyPreferences}
                        onChange={(e) => setCeremonyPreferences(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="wedding-traditions-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Family Traditions
                      </label>
                      <input
                        id="wedding-traditions-input"
                        type="text"
                        value={familyTraditions}
                        onChange={(e) => setFamilyTraditions(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'birthday' && (
                <div className="p-4 bg-[#F3EFEA] border border-[#E4DFD7] rounded-xl space-y-4">
                  <div className="text-xs font-semibold text-[#143326]">
                    Birthday-Specific Planning Details (Progressive Disclosure)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="birthday-age-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Age Group / Milestone
                      </label>
                      <input
                        id="birthday-age-input"
                        type="text"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birthday-theme-detail"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Birthday Theme
                      </label>
                      <input
                        id="birthday-theme-detail"
                        type="text"
                        value={birthdayTheme}
                        onChange={(e) => setBirthdayTheme(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birthday-ent-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Entertainment Preferences
                      </label>
                      <input
                        id="birthday-ent-input"
                        type="text"
                        value={entertainmentPreferences}
                        onChange={(e) => setEntertainmentPreferences(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birthday-food-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Food Preferences
                      </label>
                      <input
                        id="birthday-food-input"
                        type="text"
                        value={foodPreferences}
                        onChange={(e) => setFoodPreferences(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'community' && (
                <div className="p-4 bg-[#F3EFEA] border border-[#E4DFD7] rounded-xl space-y-4">
                  <div className="text-xs font-semibold text-[#143326]">
                    Community Event Planning Details (Progressive Disclosure)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="comm-purpose-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Event Purpose
                      </label>
                      <input
                        id="comm-purpose-input"
                        type="text"
                        value={eventPurpose}
                        onChange={(e) => setEventPurpose(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="comm-audience-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Target Audience & Community Size
                      </label>
                      <input
                        id="comm-audience-input"
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="comm-activities-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Key Activities
                      </label>
                      <input
                        id="comm-activities-input"
                        type="text"
                        value={activities}
                        onChange={(e) => setActivities(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="comm-sponsors-input"
                        className="block text-xs text-[#4A4F4C] mb-1"
                      >
                        Sponsors or Volunteers
                      </label>
                      <input
                        id="comm-sponsors-input"
                        type="text"
                        value={sponsorsOrVolunteers}
                        onChange={(e) => setSponsorsOrVolunteers(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="event-culture-input"
                  className="block text-xs font-semibold text-[#143326] mb-1"
                >
                  9. Cultural Preferences & Traditions
                </label>
                <input
                  id="event-culture-input"
                  type="text"
                  value={culturalPreferences}
                  onChange={(e) => setCulturalPreferences(e.target.value)}
                  placeholder="e.g., Traditional Rajasthani welcome, bilingual vows, folk ensemble"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="event-musthave-input"
                  className="block text-xs font-semibold text-[#143326] mb-1"
                >
                  10. Must-Have Guest Experiences
                </label>
                <input
                  id="event-musthave-input"
                  type="text"
                  value={mustHaveExperiences}
                  onChange={(e) => setMustHaveExperiences(e.target.value)}
                  placeholder="e.g., Live chaat street, kulhad saffron milk, instant photo guestbook"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="event-restrictions-input"
                  className="block text-xs font-semibold text-[#143326] mb-1"
                >
                  11. Important Restrictions or Requirements
                </label>
                <input
                  id="event-restrictions-input"
                  type="text"
                  value={restrictionsOrRequirements}
                  onChange={(e) => setRestrictionsOrRequirements(e.target.value)}
                  placeholder="e.g., Pure vegetarian + Jain counter, elder wheelchair access, 10 PM outdoor sound limit"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D1C5] rounded-lg"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#143326] mb-2">
                  12. Top Planning Priorities (Select any)
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_OPTIONS.map((p) => {
                    const active = planningPriorities.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePriority(p)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1B4332] text-[#FAF8F5] border-[#1B4332]'
                            : 'bg-white text-[#3D4340] border-[#D8D1C5] hover:bg-[#F3EFEA]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-5 border-t border-[#E4DFD7]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                className="px-4 py-2.5 text-xs font-semibold text-[#143326] bg-[#F3EFEA] hover:bg-[#E7E1D8] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 text-xs font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 text-sm font-semibold text-[#FAF8F5] bg-[#1B4332] hover:bg-[#143326] disabled:opacity-60 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Celebration Blueprint...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E6CFA0]" />
                    <span>Generate My Celebration Blueprint</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
