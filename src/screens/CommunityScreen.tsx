import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Share } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MainTabScreenProps, Post, Group } from "../types/navigation";
import { useCommunityStore, useAppStore } from "../state/store";
import CommunityComposer from "../components/CommunityComposer";
import { Avatar } from "../components/ui";
import { shadowPresets } from "../utils/shadow";
import * as Haptics from "expo-haptics";

// Imgur images
const IMGUR_IMAGES = {
  valentina: "https://i.imgur.com/oB9ewPG.jpg",
  ebook: "https://i.imgur.com/LF2PX1w.jpg",
  video: "https://i.imgur.com/tNIrNIs.jpg",
};

// Featured content cards
const DESTAQUES = [
  {
    id: "1",
    tag: "E-BOOK GRÁTIS",
    tagColor: "#f4258c",
    title: "Guia Completo do Sono do Bebê",
    image: IMGUR_IMAGES.ebook,
  },
  {
    id: "2",
    tag: "NOVO VÍDEO",
    tagColor: "#A855F7",
    title: "Desafio da Amamentação",
    image: IMGUR_IMAGES.video,
  },
];

// Filter chips
const FILTER_CHIPS = [
  { id: "todos", label: "Todos", active: true },
  { id: "recentes", label: "Recentes", icon: "funnel-outline" },
  { id: "perguntas", label: "Perguntas p/ Valent..." },
];

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    authorId: "valentina",
    authorName: "Valentina",
    authorAvatar: IMGUR_IMAGES.valentina,
    content: "5 coisas que não te contaram sobre o puerpério ✨\n\nMães, preparei uma lista especial hoje. O puerpério é uma montanha-russa, mas saber disso antes ajuda muito! Vejam as dicas completas no vídeo...",
    likesCount: 1200,
    commentsCount: 342,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    type: "dica",
    tag: "FIXADO",
    tagColor: "#6B7280",
  },
  {
    id: "2",
    authorId: "user2",
    authorName: "Ana Nogueira",
    content: "A amamentação não está sendo fácil\n\nPensei que seria natural, mas estou sofrendo com fissuras e muita sensibilidade. Alguém passou por isso?",
    likesCount: 156,
    commentsCount: 48,
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    isLiked: true,
    type: "desabafo",
    tag: "DESABAFO",
    tagColor: "#f4258c",
  },
  {
    id: "3",
    authorId: "user3",
    authorName: "Carla Dias",
    content: "O positivo finalmente veio! 🌈\n\nDepois de 2 anos de tentativas, hoje recebi o meu milagre. Não desistam mamães!",
    likesCount: 892,
    commentsCount: 340,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    isLiked: false,
    type: "vitoria",
    tag: "VITÓRIA",
    tagColor: "#10B981",
  },
  {
    id: "4",
    authorId: "user4",
    authorName: "Mariana Santos",
    content: "Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo. Alguém tem dicas para o primeiro trimestre?",
    likesCount: 45,
    commentsCount: 23,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: false,
    type: "duvida",
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

  const handleNewPost = (content: string, type: string, imageUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: "currentUser",
      authorName: userName || "Você",
      content,
      imageUrl,
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
    } catch {
      // Handle error silently
    }
  };

  const handleOptionsPress = async (postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Opções do Post",
      description: "Em breve você poderá denunciar, ocultar ou salvar posts.",
      emoji: "⚙️",
      primaryCtaLabel: "Voltar",
    });
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
    navigation.navigate("ComingSoon", {
      title: "Mais Posts",
      description: "Em breve teremos mais posts e conteúdo da comunidade para você explorar.",
      emoji: "📄",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleNotificationsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Notificações",
      description: "Em breve você receberá notificações sobre novos posts e interações.",
      emoji: "🔔",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleAskValentina = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Assistant");
  };

  const handleDestaquePress = async (destaque: typeof DESTAQUES[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: destaque.title,
      description: "Conteúdo exclusivo em breve!",
      emoji: "✨",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleGroupPress = async (group: Group) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: group.name,
      description: `${group.description}. Em breve você poderá acessar este grupo e interagir com ${group.memberCount.toLocaleString()} membros.`,
      emoji: "👥",
      primaryCtaLabel: "Voltar",
      secondaryCtaLabel: "Participar",
      relatedRoute: "Community",
    });
  };

  // Carregar mock posts no primeiro render
  React.useEffect(() => {
    if (posts.length === 0) {
      setPosts(MOCK_POSTS);
    }
  }, [posts.length, setPosts]);

  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

