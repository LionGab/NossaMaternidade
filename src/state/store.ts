import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserProfile,
  Post,
  Group,
  ChatMessage,
  OnboardingStep,
  PregnancyStage,
  Interest,
  DailyLog,
  Affirmation,
} from "../types/navigation";
import { onAuthStateChange } from "../api/auth";
import { getUserProfile } from "../api/database";
import { logger } from "../utils/logger";
import { COLORS } from "../theme/tokens";

interface AppState {
  // User & Auth
  user: UserProfile | null;
  authUserId: string | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  currentOnboardingStep: OnboardingStep;

  // Theme
  theme: "light" | "dark" | "system";
  isDarkMode: boolean;

  // User Actions
  setUser: (user: UserProfile | null) => void;
  setAuthUserId: (userId: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  loadUserProfile: (userId: string) => Promise<void>;
  clearUser: () => void;

  // Theme Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setIsDarkMode: (isDark: boolean) => void;

  // Onboarding Draft
  onboardingDraft: {
    name: string;
    stage: PregnancyStage | null;
    dueDate: string | null;
    interests: Interest[];
  };
  updateOnboardingDraft: (updates: Partial<AppState["onboardingDraft"]>) => void;
  clearOnboardingDraft: () => void;
}

interface CommunityState {
  posts: Post[];
  groups: Group[];

  // Actions
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  setGroups: (groups: Group[]) => void;
}

// Conversation type for chat history
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  isHistoryOpen: boolean;
  hasAcceptedAITerms: boolean; // AI Consent for compliance

  // Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearCurrentChat: () => void;
  toggleHistory: () => void;
  getCurrentMessages: () => ChatMessage[];
  updateConversationTitle: (id: string, title: string) => void;
  acceptAITerms: () => void;
}

// Main App Store (persisted)
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      authUserId: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
      currentOnboardingStep: "welcome",
      theme: "light",
      isDarkMode: false,

      onboardingDraft: {
        name: "",
        stage: null,
        dueDate: null,
        interests: [],
      },

      setUser: (user) => set({ user }),
      setAuthUserId: (userId) => set({ authUserId: userId }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      setOnboardingStep: (step) => set({ currentOnboardingStep: step }),

      loadUserProfile: async (userId: string) => {
        try {
          const { data, error } = await getUserProfile(userId);
          if (error) {
            // Log error but don't throw - maintain silent failure behavior
            // This prevents unhandled promise rejections since loadUserProfile
            // is often called without await (e.g., in auth state listener)
            const errorObj = error instanceof Error ? error : new Error(String(error));
            logger.error("Failed to load user profile", "Store", errorObj);
            return;
          }
          if (data) {
            set({ user: data as unknown as UserProfile });
          }
        } catch (error) {
          // Only log unexpected errors (network issues, etc.)
          // getUserProfile already handles its own errors, so this should rarely happen
          const errorObj = error instanceof Error ? error : new Error(String(error));
          logger.error("Unexpected error loading user profile", "Store", errorObj);
          // Don't throw - maintain graceful degradation
        }
      },

      clearUser: () => set({
        user: null,
        authUserId: null,
        isAuthenticated: false,
        isOnboardingComplete: false,
      }),

      setTheme: (theme) => set({ theme }),
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),

      updateOnboardingDraft: (updates) =>
        set((state) => ({
          onboardingDraft: { ...state.onboardingDraft, ...updates },
        })),
      clearOnboardingDraft: () =>
        set({
          onboardingDraft: {
            name: "",
            stage: null,
            dueDate: null,
            interests: [],
          },
        }),
    }),
    {
      name: "nossa-maternidade-app",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        authUserId: state.authUserId,
        isAuthenticated: state.isAuthenticated,
        isOnboardingComplete: state.isOnboardingComplete,
        theme: state.theme,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// Initialize auth state listener (only if Supabase is configured)
try {
  onAuthStateChange((authUser) => {
    const store = useAppStore.getState();
    if (authUser) {
      store.setAuthUserId(authUser.id);
      store.setAuthenticated(true);
      // Load full profile from database
      store.loadUserProfile(authUser.id);
    } else {
      store.clearUser();
    }
  });
} catch {
  // Supabase not configured, skip auth state listener
  logger.info("Supabase not configured - skipping auth state listener", "Store");
}

// Community Store (not persisted to keep data fresh)
export const useCommunityStore = create<CommunityState>()((set) => ({
  posts: [],
  groups: [],

  setPosts: (posts) => set({ posts }),
  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post
      ),
    })),
  setGroups: (groups) => set({ groups }),
}));

