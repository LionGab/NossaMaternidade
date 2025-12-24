/**
 * Nossa Maternidade - Root Navigator
 * 5-stage authentication flow:
 * 1. !isAuthenticated → LoginScreen
 * 2. !notificationSetup → NotificationPermissionScreen
 * 3. !isOnboardingComplete → OnboardingScreen (name, stage, interests)
 * 4. !nathIAOnboardingComplete → NathIAOnboardingScreen (AI personalization)
 * 5. Authenticated → MainTabs + Modal Screens
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { isDevBypassActive } from "../config/dev-bypass";
import { hasAskedNotificationPermission } from "../services/notifications";
import { useNathIAOnboardingStore } from "../state/nathia-onboarding-store";
import { useAppStore } from "../state/store";
import { COLORS } from "../theme/tokens";
import { RootStackParamList } from "../types/navigation";

// Auth & Onboarding Screens
import { AuthLandingScreen, EmailAuthScreen } from "../screens/auth";
import LoginScreen from "../screens/LoginScreen"; // Legacy fallback
import NathIAOnboardingScreen from "../screens/NathIAOnboardingScreen";
import NotificationPermissionScreen from "../screens/NotificationPermissionScreen";
import OnboardingScreen from "../screens/OnboardingScreen";

// Nath Journey Onboarding - Stories Format (NEW)
import OnboardingStoriesScreen from "../screens/OnboardingStoriesScreen";
import { useNathJourneyOnboardingStore } from "../state/nath-journey-onboarding-store";

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

  // NathIA onboarding state
  const isNathIAOnboardingComplete = useNathIAOnboardingStore((s) => s.isComplete);

  // Nath Journey onboarding state (new)
  const isNathJourneyOnboardingComplete = useNathJourneyOnboardingStore(
    (s: { isComplete: boolean }) => s.isComplete
  );

  // Notification permission state
  const [notificationSetupDone, setNotificationSetupDone] = useState<boolean | null>(null);

  // Check notification permission status on mount and poll for changes
  useEffect(() => {
    const checkNotificationSetup = async () => {
      const hasAsked = await hasAskedNotificationPermission();
      setNotificationSetupDone(hasAsked);
    };

    // Initial check
    checkNotificationSetup();

    // Poll every 500ms to detect changes (workaround for web)
    const interval = setInterval(checkNotificationSetup, 500);

    return () => clearInterval(interval);
  }, []);

  // Loading state while checking notification permission
  if (notificationSetupDone === null) {
    return null;
  }

  // Determine which screen to show based on auth state
  // Flow: Login → NotificationPermission → NathJourneyOnboarding → Onboarding → NathIAOnboarding → MainApp
  const shouldShowLogin = isDevBypassActive() ? false : !isAuthenticated;

  const shouldShowNotificationPermission = isDevBypassActive()
    ? false
    : isAuthenticated && !notificationSetupDone;

  // NEW: Nath Journey Onboarding (prioritário sobre onboarding antigo)
  const shouldShowNathJourneyOnboarding = isDevBypassActive()
    ? false
    : isAuthenticated && notificationSetupDone && !isNathJourneyOnboardingComplete;

  const shouldShowOnboarding = isDevBypassActive()
    ? false
    : isAuthenticated &&
      notificationSetupDone &&
      isNathJourneyOnboardingComplete &&
      !isOnboardingComplete;

  const shouldShowNathIAOnboarding = isDevBypassActive()
    ? false
    : isAuthenticated &&
      notificationSetupDone &&
      isNathJourneyOnboardingComplete &&
      isOnboardingComplete &&
      !isNathIAOnboardingComplete;

  const shouldShowMainApp = isDevBypassActive()
    ? true
    : isAuthenticated &&
      notificationSetupDone &&
      isNathJourneyOnboardingComplete &&
      isOnboardingComplete &&
      isNathIAOnboardingComplete;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: COLORS.background.primary },
      }}
    >
      {/* Stage 1: Auth (Landing + Email) */}
      {shouldShowLogin && (
        <>
          <Stack.Screen
            name="AuthLanding"
            component={AuthLandingScreen}
            options={{ animation: "fade" }}
          />
          <Stack.Screen
            name="EmailAuth"
            component={EmailAuthScreen}
            options={{
              animation: "slide_from_right",
              presentation: "card",
            }}
          />
          {/* Legacy Login screen kept for deep link compatibility */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: "fade" }}
          />
        </>
      )}

      {/* Stage 2: Notification Permission */}
      {shouldShowNotificationPermission && (
        <Stack.Screen
          name="NotificationPermission"
          component={NotificationPermissionScreen}
          options={{ animation: "fade" }}
        />
      )}

      {/* Stage 2.5: Nath Journey Onboarding - Stories Format */}
      {shouldShowNathJourneyOnboarding && (
        <Stack.Screen
          name="OnboardingStories"
          component={OnboardingStoriesScreen}
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />
      )}

      {/* Stage 3: Main Onboarding (name, stage, interests) - LEGACY */}
      {shouldShowOnboarding && (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: "fade" }}
        />
      )}

      {/* Stage 4: NathIA Onboarding (AI personalization) */}
      {shouldShowNathIAOnboarding && (
        <Stack.Screen
          name="NathIAOnboarding"
          component={NathIAOnboardingScreen}
          options={{ animation: "fade" }}
        />
      )}

      {/* Stage 5: Main App */}
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
