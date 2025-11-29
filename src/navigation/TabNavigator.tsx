/**
 * TabNavigator - Navegação Principal com 5 Tabs
 *
 * 🏠 Home - Dashboard principal
 * 👥 MãesValentes - Comunidade de mães
 * 💬 Chat - MãesValente IA (NathIA)
 * 📚 MundoNath - Conteúdo e Feed
 * 📊 Hábitos - Bem-estar e hábitos
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ChatScreen from '../screens/ChatScreen';
import MundoNathScreen from '../screens/MundoNathScreen';
import HabitsScreen from '../screens/HabitsScreen';

// Theme
import { useTheme } from '../theme/ThemeContext';
import { Tokens, ColorTokens } from '../theme';

// Icons - Premium Design
import {
  Home,
  UsersRound,
  Sparkles,
  Clapperboard,
  CheckCircle2,
} from 'lucide-react-native';

// Haptics
import { HapticPatterns, triggerHaptic } from '../theme/haptics';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  const { colors, isDark: _isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Haptic feedback ao trocar de tab
  const handleTabPress = () => {
    triggerHaptic(HapticPatterns.tabChange);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          backgroundColor: colors.background.card,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: ColorTokens.neutral[900],
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: Tokens.typography.sizes['2xs'],
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 🏠 Tab 1: Home - Premium Icon */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={focused ? 28 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 👥 Tab 2: MãesValentes - Premium Icon (UsersRound) */}
      <Tab.Screen
        name="MaesValentes"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'MãesValente',
          tabBarIcon: ({ color, focused }) => (
            <UsersRound
              size={focused ? 28 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 💬 Tab 3: Chat (NathIA) - Premium Icon (Sparkles com Fill Mágico) */}
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'NathIA',
          tabBarIcon: ({ color, focused }) => (
            <Sparkles
              size={focused ? 28 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 📚 Tab 4: MundoNath (Conteúdo) - Premium Icon (Clapperboard) */}
      <Tab.Screen
        name="MundoNath"
        component={MundoNathScreen}
        options={{
          tabBarLabel: 'MundoNath',
          tabBarIcon: ({ color, focused }) => (
            <Clapperboard
              size={focused ? 28 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 📊 Tab 5: Hábitos (Bem-estar) - Premium Icon (CheckCircle2) */}
      <Tab.Screen
        name="Habitos"
        component={HabitsScreen}
        options={{
          tabBarLabel: 'Hábitos',
          tabBarIcon: ({ color, focused }) => (
            <CheckCircle2
              size={focused ? 28 : 24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'none'}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
