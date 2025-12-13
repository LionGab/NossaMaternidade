import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";

// Root Stack Navigator
export type RootStackParamList = {
  // Auth Flow (new)
  Login: undefined;
  NotificationPermission: undefined;
  NathIAOnboarding: undefined;

  // Main App
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  // Community
  PostDetail: { postId: string };
  NewPost: undefined;
  GroupDetail: { groupId: string };

  // Profile
  EditProfile: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;

  // Tools
  DailyLog: { date?: string };
  Affirmations: undefined;

  // Habits
  Habits: undefined;
  HabitsEnhanced: undefined;
  MaeValenteProgress: undefined;

  // Wellness (new)
  BreathingExercise: undefined;
  RestSounds: undefined;

  // Other
  Legal: undefined;
  ComingSoon: {
    title?: string;
    description?: string;
    icon?: string;
    emoji?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    relatedRoute?: string;
  };
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Assistant: undefined;
  Profile: undefined;
  MyCare: undefined;
};

// Cycle Tracking Types
export interface CycleLog {
  id: string;
  date: string;
  isPeriod: boolean;
  flow?: "light" | "medium" | "heavy";
  symptoms: string[];
  mood: string[];
  notes?: string;
}

export interface DailyLog {
  id: string;
  date: string;
  temperature?: number;
  sleep?: number;
  water?: number;
  exercise?: boolean;
  sexActivity?: "protected" | "unprotected" | "none";
  symptoms: string[];
  mood: string[];
  discharge?: "none" | "light" | "medium" | "heavy";
  notes?: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
}

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// Onboarding Types
export type OnboardingStep =
  | "welcome"
  | "name"
  | "stage"
  | "dueDate"
  | "age"
  | "location"
  | "goals"
  | "challenges"
  | "support"
  | "communication"
  | "interests"
  | "complete";

export type PregnancyStage =
  | "trying"
  | "pregnant"
  | "postpartum";

export type Interest =
  | "nutrition"
  | "exercise"
  | "mental_health"
  | "baby_care"
  | "breastfeeding"
  | "sleep"
  | "relationships"
  | "career";

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  stage: PregnancyStage;
  dueDate?: string;
  babyBirthDate?: string;
  interests: Interest[];
  createdAt: string;
  hasCompletedOnboarding: boolean;
}

// Community Types
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  groupId?: string;
  isLiked: boolean;
  type?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  category: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
