import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { MainTabParamList } from './types';
import ChatScreen from '../screens/ChatScreen';
import RefugioNathScreen from '../screens/RefugioNathScreen';
import MundoNathScreen from '../screens/MundoNathScreen';
import HabitsScreen from '../screens/HabitsScreen';
import FeedScreen from '../screens/FeedScreen';
import { useTheme } from '../theme/ThemeContext';
import {
  Home,
  MessageCircleHeart,
  Newspaper,
  Users,
  Sparkles,
  Shield
} from 'lucide-react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const CommunityScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.canvas }}>
      <Text style={{ color: colors.text.primary, fontWeight: 'bold', fontSize: 18 }}>Comunidade em breve</Text>
    </View>
  );
};

export const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          backgroundColor: colors.background.card,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={MundoNathScreen}
        options={{
          tabBarLabel: 'Mundo Nath',
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'MãesValente',
          tabBarIcon: ({ color, size }) => <MessageCircleHeart size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => <Newspaper size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: 'Comunidade',
          tabBarIcon: ({ color, size }) => <Users size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarLabel: 'Hábitos',
          tabBarIcon: ({ color, size }) => <Sparkles size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Refugio"
        component={RefugioNathScreen}
        options={{
          tabBarLabel: 'Refúgio',
          tabBarIcon: ({ color, size }) => <Shield size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
