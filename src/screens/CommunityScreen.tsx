import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps, Post, Group } from "../types/navigation";
import { useCommunityStore, useAppStore } from "../state/store";
import CommunityComposer from "../components/CommunityComposer";
import * as Haptics from "expo-haptics";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    authorId: "user1",
    authorName: "Mariana Santos",
    content: "Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo. Alguém tem dicas para o primeiro trimestre?",
    likesCount: 45,
    commentsCount: 23,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
  },
  {
    id: "2",
    authorId: "user2",
    authorName: "Camila Oliveira",
    content: "O sono no terceiro trimestre está impossível. Já tentei almofadas de amamentação, mas nada funciona. O que vocês usam?",
    likesCount: 32,
    commentsCount: 18,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
  },
  {
    id: "3",
    authorId: "user3",
    authorName: "Juliana Costa",
    content: "Minha bebê completou 3 meses hoje! O tempo voa. Compartilhando essa conquista com vocês que me apoiaram tanto durante a gestação.",
    likesCount: 89,
    commentsCount: 34,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isLiked: false,
  },
  {
    id: "4",
    authorId: "user4",
    authorName: "Patricia Lima",
    content: "Meninas, alguém mais está sentindo muitas dores nas costas? Tenho 28 semanas e está bem desconfortável.",
    likesCount: 28,
    commentsCount: 15,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    isLiked: false,
  },
  {
    id: "5",
    authorId: "user5",
    authorName: "Fernanda Souza",
    content: "Acabei de fazer minha primeira ultrassom! Ver o coraçãozinho batendo foi emocionante demais. Chorei muito! 💕",
    likesCount: 156,
    commentsCount: 42,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: true,
  },
];

const MOCK_GROUPS: Group[] = [
  { id: "1", name: "Primeiro Trimestre", description: "Para mamães no início da jornada", memberCount: 1234, category: "gestacao" },
  { id: "2", name: "Amamentação", description: "Dicas e apoio para amamentar", memberCount: 2456, category: "pos-parto" },
  { id: "3", name: "Exercícios na Gravidez", description: "Mantendo-se ativa com segurança", memberCount: 890, category: "saude" },
  { id: "4", name: "Mães de Primeira Viagem", description: "Para quem está vivendo isso pela primeira vez", memberCount: 3421, category: "geral" },
  { id: "5", name: "Alimentação Saudável", description: "Nutrição para você e seu bebê", memberCount: 1876, category: "nutricao" },
  { id: "6", name: "Pós-parto Real", description: "Compartilhando experiências reais", memberCount: 2103, category: "pos-parto" },
];

