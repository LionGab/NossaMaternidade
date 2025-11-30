/**
 * FloatingTabBar - Bottom Navigation com FAB Central Flutuante
 *
 * Adaptado do GeminiApp Layout para React Native
 * 5 tabs: 4 nos cantos + 1 FAB central flutuante para AI Chat
 *
 * @version 1.0.0
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Home,
  Users,
  BookOpen,
  Activity,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text as RNText } from 'react-native';
import { Spacing, Radius, Shadows, ColorTokens, Typography, DarkTheme, LightTheme } from '../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70;
const FAB_SIZE = 64;
const FAB_OFFSET = 24; // How much FAB floats above tab bar

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type TabName = 'Home' | 'MaesValentes' | 'Chat' | 'MundoNath' | 'Habitos';

export interface TabConfig {
  name: TabName;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  isFab?: boolean;
}

export const TAB_CONFIG: TabConfig[] = [
  { name: 'Home', label: 'Inicio', icon: Home },
  { name: 'MaesValentes', label: 'Maes', icon: Users },
  { name: 'Chat', label: 'NathIA', icon: Sparkles, isFab: true },
  { name: 'MundoNath', label: 'Mundo', icon: BookOpen },
  { name: 'Habitos', label: 'Habitos', icon: Activity },
];

interface TabItemProps {
  config: TabConfig;
  isActive: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}


const TabItem: React.FC<TabItemProps> = React.memo(({
  config,
  isActive,
  onPress,
  colors,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const IconComponent = config.icon;
  const iconColor = isActive ? colors.primary.main : colors.text.tertiary;
  const strokeWidth = isActive ? 2.5 : 2;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tabItem, animatedStyle]}
      accessibilityRole="tab"
      accessibilityLabel={config.label}
      accessibilityState={{ selected: isActive }}
    >
      <IconComponent size={24} color={iconColor} strokeWidth={strokeWidth} />
      <RNText
        style={{
          ...styles.tabLabel,
          color: iconColor,
          fontWeight: isActive ? '600' : '400',
        }}
      >
        {config.label}
      </RNText>
    </AnimatedPressable>
  );
});

TabItem.displayName = 'TabItem';

interface FabButtonProps {
  isActive: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}

const FabButton: React.FC<FabButtonProps> = React.memo(({
  isActive,
  onPress,
  colors,
  isDark,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const activeScale = interpolate(
      isActive ? 1 : 0,
      [0, 1],
      [1, 1.1],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { scale: scale.value * activeScale },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    rotation.value = withSpring(-10, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    rotation.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <View style={styles.fabContainer}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.fabTouchable, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel="Abrir chat com NathIA"
        accessibilityState={{ selected: isActive }}
      >
        <LinearGradient
          colors={[
            ColorTokens.accent.ocean,
            ColorTokens.accent.oceanDeep,
          ]}
          style={[
            styles.fab,
            {
              borderColor: isDark ? colors.background.canvas : LightTheme.background.card,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Sparkles size={28} color={LightTheme.text.inverse} strokeWidth={2.5} />
        </LinearGradient>
      </AnimatedPressable>
      <RNText
        style={{
          ...styles.fabLabel,
          color: isActive ? colors.primary.main : colors.text.tertiary,
        }}
      >
        NathIA
      </RNText>
    </View>
  );
});

FabButton.displayName = 'FabButton';

export interface FloatingTabBarProps {
  /** Tab ativa atual */
  activeTab: TabName;
  /** Callback ao mudar de tab */
  onTabChange: (tab: TabName) => void;
  /** Estilo customizado */
  style?: object;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  activeTab,
  onTabChange,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const leftTabs = TAB_CONFIG.slice(0, 2);
  const rightTabs = TAB_CONFIG.slice(3);

  const containerStyle = useMemo(() => ({
    paddingBottom: Math.max(insets.bottom, Spacing['2']),
  }), [insets.bottom]);

  const renderTabBar = () => (
    <View style={styles.tabBarInner}>
      {/* Left tabs */}
      <View style={styles.tabGroup}>
        {leftTabs.map((tab) => (
          <TabItem
            key={tab.name}
            config={tab}
            isActive={activeTab === tab.name}
            onPress={() => onTabChange(tab.name)}
            colors={colors}
          />
        ))}
      </View>

      {/* Center spacer for FAB */}
      <View style={styles.fabSpacer} />

      {/* Right tabs */}
      <View style={styles.tabGroup}>
        {rightTabs.map((tab) => (
          <TabItem
            key={tab.name}
            config={tab}
            isActive={activeTab === tab.name}
            onPress={() => onTabChange(tab.name)}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, containerStyle, style]}>
      {/* Floating FAB */}
      <FabButton
        isActive={activeTab === 'Chat'}
        onPress={() => onTabChange('Chat')}
        colors={colors}
        isDark={isDark}
      />

      {/* Tab bar with blur */}
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.tabBar,
            {
              backgroundColor: isDark
                ? DarkTheme.background.card
                : LightTheme.background.card,
            },
          ]}
        >
          {renderTabBar()}
        </BlurView>
      ) : (
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDark
                ? colors.background.elevated
                : colors.background.card,
              ...Shadows.lg,
            },
          ]}
        >
          {renderTabBar()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    overflow: 'hidden',
    ...Platform.select({
      ios: {},
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'],
  },
  tabGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    minWidth: 64,
  },
  tabLabel: {
    fontSize: Typography.sizes['2xs'],
    marginTop: Spacing['1'],
  },
  fabSpacer: {
    width: FAB_SIZE + Spacing['4'],
  },
  fabContainer: {
    position: 'absolute',
    top: -FAB_OFFSET,
    left: SCREEN_WIDTH / 2 - FAB_SIZE / 2,
    alignItems: 'center',
    zIndex: 1000,
  },
  fabTouchable: {
    ...Shadows.premium,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  fabLabel: {
    fontSize: Typography.sizes['2xs'],
    fontWeight: Typography.weights.medium,
    marginTop: Spacing['1'],
  },
});

export default FloatingTabBar;
