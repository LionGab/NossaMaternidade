import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { DMSerifDisplay_400Regular, DMSerifDisplay_400Regular_Italic } from "@expo-google-fonts/dm-serif-display";
import RootNavigator from "./src/navigation/RootNavigator";
import { View, ActivityIndicator } from "react-native";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { OfflineBanner } from "./src/components/OfflineBanner";
import { ToastProvider } from "./src/context/ToastContext";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { useTheme } from "./src/hooks/useTheme";
import { useDeepLinking } from "./src/hooks/useDeepLinking";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project.
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  // Monitor network status for offline banner
  const { isOffline, isChecking, retry } = useNetworkStatus();
  
  // Theme management
  const { isDark, colors } = useTheme();
  
  // Deep linking
  useDeepLinking();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background.DEFAULT }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <SafeAreaProvider>
          <ToastProvider>
            {/* Offline Banner - appears on top when no connection */}
            {isOffline && <OfflineBanner onRetry={retry} isRetrying={isChecking} />}
            <NavigationContainer>
              <StatusBar style={isDark ? "light" : "dark"} />
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
