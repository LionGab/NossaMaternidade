/**
 * Nossa Maternidade - Root Navigator
 * 4-stage authentication flow:
 * 1. !isAuthenticated → LoginScreen
 * 2. !notificationSetup → NotificationPermissionScreen
 * 3. !nathIAOnboardingComplete → NathIAOnboardingScreen
 * 4. Authenticated → MainTabs + Modal Screens
 */

import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAppStore } from "../state/store";
import { useNathIAOnboardingStore } from "../state/nathia-onboarding-store";
import { hasAskedNotificationPermission } from "../services/notifications";
import { COLORS } from "../theme/design-system";

// Auth & Onboarding Screens
import LoginScreen from "../screens/LoginScreen";
import NotificationPermissionScreen from "../screens/NotificationPermissionScreen";
import NathIAOnboardingScreen from "../screens/NathIAOnboardingScreen";

// Main Navigator
import MainTabNavigator from "./MainTabNavigator";

// Feature Screens
import PostDetailScreen from "../screens/PostDetailScreen";
import NewPostScreen from "../screens/NewPostScreen";
import DailyLogScreen from "../screens/DailyLogScreen";
import AffirmationsScreen from "../screens/AffirmationsScreen";
import HabitsScreen from "../screens/HabitsScreen";
import LegalScreen from "../screens/LegalScreen";
import ComingSoonScreen from "../screens/ComingSoonScreen";

// New Premium Screens
import BreathingExerciseScreen from "../screens/BreathingExerciseScreen";
import RestSoundsScreen from "../screens/RestSoundsScreen";
import HabitsEnhancedScreen from "../screens/HabitsEnhancedScreen";
import MaeValenteProgressScreen from "../screens/MaeValenteProgressScreen";
import PaywallScreen from "../screens/PaywallScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // App state
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isOnboardingComplete = useAppStore((s) => s.isOnboardingComplete);

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
  const shouldShowNathIAOnboarding = isAuthenticated && notificationSetupDone && !isNathIAOnboardingComplete;
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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: "fade" }}
        />
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
            name="ComingSoon"
            component={ComingSoonScreen}
            options={{
              headerShown: false,
              presentation: "modal",
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
            component={PaywallScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