// Chat Store (persisted for message history)
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      isHistoryOpen: false,
      hasAcceptedAITerms: false,

      createConversation: () => {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: "Nova conversa",
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));
        return newConversation.id;
      },

      deleteConversation: (id) =>
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: newConversations,
            currentConversationId:
              state.currentConversationId === id
                ? newConversations[0]?.id || null
                : state.currentConversationId,
          };
        }),

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addMessage: (message) =>
        set((state) => {
          let conversationId = state.currentConversationId;

          // If no current conversation, create one
          if (!conversationId) {
            const newConversation: Conversation = {
              id: Date.now().toString(),
              title: message.role === "user" ? message.content.slice(0, 30) + "..." : "Nova conversa",
              messages: [message],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return {
              conversations: [newConversation, ...state.conversations],
              currentConversationId: newConversation.id,
            };
          }

          // Add to existing conversation
          return {
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, message],
                    updatedAt: new Date().toISOString(),
                    // Update title from first user message
                    title:
                      conv.messages.length === 0 && message.role === "user"
                        ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                        : conv.title,
                  }
                : conv
            ),
          };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearCurrentChat: () =>
        set((state) => ({
          conversations: state.conversations.filter(
            (c) => c.id !== state.currentConversationId
          ),
          currentConversationId: null,
        })),

      toggleHistory: () => set((state) => ({ isHistoryOpen: !state.isHistoryOpen })),

      getCurrentMessages: () => {
        const state = get();
        const currentConv = state.conversations.find(
          (c) => c.id === state.currentConversationId
        );
        return currentConv?.messages || [];
      },

      updateConversationTitle: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        })),

      acceptAITerms: () => set({ hasAcceptedAITerms: true }),
    }),
    {
      name: "nossa-maternidade-chat",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        hasAcceptedAITerms: state.hasAcceptedAITerms,
      }),
    }
  )
);

// Cycle Tracking Store
interface CycleState {
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  dailyLogs: DailyLog[];

  setLastPeriodStart: (date: string) => void;
  setCycleLength: (length: number) => void;
  setPeriodLength: (length: number) => void;
  addDailyLog: (log: DailyLog) => void;
  updateDailyLog: (id: string, updates: Partial<DailyLog>) => void;
  getDailyLog: (date: string) => DailyLog | undefined;
}

