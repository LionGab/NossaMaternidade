/**
 * NotificationPreferencesScreen
 *
 * Tela para gerenciar preferências de notificações push
 *
 * Features:
 * - Master switch (habilita/desabilita tudo)
 * - Preferências granulares por tipo
 * - Horários personalizados (check-in, afirmação, hábitos, wellness)
 * - Sound e vibração toggles
 * - Sincroniza com backend em tempo real
 *
 * Grid 8pt compliant via Tailwind
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/api/supabase";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state/store";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

interface NotificationPreferences {
  notifications_enabled: boolean;
  daily_check_in: boolean;
  daily_affirmation: boolean;
  habit_reminders: boolean;
  wellness_reminders: boolean;
  community_comments: boolean;
  community_likes: boolean;
  community_mentions: boolean;
  chat_reminders: boolean;
  cycle_reminders: boolean;
  period_predictions: boolean;
  check_in_time: string;
  affirmation_time: string;
  habit_reminder_time: string;
  wellness_time: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

interface PreferenceSection {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  preferences: {
    key: keyof NotificationPreferences;
    label: string;
    description?: string;
  }[];
}

export default function NotificationPreferencesScreen({
  navigation,
}: RootStackScreenProps<"NotificationPreferences">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const user = useAppStore((s) => s.user);

  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Cores dinâmicas
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textSecondary = isDark ? colors.neutral[400] : colors.neutral[500];
  const borderColor = isDark ? colors.neutral[700] : colors.neutral[200];
  const cardBg = isDark ? colors.neutral[800] : colors.neutral[50];

  // Seções de preferências
  const SECTIONS: PreferenceSection[] = [
    {
      title: "Bem-estar Diário",
      icon: "sparkles-outline",
      preferences: [
        {
          key: "daily_check_in",
          label: "Check-in diário",
          description: "Lembrete para registrar como você está se sentindo",
        },
        {
          key: "daily_affirmation",
          label: "Afirmação diária",
          description: "Receba mensagens motivacionais todo dia",
        },
        {
          key: "habit_reminders",
          label: "Lembretes de hábitos",
          description: "Notificações para manter seus hábitos de bem-estar",
        },
        {
          key: "wellness_reminders",
          label: "Lembretes de hidratação e movimento",
          description: "Pausas para beber água e alongar",
        },
      ],
    },
    {
      title: "Comunidade",
      icon: "people-outline",
      preferences: [
        {
          key: "community_comments",
          label: "Novos comentários",
          description: "Quando alguém comenta nas suas publicações",
        },
        {
          key: "community_likes",
          label: "Curtidas",
          description: "Quando suas publicações recebem curtidas (marcos: 5, 10, 25...)",
        },
        {
          key: "community_mentions",
          label: "Menções",
          description: "Quando alguém menciona você em uma publicação",
        },
      ],
    },
    {
      title: "Ciclo e Saúde",
      icon: "calendar-outline",
      preferences: [
        {
          key: "cycle_reminders",
          label: "Lembretes de ciclo",
          description: "Avisos sobre fases do ciclo menstrual",
        },
        {
          key: "period_predictions",
          label: "Previsão de período",
          description: "Notificação 3 dias antes do período estimado",
        },
      ],
    },
    {
      title: "NathIA Chat",
      icon: "chatbubble-outline",
      preferences: [
        {
          key: "chat_reminders",
          label: "Lembretes de conversas",
          description: "Quando a NathIA tem algo importante para compartilhar",
        },
      ],
    },
  ];

  /**
   * Load preferences from backend via Edge Function
   */
  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("No active session");
      }

      const functionsUrl = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;
      if (!functionsUrl) {
        throw new Error("Functions URL not configured");
      }

      const response = await fetch(`${functionsUrl}/notifications/preferences`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load preferences");
      }

      const data = await response.json();
      setPrefs(data.preferences as NotificationPreferences);
    } catch (error) {
      logger.error("Failed to load notification preferences", "notifications", error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update preference in backend via Edge Function
   */
  const updatePreference = async (
    key: keyof NotificationPreferences,
    value: boolean | string
  ) => {
    if (!user?.id || !prefs) return;

    try {
      setIsSaving(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("No active session");
      }

      const functionsUrl = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;
      if (!functionsUrl) {
        throw new Error("Functions URL not configured");
      }

      const response = await fetch(`${functionsUrl}/notifications/preferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update preference");
      }

      // Update local state
      setPrefs({ ...prefs, [key]: value });

      logger.info("Notification preference updated", "notifications", { key, value });
    } catch (error) {
      logger.error("Failed to update preference", "notifications", error as Error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle master switch (enables/disables all notifications)
   */
  const toggleMasterSwitch = async (enabled: boolean) => {
    await updatePreference("notifications_enabled", enabled);
  };

  /**
   * Toggle individual preference
   */
  const togglePreference = async (key: keyof NotificationPreferences) => {
    if (!prefs) return;
    const currentValue = prefs[key];
    if (typeof currentValue === "boolean") {
      await updatePreference(key, !currentValue);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!prefs) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <Ionicons name="alert-circle-outline" size={64} color={textSecondary} />
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Manrope_600SemiBold",
            color: textMain,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Erro ao carregar preferências
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginRight: 16 }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={textMain} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Manrope_700Bold",
            color: textMain,
            flex: 1,
          }}
        >
          Notificações
        </Text>
        {isSaving && <ActivityIndicator size="small" color={colors.primary[500]} />}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 32,
        }}
      >
        {/* Master Switch */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={{
            marginTop: 24,
            padding: 20,
            backgroundColor: cardBg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: prefs.notifications_enabled
                  ? colors.primary[500] + "20"
                  : colors.neutral[200],
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons
                name={prefs.notifications_enabled ? "notifications" : "notifications-off"}
                size={24}
                color={prefs.notifications_enabled ? colors.primary[500] : textSecondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Manrope_600SemiBold",
                  color: textMain,
                  marginBottom: 4,
                }}
              >
                Habilitar notificações
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Manrope_400Regular",
                  color: textSecondary,
                }}
              >
                Ativar ou desativar todas as notificações
              </Text>
            </View>
            <Switch
              value={prefs.notifications_enabled}
              onValueChange={toggleMasterSwitch}
              trackColor={{
                false: colors.neutral[300],
                true: colors.primary[500],
              }}
              thumbColor={Platform.OS === "android" ? colors.neutral[50] : undefined}
              ios_backgroundColor={colors.neutral[300]}
            />
          </View>
        </Animated.View>

        {/* Preference Sections */}
        {SECTIONS.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(200 + sectionIndex * 100).springify()}
            style={{ marginTop: 32 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Ionicons name={section.icon} size={20} color={colors.primary[500]} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Manrope_700Bold",
                  color: textMain,
                  marginLeft: 8,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {section.title}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: borderColor,
                overflow: "hidden",
              }}
            >
              {section.preferences.map((pref, prefIndex) => {
                const isEnabled = prefs[pref.key] as boolean;
                const isLast = prefIndex === section.preferences.length - 1;

                return (
                  <Pressable
                    key={pref.key}
                    onPress={() => togglePreference(pref.key)}
                    disabled={!prefs.notifications_enabled}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: borderColor,
                      opacity: prefs.notifications_enabled ? 1 : 0.5,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 16 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: "Manrope_600SemiBold",
                          color: textMain,
                          marginBottom: pref.description ? 4 : 0,
                        }}
                      >
                        {pref.label}
                      </Text>
                      {pref.description && (
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Manrope_400Regular",
                            color: textSecondary,
                            lineHeight: 18,
                          }}
                        >
                          {pref.description}
                        </Text>
                      )}
                    </View>
                    <Switch
                      value={isEnabled}
                      onValueChange={() => togglePreference(pref.key)}
                      disabled={!prefs.notifications_enabled}
                      trackColor={{
                        false: colors.neutral[300],
                        true: colors.primary[500],
                      }}
                      thumbColor={Platform.OS === "android" ? colors.neutral[50] : undefined}
                      ios_backgroundColor={colors.neutral[300]}
                    />
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        ))}

        {/* Sound & Vibration */}
        <Animated.View
          entering={FadeInDown.delay(800).springify()}
          style={{ marginTop: 32 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Ionicons name="volume-medium-outline" size={20} color={colors.primary[500]} />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Manrope_700Bold",
                color: textMain,
                marginLeft: 8,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Som e Vibração
            </Text>
          </View>

          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: borderColor,
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={() => updatePreference("sound_enabled", !prefs.sound_enabled)}
              disabled={!prefs.notifications_enabled}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
                opacity: prefs.notifications_enabled ? 1 : 0.5,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Manrope_600SemiBold",
                    color: textMain,
                  }}
                >
                  Som
                </Text>
              </View>
              <Switch
                value={prefs.sound_enabled}
                onValueChange={(value) => updatePreference("sound_enabled", value)}
                disabled={!prefs.notifications_enabled}
                trackColor={{
                  false: colors.neutral[300],
                  true: colors.primary[500],
                }}
                thumbColor={Platform.OS === "android" ? colors.neutral[50] : undefined}
                ios_backgroundColor={colors.neutral[300]}
              />
            </Pressable>

            <Pressable
              onPress={() => updatePreference("vibration_enabled", !prefs.vibration_enabled)}
              disabled={!prefs.notifications_enabled}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                opacity: prefs.notifications_enabled ? 1 : 0.5,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Manrope_600SemiBold",
                    color: textMain,
                  }}
                >
                  Vibração
                </Text>
              </View>
              <Switch
                value={prefs.vibration_enabled}
                onValueChange={(value) => updatePreference("vibration_enabled", value)}
                disabled={!prefs.notifications_enabled}
                trackColor={{
                  false: colors.neutral[300],
                  true: colors.primary[500],
                }}
                thumbColor={Platform.OS === "android" ? colors.neutral[50] : undefined}
                ios_backgroundColor={colors.neutral[300]}
              />
            </Pressable>
          </View>
        </Animated.View>

        {/* Info Footer */}
        <View
          style={{
            marginTop: 32,
            padding: 16,
            backgroundColor: isDark ? colors.neutral[800] + "60" : colors.primary[50],
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary[500],
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Manrope_400Regular",
              color: textSecondary,
              lineHeight: 20,
            }}
          >
            As notificações ajudam você a manter seus hábitos de bem-estar e ficar conectada com
            a comunidade. Você pode personalizar cada tipo de notificação individualmente.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
