import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Logo } from '../components';
import { Colors } from '../constants/Colors';
import * as SplashScreen from 'expo-splash-screen';

// Manter splash screen visível enquanto carrega
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  useEffect(() => {
    // Esconder splash após 2 segundos
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: Colors.background.dark }}
    >
      <View className="items-center px-8">
        {/* Logo Principal - Mãe segurando bebê dormindo */}
        <Logo size={280} rounded />

        {/* Title */}
        <Text
          className="text-3xl font-bold text-center mb-4"
          style={{ color: Colors.text.primary }}
        >
          Nossa Maternidade
        </Text>

        {/* Quote */}
        <Text
          className="text-base italic text-center mb-8"
          style={{ color: Colors.text.secondary }}
        >
          "Você é forte. Mesmo nos dias em que não parece."
        </Text>

        {/* Button */}
        <Button
          title="Começar com a Nath"
          onPress={() => {
            // Navegação será adicionada
          }}
          fullWidth
          className="mt-4"
        />
      </View>
    </SafeAreaView>
  );
}

