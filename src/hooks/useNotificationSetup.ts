/**
 * useNotificationSetup Hook
 *
 * Reactive hook for managing notification setup state.
 * Replaces polling with event-driven state updates.
 *
 * This hook:
 * 1. Reads initial state from AsyncStorage on mount
 * 2. Provides reactive state for navigation decisions
 * 3. Exposes a setter to update state (used by NotificationPermissionScreen)
 *
 * @module hooks/useNotificationSetup
 */

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys (must match notifications.ts)
const PERMISSION_KEY = "@notification_permission";
const SETUP_COMPLETE_KEY = "@notification_setup_complete";

/**
 * Notification setup state store
 */
interface NotificationSetupState {
  /** Whether notification setup has been completed (asked, granted, denied, or skipped) */
  isSetupDone: boolean | null;
  /** Whether the store has been initialized from AsyncStorage */
  isInitialized: boolean;
  /** Initialize the store from AsyncStorage */
  initialize: () => Promise<void>;
  /** Mark notification setup as complete */
  markComplete: () => void;
  /** Reset to pending state (for testing) */
  reset: () => void;
}

/**
 * Store for notification setup state
 * Using Zustand for reactive state management
 */
export const useNotificationSetupStore = create<NotificationSetupState>(
  (set, get) => ({
    isSetupDone: null,
    isInitialized: false,

    initialize: async () => {
      // Don't re-initialize if already done
      if (get().isInitialized) return;

      try {
        // Check both keys - setup is done if either is set
        const [permission, setupComplete] = await Promise.all([
          AsyncStorage.getItem(PERMISSION_KEY),
          AsyncStorage.getItem(SETUP_COMPLETE_KEY),
        ]);

        // Setup is done if permission was asked or setup was explicitly completed/skipped
        const isDone =
          permission !== null ||
          setupComplete === "true" ||
          setupComplete === "skipped";

        set({ isSetupDone: isDone, isInitialized: true });
      } catch {
        // On error, assume not done to be safe
        set({ isSetupDone: false, isInitialized: true });
      }
    },

    markComplete: () => {
      set({ isSetupDone: true });
    },

    reset: () => {
      set({ isSetupDone: null, isInitialized: false });
    },
  })
);

/**
 * Hook to use notification setup state with auto-initialization
 *
 * @returns Object with isSetupDone state and markComplete function
 *
 * @example
 * const { isSetupDone, markComplete } = useNotificationSetup();
 *
 * // In navigation:
 * if (isSetupDone === null) return null; // Loading
 * if (!isSetupDone) return <NotificationPermissionScreen />;
 *
 * // In NotificationPermissionScreen:
 * await registerForPushNotifications();
 * markComplete();
 */
export function useNotificationSetup() {
  const { isSetupDone, isInitialized, initialize, markComplete } =
    useNotificationSetupStore();

  // Initialize on first access
  if (!isInitialized) {
    initialize();
  }

  return {
    /** Whether notification setup is complete (null = loading) */
    isSetupDone,
    /** Mark notification setup as complete (call after user action) */
    markComplete,
    /** Whether the hook has finished initializing */
    isInitialized,
  };
}

/**
 * Mark notification setup as complete
 * This is a standalone function that can be called from anywhere
 * (e.g., from the notifications service after permission is granted/denied)
 */
export function markNotificationSetupDone(): void {
  useNotificationSetupStore.getState().markComplete();
}

/**
 * Initialize the notification setup store
 * Call this early in app initialization to avoid flicker
 */
export function initializeNotificationSetupStore(): Promise<void> {
  return useNotificationSetupStore.getState().initialize();
}
