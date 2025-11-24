import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Sparkles, 
  PlayCircle, 
  FileText, 
  Mic, 
  Video, 
  ChevronRight, 
  Sun, 
  Moon, 
  Wind, 
  BedDouble, 
  MessageCircleHeart, 
  ArrowRight, 
  Heart, 
  Flame 
} from 'lucide-react-native';
import { MOCK_POSTS } from '../constants/data';
import { UserProfile } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const AVATAR_URL = "https://i.imgur.com/RRIaE7t.jpg";

export default function MundoNathScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('nath_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default mock user if none exists
        setUser({ name: 'Mãe' });
      }
    } catch (e) {
      console.error('Error loading user', e);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text.secondary }}>
                {getGreeting()},
              </Text>
              <Sparkles size={14} color="#FF8FA3" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.primary }}>
              {user?.name || 'Mãe'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            style={{ padding: 8, borderRadius: 20, backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
          >
            {isDark ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} color="#6B7280" />}
          </TouchableOpacity>
        </View>

        {/* Hoje eu tô com você Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text.primary }}>
              Hoje eu tô com você
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
              <Text style={{ color: colors.primary.main, fontSize: 14, fontWeight: '500' }}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: -24, paddingLeft: 24 }}>
            {/* Card 1: Emotional Mirror (Chat) */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Chat')}
              style={{ marginRight: 16, width: 288, padding: 20, borderRadius: 24, backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: isDark ? colors.border.light : 'transparent' }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ padding: 12, borderRadius: 16, backgroundColor: isDark ? colors.background.canvas : '#E8F0FE' }}>
                  <MessageCircleHeart size={24} color="#4285F4" />
                </View>
                <View style={{ backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: '#047857', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Online agora</Text>
                </View>
              </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: colors.text.primary }}>
                Como você tá se sentindo?
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 16, color: colors.text.secondary }}>
                Desabafa comigo. Eu tô aqui pra te ouvir sem julgamentos.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: colors.primary.main, fontWeight: 'bold', fontSize: 14 }}>Conversar agora</Text>
                <ArrowRight size={16} color={colors.primary.main} />
              </View>
            </TouchableOpacity>

            {/* Card 2: Anxiety Ritual */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Refugio')}
              style={{ marginRight: 16, width: 288, padding: 20, borderRadius: 24, backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: isDark ? colors.border.light : 'transparent' }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ padding: 12, borderRadius: 16, backgroundColor: isDark ? colors.background.canvas : '#F3E8FF' }}>
                  <Wind size={24} color="#9333EA" />
                </View>
                <View style={{ backgroundColor: '#F3E8FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: '#7E22CE', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>3 min</Text>
                </View>
              </View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: colors.text.primary }}>
                Crise de ansiedade?
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 16, color: colors.text.secondary }}>
                Vamos respirar juntas. Um ritual rápido pra acalmar o coração.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: '#9333EA', fontWeight: 'bold', fontSize: 14 }}>Começar ritual</Text>
                <PlayCircle size={16} color="#9333EA" />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Mundo Nath Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text.primary }}>
              Mundo Nath
            </Text>
            <View style={{ backgroundColor: 'rgba(255, 143, 163, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: '#FF8FA3', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Exclusivo</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: -24, paddingLeft: 24 }}>
            {MOCK_POSTS.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={{ marginRight: 16, width: 240, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
              >
                <View style={{ height: 128, backgroundColor: '#E5E7EB', position: 'relative' }}>
                  <Image
                    source={{ uri: post.thumbnailUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {post.type === 'Vídeo' && <Video size={12} color="white" />}
                    {post.type === 'Texto' && <FileText size={12} color="white" />}
                    {post.type === 'Áudio' && <Mic size={12} color="white" />}
                    {post.type === 'Reels' && <PlayCircle size={12} color="white" />}
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '500' }}>{post.type}</Text>
                  </View>
                  {post.isNew && (
                    <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#FF8FA3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>NOVO</Text>
                    </View>
                  )}
                </View>
                <View style={{ padding: 16 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, lineHeight: 20, marginBottom: 8, color: colors.text.primary }} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: colors.primary.main, fontSize: 12, fontWeight: 'bold' }}>Ver agora</Text>
                    <ChevronRight size={12} color={colors.primary.main} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Waitlist Banner */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ backgroundColor: isDark ? colors.background.card : '#5D4E4B', borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: 0, right: 0, width: 128, height: 128, backgroundColor: 'rgba(255, 143, 163, 0.2)', borderRadius: 64, marginRight: -40, marginTop: -40 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: 96, height: 96, backgroundColor: 'rgba(66, 133, 244, 0.2)', borderRadius: 48, marginLeft: -40, marginBottom: -40 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Flame size={20} color="#FF8FA3" />
              <Text style={{ color: '#FF8FA3', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Em breve</Text>
            </View>

            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
              Comunidade MãesValente
            </Text>
            <Text style={{ color: '#D1D5DB', fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
              Um espaço seguro para trocar experiências com outras mães que te entendem de verdade.
            </Text>

            <TouchableOpacity
              style={{ backgroundColor: '#FFFFFF', width: '100%', paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              onPress={() => Linking.openURL('https://forms.gle/waitlist')}
            >
              <Text style={{ color: '#5D4E4B', fontWeight: 'bold' }}>Entrar na lista de espera</Text>
              <ArrowRight size={16} color="#5D4E4B" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
