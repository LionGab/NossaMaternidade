/**
 * Onboarding Service
 * Integração real com Supabase para tabela user_onboarding
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { logger } from "../utils/logger";
import {
  OnboardingConcern,
  OnboardingStage,
  EmotionalState,
} from "../types/nath-journey-onboarding.types";

// Type for the user_onboarding table (not in main types yet)
interface UserOnboardingRow {
  id: string;
  user_id: string;
  stage: string;
  last_menstruation: string | null;
  due_date: string | null;
  birth_date: string | null;
  concerns: string[];
  emotional_state: string;
  daily_check_in: boolean;
  check_in_time: string | null;
  season_name: string;
  completed_at: string;
  is_founder: boolean;
  needs_extra_care: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingData {
  stage: OnboardingStage;
  date?: string | null;
  concerns: OnboardingConcern[];
  emotionalState?: EmotionalState | null;
  dailyCheckIn?: boolean;
  checkInTime?: string | null;
  seasonName?: string | null;
  needsExtraCare?: boolean;
}

/**
 * Map stage to date field name
 */
function getDateFieldForStage(stage: OnboardingStage): "due_date" | "birth_date" | "last_menstruation" {
  if (stage.startsWith("GRAVIDA")) {
    return "due_date";
  }
  if (stage === "PUERPERIO_0_40D" || stage === "MAE_RECENTE_ATE_1ANO") {
    return "birth_date";
  }
  return "last_menstruation";
}

/**
 * Check if user is a founder (completed onboarding during launch window: Jan 6-8, 2026)
 */
function checkIsFounder(): boolean {
  const now = new Date();
  const launchStart = new Date("2026-01-06T00:00:00");
  const launchEnd = new Date("2026-01-08T23:59:59");
  return now >= launchStart && now <= launchEnd;
}

/**
 * Save onboarding data to Supabase
 */
export async function saveOnboardingData(
  userId: string,
  data: OnboardingData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured, skipping save", "OnboardingService");
      return { success: true };
    }

    // Build the date field based on stage
    const dateField = getDateFieldForStage(data.stage);
    const dateValue = data.date ? new Date(data.date).toISOString().split("T")[0] : null;

    // Build insert/upsert payload
    const payload = {
      user_id: userId,
      stage: data.stage,
      [dateField]: dateValue,
      concerns: data.concerns,
      emotional_state: data.emotionalState || "PREFIRO_NAO_RESPONDER",
      daily_check_in: data.dailyCheckIn ?? false,
      check_in_time: data.checkInTime || null,
      season_name: data.seasonName || "Minha Jornada",
      needs_extra_care: data.needsExtraCare ?? false,
      is_founder: checkIsFounder(),
      completed_at: new Date().toISOString(),
    };

    logger.info("Saving onboarding data", "OnboardingService", { userId, stage: data.stage });

    // Upsert to handle both insert and update (user can only have one onboarding)
    // Use type assertion since user_onboarding table is not in generated types yet
    const { error } = await (supabase as unknown as SupabaseClient)
      .from("user_onboarding")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      logger.error("Failed to save onboarding data", "OnboardingService", new Error(error.message));
      return { success: false, error: error.message };
    }

    logger.info("Onboarding data saved successfully", "OnboardingService");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to save onboarding data", "OnboardingService", new Error(errorMessage));
    return { success: false, error: errorMessage };
  }
}

/**
 * Get onboarding data from Supabase
 */
export async function getOnboardingData(
  userId: string
): Promise<{ data: OnboardingData | null; error?: string }> {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured", "OnboardingService");
      return { data: null };
    }

    logger.info("Getting onboarding data", "OnboardingService", { userId });

    // Use type assertion since user_onboarding table is not in generated types yet
    const { data: row, error } = await (supabase as unknown as SupabaseClient)
      .from("user_onboarding")
      .select("*")
      .eq("user_id", userId)
      .single<UserOnboardingRow>();

    if (error) {
      // PGRST116 = no rows found (not an error, just no data)
      if (error.code === "PGRST116") {
        return { data: null };
      }
      logger.error("Failed to get onboarding data", "OnboardingService", new Error(error.message));
      return { data: null, error: error.message };
    }

    if (!row) {
      return { data: null };
    }

    // Map row to OnboardingData
    const typedRow = row as UserOnboardingRow;
    const dateField = getDateFieldForStage(typedRow.stage as OnboardingStage);
    const date = typedRow[dateField] as string | null;

    const onboardingData: OnboardingData = {
      stage: row.stage as OnboardingStage,
      date,
      concerns: (row.concerns || []) as OnboardingConcern[],
      emotionalState: row.emotional_state as EmotionalState | null,
      dailyCheckIn: row.daily_check_in ?? false,
      checkInTime: row.check_in_time,
      seasonName: row.season_name,
      needsExtraCare: row.needs_extra_care ?? false,
    };

    return { data: onboardingData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to get onboarding data", "OnboardingService", new Error(errorMessage));
    return { data: null, error: errorMessage };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const { data } = await getOnboardingData(userId);
  return data !== null;
}
