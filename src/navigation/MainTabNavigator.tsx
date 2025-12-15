/**
 * Nossa Maternidade - Main Tab Navigator
 * Premium glassmorphism design with animated icons
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "../theme/design-system";

// Screens
import HomeScreen from "../screens/HomeScreen";
import CommunityScreen from "../screens/CommunityScreen";
import AssistantScreen from "../screens/AssistantScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyCareScreen from "../screens/MyCareScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

// Animated Tab Icon Component
const AnimatedTabIcon = ({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) => {
  const scale = useSharedValue(focused ? 1.1 : 1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 15 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? `${COLORS.primary[500]}15` : "transparent",
        },
        animatedStyle,
      ]}
    >
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
};

// NathIA Center Button Component
const NathIACenterButton = ({
  onPress,
  focused,
}: {
  onPress: () => void;
  focused: boolean;
}) => {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          {
            marginTop: -20,
            ...SHADOWS.lg,
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary[500], "#EC4899", COLORS.secondary[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: COLORS.background.primary,
          }}
        >
          <Ionicons
            name={focused ? "sparkles" : "sparkles-outline"}
            size={26}
            color="#FFFFFF"
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  // Tab bar height based on platform
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 72;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : COLORS.background.primary,
          borderTopWidth: 0,
          elevation: 0,
          height: TAB_BAR_HEIGHT,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : SPACING.sm,
          paddingTop: SPACING.sm,
        },
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="light"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderTopWidth: 1,
                borderTopColor: "rgba(0, 0, 0, 0.05)",
              }}
            />
          ) : (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: COLORS.background.primary,
                borderTopWidth: 1,
                borderTopColor: COLORS.neutral[200],
              }}
            />
          ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarAccessibilityLabel: "Início - Tela principal do app",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "home" : "home-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "MãesValente",
          tabBarAccessibilityLabel: "MãesValente - Conecte-se com outras mães",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "people" : "people-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{
          tabBarLabel: "",
          tabBarAccessibilityLabel: "NathIA - Assistente de inteligência artificial",
          tabBarIcon: ({ focused }) => (
            <NathIACenterButton
              onPress={() => {}}
              focused={focused}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={async (e) => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.onPress?.(e);
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Mundo da Nath",
          tabBarAccessibilityLabel: "Mundo da Nath - Conteúdo exclusivo da Nathalia",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "person" : "person-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyCare"
        component={MyCareScreen}
        options={{
          tabBarLabel: "Meus Cuidados",
          tabBarAccessibilityLabel: "Meus Cuidados - Bem-estar e autocuidado",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "heart" : "heart-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
