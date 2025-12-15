/**
 * PremiumGate
 *
 * Componente wrapper que verifica acesso premium.
 * Redireciona para Paywall se usuario nao for premium.
 * Usado para proteger telas e features exclusivas.
 */

import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePremiumStore, useIsPremium, useHasPremiumScreensAccess } from "../state/premium-store";
import { Colors, PRIMARY_COLOR } from "../utils/colors";
import type { RootStackParamList } from "../types/navigation";

// ============================================
// TIPOS
// ============================================

interface PremiumGateProps {
  /** Conteudo a ser exibido se usuario for premium */
  children: React.ReactNode;
  /** Tipo de feature sendo protegida (para analytics) */
  feature?: string;
  /** Callback quando acesso e negado */
  onAccessDenied?: () => void;
  /** Mostrar loading enquanto verifica */
  showLoadingState?: boolean;
  /** Renderizar conteudo customizado quando bloqueado */
  renderBlocked?: () => React.ReactNode;
  /** Nao redirecionar automaticamente */
  noAutoRedirect?: boolean;
}

interface PremiumGateHookReturn {
  /** Se usuario tem acesso premium */
  hasAccess: boolean;
  /** Verifica acesso e executa callback apropriado */
  checkAccess: (onGranted: () => void, onDenied?: () => void) => void;
  /** Navega para paywall */
  showPaywall: (source?: string) => void;
  /** Esta carregando status */
  isLoading: boolean;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook para verificar acesso premium e mostrar paywall
 */
export function usePremiumGate(): PremiumGateHookReturn {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isPremium = useIsPremium();
  const hasPremiumAccess = useHasPremiumScreensAccess();
  const isLoading = usePremiumStore((s) => s.isLoading);

  const hasAccess = isPremium || hasPremiumAccess;

  /**
   * Verifica acesso e executa callback apropriado
   */
  const checkAccess = useCallback(
    (onGranted: () => void, onDenied?: () => void) => {
      if (hasAccess) {
        onGranted();
      } else {
        onDenied?.();
      }
    },
    [hasAccess]
  );

  /**
   * Navega para paywall
   */
  const showPaywall = useCallback(
    (source?: string) => {
      navigation.navigate("Paywall", { source });
    },
    [navigation]
  );

  return {
    hasAccess,
    checkAccess,
    showPaywall,
    isLoading,
  };
}

// ============================================
// COMPONENTE DE BLOQUEIO
// ============================================

interface BlockedContentProps {
  feature?: string;
  onUnlock: () => void;
}

/**
 * Tela de conteudo bloqueado (fallback padrao)
 */
const BlockedContent: React.FC<BlockedContentProps> = ({ feature, onUnlock }) => {
  return (
    <View className="flex-1 items-center justify-center p-8 bg-gray-50">
      <LinearGradient
        colors={[`${PRIMARY_COLOR}20`, `${PRIMARY_COLOR}05`]}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: `${PRIMARY_COLOR}30` }}
        >
          <Ionicons name="lock-closed" size={40} color={PRIMARY_COLOR} />
        </View>
      </LinearGradient>

      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Conteudo Exclusivo
      </Text>

      <Text className="text-base text-gray-500 text-center mb-8 px-4">
        {feature
          ? `"${feature}" e um recurso premium. Assine para desbloquear!`
          : "Este recurso e exclusivo para assinantes premium."}
      </Text>

      <Pressable
        onPress={onUnlock}
        className="flex-row items-center px-8 py-4 rounded-full"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <Ionicons name="diamond" size={20} color="#fff" />
        <Text className="text-white text-base font-bold ml-2">
          Desbloquear Premium
        </Text>
      </Pressable>

      <View className="flex-row items-center mt-6">
        <Ionicons name="shield-checkmark-outline" size={16} color="#9CA3AF" />
        <Text className="text-sm text-gray-400 ml-2">
          7 dias gratis para testar
        </Text>
      </View>
    </View>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

/**
 * PremiumGate - Wrapper que protege conteudo premium
 *
 * Uso:
 * ```tsx
 * <PremiumGate feature="Respiracao Guiada">
 *   <BreathingExerciseScreen />
 * </PremiumGate>
 * ```
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  feature,
  onAccessDenied,
  showLoadingState = true,
  renderBlocked,
  noAutoRedirect = false,
}) => {
  const { hasAccess, showPaywall, isLoading } = usePremiumGate();
  const [hasChecked, setHasChecked] = useState(false);

  // Verifica status na montagem
  useEffect(() => {
    if (!isLoading) {
      setHasChecked(true);

      // Se nao tem acesso e deve redirecionar automaticamente
      if (!hasAccess && !noAutoRedirect) {
        onAccessDenied?.();
      }
    }
  }, [isLoading, hasAccess, noAutoRedirect, onAccessDenied]);

  // Loading state
  if (showLoadingState && (isLoading || !hasChecked)) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text className="text-gray-500 mt-4">Verificando acesso...</Text>
      </View>
    );
  }

  // Sem acesso - mostrar tela de bloqueio
  if (!hasAccess) {
    if (renderBlocked) {
      return <>{renderBlocked()}</>;
    }

    return (
      <BlockedContent
        feature={feature}
        onUnlock={() => showPaywall(feature)}
      />
    );
  }

  // Com acesso - renderiza children
  return <>{children}</>;
};

// ============================================
// COMPONENTES AUXILIARES
// ============================================

interface PremiumBadgeProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

/**
 * Badge que indica conteudo premium
 */
export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  size = "small",
  showText = false,
}) => {
  const sizeConfig = {
    small: { badge: 16, icon: 10, text: 10 },
    medium: { badge: 24, icon: 14, text: 12 },
    large: { badge: 32, icon: 18, text: 14 },
  };

  const { badge, icon, text } = sizeConfig[size];

  return (
    <View className="flex-row items-center">
      <LinearGradient
        colors={[PRIMARY_COLOR, "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: badge,
          height: badge,
          borderRadius: badge / 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="diamond" size={icon} color="#fff" />
      </LinearGradient>

      {showText && (
        <Text
          className="font-semibold ml-1"
          style={{ fontSize: text, color: PRIMARY_COLOR }}
        >
          PRO
        </Text>
      )}
    </View>
  );
};

interface PremiumLockOverlayProps {
  onPress: () => void;
  message?: string;
}

/**
 * Overlay de cadeado para conteudo bloqueado
 */
export const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({
  onPress,
  message = "Premium",
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="absolute inset-0 bg-black/40 items-center justify-center rounded-2xl"
    >
      <View className="bg-white/90 px-4 py-3 rounded-full flex-row items-center">
        <Ionicons name="lock-closed" size={16} color={PRIMARY_COLOR} />
        <Text className="text-primary font-semibold ml-2">{message}</Text>
      </View>
    </Pressable>
  );
};

// ============================================
// EXPORTS
// ============================================

export default PremiumGate;
