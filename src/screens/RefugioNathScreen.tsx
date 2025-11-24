import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Play, Pause, Wind, Moon, Heart, Volume2, Timer, Sparkles } from 'lucide-react-native';

interface Ritual {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: typeof Wind;
  color: string;
  category: 'breathing' | 'meditation' | 'self-care';
}

export default function RefugioNathScreen() {
  const { colors, isDark } = useTheme();
  const [playing, setPlaying] = useState<number | null>(null);

  const rituals: Ritual[] = [
    {
      id: 1,
      title: 'Respiração 4-7-8',
      description: 'Técnica de respiração para acalmar a ansiedade rapidamente',
      duration: '3 min',
      icon: Wind,
      color: '#3B82F6',
      category: 'breathing',
    },
    {
      id: 2,
      title: 'Meditação do Sono',
      description: 'Relaxamento profundo para uma noite tranquila',
      duration: '10 min',
      icon: Moon,
      color: '#8B5CF6',
      category: 'meditation',
    },
    {
      id: 3,
      title: 'Autocuidado Maternal',
      description: 'Momento de conexão com você mesma',
      duration: '5 min',
      icon: Heart,
      color: '#EC4899',
      category: 'self-care',
    },
    {
      id: 4,
      title: 'Respiração Relaxante',
      description: 'Exercício suave para momentos de estresse',
      duration: '2 min',
      icon: Wind,
      color: '#10B981',
      category: 'breathing',
    },
    {
      id: 5,
      title: 'Meditação da Gratidão',
      description: 'Cultive sentimentos de gratidão e positividade',
      duration: '7 min',
      icon: Sparkles,
      color: '#F59E0B',
      category: 'meditation',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: colors.background.card, borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary, marginBottom: 4 }}>
          Refúgio Nath
        </Text>
        <Text style={{ fontSize: 14, color: colors.text.secondary }}>
          Momentos de calma para você
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Quick Stats */}
        <View style={{ flexDirection: 'row', marginBottom: 24, gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border.light }}>
            <Timer size={20} color={colors.primary.main} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.primary }}>12</Text>
            <Text style={{ fontSize: 12, color: colors.text.secondary }}>Rituals feitos</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.background.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border.light }}>
            <Volume2 size={20} color={colors.primary.main} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.primary }}>45min</Text>
            <Text style={{ fontSize: 12, color: colors.text.secondary }}>Esta semana</Text>
          </View>
        </View>

        {/* Categories Filter (optional) */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: 12 }}>
            Escolha seu ritual
          </Text>
        </View>

        {/* Rituals List */}
        {rituals.map((ritual) => {
          const Icon = ritual.icon;
          const isPlaying = playing === ritual.id;

          return (
            <TouchableOpacity
              key={ritual.id}
              onPress={() => setPlaying(isPlaying ? null : ritual.id)}
              style={{
                padding: 16,
                backgroundColor: colors.background.card,
                borderRadius: 16,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                borderWidth: isPlaying ? 2 : 1,
                borderColor: isPlaying ? ritual.color : colors.border.light,
                shadowColor: isPlaying ? ritual.color : '#000',
                shadowOffset: { width: 0, height: isPlaying ? 4 : 1 },
                shadowOpacity: isPlaying ? 0.3 : 0.05,
                shadowRadius: isPlaying ? 8 : 2,
                elevation: isPlaying ? 8 : 1,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: `${ritual.color}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={28} color={ritual.color} />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary, marginBottom: 2 }}>
                  {ritual.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.text.secondary, marginBottom: 6, lineHeight: 16 }}>
                  {ritual.description}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Timer size={12} color={colors.text.tertiary} />
                  <Text style={{ fontSize: 12, color: colors.text.tertiary, fontWeight: '500' }}>
                    {ritual.duration}
                  </Text>
                </View>
              </View>

              {/* Play/Pause Button */}
              <TouchableOpacity
                onPress={() => setPlaying(isPlaying ? null : ritual.id)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isPlaying ? ritual.color : colors.primary.main,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: ritual.color,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isPlaying ? 0.4 : 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                {isPlaying ? (
                  <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* Bottom CTA */}
        <View style={{ marginTop: 8, padding: 20, backgroundColor: isDark ? colors.background.card : '#F0F7FF', borderRadius: 16, borderWidth: 1, borderColor: colors.border.light }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text.primary, marginBottom: 8 }}>
            Precisa de mais ajuda?
          </Text>
          <Text style={{ fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 12 }}>
            Converse com a MãesValente IA para receber suporte personalizado
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary.main,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
              Falar com a IA
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
