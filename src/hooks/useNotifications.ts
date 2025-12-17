/**
 * useNotifications Hook
 *
 * Gerencia push notifications via Expo Push API
 *
 * Features:
 * - Auto-registro de push token ao fazer login
 * - Listeners de notificações (recebidas/clicadas)
 * - Gerenciamento de badge count
 * - Renovação automática de token (30 dias)
 * - Remoção de token ao fazer logout
 *
 * Usage:
 * ```tsx
 * const notifications = useNotifications();
 *
 * // Auto-configura ao montar
 * // Listeners ativos automaticamente
 * ```
 */

import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { useAppStore } from "@/state/store";
import { supabase } from "@/api/supabase";
import { logger } from "@/utils/logger";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "@/types/navigation";
import type { NavigationProp } from "@react-navigation/native";

// =======================
// TYPES
// =======================

interface NotificationData {
  type?: string;
  postId?: string;
  commentId?: string;
  habitId?: string;
  conversationId?: string;
  [key: string]: unknown;
}

interface UseNotificationsReturn {
  isEnabled: boolean;
  expoPushToken: string | null;
  requestPermissions: () => Promise<boolean>;
  registerToken: () => Promise<void>;
  unregisterToken: () => Promise<void>;
  setBadgeCount: (count: number) => Promise<void>;
  clearBadge: () => Promise<void>;
}

// =======================
// NOTIFICATION HANDLER CONFIG
// =======================

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// =======================
// HELPER FUNCTIONS
// =======================

/**
 * Register push token to backend
 */
