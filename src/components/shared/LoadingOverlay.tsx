/**
 * LoadingOverlay - Overlay de carregamento fullscreen
 *
 * Componente de overlay com blur para indicar carregamento global.
 * Bloqueia interação com a UI enquanto carrega.
 *
 * @requires expo-blur
 *
 * @example
 * <LoadingOverlay
 *   visible={isLoading}
 *   message="Carregando dados..."
 * />
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { Tokens } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface LoadingOverlayProps {
  /** Se o overlay está visível */
  visible: boolean;
  /** Mensagem opcional de carregamento */
  message?: string;
  /** Intensidade do blur (0-100, padrão: 50) */
  blurIntensity?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  blurIntensity = 50,
}) => {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent // Android: overlay sobre status bar
      onRequestClose={() => {}} // Necessário no Android (mas não faz nada pois queremos bloquear)
    >
      {Platform.OS === 'web' ? (
        // Web: usar View com background semi-transparente (BlurView não funciona bem na web)
        <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.contentBox, { backgroundColor: colors.background.card }]}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            {message && (
              <Text style={[styles.message, { color: colors.text.primary }]}>
                {message}
              </Text>
            )}
          </View>
        </View>
      ) : (
        // iOS/Android: usar BlurView para efeito glassmorphic
        <BlurView
          intensity={blurIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={styles.container}
        >
          <View style={[styles.contentBox, { backgroundColor: colors.background.card }]}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            {message && (
              <Text style={[styles.message, { color: colors.text.primary }]}>
                {message}
              </Text>
            )}
          </View>
        </BlurView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fallback (web) ou adicional ao blur
  },
  contentBox: {
    borderRadius: Tokens.radius['2xl'],
    padding: Tokens.spacing['8'], // 32px
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10, // Android
  },
  message: {
    marginTop: Tokens.spacing['4'], // 16px
    fontSize: Tokens.typography.sizes.base,
    fontWeight: '600', // Semibold
    textAlign: 'center',
  },
});

export default LoadingOverlay;
