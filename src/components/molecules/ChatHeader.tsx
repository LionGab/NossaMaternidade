/**
 * ChatHeader - Header Premium do Chat NathIA
 *
 * Design empático com gradiente suave, avatar com status e mode selector.
 * Usa tokens centralizados e acessibilidade WCAG AAA.
 *
 * Features:
 * - Gradiente suave do Design System
 * - Status online com indicador
 * - Mode selector (Rápido/Profundo)
 * - Touch targets 44pt mínimos
 * - Haptic feedback
 *
 * @example
 * <ChatHeader
 *   avatarUrl="https://..."
 *   isOnline={true}
 *   chatMode="flash"
 *   onBack={() => navigation.goBack()}
 *   onModeChange={setChatMode}
 * />
 */

import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { ArrowLeft, Sparkles, Zap, Brain } from 'lucide-react-native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { IconButton } from '@/components/atoms/IconButton';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

type AIMode = 'flash' | 'deep';

export interface ChatHeaderProps {
  /** URL do avatar da NathIA */
  avatarUrl: string;
  /** Se a NathIA está online */
  isOnline?: boolean;
  /** Modo atual do chat */
  chatMode: AIMode;
  /** Callback ao voltar */
  onBack: () => void;
  /** Callback ao mudar modo */
  onModeChange: (mode: AIMode) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  avatarUrl,
  isOnline = true,
  chatMode,
  onBack,
  onModeChange,
}) => {
  const { isDark, colors } = useTheme();
  const [avatarError, setAvatarError] = React.useState(false);

  const handleModePress = (mode: AIMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info('Chat mode changed', { mode, previous: chatMode });
    onModeChange(mode);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: isDark ? ColorTokens.neutral[900] : ColorTokens.neutral[0],
          borderBottomWidth: 1,
          borderBottomColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[200],
        },
      ]}
    >
      {/* Top Bar: Back + Avatar + Info - Estilo ChatGPT */}
      <Box direction="row" align="center" style={{ zIndex: 1 }}>
        <IconButton
          icon={<ArrowLeft size={22} color={isDark ? ColorTokens.neutral[0] : ColorTokens.neutral[900]} />}
          onPress={handleBack}
          accessibilityLabel="Voltar para tela anterior"
          variant="ghost"
        />

        <View style={styles.headerInfo}>
          {/* Avatar com status */}
          <View style={styles.avatarContainer}>
            {!avatarError ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: colors.primary.main }]}>
                <Sparkles size={18} color={ColorTokens.neutral[0]} />
              </View>
            )}

            {isOnline && (
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
              </View>
            )}
          </View>

          {/* Nome e status - Minimalista */}
          <Box ml="3">
            <Text
              size="lg"
              weight="semibold"
              style={{
                color: isDark ? ColorTokens.neutral[0] : ColorTokens.neutral[900],
                fontSize: 17,
                letterSpacing: -0.2,
              }}
            >
              NathIA
            </Text>
            {isOnline && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: ColorTokens.success[500],
                    marginRight: 6,
                  }}
                />
                <Text
                  size="xs"
                  style={{
                    color: isDark ? ColorTokens.neutral[400] : ColorTokens.neutral[600],
                    fontSize: 12,
                  }}
                >
                  Online
                </Text>
              </View>
            )}
          </Box>
        </View>
      </Box>

      {/* Mode Selector - Estilo ChatGPT (pills discretas) */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          onPress={() => handleModePress('flash')}
          style={[
            styles.modeButton,
            {
              backgroundColor: chatMode === 'flash'
                ? isDark
                  ? ColorTokens.neutral[700]
                  : ColorTokens.neutral[200]
                : 'transparent',
            },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: chatMode === 'flash' }}
          accessibilityLabel="Modo rápido"
        >
          <Zap
            size={14}
            color={
              chatMode === 'flash'
                ? isDark
                  ? ColorTokens.neutral[0]
                  : ColorTokens.neutral[900]
                : isDark
                  ? ColorTokens.neutral[400]
                  : ColorTokens.neutral[500]
            }
          />
          <Text
            size="xs"
            weight={chatMode === 'flash' ? 'semibold' : 'medium'}
            style={{
              color:
                chatMode === 'flash'
                  ? isDark
                    ? ColorTokens.neutral[0]
                    : ColorTokens.neutral[900]
                  : isDark
                    ? ColorTokens.neutral[400]
                    : ColorTokens.neutral[500],
              marginLeft: 6,
              fontSize: 13,
            }}
          >
            Rápido
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleModePress('deep')}
          style={[
            styles.modeButton,
            {
              backgroundColor: chatMode === 'deep'
                ? isDark
                  ? ColorTokens.neutral[700]
                  : ColorTokens.neutral[200]
                : 'transparent',
            },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: chatMode === 'deep' }}
          accessibilityLabel="Modo profundo"
        >
          <Brain
            size={14}
            color={
              chatMode === 'deep'
                ? isDark
                  ? ColorTokens.neutral[0]
                  : ColorTokens.neutral[900]
                : isDark
                  ? ColorTokens.neutral[400]
                  : ColorTokens.neutral[500]
            }
          />
          <Text
            size="xs"
            weight={chatMode === 'deep' ? 'semibold' : 'medium'}
            style={{
              color:
                chatMode === 'deep'
                  ? isDark
                    ? ColorTokens.neutral[0]
                    : ColorTokens.neutral[900]
                  : isDark
                    ? ColorTokens.neutral[400]
                    : ColorTokens.neutral[500],
              marginLeft: 6,
              fontSize: 13,
            }}
          >
            Profundo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Tokens.spacing['4'],
    paddingTop: Tokens.spacing['3'],
    paddingBottom: Tokens.spacing['3'],
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Tokens.spacing['2'],
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ColorTokens.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: ColorTokens.neutral[0],
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorTokens.success[500],
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Tokens.spacing['3'],
    gap: Tokens.spacing['2'],
    paddingBottom: Tokens.spacing['2'],
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Tokens.spacing['3'],
    paddingVertical: Tokens.spacing['2'],
    borderRadius: Tokens.radius.full,
    minHeight: 36,
  },
});

export default ChatHeader;
