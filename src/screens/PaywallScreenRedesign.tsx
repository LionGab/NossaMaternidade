/**
 * PaywallScreen - Premium Redesign
 *
 * DESIGN CONCEPT: "Unlock Your Journey"
 * A transformational experience that makes the user feel
 * like they're about to unlock something precious.
 *
 * AESTHETIC:
 * - Deep gradient background (premium, calm)
 * - Animated crown/unlock visual
 * - Testimonials carousel
 * - Glass-morphism plan cards
 * - Pulsing CTA with glow
 *
 * INSPIRATION:
 * - Calm's paywall (emotional, calm)
 * - Headspace (friendly, accessible)
 * - Flo (feminine, premium)
 *
 * EXPO GO COMPATIBLE ✓
 *
 * @version 2.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "../context/ToastContext";
import { usePremiumStore } from "../state/premium-store";
import { brand } from "../theme/tokens";
import { RootStackParamList } from "../types/navigation";
import { DEFAULT_PRICING, type PricingConfig } from "../types/premium";
import { logger } from "../utils/logger";
import { isExpoGo } from "../utils/expo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================
// DESIGN SYSTEM
// ============================================

const COLORS = {
  // Premium gradient
  gradientTop: "#0F0A1F",
  gradientMid: "#1A1030",
  gradientBottom: "#251540",
  gradientAccent: "#301A55",

  // Glow effects
  glow1: "rgba(244, 37, 140, 0.25)",
  glow2: "rgba(139, 92, 246, 0.2)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  textMuted: "rgba(255, 255, 255, 0.5)",
  textAccent: brand.accent[400],

  // Glass
  glassBg: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
  glassSelected: "rgba(244, 37, 140, 0.15)",
  glassSelectedBorder: brand.accent[400],

  // CTA
  ctaGradientStart: brand.accent[400],
  ctaGradientEnd: brand.accent[600],

  // Success
  success: "#34D399",
  gold: "#FCD34D",
};

const FONTS = {
  display: "Manrope_800ExtraBold",
  headline: "Manrope_700Bold",
  body: "Manrope_500Medium",
  accent: "Manrope_600SemiBold",
  light: "Manrope_400Regular",
};

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;
type PlanType = "monthly" | "yearly";

// ============================================
// ANIMATED COMPONENTS
// ============================================

// Floating orbs for atmosphere
const FloatingOrb: React.FC<{
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  delay: number;
}> = React.memo(({ size, color, initialX, initialY, delay }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-30, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 3000 }),
          withTiming(0.4, { duration: 3000 })
        ),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [translateY, opacity, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: initialX,
          top: initialY,
        },
        animatedStyle,
      ]}
    />
  );
});

FloatingOrb.displayName = "FloatingOrb";

// Crown/Premium icon with animation
const PremiumBadge: React.FC = React.memo(() => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    // Gentle pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle rotation
    rotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Glow pulse
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.5, { duration: 1200 })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotate);
      cancelAnimation(glow);
    };
  }, [scale, rotate, glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(glow.value, [0, 1], [20, 40]),
  }));

  return (
    <Animated.View style={[styles.badgeContainer, glowStyle]}>
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={[COLORS.gold, "#F59E0B", "#D97706"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <Ionicons name="diamond" size={40} color="#FFFBEB" />
        </LinearGradient>
      </Animated.View>

      {/* Sparkle effects */}
      <View style={[styles.sparkle, { top: -8, right: -8 }]}>
        <Ionicons name="sparkles" size={16} color={COLORS.gold} />
      </View>
      <View style={[styles.sparkle, { bottom: -4, left: -8 }]}>
        <Ionicons name="star" size={12} color={COLORS.textAccent} />
      </View>
    </Animated.View>
  );
});

PremiumBadge.displayName = "PremiumBadge";

// Feature item
const FeatureItem: React.FC<{
  icon: string;
  text: string;
  delay: number;
}> = React.memo(({ icon, text, delay }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(400).springify()}
      style={styles.featureItem}
    >
      <View style={styles.featureIcon}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={COLORS.textAccent} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
});

