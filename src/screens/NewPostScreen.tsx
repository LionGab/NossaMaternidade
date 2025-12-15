import React, { useState } from "react";
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps, Post } from "../types/navigation";
import { useCommunityStore, useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";

export default function NewPostScreen({ navigation }: RootStackScreenProps<"NewPost">) {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");

  const addPost = useCommunityStore((s) => s.addPost);
  const user = useAppStore((s) => s.user);

  const handlePost = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user?.id || "me",
      authorName: user?.name || "Você",
      content: content.trim(),
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    };

    addPost(newPost);
    navigation.goBack();
  };

  const handlePhotoPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Adicionar Foto",
      description: "Em breve você poderá adicionar fotos da sua galeria aos seus posts.",
      emoji: "🖼️",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleCameraPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Tirar Foto",
      description: "Em breve você poderá tirar fotos diretamente para seus posts.",
      emoji: "📸",
      primaryCtaLabel: "Voltar",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-cream-50"
    >
      {/* Header Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-blush-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-warmGray-500 text-base">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handlePost}
          disabled={!content.trim()}
          className={`px-5 py-2 rounded-full ${content.trim() ? "bg-rose-500" : "bg-warmGray-200"}`}
        >
          <Text className={`text-base font-semibold ${content.trim() ? "text-white" : "text-warmGray-400"}`}>
            Publicar
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-start">
          <View className="w-11 h-11 rounded-full bg-blush-200 items-center justify-center mr-3">
            <Ionicons name="person" size={22} color="#9E7269" />
          </View>
          <View className="flex-1">
            <Text className="text-warmGray-800 text-base font-semibold">{user?.name || "Voce"}</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="O que voce quer compartilhar?"
              placeholderTextColor="#A8A29E"
              multiline
              autoFocus
              className="text-warmGray-700 text-base leading-6 mt-2"
              style={{ minHeight: 100 }}
            />
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View
        className="flex-row items-center px-4 py-3 border-t border-blush-100 bg-white"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable onPress={handlePhotoPress} className="flex-row items-center mr-6">
          <Ionicons name="image-outline" size={24} color="#BC8B7B" />
          <Text className="ml-2 text-warmGray-500 text-sm">Foto</Text>
        </Pressable>
        <Pressable onPress={handleCameraPress} className="flex-row items-center">
          <Ionicons name="camera-outline" size={24} color="#BC8B7B" />
          <Text className="ml-2 text-warmGray-500 text-sm">Câmera</Text>
        </Pressable>
        <View className="flex-1" />
        <Text className="text-warmGray-300 text-sm">{content.length}/500</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
