/**
 * Nossa Maternidade - RestSoundsScreen
 * Relaxation sounds categorized by nature, meditation, and sleep
 *
 * ⚠️ NOTA: expo-av está deprecated e será removido no SDK 54.
 * Migração para expo-audio planejada para versão futura.
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
// expo-av deprecated, será migrado para expo-audio em versão futura
import { Audio } from "expo-av";
import { useTheme } from "../hooks/useTheme";
import { Tokens } from "../theme/tokens";

type SoundCategory = "nature" | "meditation" | "sleep";

interface SoundItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: SoundCategory;
  audioUri?: string;
}

const SOUNDS: SoundItem[] = [
  // Nature Sounds
  {
    id: "rain",
    title: "Chuva Suave",
    subtitle: "Som relaxante de chuva",
    duration: "30 min",
    icon: "rainy",
    color: Tokens.brand.primary[400],
    category: "nature",
  },
  {
    id: "ocean",
    title: "Ondas do Mar",
    subtitle: "Paz do oceano",
    duration: "45 min",
    icon: "water",
    color: Tokens.brand.accent[500],
    category: "nature",
  },
  {
    id: "forest",
    title: "Floresta",
    subtitle: "Passaros e natureza",
    duration: "40 min",
    icon: "leaf",
    color: Tokens.semantic.light.success,
    category: "nature",
  },
  {
    id: "fire",
    title: "Lareira",
    subtitle: "Crepitar do fogo",
    duration: "60 min",
    icon: "flame",
    color: Tokens.semantic.light.warning,
    category: "nature",
  },

  // Meditation
  {
    id: "breathe",
    title: "Respiracao Guiada",
    subtitle: "Para maes",
    duration: "10 min",
    icon: "heart",
    color: Tokens.brand.primary[500],
    category: "meditation",
  },
  {
    id: "body-scan",
    title: "Relaxamento Corporal",
    subtitle: "Meditacao guiada",
    duration: "15 min",
    icon: "body",
    color: Tokens.brand.secondary[500],
    category: "meditation",
  },
  {
    id: "loving-kindness",
    title: "Amor Proprio",
    subtitle: "Meditacao de bondade",
    duration: "12 min",
    icon: "sparkles",
    color: Tokens.brand.accent[500],
    category: "meditation",
  },

  // Sleep
  {
    id: "lullaby",
    title: "Cancao de Ninar",
    subtitle: "Para voce e seu bebe",
    duration: "20 min",
    icon: "musical-notes",
    color: Tokens.brand.secondary[500],
    category: "sleep",
  },
  {
    id: "sleep-story",
    title: "Historia para Dormir",
    subtitle: "Narracao tranquila",
    duration: "25 min",
    icon: "book",
    color: Tokens.brand.primary[500],
    category: "sleep",
  },
  {
    id: "white-noise",
    title: "Ruido Branco",
    subtitle: "Som continuo suave",
    duration: "60 min",
    icon: "radio",
    color: Tokens.neutral[400],
    category: "sleep",
  },
];

/**
 * Cores semânticas para tela de descanso (dark theme by design)
 * Esta tela usa tema escuro intencionalmente para ajudar no relaxamento
 */
const getRestColors = (_isDark: boolean) => ({
  // Backgrounds - always dark for relaxation
  bgPrimary: "#1F2937",
  bgSecondary: "#111827",
  cardBg: Tokens.overlay.light,
  cardBgActive: (color: string) => `${color}20`,
  // Text
  textPrimary: Tokens.neutral[0],
  textSecondary: Tokens.neutral[400],
  textMuted: Tokens.overlay.heavy,
  // UI elements
  iconBg: "#374151",
  iconBgActive: (color: string) => color,
  border: Tokens.overlay.light,
  borderActive: (color: string) => color,
  // Info card
  infoBg: Tokens.overlay.light,
  infoIconBg: "rgba(192, 132, 252, 0.2)", // Purple theme for rest screen
  infoIcon: "#C084FC",
  // Tab
  tabBg: Tokens.overlay.light,
  tabActive: Tokens.overlay.heavy,
  // Tip - Purple theme for rest screen
  tipBg: "rgba(168, 85, 247, 0.1)",
  tipBorder: "rgba(168, 85, 247, 0.2)",
});

const CATEGORIES = [
  {
    id: "nature" as SoundCategory,
    name: "Natureza",
    icon: "leaf" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "meditation" as SoundCategory,
    name: "Meditacao",
    icon: "heart" as keyof typeof Ionicons.glyphMap,
  },
  { id: "sleep" as SoundCategory, name: "Sono", icon: "moon" as keyof typeof Ionicons.glyphMap },
];

