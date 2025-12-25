/**
 * Unified Environment Variable Access
 *
 * This module provides a single source of truth for reading environment variables
 * from both process.env and Constants.expoConfig.extra.
 *
 * Problem solved:
 * - process.env works at build time (Expo inlines EXPO_PUBLIC_* vars)
 * - Constants.expoConfig.extra works at runtime (from app.config.js)
 * - Some files used one, some used the other, causing inconsistencies
 *
 * Note: We use static process.env access at module load time to satisfy
 * Expo's expo/no-dynamic-env-var rule, then provide a unified lookup.
 *
 * @module config/env
 */

import Constants from "expo-constants";

/**
 * Static cache of process.env values (populated at module load time)
 * This satisfies Expo's requirement for static env var access
 */
const STATIC_ENV_CACHE: Record<string, string | undefined> = {
  // Supabase
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL:
    process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL,
  // RevenueCat
  EXPO_PUBLIC_REVENUECAT_IOS_KEY: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY:
    process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
  // Third-party
  EXPO_PUBLIC_IMGUR_CLIENT_ID: process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID,
  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_ONESIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
  EXPO_PUBLIC_ELEVENLABS_VOICE_ID: process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID,
  // Feature flags
  EXPO_PUBLIC_ENABLE_AI_FEATURES: process.env.EXPO_PUBLIC_ENABLE_AI_FEATURES,
  EXPO_PUBLIC_ENABLE_GAMIFICATION: process.env.EXPO_PUBLIC_ENABLE_GAMIFICATION,
  EXPO_PUBLIC_ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS,
};

/**
 * Mapping of EXPO_PUBLIC_* env var names to their camelCase equivalents in extra
 * This handles the transformation done in app.config.js
 */
const ENV_TO_EXTRA_ALIASES: Record<string, string> = {
  EXPO_PUBLIC_SUPABASE_URL: "supabaseUrl",
  EXPO_PUBLIC_SUPABASE_ANON_KEY: "supabaseAnonKey",
  EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL: "supabaseFunctionsUrl",
  EXPO_PUBLIC_REVENUECAT_IOS_KEY: "revenueCatIosKey",
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY: "revenueCatAndroidKey",
  EXPO_PUBLIC_IMGUR_CLIENT_ID: "imgurClientId",
  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: "stripePublishableKey",
  EXPO_PUBLIC_ONESIGNAL_APP_ID: "oneSignalAppId",
  EXPO_PUBLIC_SENTRY_DSN: "sentryDsn",
  EXPO_PUBLIC_BACKEND_URL: "backendUrl",
  EXPO_PUBLIC_ELEVENLABS_VOICE_ID: "elevenLabsVoiceId",
  EXPO_PUBLIC_ENABLE_AI_FEATURES: "enableAIFeatures",
  EXPO_PUBLIC_ENABLE_GAMIFICATION: "enableGamification",
  EXPO_PUBLIC_ENABLE_ANALYTICS: "enableAnalytics",
};

/**
 * Reverse mapping for lookup by camelCase name
 */
