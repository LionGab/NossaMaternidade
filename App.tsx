import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { supabase } from "./src/api/supabase";
import { AnimatedSplashScreen } from "./src/components/AnimatedSplashScreen";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { OfflineBanner } from "./src/components/OfflineBanner";
import { ToastProvider } from "./src/context/ToastContext";
import { useDeepLinking } from "./src/hooks/useDeepLinking";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { useNotifications } from "./src/hooks/useNotifications";
import { useTheme } from "./src/hooks/useTheme";
import { navigationRef } from "./src/navigation/navigationRef";
import RootNavigator from "./src/navigation/RootNavigator";
import { usePremiumStore } from "./src/state/premium-store";
import { isExpoGo } from "./src/utils/expo";
import { logger } from "./src/utils/logger";

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

  const [isSplashVisible, setIsSplashVisible] = useState(true);

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
        if (isExpoGo()) {
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

    // Web: Detectar callback OAuth na URL inicial (apenas uma vez)
    // O useDeepLinking já processa callbacks, então apenas logamos aqui
    if (Platform.OS === "web" && supabase && typeof window !== "undefined") {
      const url = window.location.href;
      const hasCallback =
        url.includes("/auth/callback") ||
        url.includes("?code=") ||
        url.includes("#access_token=") ||
        url.includes("token_hash=");

      if (hasCallback) {
        logger.info("Callback OAuth detectado na URL inicial (web)", "App", { url });
        // O Supabase com detectSessionInUrl: true processa automaticamente
        // O useDeepLinking também processa via handleInitialURL
        // Não precisamos fazer nada aqui, apenas logar
      }
    }
  }, [syncWithRevenueCat]);

  // Show animated splash screen until fonts are loaded
  if (isSplashVisible) {
    return (
      <AnimatedSplashScreen
        isReady={fontsLoaded}
        onFinish={() => setIsSplashVisible(false)}
      />
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
