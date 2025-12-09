/**
 * ContentCategoryGrid - Cotton Candy Theme
 * Grid de categorias de conteúdo (Mundo da Nath)
 *
 * Categorias: Autocuidado, Treino, Alimentação, Bem-estar Emocional
 * iOS/Android Store Ready
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 24 * 2 - 16) / 2; // 2 columns with gap

// Category configuration
interface CategoryConfig {
  id: string;
  title: string;
  count: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgLight: string;
}

const categories: CategoryConfig[] = [
  {
    id: 'autocuidado',
    title: 'Autocuidado',
    count: '3 conteúdos',
    icon: 'sparkles',
    color: '#FF4D8C',
    bgLight: '#FFF0F5',
  },
  {
    id: 'treino',
    title: 'Treino em Casa',
    count: '3 conteúdos',
    icon: 'barbell',
    color: '#0099FF',
    bgLight: '#F0F7FF',
  },
  {
    id: 'alimentacao',
    title: 'Alimentação',
    count: '3 conteúdos',
    icon: 'nutrition',
    color: '#00C853',
    bgLight: '#E8F5E9',
  },
  {
    id: 'bemestar',
    title: 'Bem-estar Emocional',
    count: '3 conteúdos',
    icon: 'heart',
    color: '#9D4EDD',
    bgLight: '#F3E5F5',
  },
];

interface ContentCategoryGridProps {
  onCategoryPress?: (categoryId: string) => void;
}

export function ContentCategoryGrid({ onCategoryPress }: ContentCategoryGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.card, { backgroundColor: category.bgLight }]}
            onPress={() => onCategoryPress?.(category.id)}
            activeOpacity={0.8}
          >
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon} size={24} color="#FFFFFF" />
            </View>

            {/* Text */}
            <Text style={styles.title}>{category.title}</Text>
            <Text style={styles.count}>{category.count}</Text>

            {/* Chevron */}
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={14} color="#A3A3A3" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: CARD_SIZE,
    aspectRatio: 1,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    textAlign: 'center',
  },
  count: {
    fontSize: 10,
    color: '#A3A3A3',
  },
  chevronContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContentCategoryGrid;
