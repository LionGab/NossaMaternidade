/**
 * Hooks - Exports
 * Hooks customizados para Nossa Maternidade
 */

// =====================
// 📱 Mobile & Performance
// =====================
export {
  useMobileOptimization,
  useAccessibleProps,
  useHitSlop,
  useLazyLoad,
} from './useMobileOptimization';
export type { MobileOptimization, TouchTargetProps } from './useMobileOptimization';

export { useResponsive } from './useResponsive';
export { useResponsiveDimensions } from './useResponsiveDimensions';

// =====================
// 🎨 Theme & Styling
// =====================
export { useThemeColors, useTheme } from './useTheme';

// =====================
// ♿ Accessibility
// =====================
export { useAccessibilityProps } from './useAccessibilityProps';

// =====================
// 📳 Haptics & Feedback
// =====================
export { useHaptics } from './useHaptics';

// =====================
// 🔊 Audio & Voice
// =====================
export { useAudioPlayer } from './useAudioPlayer';
export { useVoice } from './useVoice';
export { useVoiceRecording } from './useVoiceRecording';

// =====================
// 💾 Storage & Session
// =====================
export { default as useStorage } from './useStorage';
export { useSession } from './useSession';
export { useOnboardingStorage } from './useOnboardingStorage';

// =====================
// 🏠 Screen-specific
// =====================
export { useHomeScreenData } from './useHomeScreenData';
export { useOnboardingFlow } from './useOnboardingFlow';

// =====================
// ⏳ Loading & State
// =====================
export { useLoadingWithTimeout } from './useLoadingWithTimeout';

// =====================
// 👤 Profile (React Query)
// =====================
export {
  useProfile,
  useProfileById,
  useUpdateProfile,
  useUploadAvatar,
  useDeleteAvatar,
  useOnboardingStatus,
  useCompleteOnboarding,
  useUpdateOnboardingStep,
  profileKeys,
} from './useProfile';

// =====================
// 💛 Emotions (React Query)
// =====================
export {
  useTodayEmotion,
  useEmotionHistory,
  useWeeklyEmotionSummary,
  useSaveEmotion,
  useEmotionCheckIn,
  emotionKeys,
} from './useEmotions';

// =====================
// 📋 Consent (React Query)
// =====================
export { useConsent, useAcceptConsent, consentKeys } from './useConsent';
