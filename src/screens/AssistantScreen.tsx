import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { MainTabScreenProps, ChatMessage } from "../types/navigation";
import { useChatStore, Conversation } from "../state/store";
import { Avatar } from "../components/ui";
import { shadowPresets } from "../utils/shadow";
import * as Haptics from "expo-haptics";
import {
  getNathIAResponse,
  estimateTokens,
  detectMedicalQuestion,
} from "../api/ai-service";
import {
  prepareMessagesForAPI,
  getRandomFallbackMessage,
  containsSensitiveTopic,
  SENSITIVE_TOPIC_DISCLAIMER,
  NATHIA_API_CONFIG,
} from "../config/nathia";
import { logger } from "../utils/logger";
import { VoiceMessagePlayer } from "../components/VoiceMessagePlayer";
import { useVoicePremiumGate } from "../hooks/useVoice";
import { PRIMARY_COLOR } from "../utils/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SuggestedPrompt {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { icon: "nutrition-outline", text: "O que posso comer na gravidez?", color: "#10B981" },
  { icon: "fitness-outline", text: "Exercícios seguros na gestação", color: "#8B5CF6" },
  { icon: "medical-outline", text: "Quando devo ir ao médico?", color: "#F59E0B" },
  { icon: "heart-outline", text: "Dicas para aliviar enjoos", color: "#EC4899" },
];

const QUICK_SUGGESTIONS = [
  "Como está meu bebê agora?",
  "Posso tomar café?",
  "Dicas de sono",
  "Preparar enxoval",
];

export default function AssistantScreen({ navigation }: MainTabScreenProps<"Assistant">) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Store selectors
  const conversations = useChatStore((s) => s.conversations);
  const currentConversationId = useChatStore((s) => s.currentConversationId);
  const isLoading = useChatStore((s) => s.isLoading);
  const setLoading = useChatStore((s) => s.setLoading);
  const addMessage = useChatStore((s) => s.addMessage);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);
  const clearCurrentChat = useChatStore((s) => s.clearCurrentChat);
  const hasAcceptedAITerms = useChatStore((s) => s.hasAcceptedAITerms);
  const acceptAITerms = useChatStore((s) => s.acceptAITerms);

  // AI Consent state
  const [showAIConsent, setShowAIConsent] = useState(!hasAcceptedAITerms);

  // Voice premium gate
  const { hasAccess: hasVoiceAccess } = useVoicePremiumGate();

  // Handler para quando voz premium e necessaria
  const handleVoicePremiumRequired = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Paywall", { source: "voice_nathia" });
  }, [navigation]);

  // Get current messages
  const currentMessages = useMemo(() => {
    const conv = conversations.find((c) => c.id === currentConversationId);
    return conv?.messages || [];
  }, [conversations, currentConversationId]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: { title: string; conversations: Conversation[] }[] = [
      { title: "Hoje", conversations: [] },
      { title: "Ontem", conversations: [] },
      { title: "Últimos 7 dias", conversations: [] },
      { title: "Mais antigas", conversations: [] },
    ];

    conversations.forEach((conv) => {
      const convDate = new Date(conv.createdAt);
      if (convDate.toDateString() === today.toDateString()) {
        groups[0].conversations.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups[1].conversations.push(conv);
      } else if (convDate > lastWeek) {
        groups[2].conversations.push(conv);
      } else {
        groups[3].conversations.push(conv);
      }
    });

    return groups.filter((g) => g.conversations.length > 0);
  }, [conversations]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userInput = inputText.trim();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Criar mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setInputText("");
    setLoading(true);

    // Scroll para o fim
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Preparar histórico de mensagens para a API
      const currentConv = conversations.find((c) => c.id === currentConversationId);
      const messageHistory = currentConv?.messages || [];

      // Converter para formato da API (incluindo a nova mensagem do usuário)
      const conversationForAPI = [
        ...messageHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: userInput },
      ];

      // Preparar mensagens com system prompt da NathIA
      const apiMessages = prepareMessagesForAPI(conversationForAPI);

      // Estimar tokens e detectar se é pergunta médica
      const estimated = estimateTokens(apiMessages);
      const requiresGrounding = detectMedicalQuestion(userInput);

      // Chamar a Edge Function segura (Claude/Gemini com JWT)
      const response = await getNathIAResponse(apiMessages, {
        estimatedTokens: estimated,
        requiresGrounding,
      });

      let aiContent = response.content;

      // Verificar se é um tópico sensível e adicionar disclaimer
      if (containsSensitiveTopic(userInput)) {
        aiContent = aiContent + "\n\n" + SENSITIVE_TOPIC_DISCLAIMER;
      }

      // Se tem grounding, adicionar citations ao final
      if (response.grounding?.citations && response.grounding.citations.length > 0) {
        aiContent += "\n\n📚 Fontes:\n";
        response.grounding.citations.slice(0, 3).forEach((citation, i) => {
          aiContent += `${i + 1}. ${citation.title || "Fonte"}\n`;
        });
      }

      // Criar mensagem da IA
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        createdAt: new Date().toISOString(),
      };
      addMessage(aiMessage);

      logger.info("NathIA response generated", "AssistantScreen", {
        inputLength: userInput.length,
        outputLength: aiContent.length,
        tokens: response.usage?.totalTokens,
        provider: response.provider,
        grounding: requiresGrounding,
        latency: response.latency,
      });

      // Log se usou fallback
      if (response.fallback) {
        logger.warn("AI fallback activated (Claude offline)", "AssistantScreen");
      }
    } catch (error) {
      // Em caso de erro, mostrar mensagem amigável
      logger.error("NathIA API error", "AssistantScreen", error instanceof Error ? error : new Error(String(error)));

      // Mensagens de erro específicas
      let errorMessage = getRandomFallbackMessage();

      if (error instanceof Error) {
        if (error.message.includes("não autenticado") || error.message.includes("Sessão expirada")) {
          errorMessage = "Sua sessão expirou. Faça login novamente para continuar conversando comigo. 🔒";
        } else if (error.message.includes("muitas mensagens") || error.message.includes("Rate limit")) {
          errorMessage = "Você está enviando muitas mensagens! Aguarde um minutinho e voltamos a conversar. ⏱️";
        }
      }

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        createdAt: new Date().toISOString(),
      };
      addMessage(fallbackMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [inputText, isLoading, conversations, currentConversationId, addMessage, setLoading]);

  const handleNewChat = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentConversation(null);
    setShowHistory(false);
  };

  const handleSelectConversation = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentConversation(id);
    setShowHistory(false);
  };

  const handleDeleteConversation = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteConversation(id);
  };

  const handleSuggestedPrompt = async (text: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText(text);
  };

  const handleMicPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Mic is not yet implemented - show Coming Soon
    navigation.navigate("ComingSoon", {
      title: "Mensagem de Voz",
      description: "Em breve você poderá enviar mensagens de voz para a NathIA. Por enquanto, use o teclado.",
      emoji: "🎙️",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleAcceptAITerms = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptAITerms();
    setShowAIConsent(false);
  };

  const handleDeclineAITerms = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleAttachment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Anexos",
      description: "Em breve você poderá enviar fotos, documentos e áudios para a NathIA analisar e ajudar melhor você.",
      emoji: "📎",
      primaryCtaLabel: "Voltar",
    });
  };

