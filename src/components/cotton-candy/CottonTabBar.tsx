/**
 * CottonTabBar - Cotton Candy Theme (Mobile Principal v2)
 * Bottom Navigation com NathIA no centro
 *
 * Melhorias:
 * - Ring effect no botão principal
 * - Gradient pink-to-rose
 * - Backdrop blur simulado
 * - Icon fill para estado ativo
 * - Safe area automático
 *
 * iOS/Android Store Ready
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// Tab configuration
interface TabConfig {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
  isMain?: boolean;
}

const tabs: TabConfig[] = [
  { id: 'inicio', icon: 'home-outline', iconActive: 'home', label: 'Início' },
  { id: 'comunidade', icon: 'people-outline', iconActive: 'people', label: 'Comunidade' },
  { id: 'nathia', icon: 'chatbubble', iconActive: 'chatbubble', label: 'NathIA', isMain: true },
  { id: 'conteudo', icon: 'sparkles-outline', iconActive: 'sparkles', label: 'Conteúdo' },
  { id: 'cuidados', icon: 'heart-outline', iconActive: 'heart', label: 'Cuidados' },
];

interface CottonTabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export function CottonTabBar({ activeTab, onTabPress }: CottonTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {/* Blur Background */}
      <BlurView intensity={80} tint="light" style={styles.blurBackground} />

      {/* Tab Items */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isMain) {
            // Main button (NathIA) - Floating with ring
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.mainButtonContainer}
                onPress={() => onTabPress(tab.id)}
                activeOpacity={0.85}
              >
                {/* White ring */}
                <View style={styles.mainButtonRing}>
                  <LinearGradient
                    colors={['#EC4899', '#F43F5E']} // Pink to Rose
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.mainButton}
                  >
                    <Ionicons
                      name={tab.iconActive}
                      size={26}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                </View>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          // Regular tab button
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={24}
                  color={isActive ? '#EC4899' : '#D4D4D4'}
                />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    // Shadow - subtle top shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.02,
    shadowRadius: 20,
    elevation: 10,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingBottom: 8,
  },
  iconContainer: {
    transform: [{ translateY: 0 }],
  },
  iconContainerActive: {
    transform: [{ translateY: -4 }],
  },
  mainButtonContainer: {
    alignItems: 'center',
    marginTop: -24,
    gap: 4,
  },
  mainButtonRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // Ring shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // Pink shadow
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#A3A3A3',
    textAlign: 'center',
  },
  labelActive: {
    color: '#EC4899',
    fontWeight: '700',
  },
});

export default CottonTabBar;
