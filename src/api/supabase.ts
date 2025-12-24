import { createClient, SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Database } from "@/types/database.types";

// Re-export Database type for backward compatibility
export type { Database } from "@/types/database.types";

// Re-export convenience types
export type {
  User,
  UserInsert,
  UserUpdate,
  Post,
  PostInsert,
  PostUpdate,
  Comment,
  CommentInsert,
  CommentUpdate,
  Like,
  LikeInsert,
  Habit,
  HabitInsert,
  HabitUpdate,
  HabitCompletion,
  HabitCompletionInsert,
  Tables,
  InsertTables,
  UpdateTables,
} from "@/types/database.types";

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
      // CRÍTICO: detectSessionInUrl deve ser false em native (Expo)
      // O fluxo OAuth manual via createSessionFromRedirect() cuida da sessão
      detectSessionInUrl: false, // Padrão recomendado para React Native/Expo
    },
  });
}

export { supabase };