const EXTRA_TO_ENV_ALIASES: Record<string, string> = Object.entries(
  ENV_TO_EXTRA_ALIASES
).reduce(
  (acc, [envKey, extraKey]) => {
    acc[extraKey] = envKey;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Get the extra config object safely
 */
function getExtraConfig(): Record<string, unknown> | undefined {
  return Constants.expoConfig?.extra as Record<string, unknown> | undefined;
}

/**
 * Get value from static env cache
 * Uses pre-cached values to avoid dynamic process.env access
 */
function getFromStaticCache(key: string): string | undefined {
  return STATIC_ENV_CACHE[key];
}

/**
 * Get an environment variable value from either process.env or Constants.expoConfig.extra
 *
 * Priority:
 * 1. Static env cache (process.env captured at module load)
 * 2. Constants.expoConfig.extra[camelCaseAlias] (from app.config.js mapping)
 * 3. Constants.expoConfig.extra[key] (direct key in extra)
 *
 * @param key - The environment variable key (e.g., "EXPO_PUBLIC_SUPABASE_URL" or "supabaseUrl")
 * @returns The value or undefined if not found
 *
 * @example
 * // Both of these work:
 * getEnv("EXPO_PUBLIC_SUPABASE_URL")
 * getEnv("supabaseUrl")
 */
export function getEnv(key: string): string | undefined {
  // 1. Try static env cache (for EXPO_PUBLIC_* keys)
  const cachedValue = getFromStaticCache(key);
  if (cachedValue !== undefined && cachedValue !== "") {
    return cachedValue;
  }

  // 2. Try reverse lookup for camelCase keys
  const envAlias = EXTRA_TO_ENV_ALIASES[key];
  if (envAlias) {
    const aliasValue = getFromStaticCache(envAlias);
    if (aliasValue !== undefined && aliasValue !== "") {
      return aliasValue;
    }
  }

  const extra = getExtraConfig();
  if (!extra) {
    return undefined;
  }

  // 3. Try the camelCase alias in extra (for EXPO_PUBLIC_* keys)
  const extraAlias = ENV_TO_EXTRA_ALIASES[key];
  if (extraAlias) {
    const aliasValue = extra[extraAlias];
    if (aliasValue !== undefined && aliasValue !== "") {
      return String(aliasValue);
    }
  }

  // 4. Try direct key in extra (for camelCase keys like "supabaseUrl")
  const directValue = extra[key];
  if (directValue !== undefined && directValue !== "") {
    return String(directValue);
  }

  return undefined;
}

/**
 * Get an environment variable or throw if not found
 *
 * @param key - The environment variable key
 * @param errorMessage - Optional custom error message
 * @throws Error if the variable is not found
 */
export function getEnvOrThrow(key: string, errorMessage?: string): string {
  const value = getEnv(key);
  if (value === undefined) {
    throw new Error(
      errorMessage || `Environment variable "${key}" is not configured`
    );
  }
  return value;
}

/**
 * Get an environment variable with a default value
 *
 * @param key - The environment variable key
 * @param defaultValue - Default value if not found
 */
export function getEnvWithDefault(key: string, defaultValue: string): string {
  return getEnv(key) ?? defaultValue;
}

/**
 * Check if an environment variable is set and truthy
 *
 * @param key - The environment variable key
 * @returns true if the value is "true", "1", or "yes" (case-insensitive)
 */
export function isEnvEnabled(key: string): boolean {
  const value = getEnv(key);
  if (!value) return false;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

/**
 * Get the Supabase base URL for building Edge Function URLs
 * Handles both direct env and extra config
 */
export function getSupabaseUrl(): string | undefined {
  return getEnv("EXPO_PUBLIC_SUPABASE_URL");
}

/**
 * Get the Supabase Edge Functions URL
 * Falls back to constructing from base URL if specific var not set
 */
export function getSupabaseFunctionsUrl(): string | undefined {
  const functionsUrl = getEnv("EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL");
  if (functionsUrl) return functionsUrl;

  const baseUrl = getSupabaseUrl();
  if (baseUrl) return `${baseUrl}/functions/v1`;

  return undefined;
}

/**
 * Get RevenueCat API key for the current platform
 */
export function getRevenueCatKey(platform: "ios" | "android"): string {
  if (platform === "ios") {
    return getEnv("EXPO_PUBLIC_REVENUECAT_IOS_KEY") ?? "";
  }
  return getEnv("EXPO_PUBLIC_REVENUECAT_ANDROID_KEY") ?? "";
}

/**
 * Get Imgur Client ID
 */
export function getImgurClientId(): string | undefined {
  return getEnv("EXPO_PUBLIC_IMGUR_CLIENT_ID");
}

/**
 * Validate that required environment variables are set
 * Returns list of missing variables
 */
export function validateRequiredEnvVars(requiredVars: string[]): {
  valid: boolean;
  missing: string[];
} {
  const missing = requiredVars.filter((key) => !getEnv(key));
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get all environment configuration for debugging
 * Only includes non-sensitive keys
 */
export function getEnvDebugInfo(): Record<string, string | undefined> {
  return {
    supabaseUrl: getEnv("EXPO_PUBLIC_SUPABASE_URL") ? "[SET]" : undefined,
    supabaseAnonKey: getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY")
      ? "[SET]"
      : undefined,
    revenueCatIosKey: getEnv("EXPO_PUBLIC_REVENUECAT_IOS_KEY")
      ? "[SET]"
      : undefined,
    revenueCatAndroidKey: getEnv("EXPO_PUBLIC_REVENUECAT_ANDROID_KEY")
      ? "[SET]"
      : undefined,
    imgurClientId: getEnv("EXPO_PUBLIC_IMGUR_CLIENT_ID") ? "[SET]" : undefined,
    enableAIFeatures: getEnv("EXPO_PUBLIC_ENABLE_AI_FEATURES"),
    enableGamification: getEnv("EXPO_PUBLIC_ENABLE_GAMIFICATION"),
    enableAnalytics: getEnv("EXPO_PUBLIC_ENABLE_ANALYTICS"),
  };
}
