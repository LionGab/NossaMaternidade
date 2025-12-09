/**
 * WeekCalendarStrip - Cotton Candy Theme
 * Strip de calendário semanal para hábitos
 *
 * iOS/Android Store Ready
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DayItem {
  day: string;
  date: string;
  isActive?: boolean;
  isToday?: boolean;
}

interface WeekCalendarStripProps {
  days?: DayItem[];
  onDayPress?: (date: string) => void;
}

// Default days (current week)
const defaultDays: DayItem[] = [
  { day: 'seg', date: '8' },
  { day: 'ter', date: '9' },
  { day: 'qua', date: '10' },
  { day: 'qui', date: '11' },
  { day: 'sex', date: '12' },
  { day: 'sáb', date: '13' },
  { day: 'dom', date: '14', isActive: true, isToday: true },
];

export function WeekCalendarStrip({
  days = defaultDays,
  onDayPress,
}: WeekCalendarStripProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="calendar" size={16} color="#EC4899" />
        <Text style={styles.headerText}>Esta Semana</Text>
      </View>

      {/* Days Strip */}
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              day.isActive && styles.dayButtonActive,
            ]}
            onPress={() => onDayPress?.(day.date)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayName,
                day.isActive && styles.dayNameActive,
              ]}
            >
              {day.day}
            </Text>
            <Text
              style={[
                styles.dayDate,
                day.isActive && styles.dayDateActive,
              ]}
            >
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  dayButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    transform: [{ scale: 1.1 }],
    // Shadow
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#A3A3A3',
    textTransform: 'uppercase',
  },
  dayNameActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#737373',
  },
  dayDateActive: {
    color: '#FFFFFF',
  },
});

export default WeekCalendarStrip;
