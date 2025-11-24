import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { supabase, isSupabaseReady } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Text, View } from 'react-native';
import SplashScreenComponent from '../screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthScreen = () => (
  <View className="flex-1 items-center justify-center bg-background p-4">
    <Text className="text-xl font-semibold text-text mb-4">Tela de Login</Text>
    <Text className="text-text-light text-center">
      Implementação da tela de autenticação em breve
    </Text>
  </View>
);

const OnboardingScreen = () => (
  <View className="flex-1 items-center justify-center bg-background p-4">
    <Text className="text-xl font-semibold text-text mb-4">Onboarding</Text>
    <Text className="text-text-light text-center">
      Fluxo de onboarding com 9 steps em breve
    </Text>
  </View>
);

export const StackNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseReady()) {
      // Se Supabase não está configurado, apenas define loading como false
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.warn('Erro ao obter sessão:', error.message);
        }
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn('Erro ao carregar sessão (não crítico):', error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <SplashScreenComponent />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        // Usuário não autenticado
        <>
          <Stack.Screen name="Splash" component={SplashScreenComponent} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      ) : (
        // Usuário autenticado - vai direto para Main
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

