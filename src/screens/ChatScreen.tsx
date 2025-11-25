import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sparkles, Trash2, Send, Loader2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { Tokens } from '../theme';
import { chatService, ChatMessage, ChatConversation } from '../services/chatService';
import { profileService } from '../services/profileService';
import { MessageBubble } from '../components/MessageBubble';

const INITIAL_CHAT_GREETING = "Oi, mãe. Tô aqui com você. Como você está se sentindo agora?";
const AVATAR_URL = "https://i.imgur.com/oB9ewPG.jpg";

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [avatarError, setAvatarError] = useState(false);
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

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageBubble
      content={item.content}
      isUser={item.role === 'user'}
      timestamp={new Date(item.created_at)}
    />
  );

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
      edges={['top']}
      accessible={true}
      accessibilityLabel="Tela de Chat com NathIA"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{ backgroundColor: colors.background.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border.light, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
        accessible={true}
        accessibilityRole="header"
      >
        <TouchableOpacity
          onPress={() => { triggerHaptic(); navigation.goBack(); }}
          style={{ backgroundColor: colors.text.primary, padding: 8, borderRadius: 20 }}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
        >
          <ArrowLeft size={20} color={colors.background.card} />
        </TouchableOpacity>

        <View
          style={{ position: 'relative' }}
          accessible={true}
          accessibilityLabel="Avatar da NathIA. Online"
        >
          <View style={{ width: 32, height: 32, backgroundColor: isDark ? colors.background.card : colors.primary.light, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? colors.border.light : colors.background.card }}>
            {!avatarError ? (
              <Image 
                source={{ uri: AVATAR_URL }} 
                style={{ width: '100%', height: '100%' }} 
                contentFit="cover" 
                transition={200}
                cachePolicy="memory-disk"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.light }}>
                <Text style={{ color: colors.primary.main, fontSize: 16 }}>💙</Text>
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, backgroundColor: colors.status.success, borderRadius: 4, borderWidth: 1.5, borderColor: colors.background.card }} />
        </View>

        <View
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Chat com NathIA, assistente de inteligência artificial"
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 36, height: 36, borderRadius: 8 }}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Logo Nossa Maternidade"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: Tokens.typography.sizes['3xs'], fontWeight: Tokens.typography.weights.bold, color: colors.primary.main, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 }}>
              Nossa Maternidade
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontWeight: Tokens.typography.weights.bold, fontSize: Tokens.typography.sizes.lg, color: colors.text.primary }}>
                NathIA
              </Text>
              <Sparkles size={12} color={colors.primary.main} />
            </View>
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
              accessibilityLabel={`Bem-vinda ao chat com NathIA. ${INITIAL_CHAT_GREETING}`}
            >
              <View
                style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 6, overflow: 'hidden', marginBottom: 12, backgroundColor: colors.border.medium }}
                accessible={true}
                accessibilityLabel="Avatar da NathIA"
              >
                {!avatarError ? (
                  <Image 
                    source={{ uri: AVATAR_URL }} 
                    style={{ width: '100%', height: '100%' }} 
                    contentFit="cover" 
                    transition={200}
                    cachePolicy="memory-disk"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.light }}>
                    <Text style={{ color: colors.primary.main, fontSize: 44 }}>💙</Text>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: Tokens.typography.sizes['3xl'], fontWeight: Tokens.typography.weights.bold, color: colors.text.primary, marginBottom: 4, textAlign: 'center' }}>
                NathIA
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <Sparkles size={14} color={colors.primary.main} />
                <Text style={{ color: colors.primary.main, fontWeight: Tokens.typography.weights.medium, fontSize: Tokens.typography.sizes.sm, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Suas conversas
                </Text>
              </View>

              <Text style={{ color: colors.text.secondary, fontSize: Tokens.typography.sizes.sm, lineHeight: Tokens.typography.lineHeights.sm, textAlign: 'center', maxWidth: 260 }}>
                {INITIAL_CHAT_GREETING}
              </Text>
            </View>
          ) : (
            <FlashList
              ref={flashListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              accessible={false}
              ListFooterComponent={
                loading ? (
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 }}
                    accessible={true}
                    accessibilityLabel="NathIA está digitando"
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
                    style={{ backgroundColor: isDark ? colors.background.elevated : colors.primary.light, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: isDark ? colors.border.light : `${colors.primary.main}33`, marginRight: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Sugestão rápida: ${item}`}
                    accessibilityHint="Toque para enviar esta mensagem"
                  >
                    <Text style={{ color: colors.primary.main, fontSize: Tokens.typography.sizes.xs, fontWeight: Tokens.typography.weights.medium }}>
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
                backgroundColor: isDark ? colors.background.canvas : colors.background.input,
                color: colors.text.primary,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: Tokens.typography.sizes.sm,
                maxHeight: 96,
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: colors.border.light
              }}
              accessibilityLabel="Campo de mensagem"
              accessibilityHint="Digite sua mensagem para NathIA"
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
                backgroundColor: !input.trim() || loading ? colors.text.disabled : colors.primary.main,
              }}
              accessibilityRole="button"
              accessibilityLabel={loading ? "Enviando mensagem" : "Enviar mensagem"}
              accessibilityHint="Envia sua mensagem para NathIA"
              accessibilityState={{ disabled: !input.trim() || loading }}
            >
              {loading ? (
                <Loader2 size={20} color={colors.text.inverse} />
              ) : (
                <Send size={20} color={colors.text.inverse} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
