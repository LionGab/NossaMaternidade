/**
 * AIConsentModal - Modal de consentimento para uso de IA
 * Componente extraído do AssistantScreen
 */

import React from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { COLORS, COLORS_DARK } from "../../theme/tokens";
import { useTheme } from "../../hooks/useTheme";

interface AIConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onNavigateToLegal: () => void;
}

export const AIConsentModal: React.FC<AIConsentModalProps> = ({
  visible,
  onAccept,
  onDecline,
  onNavigateToLegal,
}) => {
  const { isDark } = useTheme();
  const palette = isDark ? COLORS_DARK : COLORS;
  const bgSecondary = palette.background.secondary;
  const textPrimary = palette.text.primary;
  const textSecondary = palette.text.secondary;
  const primary = palette.primary[500];
  const primaryLight = palette.primary[100];
  const bgTertiary = palette.background.tertiary;
  const borderLight = palette.primary[200];
  const textInverse = palette.text.inverse;
  const warningLight = palette.semantic.warningLight;
  const warning = palette.semantic.warning;
  const neutral700 = palette.neutral[700];

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View entering={FadeInUp.duration(400).springify()} style={[styles.card, { backgroundColor: bgSecondary }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: primaryLight }]}>
              <Ionicons name="sparkles" size={28} color={primary} />
            </View>
            <Text style={[styles.title, { color: textPrimary }]}>Antes de começar</Text>
          </View>

          {/* Content */}
          <Text style={[styles.text, { color: textSecondary }]}>
            A NathIA utiliza inteligência artificial para oferecer apoio. Suas conversas são processadas para gerar respostas personalizadas.
          </Text>

          {/* Links */}
          <View style={styles.links}>
            <Pressable onPress={onNavigateToLegal} style={[styles.link, { borderBottomColor: borderLight }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={primary} />
              <Text style={[styles.linkText, { color: primary }]}>Política de Privacidade</Text>
              <Ionicons name="chevron-forward" size={16} color={primary} />
            </Pressable>
            <Pressable onPress={onNavigateToLegal} style={[styles.link, { borderBottomColor: borderLight }]}>
              <Ionicons name="document-text-outline" size={18} color={primary} />
              <Text style={[styles.linkText, { color: primary }]}>Termos de Uso</Text>
              <Ionicons name="chevron-forward" size={16} color={primary} />
            </Pressable>
          </View>

          {/* Disclaimer */}
          <View style={[styles.disclaimer, { backgroundColor: warningLight }]}>
            <Ionicons name="medkit-outline" size={16} color={warning} style={{ marginTop: 2 }} />
            <Text style={[styles.disclaimerText, { color: neutral700 }]}>
              A NathIA não substitui atendimento médico. Em caso de emergência, procure ajuda profissional.
            </Text>
          </View>

          {/* Buttons */}
          <Pressable onPress={onAccept} style={[styles.buttonPrimary, { backgroundColor: primary }]}>
            <Text style={[styles.buttonPrimaryText, { color: textInverse }]}>Aceito e quero continuar</Text>
          </Pressable>
          <Pressable onPress={onDecline} style={[styles.buttonSecondary, { backgroundColor: bgTertiary }]}>
            <Text style={[styles.buttonSecondaryText, { color: textSecondary }]}>Não, obrigada</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  links: {
    marginBottom: 16,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  disclaimer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  disclaimerText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  buttonPrimary: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

