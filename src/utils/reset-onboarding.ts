/**
 * Utility to reset onboarding state
 * Import and call resetAllOnboarding() to test onboarding flow
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

export async function resetAllOnboarding(): Promise<void> {
  try {
    // Clear NathIA onboarding state
    await AsyncStorage.removeItem("nathia-onboarding-profile");

    // Clear app store (includes legacy onboarding)
    await AsyncStorage.removeItem("nossa-maternidade-storage");

    logger.info("Onboarding reset complete. Restart the app.", "Reset");
  } catch (error) {
    logger.error("Failed to reset onboarding", "Reset", error instanceof Error ? error : new Error(String(error)));
  }
}
