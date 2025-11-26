/**
 * ScreenLayout - Template base para telas
 * SafeArea + ScrollView vertical padrão
 */

import React from 'react';
import { ScrollView, ViewStyle, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme';

export interface ScreenLayoutProps extends Omit<ScrollViewProps, 'style'> {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  contentContainerStyle?: ViewStyle;
}

export function ScreenLayout({
  children,
  scrollEnabled = true,
  contentContainerStyle,
  ...scrollViewProps
}: ScreenLayoutProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          { flexGrow: 1, paddingBottom: 24 },
          contentContainerStyle,
        ]}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
