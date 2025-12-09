/**
 * 🌿 Ethereal Wellness Dashboard
 *
 * A refined, organic wellness experience inspired by Aesop, Calm, and Swiss design.
 *
 * Features:
 * - Breathing wellness ring animation
 * - Gesture-based mood selector
 * - Habit progress with SVG rings
 * - Vertical timeline with micro-interactions
 * - Premium skeleton loading
 * - Parallax effects
 * - Perfect dark mode
 *
 * @version 1.0.0 - Premium Edition
 */

import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedScrollHandler,
  FadeIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Heart, Moon, Sun, Activity, Droplet, Wind, Plus } from 'lucide-react-native';

import { useTheme } from '@/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS - ETHEREAL WELLNESS PALETTE
// ═══════════════════════════════════════════════════════════════

const ETHEREAL_COLORS = {
  light: {
    // Warm Neutrals
    background: '#FAF7F4', // Crema
    surface: '#FFFFFF',
    surfaceElevated: '#FEFEFE',

    // Text Hierarchy
    text: {
      primary: '#2A2520', // Deep warm black
      secondary: '#6B6460', // Warm gray
      tertiary: '#9B9591', // Light warm gray
      inverse: '#FAF7F4',
    },

    // Accent Colors
    accent: {
      terracotta: '#C97D60', // Terracotta
      sage: '#8FA888', // Sage green
      clay: '#D4A88C', // Soft clay
      sand: '#E8DED2', // Sand
    },

    // Semantic
    wellness: {
      excellent: '#8FA888', // Sage
      good: '#A8C5A0', // Light green
      fair: '#D4A88C', // Clay
      poor: '#C97D60', // Terracotta
    },

    // Overlays
    overlay: 'rgba(42, 37, 32, 0.4)',
    shimmer: 'rgba(255, 255, 255, 0.6)',
  },
  dark: {
    // Dark Warm Neutrals
    background: '#1A1715', // Deep warm black
    surface: '#2A2520',
    surfaceElevated: '#352F2A',

    // Text Hierarchy
    text: {
      primary: '#FAF7F4', // Crema
      secondary: '#C4BCB6', // Warm light gray
      tertiary: '#8B8177', // Medium warm gray
      inverse: '#1A1715',
    },

    // Accent Colors
    accent: {
      terracotta: '#E09478', // Lighter terracotta
      sage: '#A8C5A0', // Lighter sage
      clay: '#E8C9AB', // Lighter clay
      sand: '#D4C4B4', // Lighter sand
    },

    // Semantic
    wellness: {
      excellent: '#A8C5A0',
      good: '#BAD4B3',
      fair: '#E8C9AB',
      poor: '#E09478',
    },

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    shimmer: 'rgba(255, 255, 255, 0.1)',
  },
};

// Typography Scale
const TYPOGRAPHY = {
  display: {
    fontFamily: Platform.select({
      ios: 'Georgia', // Serif elegante nativo
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    fontWeight: '700' as const,
  },
  title: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
    fontWeight: '500' as const,
  },
  mono: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2,
    fontWeight: '600' as const,
  },
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type MoodType = 'serene' | 'energized' | 'content' | 'tired' | 'overwhelmed';

interface Mood {
  id: MoodType;
  label: string;
  color: string;
  icon: typeof Heart;
}

interface Habit {
  id: string;
  name: string;
  progress: number; // 0-1
  icon: typeof Heart;
  color: string;
}

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  completed: boolean;
}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const MOODS: Mood[] = [
  { id: 'serene', label: 'Serena', color: '#8FA888', icon: Wind },
  { id: 'energized', label: 'Energizada', color: '#A8C5A0', icon: Activity },
  { id: 'content', label: 'Satisfeita', color: '#D4A88C', icon: Heart },
  { id: 'tired', label: 'Cansada', color: '#C97D60', icon: Moon },
  { id: 'overwhelmed', label: 'Sobrecarregada', color: '#E09478', icon: Droplet },
];

const HABITS: Habit[] = [
  { id: '1', name: 'Hidratação', progress: 0.75, icon: Droplet, color: '#8FA888' },
  { id: '2', name: 'Meditação', progress: 0.4, icon: Wind, color: '#A8C5A0' },
  { id: '3', name: 'Movimento', progress: 0.6, icon: Activity, color: '#D4A88C' },
  { id: '4', name: 'Descanso', progress: 0.9, icon: Moon, color: '#C97D60' },
];

