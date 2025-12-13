/**
 * Premium Store
 * Gerenciamento de estado de assinatura premium com Zustand
 * Sincroniza com RevenueCat para status real de compras
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CustomerInfo } from "react-native-purchases";
import {
  PremiumState,
  SubscriptionDetails,
  ENTITLEMENTS,
} from "../types/premium";
import { getCustomerInfo, checkPremiumStatus as checkRevenueCatPremium } from "../services/purchases";
import { logger } from "../utils/logger";

// Estado inicial da subscription
const initialSubscription: SubscriptionDetails = {
  tier: "free",
  period: null,
  expirationDate: null,
  isTrialing: false,
  trialEndDate: null,
  willRenew: false,
  productId: null,
};

// Estado inicial completo
const initialState = {
  isPremium: false,
  subscription: initialSubscription,
  hasVoiceAccess: false,
  hasPremiumScreensAccess: false,
  hasUnlimitedChat: false,
  isLoading: false,
  isRestoring: false,
  isPurchasing: false,
  error: null,
  customerInfo: null,
};

/**
 * Premium Store
 * Persistido no AsyncStorage para manter estado entre sessoes
 */
export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters simples
      setPremiumStatus: (isPremium: boolean) => {
        set({
          isPremium,
          subscription: {
            ...get().subscription,
            tier: isPremium ? "premium" : "free",
          },
          hasVoiceAccess: isPremium,
          hasPremiumScreensAccess: isPremium,
          hasUnlimitedChat: isPremium,
        });
      },

      setSubscriptionDetails: (details: Partial<SubscriptionDetails>) => {
        set({
          subscription: {
            ...get().subscription,
            ...details,
          },
        });
      },

      setCustomerInfo: (info: CustomerInfo | null) => {
        set({ customerInfo: info });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setRestoring: (restoring: boolean) => {
        set({ isRestoring: restoring });
      },

      setPurchasing: (purchasing: boolean) => {
        set({ isPurchasing: purchasing });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Verifica status premium com RevenueCat
       * Retorna true se usuario e premium
       */
      checkPremiumStatus: async (): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const customerInfo = await getCustomerInfo();

          if (!customerInfo) {
            logger.info("No customer info found", "PremiumStore");
            set({
              isPremium: false,
              isLoading: false,
              subscription: initialSubscription,
              hasVoiceAccess: false,
              hasPremiumScreensAccess: false,
              hasUnlimitedChat: false,
            });
            return false;
          }

          // Verifica entitlement premium
          const premiumEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
          const isPremium = !!premiumEntitlement;

          // Extrai detalhes da subscription
          const subscriptionDetails: SubscriptionDetails = {
            tier: isPremium ? "premium" : "free",
            period: premiumEntitlement?.productIdentifier?.includes("yearly")
              ? "yearly"
              : premiumEntitlement?.productIdentifier?.includes("monthly")
              ? "monthly"
              : null,
            expirationDate: premiumEntitlement?.expirationDate || null,
            isTrialing: premiumEntitlement?.periodType === "TRIAL",
            trialEndDate: premiumEntitlement?.periodType === "TRIAL"
              ? premiumEntitlement?.expirationDate || null
              : null,
            willRenew: premiumEntitlement?.willRenew ?? false,
            productId: premiumEntitlement?.productIdentifier || null,
          };

          set({
            isPremium,
            customerInfo,
            subscription: subscriptionDetails,
            hasVoiceAccess: isPremium,
            hasPremiumScreensAccess: isPremium,
            hasUnlimitedChat: isPremium,
            isLoading: false,
          });

          logger.info("Premium status checked", "PremiumStore", {
            isPremium,
            tier: subscriptionDetails.tier,
            period: subscriptionDetails.period,
          });

          return isPremium;
        } catch (error) {
          logger.error(
            "Failed to check premium status",
            "PremiumStore",
            error instanceof Error ? error : new Error(String(error))
          );

          set({
            isLoading: false,
            error: "Erro ao verificar assinatura",
          });

          return false;
        }
      },

      /**
       * Sincroniza estado com RevenueCat
       * Chamado no startup do app e apos compras
       */
      syncWithRevenueCat: async (): Promise<void> => {
        try {
          await get().checkPremiumStatus();
        } catch (error) {
          logger.error(
            "Failed to sync with RevenueCat",
            "PremiumStore",
            error instanceof Error ? error : new Error(String(error))
          );
        }
      },

      /**
       * Reseta estado para inicial
       */
      reset: () => {
        set(initialState);
      },

      /**
       * Toggle premium para debug (apenas desenvolvimento)
       */
      debugTogglePremium: () => {
        if (!__DEV__) return;

        const currentState = get();
        const newIsPremium = !currentState.isPremium;

        set({
          isPremium: newIsPremium,
          subscription: {
            tier: newIsPremium ? "premium" : "free",
            period: newIsPremium ? "yearly" : null,
            expirationDate: newIsPremium
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : null,
            isTrialing: false,
            trialEndDate: null,
            willRenew: newIsPremium,
            productId: newIsPremium ? "nossa_maternidade_yearly" : null,
          },
          hasVoiceAccess: newIsPremium,
          hasPremiumScreensAccess: newIsPremium,
          hasUnlimitedChat: newIsPremium,
        });

        logger.info("Debug toggle premium", "PremiumStore", {
          isPremium: newIsPremium,
        });
      },
    }),
    {
      name: "nossa-maternidade-premium",
      storage: createJSONStorage(() => AsyncStorage),
      // Persistir apenas dados essenciais
      partialize: (state) => ({
        isPremium: state.isPremium,
        subscription: state.subscription,
        hasVoiceAccess: state.hasVoiceAccess,
        hasPremiumScreensAccess: state.hasPremiumScreensAccess,
        hasUnlimitedChat: state.hasUnlimitedChat,
      }),
    }
  )
);

/**
 * Selector hooks para uso otimizado
 */
export const useIsPremium = () => usePremiumStore((s) => s.isPremium);
export const useHasVoiceAccess = () => usePremiumStore((s) => s.hasVoiceAccess);
export const useHasPremiumScreensAccess = () => usePremiumStore((s) => s.hasPremiumScreensAccess);
export const usePremiumLoading = () => usePremiumStore((s) => s.isLoading);
export const useSubscriptionDetails = () => usePremiumStore((s) => s.subscription);