async function registerPushToken(token: string, userId: string): Promise<void> {
  try {
    if (!supabase) {
      throw new Error("Supabase not configured");
    }

    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error("No active session");
    }

    const functionsUrl = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;
    if (!functionsUrl) {
      throw new Error("EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL not configured");
    }

    const response = await fetch(`${functionsUrl}/notifications/register-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        platform: Platform.OS as "ios" | "android",
        deviceId: Constants.deviceId || undefined,
        deviceName: Device.deviceName || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to register token");
    }

    logger.info("Push token registered successfully", "notifications", { userId });
  } catch (error) {
    logger.error("Failed to register push token", "notifications", error as Error);
    throw error;
  }
}

/**
 * Unregister push token from backend (on logout)
 * Uses Edge Function to mark token as inactive
 */
async function unregisterPushToken(token: string): Promise<void> {
  try {
    if (!supabase) {
      return; // Supabase not configured
    }

    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return; // Already logged out, nothing to unregister
    }

    const functionsUrl = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;
    if (!functionsUrl) {
      logger.warn("Cannot unregister token: Functions URL not configured", "notifications");
      return;
    }

    // Call Edge Function to unregister token
    const response = await fetch(`${functionsUrl}/notifications/register-token`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.warn("Failed to unregister push token", "notifications", { error: errorData.error });
    } else {
      logger.info("Push token unregistered successfully", "notifications");
    }
  } catch (error) {
    logger.error("Error unregistering push token", "notifications", error as Error);
  }
}

/**
 * Handle notification received (foreground/background)
 */
function handleNotificationReceived(notification: Notifications.Notification) {
  const notificationData = notification.request.content.data as NotificationData;
  logger.info("Notification received", "notifications", {
    title: notification.request.content.title,
    type: notificationData?.type,
  });

  // Update badge count
  const badgeCount = notification.request.content.badge;
  if (typeof badgeCount === "number") {
    Notifications.setBadgeCountAsync(badgeCount);
  }
}

/**
 * Handle notification tap (user clicked on notification)
 */
function handleNotificationResponse(
  response: Notifications.NotificationResponse,
  navigation: NavigationProp<RootStackParamList>
) {
  const data = response.notification.request.content.data as NotificationData;
  const type = data?.type;

  logger.info("Notification tapped", "notifications", { type, data });

  // Clear badge when user opens notification
  Notifications.setBadgeCountAsync(0);

  // Navigate based on notification type
  switch (type) {
    case "community_comment":
    case "community_like":
      if (data.postId) {
        navigation.navigate("PostDetail", { postId: data.postId });
      } else {
        navigation.navigate("MainTabs", { screen: "Community" });
      }
      break;

    case "community_group_post":
      navigation.navigate("MainTabs", { screen: "Community" });
      break;

    case "habit_reminder":
    case "habit_streak":
      navigation.navigate("Habits");
      break;

    case "daily_check_in":
      navigation.navigate("DailyLog", {});
      break;

    case "daily_affirmation":
      navigation.navigate("Affirmations");
      break;

    case "cycle_period_coming":
    case "cycle_fertile_window":
      // Navigate to MyCare tab which has cycle tracking
      navigation.navigate("MainTabs", { screen: "MyCare" });
      break;

    case "chat_reminder":
      navigation.navigate("MainTabs", { screen: "Assistant" });
      break;

    default:
      // Unknown type, just open app
      logger.warn("Unknown notification type", "notifications", { type });
  }
}

// =======================
// MAIN HOOK
// =======================

export function useNotifications(): UseNotificationsReturn {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);

  const [isEnabled, setIsEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  /**
   * Request notification permissions
   */
  const requestPermissions = async (): Promise<boolean> => {
    if (!Device.isDevice) {
      logger.warn("Push notifications only work on physical devices", "notifications");
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        logger.warn("Push notification permissions denied", "notifications");
        return false;
      }

      setIsEnabled(true);
      return true;
    } catch (error) {
      logger.error("Error requesting notification permissions", "notifications", error as Error);
      return false;
    }
  };

  /**
   * Get Expo Push Token and register to backend
   */
  const registerToken = async (): Promise<void> => {
    if (!user?.id) {
      logger.warn("Cannot register push token: user not logged in", "notifications");
      return;
    }

    if (!Device.isDevice) {
      logger.warn("Push notifications only work on physical devices", "notifications");
      return;
    }

    try {
      // Request permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      const token = tokenData.data;
      setExpoPushToken(token);

      // Register token to backend
      await registerPushToken(token, user.id);

      logger.info("Push token registered", "notifications", { userId: user.id });
    } catch (error) {
      logger.error("Failed to register push token", "notifications", error as Error);
    }
  };

  /**
   * Unregister push token (on logout)
   */
  const unregisterToken = async (): Promise<void> => {
    if (!expoPushToken) {
      return;
    }

    try {
      await unregisterPushToken(expoPushToken);
      setExpoPushToken(null);
      setIsEnabled(false);
    } catch (error) {
      logger.error("Error unregistering token", "notifications", error as Error);
    }
  };

  /**
   * Set badge count
   */
  const setBadgeCount = async (count: number): Promise<void> => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      logger.error("Failed to set badge count", "notifications", error as Error);
    }
  };

  /**
   * Clear badge
   */
  const clearBadge = async (): Promise<void> => {
    await setBadgeCount(0);
  };

  // =======================
  // EFFECTS
  // =======================

  /**
   * Setup notification listeners on mount
   */
  useEffect(() => {
    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    // Listener for when user taps on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => handleNotificationResponse(response, navigation)
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [navigation]);

  /**
   * Auto-register token when user logs in
   */
  useEffect(() => {
    if (user?.id && !expoPushToken) {
      registerToken();
    }
  }, [user?.id]);

  /**
   * Configure notification channel (Android only)
   */
  useEffect(() => {
    if (Platform.OS === "android") {
      // Create notification channels for Android
      const channels = [
        {
          id: "default",
          name: "Geral",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#f4258c",
        },
        {
          id: "community",
          name: "Comunidade",
          importance: Notifications.AndroidImportance.DEFAULT,
        },
        {
          id: "habits",
          name: "Hábitos",
          importance: Notifications.AndroidImportance.DEFAULT,
        },
        {
          id: "check-in",
          name: "Check-in Diário",
          importance: Notifications.AndroidImportance.DEFAULT,
        },
        {
          id: "affirmation",
          name: "Afirmações",
          importance: Notifications.AndroidImportance.DEFAULT,
        },
        {
          id: "cycle",
          name: "Ciclo Menstrual",
          importance: Notifications.AndroidImportance.HIGH,
        },
        {
          id: "chat",
          name: "NathIA Chat",
          importance: Notifications.AndroidImportance.DEFAULT,
        },
        {
          id: "wellness",
          name: "Bem-estar",
          importance: Notifications.AndroidImportance.LOW,
        },
      ];

      channels.forEach((channel) => {
        Notifications.setNotificationChannelAsync(channel.id, channel);
      });
    }
  }, []);

  return {
    isEnabled,
    expoPushToken,
    requestPermissions,
    registerToken,
    unregisterToken,
    setBadgeCount,
    clearBadge,
  };
}
