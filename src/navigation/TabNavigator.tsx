import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { MainTabParamList } from './types';
import ChatScreen from '../screens/ChatScreen';
import RefugioNathScreen from '../screens/RefugioNathScreen';
import MundoNathScreen from '../screens/MundoNathScreen';
import HabitsScreen from '../screens/HabitsScreen';
import { Colors } from '../constants/Colors';
import { 
  Home, 
  MessageCircleHeart, 
  Newspaper, 
  Users, 
  Sparkles, 
  Shield 
} from 'lucide-react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

const FeedScreen = () => (
  <View className="flex-1 items-center justify-center bg-[#F0F4F8] dark:bg-nath-dark-bg">
    <Text className="text-nath-dark dark:text-white font-bold text-lg">Feed em breve</Text>
  </View>
);

const CommunityScreen = () => (
  <View className="flex-1 items-center justify-center bg-[#F0F4F8] dark:bg-nath-dark-bg">
    <Text className="text-nath-dark dark:text-white font-bold text-lg">Comunidade em breve</Text>
  </View>
);

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4285F4', // nath-blue
        tabBarInactiveTintColor: '#9CA3AF', // gray-400
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          backgroundColor: '#FFFFFF',
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
