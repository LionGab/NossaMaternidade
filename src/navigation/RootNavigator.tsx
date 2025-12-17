/**
 * Nossa Maternidade - Root Navigator
 * 4-stage authentication flow:
 * 1. !isAuthenticated → LoginScreen
 * 2. !notificationSetup → NotificationPermissionScreen
 * 3. !nathIAOnboardingComplete → NathIAOnboardingScreen
 * 4. Authenticated → MainTabs + Modal Screens
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { hasAskedNotificationPermission } from "../services/notifications";
import { useNathIAOnboardingStore } from "../state/nathia-onboarding-store";
import { useAppStore } from "../state/store";
import { COLORS } from "../theme/design-system";
import { RootStackParamList } from "../types/navigation";

// Auth & Onboarding Screens
import LoginScreen from "../screens/LoginScreen";
import NathIAOnboardingScreen from "../screens/NathIAOnboardingScreen";
import NotificationPermissionScreen from "../screens/NotificationPermissionScreen";

// Main Navigator
import MainTabNavigator from "./MainTabNavigator";

// Feature Screens
import AffirmationsScreen from "../screens/AffirmationsScreen";
import ComingSoonScreen from "../screens/ComingSoonScreen";
import DailyLogScreen from "../screens/DailyLogScreen";
import HabitsScreen from "../screens/HabitsScreen";
import LegalScreen from "../screens/LegalScreen";
import NewPostScreen from "../screens/NewPostScreen";
import NotificationPreferencesScreen from "../screens/NotificationPreferencesScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";

// New Premium Screens
import BreathingExerciseScreen from "../screens/BreathingExerciseScreen";
import HabitsEnhancedScreen from "../screens/HabitsEnhancedScreen";
import MaeValenteProgressScreen from "../screens/MaeValenteProgressScreen";
import MundoDaNathScreen from "../screens/MundoDaNathScreen";
import Paywall from "../screens/PaywallScreen";
import RestSoundsScreen from "../screens/RestSoundsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // App state
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isOnboardingComplete = useAppStore((s) => s.isOnboardingComplete);
  void isOnboardingComplete;

  // NathIA onboarding state
  const isNathIAOnboardingComplete = useNathIAOnboardingStore((s) => s.isComplete);

  // Notification permission state
  const [notificationSetupDone, setNotificationSetupDone] = useState<boolean | null>(null);

  // Check notification permission status on mount
  useEffect(() => {
    const checkNotificationSetup = async () => {
      const hasAsked = await hasAskedNotificationPermission();
      setNotificationSetupDone(hasAsked);
    };
    checkNotificationSetup();
  }, []);

  // Loading state while checking notification permission
  if (notificationSetupDone === null) {
    return null;
  }

  // Determine which screen to show based on auth state
  // Flow: Login → NotificationPermission → NathIAOnboarding → MainApp
  const shouldShowLogin = !isAuthenticated;
  const shouldShowNotificationPermission = isAuthenticated && !notificationSetupDone;
  const shouldShowNathIAOnboarding =
    isAuthenticated && notificationSetupDone && !isNathIAOnboardingComplete;
  const shouldShowMainApp = isAuthenticated && notificationSetupDone && isNathIAOnboardingComplete;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: COLORS.background.primary },
      }}
    >
      {/* Stage 1: Login */}
      {shouldShowLogin && (
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: "fade" }} />
      )}

      {/* Stage 2: Notification Permission */}
      {shouldShowNotificationPermission && (
        <Stack.Screen
          name="NotificationPermission"
          component={NotificationPermissionScreen}
          options={{ animation: "fade" }}
        />
      )}

      {/* Stage 3: NathIA Onboarding */}
      {shouldShowNathIAOnboarding && (
        <Stack.Screen
          name="NathIAOnboarding"
          component={NathIAOnboardingScreen}
          options={{ animation: "fade" }}
        />
      )}

      {/* Stage 4: Main App */}
      {shouldShowMainApp && (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />

          {/* Feature Screens */}
          <Stack.Screen
            name="PostDetail"
            component={PostDetailScreen}
            options={{
              headerShown: true,
              headerTitle: "Post",
              headerBackTitle: "Voltar",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="NewPost"
            component={NewPostScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Nova Publicação",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="DailyLog"
            component={DailyLogScreen}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="Affirmations"
            component={AffirmationsScreen}
            options={{
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="Habits"
            component={HabitsScreen}
            options={{
              headerShown: true,
              headerTitle: "Meus Hábitos",
              headerBackTitle: "Voltar",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="Legal"
            component={LegalScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={ProfileScreen}
            options={{
              headerShown: true,
              headerTitle: "Perfil",
              headerBackTitle: "Voltar",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="ComingSoon"
            component={ComingSoonScreen}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="NotificationPreferences"
            component={NotificationPreferencesScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* Premium Wellness Screens */}
          <Stack.Screen
            name="BreathingExercise"
            component={BreathingExerciseScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="RestSounds"
            component={RestSoundsScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="HabitsEnhanced"
            component={HabitsEnhancedScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="MaeValenteProgress"
            component={MaeValenteProgressScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* Paywall Screen */}
          <Stack.Screen
            name="Paywall"
            component={Paywall}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* Mundo da Nath Screen */}
          <Stack.Screen
            name="MundoDaNath"
            component={MundoDaNathScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
