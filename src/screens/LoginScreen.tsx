/**
 * LoginScreen - Tela de Login Modular e Moderna
 *
 * Design System completo com:
 * - Componentes modulares reutilizáveis
 * - Validação visual em tempo real
 * - Animações suaves
 * - Feedback háptico
 * - Dark mode completo
 * - Acessibilidade WCAG AAA
 *
 * @version 3.0.0
 * @date 2025-12-10
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useRef } from 'react';
import {
  ScrollView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Text } from '@/components/atoms/Text';
import { LoginHeader } from '@/components/login/LoginHeader';
import { LoginForm } from '@/components/login/LoginForm';
import { SocialLoginButtons } from '@/components/login/SocialLoginButtons';
import { TestCredentialsCard } from '@/components/login/TestCredentialsCard';
import { useHaptics } from '@/hooks/useHaptics';
import type { RootStackParamList } from '@/navigation/types';
import { authService, profileService } from '@/services';
import { useTheme } from '@/theme/ThemeContext';
import { Spacing } from '@/theme/tokens';
import { logger } from '@/utils/logger';

interface LoginScreenProps {
  onLogin?: () => void;
  onBack?: () => void;
}

export default function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark, toggleTheme, colors } = useTheme();
  const haptics = useHaptics();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login social configurável via variável de ambiente
  const SOCIAL_LOGIN_ENABLED = process.env.EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED !== 'false';

  const handleLogin = async () => {
    setIsLoading(true);
    haptics.light();

    try {
      logger.info('[LoginScreen] Tentando fazer login', { email });

      const { user, session, error } = await authService.signIn({
        email: email.trim(),
        password,
      });

      if (error) {
        logger.error('[LoginScreen] Erro no login', error);
        haptics.error();

        // Mensagens de erro mais amigáveis
        let errorMessage = 'Não foi possível fazer login. Tente novamente.';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'E-mail ou senha incorretos. Verifique e tente novamente.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu e-mail antes de fazer login.';
        }

        Alert.alert('Erro no login', errorMessage);
        return;
      }

      if (user && session) {
        logger.info('[LoginScreen] Login realizado com sucesso', { userId: user.id });
        haptics.success();

        // Verificar se usuário já completou onboarding
        const profile = await profileService.getCurrentProfile();

        if (onLogin) {
          onLogin();
        } else if (profile?.onboarding_completed) {
          navigation.navigate('Main' as never);
        } else {
          navigation.navigate('Onboarding' as never);
        }
      }
    } catch (error) {
      logger.error('[LoginScreen] Erro inesperado no login', error);
      haptics.error();
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    // Verificar se login social está habilitado
    if (!SOCIAL_LOGIN_ENABLED) {
      haptics.warning();
      Alert.alert(
        'Em breve! 🚀',
        `O login com ${provider === 'apple' ? 'Apple' : 'Google'} estará disponível em breve.\n\nPor enquanto, use email e senha para entrar.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setIsLoading(true);
    haptics.light();

    try {
      logger.info(`[LoginScreen] Tentando login com ${provider}`);

      const result =
        provider === 'apple'
          ? await authService.signInWithApple()
          : await authService.signInWithGoogle();

      if (result.error) {
        logger.error(`[LoginScreen] Erro no login ${provider}`, result.error);
        haptics.error();
        Alert.alert(
          'Erro no login',
          `Não foi possível fazer login com ${provider === 'apple' ? 'Apple' : 'Google'}. Tente novamente.`
        );
        return;
      }

      // OAuth redireciona para callback, então não navegamos aqui
      haptics.success();
      logger.info(`[LoginScreen] Redirecionando para ${provider} OAuth`);
    } catch (error) {
      logger.error(`[LoginScreen] Erro inesperado no login ${provider}`, error);
      haptics.error();
      Alert.alert(
        'Erro',
        `Ocorreu um erro ao fazer login com ${provider === 'apple' ? 'Apple' : 'Google'}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        'E-mail necessário',
        'Por favor, digite seu e-mail no campo acima para recuperar sua senha.'
      );
      return;
    }

    haptics.light();

    try {
      logger.info('[LoginScreen] Solicitando recuperação de senha', { email });

      const { error } = await authService.resetPassword(email.trim());

      if (error) {
        logger.error('[LoginScreen] Erro ao resetar senha', error);
        haptics.error();
        Alert.alert(
          'Erro',
          'Não foi possível enviar o e-mail de recuperação. Verifique seu e-mail e tente novamente.'
        );
        return;
      }

      haptics.success();
      Alert.alert(
        'E-mail enviado!',
        'Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada.'
      );
    } catch (error) {
      logger.error('[LoginScreen] Erro inesperado ao resetar senha', error);
      haptics.error();
      Alert.alert('Erro', 'Ocorreu um erro ao solicitar recuperação de senha.');
    }
  };

  const handleSignUp = () => {
    haptics.light();
    navigation.navigate('Onboarding');
  };

  const handleBack = () => {
    haptics.light();
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleAutoFill = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    haptics.success();
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: Spacing['6'],
            paddingBottom: Spacing['10'],
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={animatedStyle}>
            {/* Header (Logo + Title + Nav) */}
            <LoginHeader
              onBack={handleBack}
              onToggleTheme={toggleTheme}
              isDark={isDark}
            />

            {/* Test Credentials Card (apenas em __DEV__) */}
            <TestCredentialsCard
              email="teste@exemplo.com"
              password="123456"
              onAutoFill={handleAutoFill}
              visible={__DEV__}
            />

            {/* Login Form */}
            <LoginForm
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
              onForgotPassword={handleForgotPassword}
              isLoading={isLoading}
            />

            {/* Social Login */}
            <SocialLoginButtons
              onApplePress={() => handleSocialLogin('apple')}
              onGooglePress={() => handleSocialLogin('google')}
              isEnabled={SOCIAL_LOGIN_ENABLED}
              isLoading={isLoading}
            />

            {/* Sign Up Link */}
            <Box align="center">
              <HapticButton
                variant="ghost"
                size="sm"
                onPress={handleSignUp}
                accessibilityLabel="Criar conta"
                accessibilityHint="Navega para tela de cadastro"
              >
                <Text size="xs" color="tertiary" align="center">
                  Ainda não tem conta?{' '}
                  <Text
                    size="xs"
                    weight="bold"
                    color="link"
                    style={{ textDecorationLine: 'underline' }}
                  >
                    Criar agora
                  </Text>
                </Text>
              </HapticButton>
            </Box>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
