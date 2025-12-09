/**
 * HabitCard - Cotton Candy Theme
 * Card de hábito para "Mães Valente" (Cuidados)
 *
 * iOS/Android Store Ready
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HabitCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  completed?: boolean;
  onPress?: () => void;
}

export function HabitCard({
  title,
  description,
  icon,
  iconColor,
  bgColor,
  completed = false,
  onPress,
}: HabitCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, completed && styles.containerCompleted]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      {/* Text */}
      <Text style={[styles.title, completed && styles.titleCompleted]}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {/* Completed indicator */}
      {completed && (
        <View style={styles.checkContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerCompleted: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
    textAlign: 'center',
  },
  titleCompleted: {
    color: '#22C55E',
  },
  description: {
    fontSize: 9,
    color: '#A3A3A3',
    textAlign: 'center',
    lineHeight: 12,
  },
  checkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default HabitCard;
