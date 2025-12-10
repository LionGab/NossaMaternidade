/**
 * SocialLoginButtons - Botões de login social
 *
 * Componente com botões de OAuth para Apple e Google.
 * Suporta estado "em breve" se login social não estiver habilitado.
 *
 * @requires lucide-react-native
 *
 * @example
 * <SocialLoginButtons
 *   onApplePress={() => handleSocialLogin('apple')}
 *   onGooglePress={() => handleSocialLogin('google')}
 *   isEnabled={SOCIAL_LOGIN_ENABLED}
 *   isLoading={isLoading}
 * />
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Apple } from 'lucide-react-native';

import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';

export interface SocialLoginButtonsProps {
  /** Callback para login com Apple */
  onApplePress: () => void;
  /** Callback para login com Google */
  onGooglePress: () => void;
  /** Se login social está habilitado */
  isEnabled?: boolean;
  /** Estado de carregamento */
  isLoading?: boolean;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Mostrar divider "Ou continue com" */
  showDivider?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onApplePress,
  onGooglePress,
  isEnabled = true,
  isLoading = false,
  showDivider = true,
}) => {
  const colors = useThemeColors();

  return (
    <>
      {/* Divider */}
      {showDivider && (
        <Box className="flex-row items-center mb-6">
          <View
            style={[
              styles.dividerLine,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />
          <Text
            className="text-xs font-semibold text-text-tertiary uppercase"
            style={styles.dividerText}
          >
            Ou continue com
          </Text>
          <View
            style={[
              styles.dividerLine,
              {
                backgroundColor: colors.border.light,
              },
            ]}
          />
        </Box>
      )}

      {/* Social Login Buttons */}
      <Box className="mb-6">
        {/* Apple Button */}
        <HapticButton
          variant="outline"
          size="lg"
          onPress={onApplePress}
          disabled={isLoading}
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.background.card,
              borderColor: colors.border.light,
              opacity: isEnabled ? 1 : 0.6,
            },
          ]}
          accessibilityLabel={
            isEnabled ? 'Continuar com Apple' : 'Login com Apple em breve'
          }
          accessibilityHint={
            isEnabled
              ? 'Faz login usando sua conta Apple'
              : 'Este recurso estará disponível em breve'
          }
        >
          <Apple
            size={20}
            color={colors.text.primary}
            style={{ marginRight: Spacing['2'] }}
          />
          <Text className="text-base font-semibold text-primary">
            {isEnabled ? 'Continuar com Apple' : 'Apple (em breve)'}
          </Text>
        </HapticButton>

        {/* Google Button */}
        <HapticButton
          variant="outline"
          size="lg"
          onPress={onGooglePress}
          disabled={isLoading}
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.background.card,
              borderColor: colors.border.light,
              opacity: isEnabled ? 1 : 0.6,
              marginTop: Spacing['3'],
            },
          ]}
          accessibilityLabel={
            isEnabled ? 'Continuar com Google' : 'Login com Google em breve'
          }
          accessibilityHint={
            isEnabled
              ? 'Faz login usando sua conta Google'
              : 'Este recurso estará disponível em breve'
          }
        >
          {/* Google Icon Placeholder (círculo colorido) */}
          <View
            style={[
              styles.googleIcon,
              {
                backgroundColor: colors.primary.main,
              },
            ]}
          />
          <Text className="text-base font-semibold text-primary">
            {isEnabled ? 'Continuar com Google' : 'Google (em breve)'}
          </Text>
        </HapticButton>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  dividerLine: {
    height: 1,
    flex: 1,
  },
  dividerText: {
    letterSpacing: 2,
    marginHorizontal: Spacing['4'],
  },
  socialButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4'],
    borderRadius: Radius.lg,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: Spacing['2'],
  },
});

export default SocialLoginButtons;
