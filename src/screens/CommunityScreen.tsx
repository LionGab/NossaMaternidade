/**
 * CommunityScreen - Feed "Mães Valente"
 *
 * Feed único tipo Instagram (sem grupos, sem stories)
 * Posts são enviados para revisão antes de serem publicados
 * Suporta: texto, imagem, vídeo
 *
 * Design: Calm FemTech 2025 - Espaçamentos generosos, hierarquia clara
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ComposerCard, NewPostModal, PostCard } from "../components/community";
import { FAB, ScreenHeader } from "../components/ui";
import { useCommunity } from "../hooks/useCommunity";
import { useTheme } from "../hooks/useTheme";
import { Tokens } from "../theme/tokens";
import { RADIUS, SPACING } from "../theme/design-system";
import type { MainTabScreenProps } from "../types/navigation";

// Logo Comunidade Mães Valente
const MAES_VALENTE_LOGO_URL = "https://i.imgur.com/U5ttbqK.jpg";

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const { isDark, spacing } = useTheme();

  // Hook com toda a lógica
  const community = useCommunity(navigation);

  // Theme colors usando Tokens
  const bgPrimary = isDark ? Tokens.surface.dark.base : Tokens.surface.light.base;
  const textMain = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
  const textMuted = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.text.light.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: bgPrimary }]}>
        {/* Header - Using ScreenHeader component */}
        <ScreenHeader
          title="Mães Valente"
          subtitle="Comunidade de apoio e inspiração"
          logo={
            <Image
              source={{ uri: MAES_VALENTE_LOGO_URL }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          }
          rightActions={[
            {
              icon: community.isSearchVisible ? "close" : "search",
              onPress: community.handleSearchToggle,
              label: community.isSearchVisible ? "Fechar busca" : "Buscar posts",
            },
          ]}
        />

        {/* Search Input */}
        {community.isSearchVisible && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.searchInput,
              {
                backgroundColor: isDark ? Tokens.neutral[800] : Tokens.neutral[0],
                borderColor,
                marginHorizontal: spacing.xl,
                marginBottom: SPACING.lg,
              },
            ]}
          >
            <Ionicons name="search" size={20} color={textSecondary} />
            <TextInput
              value={community.searchQuery}
              onChangeText={community.setSearchQuery}
              placeholder="Buscar posts..."
              placeholderTextColor={textSecondary}
              autoFocus
              style={[styles.searchTextInput, { color: textMain }]}
            />
          </Animated.View>
        )}

        {/* Feed */}
        <FlatList
          data={community.filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PostCard
              post={item}
              index={index}
              onLike={community.handleLike}
              onComment={community.handleCommentPress}
              onShare={community.handleSharePress}
              onPress={community.handlePostPress}
            />
          )}
          ListHeaderComponent={
            <View>
              <ComposerCard onPress={community.openNewPostModal} />
              {/* Separador de seção - MELHORADO */}
              <View style={styles.sectionDivider}>
                <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                <Text style={[styles.sectionLabel, { color: textMuted }]}>
                  PUBLICAÇÕES RECENTES
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: spacing.xl,
              paddingBottom: 140 + insets.bottom, // Mais espaço para FAB
            },
          ]}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />

        {/* FAB - Using FAB component */}
        <View style={[styles.fabContainer, { bottom: insets.bottom + SPACING["2xl"] }]}>
          <FAB
            icon="add"
            onPress={community.openNewPostModal}
            variant="accent"
            size="md"
            accessibilityLabel="Criar novo post"
          />
        </View>

        {/* Modal */}
        <NewPostModal
          visible={community.isNewPostModalVisible}
          onClose={community.closeNewPostModal}
          onSubmit={community.handleNewPost}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.xl, // Aumentado de lg
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
  },
  searchTextInput: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 16, // Aumentado de 15
    paddingVertical: SPACING.sm,
    fontFamily: "Manrope_500Medium",
  },
  listContent: {
    paddingTop: SPACING.xl, // Aumentado de lg
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING["2xl"], // Espaço acima do separador
    marginBottom: SPACING.xl, // Espaço abaixo do separador
    gap: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  sectionLabel: {
    fontSize: 11, // Reduzido de 12
    fontWeight: "700", // Aumentado de 600
    fontFamily: "Manrope_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2, // Aumentado de 0.5
  },
  fabContainer: {
    position: "absolute",
    right: SPACING["2xl"], // Aumentado de xl
  },
});
