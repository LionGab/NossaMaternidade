import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import RootNavigator from "./src/navigation/RootNavigator";
import { View, ActivityIndicator } from "react-native";
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

/*
Environment variables are accessed via process.env.EXPO_PUBLIC_*
Example: process.env.EXPO_PUBLIC_SUPABASE_URL
*/

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
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
        const purchases = await import("./src/services/purchases");
        await purchases.initializePurchases();
        await syncWithRevenueCat();
      } catch (err) {
        logger.warn("RevenueCat indisponível (provável Expo Go). App rodando como free.", "App", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };
    initPremium();
  }, [syncWithRevenueCat]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background.primary }}>
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
