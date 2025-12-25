/**
 * Nossa Maternidade - Root Navigator
 * 4-stage authentication flow (simplified):
 * 1. !isAuthenticated → Login (AuthLanding + EmailAuth)
 * 2. !notificationSetup → NotificationPermissionScreen
 * 3. !nathJourneyOnboarding → Nath Journey Onboarding (9 modular screens)
 * 4. Authenticated → MainTabs + Modal Screens
 *
 * Uses flowResolver for deterministic navigation decisions (no polling).
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  isDevBypassActive,
  isLoginBypassActive,
  isNotificationBypassActive,
  isOnboardingBypassActive
} from "../config/dev-bypass";
import { useNotificationSetup } from "../hooks/useNotificationSetup";
import { useAppStore } from "../state/store";
import { COLORS } from "../theme/tokens";
import { RootStackParamList } from "../types/navigation";
import { resolveNavigationFlags, FlowState } from "./flowResolver";

// Auth Screens
import { AuthLandingScreen, EmailAuthScreen } from "../screens/auth";
import LoginScreen from "../screens/LoginScreenRedesign";
import NotificationPermissionScreen from "../screens/NotificationPermissionScreen";

// Nath Journey Onboarding - Modular Screens (9 screens)
import OnboardingWelcome from "../screens/onboarding/OnboardingWelcome";
import OnboardingStage from "../screens/onboarding/OnboardingStage";
import OnboardingDate from "../screens/onboarding/OnboardingDate";
import OnboardingConcerns from "../screens/onboarding/OnboardingConcerns";
import OnboardingEmotionalState from "../screens/onboarding/OnboardingEmotionalState";
import OnboardingCheckIn from "../screens/onboarding/OnboardingCheckIn";
import OnboardingSeason from "../screens/onboarding/OnboardingSeason";
import OnboardingSummary from "../screens/onboarding/OnboardingSummary";
import OnboardingPaywall from "../screens/onboarding/OnboardingPaywall";
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
import Paywall from "../screens/PaywallScreenRedesign";
import RestSoundsScreen from "../screens/RestSoundsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // App state (reactive - triggers re-render on change)
  const isAuthenticatedFromStore = useAppStore((s) => s.isAuthenticated);

  // Nath Journey onboarding state (reactive) - this is the ONLY onboarding now
  const isNathJourneyOnboardingCompleteFromStore = useNathJourneyOnboardingStore(
    (s: { isComplete: boolean }) => s.isComplete
  );

  // Notification permission state (reactive - no polling needed)
  const { isSetupDone: notificationSetupDoneFromHook } = useNotificationSetup();

  // Loading state while checking notification permission
  if (notificationSetupDoneFromHook === null) {
    return null;
  }

  // Apply granular dev bypasses for testing
  const isAuthenticated = isAuthenticatedFromStore || isLoginBypassActive();
  const notificationSetupDone = notificationSetupDoneFromHook || isNotificationBypassActive();
  const isNathJourneyOnboardingComplete = isNathJourneyOnboardingCompleteFromStore || isOnboardingBypassActive();

  // Build flow state for resolver (simplified - no more legacy onboarding or NathIA)
  const flowState: FlowState = {
    isAuthenticated,
    notificationSetupDone,
    isNathJourneyOnboardingComplete,
    // These are now always true since we removed the duplicates
    isOnboardingComplete: true,
    isNathIAOnboardingComplete: true,
  };

  // Use flowResolver for deterministic navigation (no polling, no race conditions)
  const {
    shouldShowLogin,
    shouldShowNotificationPermission,
    shouldShowNathJourneyOnboarding,
    shouldShowMainApp,
  } = resolveNavigationFlags(flowState, isDevBypassActive());

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

      {/* Stage 3: Nath Journey Onboarding - 9 Modular Screens */}
      {shouldShowNathJourneyOnboarding && (
        <>
          <Stack.Screen
            name="OnboardingWelcome"
            component={OnboardingWelcome}
            options={{ animation: "fade", gestureEnabled: false }}
          />
          <Stack.Screen
            name="OnboardingStage"
            component={OnboardingStage}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingDate"
            component={OnboardingDate}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingConcerns"
            component={OnboardingConcerns}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingEmotionalState"
            component={OnboardingEmotionalState}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingCheckIn"
            component={OnboardingCheckIn}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingSeason"
            component={OnboardingSeason}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingSummary"
            component={OnboardingSummary}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingPaywall"
            component={OnboardingPaywall}
            options={{ animation: "slide_from_right", gestureEnabled: false }}
          />
        </>
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
