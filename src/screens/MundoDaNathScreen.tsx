/**
 * Mundo da Nath - Conteúdo exclusivo da influenciadora Nathalia Valente
 *
 * Tela premium onde a Nath posta conteúdos exclusivos para a comunidade.
 * Features:
 * - Feed de posts (texto, imagem, vídeo)
 * - Stories/Destaques
 * - Modo admin para a própria Nath criar conteúdos
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../hooks/useTheme";
import { COLORS, SPACING, RADIUS, GRADIENTS } from "../theme/design-system";
import { RootStackScreenProps } from "../types/navigation";

// Types
interface NathPost {
  id: string;
  type: "text" | "image" | "video" | "tip" | "announcement";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isPinned?: boolean;
}

interface NathStory {
  id: string;
  title: string;
  emoji: string;
  thumbnailColor: string;
  isNew?: boolean;
}

// Mock Data
const MOCK_STORIES: NathStory[] = [
  { id: "1", title: "Rotina", emoji: "☀️", thumbnailColor: COLORS.semantic.warning, isNew: true },
  { id: "2", title: "Dicas", emoji: "💡", thumbnailColor: COLORS.primary[500] },
  { id: "3", title: "Q&A", emoji: "❓", thumbnailColor: COLORS.secondary[500] },
  { id: "4", title: "Receitas", emoji: "🥗", thumbnailColor: COLORS.semantic.success },
  { id: "5", title: "Bebês", emoji: "👶", thumbnailColor: COLORS.accent[500] },
  { id: "6", title: "Fitness", emoji: "💪", thumbnailColor: "#8B5CF6" },
];

const MOCK_POSTS: NathPost[] = [
  {
    id: "1",
    type: "announcement",
    content: "Oii meninas! 💕 Bem-vindas ao meu cantinho especial no app! Aqui vou compartilhar conteúdos exclusivos, dicas e muito mais. Fico muito feliz em ter vocês comigo nessa jornada!",
    likesCount: 1234,
    commentsCount: 89,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: true,
    isPinned: true,
  },
  {
    id: "2",
    type: "tip",
    content: "Dica do dia: Lembre de beber pelo menos 2L de água! Durante a gestação e amamentação, a hidratação é fundamental. Eu deixo uma garrafinha sempre por perto 💧",
    likesCount: 456,
    commentsCount: 34,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: false,
  },
  {
    id: "3",
    type: "image",
    content: "Nosso momento de conexão de hoje 🥰 Cada dia ao lado dele é uma benção. Aproveitem cada segundo, mães!",
    imageUrl: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800",
    likesCount: 2341,
    commentsCount: 156,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isLiked: true,
  },
  {
    id: "4",
    type: "text",
    content: "Ser mãe é descobrir forças que você nem sabia que tinha. É chorar de cansaço e de amor ao mesmo tempo. É não dormir e ainda assim sorrir quando vê aquele rostinho. É uma jornada difícil, mas incrivelmente recompensadora. Vocês são incríveis! 💪✨",
    likesCount: 892,
    commentsCount: 67,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: false,
  },
  {
    id: "5",
    type: "tip",
    content: "Preparo pro parto: Estou fazendo exercícios de respiração todos os dias. 5 minutos de manhã e 5 à noite. Ajuda muito com a ansiedade e prepara o corpo. Quem quer que eu faça um vídeo mostrando?",
    likesCount: 678,
    commentsCount: 234,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    isLiked: true,
  },
];

const POST_TYPE_CONFIG: Record<string, { emoji: string; label: string; gradient: readonly [string, string] }> = {
  announcement: { emoji: "📢", label: "Novidade", gradient: GRADIENTS.primary as [string, string] },
  tip: { emoji: "💡", label: "Dica da Nath", gradient: [COLORS.semantic.warning, "#F59E0B"] as const },
  image: { emoji: "📸", label: "Momento", gradient: [COLORS.accent[400], COLORS.accent[600]] as const },
  video: { emoji: "🎬", label: "Vídeo", gradient: ["#8B5CF6", "#7C3AED"] as const },
  text: { emoji: "💭", label: "Reflexão", gradient: [COLORS.secondary[400], COLORS.secondary[600]] as const },
};

type Props = RootStackScreenProps<"MundoDaNath">;

// Story Item Component
const StoryItem: React.FC<{
  story: NathStory;
  onPress: () => void;
  index: number;
}> = ({ story, onPress, index }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).duration(400)}
      style={[{ marginRight: SPACING.md }, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            padding: 3,
            backgroundColor: story.isNew ? COLORS.primary[500] : COLORS.neutral[300],
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 33,
              backgroundColor: story.thumbnailColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 28 }}>{story.emoji}</Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: COLORS.text.secondary,
            textAlign: "center",
            marginTop: SPACING.xs,
          }}
          numberOfLines={1}
        >
          {story.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

// Post Card Component
const PostCard: React.FC<{
  post: NathPost;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  isDark: boolean;
}> = ({ post, index, onLike, onComment, onShare, isDark }) => {
  const config = POST_TYPE_CONFIG[post.type];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLikePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.98, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onLike(post.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "agora";
    if (hours === 1) return "há 1h";
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
  };

  const bgCard = isDark ? COLORS.neutral[800] : "#FFFFFF";
  const textPrimary = isDark ? COLORS.neutral[100] : COLORS.text.primary;
  const textSecondary = isDark ? COLORS.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? COLORS.neutral[700] : COLORS.neutral[200];

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500)}
      style={[
        {
          backgroundColor: bgCard,
          borderRadius: RADIUS["2xl"],
          marginBottom: SPACING.lg,
          overflow: "hidden",
          borderWidth: post.isPinned ? 2 : 1,
          borderColor: post.isPinned ? COLORS.primary[400] : borderColor,
          shadowColor: COLORS.neutral[900],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        },
        animatedStyle,
      ]}
    >
      {/* Pinned indicator */}
      {post.isPinned && (
        <LinearGradient
          colors={GRADIENTS.primary as unknown as readonly [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: SPACING.sm,
          }}
        >
          <Ionicons name="pin" size={14} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600", marginLeft: SPACING.xs }}>
            Fixado
          </Text>
        </LinearGradient>
      )}

      {/* Header */}
      <View style={{ padding: SPACING.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.md }}>
          {/* Avatar da Nath */}
          <LinearGradient
            colors={GRADIENTS.primary as unknown as readonly [string, string]}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              marginRight: SPACING.md,
            }}
          >
            <Text style={{ fontSize: 20, color: "#FFFFFF", fontWeight: "700" }}>N</Text>
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: textPrimary }}>
                Nathalia Valente
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.primary[100],
                  borderRadius: RADIUS.full,
                  paddingHorizontal: SPACING.sm,
                  paddingVertical: 2,
                  marginLeft: SPACING.sm,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "600", color: COLORS.primary[600] }}>
                  ✓ Criadora
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>

          {/* Post Type Badge */}
          <LinearGradient
            colors={config.gradient}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.xs,
              borderRadius: RADIUS.full,
            }}
          >
            <Text style={{ fontSize: 12, marginRight: 4 }}>{config.emoji}</Text>
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#FFFFFF" }}>
              {config.label}
            </Text>
          </LinearGradient>
        </View>

        {/* Content */}
        <Text
          style={{
            fontSize: 15,
            lineHeight: 24,
            color: textPrimary,
            marginBottom: post.imageUrl ? SPACING.md : 0,
          }}
        >
          {post.content}
        </Text>
      </View>

      {/* Image */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={{
            width: "100%",
            height: 280,
            backgroundColor: COLORS.neutral[200],
          }}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: SPACING.lg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Pressable
          onPress={handleLikePress}
          style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING["2xl"] }}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={22}
            color={post.isLiked ? COLORS.accent[500] : textSecondary}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginLeft: SPACING.sm,
              color: post.isLiked ? COLORS.accent[500] : textSecondary,
            }}
          >
            {post.likesCount.toLocaleString()}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onComment(post.id)}
          style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING["2xl"] }}
        >
          <Ionicons name="chatbubble-outline" size={20} color={textSecondary} />
          <Text style={{ fontSize: 14, fontWeight: "500", marginLeft: SPACING.sm, color: textSecondary }}>
            {post.commentsCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onShare(post.id)}
          style={{ marginLeft: "auto" }}
        >
          <Ionicons name="share-outline" size={20} color={textSecondary} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

