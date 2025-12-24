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
 * ⚠️ IMPORTANTE: Push notifications não funcionam no Expo Go SDK 53+.
 * Use Development Build para funcionalidade completa.
 *
 * Usage:
 * ```tsx
 * const notifications = useNotifications();
 *
 * // Auto-configura ao montar
 * // Listeners ativos automaticamente
 * ```
 */

import { supabase } from "@/api/supabase";
import { navigationRef } from "@/navigation/navigationRef";
import { useAppStore } from "@/state/store";
import { COLORS } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

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
 * Uses navigationRef instead of useNavigation to work outside NavigationContainer
 */
function handleNotificationResponse(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data as NotificationData;
  const type = data?.type;

  logger.info("Notification tapped", "notifications", { type, data });

  // Clear badge when user opens notification
  Notifications.setBadgeCountAsync(0);

  // Check if navigation is ready before navigating
  if (!navigationRef.isReady()) {
    logger.warn("Navigation not ready, cannot navigate from notification", "notifications");
    return;
  }

  // Navigate based on notification type
  switch (type) {
    case "community_comment":
    case "community_like":
      if (data.postId) {
        navigationRef.navigate("PostDetail", { postId: data.postId });
      } else {
        navigationRef.navigate("MainTabs", { screen: "Community" });
      }
      break;

    case "community_group_post":
      navigationRef.navigate("MainTabs", { screen: "Community" });
      break;

    case "habit_reminder":
    case "habit_streak":
      navigationRef.navigate("Habits");
      break;

    case "daily_check_in":
      navigationRef.navigate("DailyLog", {});
      break;

    case "daily_affirmation":
      navigationRef.navigate("Affirmations");
      break;

    case "cycle_period_coming":
    case "cycle_fertile_window":
      // Navigate to MyCare tab which has cycle tracking
      navigationRef.navigate("MainTabs", { screen: "MyCare" });
      break;

    case "chat_reminder":
      navigationRef.navigate("MainTabs", { screen: "Assistant" });
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

    // Notifications não são totalmente suportadas no web
    if (Platform.OS === "web") {
      logger.debug("Push token registration skipped on web platform", "notifications");
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
   * Skip on web platform (notifications not fully supported)
   */
  useEffect(() => {
    // Notifications não são totalmente suportadas no web
    if (Platform.OS === "web") {
      logger.debug("Notifications listeners skipped on web platform", "notifications");
      return;
    }

    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    // Listener for when user taps on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  /**
   * Auto-register token when user logs in
   */
  useEffect(() => {
    if (user?.id && !expoPushToken) {
      registerToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          lightColor: COLORS.primary[500],
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
