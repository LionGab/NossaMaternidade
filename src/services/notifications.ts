/**
 * Nossa Maternidade - Notification Service
 * Push notifications + Local notifications for iOS & Android
 *
 * Features:
 * - Expo Push Notifications
 * - Local scheduled notifications
 * - Supabase token sync (optional)
 * - Preference management
 *
 * @version 2.0.0 - Supabase integration (2025-01)
 */

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { supabase } from "../api/supabase";
import { COLORS } from "../theme/tokens";
import { logger } from "../utils/logger";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  dailyCheckIn: boolean;
  affirmations: boolean;
  habits: boolean;
  community: boolean;
  chatReminders: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  dailyCheckIn: true,
  affirmations: true,
  habits: true,
  community: true,
  chatReminders: true,
};

const STORAGE_KEY = "@notification_settings";
const PERMISSION_KEY = "@notification_permission";
const PUSH_TOKEN_KEY = "@push_token";

// Project ID from app.json
const PROJECT_ID =
  Constants.expoConfig?.extra?.eas?.projectId ??
  "ceee9479-e404-47b8-bc37-4f913c18f270";

// Primary color from design system for Android notification light
const NOTIFICATION_LIGHT_COLOR = COLORS.primary[500];

// Edge Function URL
const NOTIFICATIONS_FUNCTION_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/notifications`;

// =======================
// SUPABASE SYNC FUNCTIONS
// =======================

/**
 * Register push token with Supabase Edge Function
 * This enables server-side push notifications
 */
export async function registerTokenWithSupabase(
  token: string,
  platform: "ios" | "android" | "web"
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return false;

    const response = await fetch(`${NOTIFICATIONS_FUNCTION_URL}/register-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        token,
        platform,
        deviceName: Device.deviceName || `${Device.brand} ${Device.modelName}`,
        deviceId: Device.osBuildId || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.warn("Token registration failed", "Notifications", { error: errorData });
      return false;
    }

    return true;
  } catch (err) {
    logger.warn("Token registration error", "Notifications", { error: err });
    return false;
  }
}

/**
 * Get notification preferences from Supabase
 * Falls back to local storage if Supabase is not available
 */
export async function getSupabasePreferences(): Promise<NotificationSettings | null> {
  if (!supabase) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return null;

    const response = await fetch(`${NOTIFICATIONS_FUNCTION_URL}/preferences`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) return null;

    const result = await response.json();
    if (!result.success || !result.preferences) return null;

    // Map Supabase preferences to local format
    const prefs = result.preferences;
    return {
      enabled: prefs.notifications_enabled,
      dailyCheckIn: prefs.daily_check_in,
      affirmations: prefs.daily_affirmation,
      habits: prefs.habit_reminders,
      community: prefs.community_comments || prefs.community_likes || prefs.community_mentions,
      chatReminders: prefs.chat_reminders,
    };
  } catch {
    return null;
  }
}

/**
 * Sync notification preferences to Supabase
 */
