import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_DEMO_EVENTS } from './src/data/demoEvents';
import {
  ALL_MOMENT_STAGES,
  BudgetExpenseItem,
  CelebrationEvent,
  CopilotAction,
  CreativeIdea,
  EventBlueprint,
  MomentStage,
  TimelineTask,
} from './src/types/gatheros';
import { calculateBudgetSummary } from './src/utils/planningEngine';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'gatheros-events.json');

function getConfiguredApiKey(): string | undefined {
  const raw = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!raw || raw === 'MY_GEMINI_API_KEY' || raw.trim() === '') {
    return undefined;
  }
  return raw.trim();
}

function getAiModelName(): string {
  const configured = process.env.AI_MODEL?.trim();
  if (configured && !configured.includes('1.5') && !configured.includes('2.0')) {
    return configured;
  }
  return 'gemini-3.8-flash';
}

function createGenAiClient(): GoogleGenAI | null {
  const apiKey = getConfiguredApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      ...(process.env.AI_BASE_URL ? { baseUrl: process.env.AI_BASE_URL } : {}),
    },
  });
}

function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI request timed out')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function loadEventsFromDisk(): CelebrationEvent[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DEMO_EVENTS, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS));
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error loading persisted events, using initial demo events:', err);
  }
  return JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS));
}

function saveEventsToDisk(events: CelebrationEvent[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving persisted events:', err);
  }
}

/**
 * Generates a complete, deeply contextual event blueprint & starter plan
 * when live AI is unavailable or quota-limited, ensuring 100% reliability.
 */
