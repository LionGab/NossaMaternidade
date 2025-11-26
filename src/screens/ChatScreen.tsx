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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Sparkles,
  Trash2,
  Send,
  Loader2,
  Zap,
  Brain,
  Globe,
  Mic,
  Square,
  AudioLines,
  MessageCircle,
  ImagePlus,
  X
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import { Tokens } from '../theme';
import { chatService, ChatMessage, ChatConversation } from '../services/chatService';
import { profileService } from '../services/profileService';
import { MessageBubble } from '../components/MessageBubble';
import { HeroBanner } from '@/components/molecules/HeroBanner';
import { logger } from '../utils/logger';

const INITIAL_CHAT_GREETING = "Oi, mãe. Tô aqui com você. Como você está se sentindo agora?";
const AVATAR_URL = "https://i.imgur.com/oB9ewPG.jpg";

// Suggestion Chips for Quick Responses
const SUGGESTION_CHIPS = [
  "Meu bebê não dorme 😴",
  "Dica de alimentação 🍎",
  "Estou exausta 😔",
  "O que fazer com cólica? 🍼",
  "Ideia de brincadeira 🧸",
  "Como voltar ao trabalho? 💼"
];

type AIMode = 'fast' | 'balanced' | 'thinking' | 'search';

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

  // AI Mode & Recording States
  const [aiMode, setAiMode] = useState<AIMode>('balanced');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load messages on mount
  useEffect(() => {
    initializeChat();
  }, []);

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
      logger.error('Erro ao inicializar chat', error);
      Alert.alert('Erro', 'Não foi possível carregar o chat');
    } finally {
      setLoadingMessages(false);
    }
  };

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSend = React.useCallback(async (textOverride?: string) => {
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
      logger.error('Erro ao enviar mensagem', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    } finally {
      setLoading(false);
    }
  }, [conversationId, input, loading]);

  // Handle initial message from params
  useEffect(() => {
    const params = route.params as { initialMessage?: string } | undefined;
    if (params?.initialMessage && conversationId) {
      handleSend(params.initialMessage);
    }
  }, [route.params, conversationId, handleSend]);

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
                logger.error('Erro ao limpar histórico', error);
                Alert.alert('Erro', 'Não foi possível limpar o histórico');
              }
            },
          },
        ]
      );
    };

  // Placeholder for audio recording (future implementation)
  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsTranscribing(true);
      // Simulate transcription
      setTimeout(() => {
        setInput(prev => prev + (prev ? ' ' : '') + 'Texto transcrito do áudio...');
        setIsTranscribing(false);
      }, 2000);
    } else {
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Image Picker Handler (Web Reference: Multimodal Input)
  const handleImagePick = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar suas fotos.'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Optimize for mobile upload
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      logger.error('Error picking image', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

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
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Chat com NathIA, assistente de inteligência artificial"
        >
          <Text style={{ fontWeight: Tokens.typography.weights.bold, fontSize: Tokens.typography.sizes.lg, color: colors.text.primary }}>
            NathIA
          </Text>
          <Sparkles size={12} color={colors.primary.main} />
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

      {/* Hero Banner - NathIA */}
      <HeroBanner
        imageUrl="https://i.imgur.com/t3EFCQT.png"
        height={200}
        overlay={{ type: 'gradient', direction: 'bottom', opacity: isDark ? 0.65 : 0.5 }}
        accessibilityLabel="Banner da NathIA, assistente de inteligência artificial maternal"
      />

      {/* AI Mode Toolbar - Premium */}
      <View
        style={{
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>
          Modo:
        </Text>

        {/* Fast Mode */}
        <TouchableOpacity
          onPress={() => { setAiMode('fast'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: aiMode === 'fast' ? '#FCD34D' : 'transparent',
            borderWidth: 1,
            borderColor: aiMode === 'fast' ? '#FCD34D' : colors.border.medium,
          }}
          accessibilityRole="button"
          accessibilityLabel="Modo rápido"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Zap size={14} color={aiMode === 'fast' ? '#78350F' : colors.text.tertiary} fill={aiMode === 'fast' ? '#78350F' : 'none'} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: aiMode === 'fast' ? '#78350F' : colors.text.tertiary }}>
              Rápido
            </Text>
          </View>
        </TouchableOpacity>

        {/* Balanced Mode */}
        <TouchableOpacity
          onPress={() => { setAiMode('balanced'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: aiMode === 'balanced' ? colors.primary.main : 'transparent',
            borderWidth: 1,
            borderColor: aiMode === 'balanced' ? colors.primary.main : colors.border.medium,
          }}
          accessibilityRole="button"
          accessibilityLabel="Modo equilibrado"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Sparkles size={14} color={aiMode === 'balanced' ? '#FFFFFF' : colors.text.tertiary} fill={aiMode === 'balanced' ? '#FFFFFF' : 'none'} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: aiMode === 'balanced' ? '#FFFFFF' : colors.text.tertiary }}>
              Equilibrado
            </Text>
          </View>
        </TouchableOpacity>

        {/* Thinking Mode */}
        <TouchableOpacity
          onPress={() => { setAiMode('thinking'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: aiMode === 'thinking' ? '#6366F1' : 'transparent',
            borderWidth: 1,
            borderColor: aiMode === 'thinking' ? '#6366F1' : colors.border.medium,
          }}
          accessibilityRole="button"
          accessibilityLabel="Modo raciocínio profundo"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Brain size={14} color={aiMode === 'thinking' ? '#FFFFFF' : colors.text.tertiary} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: aiMode === 'thinking' ? '#FFFFFF' : colors.text.tertiary }}>
              Pensar
            </Text>
          </View>
        </TouchableOpacity>

        {/* Search Mode */}
        <TouchableOpacity
          onPress={() => { setAiMode('search'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: aiMode === 'search' ? '#10B981' : 'transparent',
            borderWidth: 1,
            borderColor: aiMode === 'search' ? '#10B981' : colors.border.medium,
          }}
          accessibilityRole="button"
          accessibilityLabel="Modo pesquisa web"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Globe size={14} color={aiMode === 'search' ? '#FFFFFF' : colors.text.tertiary} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: aiMode === 'search' ? '#FFFFFF' : colors.text.tertiary }}>
              Buscar
            </Text>
          </View>
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

        {/* Input Area - Premium Style */}
        <View style={{ backgroundColor: colors.background.card, padding: 12, borderTopWidth: 1, borderTopColor: colors.border.light, paddingBottom: 32 }}>
          {/* Suggestion Chips - Show when not recording/transcribing */}
          {!loading && !isRecording && !isTranscribing && messages.length < 10 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 12 }}
              contentContainerStyle={{ gap: 8, paddingRight: 16 }}
            >
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); handleSend(chip); }}
                  disabled={loading}
                  style={{
                    backgroundColor: isDark ? colors.background.elevated : colors.primary.light,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? colors.border.light : `${colors.primary.main}33`,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Sugestão: ${chip}`}
                >
                  <MessageCircle size={12} color={colors.primary.main} opacity={0.7} />
                  <Text style={{ color: colors.primary.main, fontSize: Tokens.typography.sizes.xs, fontWeight: Tokens.typography.weights.bold }}>
                    {chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            {/* Recording/Transcribing State OR Normal Input */}
            {isRecording ? (
              <TouchableOpacity
                onPress={handleMicClick}
                style={{
                  flex: 1,
                  backgroundColor: '#FEE2E2',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderWidth: 2,
                  borderColor: '#EF4444',
                }}
                accessibilityRole="button"
                accessibilityLabel="Gravando áudio, toque para parar"
              >
                <AudioLines size={24} color="#EF4444" />
                <Text style={{ color: '#DC2626', fontSize: Tokens.typography.sizes.sm, fontWeight: Tokens.typography.weights.bold, flex: 1 }}>
                  Gravando... (Toque para parar)
                </Text>
              </TouchableOpacity>
            ) : isTranscribing ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.background.elevated,
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                }}
              >
                <Loader2 size={20} color={colors.primary.main} className="animate-spin" />
                <Text style={{ color: colors.text.secondary, fontSize: Tokens.typography.sizes.sm, fontWeight: Tokens.typography.weights.medium }}>
                  Transcrevendo áudio...
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? colors.background.canvas : colors.background.input, borderRadius: 20, borderWidth: 1, borderColor: colors.border.light }}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Conta pra mim..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  maxLength={500}
                  style={{
                    flex: 1,
                    color: colors.text.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: Tokens.typography.sizes.sm,
                    maxHeight: 96,
                    textAlignVertical: 'top',
                  }}
                  accessibilityLabel="Campo de mensagem"
                  accessibilityHint="Digite sua mensagem para NathIA"
                />
                {/* Image Picker Button Inside Input */}
                <TouchableOpacity
                  onPress={handleImagePick}
                  style={{
                    padding: 10,
                    marginRight: 0,
                    borderRadius: 16,
                    backgroundColor: 'transparent',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Adicionar imagem"
                >
                  <ImagePlus size={22} color={colors.text.tertiary} />
                </TouchableOpacity>
                {/* Mic Button Inside Input */}
                <TouchableOpacity
                  onPress={handleMicClick}
                  style={{
                    padding: 10,
                    marginRight: 4,
                    borderRadius: 16,
                    backgroundColor: 'transparent',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Gravar áudio"
                >
                  <Mic size={22} color={colors.text.tertiary} />
                </TouchableOpacity>
              </View>
            )}

            {/* Send Button */}
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={(!input.trim() && !isRecording) || loading || isTranscribing}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 4,
                backgroundColor: (input.trim() && !isRecording && !isTranscribing) ? colors.primary.main : colors.text.disabled,
              }}
              accessibilityRole="button"
              accessibilityLabel={loading ? "Enviando mensagem" : "Enviar mensagem"}
              accessibilityState={{ disabled: (!input.trim() && !isRecording) || loading || isTranscribing }}
            >
              {loading ? (
                <Loader2 size={22} color={colors.text.inverse} />
              ) : (
                <Send size={22} color={colors.text.inverse} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
