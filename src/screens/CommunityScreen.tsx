import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Users, Heart, MessageSquare, Crown, TrendingUp, Clock } from 'lucide-react-native';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      <ScrollView>
        {/* Header */}
        <View style={{ padding: 16, backgroundColor: colors.background.card, borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>
            MãesValentes
          </Text>
          <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 4 }}>
            Sua rede de apoio maternal
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Users size={20} color={colors.primary.main} />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>1.2k</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.text.secondary }}>Mães ativas</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MessageSquare size={20} color={colors.primary.main} />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>3.5k</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.text.secondary }}>Conversas</Text>
          </View>
        </View>

        {/* Angel of the Day */}
        <View style={{
          margin: 16,
          marginTop: 0,
          padding: 16,
          backgroundColor: colors.background.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Crown size={20} color="#F59E0B" />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}>
              Anjo do Dia
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
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
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                  Conectar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Trending Topics */}
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp size={18} color={colors.text.primary} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}>
              Tópicos em Alta
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: -16, paddingLeft: 16 }}>
            {['Amamentação', 'Volta ao trabalho', 'Sono do bebê', 'Autocuidado', 'Alimentação'].map((topic, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isDark ? colors.background.elevated : '#E8F0FE',
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: colors.primary.main, fontSize: 13, fontWeight: '500' }}>
                  #{topic}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Discussions */}
        <View style={{ padding: 16, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Clock size={18} color={colors.text.primary} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary }}>
              Conversas Recentes
            </Text>
          </View>

          {mockDiscussions.map((discussion) => (
            <TouchableOpacity
              key={discussion.id}
              style={{
                padding: 12,
                backgroundColor: colors.background.card,
                borderRadius: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border.light,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Image
                  source={{ uri: discussion.authorAvatar }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Heart size={16} color={colors.text.tertiary} />
                  <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{discussion.likes}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MessageSquare size={16} color={colors.text.tertiary} />
                  <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{discussion.replies} respostas</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <View style={{ padding: 16, paddingTop: 0, paddingBottom: 32 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary.main,
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
              + Iniciar Nova Conversa
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
