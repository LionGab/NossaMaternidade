/**
 * Nossa Maternidade - RevenueCat Service
 * Service layer para integração com RevenueCat SDK
 *
 * @module revenuecat
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

// Flag para rastrear se RevenueCat foi configurado
let isConfigured = false;

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
 * @param userId - Optional user ID to identify user in RevenueCat
 * @returns Promise<void>
 */
export async function initializePurchases(userId?: string): Promise<void> {
  // RevenueCat não funciona no web
  if (Platform.OS === "web") {
    logger.debug("RevenueCat skipped on web platform", "RevenueCat");
    isConfigured = false;
    return;
  }

  // Expo Go não suporta IAP real (módulo nativo). Use Dev Client.
  if (Constants.appOwnership === "expo") {
    logger.info(
      "Expo Go detectado: RevenueCat desabilitado (use Dev Client para IAP).",
      "RevenueCat"
    );
    isConfigured = false;
    return;
  }

  const apiKey = Platform.OS === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

  if (!apiKey) {
    logger.warn(`No API key configured for ${Platform.OS}`, "RevenueCat");
    isConfigured = false;
    return;
  }

  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (userId) {
      await Purchases.configure({ apiKey, appUserID: userId });
    } else {
      await Purchases.configure({ apiKey });
    }

    isConfigured = true;
    logger.info("RevenueCat initialized successfully", "RevenueCat", {
      platform: Platform.OS,
      userId: userId || "anonymous",
    });
  } catch (error) {
    isConfigured = false;
    logger.error(
      "Failed to initialize RevenueCat",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

/**
 * Check if RevenueCat is configured
 * @returns boolean
 */
export function getIsConfigured(): boolean {
  return isConfigured;
}

/**
 * Get current offerings (available subscription packages)
 * @returns Promise<PurchasesOffering | null>
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!isConfigured) {
    logger.warn("RevenueCat not configured. Call initializePurchases() first.", "RevenueCat");
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    logger.error(
      "Failed to get offerings",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
}

/**
 * Get all available packages
 * @returns Promise<PurchasesPackage[]>
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  try {
    const offering = await getOfferings();
    return offering?.availablePackages || [];
  } catch (error) {
    logger.error(
      "Failed to get packages",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return [];
  }
}

/**
 * Purchase a package
 * @param pkg - Package to purchase
 * @returns Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }>
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (!isConfigured) {
    return { success: false, error: "RevenueCat not configured" };
  }

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

    logger.error(
      "Purchase failed",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Restore purchases
 * @returns Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }>
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!isConfigured) {
    return { success: false, error: "RevenueCat not configured" };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error) {
    logger.error(
      "Restore failed",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Check if user has premium access
 * @returns Promise<boolean>
 */
export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) {
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
  } catch (error) {
    logger.error(
      "Failed to check premium status",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return false;
  }
}

/**
 * Get customer info
 * @returns Promise<CustomerInfo | null>
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isConfigured) {
    return null;
  }

  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    logger.error(
      "Failed to get customer info",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
}

/**
 * Login user to RevenueCat
 * @param userId - User ID to login
 * @returns Promise<void>
 */
export async function loginUser(userId: string): Promise<void> {
  if (!isConfigured) {
    logger.warn("RevenueCat not configured. Call initializePurchases() first.", "RevenueCat");
    return;
  }

  try {
    await Purchases.logIn(userId);
    logger.info(`User logged in: ${userId}`, "RevenueCat");
  } catch (error) {
    logger.error(
      "Failed to login user",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Logout user from RevenueCat
 * @returns Promise<void>
 */
export async function logoutUser(): Promise<void> {
  if (!isConfigured) {
    return;
  }

  try {
    await Purchases.logOut();
    logger.info("User logged out", "RevenueCat");
  } catch (error) {
    logger.error(
      "Failed to logout user",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Format price for display
 * @param priceString - Price string from RevenueCat
 * @returns string
 */
export function formatPrice(priceString: string): string {
  return priceString;
}

/**
 * Calculate monthly equivalent for yearly price
 * @param yearlyPrice - Yearly price
 * @returns number
 */
export function calculateMonthlyEquivalent(yearlyPrice: number): number {
  return Math.round((yearlyPrice / 12) * 100) / 100;
}

/**
 * Calculate savings percentage
 * @param monthlyPrice - Monthly price
 * @param yearlyPrice - Yearly price
 * @returns number
 */
export function calculateSavingsPercent(monthlyPrice: number, yearlyPrice: number): number {
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = ((monthlyPrice - yearlyMonthlyEquivalent) / monthlyPrice) * 100;
  return Math.round(savings);
}

/**
 * Get trial info from package
 * @param pkg - Package to check
 * @returns { hasTrialPeriod: boolean; trialDays: number }
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
