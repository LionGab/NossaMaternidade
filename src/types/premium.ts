/**
 * Premium Subscription Types
 * Tipos para gerenciamento de assinaturas premium
 */

import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";

// Tiers de assinatura
export type SubscriptionTier = "free" | "premium";

// Periodos de assinatura
export type SubscriptionPeriod = "monthly" | "yearly";

// Estado da assinatura
export interface SubscriptionDetails {
  tier: SubscriptionTier;
  period: SubscriptionPeriod | null;
  expirationDate: string | null;
  isTrialing: boolean;
  trialEndDate: string | null;
  willRenew: boolean;
  productId: string | null;
}

// Estado completo do premium
export interface PremiumState {
  // Status principal
  isPremium: boolean;
  subscription: SubscriptionDetails;

  // Feature flags
  hasVoiceAccess: boolean;
  hasPremiumScreensAccess: boolean;
  hasUnlimitedChat: boolean;

  // Loading states
  isLoading: boolean;
  isRestoring: boolean;
  isPurchasing: boolean;

  // Error
  error: string | null;

  // Customer info do RevenueCat
  customerInfo: CustomerInfo | null;

  // Actions
  setPremiumStatus: (isPremium: boolean) => void;
  setSubscriptionDetails: (details: Partial<SubscriptionDetails>) => void;
  setCustomerInfo: (info: CustomerInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setRestoring: (restoring: boolean) => void;
  setPurchasing: (purchasing: boolean) => void;
  setError: (error: string | null) => void;
  checkPremiumStatus: () => Promise<boolean>;
  syncWithRevenueCat: () => Promise<void>;
  reset: () => void;

  // Debug (apenas desenvolvimento)
  debugTogglePremium: () => void;
}

// Configuracao de precos
export interface PricingConfig {
  monthly: {
    productId: string;
    price: number;
    priceString: string;
    currency: string;
    period: string;
  };
  yearly: {
    productId: string;
    price: number;
    priceString: string;
    currency: string;
    period: string;
    savingsPercent: number;
    monthlyEquivalent: number;
  };
  trialDays: number;
}

// Features premium
export interface PremiumFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color?: string;
}

// Resultado de compra
export interface PurchaseResult {
  success: boolean;
  error?: "cancelled" | "error" | "already_purchased" | "network";
  customerInfo?: CustomerInfo;
  message?: string;
}

// Props do paywall
export interface PaywallProps {
  onClose?: () => void;
  onSuccess?: () => void;
  source?: string; // Para analytics - de onde veio
}

// Constantes de product IDs
export const PRODUCT_IDS = {
  MONTHLY: "nossa_maternidade_monthly",
  YEARLY: "nossa_maternidade_yearly",
} as const;

// Constantes de entitlements
export const ENTITLEMENTS = {
  PREMIUM: "premium",
} as const;

// Features premium padrao
export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: "voice",
    icon: "mic-outline",
    title: "Voz da NathIA",
    description: "Ouca as respostas com a voz carinhosa da NathIA",
    color: "#EC4899",
  },
  {
    id: "sounds",
    icon: "moon-outline",
    title: "Sons para Relaxar",
    description: "Meditacoes e sons da natureza ilimitados",
    color: "#8B5CF6",
  },
  {
    id: "breathing",
    icon: "leaf-outline",
    title: "Respiracao Guiada",
    description: "Exercicios de respiracao personalizados",
    color: "#10B981",
  },
  {
    id: "exclusive",
    icon: "sparkles-outline",
    title: "Conteudo Exclusivo",
    description: "Acesso antecipado a novos recursos",
    color: "#F59E0B",
  },
];

// Precos padrao (fallback se API falhar)
export const DEFAULT_PRICING: PricingConfig = {
  monthly: {
    productId: PRODUCT_IDS.MONTHLY,
    price: 19.99,
    priceString: "R$ 19,99",
    currency: "BRL",
    period: "mes",
  },
  yearly: {
    productId: PRODUCT_IDS.YEARLY,
    price: 119.90,
    priceString: "R$ 119,90",
    currency: "BRL",
    period: "ano",
    savingsPercent: 50,
    monthlyEquivalent: 9.99,
  },
  trialDays: 7,
};
