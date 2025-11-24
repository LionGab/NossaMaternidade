import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sparkles, Trash2, Send, Loader2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { chatService, ChatMessage, ChatConversation } from '../services/chatService';
import { profileService } from '../services/profileService';

const INITIAL_CHAT_GREETING = "Oi, mãe. Tô aqui com você. Como você está se sentindo agora?";
const AVATAR_URL = "https://i.imgur.com/RRIaE7t.jpg";

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDark } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flashListRef = useRef<FlashListRef<ChatMessage>>(null);

  // Load messages on mount
  useEffect(() => {
    initializeChat();
  }, []);

  // Handle initial message from params
  useEffect(() => {
    const params = route.params as { initialMessage?: string } | undefined;
    if (params?.initialMessage && conversationId) {
      handleSend(params.initialMessage);
    }
  }, [route.params, conversationId]);

  const initializeChat = async () => {
    try {
      setLoadingMessages(true);

      // Buscar conversas existentes
      const conversations = await chatService.getConversations(1);

      if (conversations.length > 0) {
        // Usar a conversa mais recente
        const latestConv = conversations[0];
        setConversationId(latestConv.id);

        // Carregar mensagens
        const msgs = await chatService.getMessages(latestConv.id);
        setMessages(msgs);
      } else {
        // Criar nova conversa
        const profile = await profileService.getCurrentProfile();
        const newConv = await chatService.createConversation({
          title: `Conversa com ${profile?.full_name || 'Mãe'}`,
          model: 'gemini-pro',
        });

        if (newConv) {
          setConversationId(newConv.id);

          // Adicionar mensagem de boas-vindas
          const welcomeMsg = await chatService.sendMessage({
            conversation_id: newConv.id,
            content: INITIAL_CHAT_GREETING,
            role: 'assistant',
          });

          if (welcomeMsg) {
            setMessages([welcomeMsg]);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar chat:', error);
      Alert.alert('Erro', 'Não foi possível carregar o chat');
    } finally {
      setLoadingMessages(false);
    }
  };

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading || !conversationId) return;

    triggerHaptic();
    setInput('');
    setLoading(true);

    try {
      // Enviar mensagem e obter resposta da IA
      const { userMsg, aiMsg } = await chatService.sendMessageWithAI(
        conversationId,
        textToSend
      );

      if (userMsg && aiMsg) {
        setMessages(prev => [...prev, userMsg, aiMsg]);

        // Scroll to bottom
        setTimeout(() => flashListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!conversationId) return;

    Alert.alert(
      'Limpar conversa',
      'Tem certeza que deseja apagar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            triggerHaptic();

            try {
              // Deletar conversa atual
              await chatService.deleteConversation(conversationId);

              // Criar nova conversa
              const profile = await profileService.getCurrentProfile();
              const newConv = await chatService.createConversation({
                title: `Conversa com ${profile?.full_name || 'Mãe'}`,
                model: 'gemini-pro',
              });

              if (newConv) {
                setConversationId(newConv.id);

                // Adicionar mensagem de boas-vindas
                const welcomeMsg = await chatService.sendMessage({
                  conversation_id: newConv.id,
                  content: INITIAL_CHAT_GREETING,
                  role: 'assistant',
                });

                if (welcomeMsg) {
                  setMessages([welcomeMsg]);
                }
              }
            } catch (error) {
              console.error('Erro ao limpar histórico:', error);
              Alert.alert('Erro', 'Não foi possível limpar o histórico');
            }
          },
        },
      ]
    );
  };

  const quickChips = ["Estou sobrecarregada", "Medo de não ser boa mãe", "Briguei com meu parceiro"];

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={{ flexDirection: 'row', width: '100%', marginBottom: 16, justifyContent: isUser ? 'flex-end' : 'flex-start' }}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={isUser ? `Você disse: ${item.content}` : `MãesValente respondeu: ${item.content}`}
      >
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
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  if (loadingMessages) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background.canvas, alignItems: 'center', justifyContent: 'center' }}
        accessible={true}
        accessibilityLabel="Tela de Chat"
      >
        <ActivityIndicator
          size="large"
          color={colors.primary.main}
          accessibilityLabel="Carregando conversa"
        />
        <Text
          style={{ marginTop: 16, color: colors.text.secondary }}
          accessibilityLabel="Carregando conversa, por favor aguarde"
        >
          Carregando conversa...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      accessible={true}
      accessibilityLabel="Tela de Chat com MãesValente"
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={{ backgroundColor: colors.background.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border.light, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
        accessible={true}
        accessibilityRole="header"
      >
        <TouchableOpacity
          onPress={() => { triggerHaptic(); navigation.goBack(); }}
          style={{ backgroundColor: isDark ? '#FFFFFF' : '#000000', padding: 8, borderRadius: 20 }}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
        >
          <ArrowLeft size={20} color={isDark ? '#000000' : '#FFFFFF'} />
        </TouchableOpacity>

        <View
          style={{ position: 'relative' }}
          accessible={true}
          accessibilityLabel="Avatar da MãesValente. Online"
        >
          <View style={{ width: 40, height: 40, backgroundColor: isDark ? colors.background.card : '#E8F0FE', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? colors.border.light : '#FFFFFF' }}>
            <Image source={{ uri: AVATAR_URL }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={200} />
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, backgroundColor: '#10B981', borderRadius: 6, borderWidth: 2, borderColor: colors.background.card }} />
        </View>

        <View
          style={{ flex: 1 }}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Chat com MãesValente, assistente de inteligência artificial"
        >
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
          accessibilityRole="button"
          accessibilityLabel="Limpar histórico"
          accessibilityHint="Apaga todas as mensagens da conversa atual"
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
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -48, paddingHorizontal: 24 }}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Bem-vinda ao chat com MãesValente. ${INITIAL_CHAT_GREETING}`}
            >
              <View
                style={{ width: 144, height: 144, borderRadius: 72, borderWidth: 4, borderColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8, overflow: 'hidden', marginBottom: 16, backgroundColor: '#E5E7EB' }}
                accessible={true}
                accessibilityLabel="Avatar da MãesValente"
              >
                <Image source={{ uri: AVATAR_URL }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={200} />
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
            <FlashList
              ref={flashListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              accessible={false}
              ListFooterComponent={
                loading ? (
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}
                    accessible={true}
                    accessibilityLabel="MãesValente está digitando"
                  >
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
            <View style={{ flexDirection: 'row', marginBottom: 12, height: 40 }}>
              <FlashList
                horizontal
                data={quickChips}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                accessible={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setInput(item); handleSend(item); }}
                    style={{ backgroundColor: isDark ? colors.background.elevated : '#E8F0FE', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: isDark ? colors.border.light : `${colors.primary.main}33`, marginRight: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Sugestão rápida: ${item}`}
                    accessibilityHint="Toque para enviar esta mensagem"
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
              accessibilityLabel="Campo de mensagem"
              accessibilityHint="Digite sua mensagem para MãesValente"
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
              accessibilityRole="button"
              accessibilityLabel={loading ? "Enviando mensagem" : "Enviar mensagem"}
              accessibilityHint="Envia sua mensagem para MãesValente"
              accessibilityState={{ disabled: !input.trim() || loading }}
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