const TIMELINE: TimelineItem[] = [
  { id: '1', time: '08:00', title: 'Rotina matinal', completed: true },
  { id: '2', time: '10:30', title: 'Meditação', completed: true },
  { id: '3', time: '14:00', title: 'Alongamento', completed: false },
  { id: '4', time: '18:00', title: 'Journaling', completed: false },
  { id: '5', time: '21:00', title: 'Ritual noturno', completed: false },
];

// ═══════════════════════════════════════════════════════════════
// ANIMATED WELLNESS RING COMPONENT
// ═══════════════════════════════════════════════════════════════

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WellnessRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

const WellnessRing: React.FC<WellnessRingProps> = ({
  score,
  size = 200,
  strokeWidth = 12
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ETHEREAL_COLORS.dark : ETHEREAL_COLORS.light;

  const breathingScale = useSharedValue(1);
  const progress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Breathing animation
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );

    // Progress animation
    progress.value = withDelay(
      300,
      withSpring(score / 100, {
        damping: 15,
        stiffness: 80,
      })
    );
  }, [score]);

  const animatedCircleProps = useAnimatedStyle(() => {
    return {
      transform: [{ scale: breathingScale.value }],
    };
  });

  const strokeDashoffset = circumference * (1 - progress.value);

  return (
    <Animated.View style={animatedCircleProps}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.accent.sand}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.2}
          />

          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.wellness.excellent}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════
