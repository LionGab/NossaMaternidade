import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { Users, Heart, MessageSquare, Crown, TrendingUp, Clock, Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 240;

export default function CommunityScreen() {
  const { colors, isDark } = useTheme();

  const mockDiscussions = [
    {
      id: '1',
      author: 'Ana Silva',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      timeAgo: 'há 2h',
      text: 'Como vocês lidam com a culpa materna? Me sinto péssima toda vez que preciso deixar meu filho na creche...',
      likes: 24,
      replies: 12,
    },
    {
      id: '2',
      author: 'Juliana Costa',
      authorAvatar: 'https://i.pravatar.cc/150?img=2',
      timeAgo: 'há 5h',
      text: 'Alguém mais aqui amamentando e trabalhando? Preciso de dicas de como organizar as bombadas!',
      likes: 18,
      replies: 8,
    },
    {
      id: '3',
      author: 'Mariana Oliveira',
      authorAvatar: 'https://i.pravatar.cc/150?img=3',
      timeAgo: 'há 1d',
      text: 'Tive meu segundo filho e estou completamente exausta. Como vocês fazem para equilibrar a atenção entre os filhos?',
      likes: 31,
      replies: 15,
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top']}
      accessible={true}
      accessibilityLabel="Tela da Comunidade MãesValentes"
    >
      <FlatList
        data={mockDiscussions}
        keyExtractor={(item) => item.id}
        accessible={false}
        ListHeaderComponent={() => (
          <>
            {/* Hero Banner - Mães Valentes */}
            <View
              style={heroStyles.heroContainer}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Comunidade Mães Valentes - Mãe ajuda mãe. Você não está sozinha."
            >
              <ImageBackground
                source={{ uri: 'https://i.imgur.com/CN1eAvo.jpg' }}
                style={heroStyles.heroImage}
                imageStyle={heroStyles.heroImageStyle}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={heroStyles.heroGradient}
                >
                  {/* Badge Comunidade Oficial */}
                  <View style={heroStyles.heroBadge}>
                    <Sparkles size={12} color="#FFD700" />
                    <Text style={heroStyles.heroBadgeText}>COMUNIDADE OFICIAL</Text>
                  </View>

                  {/* Título e subtítulo */}
                  <Text style={heroStyles.heroTitle}>Mães Valentes</Text>
                  <Text style={heroStyles.heroSubtitle}>
                    Mãe ajuda mãe. Você não está sozinha.
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Stats Cards */}
            <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
              <View
                style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}
                accessible={true}
                accessibilityLabel="Estatística: 1.200 mães ativas na comunidade"
                accessibilityRole="text"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Users size={20} color={colors.primary.main} />
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>1.2k</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.text.secondary }}>Mães ativas</Text>
              </View>

              <View
                style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}
                accessible={true}
                accessibilityLabel="Estatística: 3.500 conversas na comunidade"
                accessibilityRole="text"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MessageSquare size={20} color={colors.primary.main} />
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>3.5k</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.text.secondary }}>Conversas</Text>
              </View>
            </View>

            {/* Angel of the Day - Com imagem hero */}
            <ImageBackground
              source={{ uri: 'https://i.imgur.com/RvWax7i.jpg' }}
              style={heroStyles.angelContainer}
              imageStyle={heroStyles.angelImageStyle}
              accessible={true}
              accessibilityLabel="Anjo do Dia: Paula Santos, mãe de 2, São Paulo. Ajudou 12 mães esta semana com apoio emocional e dicas práticas"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.75)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={heroStyles.angelGradient}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Crown size={20} color="#FFD700" />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }} accessibilityRole="header">
                    Anjo do Dia
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                    style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }}
                    contentFit="cover"
                    transition={200}
                    accessible={true}
                    accessibilityLabel="Foto de Paula Santos"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                      Paula Santos
                    </Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                      Mãe de 2 • São Paulo
                    </Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4, lineHeight: 16 }}>
                      "Ajudou 12 mães esta semana"
                    </Text>
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        alignSelf: 'flex-start',
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Conectar com Paula Santos"
                      accessibilityHint="Envia solicitação de conexão para Paula Santos"
                    >
                      <Text style={{ color: colors.primary.main, fontSize: 12, fontWeight: '600' }}>
                        Conectar
                      </Text>
                  </TouchableOpacity>
                </View>
              </View>
              </LinearGradient>
            </ImageBackground>

            {/* Trending Topics */}
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}
                accessible={true}
                accessibilityRole="header"
              >
                <TrendingUp size={18} color={colors.text.primary} />
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}
                  accessibilityLabel="Tópicos em Alta"
                >
                  Tópicos em Alta
                </Text>
              </View>
              <View style={{ height: 40, marginLeft: -16 }}>
                <FlashList
                  data={['Amamentação', 'Volta ao trabalho', 'Sono do bebê', 'Autocuidado', 'Alimentação']}
                  renderItem={({ item: topic }) => (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: isDark ? colors.background.elevated : colors.raw.primary[50],
                        borderWidth: 1,
                        borderColor: colors.border.light,
                        marginRight: 8,
                        alignSelf: 'flex-start',
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Tópico: ${topic}`}
                      accessibilityHint={`Toque para ver discussões sobre ${topic}`}
                    >
                      <Text style={{ color: colors.primary.main, fontSize: 13, fontWeight: '500' }}>
                        #{topic}
                      </Text>
                    </TouchableOpacity>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 16 }}
                  keyExtractor={(item, index) => `${item}-${index}`}
                />
              </View>
            </View>

            {/* Community Discussions Header */}
            <View
              style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}
              accessible={true}
              accessibilityRole="header"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color={colors.text.primary} />
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}
                  accessibilityLabel="Conversas Recentes"
                >
                  Conversas Recentes
                </Text>
              </View>
            </View>
          </>
        )}
        renderItem={({ item: discussion }) => (
          <TouchableOpacity
            style={{
              marginHorizontal: 16,
              padding: 12,
              backgroundColor: colors.background.card,
              borderRadius: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border.light,
            }}
            accessibilityRole="button"
            accessibilityLabel={`Discussão de ${discussion.author}, ${discussion.timeAgo}. ${discussion.text}. ${discussion.likes} curtidas, ${discussion.replies} respostas`}
            accessibilityHint="Toque para ver a discussão completa e participar"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Image
                source={{ uri: discussion.authorAvatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                contentFit="cover"
                transition={200}
                accessible={true}
                accessibilityLabel={`Foto de ${discussion.author}`}
              />
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary }}>
                {discussion.author}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
                {discussion.timeAgo}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.text.primary, lineHeight: 20, marginBottom: 12 }}>
              {discussion.text}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                accessible={true}
                accessibilityLabel={`${discussion.likes} curtidas`}
              >
                <Heart size={16} color={colors.text.tertiary} />
                <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{discussion.likes}</Text>
              </View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                accessible={true}
                accessibilityLabel={`${discussion.replies} respostas`}
              >
                <MessageSquare size={16} color={colors.text.tertiary} />
                <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{discussion.replies} respostas</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={{ padding: 16, paddingTop: 0, paddingBottom: 120 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary.main,
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
              accessibilityRole="button"
              accessibilityLabel="Iniciar Nova Conversa"
              accessibilityHint="Toque para criar uma nova discussão na comunidade"
            >
              <Text style={{ color: colors.text.inverse, fontSize: 16, fontWeight: 'bold' }}>
                + Iniciar Nova Conversa
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ======================
// 🎨 HERO STYLES
// ======================

const heroStyles = StyleSheet.create({
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    marginBottom: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 143, 163, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Angel of the Day styles
  angelContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 160,
  },
  angelImageStyle: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  angelGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});
