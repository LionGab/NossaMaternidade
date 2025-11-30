/**
 * ChatScreen - Versão Refatorada
 * Layout profissional usando componentes primitivos e tokens do design system
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  AudioLines,
  MessageCircle,
  ImagePlus,
  AlertTriangle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import { Spacing, Radius, Typography, Tokens } from '../theme/tokens';
import { chatService, ChatMessage } from '../services/chatService';
import { profileService } from '../services/profileService';
import { MessageBubble } from '../components/MessageBubble';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { HapticButton } from '@/components/primitives/HapticButton';
import { IconButton } from '@/components/primitives/IconButton';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { AIDisclaimerModal } from '@/components/molecules/AIDisclaimerModal';
import { logger } from '../utils/logger';

const INITIAL_CHAT_GREETING = "Oi, mãe. Tô aqui com você. Como você está se sentindo agora?";
const AVATAR_URL = "https://i.imgur.com/oB9ewPG.jpg";

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
  const [avatarError, setAvatarError] = useState(false);
  const { colors, isDark } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flashListRef = useRef<FlashListRef<ChatMessage>>(null);

  const [aiMode, setAiMode] = useState<AIMode>('balanced');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [_selectedImage, setSelectedImage] = useState<string | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    checkDisclaimerStatus();
    initializeChat();
  }, []);

  const checkDisclaimerStatus = async () => {
    try {
      const accepted = await AsyncStorage.getItem('ai_disclaimer_accepted');
      if (accepted === 'true') {
        setDisclaimerAccepted(true);
        setShowDisclaimer(false);
      } else {
        setShowDisclaimer(true);
      }
    } catch (error) {
      logger.error('Erro ao verificar disclaimer', error);
      // Em caso de erro, mostrar o disclaimer por segurança
      setShowDisclaimer(true);
    }
  };

  const handleAcceptDisclaimer = async () => {
    try {
      await AsyncStorage.setItem('ai_disclaimer_accepted', 'true');
      setDisclaimerAccepted(true);
      setShowDisclaimer(false);
      logger.info('[ChatScreen] AI disclaimer accepted by user');
    } catch (error) {
      logger.error('Erro ao salvar aceite do disclaimer', error);
      Alert.alert('Erro', 'Não foi possível salvar sua preferência.');
    }
  };

  const initializeChat = async () => {
    try {
      setLoadingMessages(true);
      const conversations = await chatService.getConversations(1);

      if (conversations.length > 0) {
        const latestConv = conversations[0];
        setConversationId(latestConv.id);
        const msgs = await chatService.getMessages(latestConv.id);
        setMessages(msgs);
      } else {
        const profile = await profileService.getCurrentProfile();
        if (profile) {
          const newConv = await chatService.createConversation({});
          if (newConv) {
            setConversationId(newConv.id);
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
      }
    } catch (error) {
      logger.error('Erro ao inicializar chat', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSend = async (customMessage?: string) => {
    const messageContent = customMessage || input.trim();
    if (!messageContent || loading || !conversationId) return;

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      content: messageContent,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    triggerHaptic();

    try {
      const response = await chatService.sendMessage({
        conversation_id: conversationId,
        content: messageContent,
        role: 'user',
      });

      if (response) {
        const aiResponse = await chatService.sendMessage({
          conversation_id: conversationId,
          content: '',
          role: 'assistant',
        });

        if (aiResponse) {
          setMessages(prev => [...prev, aiResponse]);
        }
      }
    } catch (error) {
      logger.error('Erro ao enviar mensagem', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza que deseja limpar todo o histórico de conversas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
            onPress: async () => {
              try {
                // Deletar todas as conversas
                const conversations = await chatService.getConversations(100);
                await Promise.all(conversations.map(conv => chatService.deleteConversation(conv.id)));
                await initializeChat();
                triggerHaptic();
            } catch (error) {
              logger.error('Erro ao limpar histórico', error);
              Alert.alert('Erro', 'Não foi possível limpar o histórico');
            }
          },
        },
      ]
    );
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsTranscribing(true);
      setTimeout(() => {
        setInput(prev => prev + (prev ? ' ' : '') + 'Texto transcrito do áudio...');
        setIsTranscribing(false);
      }, 2000);
    } else {
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
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
      <ScreenLayout>
        <Box flex={1} align="center" justify="center">
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text color="secondary" size="md" style={{ marginTop: Spacing['4'] }}>
            Carregando conversa...
          </Text>
        </Box>
      </ScreenLayout>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }} edges={['top']}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* AI Disclaimer Modal */}
      <AIDisclaimerModal
        visible={showDisclaimer}
        onAccept={handleAcceptDisclaimer}
        onDismiss={undefined} // Não permitir fechar sem aceitar
      />

      {/* Banner de Aviso Fixo (sempre visível após aceitar) */}
      {disclaimerAccepted && (
        <Box
          p="2"
          direction="row"
          align="center"
          style={{
            backgroundColor: isDark ? Tokens.colors.warning[900] : Tokens.colors.warning[50],
            borderBottomWidth: 1,
            borderBottomColor: colors.border.light,
          }}
          accessibilityRole="alert"
          accessibilityLabel="Aviso: NathIA é uma IA e não substitui profissionais de saúde"
        >
          <AlertTriangle size={16} color={colors.status.warning} style={{ marginRight: Spacing['2'] }} />
          <Text size="xs" color="warning" weight="medium" style={{ flex: 1 }}>
            NathIA é uma IA. Não substitui profissionais de saúde.
          </Text>
        </Box>
      )}

      {/* Header - Refatorado */}
      <Box
        bg="card"
        p="4"
        direction="row"
        align="center"
        borderWidth={1}
        borderColor="light"
        shadow="sm"
        style={{ borderTopWidth: 0 }}
      >
        <IconButton
          icon={<ArrowLeft size={20} color={colors.text.primary} />}
          onPress={() => { triggerHaptic(); navigation.goBack(); }}
          accessibilityLabel="Voltar"
          variant="ghost"
        />

        <Box direction="row" align="center" style={{ marginLeft: Spacing['3'], position: 'relative' }}>
          <Box
            width={32}
            height={32}
            rounded="full"
            bg={isDark ? 'card' : undefined}
            borderWidth={1}
            borderColor="light"
            style={{ overflow: 'hidden' }}
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
              <Box flex={1} align="center" justify="center" bg="elevated">
                <Text size="lg">💙</Text>
              </Box>
            )}
          </Box>
          <Box
            style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              width: 8,
              height: 8,
              borderRadius: 9999,
              backgroundColor: colors.status.success,
              borderWidth: 1.5,
              borderColor: colors.background.card,
            }}
          />
        </Box>

        <Box flex={1} direction="row" align="center" style={{ marginLeft: Spacing['2'] }}>
          <Heading level="h4" color="primary">
            NathIA
          </Heading>
          <Text size="xs" color="tertiary" style={{ marginLeft: Spacing['1'] }}>
            Online
          </Text>
        </Box>

        <IconButton
          icon={<Trash2 size={18} color={colors.text.tertiary} />}
          onPress={handleClearHistory}
          accessibilityLabel="Limpar histórico"
          variant="ghost"
        />
      </Box>

      {/* AI Mode Selector - Refatorado */}
      <Box
        bg="card"
        px="4"
        py="2"
        direction="row"
        align="center"
        borderWidth={1}
        borderColor="light"
        style={{ gap: Spacing['2'] }}
      >
        {(['fast', 'balanced', 'thinking', 'search'] as AIMode[]).map((mode) => {
          const isActive = aiMode === mode;
          const icons = {
            fast: Zap,
            balanced: Sparkles,
            thinking: Brain,
            search: Globe,
          };
          const labels = {
            fast: 'Rápido',
            balanced: 'Equilibrado',
            thinking: 'Pensar',
            search: 'Buscar',
          };
          const Icon = icons[mode];
          const bgColor = isActive
            ? mode === 'fast'
              ? colors.status.warning
              : mode === 'balanced'
              ? colors.primary.main
              : mode === 'thinking'
              ? colors.secondary.main
              : colors.status.success
            : 'transparent';

          return (
            <HapticButton
              key={mode}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onPress={() => {
                setAiMode(mode);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={{
                backgroundColor: bgColor,
                borderColor: isActive ? bgColor : colors.border.medium,
              }}
              accessibilityLabel={`Modo ${labels[mode]}`}
            >
              <Box direction="row" align="center" style={{ gap: Spacing['1'] }}>
                <Icon
                  size={14}
                  color={isActive ? colors.text.inverse : colors.text.tertiary}
                  fill={isActive ? colors.text.inverse : 'none'}
                />
                <Text
                  size="xs"
                  weight="bold"
                  color={isActive ? 'inverse' : 'tertiary'}
                >
                  {labels[mode]}
                </Text>
              </Box>
            </HapticButton>
          );
        })}
      </Box>

      {/* Messages Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <Box flex={1}>
          {messages.length <= 1 && !loading ? (
            <Box flex={1} align="center" justify="center" px="6" style={{ marginTop: -Spacing['12'] }}>
              <Box
                width={96}
                height={96}
                rounded="full"
                borderWidth={2}
                borderColor="light"
                shadow="lg"
                style={{ marginBottom: Spacing['3'], overflow: 'hidden' }}
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
                  <Box flex={1} align="center" justify="center" bg="elevated">
                    <Text style={{ fontSize: 48 }}>💙</Text>
                  </Box>
                )}
              </Box>

              <Heading level="h2" color="primary" align="center" style={{ marginBottom: Spacing['1'] }}>
                NathIA
              </Heading>

              <Box direction="row" align="center" style={{ gap: Spacing['2'], marginBottom: Spacing['6'] }}>
                <Sparkles size={14} color={colors.primary.main} />
                <Text color="primary" weight="medium" size="sm" style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                  Suas conversas
                </Text>
              </Box>

              <Text color="secondary" size="sm" align="center" style={{ maxWidth: 260, lineHeight: Typography.lineHeights.sm }}>
                {INITIAL_CHAT_GREETING}
              </Text>
            </Box>
          ) : (
            <FlashList
              ref={flashListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: Spacing['4'], paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                loading ? (
                  <Box 
                    direction="row" 
                    justify="flex-start" 
                    style={{ marginBottom: Spacing['4'] }}
                    accessible={true}
                    accessibilityRole="progressbar"
                    accessibilityLabel="NathIA está digitando"
                    accessibilityLiveRegion="polite"
                  >
                    <Box
                      bg="card"
                      p="4"
                      rounded="xl"
                      borderWidth={1}
                      borderColor="light"
                      shadow="sm"
                      style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] }}
                    >
                      <ActivityIndicator size="small" color={colors.primary.main} />
                      <Text size="sm" color="secondary">
                        NathIA está digitando...
                      </Text>
                    </Box>
                  </Box>
                ) : null
              }
            />
          )}
        </Box>

        {/* Input Area - Refatorado */}
        <Box
          bg="card"
          p="3"
          borderWidth={1}
          borderColor="light"
          style={{ borderBottomWidth: 0, paddingBottom: Spacing['8'] }}
        >
          {!loading && !isRecording && !isTranscribing && messages.length < 10 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: Spacing['3'] }}
              contentContainerStyle={{ gap: Spacing['2'], paddingRight: Spacing['4'] }}
            >
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <HapticButton
                  key={idx}
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleSend(chip);
                  }}
                  disabled={loading}
                  style={{
                    backgroundColor: isDark ? colors.background.elevated : colors.primary.light,
                    borderColor: isDark ? colors.border.light : `${colors.primary.main}33`,
                  }}
                  accessibilityLabel={`Sugestão: ${chip}`}
                >
                  <Box direction="row" align="center" style={{ gap: Spacing['1.5'] }}>
                    <MessageCircle size={12} color={colors.primary.main} opacity={0.7} />
                    <Text color="primary" size="xs" weight="bold">
                      {chip}
                    </Text>
                  </Box>
                </HapticButton>
              ))}
            </ScrollView>
          )}

          <Box direction="row" align="flex-end" style={{ gap: Spacing['2'] }}>
            {isRecording ? (
              <HapticButton
                variant="outline"
                fullWidth
                onPress={handleMicClick}
                style={{
                  backgroundColor: colors.secondary.light,
                  borderWidth: 2,
                  borderColor: colors.status.error,
                }}
                accessibilityLabel="Gravando áudio, toque para parar"
              >
                <Box direction="row" align="center" style={{ gap: Spacing['3'] }}>
                  <AudioLines size={24} color={colors.status.error} />
                  <Text color="error" size="sm" weight="bold" style={{ flex: 1 }}>
                    Gravando... (Toque para parar)
                  </Text>
                </Box>
              </HapticButton>
            ) : isTranscribing ? (
              <Box
                flex={1}
                bg="elevated"
                rounded="2xl"
                px="4"
                py="3.5"
                direction="row"
                align="center"
                borderWidth={1}
                borderColor="light"
                style={{ gap: Spacing['3'] }}
              >
                <Loader2 size={20} color={colors.primary.main} />
                <Text color="secondary" size="sm" weight="medium">
                  Transcrevendo áudio...
                </Text>
              </Box>
            ) : (
              <Box
                flex={1}
                direction="row"
                align="center"
                bg={isDark ? 'canvas' : 'card'}
                rounded="2xl"
                borderWidth={1}
                borderColor="light"
              >
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
                    paddingHorizontal: Spacing['4'],
                    paddingVertical: Spacing['3'],
                    fontSize: Typography.sizes.sm,
                    maxHeight: 96,
                    textAlignVertical: 'top',
                  }}
                  accessibilityLabel="Campo de mensagem"
                  accessibilityHint="Digite sua mensagem para NathIA"
                />
                <IconButton
                  icon={<ImagePlus size={22} color={colors.text.tertiary} />}
                  onPress={handleImagePick}
                  accessibilityLabel="Adicionar imagem"
                  variant="ghost"
                  size="sm"
                />
                <IconButton
                  icon={<Mic size={22} color={colors.text.tertiary} />}
                  onPress={handleMicClick}
                  accessibilityLabel="Gravar áudio"
                  variant="ghost"
                  size="sm"
                />
              </Box>
            )}

            <HapticButton
              variant="primary"
              size="lg"
              onPress={() => handleSend()}
              disabled={(!input.trim() && !isRecording) || loading || isTranscribing}
              style={{
                width: 48,
                height: 48,
                borderRadius: Radius.full,
                backgroundColor: (input.trim() && !isRecording && !isTranscribing)
                  ? colors.primary.main
                  : colors.text.disabled,
              }}
              accessibilityLabel={loading ? "Enviando mensagem" : "Enviar mensagem"}
            >
              {loading ? (
                <Loader2 size={22} color={colors.text.inverse} />
              ) : (
                <Send size={22} color={colors.text.inverse} />
              )}
            </HapticButton>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
