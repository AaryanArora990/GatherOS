export type EventCategory = 'wedding' | 'birthday' | 'community';

export type BudgetCategoryName =
  | 'Venue'
  | 'Food and catering'
  | 'Decoration'
  | 'Photography'
  | 'Entertainment'
  | 'Transportation'
  | 'Invitations'
  | 'Accommodation'
  | 'Miscellaneous'
  | 'Emergency reserve';

export const ALL_BUDGET_CATEGORIES: BudgetCategoryName[] = [
  'Venue',
  'Food and catering',
  'Decoration',
  'Photography',
  'Entertainment',
  'Transportation',
  'Invitations',
  'Accommodation',
  'Miscellaneous',
  'Emergency reserve',
];

export type VendorCategoryName =
  | 'Venues'
  | 'Caterers'
  | 'Decorators'
  | 'Photographers'
  | 'Videographers'
  | 'DJs and entertainers'
  | 'Florists'
  | 'Transportation'
  | 'Invitation designers';

export const ALL_VENDOR_CATEGORIES: VendorCategoryName[] = [
  'Venues',
  'Caterers',
  'Decorators',
  'Photographers',
  'Videographers',
  'DJs and entertainers',
  'Florists',
  'Transportation',
  'Invitation designers',
];

export type IdeaCategoryName =
  | 'Event themes'
  | 'Decoration'
  | 'Lighting'
  | 'Food'
  | 'Music'
  | 'Entertainment'
  | 'Photography concepts'
  | 'Guest activities'
  | 'Sustainable event practices'
  | 'Memorable experiences';

export const ALL_IDEA_CATEGORIES: IdeaCategoryName[] = [
  'Event themes',
  'Decoration',
  'Lighting',
  'Food',
  'Music',
  'Entertainment',
  'Photography concepts',
  'Guest activities',
  'Sustainable event practices',
  'Memorable experiences',
];

export type MomentStageKey =
  | 'Arrival'
  | 'Welcome'
  | 'First impressions'
  | 'Social interaction'
  | 'Main celebration'
  | 'Highlight moment'
  | 'Food and entertainment'
  | 'Farewell';

export const ALL_MOMENT_STAGES: MomentStageKey[] = [
  'Arrival',
  'Welcome',
  'First impressions',
  'Social interaction',
  'Main celebration',
  'Highlight moment',
  'Food and entertainment',
  'Farewell',
];

export interface WeddingSpecifics {
  weddingStyle: string;
  numberOfFunctions: number;
  ceremonyPreferences: string;
  familyTraditions: string;
}

export interface BirthdaySpecifics {
  ageGroup: string;
  birthdayTheme: string;
  entertainmentPreferences: string;
  foodPreferences: string;
}

