/**
 * Nossa Maternidade - LoginScreen
 * Premium authentication with animated inputs and custom alerts
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";
import { UserProfile, PregnancyStage, Interest } from "../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../theme/design-system";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"Login">;

// Componente de Input personalizado
const CustomInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  autoCorrect,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  autoCorrect?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    setIsFocused(true);
    scale.value = withSpring(1.02, { damping: 15 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View style={[animatedStyle, { marginBottom: SPACING.lg }]}>
      <View
        style={{
          backgroundColor: COLORS.neutral[0],
          borderRadius: RADIUS.xl,
          borderWidth: 1.5,
          borderColor: isFocused ? COLORS.primary[300] : COLORS.neutral[200],
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          minHeight: 56,
          ...SHADOWS.sm,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: RADIUS.md,
            backgroundColor: isFocused ? COLORS.primary[50] : COLORS.neutral[50],
            alignItems: "center",
            justifyContent: "center",
            marginRight: SPACING.md,
          }}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? COLORS.primary[500] : COLORS.neutral[400]}
          />
        </View>
        <TextInput
          style={{
            flex: 1,
            fontSize: TYPOGRAPHY.bodyLarge.fontSize,
            color: COLORS.neutral[800],
            paddingVertical: SPACING.md,
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showPasswordToggle && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onTogglePassword?.();
            }}
            style={{
              padding: SPACING.sm,
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={COLORS.neutral[400]}
            />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

// Componente de Alert customizado (nao usar alert() nativo)
const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING["2xl"],
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.neutral[0],
            borderRadius: RADIUS["2xl"],
            padding: SPACING["2xl"],
            width: "100%",
            maxWidth: 320,
            ...SHADOWS.xl,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: COLORS.primary[50],
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: SPACING.lg,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={COLORS.primary[500]}
            />
          </View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.titleMedium.fontSize,
              fontWeight: "600",
              color: COLORS.neutral[800],
              textAlign: "center",
              marginBottom: SPACING.sm,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.bodyMedium.fontSize,
              color: COLORS.neutral[500],
              textAlign: "center",
              marginBottom: SPACING.xl,
              lineHeight: 22,
            }}
          >
            {message}
          </Text>
          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: COLORS.primary[500],
              borderRadius: RADIUS.lg,
              paddingVertical: SPACING.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.neutral[0],
                fontSize: TYPOGRAPHY.labelLarge.fontSize,
                fontWeight: "600",
              }}
            >
              Entendi
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setUser = useAppStore((s) => s.setUser);

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 15 });
    }, 100);

    // Validation
    if (!email || !password) {
      showAlert("Campos obrigatorios", "Por favor, preencha todos os campos.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      showAlert("Senhas diferentes", "As senhas nao coincidem.");
      return;
    }

    if (!isLogin && !name) {
      showAlert("Nome obrigatorio", "Por favor, informe seu nome.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: Date.now().toString(),
        name: name || "Usuario",
        email,
        avatarUrl: "",
        stage: "pregnant" as PregnancyStage,
        dueDate: undefined,
        interests: [] as Interest[],
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: false,
      };

      setUser(mockUser);
      setAuthenticated(true);
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigation handled by RootNavigator
    }, 1500);
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["#FFF5F7", "#FEF3F2", "#FAF5FF", COLORS.background.primary]}
          locations={[0, 0.3, 0.6, 1]}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + SPACING["3xl"],
              paddingBottom: insets.bottom + SPACING["2xl"],
              paddingHorizontal: SPACING["2xl"],
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo e Header */}
            <Animated.View
              entering={FadeInUp.duration(600).springify()}
              style={{
                alignItems: "center",
                marginBottom: SPACING["4xl"],
              }}
            >
              {/* Logo com gradiente */}
              <View
                style={{
                  marginBottom: SPACING.xl,
                  ...SHADOWS.lg,
                }}
              >
                <LinearGradient
                  colors={[COLORS.primary[500], COLORS.secondary[500]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: RADIUS["2xl"],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="heart" size={48} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text
                style={{
                  fontSize: TYPOGRAPHY.headlineLarge.fontSize,
                  fontWeight: "700",
                  color: COLORS.neutral[800],
                  marginBottom: SPACING.sm,
                  letterSpacing: -0.5,
                }}
              >
                Nossa Maternidade
              </Text>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                  color: COLORS.neutral[500],
                  textAlign: "center",
                }}
              >
                {isLogin
                  ? "Bem-vinda de volta!"
                  : "Junte-se a nossa comunidade"}
              </Text>
            </Animated.View>

            {/* Formulario */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(200).springify()}
            >
              {/* Nome (apenas cadastro) */}
              {!isLogin && (
                <Animated.View entering={FadeIn.duration(300)}>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.labelMedium.fontSize,
                      fontWeight: "600",
                      color: COLORS.neutral[600],
                      marginBottom: SPACING.sm,
                      marginLeft: SPACING.xs,
                    }}
                  >
                    Nome
                  </Text>
                  <CustomInput
                    icon="person-outline"
                    placeholder="Como voce se chama?"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </Animated.View>
              )}

              {/* Email */}
              <Text
                style={{
                  fontSize: TYPOGRAPHY.labelMedium.fontSize,
                  fontWeight: "600",
                  color: COLORS.neutral[600],
                  marginBottom: SPACING.sm,
                  marginLeft: SPACING.xs,
                }}
              >
                E-mail
              </Text>
              <CustomInput
                icon="mail-outline"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Senha */}
              <Text
                style={{
                  fontSize: TYPOGRAPHY.labelMedium.fontSize,
                  fontWeight: "600",
                  color: COLORS.neutral[600],
                  marginBottom: SPACING.sm,
                  marginLeft: SPACING.xs,
                }}
              >
                Senha
              </Text>
              <CustomInput
                icon="lock-closed-outline"
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Confirmar Senha (apenas cadastro) */}
              {!isLogin && (
                <Animated.View entering={FadeIn.duration(300)}>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.labelMedium.fontSize,
                      fontWeight: "600",
                      color: COLORS.neutral[600],
                      marginBottom: SPACING.sm,
                      marginLeft: SPACING.xs,
                    }}
                  >
                    Confirmar Senha
                  </Text>
                  <CustomInput
                    icon="lock-closed-outline"
                    placeholder="********"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </Animated.View>
              )}

              {/* Esqueceu a senha (apenas login) */}
              {isLogin && (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    showAlert(
                      "Recuperar senha",
                      "Um link sera enviado para seu e-mail."
                    );
                  }}
                  style={{
                    alignSelf: "flex-end",
                    marginBottom: SPACING.xl,
                    marginTop: -SPACING.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.bodySmall.fontSize,
                      color: COLORS.primary[500],
                      fontWeight: "600",
                    }}
                  >
                    Esqueceu a senha?
                  </Text>
                </Pressable>
              )}

              {/* Botao de Submit */}
              <Animated.View style={[buttonAnimatedStyle, { marginTop: SPACING.lg }]}>
                <Pressable
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.8 : 1 }}
                >
                  <LinearGradient
                    colors={[COLORS.primary[500], COLORS.secondary[500]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: RADIUS.xl,
                      paddingVertical: SPACING.lg + 2,
                      alignItems: "center",
                      justifyContent: "center",
                      ...SHADOWS.md,
                    }}
                  >
                    {isLoading ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons
                          name="sync-outline"
                          size={20}
                          color={COLORS.neutral[0]}
                          style={{ marginRight: SPACING.sm }}
                        />
                        <Text
                          style={{
                            color: COLORS.neutral[0],
                            fontSize: TYPOGRAPHY.labelLarge.fontSize,
                            fontWeight: "700",
                          }}
                        >
                          Carregando...
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={{
                          color: COLORS.neutral[0],
                          fontSize: TYPOGRAPHY.labelLarge.fontSize,
                          fontWeight: "700",
                          letterSpacing: 0.3,
                        }}
                      >
                        {isLogin ? "Entrar" : "Criar conta"}
                      </Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              {/* Divisor */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: SPACING["2xl"],
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: COLORS.neutral[200],
                  }}
                />
                <Text
                  style={{
                    paddingHorizontal: SPACING.lg,
                    color: COLORS.neutral[400],
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  }}
                >
                  ou
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: COLORS.neutral[200],
                  }}
                />
              </View>

              {/* Alternar modo */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.neutral[500],
                    fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                  }}
                >
                  {isLogin ? "Nao tem uma conta? " : "Ja tem uma conta? "}
                </Text>
                <Pressable onPress={toggleMode}>
                  <Text
                    style={{
                      color: COLORS.primary[500],
                      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                      fontWeight: "700",
                    }}
                  >
                    {isLogin ? "Cadastre-se" : "Entre"}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>

            {/* Footer */}
            <View
              style={{
                marginTop: "auto",
                paddingTop: SPACING["3xl"],
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.neutral[400],
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  textAlign: "center",
                }}
              >
                Ao continuar, voce concorda com nossos{"\n"}
                <Text style={{ color: COLORS.primary[500], fontWeight: "600" }}>
                  Termos de Uso
                </Text>{" "}
                e{" "}
                <Text style={{ color: COLORS.primary[500], fontWeight: "600" }}>
                  Politica de Privacidade
                </Text>
              </Text>
            </View>
          </ScrollView>

          {/* Custom Alert */}
          <CustomAlert
            visible={alertConfig.visible}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={() =>
              setAlertConfig({ visible: false, title: "", message: "" })
            }
          />
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
