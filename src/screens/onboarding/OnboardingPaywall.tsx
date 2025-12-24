/**
 * Tela 8: OnboardingPaywall
 * Paywall específico para onboarding com RevenueCat
 * Banner especial se needsExtraCare = true
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PurchasesPackage } from "react-native-purchases";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { saveOnboardingData } from "../../api/onboarding-service";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { useTheme } from "../../hooks/useTheme";
import {
  getIsConfigured,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from "../../services/revenuecat";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { usePremiumStore } from "../../state/premium-store";
import { useAppStore } from "../../state/store";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingPaywall">;

// Imagem estática para o paywall
const PAYWALL_IMAGE = require("../../../assets/onboarding/images/nath-profile-small.jpg");

export default function OnboardingPaywall({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { onboardingData } = route.params;
  const { completeOnboarding, needsExtraCare, setCurrentScreen } = useNathJourneyOnboardingStore();

  // Get real user ID from store
  const authUserId = useAppStore((s) => s.authUserId);

  // Premium store
  const isPurchasing = usePremiumStore((s) => s.isPurchasing);
  const setPurchasing = usePremiumStore((s) => s.setPurchasing);
  const setPremiumStatus = usePremiumStore((s) => s.setPremiumStatus);

  const [isSaving, setIsSaving] = useState(false);
  const [, setIsLoadingOfferings] = useState(true);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [selectedPackage] = useState<"monthly" | "yearly">("monthly");
  const needsExtraCareFlag = needsExtraCare();

  // Load RevenueCat offerings
  useEffect(() => {
    async function loadOfferings() {
      try {
        if (!getIsConfigured()) {
          logger.info("RevenueCat not configured (likely Expo Go)", "OnboardingPaywall");
          setIsLoadingOfferings(false);
          return;
        }

        const offerings = await getOfferings();
        if (offerings?.availablePackages) {
          const monthly = offerings.availablePackages.find(
            (pkg) => pkg.packageType === "MONTHLY" || pkg.identifier.includes("monthly")
          );
          const yearly = offerings.availablePackages.find(
            (pkg) => pkg.packageType === "ANNUAL" || pkg.identifier.includes("yearly")
          );

          setMonthlyPackage(monthly || null);
          setYearlyPackage(yearly || null);

          logger.info("Offerings loaded", "OnboardingPaywall", {
            monthly: monthly?.identifier,
            yearly: yearly?.identifier,
          });
        }
      } catch (error) {
        logger.error(
          "Failed to load offerings",
          "OnboardingPaywall",
          error instanceof Error ? error : new Error(String(error))
        );
      } finally {
        setIsLoadingOfferings(false);
      }
    }

    loadOfferings();
  }, []);

  useEffect(() => {
    setCurrentScreen("OnboardingPaywall");
  }, [setCurrentScreen]);

  const handleComplete = useCallback(async () => {
    try {
      setIsSaving(true);

      // Use real user ID or fallback
      const userId = authUserId || "anonymous";

      if (!authUserId) {
        logger.warn("No authUserId available, using anonymous", "OnboardingPaywall");
      }

      // Salvar onboarding data no Supabase
      await saveOnboardingData(userId, {
        stage:
          onboardingData.stage as import("../../types/nath-journey-onboarding.types").OnboardingStage,
        date: onboardingData.date,
        concerns:
          onboardingData.concerns as import("../../types/nath-journey-onboarding.types").OnboardingConcern[],
        emotionalState: onboardingData.emotionalState as
          | import("../../types/nath-journey-onboarding.types").EmotionalState
          | undefined,
        dailyCheckIn: onboardingData.dailyCheckIn,
        checkInTime: onboardingData.checkInTime,
        seasonName: onboardingData.seasonName,
        needsExtraCare: onboardingData.needsExtraCare,
      });

      // Marcar onboarding como completo
      completeOnboarding();

      logger.info("Onboarding completed", "OnboardingPaywall", { userId });

      // Navegar para Home
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      logger.error(
        "Error completing onboarding",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
      // Continuar mesmo se falhar
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } finally {
      setIsSaving(false);
    }
  }, [authUserId, onboardingData, completeOnboarding, navigation]);

  const handleStartTrial = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Se needsExtraCare, pular paywall e dar acesso gratuito
      if (needsExtraCareFlag) {
        logger.info("Skipping paywall for extra care user", "OnboardingPaywall");
        await handleComplete();
        return;
      }

      // Get the selected package
      const packageToPurchase = selectedPackage === "yearly" ? yearlyPackage : monthlyPackage;

      // If RevenueCat is not configured or no package available, complete without purchase
      if (!getIsConfigured() || !packageToPurchase) {
        logger.info("RevenueCat not available, completing without purchase", "OnboardingPaywall");
        await handleComplete();
        return;
      }

      // Start purchase flow
      setPurchasing(true);
      logger.info("Starting purchase", "OnboardingPaywall", {
        package: packageToPurchase.identifier,
      });

      const result = await purchasePackage(packageToPurchase);

      if (result.success) {
        logger.info("Purchase successful", "OnboardingPaywall");
        setPremiumStatus(true);
        await handleComplete();
      } else if (result.error === "cancelled") {
        logger.info("Purchase cancelled by user", "OnboardingPaywall");
        // User cancelled, don't complete onboarding automatically
      } else {
        logger.error(
          "Purchase failed",
          "OnboardingPaywall",
          new Error(result.error || "Unknown error")
        );
        Alert.alert(
          "Erro na compra",
          "Não foi possível processar sua compra. Você pode tentar novamente ou continuar sem assinatura.",
          [
            { text: "Tentar novamente", onPress: handleStartTrial },
            { text: "Continuar grátis", onPress: handleComplete },
          ]
        );
      }
    } catch (error) {
      logger.error(
        "Error starting trial",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
      await handleComplete();
    } finally {
      setPurchasing(false);
    }
  }, [
    needsExtraCareFlag,
    selectedPackage,
    monthlyPackage,
    yearlyPackage,
    setPurchasing,
    setPremiumStatus,
    handleComplete,
  ]);

  const handleRestore = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPurchasing(true);

      const result = await restorePurchases();

      if (result.success) {
        logger.info("Restore successful", "OnboardingPaywall");
        setPremiumStatus(true);
        Alert.alert("Sucesso!", "Sua assinatura foi restaurada.", [
          { text: "Continuar", onPress: handleComplete },
        ]);
      } else {
        Alert.alert(
          "Nenhuma assinatura encontrada",
          "Não encontramos uma assinatura ativa para restaurar."
        );
      }
    } catch (error) {
      logger.error(
        "Restore failed",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
      Alert.alert("Erro", "Não foi possível restaurar sua assinatura.");
    } finally {
      setPurchasing(false);
    }
  }, [setPurchasing, setPremiumStatus, handleComplete]);

  const handleTerms = () => {
    Linking.openURL("https://nossamaternidade.app/termos");
  };

  const handlePrivacy = () => {
    Linking.openURL("https://nossamaternidade.app/privacidade");
  };

  // Get display price from package or use fallback
  const getMonthlyPrice = () => {
    if (monthlyPackage?.product?.priceString) {
      return monthlyPackage.product.priceString;
    }
    return "R$ 34,90";
  };

  // Note: yearlyPackage is loaded but yearly plan UI not yet implemented
  void yearlyPackage; // Silence unused variable warning

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface.base,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ProgressBar currentStep={8} totalSteps={8} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          {/* Banner Extra Care */}
          {needsExtraCareFlag && (
            <View
              style={[
                styles.extraCareBanner,
                {
                  backgroundColor: theme.semantic.infoLight,
                  borderColor: theme.semantic.info,
                },
              ]}
            >
              <Text style={styles.extraCareEmoji}>💜</Text>
              <Text
                style={[
                  styles.extraCareText,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                Seus primeiros 7 dias são por minha conta. Primeiro, cuida de você.
              </Text>
            </View>
          )}

          {/* Image (replacing video) */}
          <View style={styles.imageContainer}>
            <Image source={PAYWALL_IMAGE} style={styles.paywallImage} contentFit="cover" />
          </View>

          {/* Texto explicativo */}
          <Text
            style={[
              styles.title,
              {
                color: theme.text.primary,
              },
            ]}
          >
            Olha, eu queria fazer esse app de graça pra TODAS.
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            Mas preciso pagar a equipe, servidor... 7 DIAS GRÁTIS pra você testar tudo. Depois,
            {getMonthlyPrice()}/mês - menos que um lanche no shopping. E parte do lucro vai pro
            projeto Zuzu em Angola.
          </Text>

          {/* Card Plano */}
          <View
            style={[
              styles.planCard,
              {
                backgroundColor: theme.surface.card,
                borderColor: theme.colors.border.subtle,
              },
            ]}
          >
            <View style={styles.planHeader}>
              <Text
                style={[
                  styles.planTitle,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                7 DIAS GRÁTIS
              </Text>
              <Text
                style={[
                  styles.planSubtitle,
                  {
                    color: theme.text.secondary,
                  },
                ]}
              >
                Depois {getMonthlyPrice()}/mês
              </Text>
            </View>

            <View style={styles.benefitsContainer}>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Conversa ilimitada com NathIA
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Tracker personalizado
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Conteúdo exclusivo da Nath
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Comunidade &quot;Mães da Nath&quot;
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Grupo VIP (se baixou no D1)
              </Text>
            </View>

            <Text
              style={[
                styles.planNote,
                {
                  color: theme.text.tertiary,
                },
              ]}
            >
              Cancele quando quiser
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Tokens.spacing.lg,
          },
        ]}
      >
        <Pressable
          onPress={handleStartTrial}
          disabled={isSaving || isPurchasing}
          style={[styles.primaryButton, (isSaving || isPurchasing) && styles.primaryButtonDisabled]}
          accessibilityLabel="Começar 7 dias grátis"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            {isSaving || isPurchasing ? (
              <ActivityIndicator color={Tokens.neutral[0]} />
            ) : (
              <Text style={styles.primaryButtonText}>Começar 7 dias grátis</Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={handleRestore}
          disabled={isPurchasing}
          style={styles.secondaryButton}
          accessibilityLabel="Restaurar compras anteriores"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            Já sou assinante
          </Text>
        </Pressable>

        <Pressable
          onPress={handleComplete}
          style={styles.skipButton}
          accessibilityLabel="Continuar sem assinatura"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.skipText,
              {
                color: theme.text.tertiary,
              },
            ]}
          >
            Continuar grátis
          </Text>
        </Pressable>

        <View style={styles.legalLinks}>
          <Pressable onPress={handleTerms} style={styles.termsButton}>
            <Text
              style={[
                styles.termsText,
                {
                  color: theme.text.tertiary,
                },
              ]}
            >
              Termos de uso
            </Text>
          </Pressable>
          <Text style={[styles.termsText, { color: theme.text.tertiary }]}> • </Text>
          <Pressable onPress={handlePrivacy} style={styles.termsButton}>
            <Text
              style={[
                styles.termsText,
                {
                  color: theme.text.tertiary,
                },
              ]}
            >
              Privacidade
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing["4xl"],
  },
  extraCareBanner: {
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.lg,
    borderWidth: 2,
    marginBottom: Tokens.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.md,
  },
  extraCareEmoji: {
    fontSize: 32,
  },
  extraCareText: {
    flex: 1,
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    lineHeight: Tokens.typography.bodyMedium.lineHeight * 1.3,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: Tokens.radius.xl,
    overflow: "hidden",
    marginBottom: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  paywallImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: Tokens.typography.headlineLarge.fontSize,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    lineHeight: Tokens.typography.headlineLarge.lineHeight,
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontSize: Tokens.typography.bodyLarge.fontSize,
    lineHeight: Tokens.typography.bodyLarge.lineHeight * 1.5,
    marginBottom: Tokens.spacing["2xl"],
  },
  planCard: {
    padding: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 2,
    ...Tokens.shadows.md,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  planTitle: {
    fontSize: Tokens.typography.headlineMedium.fontSize,
    fontWeight: Tokens.typography.headlineMedium.fontWeight,
    marginBottom: Tokens.spacing.xs,
  },
  planSubtitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
  },
  benefitsContainer: {
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.lg,
  },
  benefit: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    lineHeight: Tokens.typography.bodyMedium.lineHeight * 1.5,
  },
  planNote: {
    fontSize: Tokens.typography.caption.fontSize,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    gap: Tokens.spacing.md,
  },
  primaryButton: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    ...Tokens.shadows.lg,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonGradient: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    minHeight: Tokens.accessibility.minTapTarget,
  },
  primaryButtonText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
  },
  secondaryButton: {
    paddingVertical: Tokens.spacing.md,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
  },
  skipButton: {
    paddingVertical: Tokens.spacing.sm,
    alignItems: "center",
  },
  skipText: {
    fontSize: Tokens.typography.bodySmall.fontSize,
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Tokens.spacing.sm,
  },
  termsButton: {
    paddingVertical: Tokens.spacing.sm,
    alignItems: "center",
  },
  termsText: {
    fontSize: Tokens.typography.caption.fontSize,
    textDecorationLine: "underline",
  },
});
