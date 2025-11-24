import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenComponent from '../screens/SplashScreen';
import LoginScreenNew from '../screens/LoginScreenNew';
import OnboardingFlowNew from '../screens/Onboarding/OnboardingFlowNew';
import RitualScreen from '../screens/RitualScreen';
import DiaryScreen from '../screens/DiaryScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  // ✅ Usar AuthContext em vez de duplicar lógica
  const { user, loading: authLoading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkOnboarding = async () => {
      try {
        // Verificar se usuário completou onboarding
        const savedUser = await AsyncStorage.getItem('nath_user');
        if (isMounted) {
          setHasCompletedOnboarding(!!savedUser);
        }
      } catch (error) {
        console.warn('[StackNavigator] Erro ao verificar onboarding:', error);
        if (isMounted) {
          setHasCompletedOnboarding(false);
        }
      } finally {
        if (isMounted) {
          setOnboardingLoading(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, []);

  // Loading enquanto verifica autenticação ou onboarding
  const loading = authLoading || onboardingLoading;

  // Aguardar tanto o loading de onboarding quanto de auth
  if (loading || authLoading) {
    return <SplashScreenComponent />;
  }

  // Determinar rota inicial baseado no estado
  // ✅ Usa user do AuthContext (já validado e gerenciado)
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (hasCompletedOnboarding && user) {
      return 'Main';
    }
    if (hasCompletedOnboarding && !user) {
      return 'Auth';
    }
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
      <Stack.Screen name="Onboarding" component={OnboardingFlowNew} />
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
    </Stack.Navigator>
  );
};

