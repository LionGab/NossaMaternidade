/**
 * LoginForm - Formulário de login com validações
 *
 * Componente de formulário completo com:
 * - Validação em tempo real
 * - Animação de shake nos erros
 * - Toggle de visibilidade de senha
 * - Feedback háptico
 * - Link de recuperação de senha
 *
 * @requires lucide-react-native
 *
 * @example
 * <LoginForm
 *   email={email}
 *   password={password}
 *   onEmailChange={setEmail}
 *   onPasswordChange={setPassword}
 *   onSubmit={handleLogin}
 *   onForgotPassword={handleForgotPassword}
 *   isLoading={isLoading}
 * />
 */

import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

import { Input } from '@/components/Input';
import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Text } from '@/components/atoms/Text';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing } from '@/theme/tokens';
import { isValidEmail } from '@/utils/validation';

export interface LoginFormProps {
  /** Valor do email */
  email: string;
  /** Valor da senha */
  password: string;
  /** Callback para mudança de email */
  onEmailChange: (value: string) => void;
  /** Callback para mudança de senha */
  onPasswordChange: (value: string) => void;
  /** Callback para submit */
  onSubmit: () => void;
  /** Callback para "Esqueceu a senha?" */
  onForgotPassword: () => void;
  /** Estado de carregamento */
  isLoading?: boolean;
  /** Texto do botão */
  submitButtonText?: string;
  /** Desabilitar validação automática */
  disableValidation?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  isLoading = false,
  submitButtonText = 'Entrar',
  disableValidation = false,
}) => {
  const colors = useThemeColors();
  const haptics = useHaptics();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Animations
  const errorShakeAnim = useRef(new Animated.Value(0)).current;

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(errorShakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateEmail = (value: string): string | null => {
    if (disableValidation) return null;

    if (!value.trim()) {
      return 'E-mail é obrigatório';
    }
    if (!isValidEmail(value)) {
      return 'Digite um e-mail válido';
    }
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (disableValidation) return null;

    if (!value.trim()) {
      return 'Senha é obrigatória';
    }
    if (value.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    return null;
  };

  const handleEmailChange = (value: string) => {
    onEmailChange(value);
    if (emailTouched && !disableValidation) {
      const error = validateEmail(value);
      setEmailError(error);
      if (error) {
        haptics.light();
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    onPasswordChange(value);
    if (passwordTouched && !disableValidation) {
      const error = validatePassword(value);
      setPasswordError(error);
      if (error) {
        haptics.light();
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (!disableValidation) {
      const error = validateEmail(email);
      setEmailError(error);
      if (error) {
        shakeError();
        haptics.error();
      }
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    if (!disableValidation) {
      const error = validatePassword(password);
      setPasswordError(error);
      if (error) {
        shakeError();
        haptics.error();
      }
    }
  };

  const handleSubmit = () => {
    // Validar antes de submeter
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setEmailTouched(true);
    setPasswordTouched(true);

    if (emailErr || passwordErr) {
      shakeError();
      haptics.error();
      return;
    }

    onSubmit();
  };

  // Limpar erros quando isLoading muda para false (após submit)
  useEffect(() => {
    if (!isLoading) {
      // Mantém os erros se houver, mas reseta touched se sucesso
      // (deixa a lógica de sucesso para o parent)
    }
  }, [isLoading]);

  const errorShakeStyle = {
    transform: [{ translateX: errorShakeAnim }],
  };

  return (
    <>
      <Animated.View style={errorShakeStyle}>
        {/* Email Input */}
        <Input
          label="E-MAIL"
          placeholder="exemplo@email.com"
          value={email}
          onChangeText={handleEmailChange}
          onBlur={handleEmailBlur}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
          leftIcon={
            <Mail size={18} color={emailError ? colors.status.error : colors.text.tertiary} />
          }
          error={emailError || undefined}
          disabled={isLoading}
          containerStyle={{ marginBottom: Spacing['4'] }}
          accessibilityLabel="Campo de e-mail"
          accessibilityHint="Digite seu endereço de e-mail"
        />

        {/* Password Input */}
        <Input
          label="SENHA"
          placeholder="••••••••"
          value={password}
          onChangeText={handlePasswordChange}
          onBlur={handlePasswordBlur}
          secureTextEntry={!showPassword}
          autoComplete="password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          leftIcon={
            <Lock
              size={18}
              color={passwordError ? colors.status.error : colors.text.tertiary}
            />
          }
          rightIcon={
            <HapticButton
              variant="ghost"
              size="sm"
              onPress={() => {
                setShowPassword(!showPassword);
                haptics.light();
              }}
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              accessibilityHint="Alterna a visibilidade da senha"
              style={{ padding: 4 }}
            >
              {showPassword ? (
                <EyeOff size={18} color={colors.text.tertiary} />
              ) : (
                <Eye size={18} color={colors.text.tertiary} />
              )}
            </HapticButton>
          }
          error={passwordError || undefined}
          disabled={isLoading}
          containerStyle={{ marginBottom: Spacing['2'] }}
          accessibilityLabel="Campo de senha"
          accessibilityHint="Digite sua senha"
        />
      </Animated.View>

      {/* Forgot Password Link */}
      <Box className="items-end mb-6">
        <HapticButton
          variant="ghost"
          size="sm"
          onPress={onForgotPassword}
          accessibilityLabel="Esqueceu a senha"
          accessibilityHint="Abre diálogo para recuperar senha"
        >
          <Text className="text-xs font-semibold text-link underline">
            Esqueceu a senha?
          </Text>
        </HapticButton>
      </Box>

      {/* Submit Button */}
      <Button
        title={isLoading ? 'Entrando...' : submitButtonText}
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        className="bg-primary rounded-xl px-6 py-4 w-full mb-6"
        textClassName="text-white font-semibold text-lg"
        accessibilityLabel={submitButtonText}
        accessibilityHint="Faz login com e-mail e senha"
      />
    </>
  );
};

export default LoginForm;
