/**
 * Supabase Services
 * Todos os services que interagem com Supabase
 */

export { supabase, initSecureStorageMigration, isSupabaseReady } from './supabase';
export * from './authService';

// ProfileService - export specific to avoid conflicts
export { profileService, type ServiceResponse as ProfileServiceResponse, type UpdateProfileData } from './profileService';
export type { UserProfile } from '@/types/user';

// ChatService - export specific to avoid conflicts
export { chatService, type ChatConversation } from './chatService';
export type { ChatMessage } from '@/types/chat';

export * from './communityService';
export * from './communityModerationService';

// ConsentService - export specific to avoid conflicts
export { consentService } from './consentService';

export * from './diaryService';
export * from './feedService';
export * from './habitsService';
export * from './bookmarkService';
export * from './checkInService';
export * from './onboardingService';
export * from './userDataService';
export * from './sleepService';
export * from './breastfeedingInsightsService';
export * from './milestonesService';
export * from './needsRewardsService';
export * from './guiltService';
export * from './fileReviewService';
