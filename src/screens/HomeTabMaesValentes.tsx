/**
 * HomeTabMaesValentes - Extracted from MaesValentesExpo
 * Tab: Início
 *
 * Adapted to work with NossaMaternidade theme and components
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import { ReelsPlayer } from '@/components/mundo-nath/ReelsPlayer';
import { useTheme } from '@/theme';
import { ColorTokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

// Image constants from MaesValentesExpo
const IMAGES = {
  nathAvatar: "https://i.imgur.com/oB9ewPG.jpg",
  cuidadosHeader: "https://i.imgur.com/LF2PX1w.jpg",
  mundoDaNath: "https://i.imgur.com/tNIrNIs.jpg",
  real1: "https://i.imgur.com/x0EOyNE.jpg",
  real2: "https://i.imgur.com/2pF5jEl.jpg",
  real3: "https://i.imgur.com/vmM9BVt.jpg",
  real4: "https://i.imgur.com/XfI71Gh.jpg",
  nvAvatar: "https://ui-avatars.com/api/?name=NV&background=ffb6c1&color=fff&size=128&font-size=0.4",
  africaProject: "https://i.imgur.com/7gXBh78.png",
  propositoImage: "https://i.imgur.com/H74CErJ.jpg",
};

const quickActions = [
  { icon: 'book-outline' as const, label: 'Diário', bgColor: '#fce7f3', iconColor: '#ec4899' },
  { icon: 'pulse-outline' as const, label: 'Saúde', bgColor: '#dbeafe', iconColor: '#3b82f6' },
  { icon: 'sparkles-outline' as const, label: 'Dicas', bgColor: '#fef3c7', iconColor: '#ca8a04' },
  { icon: 'bag-outline' as const, label: 'Enxoval', bgColor: '#f3e8ff', iconColor: '#a855f7' },
];

export default function HomeTabMaesValentes() {
  const { colors, isDark } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? colors.background.canvas : 'rgba(255,255,255,0.5)' }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text.primary }]}>
            Olá, <Text style={styles.greetingPink}>Nath Lovers!</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Confira as novidades do universo da Nath
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color={isDark ? colors.text.secondary : ColorTokens.neutral[400]} 
            />
          </TouchableOpacity>
          <Image
            source={{ uri: IMAGES.nathAvatar }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.actionsGrid}>
        {quickActions.map((action, i) => (
          <TouchableOpacity key={i} style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
              <Ionicons name={action.icon} size={24} color={action.iconColor} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* O DIA MAIS FELIZ DA MINHA VIDA! 💙 */}
      <View style={styles.section}>
        <View style={styles.videoCard}>
          <ReelsPlayer
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            thumbnailUrl={IMAGES.real1}
            title="O DIA MAIS FELIZ DA MINHA VIDA! 💙"
            duration={360}
            views={50000}
            height={400}
            autoPlay={false}
            onPlay={() => {
              logger.info('O DIA MAIS FELIZ DA MINHA VIDA video played');
            }}
          />
        </View>
      </View>

      {/* Propósito */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Propósito</Text>
        <View style={styles.propositoCard}>
          <Image
            source={{ uri: IMAGES.propositoImage }}
            style={styles.propositoImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.propositoGradient}
          >
            <Text style={styles.propositoTitle}>
              Resgatando Infâncias na África
            </Text>
            <Text style={styles.propositoDesc}>
              Alfabetização de mais de 200 crianças. Parte da renda do app é destinada a este sonho.
            </Text>
            <TouchableOpacity style={styles.propositoButton}>
              <Text style={styles.propositoButtonText}>Saiba como ajudar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Últimos Artigos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Artigos</Text>
          <TouchableOpacity style={styles.verTudoButton}>
            <Text style={styles.verTudoText}>VER TUDO</Text>
            <Ionicons name="chevron-forward" size={14} color="#f97316" />
          </TouchableOpacity>
        </View>

        {[0, 1].map((i) => (
          <TouchableOpacity key={i} style={[styles.articleCard, { backgroundColor: colors.background.card }]}>
            <Image
              source={{ uri: i === 0 ? IMAGES.real3 : IMAGES.real4 }}
              style={styles.articleImage}
            />
            <View style={styles.articleContent}>
              <Text style={styles.articleTag}>Desabafo</Text>
              <Text style={styles.articleTitle}>
                Maternidade Real: Meus medos e erros
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: ColorTokens.neutral[900],
  },
  greetingPink: {
    color: '#db2777',
  },
  subtitle: {
    fontSize: 12,
    color: ColorTokens.neutral[400],
    marginTop: 4,
    maxWidth: 200,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fed7aa',
    backgroundColor: '#FFB6C1',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.neutral[600],
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ColorTokens.neutral[900],
    marginBottom: 12,
  },
  verTudoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verTudoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f97316',
  },
  videoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  propositoCard: {
    borderRadius: 24,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
  },
  propositoImage: {
    width: '100%',
    height: '100%',
  },
  propositoGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 24,
  },
  propositoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  propositoDesc: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  propositoButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  propositoButtonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '700',
  },
  articleCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorTokens.neutral[100],
  },
  articleImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: ColorTokens.neutral[100],
  },
  articleContent: {
    flex: 1,
    justifyContent: 'center',
  },
  articleTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a855f7',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.neutral[900],
    lineHeight: 18,
  },
});
