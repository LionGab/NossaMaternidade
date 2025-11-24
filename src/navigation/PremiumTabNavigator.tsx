import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Platform, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabParamList } from './types';
import ChatScreen from '../screens/ChatScreen';
import RefugioNathScreen from '../screens/RefugioNathScreen';
import MundoNathScreen from '../screens/MundoNathScreen';
import HabitsScreen from '../screens/HabitsScreen';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ANIMATIONS } from '../constants/Theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Placeholder screens (to be replaced with premium versions)
const FeedScreen = () => (
  <View style={styles.placeholderScreen}>
    <Text style={styles.placeholderText}>Feed Premium</Text>
  </View>
);

const CommunityScreen = () => (
  <View style={styles.placeholderScreen}>
    <Text style={styles.placeholderText}>Comunidade Premium</Text>
  </View>
);

// Custom Tab Bar Icon with animations
const TabIcon = ({
  focused,
  icon,
  label,
  color,
  notification = 0
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  notification?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Scale animation
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        damping: 10,
        stiffness: 100,
      }).start();

      // Rotation animation
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: -0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-10deg', '10deg'],
                })
              },
            ],
          },
        ]}
      >
        {focused && (
          <LinearGradient
            colors={[...COLORS.primary.gradient] as any}
            style={styles.iconGradientBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        <Ionicons
          name={icon}
          size={24}
          color={focused ? COLORS.primary[500] : color}
        />
        {notification > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notification > 99 ? '99+' : notification}</Text>
          </View>
        )}
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? COLORS.primary[500] : color }
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

// Premium Tab Bar Component
const PremiumTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={95} tint="light" style={styles.tabBarBlur}>
          <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <View
                  key={index}
                  style={styles.tabItem}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onTouchEnd={onPress}
                >
                  {options.tabBarIcon && options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? COLORS.primary[500] : COLORS.text.secondary,
                    size: 24,
                  })}
                </View>
              );
            })}
          </View>
        </BlurView>
      ) : (
        <View style={[styles.tabBarAndroid, styles.tabBar]}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <View
                key={index}
                style={styles.tabItem}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onTouchEnd={onPress}
              >
                {options.tabBarIcon && options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? COLORS.primary[500] : COLORS.text.secondary,
                  size: 24,
                })}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const PremiumTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBar={(props) => <PremiumTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={MundoNathScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              icon="home"
              label="Início"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat IA',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              icon="chatbubble-ellipses"
              label="Chat IA"
              color={color}
              notification={3}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Conteúdo',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              icon="newspaper"
              label="Conteúdo"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Comunidade',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              icon="people"
              label="Comunidade"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarLabel: 'Hábitos',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              icon="fitness"
              label="Hábitos"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Refugio"
        component={RefugioNathScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              icon="person-circle"
              label="Perfil"
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    color: COLORS.text.primary,
    fontFamily: TYPOGRAPHY.fonts.bold,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBarBlur: {
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border.light,
    overflow: 'hidden',
  },
  tabBarAndroid: {
    backgroundColor: COLORS.background.primary,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border.light,
    ...SHADOWS.lg,
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    paddingTop: SPACING[2],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  iconGradientBg: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    opacity: 0.15,
  },
  tabLabel: {
    fontSize: TYPOGRAPHY.sizes['2xs'],
    marginTop: SPACING[1],
    fontFamily: TYPOGRAPHY.fonts.medium,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.error.main,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.background.primary,
  },
  badgeText: {
    fontSize: 9,
    color: COLORS.text.inverse,
    fontFamily: TYPOGRAPHY.fonts.bold,
  },
});

export default PremiumTabNavigator;