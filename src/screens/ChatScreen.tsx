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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sparkles, Trash2, Send, Loader2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Message } from '../types/chat';
import { geminiService } from '../services/geminiService';
import { storageService } from '../utils/storage';
import { useTheme } from '../theme/ThemeContext';

const INITIAL_CHAT_GREETING = "Oi, mãe. Tô aqui com você. Como você está se sentindo agora?";
const AVATAR_URL = "https://i.imgur.com/RRIaE7t.jpg";

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDark } = useTheme();
  
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
      <View style={{ flexDirection: 'row', width: '100%', marginBottom: 16, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
        <View
          style={{
            maxWidth: '85%',
            padding: 12,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
            backgroundColor: isUser ? colors.primary.main : colors.background.card,
            borderBottomRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: isUser ? 16 : 4,
            borderWidth: isUser ? 0 : 1,
            borderColor: isDark ? colors.border.light : 'transparent',
          }}
        >
          <Text style={{ fontSize: 14, lineHeight: 20, color: isUser ? '#FFFFFF' : colors.text.primary }}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={{ backgroundColor: colors.background.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border.light, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <TouchableOpacity
          onPress={() => { triggerHaptic(); navigation.goBack(); }}
          style={{ backgroundColor: isDark ? '#FFFFFF' : '#000000', padding: 8, borderRadius: 20 }}
        >
          <ArrowLeft size={20} color={isDark ? '#000000' : '#FFFFFF'} />
        </TouchableOpacity>

        <View style={{ position: 'relative' }}>
          <View style={{ width: 40, height: 40, backgroundColor: isDark ? colors.background.card : '#E8F0FE', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? colors.border.light : '#FFFFFF' }}>
            <Image source={{ uri: AVATAR_URL }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, backgroundColor: '#10B981', borderRadius: 6, borderWidth: 2, borderColor: colors.background.card }} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.primary.main, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 }}>
            Nossa Maternidade
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.text.primary }}>
              MãesValente
            </Text>
            <Sparkles size={12} color={colors.primary.main} />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleClearHistory}
          style={{ padding: 8, borderRadius: 20 }}
        >
          <Trash2 size={18} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Messages Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={{ flex: 1 }}>
          {messages.length <= 1 && !loading ? (
            /* Empty State */
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -48, paddingHorizontal: 24 }}>
              <View style={{ width: 144, height: 144, borderRadius: 72, borderWidth: 4, borderColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8, overflow: 'hidden', marginBottom: 16, backgroundColor: '#E5E7EB' }}>
                <Image source={{ uri: AVATAR_URL }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>

              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text.primary, marginBottom: 4, textAlign: 'center' }}>
                MãesValente
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <Sparkles size={14} color={colors.primary.main} />
                <Text style={{ color: colors.primary.main, fontWeight: '500', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Suas conversas
                </Text>
              </View>

              <Text style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 20, textAlign: 'center', maxWidth: 260 }}>
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
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}>
                    <View style={{ backgroundColor: colors.background.card, padding: 16, borderRadius: 16, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: isDark ? colors.border.light : 'transparent' }}>
                      <ActivityIndicator size="small" color={colors.text.tertiary} />
                    </View>
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* Input Area */}
        <View style={{ backgroundColor: colors.background.card, padding: 12, borderTopWidth: 1, borderTopColor: colors.border.light, paddingBottom: 32 }}>
          {!loading && messages.length < 5 && (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <FlatList
                horizontal
                data={quickChips}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setInput(item); handleSend(item); }}
                    style={{ backgroundColor: isDark ? colors.background.elevated : '#E8F0FE', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: isDark ? colors.border.light : `${colors.primary.main}33`, marginRight: 8 }}
                  >
                    <Text style={{ color: colors.primary.main, fontSize: 12, fontWeight: '500' }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Conta pra mim..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              maxLength={500}
              style={{
                flex: 1,
                backgroundColor: isDark ? colors.background.canvas : '#F3F4F6',
                color: colors.text.primary,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 14,
                maxHeight: 96,
                textAlignVertical: 'top',
              }}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                padding: 12,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
                backgroundColor: !input.trim() || loading ? '#D1D5DB' : colors.primary.main,
              }}
            >
              {loading ? (
                <Loader2 size={20} color="white" />
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