// New Post Modal Component
const NewPostModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, type: NathPost["type"], imageUri?: string) => void;
}> = ({ visible, onClose, onSubmit }) => {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<NathPost["type"]>("text");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim(), selectedType, selectedImage ?? undefined);
    setContent("");
    setSelectedType("text");
    setSelectedImage(null);
    onClose();
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setSelectedType("image");
    }
  };

  const postTypes: { type: NathPost["type"]; emoji: string; label: string }[] = [
    { type: "text", emoji: "💭", label: "Reflexão" },
    { type: "tip", emoji: "💡", label: "Dica" },
    { type: "announcement", emoji: "📢", label: "Novidade" },
    { type: "image", emoji: "📸", label: "Momento" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: COLORS.background.primary }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: SPACING["2xl"],
            paddingTop: insets.top + SPACING.md,
            paddingBottom: SPACING.md,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.neutral[200],
          }}
        >
          <Pressable onPress={onClose}>
            <Text style={{ fontSize: 16, color: COLORS.text.secondary }}>Cancelar</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: "700", color: COLORS.text.primary }}>
            Novo Conteúdo
          </Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!content.trim()}
            style={{
              backgroundColor: content.trim() ? COLORS.primary[500] : COLORS.neutral[300],
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.sm,
              borderRadius: RADIUS.full,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFFFFF" }}>
              Publicar
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: SPACING["2xl"] }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post Type Selection */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.text.secondary, marginBottom: SPACING.md }}>
            Tipo de conteúdo
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: SPACING.xl }}
          >
            {postTypes.map((item) => (
              <Pressable
                key={item.type}
                onPress={() => setSelectedType(item.type)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: SPACING.lg,
                  paddingVertical: SPACING.md,
                  borderRadius: RADIUS.full,
                  marginRight: SPACING.sm,
                  backgroundColor: selectedType === item.type ? COLORS.primary[500] : COLORS.neutral[100],
                  borderWidth: 1,
                  borderColor: selectedType === item.type ? COLORS.primary[500] : COLORS.neutral[200],
                }}
              >
                <Text style={{ fontSize: 16, marginRight: SPACING.xs }}>{item.emoji}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedType === item.type ? "#FFFFFF" : COLORS.text.secondary,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Content Input */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="O que você quer compartilhar com a comunidade?"
            placeholderTextColor={COLORS.neutral[400]}
            multiline
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: COLORS.text.primary,
              minHeight: 150,
              textAlignVertical: "top",
              backgroundColor: COLORS.neutral[50],
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: COLORS.neutral[200],
            }}
          />

          {/* Selected Image Preview */}
          {selectedImage && (
            <View style={{ marginTop: SPACING.lg, position: "relative" }}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: RADIUS.xl,
                }}
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setSelectedImage(null)}
                style={{
                  position: "absolute",
                  top: SPACING.sm,
                  right: SPACING.sm,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: RADIUS.full,
                  padding: SPACING.sm,
                }}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          )}

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: SPACING.xl,
              paddingTop: SPACING.lg,
              borderTopWidth: 1,
              borderTopColor: COLORS.neutral[200],
            }}
          >
            <Pressable
              onPress={handlePickImage}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.md,
                borderRadius: RADIUS.lg,
                backgroundColor: COLORS.neutral[100],
              }}
            >
              <Ionicons name="image-outline" size={20} color={COLORS.primary[500]} />
              <Text style={{ marginLeft: SPACING.sm, fontWeight: "500", color: COLORS.primary[500] }}>
                Adicionar foto
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Main Screen Component
export default function MundoDaNathScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [posts, setPosts] = useState<NathPost[]>(MOCK_POSTS);
  const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);

  // TODO: Verificar se usuário é admin (a própria Nath)
  const isAdmin = true; // Temporariamente true para teste

  const bgPrimary = isDark ? colors.background.primary : COLORS.background.primary;
  const textPrimary = isDark ? colors.neutral[100] : COLORS.text.primary;
  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post
      )
    );
  }, []);

  const handleComment = useCallback(async (_postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to comments/post detail with _postId
    navigation.navigate("ComingSoon", {
      title: "Comentários",
      description: "Em breve você poderá comentar nos posts da Nath!",
      emoji: "💬",
    });
  }, [navigation]);

  const handleShare = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Share functionality
  }, []);

  const handleStoryPress = useCallback(async (story: NathStory) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: story.title,
      description: `Conteúdos de ${story.title} da Nath em breve!`,
      emoji: story.emoji,
    });
  }, [navigation]);

  const handleNewPost = useCallback(
    (content: string, type: NathPost["type"], imageUri?: string) => {
      const newPost: NathPost = {
        id: Date.now().toString(),
        type,
        content,
        imageUrl: imageUri,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  // Separate pinned and regular posts
  const { pinnedPosts, regularPosts } = useMemo(() => {
    const pinned = posts.filter((p) => p.isPinned);
    const regular = posts.filter((p) => !p.isPinned);
    return { pinnedPosts: pinned, regularPosts: regular };
  }, [posts]);

  const renderHeader = () => (
    <>
      {/* Hero Header */}
      <LinearGradient
        colors={GRADIENTS.primary as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + SPACING.lg,
          paddingHorizontal: SPACING["2xl"],
          paddingBottom: SPACING["3xl"],
          borderBottomLeftRadius: RADIUS["3xl"],
          borderBottomRightRadius: RADIUS["3xl"],
        }}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: SPACING.lg,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>

        {/* Profile Section */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={{ alignItems: "center" }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: SPACING.lg,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: "700", color: COLORS.primary[500] }}>N</Text>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#FFFFFF",
              marginBottom: SPACING.xs,
              fontFamily: "DMSerifDisplay-Regular",
            }}
          >
            Mundo da Nath
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            Conteúdos exclusivos da Nathalia Valente 💕
          </Text>

          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              marginTop: SPACING.xl,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: RADIUS.xl,
              paddingHorizontal: SPACING.xl,
              paddingVertical: SPACING.md,
            }}
          >
            <View style={{ alignItems: "center", marginRight: SPACING["3xl"] }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>
                {posts.length}
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Posts</Text>
            </View>
            <View style={{ alignItems: "center", marginRight: SPACING["3xl"] }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>12.5K</Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Seguidores</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>
                {posts.reduce((acc, p) => acc + p.likesCount, 0).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Curtidas</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Stories Section */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={{ marginTop: SPACING.xl }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: textPrimary,
            marginBottom: SPACING.md,
            marginLeft: SPACING["2xl"],
          }}
        >
          Destaques ✨
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING["2xl"] }}
        >
          {MOCK_STORIES.map((story, index) => (
            <StoryItem
              key={story.id}
              story={story}
              index={index}
              onPress={() => handleStoryPress(story)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Posts Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: SPACING["2xl"],
          marginBottom: SPACING.lg,
          paddingHorizontal: SPACING["2xl"],
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", color: textPrimary }}>
          Publicações
        </Text>
        <Text style={{ fontSize: 14, color: textSecondary }}>
          {posts.length} posts
        </Text>
      </View>

      {/* Pinned Posts */}
      {pinnedPosts.map((post, index) => (
        <View key={post.id} style={{ paddingHorizontal: SPACING["2xl"] }}>
          <PostCard
            post={post}
            index={index}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            isDark={isDark}
          />
        </View>
      ))}
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bgPrimary }}>
      <FlatList
        data={regularPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: SPACING["2xl"] }}>
            <PostCard
              post={item}
              index={index + pinnedPosts.length}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              isDark={isDark}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={{ height: 100 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Admin FAB - Criar novo post */}
      {isAdmin && (
        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          style={{
            position: "absolute",
            bottom: insets.bottom + SPACING.xl,
            right: SPACING["2xl"],
          }}
        >
          <Pressable
            onPress={() => setIsNewPostModalVisible(true)}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              shadowColor: COLORS.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={GRADIENTS.primary as unknown as readonly [string, string]}
              style={{
                flex: 1,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add" size={32} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      {/* New Post Modal */}
      <NewPostModal
        visible={isNewPostModalVisible}
        onClose={() => setIsNewPostModalVisible(false)}
        onSubmit={handleNewPost}
      />
    </View>
  );
}
