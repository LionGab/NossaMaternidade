/**
 * Nossa Maternidade - Purchase Service
 * RevenueCat integration for subscriptions
 * Inspired by Flo, Calm, and Headspace
 */

import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
  PurchasesError,
} from "react-native-purchases";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { logger } from "../utils/logger";

// RevenueCat API Keys (from environment)
const REVENUECAT_IOS_KEY = Constants.expoConfig?.extra?.revenueCatIosKey || "";
const REVENUECAT_ANDROID_KEY = Constants.expoConfig?.extra?.revenueCatAndroidKey || "";

// Entitlement ID - must match RevenueCat dashboard
export const PREMIUM_ENTITLEMENT = "premium";

// Product identifiers
export const PRODUCT_IDS = {
  MONTHLY: "nossa_maternidade_monthly",
  YEARLY: "nossa_maternidade_yearly",
} as const;

/**
 * Type guard to check if error is from RevenueCat
 */
function isPurchasesError(error: unknown): error is PurchasesError {
  return typeof error === "object" && error !== null && "userCancelled" in error;
}

/**
 * Get error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (isPurchasesError(error)) {
    return error.message || "Purchase error";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

/**
 * Initialize RevenueCat
 */
export async function initializePurchases(userId?: string): Promise<void> {
  const apiKey = Platform.OS === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

  if (!apiKey) {
    console.warn("[Purchases] No API key configured for", Platform.OS);
    return;
  }

  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (userId) {
      await Purchases.configure({ apiKey, appUserID: userId });
    } else {
      await Purchases.configure({ apiKey });
    }

    logger.info("Initialized successfully", "Purchases");
  } catch (error) {
    logger.error("Failed to initialize", "Purchases", error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Get current offerings (available subscription packages)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error("[Purchases] Failed to get offerings:", error);
    return null;
  }
}

/**
 * Get all available packages
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  try {
    const offering = await getOfferings();
    return offering?.availablePackages || [];
  } catch (error) {
    console.error("[Purchases] Failed to get packages:", error);
    return [];
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error) {
    // User cancelled
    if (isPurchasesError(error) && error.userCancelled) {
      return { success: false, error: "cancelled" };
    }

    console.error("[Purchases] Purchase failed:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error) {
    console.error("[Purchases] Restore failed:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Check if user has premium access
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
  } catch (error) {
    console.error("[Purchases] Failed to check premium status:", error);
    return false;
  }
}

/**
 * Get customer info
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error("[Purchases] Failed to get customer info:", error);
    return null;
  }
}

/**
 * Login user to RevenueCat
 */
export async function loginUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
    logger.info(`User logged in: ${userId}`, "Purchases");
  } catch (error) {
    logger.error("Failed to login user", "Purchases", error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Logout user from RevenueCat
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
    logger.info("User logged out", "Purchases");
  } catch (error) {
    logger.error("Failed to logout user", "Purchases", error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Format price for display
 */
export function formatPrice(priceString: string): string {
  return priceString;
}

/**
 * Calculate monthly equivalent for yearly price
 */
export function calculateMonthlyEquivalent(yearlyPrice: number): number {
  return Math.round((yearlyPrice / 12) * 100) / 100;
}

/**
 * Calculate savings percentage
 */
export function calculateSavingsPercent(monthlyPrice: number, yearlyPrice: number): number {
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = ((monthlyPrice - yearlyMonthlyEquivalent) / monthlyPrice) * 100;
  return Math.round(savings);
}

/**
 * Get trial info from package
 */
export function getTrialInfo(pkg: PurchasesPackage): {
  hasTrialPeriod: boolean;
  trialDays: number;
} {
  const intro = pkg.product.introPrice;

  if (intro && intro.price === 0) {
    // Parse trial period (e.g., "P7D" = 7 days, "P1W" = 1 week)
    const periodUnit = intro.periodUnit;
    const periodNumber = intro.periodNumberOfUnits;

    let trialDays = 0;
    if (periodUnit === "DAY") {
      trialDays = periodNumber;
    } else if (periodUnit === "WEEK") {
      trialDays = periodNumber * 7;
    } else if (periodUnit === "MONTH") {
      trialDays = periodNumber * 30;
    }

    return { hasTrialPeriod: true, trialDays };
  }

  return { hasTrialPeriod: false, trialDays: 0 };
}
