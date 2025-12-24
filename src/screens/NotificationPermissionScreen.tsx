/**
 * Nossa Maternidade - NotificationPermissionScreen
 * Premium UX inspired by Headspace, Calm, and Flo
 * Pre-permission priming pattern with notification preview
 *
 * Refatorado: Mobile-first com componentes extraídos
 * Responsivo: Adapta para todos os dispositivos
 *   - iOS: iPhone SE, mini, 14, 15, Pro Max
 *   - Android: Galaxy A series, Pixel, tablets
 */

import React, { memo, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  registerForPushNotifications,
  initializeNotifications,
  markNotificationSetupComplete,
  skipNotificationSetup,
} from "../services/notifications";
import { Tokens } from "../theme/tokens";
import { RootStackScreenProps } from "../types/navigation";
import { Button } from "../components/ui/Button";

// ============================================================================
// TYPES
// ============================================================================

type Props = RootStackScreenProps<"NotificationPermission">;

interface NotificationPreviewProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  time: string;
  colors: readonly [string, string];
  delay: number;
  isCompact: boolean;
}

interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  isCompact: boolean;
}


interface ResponsiveSizes {
  isCompact: boolean;
  headerIcon: number;
  headerPadding: number;
  bellIconSize: number;
  titleSize: number;
  titleLineHeight: number;
  sectionMargin: number;
  contentPadding: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Aliases de compatibilidade
const SPACING = Tokens.spacing;
const RADIUS = Tokens.radius;
const SHADOWS = Tokens.shadows;
const TYPOGRAPHY = Tokens.typography;
const GRADIENTS = {
  nathiaOnboarding: Tokens.gradients.heroAccent,
  notification: {
    morning: "#F59E0B",
    checkIn: "#10B981",
    evening: "#6366F1",
  },
};

// Breakpoints para responsividade cross-platform
const BREAKPOINTS = {
  // Altura (iPhone SE, mini, Android compactos)
  heightCompact: 700,
  // Largura (Android narrow como Galaxy A series)
  widthNarrow: 360,
} as const;

const NOTIFICATION_PREVIEWS = [
  {
    icon: "heart" as const,
    title: "Nossa Maternidade",
    message: "Bom dia! Como você está se sentindo hoje? 💕",
    time: "agora",
    colors: [Tokens.brand.primary[400], Tokens.brand.primary[500]] as const,
  },
  {
    icon: "sparkles" as const,
    title: "Sua afirmação do dia",
    message: "Você é forte e capaz. Confie no processo ✨",
    time: "8:00",
    colors: [Tokens.brand.primary[400], Tokens.brand.primary[500]] as const,
  },
];

const BENEFITS = [
  { icon: "sunny" as const, text: "Check-in diário às 9h", color: GRADIENTS.notification.morning },
  {
    icon: "sparkles" as const,
    text: "Afirmações positivas às 8h",
    color: Tokens.brand.secondary[500],
  },
  {
    icon: "leaf" as const,
    text: "Lembretes de hábitos às 20h",
    color: GRADIENTS.notification.checkIn,
  },
  {
    icon: "moon" as const,
    text: "Momento de relaxar às 14:30",
    color: GRADIENTS.notification.evening,
  },
];

const ANIMATION_DELAYS = {
  header: 0,
  title: 200,
  subtitle: 300,
  previews: 500,
  previewItem1: 600,
  previewItem2: 750,
  benefits: 900,
  buttons: 1100,
  footer: 1300,
} as const;

// ============================================================================
// HOOKS
// ============================================================================

function useResponsiveSizes(): ResponsiveSizes {
  const { height, width } = useWindowDimensions();

  return useMemo(() => {
    // Compact se altura pequena OU largura estreita (Android narrow)
    const isCompact =
      height < BREAKPOINTS.heightCompact || width < BREAKPOINTS.widthNarrow;

    return {
      isCompact,
      headerIcon: isCompact ? 56 : 80,
      headerPadding: isCompact ? SPACING.md : SPACING.xl,
      bellIconSize: isCompact ? 28 : 40,
      titleSize: isCompact ? 26 : 32,
      titleLineHeight: isCompact ? 32 : 38,
      sectionMargin: isCompact ? SPACING.md : SPACING["2xl"],
      contentPadding: isCompact ? SPACING.md : SPACING.xl,
    };
  }, [height, width]);
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Notification preview card - simulates real iOS notification
 */
const NotificationPreview = memo(function NotificationPreview({
  icon,
  title,
  message,
  time,
  colors,
  delay,
  isCompact,
}: NotificationPreviewProps) {
  const iconSize = isCompact ? 32 : 40;
  const iconInnerSize = isCompact ? 16 : 20;

  return (
    <Animated.View
      entering={SlideInRight.duration(600).delay(delay).springify()}
      accessibilityRole="text"
      accessibilityLabel={`${title}: ${message}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: RADIUS.xl,
        padding: isCompact ? SPACING.sm : SPACING.md,
        marginBottom: isCompact ? SPACING.xs : SPACING.sm,
        flexDirection: "row",
        alignItems: "center",
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: `${colors[0]}15`,
      }}
    >
      <LinearGradient
        colors={colors}
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: RADIUS.lg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: isCompact ? SPACING.sm : SPACING.md,
        }}
      >
        <Ionicons name={icon} size={iconInnerSize} color={Tokens.neutral[0]} />
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: isCompact ? 12 : 13,
            fontWeight: "600",
            color: Tokens.neutral[800],
            marginBottom: 1,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: isCompact ? 11 : 12,
            color: Tokens.neutral[600],
          }}
          numberOfLines={1}
        >
          {message}
        </Text>
      </View>

      <Text
        style={{
          fontSize: isCompact ? 10 : 11,
          color: Tokens.neutral[400],
        }}
      >
        {time}
      </Text>
    </Animated.View>
  );
});

/**
 * Benefit item with icon and checkmark
 */
const BenefitItem = memo(function BenefitItem({
  icon,
  text,
  color,
  isCompact,
}: BenefitItemProps) {
  const iconContainerSize = isCompact ? 28 : 32;
  const iconSize = isCompact ? 14 : 16;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={text}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: isCompact ? SPACING.xs : SPACING.sm,
      }}
    >
      <View
        style={{
          width: iconContainerSize,
          height: iconContainerSize,
          borderRadius: iconContainerSize / 2,
          backgroundColor: `${color}15`,
          alignItems: "center",
          justifyContent: "center",
          marginRight: isCompact ? SPACING.sm : SPACING.md,
        }}
      >
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>

      <Text
        style={{
          fontSize: isCompact ? 13 : TYPOGRAPHY.bodyMedium.fontSize,
          color: Tokens.neutral[700],
          flex: 1,
        }}
      >
        {text}
      </Text>

      <Ionicons
        name="checkmark-circle"
        size={isCompact ? 18 : 20}
        color={Tokens.semantic.light.success}
      />
    </View>
  );
});

/**
 * Header com ícone de sino animado - responsivo
 */
const Header = memo(function Header() {
  const sizes = useResponsiveSizes();

  return (
    <Animated.View
      entering={FadeInUp.duration(800).springify()}
      style={{
        alignItems: "center",
        marginBottom: sizes.sectionMargin,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: RADIUS.full,
          padding: sizes.headerPadding,
          ...SHADOWS.lg,
        }}
      >
        <LinearGradient
          colors={[Tokens.brand.primary[400], Tokens.brand.secondary[400]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: sizes.headerIcon,
            height: sizes.headerIcon,
            borderRadius: sizes.headerIcon / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="notifications"
            size={sizes.bellIconSize}
            color={Tokens.neutral[0]}
          />
        </LinearGradient>
      </View>
    </Animated.View>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NotificationPermissionScreen({ navigation }: Props) {
  void navigation;
  const insets = useSafeAreaInsets();
  const sizes = useResponsiveSizes();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleEnableNotifications = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const token = await registerForPushNotifications();

      if (token) {
        await initializeNotifications();
        await markNotificationSetupComplete();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await skipNotificationSetup();
      }
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await skipNotificationSetup();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSkip = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await skipNotificationSetup();
  }, []);

  return (
    <LinearGradient
      colors={[...GRADIENTS.nathiaOnboarding, Tokens.neutral[0]]}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: sizes.contentPadding,
          paddingTop: insets.top + (sizes.isCompact ? SPACING.lg : SPACING["2xl"]),
          paddingBottom: insets.bottom + SPACING.md,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header com ícone de sino */}
        <Header />

        {/* Título */}
        <Animated.View
          entering={FadeInDown.duration(600)
            .delay(ANIMATION_DELAYS.title)
            .springify()}
          style={{ marginBottom: sizes.isCompact ? SPACING.md : SPACING.xl }}
        >
          <Text
            accessibilityRole="header"
            style={{
              fontSize: sizes.titleSize,
              fontWeight: "700",
              color: Tokens.neutral[900],
              textAlign: "center",
              letterSpacing: -0.8,
              lineHeight: sizes.titleLineHeight,
            }}
          >
            Nunca perca um{"\n"}momento importante 💜
          </Text>
        </Animated.View>

        {/* Subtítulo */}
        <Animated.View
          entering={FadeInDown.duration(600)
            .delay(ANIMATION_DELAYS.subtitle)
            .springify()}
          style={{ marginBottom: sizes.sectionMargin }}
        >
          <Text
            style={{
              fontSize: sizes.isCompact ? 14 : TYPOGRAPHY.bodyLarge.fontSize,
              color: Tokens.neutral[600],
              textAlign: "center",
              lineHeight: sizes.isCompact ? 20 : 24,
              paddingHorizontal: sizes.isCompact ? 0 : SPACING.md,
            }}
          >
            Lembretes carinhosos para cuidar de você durante essa jornada
            especial
          </Text>
        </Animated.View>

        {/* Preview das notificações */}
        <Animated.View
          entering={FadeIn.duration(400).delay(ANIMATION_DELAYS.previews)}
          style={{
            marginBottom: sizes.sectionMargin,
          }}
        >
          {NOTIFICATION_PREVIEWS.map((preview, index) => (
            <NotificationPreview
              key={preview.title}
              {...preview}
              isCompact={sizes.isCompact}
              delay={
                index === 0
                  ? ANIMATION_DELAYS.previewItem1
                  : ANIMATION_DELAYS.previewItem2
              }
            />
          ))}
        </Animated.View>

        {/* Lista de benefícios */}
        <Animated.View
          entering={FadeInDown.duration(600)
            .delay(ANIMATION_DELAYS.benefits)
            .springify()}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: RADIUS["2xl"],
            padding: sizes.isCompact ? SPACING.md : SPACING.lg,
            marginBottom: sizes.sectionMargin,
          }}
        >
          {BENEFITS.map((benefit) => (
            <BenefitItem
              key={benefit.text}
              {...benefit}
              isCompact={sizes.isCompact}
            />
          ))}
        </Animated.View>

        {/* Spacer flexível - menor em telas pequenas */}
        <View style={{ flex: 1, minHeight: sizes.isCompact ? 8 : 16 }} />

        {/* Botões de ação */}
        <Animated.View
          entering={FadeInDown.duration(600)
            .delay(ANIMATION_DELAYS.buttons)
            .springify()}
        >
          {/* Botão principal */}
          <Button
            variant="accent"
            size={sizes.isCompact ? "md" : "lg"}
            icon="notifications"
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            onPress={handleEnableNotifications}
            accessibilityLabel="Ativar lembretes de notificação"
          >
            {isLoading ? "Configurando..." : "Ativar lembretes"}
          </Button>

          {/* Botão secundário */}
          <Pressable
            onPress={handleSkip}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Configurar lembretes depois"
            style={({ pressed }) => ({
              paddingVertical: sizes.isCompact ? SPACING.sm : SPACING.md,
              marginTop: sizes.isCompact ? SPACING.xs : SPACING.sm,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: Tokens.neutral[500],
                fontSize: sizes.isCompact ? 13 : TYPOGRAPHY.bodyMedium.fontSize,
                fontWeight: "500",
              }}
            >
              Configurar depois
            </Text>
          </Pressable>

          {/* Nota de privacidade */}
          <Animated.View
            entering={FadeIn.duration(400).delay(ANIMATION_DELAYS.footer)}
            style={{
              alignItems: "center",
              marginTop: sizes.isCompact ? SPACING.xs : SPACING.sm,
            }}
          >
            <Text
              style={{
                color: Tokens.neutral[400],
                fontSize: sizes.isCompact ? 10 : 11,
                textAlign: "center",
              }}
            >
              Você pode alterar isso a qualquer momento nas configurações
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