export default function RestSoundsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const restColors = useMemo(() => getRestColors(isDark), [isDark]);
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>("nature");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const filteredSounds = SOUNDS.filter((s) => s.category === selectedCategory);

  const handleCategoryChange = (category: SoundCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handlePlaySound = async (soundId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Stop currently playing sound
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }

    if (playingSound === soundId) {
      // Stop if same sound
      setPlayingSound(null);
      return;
    }

    // In production, load and play the actual audio file
    // For now, just simulate playing
    setPlayingSound(soundId);
  };

  const handleClose = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: restColors.bgPrimary }}>
      {/* Header */}
      <LinearGradient
        colors={[restColors.bgPrimary, restColors.bgSecondary]}
        style={{
          paddingTop: insets.top + Tokens.spacing.lg,
          paddingBottom: Tokens.spacing.xl,
          paddingHorizontal: Tokens.spacing["2xl"],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Tokens.spacing["2xl"],
          }}
        >
          <Pressable onPress={handleClose} style={{ padding: Tokens.spacing.sm }}>
            <Ionicons name="close" size={28} color={restColors.textPrimary} />
          </Pressable>
          <Text
            style={{
              color: restColors.textPrimary,
              fontSize: Tokens.typography.headlineSmall.fontSize,
              fontWeight: "700",
            }}
          >
            Descanso
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: restColors.infoBg,
            borderRadius: Tokens.radius["2xl"],
            padding: Tokens.spacing.lg,
            marginBottom: Tokens.spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: restColors.infoIconBg,
                borderRadius: Tokens.radius.full,
                padding: Tokens.spacing.sm,
                marginRight: Tokens.spacing.md,
              }}
            >
              <Ionicons name="moon" size={20} color={restColors.infoIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: restColors.textPrimary,
                  fontSize: Tokens.typography.bodyMedium.fontSize,
                  fontWeight: "600",
                }}
              >
                Sons para relaxar
              </Text>
              <Text
                style={{
                  color: restColors.textMuted,
                  fontSize: Tokens.typography.caption.fontSize,
                  marginTop: 2,
                }}
              >
                Encontre paz e tranquilidade
              </Text>
            </View>
          </View>
        </View>

        {/* Category Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: restColors.tabBg,
            borderRadius: Tokens.radius.full,
            padding: Tokens.spacing.xs,
          }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryChange(cat.id)}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  paddingVertical: Tokens.spacing.sm + 2,
                  borderRadius: Tokens.radius.full,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    selectedCategory === cat.id ? restColors.tabActive : "transparent",
                }}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={
                    selectedCategory === cat.id ? restColors.textPrimary : restColors.textSecondary
                  }
                />
                <Text
                  style={{
                    marginLeft: Tokens.spacing.sm,
                    fontSize: Tokens.typography.bodyMedium.fontSize,
                    fontWeight: "600",
                    color:
                      selectedCategory === cat.id
                        ? restColors.textPrimary
                        : restColors.textSecondary,
                  }}
                >
                  {cat.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      {/* Sounds List */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Tokens.spacing["2xl"] }}
      >
        <View style={{ paddingHorizontal: Tokens.spacing["2xl"], paddingTop: Tokens.spacing.lg }}>
          {filteredSounds.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(index * 80)
                .duration(500)
                .springify()}
              style={{ marginBottom: Tokens.spacing.lg }}
            >
              <Pressable onPress={() => handlePlaySound(item.id)}>
                <View
                  style={{
                    backgroundColor:
                      playingSound === item.id
                        ? restColors.cardBgActive(item.color)
                        : restColors.cardBg,
                    borderRadius: Tokens.radius["2xl"],
                    padding: Tokens.spacing.xl,
                    borderWidth: 1,
                    borderColor:
                      playingSound === item.id
                        ? restColors.borderActive(item.color)
                        : restColors.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor:
                          playingSound === item.id
                            ? restColors.iconBgActive(item.color)
                            : restColors.iconBg,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: Tokens.spacing.lg,
                      }}
                    >
                      {playingSound === item.id ? (
                        <Ionicons name="pause" size={28} color={restColors.textPrimary} />
                      ) : (
                        <Ionicons
                          name={item.icon}
                          size={28}
                          color={playingSound === item.id ? restColors.textPrimary : item.color}
                        />
                      )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: restColors.textPrimary,
                          fontSize: Tokens.typography.bodyMedium.fontSize,
                          fontWeight: "700",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: restColors.textSecondary,
                          fontSize: Tokens.typography.bodyMedium.fontSize,
                          marginBottom: Tokens.spacing.sm,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={14} color={restColors.textSecondary} />
                        <Text
                          style={{
                            color: restColors.textSecondary,
                            fontSize: Tokens.typography.caption.fontSize,
                            marginLeft: 4,
                          }}
                        >
                          {item.duration}
                        </Text>
                      </View>
                    </View>

                    {/* Play Button */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor:
                          playingSound === item.id
                            ? restColors.iconBgActive(item.color)
                            : restColors.iconBg,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={playingSound === item.id ? "pause" : "play"}
                        size={22}
                        color={restColors.textPrimary}
                      />
                    </View>
                  </View>

                  {/* Playing Indicator */}
                  {playingSound === item.id && (
                    <Animated.View
                      entering={FadeInDown.duration(400)}
                      style={{
                        marginTop: Tokens.spacing.lg,
                        paddingTop: Tokens.spacing.lg,
                        borderTopWidth: 1,
                        borderTopColor: restColors.border,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: restColors.textMuted,
                            fontSize: Tokens.typography.caption.fontSize,
                          }}
                        >
                          Tocando...
                        </Text>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <View
                              key={i}
                              style={{
                                width: 3,
                                height: 12 + Math.random() * 8,
                                backgroundColor: item.color,
                                borderRadius: 2,
                              }}
                            />
                          ))}
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Tip */}
        <View style={{ paddingHorizontal: Tokens.spacing["2xl"], marginTop: Tokens.spacing.lg }}>
          <View
            style={{
              backgroundColor: restColors.tipBg,
              borderRadius: Tokens.radius["2xl"],
              padding: Tokens.spacing.xl,
              borderWidth: 1,
              borderColor: restColors.tipBorder,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 24, marginRight: Tokens.spacing.md }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: restColors.textPrimary,
                    fontWeight: "600",
                    marginBottom: Tokens.spacing.sm,
                  }}
                >
                  Dica
                </Text>
                <Text
                  style={{
                    color: restColors.textMuted,
                    fontSize: Tokens.typography.bodyMedium.fontSize,
                    lineHeight: 20,
                  }}
                >
                  Use fones de ouvido para uma experiencia mais imersiva. Sons da natureza podem
                  ajudar seu bebe a dormir melhor tambem.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
