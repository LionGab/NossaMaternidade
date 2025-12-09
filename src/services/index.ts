/**
 * Services - Exportações Centralizadas
 * 
 * Organização por domínio:
 * - supabase/ - Services do Supabase (auth, database, storage)
 * - ai/ - Services de IA (Gemini, OpenAI, Claude, etc.)
 * - storage/ - Services de armazenamento local
 * - analytics/ - Services de analytics e tracking
 * - aiTools/ - Ferramentas de IA (tools, executors)
 */

// Supabase Services - re-export explicitly to avoid conflicts
export {
  supabase,
  initSecureStorageMigration,
  isSupabaseReady,
  authService,
  profileService,
  chatService,
  consentService,
  diaryService,
  feedService,
  habitsService,
  bookmarkService,
  checkInService,
  onboardingService,
  userDataService,
  sleepService,
  breastfeedingInsightsService,
  milestonesService,
  needsRewardsService,
  guiltService,
  fileReviewService,
  communityService,
  communityModerationService
} from './supabase';

// Export types explicitly
export type {
  UpdateProfileData,
  ProfileServiceResponse,
  UserProfile,
  ChatMessage,
  ChatConversation,
  OnboardingData
} from './supabase';

// AI Services
export * from './ai';

// Storage Services
export * from './storage';

// Analytics Services
export * from './analytics';

// AI Tools
export * from './aiTools';

// Other Services (não categorizados ainda)
export * from './sentry';
