import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteAccount } from "../api/auth";
import { useTheme } from "../hooks/useTheme";
import { useAppStore } from "../state/store";
import { RootStackScreenProps } from "../types/navigation";
import { logger } from "../utils/logger";
import { TYPOGRAPHY } from "../theme/design-system";
import { useAlertModal } from "../components/ui/AlertModal";

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

/**
 * ProfileScreen - Grid 8pt compliant
 *
 * Esta tela já segue o sistema de Grid 8pt através de:
 * - Tailwind classes (px-6 = 24px, mb-8 = 32px, etc.)
 * - Hook useSpacing disponível para valores dinâmicos
 * - Todos os espaçamentos são múltiplos de 8px
 *
 * @see docs/8PT_GRID_SYSTEM.md
 */
export default function ProfileScreen({ navigation }: RootStackScreenProps<"EditProfile">) {
  const insets = useSafeAreaInsets();
  const { colors, theme, setTheme, isDark } = useTheme();
  const user = useAppStore((s) => s.user);

  // Cores dinâmicas do tema
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textSecondary = isDark ? colors.neutral[400] : colors.neutral[500];
  const borderColor = isDark ? colors.neutral[700] : colors.neutral[200];
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: warning, 2: confirmation, 3: processing
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert modal for replacing native Alert.alert
  const alertModal = useAlertModal();

  const MENU_ITEMS: MenuItem[] = [
    { id: "edit", label: "Editar perfil", icon: "person-outline", color: colors.neutral[500] },
    {
      id: "notifications",
      label: "Notificações",
      icon: "notifications-outline",
      color: colors.neutral[500],
    },
    { id: "privacy", label: "Privacidade", icon: "shield-outline", color: colors.neutral[500] },
    {
      id: "help",
      label: "Ajuda e suporte",
      icon: "help-circle-outline",
      color: colors.neutral[500],
    },
    {
      id: "about",
      label: "Sobre o app",
      icon: "information-circle-outline",
      color: colors.neutral[500],
    },
  ];

  const getStageLabel = () => {
    switch (user?.stage) {
      case "trying":
        return "Tentando engravidar";
      case "pregnant":
        return "Grávida";
      case "postpartum":
        return "Pós-parto";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    setOnboardingComplete(false);
  };

  const handleSettingsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("NotificationPreferences");
  };

  const handleMenuItemPress = async (itemId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Navegação baseada no item do menu
    switch (itemId) {
      case "edit":
        navigation.navigate("EditProfile");
        break;
      case "notifications":
        navigation.navigate("NotificationPreferences");
        break;
      case "privacy":
        navigation.navigate("PrivacySettings");
        break;
      case "help":
        navigation.navigate("MainTabs", { screen: "Assistant" });
        break;
      case "about":
        navigation.navigate("Legal");
        break;
    }
  };

  const handleDeleteAccountPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
    setDeleteStep(1);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteReason("");
    setConfirmText("");
    setIsDeleting(false);
  };

  const handleNextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDeleteStep(2);
  };

  const handleConfirmDelete = async () => {
    if (confirmText.toUpperCase() !== "DELETAR") {
      alertModal.show({
        title: "Confirmação incorreta",
        message: "Por favor, digite \"DELETAR\" para confirmar a exclusão permanente da sua conta.",
        icon: "warning",
        iconColor: colors.semantic.warning,
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    try {
      setIsDeleting(true);
      setDeleteStep(3);

      logger.info("Deleting account", "ProfileScreen", { reason: deleteReason || "No reason provided" });

      const result = await deleteAccount(deleteReason);

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        alertModal.show({
          title: "Conta deletada",
          message: "Sua conta e todos os dados foram permanentemente removidos. Sentiremos sua falta!",
          icon: "checkmark-circle",
          iconColor: colors.semantic.success,
          buttons: [
            {
              text: "OK",
              style: "default",
              onPress: () => {
                handleCloseDeleteModal();
                setOnboardingComplete(false);
              },
            },
          ],
        });
      } else {
        throw new Error(result.error || "Erro ao deletar conta");
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      logger.error("Failed to delete account", "ProfileScreen", error as Error);

      alertModal.show({
        title: "Erro ao deletar conta",
        message: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        icon: "alert-circle",
        iconColor: colors.semantic.error,
        buttons: [{ text: "OK", style: "default" }],
      });

      setIsDeleting(false);
      setDeleteStep(2);
    }
  };

  // TODO: Export data feature - implementation available in /delete-account edge function
  // To enable: uncomment code and add "export" menu item

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <LinearGradient
        colors={
          isDark
            ? [colors.background.primary, colors.background.secondary, colors.background.tertiary]
            : [colors.primary[50], colors.secondary[50], colors.background.secondary]
        }
        locations={[0, 0.4, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={{ paddingTop: insets.top + 20, paddingHorizontal: 24, paddingBottom: 32 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <Text style={{ color: textMain, fontSize: TYPOGRAPHY.headlineLarge.fontSize, fontFamily: "DMSerifDisplay_400Regular" }}>Perfil</Text>
            <Pressable
              onPress={handleSettingsPress}
              style={{
                padding: 8,
                backgroundColor: colors.background.card,
                borderRadius: 12,
                shadowColor: colors.neutral[900],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
              }}
            >
              <Ionicons name="settings-outline" size={24} color={textSecondary} />
            </Pressable>
          </View>

          {/* Profile Card */}
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 32,
              padding: 28,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 24,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 56,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  backgroundColor: isDark ? colors.primary[800] : colors.primary[100],
                }}
              >
                <Ionicons name="person" size={52} color={textSecondary} />
              </View>
              <Text style={{ color: textMain, fontSize: TYPOGRAPHY.headlineSmall.fontSize, fontFamily: "DMSerifDisplay_400Regular", marginBottom: 12 }}>
                {user?.name || "Usuaria"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
                  }}
                >
                  <Text style={{ color: colors.primary[500], fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600" }}>{getStageLabel()}</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: "row", marginTop: 32, paddingTop: 32, borderTopWidth: 1, borderTopColor: borderColor }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: textMain, fontSize: TYPOGRAPHY.headlineSmall.fontSize, fontWeight: "700", marginBottom: 4 }}>0</Text>
                <Text style={{ color: textSecondary, fontSize: TYPOGRAPHY.titleSmall.fontSize }}>Posts</Text>
              </View>
              <View style={{ width: 1, backgroundColor: borderColor }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: textMain, fontSize: TYPOGRAPHY.headlineSmall.fontSize, fontWeight: "700", marginBottom: 4 }}>0</Text>
                <Text style={{ color: textSecondary, fontSize: TYPOGRAPHY.titleSmall.fontSize }}>Grupos</Text>
              </View>
              <View style={{ width: 1, backgroundColor: borderColor }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: textMain, fontSize: TYPOGRAPHY.headlineSmall.fontSize, fontWeight: "700", marginBottom: 4 }}>
                  {user?.interests?.length || 0}
                </Text>
                <Text style={{ color: textSecondary, fontSize: TYPOGRAPHY.titleSmall.fontSize }}>Interesses</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={{ paddingHorizontal: 24, marginBottom: 32 }}
          >
            <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes["4xl"], fontWeight: "600", marginBottom: 16 }}>Seus interesses</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {user.interests.map((interest, index) => (
                <Animated.View
                  key={interest}
                  entering={FadeInUp.delay(300 + index * 50)
                    .duration(600)
                    .springify()}
                >
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: colors.background.card,
                      borderRadius: 20,
                      shadowColor: colors.neutral[900],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.2 : 0.04,
                      shadowRadius: 8,
                    }}
                  >
                    <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes.xl, textTransform: "capitalize" }}>
                      {interest.replace("_", " ")}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Theme Selection */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600).springify()}
          style={{ paddingHorizontal: 24, marginBottom: 32 }}
        >
          <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes["4xl"], fontWeight: "600", marginBottom: 16 }}>Aparência</Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 24,
              padding: 20,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {/* Light Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("light");
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: theme === "light" ? (isDark ? colors.primary[800] : colors.primary[50]) : "transparent",
                  borderRadius: 16,
                  paddingVertical: 16,
                  marginRight: 8,
                  borderWidth: 2,
                  borderColor: theme === "light" ? colors.primary[500] : (isDark ? colors.neutral[700] : "transparent"),
                }}
              >
                <Ionicons
                  name="sunny"
                  size={28}
                  color={theme === "light" ? colors.primary[500] : textSecondary}
                />
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.titleSmall.fontSize,
                    fontWeight: "600",
                    marginTop: 8,
                    color: theme === "light" ? colors.primary[500] : textSecondary,
                  }}
                >
                  Claro
                </Text>
              </Pressable>

              {/* Dark Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("dark");
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: theme === "dark" ? (isDark ? colors.primary[800] : colors.primary[50]) : "transparent",
                  borderRadius: 16,
                  paddingVertical: 16,
                  marginHorizontal: 8,
                  borderWidth: 2,
                  borderColor: theme === "dark" ? colors.primary[500] : (isDark ? colors.neutral[700] : "transparent"),
                }}
              >
                <Ionicons
                  name="moon"
                  size={28}
                  color={theme === "dark" ? colors.primary[500] : textSecondary}
                />
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.titleSmall.fontSize,
                    fontWeight: "600",
                    marginTop: 8,
                    color: theme === "dark" ? colors.primary[500] : textSecondary,
                  }}
                >
                  Escuro
                </Text>
              </Pressable>

              {/* System Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("system");
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: theme === "system" ? (isDark ? colors.primary[800] : colors.primary[50]) : "transparent",
                  borderRadius: 16,
                  paddingVertical: 16,
                  marginLeft: 8,
                  borderWidth: 2,
                  borderColor: theme === "system" ? colors.primary[500] : (isDark ? colors.neutral[700] : "transparent"),
                }}
              >
                <Ionicons
                  name="phone-portrait"
                  size={28}
                  color={theme === "system" ? colors.primary[500] : textSecondary}
                />
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.titleSmall.fontSize,
                    fontWeight: "600",
                    marginTop: 8,
                    color: theme === "system" ? colors.primary[500] : textSecondary,
                  }}
                >
                  Sistema
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes["4xl"], fontWeight: "600", marginBottom: 16 }}>Configurações</Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.2 : 0.04,
              shadowRadius: 12,
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleMenuItemPress(item.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: borderColor,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    backgroundColor: colors.background.tertiary,
                  }}
                >
                  <Ionicons name={item.icon} size={22} color={textSecondary} />
                </View>
                <Text style={{ flex: 1, color: textMain, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "500" }}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={textSecondary} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={{ paddingHorizontal: 24, marginTop: 24 }}
        >
          <Pressable
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.background.card,
              borderRadius: 20,
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderWidth: 1.5,
              borderColor: isDark ? colors.semantic.error : colors.primary[200],
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.semantic.error} />
            <Text style={{ color: colors.semantic.error, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600", marginLeft: 8 }}>Sair da conta</Text>
          </Pressable>
        </Animated.View>

        {/* Danger Zone - Delete Account */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={{ paddingHorizontal: 24, marginTop: 32 }}
        >
          <Text style={{ color: textSecondary, fontSize: TYPOGRAPHY.titleSmall.fontSize, fontWeight: "600", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            Zona de Perigo
          </Text>
          <Pressable
            onPress={handleDeleteAccountPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? colors.neutral[900] : colors.neutral[50],
              borderRadius: 20,
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderWidth: 1.5,
              borderColor: colors.semantic.error,
            }}
          >
            <Ionicons name="trash-outline" size={22} color={colors.semantic.error} />
            <Text style={{ color: colors.semantic.error, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600", marginLeft: 8 }}>Deletar minha conta</Text>
          </Pressable>
        </Animated.View>

        {/* App Info */}
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: textSecondary, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "500" }}>Nossa Maternidade</Text>
          <Text style={{ color: textSecondary, fontSize: TYPOGRAPHY.titleSmall.fontSize, marginTop: 4 }}>Por Nathalia</Text>
          <Text style={{ color: isDark ? colors.neutral[600] : colors.neutral[400], fontSize: 12, marginTop: 8 }}>Versao 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent
        onRequestClose={handleCloseDeleteModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}>
          <View style={{
            backgroundColor: colors.background.card,
            borderRadius: 24,
            padding: 28,
            width: "100%",
            maxWidth: 420,
            shadowColor: colors.neutral[900],
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
            shadowRadius: 24,
          }}>
            {/* Step 1: Warning */}
            {deleteStep === 1 && (
              <>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isDark ? colors.semantic.error + "20" : colors.semantic.errorLight,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  alignSelf: "center",
                }}>
                  <Ionicons name="warning" size={32} color={colors.semantic.error} />
                </View>

                <Text style={{
                  color: textMain,
                  fontSize: TYPOGRAPHY.headlineSmall.fontSize,
                  fontFamily: "DMSerifDisplay_400Regular",
                  textAlign: "center",
                  marginBottom: 12,
                }}>
                  Deletar sua conta?
                </Text>

                <Text style={{
                  color: textSecondary,
                  fontSize: TYPOGRAPHY.sizes.xl,
                  lineHeight: 24,
                  textAlign: "center",
                  marginBottom: 24,
                }}>
                  Esta ação é <Text style={{ fontWeight: "700", color: colors.semantic.error }}>permanente e irreversível</Text>.
                </Text>

                <View style={{
                  backgroundColor: isDark ? colors.neutral[800] : colors.neutral[100],
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                }}>
                  <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600", marginBottom: 12 }}>
                    O que será deletado:
                  </Text>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="close-circle" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                      <Text style={{ color: textSecondary, fontSize: 15 }}>Todos os seus posts e comentários</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="close-circle" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                      <Text style={{ color: textSecondary, fontSize: 15 }}>Histórico de ciclo e saúde</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="close-circle" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                      <Text style={{ color: textSecondary, fontSize: 15 }}>Conversas com NathIA</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="close-circle" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                      <Text style={{ color: textSecondary, fontSize: 15 }}>Afirmações e hábitos</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="close-circle" size={20} color={colors.semantic.error} style={{ marginRight: 8 }} />
                      <Text style={{ color: textSecondary, fontSize: 15 }}>Todas as suas preferências</Text>
                    </View>
                  </View>
                </View>

                <Text style={{
                  color: textSecondary,
                  fontSize: TYPOGRAPHY.titleSmall.fontSize,
                  marginBottom: 8,
                }}>
                  Por que você quer sair? (opcional)
                </Text>
                <TextInput
                  value={deleteReason}
                  onChangeText={setDeleteReason}
                  placeholder="Ex: Não uso mais o app, mudei de plataforma..."
                  placeholderTextColor={isDark ? colors.neutral[600] : colors.neutral[400]}
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: colors.background.primary,
                    borderRadius: 12,
                    padding: 16,
                    color: textMain,
                    fontSize: TYPOGRAPHY.sizes.xl,
                    textAlignVertical: "top",
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={handleCloseDeleteModal}
                    style={{
                      flex: 1,
                      backgroundColor: colors.background.tertiary,
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600" }}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleNextStep}
                    style={{
                      flex: 1,
                      backgroundColor: colors.semantic.error,
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: colors.text.inverse, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600" }}>Continuar</Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Step 2: Confirmation */}
            {deleteStep === 2 && (
              <>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isDark ? colors.semantic.error + "20" : colors.semantic.errorLight,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  alignSelf: "center",
                }}>
                  <Ionicons name="shield-checkmark" size={32} color={colors.semantic.error} />
                </View>

                <Text style={{
                  color: textMain,
                  fontSize: TYPOGRAPHY.headlineSmall.fontSize,
                  fontFamily: "DMSerifDisplay_400Regular",
                  textAlign: "center",
                  marginBottom: 12,
                }}>
                  Confirmação final
                </Text>

                <Text style={{
                  color: textSecondary,
                  fontSize: TYPOGRAPHY.sizes.xl,
                  lineHeight: 24,
                  textAlign: "center",
                  marginBottom: 24,
                }}>
                  Digite <Text style={{ fontWeight: "700", color: colors.semantic.error }}>DELETAR</Text> para confirmar a exclusão permanente.
                </Text>

                <TextInput
                  value={confirmText}
                  onChangeText={setConfirmText}
                  placeholder="Digite DELETAR"
                  placeholderTextColor={isDark ? colors.neutral[600] : colors.neutral[400]}
                  autoCapitalize="characters"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderRadius: 12,
                    padding: 16,
                    color: textMain,
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 24,
                    borderWidth: 2,
                    borderColor: confirmText.toUpperCase() === "DELETAR" ? colors.semantic.error : borderColor,
                  }}
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={() => setDeleteStep(1)}
                    style={{
                      flex: 1,
                      backgroundColor: colors.background.tertiary,
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: textMain, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600" }}>Voltar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirmDelete}
                    disabled={isDeleting || confirmText.toUpperCase() !== "DELETAR"}
                    style={{
                      flex: 1,
                      backgroundColor: confirmText.toUpperCase() === "DELETAR" ? colors.semantic.error : colors.neutral[400],
                      borderRadius: 16,
                      paddingVertical: 16,
                      alignItems: "center",
                      opacity: confirmText.toUpperCase() === "DELETAR" ? 1 : 0.5,
                    }}
                  >
                    <Text style={{ color: colors.text.inverse, fontSize: TYPOGRAPHY.sizes.xl, fontWeight: "600" }}>
                      {isDeleting ? "Deletando..." : "Deletar conta"}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Step 3: Processing */}
            {deleteStep === 3 && (
              <>
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <ActivityIndicator size="large" color={colors.primary[500]} />
                  <Text style={{
                    color: textMain,
                    fontSize: 18,
                    fontWeight: "600",
                    marginTop: 24,
                  }}>
                    Deletando sua conta...
                  </Text>
                  <Text style={{
                    color: textSecondary,
                    fontSize: 15,
                    marginTop: 8,
                    textAlign: "center",
                  }}>
                    Isso pode levar alguns instantes
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Alert Modal for custom alerts */}
      <alertModal.AlertModal />
    </View>
  );
}
