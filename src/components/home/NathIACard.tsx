/**
 * NathIACard - Card principal da NathIA
 *
 * Componente de card com avatar da NathIA e botões de interação.
 * Permite iniciar conversa por áudio ou texto.
 *
 * @requires expo-linear-gradient
 * @requires expo-image
 * @requires lucide-react-native
 *
 * @example
 * <NathIACard
 *   onAudioPress={() => navigation.navigate('Chat', { startRecording: true })}
 *   onTextPress={() => navigation.navigate('Chat')}
 *   lastConversation="Ontem às 14:30"
 * />
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Mic, MessageCircle, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Heading } from '@/components/atoms/Heading';
import { HapticButton } from '@/components/atoms/HapticButton';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius, ColorTokens } from '@/theme/tokens';
import { getShadowFromToken } from '@/utils/shadowHelper';

export interface NathIACardProps {
  /** Callback para botão de áudio */
  onAudioPress: () => void;
  /** Callback para botão de texto */
  onTextPress: () => void;
  /** Callback para ver última conversa */
  onViewLastConversation?: () => void;
  /** Texto da última conversa (ex: "Ontem às 14:30") */
  lastConversation?: string;
  /** URL do avatar da NathIA */
  avatarUrl?: string;
  /** Nome da IA */
  aiName?: string;
  /** Descrição curta */
  description?: string;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
}

export const NathIACard: React.FC<NathIACardProps> = ({
  onAudioPress,
  onTextPress,
  onViewLastConversation,
  lastConversation,
  avatarUrl = 'https://i.imgur.com/GDYdiuy.jpg',
  aiName = 'NathIA',
  description = 'Sua bestie de bolso, sempre pronta pra te ouvir',
  disableHaptic = false,
}) => {
  const colors = useThemeColors();

  const handleAudioPress = () => {
    if (!disableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onAudioPress();
  };

  const handleTextPress = () => {
    if (!disableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onTextPress();
  };

  const handleLastConversationPress = () => {
    if (!disableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onViewLastConversation?.();
  };

  return (
    <Box style={{ marginBottom: Spacing['6'], paddingHorizontal: Spacing['6'] }}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.card,
            ...getShadowFromToken('lg', colors.text.primary),
          },
        ]}
      >
        {/* Header com Avatar */}
        <View style={styles.header}>
          {/* Avatar com gradiente border */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[ColorTokens.primary[500], ColorTokens.secondary[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradientBorder}
            >
              <View
                style={[
                  styles.avatarInner,
                  {
                    backgroundColor: colors.background.card,
                  },
                ]}
              >
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                  accessibilityLabel={`Avatar da ${aiName}`}
                />
              </View>
            </LinearGradient>
          </View>

          {/* Título e Descrição */}
          <View style={styles.headerText}>
            <Heading level="h4" weight="bold">
              {aiName}
            </Heading>
            <Text size="xs" color="secondary" style={{ marginTop: Spacing['1'] }}>
              {description}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          {/* Botão Áudio */}
          <HapticButton
            variant="ghost"
            onPress={handleAudioPress}
            style={[
              styles.actionButton,
              {
                backgroundColor: ColorTokens.primary[50],
              },
            ]}
            accessibilityLabel="Iniciar conversa por áudio"
            accessibilityHint="Abre o chat com gravação de áudio ativada"
          >
            <View style={styles.actionButtonContent}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: ColorTokens.primary[500],
                  },
                ]}
              >
                <Mic size={18} color="#FFFFFF" />
              </View>
              <Text size="sm" weight="semibold" style={{ color: ColorTokens.primary[700] }}>
                Áudio
              </Text>
            </View>
          </HapticButton>

          {/* Botão Texto */}
          <HapticButton
            variant="ghost"
            onPress={handleTextPress}
            style={[
              styles.actionButton,
              {
                backgroundColor: ColorTokens.secondary[50],
              },
            ]}
            accessibilityLabel="Iniciar conversa por texto"
            accessibilityHint="Abre o chat para digitar mensagem"
          >
            <View style={styles.actionButtonContent}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: ColorTokens.secondary[500],
                  },
                ]}
              >
                <MessageCircle size={18} color="#FFFFFF" />
              </View>
              <Text size="sm" weight="semibold" style={{ color: ColorTokens.secondary[700] }}>
                Texto
              </Text>
            </View>
          </HapticButton>
        </View>

        {/* Última Conversa (se houver) */}
        {lastConversation && onViewLastConversation && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLastConversationPress}
            style={[
              styles.lastConversation,
              {
                backgroundColor: colors.background.canvas,
                borderColor: colors.border.light,
              },
            ]}
            accessibilityLabel="Ver última conversa"
            accessibilityHint={`Última conversa: ${lastConversation}`}
          >
            <View style={{ flex: 1 }}>
              <Text size="xs" weight="semibold" color="tertiary" style={{ marginBottom: 2 }}>
                ÚLTIMA CONVERSA
              </Text>
              <Text size="xs" weight="medium" color="secondary">
                {lastConversation}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius['2xl'],
    padding: Spacing['6'],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['5'],
  },
  avatarContainer: {
    marginRight: Spacing['4'],
  },
  avatarGradientBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3, // Border width
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerText: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing['3'],
    marginBottom: Spacing['4'],
  },
  actionButton: {
    flex: 1,
    borderRadius: Radius.xl,
    paddingVertical: Spacing['4'],
    paddingHorizontal: Spacing['3'],
    minHeight: 56, // Touch target
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2'],
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastConversation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing['3'],
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});

export default NathIACard;
