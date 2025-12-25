/**
 * Tests for unified environment variable access
 *
 * @module config/__tests__/env.test
 */

import {
  getEnv,
  getEnvOrThrow,
  getEnvWithDefault,
  isEnvEnabled,
  getSupabaseUrl,
  getSupabaseFunctionsUrl,
  getRevenueCatKey,
  getImgurClientId,
  validateRequiredEnvVars,
} from "../env";

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      supabaseUrl: "https://test.supabase.co",
      supabaseAnonKey: "test-anon-key",
      revenueCatIosKey: "rc_ios_test_key",
      revenueCatAndroidKey: "rc_android_test_key",
      imgurClientId: "imgur_test_id",
      enableAIFeatures: "true",
      enableGamification: "false",
    },
  },
}));

describe("env module", () => {
  describe("getEnv", () => {
    it("should read from Constants.expoConfig.extra via camelCase key", () => {
      expect(getEnv("supabaseUrl")).toBe("https://test.supabase.co");
    });

    it("should read from Constants.expoConfig.extra via EXPO_PUBLIC_* key", () => {
      // This tests that the alias mapping works
      expect(getEnv("EXPO_PUBLIC_SUPABASE_URL")).toBe(
        "https://test.supabase.co"
      );
    });

    it("should return undefined for non-existent keys", () => {
      expect(getEnv("NON_EXISTENT_KEY")).toBeUndefined();
    });
  });

  describe("getEnvOrThrow", () => {
    it("should return value when exists", () => {
      expect(getEnvOrThrow("supabaseUrl")).toBe("https://test.supabase.co");
    });

    it("should throw when value does not exist", () => {
      expect(() => getEnvOrThrow("NON_EXISTENT")).toThrow(
        'Environment variable "NON_EXISTENT" is not configured'
      );
    });

    it("should throw with custom message", () => {
      expect(() =>
        getEnvOrThrow("NON_EXISTENT", "Custom error message")
      ).toThrow("Custom error message");
    });
  });

  describe("getEnvWithDefault", () => {
    it("should return value when exists", () => {
      expect(getEnvWithDefault("supabaseUrl", "default")).toBe(
        "https://test.supabase.co"
      );
    });

    it("should return default when value does not exist", () => {
      expect(getEnvWithDefault("NON_EXISTENT", "my-default")).toBe("my-default");
    });
  });

  describe("isEnvEnabled", () => {
    it("should return true for 'true'", () => {
      expect(isEnvEnabled("enableAIFeatures")).toBe(true);
    });

    it("should return false for 'false'", () => {
      expect(isEnvEnabled("enableGamification")).toBe(false);
    });

    it("should return false for non-existent keys", () => {
      expect(isEnvEnabled("NON_EXISTENT")).toBe(false);
    });
  });

  describe("getSupabaseUrl", () => {
    it("should return Supabase URL", () => {
      expect(getSupabaseUrl()).toBe("https://test.supabase.co");
    });
  });

  describe("getSupabaseFunctionsUrl", () => {
    it("should construct from base URL if functions URL not set", () => {
      expect(getSupabaseFunctionsUrl()).toBe(
        "https://test.supabase.co/functions/v1"
      );
    });
  });

  describe("getRevenueCatKey", () => {
    it("should return iOS key for ios platform", () => {
      expect(getRevenueCatKey("ios")).toBe("rc_ios_test_key");
    });

    it("should return Android key for android platform", () => {
      expect(getRevenueCatKey("android")).toBe("rc_android_test_key");
    });
  });

  describe("getImgurClientId", () => {
    it("should return Imgur Client ID", () => {
      expect(getImgurClientId()).toBe("imgur_test_id");
    });
  });

  describe("validateRequiredEnvVars", () => {
    it("should return valid:true when all vars are set", () => {
      const result = validateRequiredEnvVars([
        "supabaseUrl",
        "supabaseAnonKey",
      ]);
      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it("should return valid:false with missing vars", () => {
      const result = validateRequiredEnvVars([
        "supabaseUrl",
        "NON_EXISTENT_VAR",
      ]);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain("NON_EXISTENT_VAR");
    });

    it("should list all missing vars", () => {
      const result = validateRequiredEnvVars([
        "MISSING_1",
        "MISSING_2",
        "MISSING_3",
      ]);
      expect(result.valid).toBe(false);
      expect(result.missing).toHaveLength(3);
    });
  });

  describe("capability gating", () => {
    it("should not return undefined when capability is true", () => {
      // This tests that when a capability is enabled, the env value is properly resolved
      expect(getEnv("enableAIFeatures")).toBe("true");
      expect(getEnv("enableAIFeatures")).not.toBeUndefined();
    });
  });
});
