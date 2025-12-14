/**
 * Utility to reset onboarding state
 * Import and call resetAllOnboarding() to test onboarding flow
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function resetAllOnboarding(): Promise<void> {
  try {
    // Clear NathIA onboarding state
    await AsyncStorage.removeItem("nathia-onboarding-profile");

    // Clear app store (includes legacy onboarding)
    await AsyncStorage.removeItem("nossa-maternidade-storage");

    console.log("[Reset] Onboarding reset complete. Restart the app.");
  } catch (error) {
    console.error("[Reset] Failed to reset onboarding:", error);
  }
}
