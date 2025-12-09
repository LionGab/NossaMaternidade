/**
 * QuickActionGrid - Cotton Candy Theme
 * Grid de ações rápidas da Home (Diário, Saúde, Dicas, Enxoval)
 *
 * iOS/Android Store Ready
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  bgColor: string;
  iconColor: string;
  onPress?: () => void;
}

interface QuickActionGridProps {
  actions?: QuickAction[];
  onActionPress?: (actionId: string) => void;
}

// Default actions from design
const defaultActions: QuickAction[] = [
  {
    id: 'diario',
    icon: 'book-outline',
    label: 'Diário',
    bgColor: '#FCE7F3',
    iconColor: '#EC4899',
  },
  {
    id: 'saude',
    icon: 'fitness-outline',
    label: 'Saúde',
    bgColor: '#DBEAFE',
    iconColor: '#3B82F6',
  },
  {
    id: 'dicas',
    icon: 'sparkles-outline',
    label: 'Dicas',
    bgColor: '#FEF3C7',
    iconColor: '#CA8A04',
  },
  {
    id: 'enxoval',
    icon: 'bag-outline',
    label: 'Enxoval',
    bgColor: '#F3E8FF',
    iconColor: '#9333EA',
  },
];

export function QuickActionGrid({
  actions = defaultActions,
  onActionPress,
}: QuickActionGridProps) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionButton}
          onPress={() => {
            action.onPress?.();
            onActionPress?.(action.id);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
            <Ionicons name={action.icon} size={24} color={action.iconColor} />
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20, // rounded-2xl (20px)
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#525252',
    textAlign: 'center',
  },
});

export default QuickActionGrid;
