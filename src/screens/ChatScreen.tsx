import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sparkles, Trash2, Send, Loader2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Message } from '../types/chat';
import { geminiService } from '../services/geminiService';
import { storageService } from '../utils/storage';
import { Colors } from '../constants/Colors';

const INITIAL_CHAT_GREETING = "Oi, mãe. Tô aqui com você. Como você está se sentindo agora?";
const AVATAR_URL = "https://i.imgur.com/RRIaE7t.jpg";

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  // Handle initial message from params
  useEffect(() => {
    const params = route.params as { initialMessage?: string } | undefined;
    if (params?.initialMessage) {
      setInput(params.initialMessage);
    }
  }, [route.params]);

  const loadMessages = async () => {
    const saved = await storageService.loadMessages();
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      setMessages([{
        id: 'init',
        role: 'assistant', // mapped from 'model'
        text: INITIAL_CHAT_GREETING,
        timestamp: Date.now(),
      }]);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    await storageService.saveMessages(newMessages);
  };

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    triggerHaptic();

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    await saveMessages(newMessages);

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Call Gemini
    // We need to map our Message type to what geminiService expects if they differ
    // geminiService expects { role: 'user' | 'model' | 'assistant', text: string }
    // Our Message type has role: 'user' | 'assistant'
    const historyForService = newMessages.map(m => ({
      role: m.role,
      text: m.text
    }));

    const response = await geminiService.sendMessage(textToSend, historyForService);

    const newAiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: response.text || "Desculpe, não consegui responder agora.",
      timestamp: Date.now(),
    };

    const updatedMessages = [...newMessages, newAiMsg];
    setMessages(updatedMessages);
    setLoading(false);
    await saveMessages(updatedMessages);
    
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleClearHistory = async () => {
    triggerHaptic();
    const resetState: Message[] = [{
      id: Date.now().toString(),
      role: 'assistant',
      text: INITIAL_CHAT_GREETING,
      timestamp: Date.now()
    }];
    setMessages(resetState);
    await storageService.saveMessages(resetState);
  };

  const quickChips = ["Estou sobrecarregada", "Medo de não ser boa mãe", "Briguei com meu parceiro"];

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View className={`flex-row w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <View
          className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-nath-dark-hero rounded-br-none'
              : 'bg-white dark:bg-nath-dark-card rounded-bl-none border border-transparent dark:border-nath-dark-border'
          }`}
        >
          <Text className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-700 dark:text-nath-dark-text'}`}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F4F8] dark:bg-nath-dark-bg">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white dark:bg-nath-dark-tab p-4 flex-row items-center gap-3 border-b border-gray-100 dark:border-nath-dark-border shadow-sm z-10">
        <TouchableOpacity
          onPress={() => { triggerHaptic(); navigation.goBack(); }}
          className="bg-black dark:bg-white p-2 rounded-full"
        >
          <ArrowLeft size={20} color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>

        <View className="relative">
          <View className="w-10 h-10 bg-nath-light-blue dark:bg-nath-dark-card rounded-full overflow-hidden border border-white dark:border-nath-dark-border">
            <Image source={{ uri: AVATAR_URL }} className="w-full h-full" resizeMode="cover" />
          </View>
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-nath-dark-tab" />
        </View>

        <View className="flex-1">
          <Text className="text-[10px] font-bold text-nath-blue uppercase tracking-widest mb-0.5">
            Nossa Maternidade
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="font-bold text-lg text-nath-dark dark:text-nath-dark-text">
              MãesValente
            </Text>
            <Sparkles size={12} color="#4285F4" />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleClearHistory}
          className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-nath-dark-card"
        >
          <Trash2 size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View className="flex-1">
          {messages.length <= 1 && !loading ? (
            /* Empty State */
            <View className="flex-1 items-center justify-center -mt-12 px-6">
              <View className="w-36 h-36 rounded-full border-4 border-white dark:border-nath-dark-card shadow-xl overflow-hidden mb-4 bg-gray-200">
                <Image source={{ uri: AVATAR_URL }} className="w-full h-full" resizeMode="cover" />
              </View>
              
              <Text className="text-3xl font-bold text-nath-dark dark:text-white mb-1 text-center">
                MãesValente
              </Text>
              <View className="flex-row items-center gap-2 mb-6">
                <Sparkles size={14} color="#4285F4" />
                <Text className="text-nath-blue dark:text-nath-dark-hero font-medium text-sm tracking-wide uppercase">
                  Suas conversas
                </Text>
              </View>
              
              <Text className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed text-center max-w-[260px]">
                {INITIAL_CHAT_GREETING}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                loading ? (
                  <View className="flex-row justify-start mb-4">
                    <View className="bg-white dark:bg-nath-dark-card p-4 rounded-2xl rounded-bl-none shadow-sm border border-transparent dark:border-nath-dark-border">
                      <ActivityIndicator size="small" color="#9CA3AF" />
                    </View>
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* Input Area */}
        <View className="bg-white dark:bg-nath-dark-tab p-3 border-t border-gray-100 dark:border-nath-dark-border pb-8">
          {!loading && messages.length < 5 && (
            <View className="flex-row gap-2 mb-3">
              <FlatList
                horizontal
                data={quickChips}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setInput(item); handleSend(item); }}
                    className="bg-nath-light-blue dark:bg-nath-dark-card px-4 py-2.5 rounded-full border border-nath-blue/20 dark:border-nath-dark-border mr-2"
                  >
                    <Text className="text-nath-blue dark:text-nath-blue text-xs font-medium">
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View className="flex-row gap-2 items-end">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Conta pra mim..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              className="flex-1 bg-gray-100 dark:bg-nath-dark-bg dark:text-white rounded-2xl px-4 py-3 text-sm max-h-24"
              style={{ textAlignVertical: 'top' }}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
              className={`p-3 rounded-full items-center justify-center shadow-md ${
                !input.trim() || loading ? 'bg-gray-300' : 'bg-nath-blue dark:bg-nath-dark-hero'
              }`}
            >
              {loading ? (
                <Loader2 size={20} color="white" className="animate-spin" />
              ) : (
                <Send size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