function buildContextualBlueprintFallback(payload: Partial<CelebrationEvent>): {
  blueprint: EventBlueprint;
  budgetItems: BudgetExpenseItem[];
  timelineTasks: TimelineTask[];
  ideas: CreativeIdea[];
  momentMap: MomentStage[];
} {
  const name = payload.name || 'Bespoke Celebration';
  const category = payload.category || 'wedding';
  const location = payload.location || 'Jaipur';
  const guestCount = Number(payload.guestCount) || 150;
  const targetBudget = Number(payload.targetBudget) || 500000;
  const sym = payload.currencySymbol || '₹';
  const theme = payload.preferredTheme || 'Warm Editorial Heritage & Candlelight';
  const culture = payload.culturalPreferences || 'Heartfelt hospitality & regional culinary traditions';
  const mustHaves = payload.mustHaveExperiences || 'Live acoustic welcome, curated dining, memorable farewell keepsakes';
  const restrictions = payload.restrictionsOrRequirements || 'Step-free elder access and clear dietary labelling';

  const blueprint: EventBlueprint = {
    eventConcept: `A tailored ${category} experience in ${location} for ${guestCount} guests ("${name}"), harmonizing ${theme} aesthetics with ${culture} inside a disciplined ${sym}${targetBudget.toLocaleString()} budget.`,
    personalizedTheme: theme,
    colorPalette: [
      { name: 'Deep Forest Canopy', hex: '#1B4332', usage: 'Primary drapery, welcome signage & table accents' },
      { name: 'Warm Alabaster Ivory', hex: '#FAF8F5', usage: 'Table linens, architectural canopies & stationery' },
      { name: 'Champagne Brass', hex: '#C5A059', usage: 'Candleholders, tableware & warm lighting accents' },
      { name: 'Spiced Terracotta', hex: '#9E473B', usage: 'Seasonal floral highlights & textile borders' },
    ],
    decorationRecommendations: [
      `Anchor the main ${location} venue space with seasonal local botanicals and warm amber uplighting aligned with "${theme}".`,
      'Use reusable brass hurricane lanterns and draped organic cotton/linen to create high visual warmth without disposable plastic props.',
      'Design a focal welcome archway that transitions seamlessly into the main celebration photo backdrop.',
    ],
    venueConsiderations: [
      `Select a venue in ${location} comfortable for ${guestCount} guests with both open-air ambiance and an immediate weatherproof indoor hall.`,
      `Strictly enforce requirement: ${restrictions}.`,
    ],
    foodAndCateringRecommendations: [
      `Design a multi-sensory menu celebrating ${culture} with live interactive stations for ${guestCount} guests.`,
      `Clearly label all dietary stations (${restrictions}) and provide table service for senior family members.`,
    ],
    entertainmentSuggestions: [
      `Open with live acoustic instrumentation during guest arrival, building to curated celebration music and ${mustHaves}.`,
    ],
    guestExperienceIdeas: [
      `Incorporate your must-have vision (${mustHaves}) into the Welcome and Highlight stages of the Moment Map.`,
      'Provide personalized welcome notes and locally crafted take-home favors.',
    ],
    vendorCategoriesNeeded: [
      'Venues',
      'Caterers',
      'Decorators',
      'Photographers',
      'DJs and entertainers',
      'Transportation',
      'Invitation designers',
    ],
    priorityChecklist: [
      `Lock ${location} venue & weather backup for ${guestCount} guests`,
      `Confirm catering per-plate pricing within ${sym}${Math.round((targetBudget * 0.32) / Math.max(1, guestCount)).toLocaleString()}/guest`,
      `Approve "${theme}" lighting & botanical decor plot`,
      'Send digital RSVP suite and dietary preference form',
    ],
    riskAndContingency: [
      'Weather shift: Keep a 72-hour tenting or indoor hall switch protocol ready at the venue.',
      `Budget protection: Hold 5% (${sym}${Math.round(targetBudget * 0.05).toLocaleString()}) in untouched Emergency Reserve.`,
    ],
    personalizedRecommendations: [
      `By concentrating 60% of your ${sym}${targetBudget.toLocaleString()} budget on Venue and Food & Catering, ${guestCount} guests will experience genuine hospitality without overspending on one-time stage props.`,
    ],
    whyItMatches: `Specifically calibrated for ${guestCount} guests in ${location} with a ${sym}${targetBudget.toLocaleString()} target budget, honoring "${culture}" and "${restrictions}".`,
  };

  const ratios: Array<{ category: BudgetExpenseItem['category']; title: string; ratio: number; isAi: boolean }> = [
    { category: 'Venue', title: `${location} Venue & Weather Backup Buyout`, ratio: 0.28, isAi: true },
    { category: 'Food and catering', title: `Curated Catering & Beverage Service (${guestCount} Guests)`, ratio: 0.32, isAi: true },
    { category: 'Decoration', title: `${theme} Botanical & Lighting Production`, ratio: 0.13, isAi: true },
    { category: 'Photography', title: 'Documentary Photography & Highlight Cinema', ratio: 0.09, isAi: true },
    { category: 'Entertainment', title: 'Live Acoustic Welcome & Celebration Sound/DJ', ratio: 0.06, isAi: true },
    { category: 'Accommodation', title: 'Out-of-Town Guest Room Block Allocation', ratio: 0.03, isAi: true },
    { category: 'Transportation', title: 'Scheduled Guest Shuttle Transfers', ratio: 0.02, isAi: true },
    { category: 'Invitations', title: 'Digital RSVP Suite & Keepsake Stationery', ratio: 0.01, isAi: true },
    { category: 'Miscellaneous', title: 'Welcome Hospitality Kits & Guest Favors', ratio: 0.01, isAi: true },
    { category: 'Emergency reserve', title: 'Protected 5% Contingency Reserve', ratio: 0.05, isAi: true },
  ];

  const budgetItems: BudgetExpenseItem[] = ratios.map((r, idx) => {
    const amount = Math.round(targetBudget * r.ratio);
    return {
      id: `gen-b-${Date.now()}-${idx}`,
      category: r.category,
      title: r.title,
      allocatedAmount: amount,
      plannedAmount: amount,
      vendorQuotationAmount: 0,
      actualAmount: idx < 2 ? amount : 0,
      paidAmount: idx === 0 ? Math.round(amount * 0.4) : 0,
      isCommitted: idx < 2,
      isAiEstimate: r.isAi,
      estimateAssumptions: `AI estimated at ${Math.round(r.ratio * 100)}% of ${sym}${targetBudget.toLocaleString()} for ${guestCount} guests in ${location}.`,
    };
  });

  const eventDateMs = payload.date ? new Date(payload.date).getTime() : Date.now() + 45 * 86400000;
  const makeDate = (daysBefore: number) =>
    new Date(Math.max(Date.now() + 2 * 86400000, eventDateMs - daysBefore * 86400000))
      .toISOString()
      .split('T')[0];

  const timelineTasks: TimelineTask[] = [
    {
      id: `gen-t-${Date.now()}-1`,
      title: `Confirm ${location} Venue Contract & Weather Backup Plan`,
      milestoneCategory: 'Booking deadline',
      dueDate: makeDate(40),
      priority: 'High',
      status: 'In Progress',
      assignedPerson: 'Lead Organizer',
      progress: 50,
    },
    {
      id: `gen-t-${Date.now()}-2`,
      title: `Finalize Menu Tasting & "${restrictions}" Dietary Counter`,
      milestoneCategory: 'Catering finalization',
      dueDate: makeDate(28),
      priority: 'High',
      status: 'Pending',
      assignedPerson: 'Catering Coordinator',
      progress: 0,
    },
    {
      id: `gen-t-${Date.now()}-3`,
      title: `Send Digital Invitations & Collect RSVPs for ${guestCount} Guests`,
      milestoneCategory: 'Invitation deadline',
      dueDate: makeDate(25),
      priority: 'High',
      status: 'Pending',
      assignedPerson: 'Hospitality Lead',
      progress: 0,
    },
    {
      id: `gen-t-${Date.now()}-4`,
      title: `Approve "${theme}" Floral, Lighting & Table Layout`,
      milestoneCategory: 'Decoration planning',
      dueDate: makeDate(15),
      priority: 'Medium',
      status: 'Pending',
      assignedPerson: 'Design Lead',
      progress: 0,
    },
    {
      id: `gen-t-${Date.now()}-5`,
      title: 'Distribute Moment Map & Final Headcount to All Vendors',
      milestoneCategory: 'Final event-day preparation',
      dueDate: makeDate(3),
      priority: 'High',
      status: 'Pending',
      assignedPerson: 'Lead Organizer',
      progress: 0,
    },
  ];

  const ideas: CreativeIdea[] = [
    {
      id: `gen-i-${Date.now()}-1`,
      title: `Signature "${theme}" Welcome Ritual`,
      category: 'Memorable experiences',
      description: `Greet all ${guestCount} guests with a locally inspired botanical refresher and acoustic welcome melody rooted in ${culture}.`,
      culturalContext: culture,
      estimatedCost: Math.round(targetBudget * 0.015),
      isSaved: true,
      isFavorite: true,
    },
    {
      id: `gen-i-${Date.now()}-2`,
      title: 'Zero-Foam Seasonal Botanical & Candlelight Tablescape',
      category: 'Sustainable event practices',
      description: 'Use local seasonal foliage, terracotta/brass vessels, and beeswax candles that guests can take home afterward.',
      culturalContext: 'Sustainable luxury design',
      estimatedCost: Math.round(targetBudget * 0.02),
      isSaved: true,
      isFavorite: false,
    },
  ];

  const momentMap: MomentStage[] = ALL_MOMENT_STAGES.map((stage, idx) => ({
    stage,
    desiredExperience:
      idx === 0
        ? `Seamless, welcoming arrival in ${location} with clear wayfinding for all ${guestCount} guests.`
        : idx === 5
        ? `Unforgettable emotional centerpiece featuring ${mustHaves}.`
        : `Thoughtfully paced ${stage.toLowerCase()} aligned with ${theme}.`,
    activities: [`Curated ${stage.toLowerCase()} touchpoint`, `Hospitality check for ${guestCount} guests`],
    preparationRequirements: [`Brief coordinator 30 mins prior to ${stage}`],
    responsiblePerson: 'Event Coordinator',
    estimatedExpense: Math.round((targetBudget * 0.08) / (idx + 1)),
    potentialIssues: 'Timing drift or guest bottleneck during transition.',
    backupArrangements: 'Stagger flow with two parallel hospitality hosts and clear acoustic cues.',
  }));

  return { blueprint, budgetItems, timelineTasks, ideas, momentMap };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // 1. Events Persistence Routes
  app.get('/api/events', (_req, res) => {
    const events = loadEventsFromDisk();
    res.json({ events });
  });

  app.post('/api/events', (req, res) => {
    const { event, events: bulkEvents } = req.body as {
      event?: CelebrationEvent;
      events?: CelebrationEvent[];
    };
    if (Array.isArray(bulkEvents)) {
      saveEventsToDisk(bulkEvents);
      res.json({ events: bulkEvents });
      return;
    }
    if (!event || !event.id) {
      res.status(400).json({ error: 'Valid event object with id is required' });
      return;
    }
    const existing = loadEventsFromDisk();
    const idx = existing.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      existing[idx] = event;
    } else {
      existing.unshift(event);
    }
    saveEventsToDisk(existing);
    res.json({ event, events: existing });
  });

  app.post('/api/events/reset-demo', (_req, res) => {
    const existing = loadEventsFromDisk();
    const userCreatedEvents = existing.filter((e) => !e.isDemo);
    const freshDemos: CelebrationEvent[] = JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS));
    const combined = [...freshDemos, ...userCreatedEvents];
    saveEventsToDisk(combined);
    res.json({ events: combined });
  });

  // 2. AI Status Route
  app.get('/api/ai/status', (_req, res) => {
    const hasKey = Boolean(getConfiguredApiKey());
    res.json({
      configured: hasKey,
      provider: process.env.AI_PROVIDER || 'gemini',
      model: getAiModelName(),
      mode: hasKey ? 'live' : 'preview_fallback',
    });
  });

  // 3. AI Blueprint Generation Route (Onboarding -> Full Event Blueprint)
  app.post('/api/ai/blueprint', async (req, res) => {
    const payload = req.body as Partial<CelebrationEvent>;
    const fallback = buildContextualBlueprintFallback(payload);
    const ai = createGenAiClient();

    if (!ai) {
      res.json({
        ...fallback,
        aiMode: 'preview_fallback',
        notice: 'Generated using GatherOS Contextual Planning Engine (Preview Mode — configure GEMINI_API_KEY in Settings > Secrets for live LLM generation).',
      });
      return;
    }

    try {
      const prompt = `Generate a comprehensive, culturally sensitive, and financially realistic Event Blueprint for this celebration:
Event Name: ${payload.name}
Category: ${payload.category}
Date: ${payload.date}
Location: ${payload.location}
Guest Count: ${payload.guestCount}
Total Target Budget: ${payload.currencySymbol}${payload.targetBudget} (${payload.currency})
Preferred Theme: ${payload.preferredTheme}
Cultural Preferences: ${payload.culturalPreferences}
Must-Have Experiences: ${payload.mustHaveExperiences}
Restrictions / Requirements: ${payload.restrictionsOrRequirements}
Priorities: ${(payload.planningPriorities || []).join(', ')}
Specific Details: ${JSON.stringify(
        payload.weddingSpecifics || payload.birthdaySpecifics || payload.communitySpecifics || {}
      )}

Explain WHY your recommendations match the user's event, budget, preferences, and constraints.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: getAiModelName(),
          contents: prompt,
          config: {
            systemInstruction:
              'You are GatherOS, an elite AI celebration architect and financial event operations strategist. Return structured JSON matching the schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                eventConcept: { type: Type.STRING },
                personalizedTheme: { type: Type.STRING },
                colorPalette: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      hex: { type: Type.STRING },
                      usage: { type: Type.STRING },
                    },
                  },
                },
                decorationRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                venueConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
                foodAndCateringRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                entertainmentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                guestExperienceIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                vendorCategoriesNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                priorityChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskAndContingency: { type: Type.ARRAY, items: { type: Type.STRING } },
                personalizedRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                whyItMatches: { type: Type.STRING },
              },
            },
          },
        }),
        4000
      );

      const parsedBlueprint = JSON.parse((response.text ?? '{}').trim()) as Partial<EventBlueprint>;
      const mergedBlueprint: EventBlueprint = {
        ...fallback.blueprint,
        ...parsedBlueprint,
        colorPalette:
          parsedBlueprint.colorPalette && parsedBlueprint.colorPalette.length > 0
            ? parsedBlueprint.colorPalette
            : fallback.blueprint.colorPalette,
      };

      res.json({
        blueprint: mergedBlueprint,
        budgetItems: fallback.budgetItems,
        timelineTasks: fallback.timelineTasks,
        ideas: fallback.ideas,
        momentMap: fallback.momentMap,
        aiMode: 'live',
      });
    } catch (err) {
      console.warn('Live Gemini blueprint call fell back to contextual engine:', err);
      res.json({
        ...fallback,
        aiMode: 'preview_fallback',
        notice: 'Live AI quota/connection unavailable; generated using GatherOS Contextual Planning Engine.',
      });
    }
  });

  // 4. Context-Aware Gather AI Copilot Route
  app.post('/api/ai/copilot', async (req, res) => {
    const { event, userMessage } = req.body as {
      event: CelebrationEvent;
      userMessage: string;
    };

    if (!event || !userMessage) {
      res.status(400).json({ error: 'event and userMessage are required' });
      return;
    }

    const summary = calculateBudgetSummary(event);
    const q = userMessage.toLowerCase();

    // Build deterministic context-grounded response + actions so fallback or augmentation is always rich
    const buildContextualCopilotReply = () => {
      const sym = event.currencySymbol;
      const actions: CopilotAction[] = [];
      let content = '';
      let reasoning = `Analyzed ${event.name} (${event.guestCount} guests in ${event.location}, target ${sym}${event.targetBudget.toLocaleString()}, allocated ${sym}${summary.totalAllocatedBudget.toLocaleString()}, actual ${sym}${summary.actualExpenses.toLocaleString()}).`;

      if (q.includes('reduce') || q.includes('save') || q.includes('exceed') || q.includes('budget') || q.includes('prioritize')) {
        const savings = Math.round(event.targetBudget * 0.08);
        content = `Based on **${event.name}** (${event.guestCount} guests in ${event.location}), your total allocated budget is **${sym}${summary.totalAllocatedBudget.toLocaleString()}** against a target of **${sym}${event.targetBudget.toLocaleString()}**, with **${sym}${summary.actualExpenses.toLocaleString()}** in actual recorded expenses (${summary.utilizationPercentage}% utilized).\n\nHere are 3 concrete ways to recover **~${sym}${savings.toLocaleString()}** immediately without compromising hospitality:\n1. **Multi-Function Decor Reuse:** Repurpose daytime floral structures into the evening reception by swapping marigold garlands for brass candle hurricanes (saves ~${sym}${Math.round(savings * 0.45).toLocaleString()}).\n2. **Curated Signature Stations:** Focus Food & Catering on 3 high-impact regional live counters rather than an oversized buffet.\n3. **Digital-First RSVP Suite:** Keep printed keepsake invitations strictly for elders and VIPs.`;
        actions.push({
          id: `act-${Date.now()}-1`,
          type: 'add_task',
          label: 'Add to Timeline: Audit Decor Reuse with Decorator',
          description: 'Creates a High-Priority task to reuse floral frames across functions.',
          payload: {
            title: `Audit multi-function decor reuse to save ${sym}${Math.round(savings * 0.45).toLocaleString()}`,
            milestoneCategory: 'Decoration planning',
            priority: 'High',
          },
        });
        actions.push({
          id: `act-${Date.now()}-2`,
          type: 'save_idea',
          label: 'Save Idea: Brass Hurricane Candlelight Swap',
          description: 'Saves this cost-saving lighting concept to your Ideas Studio.',
          payload: {
            title: 'Multi-Function Brass Hurricane & Local Foliage Swap',
            category: 'Decoration',
            description: `Repurpose structural arches from afternoon to evening using brass lanterns to save ${sym}${Math.round(savings * 0.45).toLocaleString()}.`,
            estimatedCost: Math.round(event.targetBudget * 0.03),
          },
        });
      } else if (q.includes('guest') || q.includes('increase')) {
        const extraGuests = Math.max(20, Math.round(event.guestCount * 0.2));
        const newTotalGuests = event.guestCount + extraGuests;
        const perGuestFood = Math.round((event.targetBudget * 0.32) / Math.max(1, event.guestCount));
        const extraCost = extraGuests * perGuestFood;
        content = `If your guest count for **${event.name}** increases from **${event.guestCount} to ${newTotalGuests} guests (+${extraGuests} guests)**:\n\n- **Food & Catering Impact:** At your current ~${sym}${perGuestFood.toLocaleString()}/guest catering tier, expect an estimated **+${sym}${extraCost.toLocaleString()}** increase.\n- **Seating & Centerpieces:** You will need **${Math.ceil(extraGuests / 8)} additional dining tables** and floral centerpieces.\n- **Fixed Costs Unchanged:** Your Photography and Entertainment fees stay constant.\n\nYou can also model exact headcount numbers interactively in the **Smart Budget Planner → What-If Simulator**.`;
        actions.push({
          id: `act-${Date.now()}-3`,
          type: 'add_budget',
          label: `Add to Budget: +${extraGuests} Guest Catering Buffer (${sym}${extraCost.toLocaleString()})`,
          description: 'Adds an estimated catering buffer line item for additional guests.',
          payload: {
            category: 'Food and catering',
            title: `Supplemental Catering Buffer (+${extraGuests} Guests Estimate)`,
            allocatedAmount: extraCost,
            plannedAmount: extraCost,
          },
        });
      } else if (q.includes('menu') || q.includes('vegetarian') || q.includes('food')) {
        const menuBudget = Math.round(event.targetBudget * 0.04);
        content = `Here is a curated menu concept tailored for **${event.name}** (${event.guestCount} guests in ${event.location}, honoring *${event.restrictionsOrRequirements}*):\n\n- **Welcome Refreshment:** Rosewater & saffron-cardamom thandai / botanical spritz served in terracotta kulhads or chilled coupe glasses.\n- **Interactive Live Starters:** Crisp Palak Patta Chaat, Jodhpuri Mirchi Vada, and charred herb flatbreads.\n- **Main Feast:** Heritage Dal Baati Churma / Saffron Cauliflower Steak, Paneer & Seasonal Vegetable Royal Thali, with a clearly separated **Strict Jain / Root-Free Counter**.\n- **Late-Evening Finale:** Piping hot Jalebi-Rabri & Kesar Badam Milk under the stars.`;
        actions.push({
          id: `act-${Date.now()}-4`,
          type: 'save_idea',
          label: 'Save Idea: Artisanal Vegetarian & Jain Live Menu',
          description: 'Saves this bespoke menu concept to your Personalized Ideas Studio.',
          payload: {
            title: 'Artisanal Vegetarian & Dedicated Jain Live Feast',
            category: 'Food',
            description: 'Live Palak Patta Chaat, separated Jain counter, and late-night kulhad Kesar milk.',
            estimatedCost: menuBudget,
          },
        });
        actions.push({
          id: `act-${Date.now()}-5`,
          type: 'add_task',
          label: 'Add to Timeline: Lock Vegetarian & Jain Tasting',
          description: 'Adds a catering confirmation task to your Event Timeline.',
          payload: {
            title: 'Confirm dedicated Jain & vegetarian live station layout with Caterer',
            milestoneCategory: 'Catering finalization',
            priority: 'High',
          },
        });
      } else if (q.includes('rain') || q.includes('weather') || q.includes('backup')) {
        const tentCost = Math.round(event.targetBudget * 0.05);
        content = `Here is a proactive **Weather & Outdoor Backup Plan** for **${event.name}** in ${event.location}:\n\n1. **72-Hour Weather Lock:** Establish a T-72 hour decision checkpoint with your venue manager to deploy waterproof clear-span canopies or shift into the indoor hall.\n2. **Arrival Comfort (Moment Map Stage 1):** Station 30 oversized umbrellas and warm spiced welcome drinks at the entrance gate.\n3. **Acoustic & Power Protection:** Place all sound consoles and decorative brass uplights on elevated waterproof risers.`;
        actions.push({
          id: `act-${Date.now()}-6`,
          type: 'add_task',
          label: 'Add to Timeline: 72-Hour Weather Tenting Checkpoint',
          description: 'Adds a High-Priority weather readiness milestone to your Timeline.',
          payload: {
            title: 'Execute 72-hour weather forecast review & canopy standby check',
            milestoneCategory: 'Final event-day preparation',
            priority: 'High',
          },
        });
        actions.push({
          id: `act-${Date.now()}-7`,
          type: 'add_budget',
          label: `Add to Budget: Weather Canopy Hold (${sym}${tentCost.toLocaleString()})`,
          description: 'Allocates a weather protection line item in Emergency Reserve.',
          payload: {
            category: 'Emergency reserve',
            title: 'Weatherproof Canopy & Umbrella Valet Standby Estimate',
            allocatedAmount: tentCost,
            plannedAmount: tentCost,
          },
        });
      } else {
        const pendingCount = event.timelineTasks.filter((t) => t.status !== 'Completed').length;
        content = `For **${event.name}** (${event.guestCount} guests in ${event.location} on ${event.date}):\n\n- **Financial Snapshot:** ${sym}${summary.actualExpenses.toLocaleString()} actual spend out of ${sym}${summary.totalAllocatedBudget.toLocaleString()} allocated (${sym}${summary.remainingBudget.toLocaleString()} remaining).\n- **Timeline Priority:** You have **${pendingCount} active milestones** remaining. Focus this week on locking final catering headcounts, confirming vendor load-in windows, and walking through your 8-stage **Moment Map**.\n- **Experience Enhancement:** Introduce a tactile welcome touchpoint (local craft artisan or handwritten place cards) so guests feel immersed from the first 5 minutes.`;
        actions.push({
          id: `act-${Date.now()}-8`,
          type: 'add_task',
          label: 'Add to Timeline: Complete Weekly Vendor Sync',
          description: 'Adds a milestone task to verify vendor load-in and headcount.',
          payload: {
            title: `Sync with Venue & Caterer for ${event.guestCount}-guest layout in ${event.location}`,
            milestoneCategory: 'Preparation milestone',
            priority: 'High',
          },
        });
        actions.push({
          id: `act-${Date.now()}-9`,
          type: 'save_idea',
          label: 'Save Idea: Handwritten Welcome Place Cards',
          description: 'Saves personalized guest place cards to your Ideas Studio.',
          payload: {
            title: 'Calligraphed Guest Memory Place Cards',
            category: 'Guest activities',
            description: 'Personal 1-sentence note at every seat to spark immediate table conversation.',
            estimatedCost: Math.round(event.targetBudget * 0.01),
          },
        });
      }

      return { content, reasoning, actions };
    };

    const fallbackReply = buildContextualCopilotReply();
    const ai = createGenAiClient();

    if (!ai) {
      res.json({
        ...fallbackReply,
        aiMode: 'preview_fallback',
      });
      return;
    }

    try {
      const prompt = `Active Event Context:
- Name: ${event.name} (${event.category})
- Date & Location: ${event.date} in ${event.location}
- Guests: ${event.guestCount}
- Target Budget: ${event.currencySymbol}${event.targetBudget}
- Total Allocated Budget: ${event.currencySymbol}${summary.totalAllocatedBudget}
- Actual Expenses: ${event.currencySymbol}${summary.actualExpenses}
- Remaining Budget: ${event.currencySymbol}${summary.remainingBudget}
- Theme: ${event.preferredTheme}
- Cultural Preferences: ${event.culturalPreferences}
- Restrictions: ${event.restrictionsOrRequirements}
- Pending Tasks: ${event.timelineTasks
        .filter((t) => t.status !== 'Completed')
        .map((t) => `${t.title} (Due ${t.dueDate})`)
        .join('; ')}

User Question: "${userMessage}"

Provide a concise, practical, encouraging response grounded in the exact numbers and details above, plus why your recommendations fit.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: getAiModelName(),
          contents: prompt,
          config: {
            systemInstruction:
              'You are Gather AI Copilot, an intelligent, warm, and practical celebration strategist. Always reference the exact event name, budget figures, guest count, and cultural context. Return JSON.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                reasoning: { type: Type.STRING },
              },
            },
          },
        }),
        4000
      );

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        content?: string;
        reasoning?: string;
      };

      res.json({
        content: parsed.content || fallbackReply.content,
        reasoning: parsed.reasoning || fallbackReply.reasoning,
        actions: fallbackReply.actions,
        aiMode: 'live',
      });
    } catch (err) {
      console.warn('Copilot live call fell back to contextual engine:', err);
      res.json({
        ...fallbackReply,
        aiMode: 'preview_fallback',
      });
    }
  });

  // 5. Privacy-First AI Invitation Drafter Route
  app.post('/api/ai/invite-draft', async (req, res) => {
    const { eventName, category, date, location, theme, culturalPreferences, groupName, tone } =
      req.body as Record<string, string>;

    const fallbackDraft = `Dear Friends & Family (${groupName || 'Honored Guests'}),\n\nWith great joy, we invite you to celebrate **${eventName}** with us on **${date}** at **${location}**.\n\nInspired by *${theme}* and our cherished traditions (*${culturalPreferences}*), we have planned an evening of warm conversation, music, and shared celebration.\n\nKindly share your RSVP and any dietary preferences at your earliest convenience so we can prepare a wonderful welcome for you.\n\nWith love and anticipation,\nThe Hosts`;

    const ai = createGenAiClient();
    if (!ai) {
      res.json({ draft: fallbackDraft, aiMode: 'preview_fallback' });
      return;
    }

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: getAiModelName(),
          contents: `Draft a warm, ${tone || 'elegant'} invitation message for "${eventName}" (${category}) taking place on ${date} in ${location}. Theme: ${theme}. Cultural context: ${culturalPreferences}. Guest group: ${groupName || 'All Guests'}. Do not include any placeholder brackets that look broken; make it ready to copy and send.`,
        }),
        4000
      );
      res.json({
        draft: response.text || fallbackDraft,
        aiMode: 'live',
      });
    } catch {
      res.json({ draft: fallbackDraft, aiMode: 'preview_fallback' });
    }
  });

  // Mount Vite or Static Build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GatherOS server listening on http://localhost:${PORT}`);
  });
}

startServer();
