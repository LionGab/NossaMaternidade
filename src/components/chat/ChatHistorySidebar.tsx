/**
 * ChatHistorySidebar - Sidebar de histórico de conversas
 * Componente extraído do AssistantScreen
 */

import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Conversation } from "../../state/store";
import { Avatar } from "../ui";
import { Tokens, COLORS, COLORS_DARK } from "../../theme/tokens";
import { useTheme } from "../../hooks/useTheme";

interface ChatHistorySidebarProps {
  visible: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  groupedConversations: { title: string; conversations: Conversation[] }[];
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  visible,
  conversations: _conversations,
  currentConversationId,
  groupedConversations,
  onClose,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const palette = isDark ? COLORS_DARK : COLORS;
  const bgSidebar = palette.background.secondary;
  const textPrimary = palette.text.primary;
  const textMuted = palette.text.muted;
  const textSecondary = palette.text.secondary;
  const primary = palette.primary[500];
  const primaryLight = palette.primary[100];
  const borderLight = palette.primary[200];
  const bgTertiary = palette.background.tertiary;
  const textInverse = palette.text.inverse;

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <View style={styles.overlay}>
      {/* Backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* Sidebar */}
      <Animated.View
        entering={SlideInLeft.duration(300)}
        exiting={SlideOutLeft.duration(300)}
        style={[styles.sidebar, { paddingTop: insets.top, backgroundColor: bgSidebar }]}
      >
        {/* Sidebar Header */}
        <View style={[styles.header, { borderBottomColor: borderLight }]}>
          <Text style={[styles.title, { color: textPrimary }]}>Conversas</Text>
          <Pressable onPress={onClose} style={[styles.closeButton, { backgroundColor: bgTertiary }]}>
            <Ionicons name="close" size={20} color={textSecondary} />
          </Pressable>
        </View>

        {/* New Chat Button */}
        <Pressable onPress={onNewChat} style={[styles.newChatButton, { backgroundColor: primary }]}>
          <Ionicons name="add" size={20} color={textInverse} />
          <Text style={[styles.newChatText, { color: textInverse }]}>Nova conversa</Text>
        </Pressable>

        {/* Conversations List */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {groupedConversations.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={48} color={borderLight} />
              <Text style={[styles.emptyText, { color: textMuted }]}>Nenhuma conversa ainda</Text>
            </View>
          ) : (
            groupedConversations.map((group) => (
              <View key={group.title} style={styles.group}>
                <Text style={[styles.groupTitle, { color: textMuted }]}>{group.title}</Text>
                {group.conversations.map((conv) => (
                  <Pressable
                    key={conv.id}
                    onPress={() => onSelectConversation(conv.id)}
                    style={[
                      styles.item,
                      conv.id === currentConversationId && { backgroundColor: primaryLight },
                    ]}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={16}
                      color={conv.id === currentConversationId ? primary : textMuted}
                    />
                    <View style={styles.itemContent}>
                      <Text
                        style={[
                          styles.itemTitle,
                          { color: conv.id === currentConversationId ? primary : textPrimary },
                        ]}
                        numberOfLines={1}
                      >
                        {conv.title}
                      </Text>
                      <Text style={[styles.itemSubtitle, { color: textMuted }]}>
                        {conv.messages.length} mensagens
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => onDeleteConversation(conv.id)}
                      style={styles.itemDelete}
                      hitSlop={12}
                    >
                      <Ionicons name="trash-outline" size={14} color={textMuted} />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        {/* Sidebar Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: borderLight }]}>
          <Avatar size={36} isNathIA={true} style={{ marginRight: 12 }} />
          <View>
            <Text style={[styles.footerTitle, { color: textPrimary }]}>NathIA</Text>
            <Text style={[styles.footerSubtitle, { color: textMuted }]}>Sua assistente</Text>
          </View>
        </View>
      </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Tokens.overlay.medium,
  },
  sidebar: {
    width: "82%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  newChatText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  group: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  itemDelete: {
    padding: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerSubtitle: {
    fontSize: 12,
  },
});

