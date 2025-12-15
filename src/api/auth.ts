import { SupabaseClient } from "@supabase/supabase-js";
import { supabase, Database } from "./supabase";
import { logger } from "../utils/logger";
import { loginUser, logoutUser } from "../services/purchases";

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

    // Identify user in RevenueCat
    if (data.user) {
      await loginUser(data.user.id);
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    logger.error("Sign in error", "Auth", error as Error);
    return { user: null, session: null, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const client = checkSupabase();

    // Logout from RevenueCat first
    await logoutUser();

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
