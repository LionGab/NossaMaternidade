/**
 * useChatHandlers - Hook customizado para handlers do chat
 * Extrai lógica complexa do AssistantScreen
 */

import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useChatStore, useAppStore } from "../state/store";
import { useIsPremium } from "../state/premium-store";
import { MainTabScreenProps } from "../types/navigation";
// TODO: Uncomment when implementing message limits
// import { logger } from "../utils/logger";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const FREE_MESSAGE_LIMIT = 10;
// const MESSAGE_COUNT_KEY = "nathia_message_count";

interface UseChatHandlersProps {
  navigation: MainTabScreenProps<"Assistant">["navigation"];
  inputText: string;
  setInputText: (text: string) => void;
  messageCount: number;
  setMessageCount: (count: number) => void;
  flatListRef: React.RefObject<any>;
}

export function useChatHandlers(props: UseChatHandlersProps) {
  const { navigation, setInputText } = props;
  // TODO: Use these for message limit feature
  void useIsPremium();
  void useAppStore((s) => s.user);
  void useChatStore((s) => s.conversations);
  void useChatStore((s) => s.currentConversationId);
  void useChatStore((s) => s.isLoading);
  void useChatStore((s) => s.setLoading);
  void useChatStore((s) => s.addMessage);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);
  const clearCurrentChat = useChatStore((s) => s.clearCurrentChat);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  const handleNewChat = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentConversation(null);
  }, [setCurrentConversation]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentConversation(id);
    },
    [setCurrentConversation]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      deleteConversation(id);
    },
    [deleteConversation]
  );

  const handleSuggestedPrompt = useCallback(
    async (text: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setInputText(text);
    },
    [setInputText]
  );

  const handleMicPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Mensagem de voz é feature premium
    navigation.navigate("Paywall", { source: "voice_message" });
  }, [navigation]);

  const handleAttachment = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Anexos é feature premium
    navigation.navigate("Paywall", { source: "attachments" });
  }, [navigation]);

  const handleClearChat = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearCurrentChat();
  }, [clearCurrentChat]);

  const handleVoicePremiumRequired = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Paywall", { source: "voice_nathia" });
  }, [navigation]);

  return {
    handleNewChat,
    handleSelectConversation,
    handleDeleteConversation,
    handleSuggestedPrompt,
    handleMicPress,
    handleAttachment,
    handleClearChat,
    handleVoicePremiumRequired,
  };
}

