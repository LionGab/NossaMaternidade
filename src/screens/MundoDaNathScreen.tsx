/**
 * Mundo da Nath - Conteúdo exclusivo da influenciadora Nathalia Valente
 *
 * Tela premium onde a Nath posta conteúdos exclusivos para a comunidade.
 * Features:
 * - Feed de posts (texto, imagem, vídeo)
 * - Stories/Destaques
 * - Modo admin para a própria Nath criar conteúdos
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GESTACAO_POST, MAES_VALENTE_REEL, PARTO_REEL } from "../config/nath-content";
import { useAdmin } from "../hooks/useAdmin";
import { useTheme } from "../hooks/useTheme";
import { spacing, radius, shadows, overlay, gradients, brand, neutral, surface } from "../theme/tokens";
import { RootStackScreenProps } from "../types/navigation";

// Compatibility aliases for existing code
const GRADIENTS = gradients;
const OVERLAY = overlay;
const RADIUS = radius;
const SHADOWS = shadows;
const SPACING = spacing;
const COLORS = {
  primary: brand.primary,
  accent: brand.accent,
  neutral: neutral,
  background: {
    primary: surface.light.base,
    card: surface.light.card,
  },
  text: {
    primary: neutral[900],
    secondary: neutral[600],
  },
};

// URL da foto da Nathalia Valente
const NATHALIA_AVATAR_URL = "https://i.imgur.com/37dbPJE.jpg";

// Types
interface NathPost {
  id: string;
  type: "text" | "image" | "video" | "tip" | "announcement" | "reel";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  externalUrl?: string; // URL externa (Instagram, TikTok, etc)
  platform?: "instagram" | "tiktok" | "youtube" | "cnn";
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

// Destaques - Conteúdos reais da Nathalia Valente
const MOCK_STORIES: NathStory[] = [
  { id: "1", title: "Parto", emoji: "🩵", thumbnailColor: COLORS.primary[100], isNew: true },
  { id: "2", title: "Gestação", emoji: "🤰", thumbnailColor: COLORS.primary[100] },
  { id: "3", title: "Thales", emoji: "👶", thumbnailColor: COLORS.primary[100], isNew: true },
  { id: "4", title: "Rotina", emoji: "☀️", thumbnailColor: COLORS.primary[100] },
  { id: "5", title: "Dicas", emoji: "💡", thumbnailColor: COLORS.primary[100] },
  { id: "6", title: "Q&A", emoji: "❓", thumbnailColor: COLORS.primary[100] },
];

// Posts reais da Nathalia Valente - Maternidade & Rotina
// Baseado na decisão final: 5 conteúdos essenciais para lançamento
const MOCK_POSTS: NathPost[] = [
  {
    id: "1",
    type: "announcement",
    content:
      "Oii meninas! 💕 Bem-vindas ao meu cantinho especial no app! Aqui vou compartilhar conteúdos exclusivos, dicas e muito mais. Fico muito feliz em ter vocês comigo nessa jornada da maternidade!",
    likesCount: 1234,
    commentsCount: 89,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: true,
    isPinned: true,
  },
  {
    id: "2",
    type: "reel",
    content: PARTO_REEL.description,
    imageUrl: PARTO_REEL.thumbnailUrl,
    externalUrl: PARTO_REEL.url,
    platform: "instagram",
    likesCount: 45231,
    commentsCount: 2341,
    createdAt: "2025-09-10T10:00:00.000Z",
    isLiked: true,
    isPinned: true, // 🥇 Conteúdo âncora do "Mundo da Nath"
  },
  {
    id: "3",
    type: "reel",
    content: MAES_VALENTE_REEL.description,
    imageUrl: MAES_VALENTE_REEL.thumbnailUrl,
    externalUrl: MAES_VALENTE_REEL.url,
    platform: "instagram",
    likesCount: 38921,
    commentsCount: 2156,
    createdAt: "2025-10-05T14:00:00.000Z",
    isLiked: true,
    isPinned: true, // 🥇 Vídeo principal da seção Mães Valente
  },
  {
    id: "4",
    type: "image",
    content: GESTACAO_POST.description,
    imageUrl: GESTACAO_POST.thumbnailUrl,
    externalUrl: GESTACAO_POST.url,
    platform: "instagram",
    likesCount: 32456,
    commentsCount: 1567,
    createdAt: "2025-08-15T14:00:00.000Z",
    isLiked: true,
  },
  {
    id: "5",
    type: "tip",
    content:
      "Dica do dia: Lembre de beber pelo menos 2L de água! Durante a gestação e amamentação, a hidratação é fundamental. Eu deixo uma garrafinha sempre por perto 💧",
    likesCount: 456,
    commentsCount: 34,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: false,
  },
  {
    id: "6",
    type: "text",
    content:
      "Ser mãe é descobrir forças que você nem sabia que tinha. É chorar de cansaço e de amor ao mesmo tempo. É não dormir e ainda assim sorrir quando vê aquele rostinho. É uma jornada difícil, mas incrivelmente recompensadora. Vocês são incríveis! 💪✨",
    likesCount: 892,
    commentsCount: 67,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: false,
  },
];

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

  // Calm FemTech: fundo surface.card, borda primary apenas quando ativo
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).duration(400)}
      style={[{ marginRight: SPACING.sm }, animatedStyle]}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            padding: 2,
            borderWidth: story.isNew ? 2 : 1,
            borderColor: story.isNew ? COLORS.primary[400] : COLORS.neutral[200],
            backgroundColor: COLORS.neutral[0],
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 24,
              backgroundColor: story.thumbnailColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22 }}>{story.emoji}</Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 10,
            fontWeight: story.isNew ? "600" : "500",
            color: story.isNew ? COLORS.primary[600] : COLORS.text.secondary,
            textAlign: "center",
            marginTop: 4,
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
  onOpenExternal: (url: string, platform?: string) => void;
  isDark: boolean;
}> = ({ post, index, onLike, onComment, onShare, onOpenExternal, isDark }) => {
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

  const handleOpenExternal = async () => {
    if (post.externalUrl) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onOpenExternal(post.externalUrl, post.platform);
    }
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

  const bgCard = isDark ? COLORS.neutral[800] : COLORS.neutral[0];
  const textPrimary = isDark ? COLORS.neutral[100] : COLORS.text.primary;
  const textSecondary = isDark ? COLORS.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? COLORS.neutral[700] : COLORS.neutral[200];

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500)}
      style={[
        {
          backgroundColor: bgCard,
          borderRadius: RADIUS.xl,
          marginBottom: SPACING.md,
          overflow: "hidden",
          borderWidth: post.isPinned ? 2 : 1,
          borderColor: post.isPinned ? COLORS.primary[400] : borderColor,
          shadowColor: COLORS.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        },
        animatedStyle,
      ]}
    >
      {/* Pinned indicator - Calm FemTech: sutil */}
      {post.isPinned && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: SPACING.xs,
            backgroundColor: COLORS.primary[50],
            borderBottomWidth: 1,
            borderBottomColor: COLORS.primary[100],
          }}
        >
          <Ionicons name="pin" size={12} color={COLORS.primary[500]} />
          <Text
            style={{
              color: COLORS.primary[600],
              fontSize: 10,
              fontWeight: "600",
              marginLeft: SPACING.xs,
            }}
          >
            Fixado
          </Text>
        </View>
      )}

      {/* Header - Calm FemTech: simplificado */}
      <View style={{ padding: SPACING.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm }}>
          {/* Avatar da Nath - foto real com zoom para mostrar ela e o bb */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: SPACING.sm,
              borderWidth: 1,
              borderColor: COLORS.primary[200],
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: NATHALIA_AVATAR_URL }}
              style={{
                width: 56,
                height: 56,
                marginTop: -8,
                marginLeft: -8,
              }}
              resizeMode="cover"
            />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: textPrimary }}>
                Nathalia Valente
              </Text>
              {/* Verificado discreto (ícone apenas) */}
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={COLORS.primary[500]}
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>

          {/* Badge para tipo de conteúdo */}
          {post.type === "tip" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: SPACING.sm,
                paddingVertical: 4,
                borderRadius: RADIUS.full,
                backgroundColor: COLORS.primary[50],
                borderWidth: 1,
                borderColor: COLORS.primary[200],
              }}
            >
              <Text style={{ fontSize: 10, marginRight: 2 }}>💡</Text>
              <Text style={{ fontSize: 10, fontWeight: "600", color: COLORS.primary[600] }}>
                Dica
              </Text>
            </View>
          )}
          {post.type === "reel" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: SPACING.sm,
                paddingVertical: 4,
                borderRadius: RADIUS.full,
                backgroundColor: COLORS.accent[50],
                borderWidth: 1,
                borderColor: COLORS.accent[200],
              }}
            >
              <Ionicons name="play-circle" size={12} color={COLORS.accent[500]} />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: COLORS.accent[600],
                  marginLeft: 2,
                }}
              >
                Vídeo
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            color: textPrimary,
            marginBottom: post.imageUrl ? SPACING.sm : 0,
          }}
        >
          {post.content}
        </Text>
      </View>

      {/* Image / Video Thumbnail */}
      {post.imageUrl && (
        <Pressable
          onPress={post.externalUrl ? handleOpenExternal : undefined}
          disabled={!post.externalUrl}
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: post.imageUrl }}
              style={{
                width: "100%",
                height: 200,
                backgroundColor: COLORS.neutral[200],
              }}
              resizeMode="cover"
            />
            {/* Play button overlay para reels */}
            {(post.type === "reel" || post.type === "video") && post.externalUrl && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: OVERLAY.medium,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: OVERLAY.light,
                    alignItems: "center",
                    justifyContent: "center",
                    ...SHADOWS.lg,
                  }}
                >
                  <Ionicons
                    name="play"
                    size={28}
                    color={COLORS.accent[500]}
                    style={{ marginLeft: 3 }}
                  />
                </View>
              </View>
            )}
            {/* Platform badge */}
            {post.platform && (
              <View
                style={{
                  position: "absolute",
                  bottom: SPACING.sm,
                  right: SPACING.sm,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: OVERLAY.heavy,
                  paddingHorizontal: SPACING.sm,
                  paddingVertical: 4,
                  borderRadius: RADIUS.full,
                }}
              >
                <Ionicons
                  name={
                    post.platform === "instagram"
                      ? "logo-instagram"
                      : post.platform === "tiktok"
                        ? "logo-tiktok"
                        : "globe-outline"
                  }
                  size={12}
                  color={COLORS.neutral[0]}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: COLORS.neutral[0],
                    marginLeft: 4,
                    fontWeight: "600",
                  }}
                >
                  {post.platform === "instagram"
                    ? "Instagram"
                    : post.platform === "tiktok"
                      ? "TikTok"
                      : "Abrir"}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      )}

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: SPACING.md,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Pressable
          onPress={handleLikePress}
          style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING.xl }}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={post.isLiked ? COLORS.accent[500] : textSecondary}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              marginLeft: SPACING.xs,
              color: post.isLiked ? COLORS.accent[500] : textSecondary,
            }}
          >
            {post.likesCount.toLocaleString()}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onComment(post.id)}
          style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING.xl }}
        >
          <Ionicons name="chatbubble-outline" size={16} color={textSecondary} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              marginLeft: SPACING.xs,
              color: textSecondary,
            }}
          >
            {post.commentsCount}
          </Text>
        </Pressable>

        <Pressable onPress={() => onShare(post.id)} style={{ marginLeft: "auto" }}>
          <Ionicons name="share-outline" size={16} color={textSecondary} />
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
            <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.neutral[0] }}>
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
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text.secondary,
              marginBottom: SPACING.md,
            }}
          >
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
                  backgroundColor:
                    selectedType === item.type ? COLORS.primary[500] : COLORS.neutral[100],
                  borderWidth: 1,
                  borderColor:
                    selectedType === item.type ? COLORS.primary[500] : COLORS.neutral[200],
                }}
              >
                <Text style={{ fontSize: 16, marginRight: SPACING.xs }}>{item.emoji}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedType === item.type ? COLORS.neutral[0] : COLORS.text.secondary,
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
                  backgroundColor: OVERLAY.heavy,
                  borderRadius: RADIUS.full,
                  padding: SPACING.sm,
                }}
              >
                <Ionicons name="close" size={20} color={COLORS.neutral[0]} />
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
              <Text
                style={{ marginLeft: SPACING.sm, fontWeight: "500", color: COLORS.primary[500] }}
              >
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

  // Verificação de admin (Nathalia Valente)
  const { isAdmin } = useAdmin();

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

  const handleComment = useCallback(
    async (postId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Navegar para detalhes do post para ver/adicionar comentários
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleShare = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Share functionality
  }, []);

  const handleOpenExternal = useCallback(async (url: string, _platform?: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch {
      // Silently fail - could show a toast here
    }
  }, []);

  const handleStoryPress = useCallback(
    async (story: NathStory) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Stories são conteúdo premium
      navigation.navigate("Paywall", { source: `story_${story.id}` });
    },
    [navigation]
  );

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
      {/* Hero Header - Calm FemTech: gradiente suave, sem back (é TAB) */}
      <LinearGradient
        colors={[COLORS.primary[100], COLORS.primary[50], COLORS.background.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingTop: SPACING.md,
          paddingHorizontal: SPACING.lg,
          paddingBottom: SPACING.lg,
        }}
      >
        {/* Profile Section - compacto */}
        <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: "center" }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              marginBottom: SPACING.sm,
              borderWidth: 2,
              borderColor: COLORS.primary[200],
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: NATHALIA_AVATAR_URL }}
              style={{
                width: 100,
                height: 100,
                marginTop: -14,
                marginLeft: -14,
              }}
              resizeMode="cover"
            />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: textPrimary,
              marginBottom: 2,
              fontFamily: "Manrope_800ExtraBold",
            }}
          >
            Mundo da Nath
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: textSecondary,
              textAlign: "center",
            }}
          >
            Conteúdos exclusivos da Nathalia Valente
          </Text>

          {/* Stats - linha única com separadores */}
          <Text
            style={{
              fontSize: 12,
              color: textSecondary,
              marginTop: SPACING.sm,
            }}
          >
            <Text style={{ fontWeight: "700", color: textPrimary }}>{posts.length}</Text> posts
            {"  •  "}
            <Text style={{ fontWeight: "700", color: textPrimary }}>12.5K</Text> seguidores
            {"  •  "}
            <Text style={{ fontWeight: "700", color: textPrimary }}>
              {posts.reduce((acc, p) => acc + p.likesCount, 0).toLocaleString()}
            </Text>{" "}
            curtidas
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Stories Section */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={{ marginTop: SPACING.lg }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: textPrimary,
            marginBottom: SPACING.sm,
            marginLeft: SPACING.lg,
          }}
        >
          Destaques ✨
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
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
          marginTop: SPACING.lg,
          marginBottom: SPACING.md,
          paddingHorizontal: SPACING.lg,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: textPrimary }}>Publicações</Text>
        <Text style={{ fontSize: 12, color: textSecondary }}>{posts.length} posts</Text>
      </View>

      {/* Pinned Posts */}
      {pinnedPosts.map((post, index) => (
        <View key={post.id} style={{ paddingHorizontal: SPACING.lg }}>
          <PostCard
            post={post}
            index={index}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onOpenExternal={handleOpenExternal}
            isDark={isDark}
          />
        </View>
      ))}
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: bgPrimary }}>
        <FlatList
          data={regularPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={{ paddingHorizontal: SPACING.lg }}>
              <PostCard
                post={item}
                index={index + pinnedPosts.length}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onOpenExternal={handleOpenExternal}
                isDark={isDark}
              />
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={<View style={{ height: 80 }} />}
          showsVerticalScrollIndicator={false}
        />

        {/* Admin FAB - Criar novo post */}
        {isAdmin && (
          <Animated.View
            entering={FadeInUp.delay(500).duration(400)}
            style={{
              position: "absolute",
              bottom: insets.bottom + SPACING.lg,
              right: SPACING.lg,
            }}
          >
            <Pressable
              onPress={() => setIsNewPostModalVisible(true)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
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
                  borderRadius: 26,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={26} color={COLORS.neutral[0]} />
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
    </SafeAreaView>
  );
}
