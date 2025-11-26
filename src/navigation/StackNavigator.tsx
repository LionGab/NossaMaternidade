import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../contexts/AuthContext';
import SplashScreenComponent from '../screens/SplashScreen';
import LoginScreenNew from '../screens/LoginScreenNew';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import RitualScreen from '../screens/RitualScreen';
import DiaryScreen from '../screens/DiaryScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AgentsStatusScreen from '../screens/AgentsStatusScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';
import { onboardingService } from '../services/onboardingService';
import { logger } from '../utils/logger';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  // ✅ Usar AuthContext em vez de duplicar lógica
  const { user, loading: authLoading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  useEffect(() => {
    const isMounted = { current: true };

    const checkOnboarding = async () => {
      try {
        // Verificar se usuário completou onboarding via serviço
        if (user) {
          const completed = await onboardingService.isOnboardingCompleted();
        if (isMounted.current) {
          setHasCompletedOnboarding(completed);
        }
      } else {
        if (isMounted.current) {
          setHasCompletedOnboarding(false);
        }
      }
    } catch (error) {
      logger.warn('[StackNavigator] Erro ao verificar onboarding', error);
      if (isMounted.current) {
        setHasCompletedOnboarding(false);
      }
    } finally {
      if (isMounted.current) {
          setOnboardingLoading(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      isMounted.current = false;
    };
  }, [user]);

  // Loading enquanto verifica autenticação ou onboarding
  const loading = authLoading || onboardingLoading;

  // Aguardar tanto o loading de onboarding quanto de auth
  if (loading || authLoading) {
    return <SplashScreenComponent />;
  }

  // Determinar rota inicial baseado no estado
  // ✅ Usa user do AuthContext (já validado e gerenciado)
  const getInitialRouteName = (): keyof RootStackParamList => {
    // Se usuário está logado E completou onboarding → Main
    if (user && hasCompletedOnboarding) {
      return 'Main';
    }
    // Se usuário está logado MAS NÃO completou onboarding → Onboarding
    if (user && !hasCompletedOnboarding) {
      return 'Onboarding';
    }
    // Se usuário NÃO está logado → Auth
    if (!user) {
      return 'Auth';
    }
    // Fallback → Splash
    return 'Splash';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: 'card',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreenComponent} />
      <Stack.Screen name="Auth" component={LoginScreenNew} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      {/* Modais */}
      <Stack.Screen 
        name="Ritual" 
        component={RitualScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="ContentDetail"
        component={ContentDetailScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AgentsStatus"
        component={AgentsStatusScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