FeatureItem.displayName = "FeatureItem";

// Plan card
const PlanCard: React.FC<{
  type: PlanType;
  price: string;
  period: string;
  monthlyEquivalent?: string;
  savings?: string;
  isPopular?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}> = React.memo(({
  type,
  price,
  period,
  monthlyEquivalent,
  savings,
  isPopular,
  isSelected,
  onSelect,
  delay,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withSpring(1, { damping: 12 })
    );
    onSelect();
  };

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400).springify()}>
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.planCard,
            isSelected && styles.planCardSelected,
            animatedStyle,
          ]}
        >
          {/* Popular badge */}
          {isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MAIS POPULAR</Text>
            </View>
          )}

          {/* Savings badge */}
          {savings && (
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsBadgeText}>{savings}</Text>
            </View>
          )}

          {/* Content */}
          <View style={styles.planHeader}>
            {/* Radio */}
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.planType}>
              {type === "yearly" ? "Anual" : "Mensal"}
            </Text>
          </View>

          <Text style={styles.planPrice}>{price}</Text>
          <Text style={styles.planPeriod}>/{period}</Text>

          {monthlyEquivalent && (
            <Text style={styles.planEquivalent}>= {monthlyEquivalent}/mês</Text>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

PlanCard.displayName = "PlanCard";

// CTA Button
const CTAButton: React.FC<{
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}> = React.memo(({ label, onPress, loading, disabled }) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (!disabled) {
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
    return () => cancelAnimation(glow);
  }, [disabled, glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.6]),
    shadowRadius: interpolate(glow.value, [0, 1], [12, 24]),
  }));

  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withSpring(1, { damping: 12 })
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled || loading}>
      <Animated.View style={[styles.ctaShadow, !disabled && glowStyle]}>
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={
              disabled
                ? ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)"]
                : [COLORS.ctaGradientStart, COLORS.ctaGradientEnd]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} size="small" />
            ) : (
              <>
                <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>
                  {label}
                </Text>
                <View style={styles.ctaArrow}>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.textPrimary} />
                </View>
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});

CTAButton.displayName = "CTAButton";

// ============================================
// MAIN SCREEN
// ============================================

