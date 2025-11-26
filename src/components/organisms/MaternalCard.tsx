/**
 * MaternalCard - Componente unificado para todos os cards do app
 *
 * Substitui 8+ componentes de cards diferentes por um único componente
 * com 5 variants: hero | insight | action | progress | content
 *
 * Design maternal: calm, acolhedor, low cognitive load
 */

import React, { memo } from 'react';
import { ViewStyle, ImageBackground, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { HapticButton } from '@/components/primitives/HapticButton';
import { ProgressIndicator } from '@/components/primitives/ProgressIndicator';
import { Spacing, Radius, Shadows } from '@/theme/tokens';
import { useThemeColors } from '@/theme';

// ======================
// 🎨 TYPES
// ======================

export type MaternalCardVariant = 'hero' | 'insight' | 'action' | 'progress' | 'content';
export type MaternalCardSize = 'sm' | 'md' | 'lg' | 'xl';
export type MaternalCardEmotion = 'calm' | 'warm' | 'energetic' | 'peaceful' | 'safe';

export interface MaternalCardProps {
  // Core props
  variant: MaternalCardVariant;
  title: string;
  accessibilityLabel: string;

  // Optional common props
  subtitle?: string;
  icon?: React.ReactNode;
  image?: string;
  size?: MaternalCardSize;
  onPress?: () => void;

  // Variant-specific props
  emotion?: MaternalCardEmotion;      // hero, insight
  badge?: string;                      // content
  progress?: number;                   // progress (0-100)
  streak?: number;                     // progress (dias consecutivos)
  isCompleted?: boolean;               // progress

  // Style override
  style?: ViewStyle;
}

// ======================
// 📐 SIZE MAPPINGS
// ======================

const SIZE_CONFIG: Record<MaternalCardSize, { height: number; padding: keyof typeof Spacing }> = {
  sm: { height: 120, padding: '3' },
  md: { height: 180, padding: '4' },
  lg: { height: 220, padding: '4' },
  xl: { height: 280, padding: '5' },
};

// ======================
// 🎨 EMOTION MAPPINGS
// ======================

const EMOTION_GRADIENTS: Record<MaternalCardEmotion, readonly string[]> = {
  calm: ['#0B1220', '#1D2843'],      // Azul noite suave (dark mode) - REDESIGN: era azul saturado neon
  warm: ['#FFE2EC', '#FFC4D9'],      // Rosa leitoso, milky pink - REDESIGN: era rosa coral saturado
  energetic: ['#FFD4A3', '#FFAB70'], // Laranja pastel - REDESIGN: mais suave
  peaceful: ['#B4E7CE', '#8ED7B5'],  // Verde menta suave - REDESIGN: card de sono
  safe: ['#A5D6FF', '#7CB8FF'],      // Azul céu suave - REDESIGN: menos saturado
};

// ======================
// 🧩 MAIN COMPONENT
// ======================

function MaternalCardComponent({
  variant,
  title,
  subtitle,
  icon,
  image,
  badge,
  emotion = 'calm',
  progress,
  streak,
  isCompleted,
  size = 'md',
  onPress,
  accessibilityLabel,
  style,
}: MaternalCardProps) {
  const colors = useThemeColors();
  const sizeConfig = SIZE_CONFIG[size];

  // ======================
  // 🎯 VARIANT RENDERERS
  // ======================

  const renderHero = () => {
    const gradient = EMOTION_GRADIENTS[emotion];

    return (
      <HapticButton
        variant="primary"
        size="lg"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={StyleSheet.flatten([
          {
            height: sizeConfig.height,
            borderRadius: Radius['3xl'],
            overflow: 'hidden',
            ...Shadows.lg,
          },
          style,
        ])}
      >
        <LinearGradient
          colors={[gradient[0], gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            padding: Spacing[sizeConfig.padding],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon && <Box style={{ marginBottom: Spacing['3'] }}>{icon}</Box>}

          <Heading level="h3" color="inverse" align="center">
            {title}
          </Heading>

          {subtitle && (
            <Text color="inverse" align="center" style={{ marginTop: Spacing['2'], opacity: 0.9 }}>
              {subtitle}
            </Text>
          )}
        </LinearGradient>
      </HapticButton>
    );
  };

  const renderInsight = () => {
    return (
      <HapticButton
        variant="outline"
        size="md"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={StyleSheet.flatten([
          {
            height: sizeConfig.height,
            borderRadius: Radius['2xl'],
            backgroundColor: colors.background.card,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',  // REDESIGN: borda sutil, não neon
            ...Shadows.sm,  // REDESIGN: shadow mais suave (era md)
          },
          style,
        ])}
      >
        <Box
          style={{
            flex: 1,
            padding: Spacing[sizeConfig.padding],
            justifyContent: 'center',
          }}
        >
          {icon && <Box style={{ marginBottom: Spacing['2'] }}>{icon}</Box>}

          <Heading level="h4" color="primary">
            {title}
          </Heading>

          {subtitle && (
            <Text color="secondary" size="sm" style={{ marginTop: Spacing['2'] }}>
              {subtitle}
            </Text>
          )}
        </Box>
      </HapticButton>
    );
  };

  const renderAction = () => {
    return (
      <HapticButton
        variant="ghost"
        size="sm"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={StyleSheet.flatten([
          {
            height: sizeConfig.height,
            borderRadius: Radius.xl,
            backgroundColor: colors.background.elevated,
            ...Shadows.sm,
          },
          style,
        ])}
      >
        <Box
          style={{
            flex: 1,
            padding: Spacing[sizeConfig.padding],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon && <Box style={{ marginBottom: Spacing['2'] }}>{icon}</Box>}

          <Text color="primary" size="md" weight="semibold" align="center">
            {title}
          </Text>
        </Box>
      </HapticButton>
    );
  };

  const renderProgress = () => {
    return (
      <HapticButton
        variant="outline"
        size="md"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={StyleSheet.flatten([
          {
            height: sizeConfig.height,
            borderRadius: Radius['2xl'],
            backgroundColor: colors.background.card,
            ...Shadows.md,
          },
          style,
        ])}
      >
        <Box
          style={{
            flex: 1,
            padding: Spacing[sizeConfig.padding],
            justifyContent: 'space-between',
          }}
        >
          {/* Header: Título + Status */}
          <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Heading level="h5" color="primary">
              {title}
            </Heading>

            {isCompleted && (
              <Text size="xs" color="success" weight="semibold">
                ✓ Feito
              </Text>
            )}
          </Box>

          {/* Progress bar */}
          {progress !== undefined && (
            <Box style={{ marginVertical: Spacing['3'] }}>
              <ProgressIndicator progress={progress / 100} type="linear" size="sm" />
            </Box>
          )}

          {/* Footer: Streak */}
          {streak !== undefined && streak > 0 && (
            <Box style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text size="sm" color="secondary">
                🔥 {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
              </Text>
            </Box>
          )}
        </Box>
      </HapticButton>
    );
  };

  const renderContent = () => {
    return (
      <HapticButton
        variant="ghost"
        size="md"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={StyleSheet.flatten([
          {
            width: 280,
            height: sizeConfig.height,
            borderRadius: Radius['2xl'],
            overflow: 'hidden',
            ...Shadows.md,
          },
          style,
        ])}
      >
        {/* Imagem de fundo ou placeholder */}
        {image ? (
          <ImageBackground
            source={{ uri: image }}
            style={{ flex: 1 }}
            imageStyle={{ borderRadius: Radius['2xl'] }}
          >
            <Box
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: Spacing[sizeConfig.padding],
                justifyContent: 'flex-end',
              }}
            >
              {badge && (
                <Box
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: colors.primary.main,
                    paddingHorizontal: Spacing['2'],
                    paddingVertical: Spacing['1'],
                    borderRadius: Radius.md,
                    marginBottom: Spacing['2'],
                  }}
                >
                  <Text size="xs" color="inverse" weight="semibold">
                    {badge}
                  </Text>
                </Box>
              )}

              <Heading level="h5" color="inverse">
                {title}
              </Heading>
            </Box>
          </ImageBackground>
        ) : (
          <Box
            style={{
              flex: 1,
              backgroundColor: colors.background.card,
              padding: Spacing[sizeConfig.padding],
              justifyContent: 'flex-end',
            }}
          >
            {badge && (
              <Box
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: colors.primary.main,
                  paddingHorizontal: Spacing['2'],
                  paddingVertical: Spacing['1'],
                  borderRadius: Radius.md,
                  marginBottom: Spacing['2'],
                }}
              >
                <Text size="xs" color="inverse" weight="semibold">
                  {badge}
                </Text>
              </Box>
            )}

            <Heading level="h5" color="primary">
              {title}
            </Heading>
          </Box>
        )}
      </HapticButton>
    );
  };

  // ======================
  // 🎯 VARIANT SWITCH
  // ======================

  switch (variant) {
    case 'hero':
      return renderHero();
    case 'insight':
      return renderInsight();
    case 'action':
      return renderAction();
    case 'progress':
      return renderProgress();
    case 'content':
      return renderContent();
    default:
      return null;
  }
}

// ======================
// 📦 EXPORT
// ======================

export const MaternalCard = memo(MaternalCardComponent);
