/**
 * TabNavigator - Navegação Principal com 5 Tabs
 *
 * 🏠 Home - Dashboard principal
 * 👥 MãesValentes - Comunidade de mães
 * 💬 Chat - MãesValente IA (NathIA)
 * 📚 MundoNath - Conteúdo e Feed
 * 📊 Hábitos - Bem-estar e hábitos
 */

import React, { Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { MainTabParamList } from './types';
// 🚀 LAZY LOADING: Screens principais carregadas sob demanda
const HomeScreen = React.lazy(() => import('../screens/HomeScreen'));
const CommunityScreen = React.lazy(() => import('../screens/CommunityScreen'));
const ChatScreen = React.lazy(() => import('../screens/ChatScreen'));
const MundoNathScreen = React.lazy(() => import('../screens/MundoNathScreen'));
const HabitsScreen = React.lazy(() => import('../screens/HabitsScreen'));

// Theme
import { useTheme } from '../theme/ThemeContext';
import { Tokens } from '../theme';

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

// Loading fallback component
const TabLoadingFallback = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.canvas }}>
      <ActivityIndicator size="large" color={colors.primary.main} />
    </View>
  );
};

// Helper para criar wrapper com Suspense para lazy-loaded screens
function createLazyScreen<P extends Record<string, unknown>>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>
) {
  return function LazyScreenWrapper(props: P) {
    return (
      <Suspense fallback={<TabLoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Criar wrappers para cada screen lazy-loaded
const HomeScreenWrapper = createLazyScreen(HomeScreen);
const CommunityScreenWrapper = createLazyScreen(CommunityScreen);
const ChatScreenWrapper = createLazyScreen(ChatScreen);
const MundoNathScreenWrapper = createLazyScreen(MundoNathScreen);
const HabitsScreenWrapper = createLazyScreen(HabitsScreen);

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
          shadowColor: Tokens.colors.neutral[900],
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
        component={HomeScreenWrapper}
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
        component={CommunityScreenWrapper}
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
        component={ChatScreenWrapper}
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
        component={MundoNathScreenWrapper}
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
        component={HabitsScreenWrapper}
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
