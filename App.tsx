import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Sentry from "@sentry/react-native";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import RootNavigator from "./src/navigation/RootNavigator";
import { View, ActivityIndicator, Platform } from "react-native";
import { useEffect } from "react";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { OfflineBanner } from "./src/components/OfflineBanner";
import { ToastProvider } from "./src/context/ToastContext";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { useTheme } from "./src/hooks/useTheme";
import { useDeepLinking } from "./src/hooks/useDeepLinking";
import { useNotifications } from "./src/hooks/useNotifications";
import { navigationRef } from "./src/navigation/navigationRef";
import { usePremiumStore } from "./src/state/premium-store";
import { logger } from "./src/utils/logger";
import { supabase } from "./src/api/supabase";
import Constants from "expo-constants";

// Initialize Sentry for error tracking (production only)
const sentryDsn = Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN;
if (sentryDsn && !__DEV__) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.APP_ENV || "production",
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    tracesSampleRate: 0.2, // 20% of transactions for performance monitoring
    debug: false,
    beforeSend(event) {
      // Filter out non-critical errors in production
      if (event.exception?.values?.[0]?.type === "NetworkError") {
        return null; // Don't send network errors
      }
      return event;
    },
  });
  logger.info("Sentry initialized", "App");
}

/*
Environment variables are accessed via process.env.EXPO_PUBLIC_*
Example: process.env.EXPO_PUBLIC_SUPABASE_URL
*/

function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSerifDisplay_400Regular,
  });

  // Monitor network status for offline banner
  const { isOffline, isChecking, retry } = useNetworkStatus();

  // Theme management
  const { isDark, colors } = useTheme();

  // Deep linking
  useDeepLinking();

  // Push notifications
  useNotifications();

  // Premium/IAP initialization
  const syncWithRevenueCat = usePremiumStore((s) => s.syncWithRevenueCat);

  useEffect(() => {
    // Initialize RevenueCat on app startup (with Expo Go fallback)
    const initPremium = async () => {
      try {
        // Expo Go não suporta IAP real. Evita inicialização para não gerar erro/ruído em runtime.
        if (Constants.appOwnership === "expo") {
          logger.info(
            "Expo Go detectado: RevenueCat desabilitado (use Dev Client para IAP).",
            "App"
          );
          return;
        }

        const revenuecat = await import("./src/services/revenuecat");
        await revenuecat.initializePurchases();

        // Validação: verificar se RevenueCat foi configurado
        const isConfigured = revenuecat.getIsConfigured();
        logger.info(`RevenueCat isConfigured: ${isConfigured}`, "App", {
          platform: Platform.OS,
        });

        await syncWithRevenueCat();
      } catch (err) {
        logger.warn("RevenueCat indisponível (provável Expo Go). App rodando como free.", "App", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };
    initPremium();

    // Web: Detectar sessão OAuth na URL após redirect
    if (Platform.OS === "web" && supabase) {
      const handleOAuthCallback = async () => {
        try {
          // Supabase detecta automaticamente a sessão na URL quando detectSessionInUrl: true
          // Mas precisamos verificar se há hash na URL
          if (typeof window !== "undefined" && window.location.hash) {
            const hash = window.location.hash;
            // Se há tokens na URL, o Supabase já processou via detectSessionInUrl
            // Limpar hash da URL após processamento
            if (hash.includes("access_token") || hash.includes("error")) {
              // Aguardar um pouco para o Supabase processar
              setTimeout(() => {
                window.history.replaceState(null, "", window.location.pathname);
              }, 1000);
            }
          }
        } catch (error) {
          logger.error("Erro ao processar OAuth callback", "App", error as Error);
        }
      };

      handleOAuthCallback();
    }
  }, [syncWithRevenueCat]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <SafeAreaProvider>
          <ToastProvider>
            {/* Offline Banner - appears on top when no connection */}
            {isOffline && <OfflineBanner onRetry={retry} isRetrying={isChecking} />}
            <NavigationContainer ref={navigationRef}>
              <StatusBar style={isDark ? "light" : "dark"} />
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// Em DEV (inclui Expo Go), não envolver com Sentry para evitar warning de init.
export default __DEV__ ? App : Sentry.wrap(App);
