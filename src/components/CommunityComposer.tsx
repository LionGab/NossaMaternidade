import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { uploadImageToImgur } from "../api/imgur";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../hooks/useTheme";
import { useAppStore } from "../state/store";
import { COLORS, COLORS_DARK, Tokens } from "../theme/tokens";
import { logger } from "../utils/logger";
import { Avatar } from "./ui";

const POST_TYPES = [
  {
    id: "duvida",
    label: "Dúvida",
    emoji: "❓",
    color: Tokens.brand.primary[500],
    bgColor: Tokens.brand.primary[50],
  },
  {
    id: "desabafo",
    label: "Desabafo",
    emoji: "💭",
    color: Tokens.brand.secondary[500],
    bgColor: Tokens.brand.secondary[50],
  },
  {
    id: "vitoria",
    label: "Vitória",
    emoji: "🎉",
    color: Tokens.semantic.light.success,
    bgColor: Tokens.semantic.light.successLight,
  },
  {
    id: "dica",
    label: "Dica",
    emoji: "💡",
    color: Tokens.semantic.light.warning,
    bgColor: Tokens.semantic.light.warningLight,
  },
];

interface CommunityComposerProps {
  onPost: (content: string, type: string, imageUrl?: string) => void;
  onExpand?: () => void;
}

/**
 * Cores semânticas para composer com suporte a dark mode
 */
const getComposerColors = (isDark: boolean) => {
  const colors = isDark ? COLORS_DARK : COLORS;
  return {
    // Card backgrounds
    cardBg: colors.background.secondary,
    // Text
    placeholder: Tokens.neutral[400],
    textPrimary: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
    textSecondary: Tokens.neutral[400],
    // Actions
    addButton: Tokens.brand.primary[500],
    addIcon: Tokens.text.light.inverse,
    actionBg: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
    actionIcon: Tokens.neutral[500],
    // Post button
    postActive: Tokens.brand.primary[500],
    postInactive: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
    postTextActive: Tokens.text.light.inverse,
    postTextInactive: Tokens.neutral[400],
    // Avatar fallback
    avatarColor: Tokens.brand.primary[500],
    avatarBg: Tokens.brand.primary[50],
  };
};