export default function PaywallScreenRedesign({ navigation, route }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const runningInExpoGo = isExpoGo();
  const { showInfo, showError } = useToast();

  // State
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Store
  const { syncWithRevenueCat, setError } = usePremiumStore();
  const debugTogglePremium = usePremiumStore((s) => s.debugTogglePremium);
  const isPremium = usePremiumStore((s) => s.isPremium);

  const source = route.params?.source || "unknown";

  // Load prices
  const loadPrices = useCallback(async () => {
    if (runningInExpoGo) {
      setIsLoadingPrices(false);
      return;
    }

    try {
      setIsLoadingPrices(true);
      const revenuecat = await import("../services/revenuecat");
      const packages = await revenuecat.getPackages();

      if (packages && packages.length > 0) {
        const monthlyPkg = packages.find((p) => p.identifier?.toLowerCase().includes("monthly"));
        const yearlyPkg = packages.find((p) =>
          p.identifier?.toLowerCase().includes("yearly") ||
          p.identifier?.toLowerCase().includes("annual")
        );

        if (monthlyPkg || yearlyPkg) {
          setPricing({
            monthly: {
              productId: monthlyPkg?.product.identifier || DEFAULT_PRICING.monthly.productId,
              price: monthlyPkg?.product.price || DEFAULT_PRICING.monthly.price,
              priceString: monthlyPkg?.product.priceString || DEFAULT_PRICING.monthly.priceString,
              currency: monthlyPkg?.product.currencyCode || DEFAULT_PRICING.monthly.currency,
              period: "mês",
            },
            yearly: {
              productId: yearlyPkg?.product.identifier || DEFAULT_PRICING.yearly.productId,
              price: yearlyPkg?.product.price || DEFAULT_PRICING.yearly.price,
              priceString: yearlyPkg?.product.priceString || DEFAULT_PRICING.yearly.priceString,
              currency: yearlyPkg?.product.currencyCode || DEFAULT_PRICING.yearly.currency,
              period: "ano",
              savingsPercent:
                monthlyPkg?.product.price && yearlyPkg?.product.price
                  ? Math.round(
                      ((monthlyPkg.product.price * 12 - yearlyPkg.product.price) /
                        (monthlyPkg.product.price * 12)) *
                        100
                    )
                  : DEFAULT_PRICING.yearly.savingsPercent,
              monthlyEquivalent: yearlyPkg?.product.price
                ? parseFloat((yearlyPkg.product.price / 12).toFixed(2))
                : DEFAULT_PRICING.yearly.monthlyEquivalent,
            },
            trialDays: DEFAULT_PRICING.trialDays,
          });
        }
      }
    } catch (error) {
      logger.error("Failed to load prices", "PaywallScreen", error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoadingPrices(false);
    }
  }, [runningInExpoGo]);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  // Handlers
  const handlePurchase = useCallback(async () => {
    if (runningInExpoGo) {
      showInfo("Compras disponíveis apenas em build nativo");
      return;
    }

    const productId = selectedPlan === "yearly" ? pricing.yearly.productId : pricing.monthly.productId;

    try {
      setIsPurchasing(true);
      setError(null);

      logger.info("Starting purchase", "PaywallScreen", { productId, plan: selectedPlan, source });

      const revenuecat = await import("../services/revenuecat");
      const packages = await revenuecat.getPackages();
      const selectedPackage = packages?.find((p) => p.product.identifier === productId);

      if (!selectedPackage) {
        throw new Error("Pacote não encontrado");
      }

      const result = await revenuecat.purchasePackage(selectedPackage);

      if (result) {
        await syncWithRevenueCat();
        logger.info("Purchase successful", "PaywallScreen", { productId });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.goBack();
      }
    } catch (error: unknown) {
      if ((error as { userCancelled?: boolean })?.userCancelled) {
        logger.info("Purchase cancelled by user", "PaywallScreen");
        return;
      }

      logger.error("Purchase failed", "PaywallScreen", error instanceof Error ? error : new Error(String(error)));
      setError("Erro ao processar compra. Tente novamente.");
      showError("Não foi possível completar a compra. Tente novamente.");
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedPlan, pricing, syncWithRevenueCat, setError, navigation, source, runningInExpoGo, showInfo, showError]);

  const handleRestore = useCallback(async () => {
    if (runningInExpoGo) {
      showInfo("Restaurar compras disponível apenas em build nativo");
      return;
    }

    try {
      setIsRestoring(true);

      const revenuecat = await import("../services/revenuecat");
      const result = await revenuecat.restorePurchases();

      if (result.success && result.customerInfo) {
        await syncWithRevenueCat();

        const hasActive = Object.keys(result.customerInfo.entitlements.active).length > 0;

        if (hasActive) {
          showInfo("Sua assinatura foi restaurada com sucesso!");
          navigation.goBack();
        } else {
          showInfo("Não encontramos nenhuma assinatura ativa.");
        }
      } else {
        showInfo(result.error || "Não encontramos nenhuma assinatura ativa.");
      }
    } catch (error) {
      logger.error("Restore failed", "PaywallScreen", error instanceof Error ? error : new Error(String(error)));
      showError("Não foi possível restaurar suas compras.");
    } finally {
      setIsRestoring(false);
    }
  }, [syncWithRevenueCat, navigation, runningInExpoGo, showInfo, showError]);

  const openTerms = () => Linking.openURL("https://nossamaternidade.com/termos");
  const openPrivacy = () => Linking.openURL("https://nossamaternidade.com/privacidade");

  // Features list
  const features = [
    { icon: "mic", text: "NathIA com voz ilimitada" },
    { icon: "heart", text: "Afirmações personalizadas" },
    { icon: "fitness", text: "Exercícios exclusivos" },
    { icon: "notifications", text: "Lembretes de autocuidado" },
    { icon: "people", text: "Comunidade VIP" },
    { icon: "shield-checkmark", text: "Suporte prioritário" },
  ];

  // Expo Go placeholder
  if (runningInExpoGo) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <LinearGradient
          colors={[COLORS.gradientTop, COLORS.gradientMid, COLORS.gradientBottom]}
          style={StyleSheet.absoluteFill}
        />

        {/* Close button */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.closeButton, { top: insets.top + 12 }]}
        >
          <Ionicons name="close" size={24} color={COLORS.textSecondary} />
        </Pressable>

        <View style={styles.expoGoContent}>
          <Ionicons name="cube-outline" size={64} color={COLORS.textAccent} />
          <Text style={styles.expoGoTitle}>Build Nativo Necessário</Text>
          <Text style={styles.expoGoSubtitle}>
            O sistema de assinatura está disponível apenas em builds nativos.
          </Text>

          {__DEV__ && (
            <Pressable
              onPress={() => {
                debugTogglePremium();
                showInfo(isPremium ? "Premium desativado" : "Premium ativado");
              }}
              style={styles.devButton}
            >
              <Text style={styles.devButtonText}>
                {isPremium ? "Desativar Premium (DEV)" : "Ativar Premium (DEV)"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      <LinearGradient
        colors={[COLORS.gradientTop, COLORS.gradientMid, COLORS.gradientBottom, COLORS.gradientAccent]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating orbs */}
      <View style={styles.orbsContainer}>
        <FloatingOrb size={180} color={COLORS.glow1} initialX={-60} initialY={80} delay={0} />
        <FloatingOrb size={140} color={COLORS.glow2} initialX={SCREEN_WIDTH - 80} initialY={200} delay={500} />
        <FloatingOrb size={100} color={COLORS.glow1} initialX={40} initialY={400} delay={1000} />
      </View>

      {/* Close button */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.closeButton, { top: insets.top + 12 }]}
      >
        <Ionicons name="close" size={24} color={COLORS.textSecondary} />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60, paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.hero}>
          <PremiumBadge />

          <Animated.Text entering={FadeInUp.delay(200).duration(500)} style={styles.heroTitle}>
            Desbloqueie o{"\n"}Melhor Cuidado
          </Animated.Text>

          <Animated.Text entering={FadeInUp.delay(300).duration(500)} style={styles.heroSubtitle}>
            Acesso ilimitado à NathIA, exercícios exclusivos e uma comunidade de mães incríveis
          </Animated.Text>

          {/* Trial badge */}
          {pricing.trialDays > 0 && (
            <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.trialBadge}>
              <Ionicons name="gift" size={16} color={COLORS.gold} />
              <Text style={styles.trialBadgeText}>
                {pricing.trialDays} dias grátis para testar
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Animated.Text entering={FadeInUp.delay(450).duration(400)} style={styles.sectionTitle}>
            Tudo incluído
          </Animated.Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureItem
                key={feature.text}
                icon={feature.icon}
                text={feature.text}
                delay={500 + index * 80}
              />
            ))}
          </View>
        </View>

        {/* Plan selection */}
        <View style={styles.plansSection}>
          <Animated.Text entering={FadeInUp.delay(700).duration(400)} style={styles.sectionTitle}>
            Escolha seu plano
          </Animated.Text>

          {isLoadingPrices ? (
            <ActivityIndicator size="large" color={COLORS.textAccent} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.plansRow}>
              <PlanCard
                type="monthly"
                price={pricing.monthly.priceString}
                period="mês"
                isSelected={selectedPlan === "monthly"}
                onSelect={() => setSelectedPlan("monthly")}
                delay={750}
              />
              <PlanCard
                type="yearly"
                price={pricing.yearly.priceString}
                period="ano"
                monthlyEquivalent={`R$ ${pricing.yearly.monthlyEquivalent?.toFixed(2).replace(".", ",")}`}
                savings={`-${pricing.yearly.savingsPercent}%`}
                isPopular
                isSelected={selectedPlan === "yearly"}
                onSelect={() => setSelectedPlan("yearly")}
                delay={800}
              />
            </View>
          )}
        </View>

        {/* Guarantee */}
        <Animated.View entering={FadeInUp.delay(850).duration(400)} style={styles.guarantee}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
          <Text style={styles.guaranteeText}>
            Cancele a qualquer momento. Sem compromisso.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Fixed footer */}
      <Animated.View
        entering={SlideInUp.delay(900).duration(500).springify()}
        style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}
      >
        <CTAButton
          label={
            pricing.trialDays > 0
              ? `Começar ${pricing.trialDays} Dias Grátis`
              : "Assinar Agora"
          }
          onPress={handlePurchase}
          loading={isPurchasing}
          disabled={isLoadingPrices}
        />

        <Text style={styles.footerNote}>
          {selectedPlan === "yearly"
            ? `Após o período de teste, ${pricing.yearly.priceString}/ano`
            : `${pricing.monthly.priceString}/mês`}
        </Text>

        <View style={styles.footerLinks}>
          <Pressable onPress={handleRestore} disabled={isRestoring}>
            <Text style={styles.footerLink}>
              {isRestoring ? "Restaurando..." : "Restaurar Compras"}
            </Text>
          </Pressable>
          <Text style={styles.footerDivider}>•</Text>
          <Pressable onPress={openTerms}>
            <Text style={styles.footerLink}>Termos</Text>
          </Pressable>
          <Text style={styles.footerDivider}>•</Text>
          <Pressable onPress={openPrivacy}>
            <Text style={styles.footerLink}>Privacidade</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientTop,
  },

  // Orbs
  orbsContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  orb: {
    position: "absolute",
  },

  // Close button
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Hero
  hero: {
    alignItems: "center",
    marginBottom: 32,
  },
  badgeContainer: {
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  trialBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(252, 211, 77, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginTop: 20,
    gap: 8,
  },
  trialBadgeText: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: COLORS.gold,
  },

  // Features
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.glassBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: "48%",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
  },

  // Plans
  plansSection: {
    marginBottom: 24,
  },
  plansRow: {
    flexDirection: "row",
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.glassBg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
    padding: 16,
    position: "relative",
  },
  planCardSelected: {
    backgroundColor: COLORS.glassSelected,
    borderColor: COLORS.glassSelectedBorder,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    left: "50%",
    transform: [{ translateX: -45 }],
    backgroundColor: COLORS.textAccent,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  popularBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  savingsBadge: {
    position: "absolute",
    top: -10,
    right: -8,
    backgroundColor: COLORS.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  savingsBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: COLORS.textAccent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textAccent,
  },
  planType: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: COLORS.textSecondary,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
  },
  planPeriod: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
  planEquivalent: {
    fontSize: 12,
    fontFamily: FONTS.accent,
    color: COLORS.textAccent,
    marginTop: 6,
  },

  // Guarantee
  guarantee: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  guaranteeText: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.success,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 10, 31, 0.95)",
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
  },
  ctaShadow: {
    shadowColor: COLORS.ctaGradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 16,
  },
  ctaButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
  },
  ctaTextDisabled: {
    color: COLORS.textMuted,
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  footerNote: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 12,
  },
  footerLink: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
  footerDivider: {
    color: COLORS.textMuted,
    fontSize: 10,
  },

  // Expo Go
  expoGoContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  expoGoTitle: {
    fontSize: 24,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 20,
  },
  expoGoSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  devButton: {
    marginTop: 32,
    backgroundColor: COLORS.glassBg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  devButtonText: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: COLORS.textPrimary,
  },
});
