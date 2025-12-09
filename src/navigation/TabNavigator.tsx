/**
 * TabNavigator - Navegação Principal com 5 Tabs
 *
 * 🏠 Home - Dashboard principal
 * 👥 MãesValentes - Comunidade de mães
 * 💬 Chat - MãesValente IA (NathIA)
 * 📚 MundoNath - Conteúdo e Feed
 * ❤️ Meus Cuidados - Bem-estar e hábitos
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { Suspense } from 'react';
import { Platform, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabParamList } from './types';
// 🚀 LAZY LOADING: Screens principais carregadas sob demanda
// ⚠️ TEMPORÁRIO: Import direto no web para evitar erro de lazy loading do Metro bundler
// TODO: Reativar lazy loading quando Metro bundler estiver estável no web
import HomeScreenPremiumDirect from '../screens/HomeScreenPremium';
const HomeScreen = Platform.OS === 'web'
  ? React.lazy(() => Promise.resolve({ default: HomeScreenPremiumDirect }))
  : React.lazy(() => import('../screens/HomeScreenPremium'));
const CommunityScreen = React.lazy(() => import('../screens/CommunityScreen'));
const ChatScreen = React.lazy(() => import('../screens/ChatScreen'));
const MundoNathScreen = React.lazy(() => import('../screens/MundoNathScreen'));
const HabitsScreen = React.lazy(() => import('../screens/HabitsScreen'));

// Theme
import { HapticPatterns, triggerHaptic } from '../theme/haptics';
import { useTheme } from '../theme/ThemeContext';
import { Tokens, ColorTokens } from '../theme/tokens';
import { getShadowFromToken } from '../utils/shadowHelper';

// Icons - Design Web
import { Home, Users, MessageCircle, Sparkles, Heart } from 'lucide-react-native';

// Haptics

const Tab = createBottomTabNavigator<MainTabParamList>();

// Loading fallback component
const TabLoadingFallback = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.canvas,
      }}
    >
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
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Haptic feedback ao trocar de tab
  const handleTabPress = () => {
    triggerHaptic(HapticPatterns.tabChange);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // ✅ Garantir labels visíveis
        tabBarActiveTintColor: '#FF8BA3', // rosa_acento premium
        tabBarInactiveTintColor: isDark ? colors.text.tertiary : '#6DA9E499', // azul_acento com opacidade ~0.6
        tabBarStyle: {
          height: 70 + insets.bottom, // Aumentado para acomodar labels
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          paddingHorizontal: Tokens.spacing['2'],
          backgroundColor: colors.background.card,
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
          elevation: 20,
          ...getShadowFromToken('xl', Tokens.colors.neutral[900]),
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: Tokens.typography.sizes.xs,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: Tokens.spacing['1'],
          paddingHorizontal: Tokens.spacing['2'],
          borderRadius: Tokens.radius.xl,
        },
        tabBarButton: (props) => {
          const { children, style, accessibilityState, onPress, testID } = props;
          const isSelected = accessibilityState?.selected;
          // Apenas aplicar estilo customizado, não interferir na renderização dos labels
          return (
            <TouchableOpacity
              testID={testID ?? undefined}
              accessibilityRole="button"
              accessibilityState={accessibilityState ?? undefined}
              onPress={onPress}
              activeOpacity={0.7}
              style={[
                style,
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  paddingVertical: Tokens.spacing['1'],
                  paddingHorizontal: Tokens.spacing['2'],
                  borderRadius: Tokens.radius.xl,
                  ...(isSelected && {
                    backgroundColor: `${colors.primary.main}1A`,
                  }),
                },
              ]}
            >
              {children}
            </TouchableOpacity>
          );
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 🏠 Tab 1: Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreenWrapper}
        options={{
          tabBarLabel: 'Início',
          tabBarAccessibilityLabel: 'Tela inicial, dashboard principal',
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              accessibilityLabel="Ícone de início"
              {...(Platform.OS !== 'web' && { accessibilityHint: 'Navega para a tela inicial do aplicativo' })}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 👥 Tab 2: Comunidade */}
      <Tab.Screen
        name="MaesValentes"
        component={CommunityScreenWrapper}
        options={{
          tabBarLabel: 'MãesValentes',
          tabBarAccessibilityLabel: 'MãesValentes, comunidade de mães',
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              accessibilityLabel="Ícone de comunidade de mães"
              {...(Platform.OS !== 'web' && { accessibilityHint: 'Navega para a comunidade Mães Valentes' })}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 💬 Tab 3: NathIA - Botão destacado (FAB) */}
      <Tab.Screen
        name="Chat"
        component={ChatScreenWrapper}
        options={{
          tabBarLabel: 'NathIA',
          tabBarAccessibilityLabel: 'Chat com NathIA, assistente de IA',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                marginTop: -20, // Eleva o botão acima dos outros
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LinearGradient
                colors={
                  focused
                    ? [ColorTokens.primary[500], ColorTokens.secondary[500]]
                    : [ColorTokens.accent.ocean, ColorTokens.accent.oceanDeep]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...getShadowFromToken('xl', ColorTokens.neutral[900]),
                  elevation: 12,
                }}
              >
                <MessageCircle
                  size={28}
                  color={ColorTokens.neutral[0]}
                  strokeWidth={2.5}
                  fill={focused ? ColorTokens.neutral[0] : 'transparent'}
                />
              </LinearGradient>
            </View>
          ),
          tabBarButton: (props) => {
            const { children, onPress, accessibilityState } = props;
            const isSelected = accessibilityState?.selected;
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={onPress}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={accessibilityState}
                  accessibilityLabel="Chat com NathIA, assistente de IA"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {children}
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: Tokens.typography.sizes.xs,
                    fontWeight: '700',
                    marginTop: 4,
                    color: isSelected ? colors.primary.main : colors.text.primary,
                  }}
                >
                  NathIA
                </Text>
              </View>
            );
          },
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* 📚 Tab 4: Mundo da Nath */}
      <Tab.Screen
        name="MundoNath"
        component={MundoNathScreenWrapper}
        options={{
          tabBarLabel: 'Mundo da Nath',
          tabBarAccessibilityLabel: 'Mundo da Nath, conteúdo e feed',
          tabBarIcon: ({ color, focused }) => (
            <Sparkles
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              accessibilityLabel="Ícone de conteúdo e feed"
              {...(Platform.OS !== 'web' && { accessibilityHint: 'Navega para o Mundo da Nath, conteúdo e feed' })}
            />
          ),
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />

      {/* ❤️ Tab 5: Meus Cuidados */}
      <Tab.Screen
        name="Habitos"
        component={HabitsScreenWrapper}
        options={{
          tabBarLabel: 'Meus Cuidados',
          tabBarAccessibilityLabel: 'Meus Cuidados e bem-estar',
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
              accessibilityLabel="Ícone de meus cuidados"
              {...(Platform.OS !== 'web' && { accessibilityHint: 'Navega para a tela de meus cuidados e bem-estar' })}
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