const CATEGORY_COLORS: Record<string, string> = {
  gestacao: "#E11D48",
  "pos-parto": "#A78BFA",
  saude: "#6BAD78",
  geral: "#F59E0B",
  nutricao: "#EC4899",
};

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"feed" | "groups">("feed");
  const [searchQuery, setSearchQuery] = useState("");

  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const setPosts = useCommunityStore((s) => s.setPosts);
  const addPost = useCommunityStore((s) => s.addPost);
  const userName = useAppStore((s) => s.user?.name);

  const handleNewPost = (content: string, type: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: "currentUser",
      authorName: userName || "Você",
      content,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      type,
    };
    addPost(newPost);
  };

  const handleCommentPress = async (postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("PostDetail", { postId });
  };

  const handleSharePress = async (post: Post) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${post.content.substring(0, 100)}... - via Nossa Maternidade`,
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const handleOptionsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // For future: show action sheet with options
  };

  const handleJoinGroup = async (groupId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ComingSoon", {
      title: "Participar do Grupo",
      description: "Em breve você poderá participar de grupos e interagir com outras mães.",
      emoji: "👥",
      primaryCtaLabel: "Voltar",
      secondaryCtaLabel: "Ver Comunidade",
      relatedRoute: "Community",
    });
  };

  const handleCreateGroup = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Criar Grupo",
      description: "Em breve você poderá criar seu próprio grupo e reunir mães com interesses similares.",
      emoji: "✨",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleLoadMore = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // For future: load more posts from API
  };

  React.useEffect(() => {
    if (posts.length === 0) {
      setPosts(MOCK_POSTS);
    }
  }, []);

  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "agora";
    if (hours === 1) return "há 1 hora";
    if (hours < 24) return `há ${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
  };

  const POST_TYPE_STYLES: Record<string, { emoji: string; label: string; color: string; bgColor: string }> = {
    duvida: { emoji: "❓", label: "Dúvida", color: "#3B82F6", bgColor: "#EFF6FF" },
    desabafo: { emoji: "💭", label: "Desabafo", color: "#8B5CF6", bgColor: "#F5F3FF" },
    vitoria: { emoji: "🎉", label: "Vitória", color: "#10B981", bgColor: "#ECFDF5" },
    dica: { emoji: "💡", label: "Dica", color: "#F59E0B", bgColor: "#FFFBEB" },
  };

  const renderPost = (post: Post, index: number) => {
    const postType = post.type ? POST_TYPE_STYLES[post.type] : null;

    return (
      <Animated.View
        key={post.id}
        entering={FadeInUp.delay(index * 80).duration(500).springify()}
        className="mb-4"
      >
        <Pressable
          onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
          className="rounded-3xl p-5"
          style={{
            backgroundColor: "#FFF",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
          }}
        >
          {/* Post Type Badge */}
          {postType && (
            <View
              className="flex-row items-center self-start mb-3 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: postType.bgColor }}
            >
              <Text style={{ fontSize: 12, marginRight: 4 }}>{postType.emoji}</Text>
              <Text style={{ color: postType.color, fontSize: 12, fontWeight: "600" }}>
                {postType.label}
              </Text>
            </View>
          )}

          {/* Header */}
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-blush-200 items-center justify-center mr-3">
              <Ionicons name="person" size={22} color="#9E7269" />
            </View>
            <View className="flex-1">
              <Text className="text-warmGray-900 text-base font-semibold">
                {post.authorName}
              </Text>
              <Text className="text-warmGray-400 text-xs mt-0.5">
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
            <Pressable onPress={handleOptionsPress} className="w-8 h-8 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={20} color="#D6D3D1" />
            </Pressable>
          </View>

          {/* Content */}
          <Text className="text-warmGray-700 leading-6 mb-4">
            {post.content}
          </Text>

          {/* Actions */}
          <View className="flex-row items-center pt-4 border-t border-warmGray-100">
            <Pressable
              onPress={() => toggleLike(post.id)}
              className="flex-row items-center mr-6"
            >
              <Ionicons
                name={post.isLiked ? "heart" : "heart-outline"}
                size={22}
                color={post.isLiked ? "#E11D48" : "#A8A29E"}
              />
              <Text
                className={`text-sm ml-2 font-medium ${
                  post.isLiked ? "text-rose-600" : "text-warmGray-600"
                }`}
              >
                {post.likesCount}
              </Text>
            </Pressable>
            <Pressable onPress={() => handleCommentPress(post.id)} className="flex-row items-center mr-6">
              <Ionicons name="chatbubble-outline" size={20} color="#A8A29E" />
              <Text className="text-warmGray-600 text-sm ml-2 font-medium">
                {post.commentsCount}
              </Text>
            </Pressable>
            <Pressable onPress={() => handleSharePress(post)} className="flex-row items-center ml-auto">
              <Ionicons name="share-outline" size={20} color="#A8A29E" />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderGroup = (group: Group, index: number) => (
    <Animated.View
      key={group.id}
      entering={FadeInUp.delay(index * 80).duration(500).springify()}
      className="mb-4"
    >
      <Pressable
        className="rounded-3xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        }}
      >
        <LinearGradient
          colors={[CATEGORY_COLORS[group.category] || "#E11D48", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.3]}
          style={{ padding: 20 }}
        >
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 pr-3">
              <Text className="text-warmGray-900 text-lg font-semibold mb-1">
                {group.name}
              </Text>
              <Text className="text-warmGray-600 text-sm leading-5">
                {group.description}
              </Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${CATEGORY_COLORS[group.category] || "#E11D48"}15` }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: CATEGORY_COLORS[group.category] || "#E11D48" }}
              >
                {group.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-warmGray-100">
            <View className="flex-row items-center">
              <Ionicons name="people" size={16} color="#A8A29E" />
              <Text className="text-warmGray-600 text-xs ml-1.5 font-medium">
                {group.memberCount.toLocaleString()} membros
              </Text>
            </View>
            <Pressable
              onPress={() => handleJoinGroup(group.id)}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[group.category] || "#E11D48" }}
            >
              <Text className="text-white text-xs font-semibold">Participar</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: "#FFFCF9" }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={["#FFF1F2", "#FFFCF9"]}
          locations={[0, 1]}
          style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 }}
        >
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-warmGray-900 text-3xl font-serif">
                  Mães Valente
                </Text>
                <Text className="text-warmGray-500 text-sm mt-1">
                  Comunidade de apoio e inspiração
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate("NewPost")}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: "#E11D48",
                  shadowColor: "#E11D48",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Search Bar */}
            <View
              className="flex-row items-center rounded-2xl px-4 py-3 mb-4"
              style={{ backgroundColor: "#FFF" }}
            >
              <Ionicons name="search" size={20} color="#A8A29E" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar posts ou grupos..."
                placeholderTextColor="#A8A29E"
                className="flex-1 text-warmGray-800 ml-2"
              />
            </View>

            {/* Tabs */}
            <View className="flex-row">
              <Pressable
                onPress={() => setActiveTab("feed")}
                className="flex-1 items-center py-3 rounded-xl mr-2"
                style={{
                  backgroundColor: activeTab === "feed" ? "#E11D48" : "#FFF",
                }}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === "feed" ? "text-white" : "text-warmGray-600"
                  }`}
                >
                  Feed
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab("groups")}
                className="flex-1 items-center py-3 rounded-xl ml-2"
                style={{
                  backgroundColor: activeTab === "groups" ? "#E11D48" : "#FFF",
                }}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === "groups" ? "text-white" : "text-warmGray-600"
                  }`}
                >
                  Grupos
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
      >
        {activeTab === "feed" ? (
          <>
            {/* Composer */}
            <CommunityComposer onPost={handleNewPost} />

            {displayPosts.map((post, index) => renderPost(post, index))}

            {/* Load More */}
            <Pressable
              onPress={handleLoadMore}
              className="py-4 items-center rounded-2xl mt-2"
              style={{ backgroundColor: "#FFF" }}
            >
              <Text className="text-warmGray-600 font-medium">Carregar mais posts</Text>
            </Pressable>
          </>
        ) : (
          <>
            {MOCK_GROUPS.map((group, index) => renderGroup(group, index))}

            {/* Create Group */}
            <Pressable
              onPress={handleCreateGroup}
              className="py-4 items-center rounded-2xl mt-2 border-2 border-dashed border-warmGray-200"
              style={{ backgroundColor: "#FFF" }}
            >
              <Ionicons name="add-circle-outline" size={24} color="#A8A29E" />
              <Text className="text-warmGray-600 font-medium mt-2">
                Criar novo grupo
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
