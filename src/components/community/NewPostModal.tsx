/**
 * NewPostModal - Modal para criar novo post
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../hooks/useTheme";
import { useAppStore } from "../../state/store";
import { brand, neutral, radius, spacing } from "../../theme/tokens";
import { Avatar } from "../ui";

interface NewPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, mediaUri?: string, mediaType?: "image" | "video") => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({ visible, onClose, onSubmit }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { showError, showSuccess } = useToast();
  const user = useAppStore((s) => s.user);

  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textPrimary = isDark ? neutral[100] : neutral[800];
  const textSecondary = isDark ? neutral[400] : neutral[500];
  const borderColor = isDark ? neutral[700] : neutral[200];
  const bgColor = isDark ? neutral[900] : brand.primary[50];
  const inputBg = isDark ? neutral[800] : neutral[100];

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de acesso à sua galeria para adicionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0].uri);
        setMediaType("image");
      }
    } catch {
      showError("Não foi possível selecionar a imagem.");
    }
  };

  const handlePickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de acesso à sua galeria para adicionar vídeos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "videos",
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0].uri);
        setMediaType("video");
      }
    } catch {
      showError("Não foi possível selecionar o vídeo.");
    }
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedMedia) return;

    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      onSubmit(content.trim(), selectedMedia ?? undefined, mediaType ?? undefined);
      setContent("");
      setSelectedMedia(null);
      setMediaType(null);
      setIsSubmitting(false);
      showSuccess("Post enviado para revisão! Você será notificada quando for aprovado.");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setContent("");
    setSelectedMedia(null);
    setMediaType(null);
    onClose();
  };

  const canSubmit = (content.trim() || selectedMedia) && !isSubmitting;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: bgColor }]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + spacing.md,
              borderBottomColor: borderColor,
            },
          ]}
        >
          <Pressable onPress={handleClose} hitSlop={8}>
            <Text style={[styles.cancelText, { color: textSecondary }]}>Cancelar</Text>
          </Pressable>
          <Text style={[styles.title, { color: textPrimary }]}>Novo Post</Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              { backgroundColor: canSubmit ? brand.primary[500] : neutral[300] },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={neutral[0]} />
            ) : (
              <Text style={styles.submitText}>Enviar</Text>
            )}
          </Pressable>
        </View>

        {/* Info de revisão */}
        <View style={styles.reviewInfo}>
          <Ionicons name="shield-checkmark" size={16} color={brand.primary[500]} />
          <Text style={styles.reviewText}>
            Seu post será revisado pela nossa equipe antes de ser publicado.
          </Text>
        </View>

        {/* Composer */}
        <View style={styles.composer}>
          <View style={styles.userRow}>
            <Avatar
              size={44}
              source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
              fallbackIcon="person"
              fallbackColor={brand.primary[500]}
              fallbackBgColor={brand.primary[100]}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: textPrimary }]}>{user?.name || "Você"}</Text>
              <Text style={[styles.userHint, { color: textSecondary }]}>
                Compartilhe com a comunidade
              </Text>
            </View>
          </View>

          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="O que você gostaria de compartilhar?"
            placeholderTextColor={neutral[400]}
            multiline
            autoFocus
            style={[styles.input, { color: textPrimary }]}
          />

          {/* Media Preview */}
          {selectedMedia && (
            <View style={styles.mediaPreview}>
              {mediaType === "image" ? (
                <Image
                  source={{ uri: selectedMedia }}
                  style={styles.mediaImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam" size={48} color={neutral[500]} />
                  <Text style={styles.videoText}>Vídeo selecionado</Text>
                </View>
              )}
              <Pressable onPress={handleRemoveMedia} style={styles.removeMedia}>
                <Ionicons name="close" size={20} color={neutral[0]} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Actions */}
        <View
          style={[
            styles.actions,
            {
              paddingBottom: insets.bottom + spacing.lg,
              borderTopColor: borderColor,
            },
          ]}
        >
          <Pressable
            onPress={handlePickImage}
            disabled={isSubmitting}
            style={[styles.actionButton, { backgroundColor: inputBg }]}
          >
            <Ionicons name="image-outline" size={20} color={brand.primary[500]} />
            <Text style={styles.actionText}>Foto</Text>
          </Pressable>

          <Pressable
            onPress={handlePickVideo}
            disabled={isSubmitting}
            style={[styles.actionButton, { backgroundColor: inputBg }]}
          >
            <Ionicons name="videocam-outline" size={20} color={brand.primary[500]} />
            <Text style={styles.actionText}>Vídeo</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  submitButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  submitText: {
    fontSize: 14,
    fontWeight: "600",
    color: neutral[0],
  },
  reviewInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: brand.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  reviewText: {
    fontSize: 12,
    color: brand.primary[600],
    flex: 1,
  },
  composer: {
    flex: 1,
    padding: spacing["2xl"],
  },
  userRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  userAvatar: {
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  userHint: {
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: spacing.lg,
  },
  mediaPreview: {
    marginBottom: spacing.lg,
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: 200,
    borderRadius: radius.xl,
    backgroundColor: neutral[200],
  },
  videoPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: radius.xl,
    backgroundColor: neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    fontSize: 14,
    color: neutral[500],
    marginTop: spacing.sm,
  },
  removeMedia: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: radius.full,
    padding: spacing.sm,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: brand.primary[500],
  },
});