// Renderizar mensagem individual (memoizado)
const MessageBubble = React.memo(({ message, index, hasVoiceAccess, onPremiumRequired }: {
  message: ChatMessage;
  index: number;
  hasVoiceAccess: boolean;
  onPremiumRequired: () => void;
}) => {
  const isUser = message.role === "user";
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 30).duration(300)}
      className={`mb-4 ${isUser ? "items-end" : "items-start"}`}
    >
      <View className="flex-row items-end max-w-[85%]">
        {!isUser && (
          <Avatar
            size={32}
            isNathIA={true}
            style={{ marginRight: 8, marginBottom: 4 }}
          />
        )}
        <View
          className={`rounded-2xl px-4 py-3 ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
          style={{
            backgroundColor: isUser ? "#f4258c" : "#FFFFFF",
            flex: 1,
            ...(isUser ? {
              shadowColor: "#f4258c",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            } : {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }),
          }}
        >
          <Text className={`text-base leading-6 ${isUser ? "text-white" : "text-warmGray-800"}`}>
            {message.content}
          </Text>

          {/* Voice Player - Apenas para mensagens da NathIA */}
          {!isUser && (
            <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-warmGray-200">
              <View className="flex-row items-center">
                <Ionicons name="volume-medium-outline" size={14} color="#78716C" />
                <Text className="text-warmGray-500 text-xs ml-1">
                  {hasVoiceAccess ? "Ouvir resposta" : "Voz Premium"}
                </Text>
              </View>
              <VoiceMessagePlayer
                messageId={message.id}
                text={message.content}
                onPremiumRequired={onPremiumRequired}
                size="small"
                compact
                iconColor={PRIMARY_COLOR}
              />
            </View>
          )}
        </View>
      </View>
      <Text className={`text-warmGray-400 text-xs mt-1 ${isUser ? "mr-2" : "ml-12"}`}>
        {new Date(message.createdAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Animated.View>
  );
});
MessageBubble.displayName = 'MessageBubble';

  const renderEmptyState = () => (
    <Animated.View entering={FadeIn.duration(600)} className="flex-1 justify-center items-center px-6">
      {/* Logo/Avatar */}
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} className="mb-8">
        <Avatar
          size={80}
          isNathIA={true}
          style={shadowPresets.colored("#E11D48", 0.3)}
        />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={FadeInDown.delay(200).duration(600).springify()}
        className="text-warmGray-900 text-2xl font-semibold text-center mb-2"
        accessibilityRole="header"
      >
        Olá, sou a NathIA
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(300).duration(600).springify()}
        className="text-warmGray-500 text-base text-center mb-10 px-4"
      >
        Sua assistente de maternidade. Como posso ajudar você hoje?
      </Animated.Text>

      {/* Suggested Prompts - Grid Style like ChatGPT */}
      <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} className="w-full">
        <View className="flex-row flex-wrap -mx-1.5">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(500 + index * 80)
                .duration(500)
                .springify()}
              className="w-1/2 px-1.5 mb-3"
            >
              <Pressable
                onPress={() => handleSuggestedPrompt(prompt.text)}
                className="rounded-2xl p-4 h-28 justify-between active:opacity-70"
                style={{
                  backgroundColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#E7E5E4",
                }}
                accessibilityRole="button"
                accessibilityLabel={prompt.text}
                accessibilityHint="Usa esta sugestão como mensagem para a NathIA"
              >
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${prompt.color}15` }}
                >
                  <Ionicons name={prompt.icon} size={20} color={prompt.color} />
                </View>
                <Text className="text-warmGray-700 text-sm leading-5" numberOfLines={2}>
                  {prompt.text}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );

  // AI Consent Modal - Required for compliance
  const renderAIConsentModal = () => (
    <Modal visible={showAIConsent} animationType="fade" transparent statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(400).springify()}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            width: "100%",
            maxWidth: 340,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#FEE2E2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="sparkles" size={28} color="#E11D48" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#1F2937",
                textAlign: "center",
              }}
            >
              Antes de começar
            </Text>
          </View>

          {/* Content */}
          <Text
            style={{
              fontSize: 15,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 16,
            }}
          >
            A NathIA utiliza inteligência artificial para oferecer apoio. Suas conversas são processadas para gerar respostas personalizadas.
          </Text>

          {/* Links */}
          <View style={{ marginBottom: 20 }}>
            <Pressable
              onPress={() => navigation.navigate("Legal")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
              accessibilityRole="link"
              accessibilityLabel="Ver Política de Privacidade"
            >
              <Ionicons name="shield-checkmark-outline" size={18} color="#6366F1" />
              <Text style={{ fontSize: 14, color: "#6366F1", marginLeft: 10 }}>
                Política de Privacidade
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#6366F1" style={{ marginLeft: "auto" }} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Legal")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
              accessibilityRole="link"
              accessibilityLabel="Ver Termos de Uso"
            >
              <Ionicons name="document-text-outline" size={18} color="#8B5CF6" />
              <Text style={{ fontSize: 14, color: "#8B5CF6", marginLeft: 10 }}>
                Termos de Uso
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#8B5CF6" style={{ marginLeft: "auto" }} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Legal")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
              accessibilityRole="link"
              accessibilityLabel="Ver informações sobre uso de IA"
            >
              <Ionicons name="sparkles-outline" size={18} color="#EC4899" />
              <Text style={{ fontSize: 14, color: "#EC4899", marginLeft: 10 }}>
                Uso de Inteligência Artificial
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#EC4899" style={{ marginLeft: "auto" }} />
            </Pressable>
          </View>

          {/* Disclaimer */}
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Ionicons name="medkit-outline" size={16} color="#B45309" style={{ marginTop: 2 }} />
              <Text style={{ fontSize: 12, color: "#92400E", marginLeft: 8, flex: 1, lineHeight: 18 }}>
                A NathIA não substitui atendimento médico. Em caso de emergência, procure ajuda profissional.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <Pressable
            onPress={handleAcceptAITerms}
            style={{
              backgroundColor: "#E11D48",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 10,
            }}
            accessibilityRole="button"
            accessibilityLabel="Aceitar termos e continuar"
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
              Aceito e quero continuar
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDeclineAITerms}
            style={{
              backgroundColor: "#F5F5F4",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Não aceitar e voltar"
          >
            <Text style={{ color: "#78716C", fontSize: 16, fontWeight: "500" }}>
              Não, obrigada
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );

  // History Sidebar Modal
  const renderHistorySidebar = () => (
    <Modal visible={showHistory} animationType="none" transparent statusBarTranslucent>
      <View className="flex-1 flex-row">
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={() => setShowHistory(false)}
        />

        {/* Sidebar */}
        <Animated.View
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={{ width: SCREEN_WIDTH * 0.8, paddingTop: insets.top }}
          className="bg-white h-full"
        >
          {/* Sidebar Header */}
          <View className="px-4 py-4 border-b border-warmGray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-warmGray-900 text-xl font-semibold">Histórico</Text>
            <Pressable
              onPress={() => setShowHistory(false)}
              className="w-9 h-9 rounded-full bg-warmGray-100 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Fechar histórico"
              accessibilityHint="Fecha o painel de histórico de conversas"
            >
              <Ionicons name="close" size={20} color="#78716C" />
            </Pressable>
            </View>

            {/* New Chat Button */}
            <Pressable
              onPress={handleNewChat}
              className="flex-row items-center justify-center py-3 rounded-xl active:opacity-80"
              style={{ backgroundColor: "#E11D48" }}
              accessibilityRole="button"
              accessibilityLabel="Nova conversa"
              accessibilityHint="Inicia uma nova conversa com a NathIA"
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text className="text-white font-semibold ml-2">Nova conversa</Text>
            </Pressable>
          </View>

          {/* Conversations List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {groupedConversations.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="chatbubbles-outline" size={48} color="#D6D3D1" />
                <Text className="text-warmGray-400 text-base mt-4">Nenhuma conversa ainda</Text>
              </View>
            ) : (
              groupedConversations.map((group, groupIndex) => (
                <View key={group.title} className="px-4 py-3">
                  <Text className="text-warmGray-400 text-xs font-medium uppercase tracking-wider mb-2">
                    {group.title}
                  </Text>
                  {group.conversations.map((conv) => (
                    <Pressable
                      key={conv.id}
                      onPress={() => handleSelectConversation(conv.id)}
                      className="flex-row items-center py-3 px-3 rounded-xl mb-1"
                      style={{
                        backgroundColor:
                          conv.id === currentConversationId ? "#FEE2E2" : "transparent",
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Conversa: ${conv.title}`}
                      accessibilityHint="Abre esta conversa do histórico"
                      accessibilityState={{ selected: conv.id === currentConversationId }}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color={conv.id === currentConversationId ? "#E11D48" : "#A8A29E"}
                      />
                      <View className="flex-1 ml-3">
                        <Text
                          className="text-warmGray-800 text-sm font-medium"
                          numberOfLines={1}
                          style={{
                            color: conv.id === currentConversationId ? "#E11D48" : "#44403C",
                          }}
                        >
                          {conv.title}
                        </Text>
                        <Text className="text-warmGray-400 text-xs mt-0.5">
                          {conv.messages.length} mensagens
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleDeleteConversation(conv.id)}
                        className="p-2 -mr-2"
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Excluir conversa ${conv.title}`}
                        accessibilityHint="Remove esta conversa do histórico"
                      >
                        <Ionicons name="trash-outline" size={16} color="#A8A29E" />
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              ))
            )}
          </ScrollView>

          {/* Sidebar Footer */}
          <View
            className="px-4 py-4 border-t border-warmGray-100"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View className="flex-row items-center">
              <Avatar
                size={40}
                isNathIA={true}
                style={{ marginRight: 12 }}
              />
              <View>
                <Text className="text-warmGray-800 text-sm font-semibold">NathIA</Text>
                <Text className="text-warmGray-400 text-xs">Sua assistente</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: "#FAFAF9" }}>
      {/* Header - Minimal like Claude/ChatGPT */}
      <View style={{ paddingTop: insets.top }} className="bg-white border-b border-warmGray-100">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            {/* History Toggle */}
            <Pressable
              onPress={() => setShowHistory(true)}
              className="w-9 h-9 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: "#F5F5F4" }}
              accessibilityRole="button"
              accessibilityLabel="Abrir histórico de conversas"
              accessibilityHint="Mostra o histórico de conversas anteriores"
            >
              <Ionicons name="menu" size={20} color="#78716C" />
            </Pressable>
            <Avatar
              size={36}
              isNathIA={true}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-warmGray-900 text-lg font-semibold">NathIA</Text>
              <Text className="text-warmGray-400 text-xs">Assistente de Maternidade</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            {currentMessages.length > 0 && (
              <Pressable
                onPress={clearCurrentChat}
                className="p-2 mr-1"
                accessibilityRole="button"
                accessibilityLabel="Limpar conversa atual"
                accessibilityHint="Remove todas as mensagens da conversa atual"
              >
                <Ionicons name="trash-outline" size={22} color="#A8A29E" />
              </Pressable>
            )}
            <Pressable
              onPress={handleNewChat}
              className="p-2"
              accessibilityRole="button"
              accessibilityLabel="Nova conversa"
              accessibilityHint="Inicia uma nova conversa com a NathIA"
            >
              <Ionicons name="create-outline" size={22} color="#78716C" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Messages Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {currentMessages.length === 0 ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {renderEmptyState()}
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {currentMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                index={index}
                hasVoiceAccess={hasVoiceAccess}
                onPremiumRequired={handleVoicePremiumRequired}
              />
            ))}

            {isLoading && (
              <Animated.View entering={FadeIn.duration(300)} className="items-start mb-4">
                <View className="flex-row items-end">
                  <Avatar
                    size={32}
                    isNathIA={true}
                    style={{ marginRight: 8, marginBottom: 4 }}
                  />
                  <View>
                    <View
                      className="rounded-2xl rounded-bl-sm px-4 py-3"
                      style={{ backgroundColor: "#F5F5F4" }}
                    >
                      <View className="flex-row items-center">
                        <Animated.View
                          entering={FadeIn.delay(0).duration(400)}
                          className="w-2 h-2 rounded-full bg-rose-400 mr-1"
                        />
                        <Animated.View
                          entering={FadeIn.delay(150).duration(400)}
                          className="w-2 h-2 rounded-full bg-rose-300 mr-1"
                        />
                        <Animated.View
                          entering={FadeIn.delay(300).duration(400)}
                          className="w-2 h-2 rounded-full bg-rose-200"
                        />
                      </View>
                    </View>
                    <Text className="text-warmGray-400 text-xs mt-1 ml-2">
                      NathIA está pensando...
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        )}

        {/* Input Area - ChatGPT/Claude Style */}
        <View className="px-4 pt-2" style={{ paddingBottom: insets.bottom + 8 }}>
          {/* Quick Suggestions - Show when there are messages */}
          {currentMessages.length > 0 && !inputText.trim() && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-3"
              contentContainerStyle={{ paddingRight: 8 }}
            >
                {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSuggestedPrompt(suggestion)}
                  className="mr-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: "#FFF",
                    borderWidth: 1,
                    borderColor: "#E7E5E4",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={suggestion}
                  accessibilityHint="Usa esta sugestão como mensagem"
                >
                  <Text className="text-warmGray-600 text-sm">{suggestion}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Input Container */}
          <View
            className="rounded-3xl flex-row items-end"
            style={{
              backgroundColor: "#FFF",
              borderWidth: 1,
              borderColor: "#E7E5E4",
              minHeight: 52,
              maxHeight: 140,
            }}
          >
            {/* Attachment Button */}
            <Pressable
              onPress={handleAttachment}
              className="p-3 pl-4"
              accessibilityRole="button"
              accessibilityLabel="Anexar arquivo"
              accessibilityHint="Abre opções para anexar imagens ou documentos"
            >
              <Ionicons name="add-circle-outline" size={26} color="#A8A29E" />
            </Pressable>

            {/* Text Input */}
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Mensagem para NathIA..."
              placeholderTextColor="#A8A29E"
              multiline
              maxLength={2000}
              className="flex-1 text-base text-warmGray-800 py-3 pr-2"
              style={{ maxHeight: 100 }}
              accessibilityLabel="Campo de mensagem para NathIA"
              accessibilityHint="Digite sua mensagem ou pergunta para a assistente"
            />

            {/* Voice/Send Button */}
            {inputText.trim() ? (
              <Pressable
                onPress={handleSend}
                className="p-2 pr-3 mb-1"
                accessibilityRole="button"
                accessibilityLabel="Enviar mensagem"
                accessibilityHint="Envia a mensagem para a NathIA"
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#E11D48" }}
                >
                  <Ionicons name="arrow-up" size={20} color="#FFF" />
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleMicPress}
                className="p-2 pr-3 mb-1"
                accessibilityRole="button"
                accessibilityLabel="Mensagem de voz (em breve)"
                accessibilityHint="Abre informações sobre mensagens de voz"
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#F5F5F4" }}
                >
                  <Ionicons name="mic" size={20} color="#78716C" />
                </View>
              </Pressable>
            )}
          </View>

          {/* Disclaimer */}
          <Text className="text-warmGray-400 text-xs text-center mt-2 px-4">
            NathIA pode cometer erros. Consulte sempre seu médico.
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* History Sidebar */}
      {renderHistorySidebar()}

      {/* AI Consent Modal */}
      {renderAIConsentModal()}
    </View>
  );
}
