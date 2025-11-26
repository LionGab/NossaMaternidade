/**
 * SectionLayout - Template para seções com título e ação opcional
 * Usado para agrupar conteúdo relacionado (ex: "Hábitos de hoje", "Mundo Nath pra você")
 */

import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { Box } from '@/components/primitives/Box';
import { Heading } from '@/components/primitives/Heading';
import { HapticButton } from '@/components/primitives/HapticButton';
import { Text } from '@/components/primitives/Text';
import { Spacing } from '@/theme/tokens';

export interface SectionLayoutProps {
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  containerStyle?: ViewStyle;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SectionLayout({
  title,
  children,
  actionLabel,
  onActionPress,
  containerStyle,
  headingLevel = 'h3',
}: SectionLayoutProps) {
  return (
    <Box
      style={StyleSheet.flatten([
        { paddingHorizontal: Spacing['4'], paddingVertical: Spacing['3'] },
        containerStyle,
      ])}
    >
      {/* Header: Título + Ação opcional */}
      <Box
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: Spacing['3'],
        }}
      >
        <Heading level={headingLevel} color="primary">
          {title}
        </Heading>

        {actionLabel && onActionPress && (
          <HapticButton
            variant="ghost"
            size="sm"
            onPress={onActionPress}
            accessibilityLabel={`${actionLabel} - ${title}`}
          >
            <Text size="sm" color="link" weight="medium">
              {actionLabel}
            </Text>
          </HapticButton>
        )}
      </Box>

      {/* Conteúdo da seção */}
      {children}
    </Box>
  );
}
