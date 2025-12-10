/**
 * LoginHeader - Header do Login com logo e navegação
 *
 * Componente de header para tela de login com:
 * - Logo circular com borda
 * - Título e subtítulo
 * - Botões de navegação (voltar + toggle theme)
 *
 * @requires expo-image
 * @requires lucide-react-native
 *
 * @example
 * <LoginHeader
 *   onBack={() => navigation.goBack()}
 *   onToggleTheme={() => toggleTheme()}
 *   isDark={isDark}
 * />
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, Sun, Moon } from 'lucide-react-native';

import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';
import { getShadowFromToken } from '@/utils/shadowHelper';

export interface LoginHeaderProps {
  /** Callback para botão voltar */
  onBack: () => void;
  /** Callback para toggle de tema */
  onToggleTheme: () => void;
  /** Se está em modo escuro */
  isDark: boolean;
  /** URL da logo (default: logo padrão) */
  logoUrl?: string;
  /** Título principal */
  title?: string;
  /** Subtítulo */
  subtitle?: string;
  /** Desabilitar botão de voltar */
  hideBackButton?: boolean;
  /** Desabilitar botão de tema */
  hideThemeButton?: boolean;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  onBack,
  onToggleTheme,
  isDark,
  logoUrl = 'https://i.imgur.com/GDYdiuy.jpg',
  title = 'Bem-vinda de volta',
  subtitle = 'Entre para acessar seu espaço seguro.',
  hideBackButton = false,
  hideThemeButton = false,
}) => {
  const colors = useThemeColors();

  return (
    <>
      {/* Top Navigation */}
      <Box className="flex-row justify-between items-center mb-8">
        {!hideBackButton ? (
          <HapticButton
            variant="ghost"
            size="sm"
            onPress={onBack}
            accessibilityLabel="Voltar"
            accessibilityHint="Retorna para a tela anterior"
            style={[
              styles.navButton,
              {
                backgroundColor: colors.background.card,
                ...getShadowFromToken('md', colors.text.primary),
              },
            ]}
          >
            <ChevronLeft size={22} color={colors.text.primary} />
          </HapticButton>
        ) : (
          <View style={styles.navButton} />
        )}

        {!hideThemeButton ? (
          <HapticButton
            variant="ghost"
            size="sm"
            onPress={onToggleTheme}
            accessibilityLabel={
              isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'
            }
            accessibilityHint="Muda o tema entre claro e escuro"
            style={[
              styles.navButton,
              {
                backgroundColor: colors.background.card,
                borderWidth: 1,
                borderColor: colors.border.light,
                ...getShadowFromToken('md', colors.text.primary),
              },
            ]}
          >
            {isDark ? (
              <Sun size={20} color={colors.text.primary} />
            ) : (
              <Moon size={20} color={colors.text.primary} />
            )}
          </HapticButton>
        ) : (
          <View style={styles.navButton} />
        )}
      </Box>

      {/* Logo + Title + Subtitle */}
      <Box className="items-center mb-10">
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: isDark ? colors.background.card : colors.primary.light,
              borderColor: isDark ? colors.border.dark : colors.background.card,
              ...getShadowFromToken(
                'xl',
                isDark ? colors.background.canvas : colors.primary.main
              ),
            },
          ]}
        >
          <Image
            source={{ uri: logoUrl }}
            style={styles.logoImage}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Logo do aplicativo"
          />
        </View>

        <Box className="mb-1 items-center">
          <Heading level="h3" weight="bold" align="center">
            {title}
          </Heading>
        </Box>

        <Text
          className="text-sm text-center text-text-secondary"
          style={{ maxWidth: '80%' }}
        >
          {subtitle}
        </Text>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  navButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: Spacing['4'],
    borderWidth: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

export default LoginHeader;
