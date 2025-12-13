/**
 * Nossa Maternidade - Notification Service
 * Push notifications + Local notifications for iOS & Android
 */

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

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

// Project ID from app.json
const PROJECT_ID =
  Constants.expoConfig?.extra?.eas?.projectId ??
  "ceee9479-e404-47b8-bc37-4f913c18f270";

// Primary color from design system for Android notification light
const NOTIFICATION_LIGHT_COLOR = "#F43F5E";

/**
 * Request notification permissions from user
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

    // Configure channel for Android first
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: NOTIFICATION_LIGHT_COLOR,
      });
    }

    // Get push token with explicit projectId
    try {
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: PROJECT_ID,
      });
      return tokenResponse.data;
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
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEY);
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
): Promise<void> {
  const current = await getNotificationSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
  body: string
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
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