export async function syncPreferencesToSupabase(
  settings: NotificationSettings
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return false;

    const response = await fetch(`${NOTIFICATIONS_FUNCTION_URL}/preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        notifications_enabled: settings.enabled,
        daily_check_in: settings.dailyCheckIn,
        daily_affirmation: settings.affirmations,
        habit_reminders: settings.habits,
        community_comments: settings.community,
        community_likes: settings.community,
        community_mentions: settings.community,
        chat_reminders: settings.chatReminders,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

// =======================
// CORE FUNCTIONS
// =======================

/**
 * Request notification permissions from user
 * Registers token with Supabase if successful
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Skip push token registration on non-physical devices (simulator/web)
  // But still allow local notifications
  if (!Device.isDevice) {
    await AsyncStorage.setItem(PERMISSION_KEY, "granted");
    return "simulator-mode";
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      await AsyncStorage.setItem(PERMISSION_KEY, "denied");
      return null;
    }

    await AsyncStorage.setItem(PERMISSION_KEY, "granted");

    // Configure channels for Android
    if (Platform.OS === "android") {
      await configureAndroidChannels();
    }

    // Get push token with explicit projectId
    try {
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: PROJECT_ID,
      });
      const token = tokenResponse.data;

      // Store token locally
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

      // Register with Supabase (non-blocking)
      const platform = Platform.OS === "ios" ? "ios" : "android";
      registerTokenWithSupabase(token, platform).catch(() => {
        // Silently fail - will retry on next app open
      });

      return token;
    } catch {
      // If we can't get a push token, still allow local notifications
      return "local-only";
    }
  } catch {
    // Still mark as granted so user can proceed
    await AsyncStorage.setItem(PERMISSION_KEY, "granted");
    return "local-only";
  }
}

/**
 * Configure Android notification channels
 */
async function configureAndroidChannels(): Promise<void> {
  const channels = [
    {
      id: "default",
      name: "Geral",
      importance: Notifications.AndroidImportance.MAX,
    },
    {
      id: "check-in",
      name: "Check-in Diário",
      importance: Notifications.AndroidImportance.HIGH,
    },
    {
      id: "affirmation",
      name: "Afirmações",
      importance: Notifications.AndroidImportance.DEFAULT,
    },
    {
      id: "habits",
      name: "Hábitos",
      importance: Notifications.AndroidImportance.DEFAULT,
    },
    {
      id: "wellness",
      name: "Bem-estar",
      importance: Notifications.AndroidImportance.DEFAULT,
    },
    {
      id: "community",
      name: "Comunidade",
      importance: Notifications.AndroidImportance.HIGH,
    },
    {
      id: "chat",
      name: "Chat",
      importance: Notifications.AndroidImportance.HIGH,
    },
    {
      id: "cycle",
      name: "Ciclo Menstrual",
      importance: Notifications.AndroidImportance.DEFAULT,
    },
  ];

  for (const channel of channels) {
    await Notifications.setNotificationChannelAsync(channel.id, {
      name: channel.name,
      importance: channel.importance,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: NOTIFICATION_LIGHT_COLOR,
    });
  }
}

/**
 * Get stored push token
 */
export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

/**
 * Re-register token with Supabase (e.g., after login)
 */
export async function refreshTokenRegistration(): Promise<void> {
  const token = await getStoredPushToken();
  if (!token || token === "simulator-mode" || token === "local-only") return;

  const platform = Platform.OS === "ios" ? "ios" : "android";
  await registerTokenWithSupabase(token, platform);
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const permission = await AsyncStorage.getItem(PERMISSION_KEY);
  return permission === "granted";
}

/**
 * Check if notification permission has been asked
 */
export async function hasAskedNotificationPermission(): Promise<boolean> {
  const permission = await AsyncStorage.getItem(PERMISSION_KEY);
  return permission !== null;
}

/**
 * Get notification settings
 * Tries Supabase first, falls back to local storage
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    // Try Supabase first
    const supabaseSettings = await getSupabasePreferences();
    if (supabaseSettings) {
      // Sync to local storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(supabaseSettings));
      return supabaseSettings;
    }

    // Fall back to local storage
    const settings = await AsyncStorage.getItem(STORAGE_KEY);
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Update notification settings
 * Saves locally and syncs to Supabase
 */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
): Promise<void> {
  const current = await getNotificationSettings();
  const updated = { ...current, ...settings };

  // Save locally
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sync to Supabase (non-blocking)
  syncPreferencesToSupabase(updated).catch(() => {
    // Silently fail - local settings are source of truth for UI
  });
}

/**
 * Schedule daily check-in reminder
 */
export async function scheduleDailyCheckIn(hour: number = 9): Promise<string> {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.dailyCheckIn) {
    return "";
  }

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute: 0,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Como você está se sentindo hoje?",
      body: "Reserve um momento para fazer seu check-in diário 💕",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === "android" && { channelId: "check-in" }),
    },
    trigger,
  });

  return id;
}

/**
 * Schedule daily affirmation
 */
export async function scheduleDailyAffirmation(
  hour: number = 8
): Promise<string> {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.affirmations) {
    return "";
  }

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute: 0,
  };

  const affirmations = [
    "Você é forte e capaz 💪",
    "Seu corpo está fazendo um trabalho incrível 🌸",
    "Você merece amor e cuidado 💖",
    "Confie no processo, você está exatamente onde precisa estar 🌟",
    "Sua jornada é única e especial ✨",
    "Você é uma mãe incrível, continue brilhando 🌈",
    "Cada dia é uma nova oportunidade de se cuidar 🦋",
    "Você está fazendo o melhor que pode, e isso é suficiente 💜",
  ];

  const randomAffirmation =
    affirmations[Math.floor(Math.random() * affirmations.length)];

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sua afirmação do dia",
      body: randomAffirmation,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      ...(Platform.OS === "android" && { channelId: "affirmation" }),
    },
    trigger,
  });

  return id;
}

/**
 * Schedule habit reminder
 */
export async function scheduleHabitReminder(hour: number = 20): Promise<string> {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.habits) {
    return "";
  }

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute: 0,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Seus hábitos de hoje",
      body: "Já completou seus hábitos diários? Vamos lá! 🌱",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      ...(Platform.OS === "android" && { channelId: "habits" }),
    },
    trigger,
  });

  return id;
}

/**
 * Schedule wellness reminder (breathing, rest sounds)
 */
export async function scheduleWellnessReminder(
  hour: number = 14
): Promise<string> {
  const settings = await getNotificationSettings();
  if (!settings.enabled) {
    return "";
  }

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour,
    minute: 30,
  };

  const messages = [
    "Que tal uma pausa para respirar? 🌬️",
    "Hora de relaxar um pouco! Sons de descanso esperando por você 🎵",
    "Seu corpo merece uma pausa. Respire fundo! 🧘‍♀️",
    "Momento de autocuidado: 3 minutos de respiração? 💆‍♀️",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Momento de autocuidado",
      body: randomMessage,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      ...(Platform.OS === "android" && { channelId: "wellness" }),
    },
    trigger,
  });

  return id;
}

/**
 * Send immediate notification
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  channelId: string = "default"
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === "android" && { channelId }),
    },
    trigger: null,
  });

  return id;
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel specific notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Initialize all default notifications
 */
export async function initializeNotifications(): Promise<void> {
  const settings = await getNotificationSettings();

  if (!settings.enabled) {
    return;
  }

  // Cancel existing notifications
  await cancelAllNotifications();

  // Schedule new ones
  if (settings.dailyCheckIn) {
    await scheduleDailyCheckIn(9);
  }

  if (settings.affirmations) {
    await scheduleDailyAffirmation(8);
  }

  if (settings.habits) {
    await scheduleHabitReminder(20);
  }

  // Always schedule wellness reminder for premium experience
  await scheduleWellnessReminder(14);

  // Re-register token with Supabase after login
  await refreshTokenRegistration();
}

/**
 * Mark notification setup as complete (for onboarding flow)
 */
export async function markNotificationSetupComplete(): Promise<void> {
  await AsyncStorage.setItem("@notification_setup_complete", "true");
  // Ensure permission key is also set for navigation flow
  const existing = await AsyncStorage.getItem("@notification_permission");
  if (!existing) {
    await AsyncStorage.setItem("@notification_permission", "granted");
  }
}

/**
 * Check if notification setup is complete
 */
export async function isNotificationSetupComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem("@notification_setup_complete");
  return value === "true";
}

/**
 * Skip notification setup (user chose "Agora não")
 */
export async function skipNotificationSetup(): Promise<void> {
  await AsyncStorage.setItem("@notification_setup_complete", "skipped");
  await AsyncStorage.setItem("@notification_permission", "skipped");
}

// =======================
// NOTIFICATION LISTENERS
// =======================

/**
 * Add notification received listener
 * Returns unsubscribe function
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): () => void {
  const subscription = Notifications.addNotificationReceivedListener(callback);
  return () => subscription.remove();
}

/**
 * Add notification response listener (when user taps notification)
 * Returns unsubscribe function
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(callback);
  return () => subscription.remove();
}

/**
 * Get last notification response (for handling notification tap on app launch)
 */
export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  return await Notifications.getLastNotificationResponseAsync();
}
