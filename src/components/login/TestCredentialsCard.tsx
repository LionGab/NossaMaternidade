/**
 * TestCredentialsCard - Card com credenciais de teste
 *
 * Componente helper para desenvolvimento que exibe credenciais de teste.
 * Facilita o login durante demos e testes.
 *
 * @requires lucide-react-native
 *
 * @example
 * <TestCredentialsCard
 *   email="teste@exemplo.com"
 *   password="senha123"
 *   onAutoFill={(email, password) => {
 *     setEmail(email);
 *     setPassword(password);
 *   }}
 * />
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Info, Copy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';

export interface TestCredentialsCardProps {
  /** Email de teste */
  email?: string;
  /** Senha de teste */
  password?: string;
  /** Callback para preencher automaticamente */
  onAutoFill?: (email: string, password: string) => void;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Mostrar card (condicional, ex: __DEV__) */
  visible?: boolean;
}

export const TestCredentialsCard: React.FC<TestCredentialsCardProps> = ({
  email = 'teste@exemplo.com',
  password = '123456',
  onAutoFill,
  disableHaptic = false,
  visible = __DEV__,
}) => {
  const colors = useThemeColors();

  if (!visible) return null;

  const handleAutoFill = () => {
    if (!disableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAutoFill?.(email, password);
  };

  return (
    <TouchableOpacity
      activeOpacity={onAutoFill ? 0.7 : 1}
      onPress={handleAutoFill}
      disabled={!onAutoFill}
      style={[
        styles.container,
        {
          backgroundColor: colors.status.warning + '15', // 15% opacity
          borderColor: colors.status.warning + '40', // 40% opacity
        },
      ]}
      accessibilityLabel="Card com credenciais de teste"
      accessibilityHint={
        onAutoFill ? 'Toque para preencher automaticamente' : undefined
      }
    >
      <View style={styles.header}>
        <Info size={16} color={colors.status.warning} />
        <Text
          size="xs"
          weight="bold"
          style={{ ...styles.title, color: colors.status.warning }}
        >
          CREDENCIAIS DE TESTE
        </Text>
        {onAutoFill && (
          <Copy size={14} color={colors.status.warning} style={{ opacity: 0.7 }} />
        )}
      </View>

      <Box className="mt-2">
        <View style={styles.row}>
          <Text size="xs" weight="semibold" color="secondary">
            Email:{' '}
          </Text>
          <Text size="xs" style={{ fontFamily: 'monospace' }}>
            {email}
          </Text>
        </View>
        <View style={styles.row}>
          <Text size="xs" weight="semibold" color="secondary">
            Senha:{' '}
          </Text>
          <Text size="xs" style={{ fontFamily: 'monospace' }}>
            {password}
          </Text>
        </View>
      </Box>

      {onAutoFill && (
        <Text
          size="xs"
          color="tertiary"
          style={{ marginTop: Spacing['2'], fontStyle: 'italic' }}
        >
          Toque para preencher automaticamente
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    padding: Spacing['4'],
    borderWidth: 1,
    marginBottom: Spacing['4'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  title: {
    flex: 1,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing['1'],
  },
});

export default TestCredentialsCard;
