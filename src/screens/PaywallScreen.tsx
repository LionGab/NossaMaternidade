/**
 * PaywallScreen
 *
 * Tela de conversao para assinatura premium.
 * Design inspirado em Flo, Calm e Headspace - emocional e persuasivo.
 * Integrada com RevenueCat para compras.
 */

import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "../context/ToastContext";
import { usePremiumStore } from "../state/premium-store";
import { Tokens } from "../theme/tokens";
import { IconName } from "../types/icons";
import { RootStackParamList } from "../types/navigation";
import { DEFAULT_PRICING, PREMIUM_FEATURES, type PricingConfig } from "../types/premium";
import { cn } from "../utils/cn";
import { logger } from "../utils/logger";
import { isExpoGo } from "../utils/expo";

const PRIMARY_COLOR = Tokens.brand.primary[500];

// ============================================
// TIPOS
// ============================================

type PaywallScreenProps = NativeStackScreenProps<RootStackParamList, "Paywall">;

type PlanType = "monthly" | "yearly";

interface PlanOption {
  type: PlanType;
  price: string;
  period: string;
  monthlyEquivalent?: string;
  savings?: string;
  isPopular?: boolean;
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

/**
 * Icone animado de estrela/brilho
 */
const SparkleIcon = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={[PRIMARY_COLOR, Tokens.brand.accent[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="diamond" size={40} color={Tokens.neutral[0]} />
      </LinearGradient>
    </Animated.View>
  );
};

/**
 * Card de feature premium
 */
const FeatureCard = ({
  icon,
  title,
  description,
  color,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  color?: string;
  index: number;
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 100).springify()}
      className="flex-row items-center bg-white/80 rounded-2xl p-4 mb-3"
      style={{
        shadowColor: Tokens.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${color || PRIMARY_COLOR}20` }}
      >
        <Ionicons name={icon as IconName} size={24} color={color || PRIMARY_COLOR} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
      </View>
      <Ionicons name="checkmark-circle" size={24} color={PRIMARY_COLOR} />
    </Animated.View>
  );
};

/**
 * Botao de selecao de plano
 */
const PlanButton = ({
  plan,
  isSelected,
  onSelect,
}: {
  plan: PlanOption;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <Pressable
      onPress={onSelect}
      className={cn(
        "relative flex-1 rounded-2xl p-4 border-2",
        isSelected ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
      )}
      style={{
        shadowColor: isSelected ? PRIMARY_COLOR : Tokens.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.15 : 0.05,
        shadowRadius: 8,
        elevation: isSelected ? 4 : 2,
      }}
    >
      {/* Badge popular */}
      {plan.isPopular && (
        <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">MAIS POPULAR</Text>
        </View>
      )}

      {/* Badge economia */}
      {plan.savings && (
        <View className="absolute -top-2 -right-2 bg-green-500 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">{plan.savings}</Text>
        </View>
      )}

      {/* Radio button */}
      <View className="flex-row items-center mb-2">
        <View
          className={cn(
            "w-5 h-5 rounded-full border-2 items-center justify-center mr-2",
            isSelected ? "border-primary" : "border-gray-300"
          )}
        >
          {isSelected && <View className="w-3 h-3 rounded-full bg-primary" />}
        </View>
        <Text className="text-base font-semibold text-gray-900 capitalize">
          {plan.type === "yearly" ? "Anual" : "Mensal"}
        </Text>
      </View>

      {/* Preco */}
      <Text className="text-2xl font-bold text-gray-900">{plan.price}</Text>
      <Text className="text-sm text-gray-500">/{plan.period}</Text>

      {/* Equivalente mensal */}
      {plan.monthlyEquivalent && (
        <Text className="text-xs text-primary mt-1 font-medium">
          = {plan.monthlyEquivalent}/mes
        </Text>
      )}
    </Pressable>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const PaywallScreen: React.FC<PaywallScreenProps> = ({ navigation, route }) => {
  // Detectar Expo Go
  const runningInExpoGo = isExpoGo();

  // Toast
  const { showInfo, showError } = useToast();

  // Estado
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Store
  const { syncWithRevenueCat, setError } = usePremiumStore();
  const debugTogglePremium = usePremiumStore((s) => s.debugTogglePremium);
  const isPremium = usePremiumStore((s) => s.isPremium);

  // Source para analytics
  const source = route.params?.source || "unknown";

  // ============================================
  // EFEITOS
  // ============================================

  /**
   * Carrega precos do RevenueCat
   */
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
              period: "mes",
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
      logger.error(
        "Failed to load prices",
        "PaywallScreen",
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsLoadingPrices(false);
    }
  }, [runningInExpoGo]);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Realiza compra
   */
  const handlePurchase = useCallback(async () => {
    if (runningInExpoGo) {
      showInfo("Compras disponíveis apenas em build nativo (Dev Client/EAS)");
      return;
    }

    const productId =
      selectedPlan === "yearly" ? pricing.yearly.productId : pricing.monthly.productId;

    try {
      setIsPurchasing(true);
      setError(null);

      logger.info("Starting purchase", "PaywallScreen", {
        productId,
        plan: selectedPlan,
        source,
      });

      const revenuecat = await import("../services/revenuecat");
      const packages = await revenuecat.getPackages();
      const selectedPackage = packages?.find((p) => p.product.identifier === productId);

      if (!selectedPackage) {
        throw new Error("Pacote nao encontrado");
      }

      const result = await revenuecat.purchasePackage(selectedPackage);

      if (result) {
        // Sincroniza estado
        await syncWithRevenueCat();

        logger.info("Purchase successful", "PaywallScreen", { productId });

        // Sucesso - fecha paywall
        navigation.goBack();
      }
    } catch (error: unknown) {
      // Verifica se foi cancelamento
      if ((error as { userCancelled?: boolean })?.userCancelled) {
        logger.info("Purchase cancelled by user", "PaywallScreen");
        return;
      }

      logger.error(
        "Purchase failed",
        "PaywallScreen",
        error instanceof Error ? error : new Error(String(error))
      );

      setError("Erro ao processar compra. Tente novamente.");
      showError(
        "Não foi possível completar a compra. Tente novamente ou entre em contato com o suporte."
      );
    } finally {
      setIsPurchasing(false);
    }
  }, [
    selectedPlan,
    pricing,
    syncWithRevenueCat,
    setError,
    navigation,
    source,
    runningInExpoGo,
    showInfo,
    showError,
  ]);

  /**
   * Restaura compras
   */
  const handleRestore = useCallback(async () => {
    if (runningInExpoGo) {
      showInfo("Restaurar compras disponível apenas em build nativo (Dev Client/EAS)");
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
          showInfo("Não encontramos nenhuma assinatura ativa para restaurar.");
        }
      } else {
        showInfo(result.error || "Não encontramos nenhuma assinatura ativa para restaurar.");
      }
    } catch (error) {
      logger.error(
        "Restore failed",
        "PaywallScreen",
        error instanceof Error ? error : new Error(String(error))
      );

      showError("Não foi possível restaurar suas compras. Tente novamente.");
    } finally {
      setIsRestoring(false);
    }
  }, [syncWithRevenueCat, navigation, runningInExpoGo, showInfo, showError]);

  /**
   * Abre termos de uso
   */
  const openTerms = useCallback(() => {
    Linking.openURL("https://nossamaternidade.com/termos");
  }, []);

  /**
   * Abre politica de privacidade
   */
  const openPrivacy = useCallback(() => {
    Linking.openURL("https://nossamaternidade.com/privacidade");
  }, []);

  // ============================================
  // RENDER
  // ============================================

  // Opcoes de plano
  const planOptions: PlanOption[] = [
    {
      type: "monthly",
      price: pricing.monthly.priceString,
      period: "mes",
    },
    {
      type: "yearly",
      price: pricing.yearly.priceString,
      period: "ano",
      monthlyEquivalent: `R$ ${pricing.yearly.monthlyEquivalent?.toFixed(2).replace(".", ",")}`,
      savings: `-${pricing.yearly.savingsPercent}%`,
      isPopular: true,
    },
  ];

  // Placeholder para Expo Go
  if (runningInExpoGo) {
    return (
      <LinearGradient colors={[...Tokens.gradients.heroAccent]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          {/* Header com botao fechar */}
          <View className="flex-row justify-end px-4 py-2">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
            >
              <Ionicons name="close" size={24} color={Tokens.neutral[700]} />
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="information-circle" size={80} color={PRIMARY_COLOR} />
            <Text className="text-2xl font-bold text-gray-900 mt-6 text-center">
              Premium Disponível em{"\n"}Build Nativo
            </Text>
            <Text className="text-base text-gray-600 mt-4 text-center leading-6">
              O sistema de assinatura Premium está disponível apenas em builds nativos (Dev Client
              ou EAS Build).
            </Text>
            <Text className="text-sm text-gray-500 mt-4 text-center leading-5">
              Para testar compras, faça um build de desenvolvimento:
            </Text>
            <View className="bg-white/80 rounded-xl p-4 mt-4 w-full">
              <Text className="text-sm text-gray-700 font-mono">
                eas build --profile preview --platform ios
              </Text>
            </View>

            {/* DEV ONLY: simular premium para testar gates/fluxos sem Store */}
            {__DEV__ && (
              <Pressable
                onPress={() => {
                  debugTogglePremium();
                  showInfo(
                    isPremium ? "Premium desativado (simulação)" : "Premium ativado (simulação)"
                  );
                }}
                className="mt-6 w-full rounded-xl bg-white/90 px-4 py-3 items-center"
                accessibilityRole="button"
                accessibilityLabel="Simular Premium (apenas desenvolvimento)"
              >
                <Text className="text-sm font-bold text-gray-900">
                  {isPremium ? "Desativar Premium (DEV)" : "Ativar Premium (DEV)"}
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[...Tokens.gradients.heroAccent]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header com botao fechar */}
        <View className="flex-row justify-end px-4 py-2">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
          >
            <Ionicons name="close" size={24} color={Tokens.neutral[700]} />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <Animated.View entering={FadeInDown.springify()} className="items-center px-6 pt-4 pb-8">
            <SparkleIcon />

            <Text className="text-3xl font-bold text-gray-900 mt-6 text-center">
              Desbloqueie Todo o{"\n"}Potencial da NathIA
            </Text>

            <Text className="text-base text-gray-600 mt-3 text-center leading-6">
              Sua companheira de maternidade com voz, exercicios exclusivos e suporte ilimitado
            </Text>

            {/* Trial badge */}
            {pricing.trialDays > 0 && (
              <View className="mt-4 bg-white/90 px-4 py-2 rounded-full flex-row items-center">
                <Ionicons name="gift-outline" size={18} color={PRIMARY_COLOR} />
                <Text className="text-primary font-semibold ml-2">
                  {pricing.trialDays} dias gratis para testar
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Features */}
          <View className="px-6">
            {PREMIUM_FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                index={index}
              />
            ))}
          </View>

          {/* Selecao de plano */}
          <View className="px-6 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Escolha seu plano
            </Text>

            {isLoadingPrices ? (
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            ) : (
              <View className="flex-row gap-3">
                {planOptions.map((plan) => (
                  <PlanButton
                    key={plan.type}
                    plan={plan}
                    isSelected={selectedPlan === plan.type}
                    onSelect={() => setSelectedPlan(plan.type)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Garantia */}
          <View className="px-6 mt-6">
            <View className="flex-row items-center justify-center bg-white/60 rounded-xl p-3">
              <Ionicons name="shield-checkmark-outline" size={20} color={Tokens.semantic.light.success} />
              <Text className="text-sm text-gray-600 ml-2">
                Cancele a qualquer momento. Sem compromisso.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer fixo */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-white/95 px-6 pt-4 pb-8"
          style={{
            shadowColor: Tokens.neutral[900],
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          {/* Botao CTA */}
          <Pressable
            onPress={handlePurchase}
            disabled={isPurchasing || isLoadingPrices}
            className={cn("w-full rounded-2xl py-4 items-center", isPurchasing && "opacity-80")}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {isPurchasing ? (
              <ActivityIndicator color={Tokens.neutral[0]} />
            ) : (
              <Text className="text-white text-lg font-bold">
                {pricing.trialDays > 0
                  ? `Iniciar ${pricing.trialDays} Dias Gratis`
                  : "Assinar Agora"}
              </Text>
            )}
          </Pressable>

          {/* Texto informativo */}
          <Text className="text-xs text-gray-500 text-center mt-3">
            {selectedPlan === "yearly"
              ? `Apos o periodo de teste, ${pricing.yearly.priceString}/ano. Cancele a qualquer momento.`
              : `${pricing.monthly.priceString}/mes. Cancele a qualquer momento.`}
          </Text>

          {/* Links legais */}
          <View className="flex-row justify-center items-center mt-3 gap-4">
            <Pressable onPress={handleRestore} disabled={isRestoring}>
              <Text className="text-sm text-primary font-medium">
                {isRestoring ? "Restaurando..." : "Restaurar Compras"}
              </Text>
            </Pressable>

            <Text className="text-gray-300">|</Text>

            <Pressable onPress={openTerms}>
              <Text className="text-sm text-gray-500">Termos</Text>
            </Pressable>

            <Text className="text-gray-300">|</Text>

            <Pressable onPress={openPrivacy}>
              <Text className="text-sm text-gray-500">Privacidade</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PaywallScreen;
