import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button, Logo } from '../components';
import { useTheme } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

// Manter splash screen visível enquanto carrega
SplashScreen.preventAutoHideAsync();

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreenComponent({ onComplete }: SplashScreenProps) {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Verificar se usuário já completou onboarding
    const checkOnboarding = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('nath_user');
        setHasCompletedOnboarding(!!savedUser);
      } catch (error) {
        console.warn('Erro ao verificar onboarding:', error);
        setHasCompletedOnboarding(false);
      }
    };
    checkOnboarding();

    // Esconder splash após 2 segundos
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Navegar para Auth se já completou onboarding, senão para Onboarding
      if (hasCompletedOnboarding) {
        navigation.navigate('Auth');
      } else {
        navigation.navigate('Onboarding');
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#020617' : '#F8F9FA' }
      ]}
    >
      <View style={styles.content}>
        {/* Top Title */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#F9FAFB' : '#5D4E4B' }
            ]}
          >
            Nossa{'\n'}Maternidade
          </Text>
        </View>

        {/* Center Image */}
        <View style={styles.imageContainer}>
          <View style={[
            styles.logoWrapper,
            {
              borderColor: isDark ? '#0B1220' : '#FFFFFF',
            }
          ]}>
            <Logo size={256} rounded />
          </View>
          
          {/* Quote */}
          <View style={styles.quoteContainer}>
            <Text
              style={[
                styles.quote,
                { color: isDark ? '#F9FAFB' : '#5D4E4B' }
              ]}
            >
              "Você é forte.{'\n'}Mesmo nos dias em que não parece."
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Começar com a Nath"
            onPress={handleStart}
            fullWidth
            variant="primary"
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: 48,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoWrapper: {
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quoteContainer: {
    maxWidth: 280,
  },
  quote: {
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
});