export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => ({
      lastPeriodStart: null,
      cycleLength: 28,
      periodLength: 5,
      dailyLogs: [],

      setLastPeriodStart: (date) => set({ lastPeriodStart: date }),
      setCycleLength: (length) => set({ cycleLength: length }),
      setPeriodLength: (length) => set({ periodLength: length }),
      addDailyLog: (log) =>
        set((state) => ({
          dailyLogs: [...state.dailyLogs.filter((l) => l.date !== log.date), log],
        })),
      updateDailyLog: (id, updates) =>
        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          ),
        })),
      getDailyLog: (date) => get().dailyLogs.find((log) => log.date === date),
    }),
    {
      name: "nossa-maternidade-cycle",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Affirmations Store
interface AffirmationsState {
  todayAffirmation: Affirmation | null;
  favoriteAffirmations: Affirmation[];
  lastShownDate: string | null;

  setTodayAffirmation: (affirmation: Affirmation) => void;
  addToFavorites: (affirmation: Affirmation) => void;
  removeFromFavorites: (id: string) => void;
  setLastShownDate: (date: string) => void;
}

export const useAffirmationsStore = create<AffirmationsState>()(
  persist(
    (set) => ({
      todayAffirmation: null,
      favoriteAffirmations: [],
      lastShownDate: null,

      setTodayAffirmation: (affirmation) => set({ todayAffirmation: affirmation }),
      addToFavorites: (affirmation) =>
        set((state) => ({
          favoriteAffirmations: [...state.favoriteAffirmations, affirmation],
        })),
      removeFromFavorites: (id) =>
        set((state) => ({
          favoriteAffirmations: state.favoriteAffirmations.filter((a) => a.id !== id),
        })),
      setLastShownDate: (date) => set({ lastShownDate: date }),
    }),
    {
      name: "nossa-maternidade-affirmations",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Habits Store
export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: "self-care" | "health" | "mindfulness" | "connection" | "growth";
  completed: boolean;
  streak: number;
  bestStreak: number;
  completedDates: string[];
}

interface HabitsState {
  habits: Habit[];
  weeklyCompletion: number[];
  totalStreak: number;

  toggleHabit: (id: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  resetDailyHabits: () => void;
  getCompletedToday: () => number;
}

// Cuidados diários - linguagem fitness gentil, sem cobrança
// Inspirado no estilo saudável da Nathalia, mas acessível para todas
const DEFAULT_HABITS: Habit[] = [
  {
    id: "1",
    title: "Água no corpo",
    description: "Hidratação sustenta tudo: pele, energia, disposição",
    icon: "water",
    color: COLORS.secondary[400],
    category: "health",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "2",
    title: "Comida de verdade",
    description: "Comer bem é nutrir, não restringir",
    icon: "restaurant",
    color: COLORS.mood.sensitive,
    category: "health",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "3",
    title: "5 min só pra mim",
    description: "Skincare, banho, ou só fechar os olhos",
    icon: "sparkles",
    color: COLORS.mood.energetic,
    category: "self-care",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "4",
    title: "Um pouco de sol",
    description: "Luz natural acorda o corpo por dentro",
    icon: "sunny",
    color: COLORS.semantic.warning,
    category: "health",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "5",
    title: "Conversa adulta",
    description: "Falar com alguém que te ouve",
    icon: "chatbubbles",
    color: COLORS.mood.sensitive,
    category: "connection",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "6",
    title: "3 respirações",
    description: "Quando apertar, inspira fundo",
    icon: "leaf",
    color: COLORS.semantic.success,
    category: "mindfulness",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "7",
    title: "Foto do momento",
    description: "Registrar presença, não perfeição",
    icon: "camera",
    color: COLORS.mood.tired,
    category: "connection",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "8",
    title: "Pedir ajuda",
    description: "Delegar é força, não fraqueza",
    icon: "hand-left",
    color: COLORS.accent[500],
    category: "self-care",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
];

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: DEFAULT_HABITS,
      weeklyCompletion: [0, 0, 0, 0, 0, 0, 0],
      totalStreak: 0,

      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            const isCompleting = !habit.completed;
            const newCompletedDates = isCompleting
              ? [...habit.completedDates, date]
              : habit.completedDates.filter((d) => d !== date);
            const newStreak = isCompleting ? habit.streak + 1 : Math.max(0, habit.streak - 1);
            return {
              ...habit,
              completed: isCompleting,
              streak: newStreak,
              bestStreak: Math.max(habit.bestStreak, newStreak),
              completedDates: newCompletedDates,
            };
          }),
        })),

      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, habit],
        })),

      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      resetDailyHabits: () =>
        set((state) => ({
          habits: state.habits.map((habit) => ({ ...habit, completed: false })),
        })),

      getCompletedToday: () => get().habits.filter((h) => h.completed).length,
    }),
    {
      name: "nossa-maternidade-habits",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Daily Check-in Store
export interface DailyCheckIn {
  date: string;
  mood: number | null; // 1-5 scale
  energy: number | null; // 1-5 scale
  sleep: number | null; // 1-5 scale
  note?: string;
}

interface CheckInState {
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  streak: number;

  setTodayMood: (mood: number) => void;
  setTodayEnergy: (energy: number) => void;
  setTodaySleep: (sleep: number) => void;
  setTodayNote: (note: string) => void;
  getTodayCheckIn: () => DailyCheckIn | null;
  isCheckInComplete: () => boolean;
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkIns: [],
      todayCheckIn: null,
      streak: 0,

      setTodayMood: (mood) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) =>
                c.date === today ? { ...c, mood } : c
              ),
              todayCheckIn: { ...existing, mood },
            };
          }
          const newCheckIn: DailyCheckIn = {
            date: today,
            mood,
            energy: null,
            sleep: null,
          };
          return {
            checkIns: [newCheckIn, ...state.checkIns],
            todayCheckIn: newCheckIn,
          };
        });
      },

      setTodayEnergy: (energy) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) =>
                c.date === today ? { ...c, energy } : c
              ),
              todayCheckIn: { ...existing, energy },
            };
          }
          const newCheckIn: DailyCheckIn = {
            date: today,
            mood: null,
            energy,
            sleep: null,
          };
          return {
            checkIns: [newCheckIn, ...state.checkIns],
            todayCheckIn: newCheckIn,
          };
        });
      },

      setTodaySleep: (sleep) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) =>
                c.date === today ? { ...c, sleep } : c
              ),
              todayCheckIn: { ...existing, sleep },
            };
          }
          const newCheckIn: DailyCheckIn = {
            date: today,
            mood: null,
            energy: null,
            sleep,
          };
          return {
            checkIns: [newCheckIn, ...state.checkIns],
            todayCheckIn: newCheckIn,
          };
        });
      },

      setTodayNote: (note) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) =>
                c.date === today ? { ...c, note } : c
              ),
              todayCheckIn: { ...existing, note },
            };
          }
          return state;
        });
      },

      getTodayCheckIn: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().checkIns.find((c) => c.date === today) || null;
      },

      isCheckInComplete: () => {
        const today = new Date().toISOString().split("T")[0];
        const checkIn = get().checkIns.find((c) => c.date === today);
        return checkIn
          ? checkIn.mood !== null && checkIn.energy !== null && checkIn.sleep !== null
          : false;
      },
    }),
    {
      name: "nossa-maternidade-checkin",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
