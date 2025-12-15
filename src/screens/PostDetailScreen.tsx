import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types/navigation";
import { useCommunityStore } from "../state/store";
import * as Haptics from "expo-haptics";

export default function PostDetailScreen({ route, navigation }: RootStackScreenProps<"PostDetail">) {
  const insets = useSafeAreaInsets();
  const { postId } = route.params;
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(45);

  const handleLike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleComment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Scroll to comments section - already there
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: "Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo. - via Nossa Maternidade",
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // For now, just clear the comment - in production would add to store
    setComment("");
  };

  // Placeholder content
  return (
    <View className="flex-1 bg-cream-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 100 }}
      >
        {/* Post Content */}
        <View className="bg-white rounded-2xl p-4 border border-blush-100">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-full bg-blush-200 items-center justify-center mr-3">
              <Ionicons name="person" size={24} color="#9E7269" />
            </View>
            <View className="flex-1">
              <Text className="text-warmGray-800 text-base font-semibold">Mariana Santos</Text>
              <Text className="text-warmGray-400 text-sm">ha 2 horas</Text>
            </View>
          </View>

          <Text className="text-warmGray-700 text-base leading-6 mb-4">
            Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo.
            Alguém tem dicas para o primeiro trimestre?
          </Text>

          <View className="flex-row items-center pt-4 border-t border-blush-100">
            <Pressable onPress={handleLike} className="flex-row items-center mr-6">
              <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? "#E11D48" : "#A8A29E"} />
              <Text className="ml-2 text-sm text-warmGray-400">{likesCount}</Text>
            </Pressable>
            <Pressable onPress={handleComment} className="flex-row items-center mr-6">
              <Ionicons name="chatbubble-outline" size={20} color="#A8A29E" />
              <Text className="ml-2 text-sm text-warmGray-400">23</Text>
            </Pressable>
            <Pressable onPress={handleShare} className="flex-row items-center">
              <Ionicons name="share-outline" size={20} color="#A8A29E" />
            </Pressable>
          </View>
        </View>

        {/* Comments Section */}
        <View className="mt-6">
          <Text className="text-warmGray-800 text-lg font-semibold mb-4">Comentarios</Text>

          {/* Sample Comments */}
          {[1, 2, 3].map((i) => (
            <View key={i} className="bg-white rounded-xl p-4 mb-3 border border-blush-100">
              <View className="flex-row items-start">
                <View className="w-9 h-9 rounded-full bg-blush-200 items-center justify-center mr-3">
                  <Ionicons name="person" size={18} color="#9E7269" />
                </View>
                <View className="flex-1">
                  <Text className="text-warmGray-800 text-sm font-semibold">Usuario {i}</Text>
                  <Text className="text-warmGray-600 text-sm mt-1 leading-5">
                    Parabens! O primeiro trimestre pode ser desafiador, mas passa rapido.
                    Descanse bastante e beba muita agua!
                  </Text>
                  <Text className="text-warmGray-300 text-xs mt-2">ha {i} hora{i > 1 ? "s" : ""}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-blush-100 px-4 pt-3"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="flex-row items-center">
          <View className="flex-1 bg-cream-50 rounded-2xl px-4 py-3 mr-2 border border-blush-200">
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Escreva um comentário..."
              placeholderTextColor="#A8A29E"
              className="text-base text-warmGray-800"
            />
          </View>
          <Pressable
            onPress={handleSendComment}
            className="w-11 h-11 rounded-full bg-rose-500 items-center justify-center"
            style={{ opacity: comment.trim() ? 1 : 0.5 }}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