export default function CommunityComposer({ onPost, onExpand }: CommunityComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const user = useAppStore((s) => s.user);
  const { showError, showInfo } = useToast();
  const { isDark } = useTheme();
  const composerColors = useMemo(() => getComposerColors(isDark), [isDark]);

  const handleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(true);
    onExpand?.();
  };

  const handleTypeSelect = async (typeId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(typeId === selectedType ? null : typeId);
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) return;

    setIsUploading(true);
    let imageUrl: string | undefined;

    try {
      // Fazer upload da imagem se houver
      if (selectedImage) {
        logger.info("Iniciando upload de imagem", "CommunityComposer");
        imageUrl = await uploadImageToImgur(selectedImage);
        logger.info("Upload concluído", "CommunityComposer", { imageUrl });
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPost(content.trim(), selectedType || "geral", imageUrl);
      setContent("");
      setSelectedType(null);
      setSelectedImage(null);
      setIsExpanded(false);
    } catch (error) {
      logger.error(
        "Erro ao publicar post",
        "CommunityComposer",
        error instanceof Error ? error : new Error(String(error))
      );
      showError("Não foi possível publicar o post. Verifique sua conexão e tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setSelectedType(null);
    setSelectedImage(null);
    setIsExpanded(false);
  };

  const handleImagePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showInfo("Precisamos de acesso à sua galeria para adicionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      logger.error(
        "Erro ao selecionar imagem",
        "CommunityComposer",
        error instanceof Error ? error : new Error(String(error))
      );
      showError("Não foi possível selecionar a imagem.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  if (!isExpanded) {
    return (
      <Pressable
        onPress={handleExpand}
        style={{
          backgroundColor: composerColors.cardBg,
          borderRadius: 20,
          padding: 16,
          marginBottom: 16,
          ...Tokens.shadows.sm,
        }}
      >
        <View className="flex-row items-center">
          <Avatar
            size={44}
            source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
            isNathalia={!user?.avatarUrl}
            fallbackIcon="person"
            fallbackColor={composerColors.avatarColor}
            fallbackBgColor={composerColors.avatarBg}
            style={{ marginRight: 12 }}
          />
          <Text style={{ flex: 1, color: composerColors.placeholder, fontSize: 15 }}>
            Como você está hoje?
          </Text>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: composerColors.addButton,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="add" size={20} color={composerColors.addIcon} />
          </View>
        </View>

        {/* Quick Type Shortcuts */}
        <View className="flex-row mt-4 pt-4 border-t border-gray-100">
          {POST_TYPES.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => {
                handleExpand();
                setSelectedType(type.id);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: type.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{type.emoji}</Text>
              <Text style={{ color: type.color, fontSize: 13, fontWeight: "500" }}>
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={{
        backgroundColor: composerColors.cardBg,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        ...Tokens.shadows.md,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Avatar
            size={40}
            source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
            isNathalia={!user?.avatarUrl}
            fallbackIcon="person"
            fallbackColor={composerColors.avatarColor}
            fallbackBgColor={composerColors.avatarBg}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: composerColors.textPrimary, fontSize: 15, fontWeight: "600" }}>
            Nova publicação
          </Text>
        </View>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" size={24} color={composerColors.textSecondary} />
        </Pressable>
      </View>

      {/* Type Selection */}
      <View className="flex-row mb-4">
        {POST_TYPES.map((type, index) => (
          <Animated.View key={type.id} entering={FadeInUp.delay(index * 50).duration(200)}>
            <Pressable
              onPress={() => handleTypeSelect(type.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedType === type.id ? type.color : type.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{type.emoji}</Text>
              <Text
                style={{
                  color: selectedType === type.id ? Tokens.text.light.inverse : type.color,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {type.label}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {/* Text Input */}
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Compartilhe o que está pensando..."
        placeholderTextColor={composerColors.placeholder}
        multiline
        autoFocus
        style={{
          fontSize: 16,
          color: composerColors.textPrimary,
          minHeight: 100,
          textAlignVertical: "top",
          marginBottom: 16,
        }}
      />

      {/* Image Preview */}
      {selectedImage && (
        <View className="mb-4 relative">
          <Image
            source={{ uri: selectedImage }}
            className="w-full rounded-xl"
            style={{ height: 200 }}
            resizeMode="cover"
          />
          <Pressable
            onPress={handleRemoveImage}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="close" size={20} color={Tokens.text.light.inverse} />
          </Pressable>
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
        <View className="flex-row items-center">
          <Pressable
            onPress={handleImagePress}
            disabled={isUploading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: composerColors.actionBg,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Ionicons name="image-outline" size={20} color={composerColors.actionIcon} />
          </Pressable>
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: composerColors.actionBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="happy-outline" size={20} color={composerColors.actionIcon} />
          </Pressable>
        </View>

        <Pressable
          onPress={handlePost}
          disabled={(!content.trim() && !selectedImage) || isUploading}
          style={{
            backgroundColor:
              (content.trim() || selectedImage) && !isUploading
                ? composerColors.postActive
                : composerColors.postInactive,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isUploading ? (
            <>
              <ActivityIndicator
                size="small"
                color={composerColors.postTextActive}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: composerColors.postTextActive,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Enviando...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color:
                    content.trim() || selectedImage
                      ? composerColors.postTextActive
                      : composerColors.postTextInactive,
                  fontSize: 14,
                  fontWeight: "600",
                  marginRight: 4,
                }}
              >
                Publicar
              </Text>
              <Ionicons
                name="send"
                size={16}
                color={
                  content.trim() || selectedImage
                    ? composerColors.postTextActive
                    : composerColors.postTextInactive
                }
              />
            </>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
}
