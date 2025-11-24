import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
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
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Erro ao fazer parse do usuário:', parseError);
          // Dados corrompidos, usar default
          setUser({ name: 'Mãe' });
          // Limpar dados corrompidos
          await AsyncStorage.removeItem('nath_user');
        }
      } else {
        // Default mock user if none exists
        setUser({ name: 'Mãe' });
      }
    } catch (e) {
      console.error('Error loading user', e);
      // Fallback seguro
      setUser({ name: 'Mãe' });
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

          <View style={{ height: 200, marginLeft: -24 }}>
            <FlashList
              data={[
                {
                  id: 'chat',
                  type: 'chat',
                  title: 'Como você tá se sentindo?',
                  description: 'Desabafa comigo. Eu tô aqui pra te ouvir sem julgamentos.',
                  action: 'Conversar agora',
                  icon: MessageCircleHeart,
                  iconColor: '#4285F4',
                  bgColor: isDark ? colors.background.canvas : '#E8F0FE',
                  badge: { text: 'Online agora', bg: '#D1FAE5', textColor: '#047857' },
                  actionColor: colors.primary.main,
                  onPress: () => navigation.navigate('Chat'),
                },
                {
                  id: 'ritual',
                  type: 'ritual',
                  title: 'Crise de ansiedade?',
                  description: 'Vamos respirar juntas. Um ritual rápido pra acalmar o coração.',
                  action: 'Começar ritual',
                  icon: Wind,
                  iconColor: '#9333EA',
                  bgColor: isDark ? colors.background.canvas : '#F3E8FF',
                  badge: { text: '3 min', bg: '#F3E8FF', textColor: '#7E22CE' },
                  actionColor: '#9333EA',
                  onPress: () => navigation.navigate('Refugio'),
                },
              ]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={item.onPress}
                  style={{ marginRight: 16, width: 288, padding: 20, borderRadius: 24, backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: isDark ? colors.border.light : 'transparent' }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <View style={{ padding: 12, borderRadius: 16, backgroundColor: item.bgColor }}>
                      <item.icon size={24} color={item.iconColor} />
                    </View>
                    {item.badge && (
                      <View style={{ backgroundColor: item.badge.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                        <Text style={{ color: item.badge.textColor, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>{item.badge.text}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: colors.text.primary }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 14, marginBottom: 16, color: colors.text.secondary }}>
                    {item.description}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: item.actionColor, fontWeight: 'bold', fontSize: 14 }}>{item.action}</Text>
                    {item.type === 'ritual' ? (
                      <PlayCircle size={16} color={item.actionColor} />
                    ) : (
                      <ArrowRight size={16} color={item.actionColor} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
              keyExtractor={(item) => item.id}
            />
          </View>
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

          <View style={{ height: 248, marginLeft: -24 }}>
            <FlashList
              data={MOCK_POSTS}
              renderItem={({ item: post }) => (
                <TouchableOpacity
                  style={{ marginRight: 16, width: 240, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
                >
                  <View style={{ height: 128, backgroundColor: '#E5E7EB', position: 'relative' }}>
                    <Image
                      source={{ uri: post.thumbnailUrl }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      {post.type === 'video' && <Video size={12} color="white" />}
                      {post.type === 'article' && <FileText size={12} color="white" />}
                      {post.type === 'audio' && <Mic size={12} color="white" />}
                      {post.type === 'reels' && <PlayCircle size={12} color="white" />}
                      {post.type === 'text' && <FileText size={12} color="white" />}
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
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
              keyExtractor={(item) => item.id}
            />
          </View>
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
