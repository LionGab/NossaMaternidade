import { SupabaseClient } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { supabase, Database } from "./supabase";
import { logger } from "../utils/logger";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

/**
 * Type guard to ensure Supabase client is configured
 * @throws Error if Supabase is not initialized
 * @returns Typed Supabase client
 */
function checkSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your environment variables.");
  }
  return supabase;
}

function getEmailRedirectUri(): string {
  if (Platform.OS === "web") {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/auth/callback`;
  }

  const uri = AuthSession.makeRedirectUri({
    scheme: "nossamaternidade",
    path: "auth/callback",
  });

  return uri || "nossamaternidade://auth/callback";
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    logger.error("Sign up error", "Auth", error as Error);
    return { user: null, error };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Identify user in RevenueCat (with Expo Go fallback)
    if (data.user) {
      try {
        const revenuecat = await import("../services/revenuecat");
        await revenuecat.loginUser(data.user.id);
      } catch (err) {
        logger.warn("RevenueCat indisponível (provável Expo Go). Ignorando login.", "Auth", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    logger.error("Sign in error", "Auth", error as Error);
    return { user: null, session: null, error };
  }
}

/**
 * Sign in with magic link (email OTP)
 */
export async function signInWithMagicLink(email: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getEmailRedirectUri(),
      },
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    logger.error("Magic link sign in error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const client = checkSupabase();

    // Logout from RevenueCat first (with Expo Go fallback)
    try {
      const revenuecat = await import("../services/revenuecat");
      await revenuecat.logoutUser();
    } catch (err) {
      logger.warn("RevenueCat indisponível (provável Expo Go). Ignorando logout.", "Auth", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Sign out error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const client = checkSupabase();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    logger.error("Get current user error", "Auth", error as Error);
    return { user: null, error };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const client = checkSupabase();
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error) throw error;

    return { session, error: null };
  } catch (error) {
    logger.error("Get session error", "Auth", error as Error);
    return { session: null, error };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: "nossamaternidade://reset-password",
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    logger.error("Reset password error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    logger.error("Update password error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const client = checkSupabase();
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    void event;
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.user_metadata?.name,
      });
    } else {
      callback(null);
    }
  });

  return subscription;
}

// =======================
// ACCOUNT DELETION (LGPD)
// =======================

export interface DeleteAccountResult {
  success: boolean;
  message?: string;
  deletedTables?: string[];
  error?: string;
}

/**
 * Permanently delete user account and all associated data
 * Calls the delete-account Edge Function
 *
 * @param reason - Optional reason for deletion (for analytics)
 * @returns Result object with success status
 *
 * @example
 * const result = await deleteAccount("Não uso mais o app");
 * if (result.success) {
 *   // Redirect to login
 * }
 */
export async function deleteAccount(reason?: string): Promise<DeleteAccountResult> {
  try {
    const client = checkSupabase();

    // Get current session for auth token
    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();

    if (sessionError || !session) {
      return {
        success: false,
        error: "Você precisa estar logado para deletar sua conta",
      };
    }

    // Get Supabase URL from env
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return {
        success: false,
        error: "Supabase não está configurado",
      };
    }

    // Call Edge Function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/delete-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          confirmation: "DELETE",
          reason,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      logger.error("Delete account failed", "Auth", new Error(data.error || "Unknown error"));
      return {
        success: false,
        error: data.error || "Falha ao deletar conta",
      };
    }

    // Logout from RevenueCat (with Expo Go fallback)
    try {
      const revenuecat = await import("../services/revenuecat");
      await revenuecat.logoutUser();
    } catch (err) {
      logger.warn("RevenueCat indisponível. Ignorando logout.", "Auth", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Clear local session
    await client.auth.signOut();

    logger.info("Account deleted successfully", "Auth", {
      deletedTables: data.deletedTables,
    });

    return {
      success: true,
      message: data.message,
      deletedTables: data.deletedTables,
    };
  } catch (error) {
    logger.error("Delete account error", "Auth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