// Renderizar Post individual (memoizado para performance)
const PostCard = React.memo(({ post, index, onPress, onToggleLike, onComment }: {
  post: Post;
  index: number;
  onPress: () => void;
  onToggleLike: () => void;
  onComment: () => void;
}) => {
  const postTag = (post as Post & { tag?: string; tagColor?: string }).tag;
  const postTagColor = (post as Post & { tag?: string; tagColor?: string }).tagColor;
  
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

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500).springify()}
      className="mb-4"
    >
      <Pressable
        onPress={onPress}
        className="rounded-2xl p-4"
        style={[{ backgroundColor: "#FFF" }, shadowPresets.md]}
        accessibilityRole="button"
        accessibilityLabel={`Post de ${post.authorName}`}
      >
        {/* Header with Tag */}
        <View className="flex-row items-center mb-3">
          {post.authorAvatar ? (
            <Image
              source={{ uri: post.authorAvatar }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
              contentFit="cover"
            />
          ) : (
            <Avatar
              size={40}
              isNathalia={post.authorName === "Valentina"}
              fallbackIcon="person"
              fallbackColor="#9E7269"
              fallbackBgColor="rgba(188, 139, 123, 0.15)"
              style={{ marginRight: 12 }}
            />
          )}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-warmGray-900 text-sm font-semibold">
                {post.authorName}
              </Text>
              {postTag === "FIXADO" && (
                <Ionicons name="pin" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text className="text-warmGray-400 text-xs">
              {formatTimeAgo(post.createdAt)} • {post.type === "dica" ? "Dicas Rápidas" : post.type === "desabafo" ? "Puerpério" : post.type === "vitoria" ? "Tentante" : "Geral"}
            </Text>
          </View>
          {postTag && (
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${postTagColor}15` }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: postTagColor }}
              >
                {postTag}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <Text className="text-warmGray-900 text-base font-semibold mb-1" numberOfLines={2}>
          {post.content.split("\n")[0]}
        </Text>
        <Text className="text-warmGray-600 text-sm leading-5 mb-3" numberOfLines={2}>
          {post.content.split("\n").slice(1).join(" ").trim() || post.content}
        </Text>

        {/* Image */}
        {post.imageUrl && (
          <View className="mb-3 rounded-xl overflow-hidden">
            <Image
              source={{ uri: post.imageUrl }}
              style={{ width: "100%", height: 200 }}
              contentFit="cover"
            />
          </View>
        )}

        {/* Actions */}
        <View className="flex-row items-center">
          <Pressable
            onPress={onToggleLike}
            className="flex-row items-center mr-4"
          >
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={16}
              color={post.isLiked ? "#f4258c" : "#A8A29E"}
            />
            <Text className="text-warmGray-500 text-xs ml-1">
              {post.likesCount >= 1000 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount}
            </Text>
          </Pressable>
          <Pressable
            onPress={onComment}
            className="flex-row items-center"
          >
            <Ionicons name="chatbubble-outline" size={14} color="#A8A29E" />
            <Text className="text-warmGray-500 text-xs ml-1">{post.commentsCount}</Text>
          </Pressable>
          <View className="flex-1" />
          <Pressable
            onPress={onComment}
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#F5F5F4" }}
          >
            <Ionicons name="arrow-undo-outline" size={14} color="#78716C" />
            <Text className="text-warmGray-600 text-xs ml-1 font-medium">Responder</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
});

  const renderGroup = (group: Group, index: number) => (
    <Animated.View
      key={group.id}
      entering={FadeInUp.delay(index * 80).duration(500).springify()}
      className="mb-4"
    >
      <Pressable
        onPress={() => handleGroupPress(group)}
        className="rounded-3xl overflow-hidden"
        style={shadowPresets.md}
        accessibilityRole="button"
        accessibilityLabel={`Grupo: ${group.name}`}
        accessibilityHint="Abre informações sobre o grupo"
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
              accessibilityRole="button"
              accessibilityLabel={`Participar do grupo ${group.name}`}
              accessibilityHint="Participa do grupo selecionado"
            >
              <Text className="text-white text-xs font-semibold">Participar</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: "#f8f5f7" }}>
      {/* Header - MãesValente Style */}
      <View style={{ paddingTop: insets.top, backgroundColor: "#FFF" }}>
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          {/* Top Bar */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: IMGUR_IMAGES.valentina }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                contentFit="cover"
              />
              <View className="ml-3">
                <View className="flex-row items-center">
                  <Text className="text-warmGray-900 text-xl font-semibold">
                    MãesValente
                  </Text>
                  <View className="ml-1 bg-rose-100 px-1.5 py-0.5 rounded">
                    <Text className="text-rose-600 text-xs font-medium">HOST</Text>
                  </View>
                </View>
                <Text className="text-warmGray-500 text-xs">
                  Comunidade da Valentina
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Pressable
                onPress={handleNotificationsPress}
                className="mr-4"
                accessibilityRole="button"
                accessibilityLabel="Notificações"
              >
                <Ionicons name="notifications-outline" size={24} color="#1C1917" />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Profile" as never)}
                accessibilityRole="button"
                accessibilityLabel="Perfil"
              >
                <Ionicons name="person-circle-outline" size={28} color="#1C1917" />
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <View className="px-6 pb-4">
            <View
              className="flex-row items-center rounded-xl px-4 py-3"
              style={{ backgroundColor: "#F5F5F4" }}
            >
              <Ionicons name="search" size={18} color="#A8A29E" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar no MãesValente..."
                placeholderTextColor="#A8A29E"
                className="flex-1 text-warmGray-800 ml-2 text-sm"
                accessibilityLabel="Buscar no MãesValente"
              />
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row px-6 border-b border-warmGray-100">
            <Pressable
              onPress={() => setActiveTab("feed")}
              className="mr-6 pb-3"
              style={{
                borderBottomWidth: activeTab === "feed" ? 2 : 0,
                borderBottomColor: "#f4258c",
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "feed" }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "feed" ? "text-rose-600" : "text-warmGray-500"
                }`}
              >
                Feed
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("groups")}
              className="pb-3"
              style={{
                borderBottomWidth: activeTab === "groups" ? 2 : 0,
                borderBottomColor: "#f4258c",
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "groups" }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "groups" ? "text-rose-600" : "text-warmGray-500"
                }`}
              >
                Grupos
              </Text>
            </Pressable>
          </View>

          {/* Filter Chips */}
          {activeTab === "feed" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-3"
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {FILTER_CHIPS.map((chip) => (
                <Pressable
                  key={chip.id}
                  className="flex-row items-center mr-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: chip.active ? "#f4258c" : "#FFF",
                    borderWidth: chip.active ? 0 : 1,
                    borderColor: "#E7E5E4",
                  }}
                >
                  {chip.icon && (
                    <Ionicons
                      name={chip.icon as keyof typeof Ionicons.glyphMap}
                      size={14}
                      color={chip.active ? "#FFF" : "#78716C"}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    className={`text-sm font-medium ${
                      chip.active ? "text-white" : "text-warmGray-600"
                    }`}
                  >
                    {chip.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
      >
        {activeTab === "feed" ? (
          <>
            {/* Destaques da Valentina */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Ionicons name="star" size={18} color="#f4258c" />
                <Text className="text-warmGray-900 text-base font-semibold ml-2">
                  Destaques da Valentina
                </Text>
                <Pressable className="ml-auto">
                  <Text className="text-rose-600 text-sm">Ver Conteúdo Completo</Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -24 }}
                contentContainerStyle={{ paddingHorizontal: 24 }}
              >
                {DESTAQUES.map((destaque) => (
                  <Pressable
                    key={destaque.id}
                    onPress={() => handleDestaquePress(destaque)}
                    className="mr-3 rounded-2xl overflow-hidden"
                    style={[{ width: 180 }, shadowPresets.md]}
                  >
                    <Image
                      source={{ uri: destaque.image }}
                      style={{ width: 180, height: 120 }}
                      contentFit="cover"
                    />
                    <View
                      className="absolute top-3 left-3 px-2 py-1 rounded"
                      style={{ backgroundColor: destaque.tagColor }}
                    >
                      <Text className="text-white text-xs font-semibold">{destaque.tag}</Text>
                    </View>
                    <View className="p-3 bg-white">
                      <Text className="text-warmGray-900 text-sm font-medium" numberOfLines={2}>
                        {destaque.title}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Pergunte à Valentina */}
            <Pressable
              onPress={handleAskValentina}
              className="rounded-2xl p-4 mb-6"
              style={[{ backgroundColor: "#EFF6FF" }, shadowPresets.sm]}
            >
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#DBEAFE" }}
                >
                  <Text className="text-lg">❓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-warmGray-900 text-base font-semibold">
                    Pergunte à Valentina
                  </Text>
                  <Text className="text-warmGray-500 text-xs">
                    Envie sua dúvida e ela poderá ser respondida na próxima live da comunidade!
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={handleAskValentina}
                className="mt-3 py-2.5 rounded-full items-center"
                style={{ backgroundColor: "#FFF" }}
              >
                <Text className="text-rose-600 font-semibold text-sm">
                  Enviar minha dúvida →
                </Text>
              </Pressable>
            </Pressable>

            {/* Composer */}
            <CommunityComposer onPost={handleNewPost} />

            {displayPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
                onToggleLike={() => toggleLike(post.id)}
                onComment={() => handleCommentPress(post.id)}
              />
            ))}

            {/* CTA - Compartilhe sua jornada */}
            <Pressable
              onPress={() => navigation.navigate("NewPost")}
              className="rounded-2xl p-4 flex-row items-center justify-center mt-4"
              style={{ backgroundColor: "#f4258c" }}
              accessibilityRole="button"
              accessibilityLabel="Compartilhe sua jornada"
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text className="text-white text-sm font-semibold ml-2">
                Compartilhe sua jornada
              </Text>
            </Pressable>

            {/* Você viu tudo por agora */}
            <View className="items-center py-6">
              <Text className="text-warmGray-400 text-sm">Você viu tudo por agora!</Text>
            </View>
          </>
        ) : (
          <>
            {MOCK_GROUPS.map((group, index) => renderGroup(group, index))}

            {/* Create Group */}
            <Pressable
              onPress={handleCreateGroup}
              className="py-4 items-center rounded-2xl mt-2 border-2 border-dashed border-warmGray-200"
              style={{ backgroundColor: "#FFF" }}
              accessibilityRole="button"
              accessibilityLabel="Criar novo grupo"
              accessibilityHint="Abre o formulário para criar um novo grupo"
            >
              <Ionicons name="add-circle-outline" size={24} color="#A8A29E" />
              <Text className="text-warmGray-600 font-medium mt-2">
                Criar novo grupo
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* FAB - Floating Action Button (Estilo Boa Noite Mãe) */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(600).springify()}
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("NewPost", {})}
          style={{
            shadowColor: "#f4258c",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }}
          accessibilityRole="button"
          accessibilityLabel="Compartilhe sua jornada"
        >
          <LinearGradient
            colors={["#f4258c", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              paddingHorizontal: 28,
              borderRadius: 28,
            }}
          >
            <Ionicons name="create" size={20} color="#FFFFFF" />
            <Text className="text-white text-base font-bold ml-3">
              Compartilhe sua jornada
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
