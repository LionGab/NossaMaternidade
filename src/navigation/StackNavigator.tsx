import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { supabase, isSupabaseReady } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenComponent from '../screens/SplashScreen';
import LoginScreenNew from '../screens/LoginScreenNew';
import OnboardingFlowNew from '../screens/Onboarding/OnboardingFlowNew';
import RitualScreen from '../screens/RitualScreen';
import DiaryScreen from '../screens/DiaryScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    let authSubscription: any = null;
    let isMounted = true;

    const initialize = async () => {
      try {
        // 1. Verificar se usuário completou onboarding (crítico para roteamento)
        // Aguardar a verificação antes de continuar para evitar race condition
        try {
          const savedUser = await AsyncStorage.getItem('nath_user');
          if (isMounted) {
            setHasCompletedOnboarding(!!savedUser);
          }
        } catch (error) {
          console.warn('Erro ao verificar onboarding:', error);
          if (isMounted) {
            setHasCompletedOnboarding(false);
          }
        }

        // 2. Se Supabase não estiver configurado, finalizar loading
        if (!isSupabaseReady()) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        // 3. Obter sessão inicial (aguardar antes de continuar)
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Erro ao obter sessão:', error.message);
          }
          if (isMounted) {
            setUser(session?.user ?? null);
          }
        } catch (error) {
          console.warn('Erro ao carregar sessão (não crítico):', error);
        }

        // 4. Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (isMounted) {
              setUser(session?.user ?? null);
            }
          }
        );
        authSubscription = subscription;
      } finally {
        // Sempre finalizar loading após todas as verificações
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    // Cleanup: cancelar subscription ao desmontar
    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <SplashScreenComponent />;
  }

  // Determinar rota inicial baseado no estado
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
    </Stack.Navigator>
  );
};

