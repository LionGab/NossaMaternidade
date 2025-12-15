import { createClient, SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Make Supabase optional - only initialize if credentials are provided
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export { supabase };

// Database Types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          stage: string;
          age: number;
          location: string;
          goals: string[];
          challenges: string[];
          support_network: string[];
          communication_preference: string;
          interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          stage: string;
          age: number;
          location: string;
          goals: string[];
          challenges: string[];
          support_network: string[];
          communication_preference: string;
          interests: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          stage?: string;
          age?: number;
          location?: string;
          goals?: string[];
          challenges?: string[];
          support_network?: string[];
          communication_preference?: string;
          interests?: string[];
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          author_name: string;
          content: string;
          category: string;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author_name: string;
          content: string;
          category: string;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          category?: string;
          likes_count?: number;
          comments_count?: number;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          emoji: string;
          current_streak: number;
          best_streak: number;
          total_completions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          emoji: string;
          current_streak?: number;
          best_streak?: number;
          total_completions?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          emoji?: string;
          current_streak?: number;
          best_streak?: number;
          total_completions?: number;
          updated_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_comments_count: {
        Args: { post_id: string };
        Returns: void;
      };
      increment_likes_count: {
        Args: { post_id: string };
        Returns: void;
      };
      decrement_likes_count: {
        Args: { post_id: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