export interface CommunitySpecifics {
  eventPurpose: string;
  targetAudience: string;
  communitySize: string;
  activities: string;
  sponsorsOrVolunteers: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface EventBlueprint {
  eventConcept: string;
  personalizedTheme: string;
  colorPalette: ColorSwatch[];
  decorationRecommendations: string[];
  venueConsiderations: string[];
  foodAndCateringRecommendations: string[];
  entertainmentSuggestions: string[];
  guestExperienceIdeas: string[];
  vendorCategoriesNeeded: string[];
  priorityChecklist: string[];
  riskAndContingency: string[];
  personalizedRecommendations: string[];
  whyItMatches: string;
}

export interface BudgetExpenseItem {
  id: string;
  category: BudgetCategoryName;
  title: string;
  allocatedAmount: number;
  plannedAmount: number;
  vendorQuotationAmount: number;
  actualAmount: number;
  paidAmount: number;
  isCommitted: boolean;
  isAiEstimate: boolean;
  estimateAssumptions?: string;
  notes?: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  milestoneCategory:
    | 'Preparation milestone'
    | 'Booking deadline'
    | 'Payment deadline'
    | 'Invitation deadline'
    | 'Guest confirmation deadline'
    | 'Decoration planning'
    | 'Catering finalization'
    | 'Final event-day preparation';
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedPerson: string;
  progress: number;
  notes?: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: VendorCategoryName;
  contactName: string;
  contactEmailOrPhone: string;
  location: string;
  quotationAmount: number;
  bookingStatus: 'Researching' | 'Shortlisted' | 'Negotiating' | 'Booked' | 'Declined';
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Partially Paid' | 'Paid in Full';
  serviceQualityScore: number; // 1-5 user rating
  eventCompatibilityScore: number; // 1-5 user rating
  availabilityStatus: 'Available' | 'Tentative' | 'Unavailable' | 'Unknown';
  negotiationNotes: string;
  isSampleDemoData: boolean;
}

export interface GuestItem {
  id: string;
  fullName: string;
  group: string;
  invitationSent: boolean;
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  attendingCount: number;
  dietaryPreferences: string;
  notes?: string;
  isDemoData?: boolean;
}

export interface CreativeIdea {
  id: string;
  title: string;
  category: IdeaCategoryName;
  description: string;
  culturalContext: string;
  estimatedCost: number;
  isSaved: boolean;
  isFavorite: boolean;
  convertedToTask?: boolean;
  addedToBudget?: boolean;
}

export interface MomentStage {
  stage: MomentStageKey;
  desiredExperience: string;
  activities: string[];
  preparationRequirements: string[];
  responsiblePerson: string;
  estimatedExpense: number;
  potentialIssues: string;
  backupArrangements: string;
}

export interface CopilotAction {
  id: string;
  type: 'add_budget' | 'add_task' | 'save_idea' | 'apply_theme';
  label: string;
  description: string;
  payload: Record<string, unknown>;
  applied?: boolean;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reasoning?: string;
  actions?: CopilotAction[];
  aiMode?: 'live' | 'preview_fallback';
}

export interface CelebrationEvent {
  id: string;
  name: string;
  category: EventCategory;
  date: string;
  location: string;
  guestCount: number;
  targetBudget: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  currencySymbol: '₹' | '$' | '€' | '£';
  preferredTheme: string;
  culturalPreferences: string;
  mustHaveExperiences: string;
  restrictionsOrRequirements: string;
  planningPriorities: string[];
  weddingSpecifics?: WeddingSpecifics;
  birthdaySpecifics?: BirthdaySpecifics;
  communitySpecifics?: CommunitySpecifics;
  isDemo: boolean;
  blueprint: EventBlueprint;
  budgetItems: BudgetExpenseItem[];
  timelineTasks: TimelineTask[];
  vendors: VendorItem[];
  guests: GuestItem[];
  ideas: CreativeIdea[];
  momentMap: MomentStage[];
  copilotHistory: CopilotMessage[];
}

export interface CategoryBudgetBreakdown {
  category: BudgetCategoryName;
  allocated: number;
  planned: number;
  quoted: number;
  actual: number;
  paid: number;
  committed: number;
  outstanding: number;
  utilizationPercent: number;
  isOverAllocated: boolean;
}

export interface BudgetSummary {
  targetBudget: number;
  totalAllocatedBudget: number; // SUM OF ALL CATEGORY ALLOCATIONS
  plannedExpenses: number;
  vendorQuotations: number;
  actualExpenses: number;
  paidExpenses: number;
  committedExpenses: number;
  outstandingPayments: number;
  remainingBudget: number; // TOTAL ALLOCATED BUDGET - ACTUAL EXPENSES
  targetRemainingBudget: number; // TARGET BUDGET - ACTUAL EXPENSES
  utilizationPercentage: number;
  isOverTarget: boolean;
  isActualExceedingAllocated: boolean;
  warnings: string[];
  categoryBreakdowns: CategoryBudgetBreakdown[];
}

export interface BudgetRealityCheckItem {
  category: BudgetCategoryName;
  currentAmount: number;
  recommendedAmount: number;
  savingsAmount: number;
  financialImpact: string;
  realisticAlternative: string;
  tradeOff: string;
}

export interface BudgetRealityCheckResult {
  isExceeding: boolean;
  excessAmount: number;
  summaryExplanation: string;
  overspendingCategories: BudgetRealityCheckItem[];
  revisedTotalAllocation: number;
}

export interface WhatIfCategoryDelta {
  category: BudgetCategoryName;
  currentAllocated: number;
  projectedAllocated: number;
  delta: number;
  assumptionNote: string;
}

export interface WhatIfSimulationResult {
  originalGuestCount: number;
  newGuestCount: number;
  guestDelta: number;
  originalTotalAllocated: number;
  projectedTotalAllocated: number;
  totalCostDelta: number;
  perAdditionalGuestCost: number;
  categoryDeltas: WhatIfCategoryDelta[];
  assumptions: string[];
}

export type ScenarioType =
  | 'guest_increase'
  | 'budget_reduction'
  | 'venue_change'
  | 'date_change'
  | 'weather_disruption'
  | 'vendor_cancellation'
  | 'add_function';

export interface ScenarioSimulationInput {
  type: ScenarioType;
  newGuestCount?: number;
  budgetCutPercent?: number;
  venueStyle?: 'Indoor Heritage Hall' | 'Outdoor Botanical Lawn' | 'Boutique Civic Pavilion';
  dateShiftDays?: number;
  weatherSeverity?: 'Heavy Rain / Monsoon' | 'Extreme Heatwave' | 'High Winds';
  cancelledVendorCategory?: VendorCategoryName;
  additionalFunctionName?: string;
}

export interface ScenarioSimulationResult {
  scenarioTitle: string;
  budgetImpactDelta: number;
  newProjectedBudget: number;
  timelineImpactSummary: string;
  newTasksRequired: string[];
  vendorRequirementsImpact: string[];
  guestExperienceImpact: string;
  aiRecommendations: string[];
}
