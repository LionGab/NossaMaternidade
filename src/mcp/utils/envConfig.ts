/**
 * MCP Environment Configuration
 * Centralized access to environment variables for MCP Servers
 * Compatible with React Native / Expo (uses Constants.expoConfig)
 */

import Constants from 'expo-constants';

/**
 * Get environment variable with fallback to Constants.expoConfig
 * Priority: Constants.expoConfig?.extra > process.env.EXPO_PUBLIC_* > process.env.*
 */
export function getMCPEnv(key: string, defaultValue?: string): string | null {
  // Priority 1: Constants.expoConfig.extra (mobile-safe)
  const fromConfig = Constants.expoConfig?.extra?.[key];
  if (fromConfig && typeof fromConfig === 'string') {
    return fromConfig;
  }

  // Priority 2: EXPO_PUBLIC_* (works in web/dev)
  const fromPublicEnv = process.env[`EXPO_PUBLIC_${key}`];
  if (fromPublicEnv) {
    return fromPublicEnv;
  }

  // Priority 3: Direct env var (fallback for Node.js/server)
  const fromEnv = process.env[key];
  if (fromEnv) {
    return fromEnv;
  }

  return defaultValue ?? null;
}

/**
 * Sentry MCP Configuration
 */
export const sentryConfig = {
  get apiToken(): string | null {
    return getMCPEnv('SENTRY_AUTH_TOKEN');
  },
  get organizationSlug(): string {
    return getMCPEnv('SENTRY_ORG_SLUG', 'nossa-maternidade') ?? 'nossa-maternidade';
  },
  get projectSlug(): string {
    return getMCPEnv('SENTRY_PROJECT_SLUG', 'nossa-maternidade-mobile') ?? 'nossa-maternidade-mobile';
  },
};

/**
 * App Store Connect MCP Configuration
 */
export const appStoreConnectConfig = {
  get issuerId(): string | null {
    return getMCPEnv('APP_STORE_CONNECT_ISSUER_ID');
  },
  get keyId(): string | null {
    return getMCPEnv('APP_STORE_CONNECT_KEY_ID');
  },
  get privateKey(): string | null {
    return getMCPEnv('APP_STORE_CONNECT_PRIVATE_KEY');
  },
};

/**
 * Google Play Console MCP Configuration
 */
export const googlePlayConsoleConfig = {
  get serviceAccountEmail(): string | null {
    return getMCPEnv('GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL');
  },
  get privateKey(): string | null {
    return getMCPEnv('GOOGLE_PLAY_PRIVATE_KEY');
  },
  get packageName(): string {
    return getMCPEnv('GOOGLE_PLAY_PACKAGE_NAME', 'com.nossamaternidade.app') ?? 'com.nossamaternidade.app';
  },
};

