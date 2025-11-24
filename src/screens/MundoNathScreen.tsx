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
import { Colors } from '../constants/Colors';

const AVATAR_URL = "https://i.imgur.com/RRIaE7t.jpg";

export default function MundoNathScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // TODO: Integrate with system theme or context

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual theme switching logic
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-nath-dark-bg' : 'bg-[#F0F4F8]'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row justify-between items-start">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <Text className={`text-sm font-medium ${isDarkMode ? 'text-nath-dark-text' : 'text-gray-600'}`}>
                {getGreeting()},
              </Text>
              <Sparkles size={14} color="#FF8FA3" />
            </View>
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-nath-dark'}`}>
              {user?.name || 'Mãe'}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-nath-dark-card' : 'bg-white'} shadow-sm`}
          >
            {isDarkMode ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} color="#6B7280" />}
          </TouchableOpacity>
        </View>

        {/* Hoje eu tô com você Section */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-nath-dark'}`}>
              Hoje eu tô com você
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
              <Text className="text-nath-blue text-sm font-medium">Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {/* Card 1: Emotional Mirror (Chat) */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Chat')}
              className={`mr-4 w-72 p-5 rounded-3xl ${isDarkMode ? 'bg-nath-dark-card border-nath-dark-border' : 'bg-white'} shadow-sm border border-transparent`}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className={`p-3 rounded-2xl ${isDarkMode ? 'bg-nath-dark-bg' : 'bg-nath-light-blue'}`}>
                  <MessageCircleHeart size={24} color="#4285F4" />
                </View>
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 text-[10px] font-bold uppercase">Online agora</Text>
                </View>
              </View>
              <Text className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Como você tá se sentindo?
              </Text>
              <Text className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Desabafa comigo. Eu tô aqui pra te ouvir sem julgamentos.
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-nath-blue font-bold text-sm">Conversar agora</Text>
                <ArrowRight size={16} color="#4285F4" />
              </View>
            </TouchableOpacity>

            {/* Card 2: Anxiety Ritual */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Refugio')} // Assuming Refugio is the Ritual/Diary tab
              className={`mr-4 w-72 p-5 rounded-3xl ${isDarkMode ? 'bg-nath-dark-card border-nath-dark-border' : 'bg-white'} shadow-sm border border-transparent`}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className={`p-3 rounded-2xl ${isDarkMode ? 'bg-nath-dark-bg' : 'bg-purple-50'}`}>
                  <Wind size={24} color="#9333EA" />
                </View>
                <View className="bg-purple-100 px-2 py-1 rounded-full">
                  <Text className="text-purple-700 text-[10px] font-bold uppercase">3 min</Text>
                </View>
              </View>
              <Text className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Crise de ansiedade?
              </Text>
              <Text className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Vamos respirar juntas. Um ritual rápido pra acalmar o coração.
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-purple-600 font-bold text-sm">Começar ritual</Text>
                <PlayCircle size={16} color="#9333EA" />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Mundo Nath Section */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-nath-dark'}`}>
              Mundo Nath
            </Text>
            <View className="bg-nath-pink/20 px-2 py-0.5 rounded-md">
              <Text className="text-nath-pink text-[10px] font-bold uppercase">Exclusivo</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {MOCK_POSTS.map((post) => (
              <TouchableOpacity 
                key={post.id}
                className={`mr-4 w-60 rounded-3xl overflow-hidden ${isDarkMode ? 'bg-nath-dark-card' : 'bg-white'} shadow-sm`}
              >
                <View className="h-32 bg-gray-200 relative">
                  <Image 
                    source={{ uri: post.thumbnailUrl }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute top-3 left-3 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm flex-row items-center gap-1">
                    {post.type === 'Vídeo' && <Video size={12} color="white" />}
                    {post.type === 'Texto' && <FileText size={12} color="white" />}
                    {post.type === 'Áudio' && <Mic size={12} color="white" />}
                    {post.type === 'Reels' && <PlayCircle size={12} color="white" />}
                    <Text className="text-white text-[10px] font-medium">{post.type}</Text>
                  </View>
                  {post.isNew && (
                    <View className="absolute top-3 right-3 bg-nath-pink px-2 py-1 rounded-lg shadow-sm">
                      <Text className="text-white text-[10px] font-bold">NOVO</Text>
                    </View>
                  )}
                </View>
                <View className="p-4">
                  <Text className={`font-bold text-base leading-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-nath-blue text-xs font-bold">Ver agora</Text>
                    <ChevronRight size={12} color="#4285F4" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Waitlist Banner */}
        <View className="px-6 mb-8">
          <View className="bg-nath-dark dark:bg-nath-dark-card rounded-3xl p-6 relative overflow-hidden">
            <View className="absolute top-0 right-0 w-32 h-32 bg-nath-pink/20 rounded-full -mr-10 -mt-10" />
            <View className="absolute bottom-0 left-0 w-24 h-24 bg-nath-blue/20 rounded-full -ml-10 -mb-10" />
            
            <View className="flex-row items-center gap-2 mb-2">
              <Flame size={20} color="#FF8FA3" />
              <Text className="text-nath-pink font-bold text-xs uppercase tracking-wider">Em breve</Text>
            </View>
            
            <Text className="text-white text-xl font-bold mb-2">
              Comunidade MãesValente
            </Text>
            <Text className="text-gray-300 text-sm mb-6 leading-relaxed">
              Um espaço seguro para trocar experiências com outras mães que te entendem de verdade.
            </Text>

            <TouchableOpacity 
              className="bg-white w-full py-3 rounded-xl items-center flex-row justify-center gap-2"
              onPress={() => Linking.openURL('https://forms.gle/waitlist')}
            >
              <Text className="text-nath-dark font-bold">Entrar na lista de espera</Text>
              <ArrowRight size={16} color="#5D4E4B" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