// HABIT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface HabitCardProps {
  habit: Habit;
  index: number;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, index }) => {
  const { isDark } = useTheme();
  const colors = isDark ? ETHEREAL_COLORS.dark : ETHEREAL_COLORS.light;

  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 100,
      withSpring(habit.progress, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, [habit.progress, index]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const size = 60;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress.value);

  const Icon = habit.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.habitCard, animatedStyle]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.habitCardInner, { backgroundColor: colors.surface }]}
      >
        <View style={styles.habitIconContainer}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background Circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={colors.accent.sand}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={0.2}
              />

              {/* Progress Circle */}
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={habit.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          <View style={styles.habitIcon}>
            <Icon size={20} color={habit.color} strokeWidth={2} />
          </View>
        </View>

        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, { color: colors.text.primary }]}>
            {habit.name}
          </Text>
          <Text style={[styles.habitProgress, { color: colors.text.secondary }]}>
            {Math.round(habit.progress * 100)}%
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════
// MOOD SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
  const { isDark } = useTheme();
  const colors = isDark ? ETHEREAL_COLORS.dark : ETHEREAL_COLORS.light;

  const [selectedMood, setSelectedMood] = useState<MoodType>('content');

  const handleMoodPress = useCallback((mood: MoodType) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [onMoodSelect]);

  return (
    <View style={styles.moodSelector}>
      <Text style={[styles.moodSelectorTitle, { color: colors.text.primary }]}>
        Como você está hoje?
      </Text>

      <View style={styles.moodButtons}>
        {MOODS.map((mood, index) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;

          return (
            <Animated.View
              key={mood.id}
              entering={FadeIn.delay(index * 50).springify()}
            >
              <Pressable
                onPress={() => handleMoodPress(mood.id)}
                style={({ pressed }) => [
                  styles.moodButton,
                  {
                    backgroundColor: isSelected ? mood.color : colors.surface,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Icon
                  size={20}
                  color={isSelected ? colors.text.inverse : mood.color}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.moodButtonText,
                    {
                      color: isSelected ? colors.text.inverse : colors.text.secondary,
                    },
                  ]}
                >
                  {mood.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// TIMELINE ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════

interface TimelineItemComponentProps {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}

const TimelineItemComponent: React.FC<TimelineItemComponentProps> = ({
  item,
  index,
  isLast,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ETHEREAL_COLORS.dark : ETHEREAL_COLORS.light;

  const scale = useSharedValue(1);
  const checkScale = useSharedValue(item.completed ? 1 : 0);

  useEffect(() => {
    if (item.completed) {
      checkScale.value = withSpring(1, { damping: 12 });
    }
  }, [item.completed]);

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 80).springify()}
      style={styles.timelineItem}
    >
      <View style={styles.timelineLeft}>
        <Text style={[styles.timelineTime, { color: colors.text.secondary }]}>
          {item.time}
        </Text>
      </View>

      <View style={styles.timelineCenter}>
        <View
          style={[
            styles.timelineDot,
            {
              backgroundColor: item.completed
                ? colors.wellness.excellent
                : colors.accent.sand,
            },
          ]}
        >
          <Animated.View style={checkAnimatedStyle}>
            <View
              style={[
                styles.timelineCheck,
                { backgroundColor: colors.surface },
              ]}
            />
          </Animated.View>
        </View>

        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              {
                backgroundColor: item.completed
                  ? colors.wellness.excellent
                  : colors.accent.sand,
                opacity: 0.3,
              },
            ]}
          />
        )}
      </View>

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.timelineRight,
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.timelineCard,
            {
              backgroundColor: colors.surface,
            },
            animatedStyle,
          ]}
        >
          <Text
            style={[
              styles.timelineTitle,
              {
                color: item.completed
                  ? colors.text.secondary
                  : colors.text.primary,
                textDecorationLine: item.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {item.title}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════

const SkeletonLoader: React.FC = () => {
  const { isDark } = useTheme();
  const colors = isDark ? ETHEREAL_COLORS.dark : ETHEREAL_COLORS.light;

  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View
        style={[
          styles.skeletonCircle,
          { backgroundColor: colors.accent.sand },
          animatedStyle,
        ]}
      />

      <View style={styles.skeletonCards}>
        {[1, 2, 3, 4].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.skeletonCard,
              { backgroundColor: colors.accent.sand },
              animatedStyle,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const EtherealWellnessDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const colors = isDark ? ETHEREAL_COLORS.dark : ETHEREAL_COLORS.light;
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [wellnessScore] = useState(78);

  const scrollY = useSharedValue(0);
  const fabScale = useSharedValue(1);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const handleFabPress = useCallback(() => {
    fabScale.value = withSequence(
      withSpring(0.9, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Header with Wellness Ring */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Animated.Text
            entering={FadeIn.delay(200)}
            style={[styles.greeting, { color: colors.text.secondary }]}
          >
            Bem-vinda de volta
          </Animated.Text>

          <Animated.Text
            entering={FadeIn.delay(300)}
            style={[styles.title, { color: colors.text.primary }]}
          >
            Seu Bem-Estar
          </Animated.Text>

          <Animated.View
            entering={FadeIn.delay(400).springify()}
            style={styles.wellnessRingContainer}
          >
            <WellnessRing score={wellnessScore} />

            <View style={styles.wellnessScoreOverlay}>
              <Text style={[styles.wellnessScore, { color: colors.text.primary }]}>
                {wellnessScore}
              </Text>
              <Text style={[styles.wellnessLabel, { color: colors.text.secondary }]}>
                Score
              </Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Mood Selector */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <MoodSelector onMoodSelect={(mood) => console.log(mood)} />
        </Animated.View>

        {/* Habits Section */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Hábitos de Hoje
          </Text>

          <View style={styles.habitsGrid}>
            {HABITS.map((habit, index) => (
              <HabitCard key={habit.id} habit={habit} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Timeline Section */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Rotina
          </Text>

          <View style={styles.timeline}>
            {TIMELINE.map((item, index) => (
              <TimelineItemComponent
                key={item.id}
                item={item}
                index={index}
                isLast={index === TIMELINE.length - 1}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeIn.delay(1000).springify()}
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 24,
            backgroundColor: colors.wellness.excellent,
          },
          fabAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={handleFabPress}
          style={styles.fabInner}
        >
          <Plus size={28} color={colors.text.inverse} strokeWidth={2.5} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.display,
    marginBottom: 32,
  },
  wellnessRingContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessScoreOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  wellnessScore: {
    ...TYPOGRAPHY.mono,
    fontSize: 48,
    lineHeight: 56,
  },
  wellnessLabel: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    marginTop: -4,
  },

  // Mood Selector
  moodSelector: {
    marginBottom: 40,
  },
  moodSelectorTitle: {
    ...TYPOGRAPHY.title,
    marginBottom: 16,
  },
  moodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  moodButtonText: {
    ...TYPOGRAPHY.caption,
  },

  // Section
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    marginBottom: 16,
  },

  // Habits
  habitsGrid: {
    gap: 12,
  },
  habitCard: {
    marginBottom: 8,
  },
  habitCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  habitIconContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  habitIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitProgress: {
    ...TYPOGRAPHY.mono,
    fontSize: 12,
  },

  // Timeline
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    width: 60,
    paddingTop: 4,
  },
  timelineTime: {
    ...TYPOGRAPHY.mono,
    fontSize: 12,
  },
  timelineCenter: {
    width: 40,
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCheck: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
  },
  timelineCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  timelineTitle: {
    ...TYPOGRAPHY.body,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Skeleton
  skeletonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skeletonCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 40,
  },
  skeletonCards: {
    width: '100%',
    gap: 12,
  },
  skeletonCard: {
    width: '100%',
    height: 80,
    borderRadius: 16,
  },
});

export default EtherealWellnessDashboard;
