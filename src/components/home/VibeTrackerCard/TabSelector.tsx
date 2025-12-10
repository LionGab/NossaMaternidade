/**
 * TabSelector - Seletor de abas horizontal
 *
 * Componente de tabs personalizável com animação de seleção.
 * Usado no VibeTrackerCard para selecionar período (Hoje/Semana/Mês/Histórico).
 *
 * @example
 * <TabSelector
 *   tabs={['Hoje', 'Semana', 'Mês', 'Histórico']}
 *   selectedIndex={0}
 *   onTabChange={(index) => setSelectedTab(index)}
 * />
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

export interface TabSelectorProps {
  /** Array de títulos das tabs */
  tabs: string[];
  /** Índice da tab selecionada (0-indexed) */
  selectedIndex: number;
  /** Callback quando tab é alterada */
  onTabChange: (index: number) => void;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Estilos customizados do container */
  containerStyle?: object;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  selectedIndex,
  onTabChange,
  disableHaptic = false,
  containerStyle,
}) => {
  const colors = useThemeColors();

  const handleTabPress = (index: number) => {
    if (index === selectedIndex) return; // Já selecionado

    // Haptic feedback
    if (!disableHaptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onTabChange(index);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContainer, containerStyle]}
      style={styles.scrollView}
    >
      {tabs.map((tab, index) => {
        const isSelected = index === selectedIndex;

        return (
          <TouchableOpacity
            key={`tab-${index}`}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
            style={[
              styles.tab,
              isSelected && {
                backgroundColor: colors.primary.main,
              },
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={tab}
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isSelected ? colors.text.inverse : colors.text.secondary,
                },
                isSelected && styles.tabTextSelected,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0, // Não crescer além do conteúdo
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'], // 8px entre tabs
    paddingHorizontal: Tokens.spacing['1'], // Padding interno
  },
  tab: {
    paddingVertical: Tokens.spacing['2.5'], // 10px vertical
    paddingHorizontal: Tokens.spacing['4'], // 16px horizontal
    borderRadius: Tokens.radius.full, // Pill shape
    minHeight: 44, // Touch target mínimo (iOS HIG)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // Transição suave (web only)
    ...(Platform.OS === 'web' && {
      transition: 'background-color 0.2s ease, transform 0.1s ease',
    }),
  },
  tabText: {
    fontSize: Tokens.typography.sizes.sm,
    fontWeight: '600', // Semibold
    textAlign: 'center',
  },
  tabTextSelected: {
    fontWeight: '700', // Bold quando selecionado
  },
});

export default TabSelector;
