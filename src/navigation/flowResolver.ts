/**
 * Navigation Flow Resolver
 *
 * Pure function that determines which navigation stage to show based on
 * authentication and onboarding state flags. Eliminates polling by making
 * the decision deterministic and event-driven.
 *
 * Flow stages (in order):
 * 1. Login - User not authenticated
 * 2. NotificationPermission - Authenticated but hasn't completed notification setup
 * 3. NathJourneyOnboarding - Stories-format onboarding (new user journey)
 * 4. Onboarding - Legacy onboarding (name, stage, interests)
 * 5. NathIAOnboarding - AI personalization
 * 6. MainApp - Fully onboarded, authenticated user
 *
 * @module navigation/flowResolver
 */

/**
 * Navigation flow state flags
 */
export interface FlowState {
  /** User is logged in */
  isAuthenticated: boolean;
  /** User has completed notification setup (asked or skipped) */
  notificationSetupDone: boolean;
  /** User has completed Nath Journey stories onboarding */
  isNathJourneyOnboardingComplete: boolean;
  /** User has completed legacy onboarding (name, stage, interests) */
  isOnboardingComplete: boolean;
  /** User has completed NathIA AI personalization */
  isNathIAOnboardingComplete: boolean;
}

/**
 * Possible navigation stages
 */
export type NavigationStage =
  | "Login"
  | "NotificationPermission"
  | "NathJourneyOnboarding"
  | "Onboarding"
  | "NathIAOnboarding"
  | "MainApp";

/**
 * Flags indicating which navigation groups should be rendered
 */
export interface NavigationFlags {
  shouldShowLogin: boolean;
  shouldShowNotificationPermission: boolean;
  shouldShowNathJourneyOnboarding: boolean;
  shouldShowOnboarding: boolean;
  shouldShowNathIAOnboarding: boolean;
  shouldShowMainApp: boolean;
}

/**
 * Resolves the current navigation stage based on flow state
 *
 * @param state - Current flow state flags
 * @param devBypass - If true, skips all onboarding and shows MainApp
 * @returns The current navigation stage
 *
 * @example
 * const stage = resolveNavigationStage({
 *   isAuthenticated: true,
 *   notificationSetupDone: true,
 *   isNathJourneyOnboardingComplete: false,
 *   isOnboardingComplete: false,
 *   isNathIAOnboardingComplete: false,
 * });
 * // Returns: "NathJourneyOnboarding"
 */
export function resolveNavigationStage(
  state: FlowState,
  devBypass: boolean = false
): NavigationStage {
  // Dev bypass skips all onboarding
  if (devBypass) {
    return "MainApp";
  }

  // Stage 1: Not authenticated
  if (!state.isAuthenticated) {
    return "Login";
  }

  // Stage 2: Notification permission
  if (!state.notificationSetupDone) {
    return "NotificationPermission";
  }

  // Stage 3: Nath Journey stories onboarding (new)
  if (!state.isNathJourneyOnboardingComplete) {
    return "NathJourneyOnboarding";
  }

  // Stage 4: Legacy onboarding (name, stage, interests)
  if (!state.isOnboardingComplete) {
    return "Onboarding";
  }

  // Stage 5: NathIA AI personalization
  if (!state.isNathIAOnboardingComplete) {
    return "NathIAOnboarding";
  }

  // Stage 6: Fully onboarded
  return "MainApp";
}

/**
 * Resolves navigation flags for conditional rendering in the navigator
 *
 * @param state - Current flow state flags
 * @param devBypass - If true, skips all onboarding and shows MainApp
 * @returns Flags indicating which navigation groups should be rendered
 *
 * @example
 * const flags = resolveNavigationFlags({
 *   isAuthenticated: true,
 *   notificationSetupDone: true,
 *   isNathJourneyOnboardingComplete: true,
 *   isOnboardingComplete: false,
 *   isNathIAOnboardingComplete: false,
 * });
 * // Returns: { ..., shouldShowOnboarding: true, ... }
 */
export function resolveNavigationFlags(
  state: FlowState,
  devBypass: boolean = false
): NavigationFlags {
  const stage = resolveNavigationStage(state, devBypass);

  return {
    shouldShowLogin: stage === "Login",
    shouldShowNotificationPermission: stage === "NotificationPermission",
    shouldShowNathJourneyOnboarding: stage === "NathJourneyOnboarding",
    shouldShowOnboarding: stage === "Onboarding",
    shouldShowNathIAOnboarding: stage === "NathIAOnboarding",
    shouldShowMainApp: stage === "MainApp",
  };
}

/**
 * Get a human-readable description of the current flow state
 * Useful for debugging and logging
 *
 * @param state - Current flow state
 * @returns Human-readable description
 */
export function describeFlowState(state: FlowState): string {
  const parts: string[] = [];

  parts.push(`auth:${state.isAuthenticated ? "yes" : "no"}`);
  parts.push(`notif:${state.notificationSetupDone ? "done" : "pending"}`);
  parts.push(`nathJourney:${state.isNathJourneyOnboardingComplete ? "done" : "pending"}`);
  parts.push(`onboard:${state.isOnboardingComplete ? "done" : "pending"}`);
  parts.push(`nathIA:${state.isNathIAOnboardingComplete ? "done" : "pending"}`);

  return parts.join(" | ");
}

/**
 * Check if the user has completed all required onboarding steps
 *
 * @param state - Current flow state
 * @returns True if all onboarding is complete
 */
export function isFullyOnboarded(state: FlowState): boolean {
  return (
    state.isAuthenticated &&
    state.notificationSetupDone &&
    state.isNathJourneyOnboardingComplete &&
    state.isOnboardingComplete &&
    state.isNathIAOnboardingComplete
  );
}

/**
 * Get the next required step for onboarding
 *
 * @param state - Current flow state
 * @returns The next step to complete, or null if fully onboarded
 */
export function getNextOnboardingStep(
  state: FlowState
): NavigationStage | null {
  if (!state.isAuthenticated) return "Login";
  if (!state.notificationSetupDone) return "NotificationPermission";
  if (!state.isNathJourneyOnboardingComplete) return "NathJourneyOnboarding";
  if (!state.isOnboardingComplete) return "Onboarding";
  if (!state.isNathIAOnboardingComplete) return "NathIAOnboarding";
  return null;
}

/**
 * Calculate onboarding progress as a percentage
 *
 * @param state - Current flow state
 * @returns Progress percentage (0-100)
 */
export function getOnboardingProgress(state: FlowState): number {
  if (!state.isAuthenticated) return 0;

  const steps = [
    state.notificationSetupDone,
    state.isNathJourneyOnboardingComplete,
    state.isOnboardingComplete,
    state.isNathIAOnboardingComplete,
  ];

  const completedSteps = steps.filter(Boolean).length;
  const totalSteps = steps.length;

  // Authentication counts as first 20%
  return 20 + (completedSteps / totalSteps) * 80;
}
