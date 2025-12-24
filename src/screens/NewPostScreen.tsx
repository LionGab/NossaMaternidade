/**
 * Nossa Maternidade - NewPostScreen
 *
 * Create a new community post with optional image upload
 *
 * Features:
 * - Text content with character limit (500)
 * - Image upload from gallery or camera
 * - Image preview with remove option
 * - Upload progress indicator
 * - Error handling with user feedback
 *
 * @version 2.0.0 - Image upload support (2025-01)
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps, Post } from "../types/navigation";
import { useCommunityStore, useAppStore } from "../state/store";
import { useImageUpload } from "../hooks/useImageUpload";
import { logger } from "../utils/logger";
import { Tokens } from "../theme/tokens";
import { useToast } from "../context/ToastContext";

const MAX_CONTENT_LENGTH = 500;
const IMAGE_RESIZE = { width: 1200, height: 1200, maintainAspectRatio: true };

export default function NewPostScreen({ navigation }: RootStackScreenProps<"NewPost">) {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { showError } = useToast();

  const addPost = useCommunityStore((s) => s.addPost);
  const user = useAppStore((s) => s.user);

  // Image upload hook
  const {
    isLoading: isImageLoading,
    error: imageError,
    progress: uploadProgress,
    selectedImage,
    uploadedImage,
    pickFromGallery,
    takePhoto,
    uploadImage,
    clearImage,
    clearError,
  } = useImageUpload({
    folder: "posts",
    resize: IMAGE_RESIZE,
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3],
  });

  // Handle posting
  const handlePost = useCallback(async () => {
    if (!content.trim() && !selectedImage) return;

    try {
      setIsPosting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      let imageUrl: string | undefined;

      // Upload image if selected but not yet uploaded
      if (selectedImage && !uploadedImage) {
        const result = await uploadImage();
        if (!result) {
          setIsPosting(false);
          return;
        }
        imageUrl = result.url;
      } else if (uploadedImage) {
        imageUrl = uploadedImage.url;
      }

      const newPost: Post = {
        id: Date.now().toString(),
        authorId: user?.id || "me",
        authorName: user?.name || "Você",
        content: content.trim(),
        imageUrl,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
      };

      addPost(newPost);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      logger.error(
        "Error posting to community",
        "NewPostScreen",
        error instanceof Error ? error : new Error(String(error))
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError("Não foi possível publicar. Tente novamente.");
    } finally {
      setIsPosting(false);
    }
  }, [content, selectedImage, uploadedImage, user, addPost, navigation, uploadImage, showError]);

  // Handle photo from gallery
  const handlePhotoPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearError();
    await pickFromGallery();
  }, [pickFromGallery, clearError]);

  // Handle photo from camera
  const handleCameraPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearError();
    await takePhoto();
  }, [takePhoto, clearError]);

  // Handle remove image
  const handleRemoveImage = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearImage();
  }, [clearImage]);

  // Show error toast
  useEffect(() => {
    if (imageError) {
      showError(imageError);
      clearError();
    }
  }, [imageError, clearError, showError]);

  const canPost = content.trim().length > 0 || selectedImage;
  const isLoading = isImageLoading || isPosting;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-cream-50"
    >
      {/* Header Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-blush-100">
        <Pressable onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text className="text-warmGray-500 text-base">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handlePost}
          disabled={!canPost || isLoading}
          className={`px-5 py-2 rounded-full ${canPost && !isLoading ? "bg-rose-500" : "bg-warmGray-200"}`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Tokens.neutral[0]} />
          ) : (
            <Text className={`text-base font-semibold ${canPost ? "text-white" : "text-warmGray-400"}`}>
              Publicar
            </Text>
          )}
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-start">
          <View className="w-11 h-11 rounded-full bg-blush-200 items-center justify-center mr-3">
            <Ionicons name="person" size={22} color={Tokens.brand.primary[600]} />
          </View>
          <View className="flex-1">
            <Text className="text-warmGray-800 text-base font-semibold">{user?.name || "Você"}</Text>
            <TextInput
              value={content}
              onChangeText={(text) => setContent(text.slice(0, MAX_CONTENT_LENGTH))}
              placeholder="O que você quer compartilhar?"
              placeholderTextColor={Tokens.neutral[400]}
              multiline
              autoFocus
              editable={!isLoading}
              className="text-warmGray-700 text-base leading-6 mt-2"
              style={{ minHeight: 100 }}
            />

            {/* Image Preview */}
            {selectedImage && (
              <View className="mt-4 relative">
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: "100%",
                    aspectRatio: 4 / 3,
                    borderRadius: Tokens.radius.lg,
                    backgroundColor: Tokens.neutral[100],
                  }}
                  contentFit="cover"
                  transition={200}
                />

                {/* Remove button */}
                <Pressable
                  onPress={handleRemoveImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 items-center justify-center"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  <Ionicons name="close" size={20} color={Tokens.neutral[0]} />
                </Pressable>

                {/* Upload progress overlay */}
                {isImageLoading && (
                  <View
                    className="absolute inset-0 bg-black/40 items-center justify-center"
                    style={{ borderRadius: Tokens.radius.lg }}
                  >
                    <ActivityIndicator size="large" color={Tokens.neutral[0]} />
                    <Text className="text-white text-sm mt-2 font-medium">
                      {uploadProgress < 30 ? "Preparando..." : uploadProgress < 80 ? "Enviando..." : "Finalizando..."}
                    </Text>
                    <View className="w-32 h-1 bg-white/30 rounded-full mt-2 overflow-hidden">
                      <View
                        className="h-full bg-white rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </View>
                  </View>
                )}

                {/* Uploaded indicator */}
                {uploadedImage && !isImageLoading && (
                  <View className="absolute bottom-2 left-2 flex-row items-center bg-black/50 px-2 py-1 rounded-full">
                    <Ionicons name="checkmark-circle" size={14} color={Tokens.semantic.light.success} />
                    <Text className="text-white text-xs ml-1">Enviado</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View
        className="flex-row items-center px-4 py-3 border-t border-blush-100 bg-white"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable
          onPress={handlePhotoPress}
          disabled={isLoading}
          className="flex-row items-center mr-6"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Ionicons
            name={selectedImage ? "image" : "image-outline"}
            size={24}
            color={selectedImage ? Tokens.brand.primary[600] : Tokens.brand.primary[500]}
          />
          <Text className="ml-2 text-warmGray-500 text-sm">Foto</Text>
        </Pressable>
        <Pressable
          onPress={handleCameraPress}
          disabled={isLoading}
          className="flex-row items-center"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Ionicons name="camera-outline" size={24} color={Tokens.brand.primary[500]} />
          <Text className="ml-2 text-warmGray-500 text-sm">Câmera</Text>
        </Pressable>
        <View className="flex-1" />
        <Text
          className="text-sm"
          style={{
            color:
              content.length > MAX_CONTENT_LENGTH * 0.9
                ? Tokens.semantic.light.error
                : Tokens.neutral[400],
          }}
        >
          {content.length}/{MAX_CONTENT_LENGTH}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
