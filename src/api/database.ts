// @ts-nocheck - TypeScript disabled due to Supabase type inference issues
// The manually defined Database type in supabase.ts doesn't match Supabase's expected generic structure
// TODO: Generate types from actual Supabase schema using `supabase gen types typescript`
// See: https://supabase.com/docs/guides/api/rest/generating-types
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase, Database } from "./supabase";
import { logger } from "../utils/logger";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

type Comment = Database["public"]["Tables"]["comments"]["Row"];
type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

type Like = Database["public"]["Tables"]["likes"]["Row"];
type LikeInsert = Database["public"]["Tables"]["likes"]["Insert"];

type Habit = Database["public"]["Tables"]["habits"]["Row"];
type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

type HabitCompletion = Database["public"]["Tables"]["habit_completions"]["Row"];
type HabitCompletionInsert = Database["public"]["Tables"]["habit_completions"]["Insert"];

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

// ============================================
// USER OPERATIONS
// ============================================

export async function createUserProfile(userData: UserInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Create user profile error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get user profile error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function updateUserProfile(userId: string, updates: UserUpdate) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Update user profile error", "Database", error as Error);
    return { data: null, error };
  }
}

// ============================================
// POST OPERATIONS
// ============================================

export async function createPost(postData: PostInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Create post error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function getPosts(category?: string) {
  try {
    const client = checkSupabase();
    let query = client.from("posts").select("*").order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get posts error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function getPost(postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get post error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function deletePost(postId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.from("posts").delete().eq("id", postId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Delete post error", "Database", error as Error);
    return { error };
  }
}

// ============================================
// COMMENT OPERATIONS
// ============================================

export async function createComment(commentData: CommentInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("comments")
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;

    // Update post comments count
    await client.rpc("increment_comments_count", { post_id: commentData.post_id });

    return { data, error: null };
  } catch (error) {
    logger.error("Create comment error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function getPostComments(postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get comments error", "Database", error as Error);
    return { data: null, error };
  }
}

// ============================================
// LIKE OPERATIONS
// ============================================

export async function likePost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("likes")
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();

    if (error) throw error;

    // Update post likes count
    await client.rpc("increment_likes_count", { post_id: postId });

    return { data, error: null };
  } catch (error) {
    logger.error("Like post error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function unlikePost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;

    // Update post likes count
    await client.rpc("decrement_likes_count", { post_id: postId });

    return { error: null };
  } catch (error) {
    logger.error("Unlike post error", "Database", error as Error);
    return { error };
  }
}

export async function checkIfUserLikedPost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return { liked: !!data, error: null };
  } catch (error) {
    logger.error("Check like error", "Database", error as Error);
    return { liked: false, error };
  }
}

// ============================================
// HABIT OPERATIONS
// ============================================

export async function createHabit(habitData: HabitInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .insert(habitData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Create habit error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function getUserHabits(userId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get habits error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function updateHabit(habitId: string, updates: HabitUpdate) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", habitId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Update habit error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function deleteHabit(habitId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.from("habits").delete().eq("id", habitId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Delete habit error", "Database", error as Error);
    return { error };
  }
}

export async function completeHabit(
  habitId: string,
  userId: string,
  completedDate: string
) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habit_completions")
      .insert({
        habit_id: habitId,
        user_id: userId,
        completed_date: completedDate,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Complete habit error", "Database", error as Error);
    return { data: null, error };
  }
}

export async function uncompleteHabit(habitId: string, completedDate: string) {
  try {
    const client = checkSupabase();
    const { error } = await client
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("completed_date", completedDate);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Uncomplete habit error", "Database", error as Error);
    return { error };
  }
}

export async function getHabitCompletions(habitId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .order("completed_date", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get habit completions error", "Database", error as Error);
    return { data: null, error };
  }
}
