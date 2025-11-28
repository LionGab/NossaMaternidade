import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../theme/ThemeContext';
import { Heart, MessageSquare, TrendingUp, Sparkles, MessagesSquare } from 'lucide-react-native';
import { HeroBanner } from '@/components/molecules/HeroBanner';

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
            {/* Hero Banner Header - MãesValentes - Estilo Premium */}
            <HeroBanner
              imageUrl="https://i.imgur.com/U5ttbqK.png"
              height={340}
              overlay={{ type: 'gradient', direction: 'bottom', opacity: 0.75 }}
              accessibilityLabel="Banner da comunidade MãesValentes - Mãe ajuda mãe. Você não está sozinha"
            >
              <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', flex: 1 }}>
                {/* Badge Comunidade Oficial */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.text.inverse, fontWeight: '700', marginRight: 4 }}>
                    ✨
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.text.inverse, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    COMUNIDADE OFICIAL
                  </Text>
                </View>

                {/* Título */}
                <Text
                  style={{ fontSize: 36, fontWeight: 'bold', color: colors.text.inverse, marginBottom: 8, letterSpacing: -0.5 }}
                  accessibilityRole="header"
                  accessibilityLabel="Mães Valentes"
                >
                  Mães Valentes
                </Text>

                {/* Subtítulo */}
                <Text
                  style={{ fontSize: 16, color: colors.text.inverse, opacity: 0.95, lineHeight: 22 }}
                  accessibilityLabel="Mãe ajuda mãe. Você não está sozinha"
                >
                  Mãe ajuda mãe. Você não está sozinha. 💛
                </Text>
              </View>
            </HeroBanner>

            {/* Stats Cards - Estatísticas da Comunidade */}
            <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
              <View
                style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}
                accessible={true}
                accessibilityLabel="Estatística: 1.200 mães conectadas na comunidade"
                accessibilityRole="text"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Heart size={20} color={colors.raw.accent.coral} fill={colors.raw.accent.coral} />
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>1.2k</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.text.secondary }}>Mães conectadas</Text>
              </View>

              <View
                style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}
                accessible={true}
                accessibilityLabel="Estatística: 3.500 trocas de apoio na comunidade"
                accessibilityRole="text"
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MessagesSquare size={20} color={colors.primary.main} />
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>3.5k</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.text.secondary }}>Trocas de apoio</Text>
              </View>
            </View>

            {/* Mãe Inspiração do Dia */}
            <View
              style={{
                margin: 16,
                marginTop: 0,
                padding: 16,
                backgroundColor: colors.background.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
              accessible={true}
              accessibilityLabel="Mãe Inspiração: Paula Santos, mãe de 2, São Paulo. Ajudou 12 mães esta semana com apoio emocional e dicas práticas"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Sparkles size={20} color={colors.raw.accent.gold} fill={colors.raw.accent.gold} />
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}
                  accessibilityRole="header"
                >
                  Mãe Inspiração do Dia
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  contentFit="cover"
                  transition={200}
                  accessible={true}
                  accessibilityLabel="Foto de Paula Santos"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
                    Paula Santos
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: 2 }}>
                    Mãe de 2 • São Paulo
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 4, lineHeight: 16 }}>
                    "Ajudou 12 mães esta semana com apoio emocional e dicas práticas"
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: colors.primary.main,
                      borderRadius: 8,
                      alignSelf: 'flex-start',
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Conectar com Paula Santos"
                    accessibilityHint="Envia solicitação de conexão para Paula Santos"
                  >
                    <Text style={{ color: colors.text.inverse, fontSize: 12, fontWeight: '600' }}>
                      Conectar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Assuntos do Momento */}
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}
                accessible={true}
                accessibilityRole="header"
              >
                <TrendingUp size={18} color={colors.raw.accent.coral} />
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}
                  accessibilityLabel="Assuntos do Momento"
                >
                  Assuntos do Momento
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

            {/* Últimas Conversas Header */}
            <View
              style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}
              accessible={true}
              accessibilityRole="header"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MessagesSquare size={18} color={colors.primary.main} />
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}
                  accessibilityLabel="Últimas Conversas"
                >
                  Últimas Conversas
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
