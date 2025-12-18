/**
 * Nossa Maternidade - LoginScreen
 * Premium authentication with animated inputs and custom alerts
 */

import React, { useState, useEffect } from "react";
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
  Dimensions,
  Image,
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
import * as LocalAuthentication from "expo-local-authentication";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";
import {
  UserProfile,
  PregnancyStage,
  Interest,
  RootStackScreenProps,
} from "../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
} from "../theme/design-system";
import { useTheme } from "../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Calcular valores responsivos
const getResponsiveValue = (baseValue: number, scale: number = 1) => {
  const scaleFactor = SCREEN_WIDTH / 375; // Baseado em iPhone 12/13 (375px)
  return Math.round(baseValue * scaleFactor * scale);
};

type Props = RootStackScreenProps<"Login">;

// Componente de Hero Illustration (Imagem/Avatar no topo)
const HeroIllustration = () => {
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.duration(800).springify()}
      style={{
        marginBottom: SPACING["4xl"],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: getResponsiveValue(180, 1.2),
          height: getResponsiveValue(180, 1.2),
          borderRadius: getResponsiveValue(90, 1.2),
          overflow: "hidden",
          ...SHADOWS.lg,
        }}
      >
        <LinearGradient
          colors={[
            isDark ? COLORS.primary[600] : COLORS.primary[300],
            isDark ? COLORS.primary[700] : COLORS.primary[400],
          ]}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="heart-outline"
            size={getResponsiveValue(80, 1.2)}
            color={COLORS.neutral[0]}
            style={{ opacity: 0.9 }}
          />
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

// Componente de Botão Social Login
const SocialLoginButton = ({
  platform,
  onPress,
  icon,
}: {
  platform: "apple" | "google";
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95);
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, { flex: 1 }]}>
      <Pressable
        onPress={handlePress}
        style={{
          borderWidth: 1.5,
          borderColor: colors.neutral[200],
          borderRadius: RADIUS.lg,
          paddingVertical: SPACING.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.neutral[0],
          ...SHADOWS.sm,
        }}
        accessibilityLabel={`Login com ${platform === "apple" ? "Apple" : "Google"}`}
        accessibilityRole="button"
      >
        <Ionicons
          name={icon}
          size={24}
          color={colors.neutral[600]}
        />
      </Pressable>
    </Animated.View>
  );
};

// Componente de Input personalizado com validação em tempo real
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
  error,
  isValid,
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
  error?: string;
  isValid?: boolean;
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

  const getBorderColor = () => {
    if (isValid && value) return COLORS.semantic.success;
    if (error && value) return COLORS.semantic.error;
    if (isFocused) return COLORS.primary[300];
    return COLORS.neutral[200];
  };

  return (
    <Animated.View style={[animatedStyle, { marginBottom: SPACING.lg }]}>
      <View
        style={{
          backgroundColor: COLORS.neutral[0],
          borderRadius: RADIUS.xl,
          borderWidth: 1.5,
          borderColor: getBorderColor(),
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: getResponsiveValue(16),
          minHeight: getResponsiveValue(52, 1.1),
          ...SHADOWS.sm,
        }}
      >
        <View
          style={{
            width: getResponsiveValue(36, 1.1),
            height: getResponsiveValue(36, 1.1),
            borderRadius: RADIUS.md,
            backgroundColor: isFocused ? COLORS.primary[50] : COLORS.neutral[50],
            alignItems: "center",
            justifyContent: "center",
            marginRight: SPACING.md,
          }}
        >
          <Ionicons
            name={icon}
            size={getResponsiveValue(18, 1.1)}
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
          accessibilityLabel={placeholder}
          accessibilityHint={secureTextEntry ? "Campo de senha" : error ? error : undefined}
          accessibilityState={{ disabled: false }}
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
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={COLORS.neutral[400]}
            />
          </Pressable>
        )}
        {isValid && value && (
          <View style={{ paddingRight: SPACING.sm }}>
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={COLORS.semantic.success}
            />
          </View>
        )}
      </View>
      {error && value && (
        <Text
          style={{
            fontSize: TYPOGRAPHY.labelSmall.fontSize,
            color: COLORS.semantic.error,
            marginTop: SPACING.xs,
            marginLeft: SPACING.md,
          }}
          accessible
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
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
  void navigation;
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", name: "", confirmPassword: "" });
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setUser = useAppStore((s) => s.setUser);

  // Verificar disponibilidade de biometric authentication
  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(compatible && enrolled);
      } catch {
        setBiometricAvailable(false);
      }
    };
    checkBiometric();
  }, []);

  // Validação de email
  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  // Validação de password
  const validatePassword = (passwordValue: string): boolean => {
    return passwordValue.length >= 6;
  };

  // Atualizar erros em tempo real
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text && !validatePassword(text)) {
      setErrors((prev) => ({ ...prev, password: "Mínimo 6 caracteres" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (text && text.length < 2) {
      setErrors((prev) => ({ ...prev, name: "Nome muito curto" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text && text !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Senhas não coincidem" }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Handler para Biometric Login
  const handleBiometricLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLoading(true);
        setTimeout(() => {
          const mockUser: UserProfile = {
            id: Date.now().toString(),
            name: "Usuária",
            email: "user@nossmaternidade.com",
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
        }, 1000);
      }
    } catch {
      showAlert("Erro", "Falha na autenticação biométrica");
    }
  };

  // Handlers para Social Login
  const handleSocialLogin = async (provider: "apple" | "google") => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showAlert(
        `Login com ${provider === "apple" ? "Apple" : "Google"}`,
        `Integrando com ${provider === "apple" ? "Apple" : "Google"}...`
      );
      // Integração real seria feita aqui com expo-auth-session
    } catch {
      showAlert("Erro", `Falha no login com ${provider}`);
    }
  };

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
      showAlert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Email inválido", "Por favor, insira um email válido.");
      return;
    }

    if (!validatePassword(password)) {
      showAlert("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!isLogin) {
      if (!name || name.length < 2) {
        showAlert("Nome inválido", "Por favor, insira um nome válido.");
        return;
      }

      if (password !== confirmPassword) {
        showAlert("Senhas diferentes", "As senhas não coincidem.");
        return;
      }
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: Date.now().toString(),
        name: name || "Usuária",
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
          colors={[colors.primary[50], colors.secondary[50], colors.background.secondary]}
          locations={[0, 0.4, 1]}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + getResponsiveValue(32),
              paddingBottom: insets.bottom + getResponsiveValue(24),
              paddingHorizontal: getResponsiveValue(20),
              maxWidth: 500,
              alignSelf: "center",
              width: "100%",
              minHeight: "100%",
            }}
            style={{
              flex: 1,
              width: "100%",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={true}
            alwaysBounceVertical={false}
          >
            {/* Hero Illustration */}
            {isLogin && <HeroIllustration />}

            {/* Logo e Header - REDESIGN PREMIUM */}
            <Animated.View
              entering={FadeInUp.duration(800).springify()}
              style={{
                alignItems: "center",
                marginBottom: SPACING["5xl"],
              }}
            >
              {/* Logo Premium com sombra e destaque - só para signup */}
              {!isLogin && (
                <Animated.View
                  entering={FadeInUp.duration(800).springify()}
                  style={{
                    marginBottom: SPACING["2xl"],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      shadowColor: COLORS.primary[500],
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: 0.3,
                      shadowRadius: 28,
                      elevation: 18,
                      borderRadius: getResponsiveValue(36),
                      backgroundColor: colors.background.secondary,
                      padding: getResponsiveValue(20),
                      borderWidth: 2,
                      borderColor: isDark ? colors.primary[900] : colors.primary[100],
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: isDark ? colors.primary[900] + "1A" : colors.primary[50],
                      }}
                    />
                    <Image
                      source={require("../../assets/logo.png")}
                      style={{
                        width: getResponsiveValue(120, 1.4),
                        height: getResponsiveValue(120, 1.4),
                        resizeMode: "contain",
                        zIndex: 1,
                      }}
                    />
                  </View>
                </Animated.View>
              )}

              <Text
                style={{
                  fontSize: getResponsiveValue(32, 1.1),
                  fontWeight: "700",
                  color: COLORS.neutral[900],
                  marginBottom: SPACING.xs,
                  letterSpacing: -0.8,
                  fontFamily: "DMSerifDisplay_400Regular",
                }}
              >
                Nossa Maternidade
              </Text>
              <Text
                style={{
                  fontSize: getResponsiveValue(16, 1),
                  color: COLORS.neutral[500],
                  textAlign: "center",
                  lineHeight: getResponsiveValue(22),
                }}
              >
                {isLogin
                  ? "Feliz em ter você de volta ✨"
                  : "Sua jornada começa aqui 💜"}
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
                    placeholder="Como você se chama?"
                    value={name}
                    onChangeText={handleNameChange}
                    autoCapitalize="words"
                    error={errors.name || undefined}
                    isValid={name.length >= 2}
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
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email || undefined}
                isValid={email ? validateEmail(email) : false}
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
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={errors.password || undefined}
                isValid={password ? validatePassword(password) : false}
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
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    error={errors.confirmPassword || undefined}
                    isValid={confirmPassword ? confirmPassword === password : false}
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
                      "Um link será enviado para seu e-mail."
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

              {/* Botao de Submit - REDESIGN PREMIUM */}
              <Animated.View style={[buttonAnimatedStyle, { marginTop: SPACING["2xl"] }]}>
                <Pressable
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.8 : 1 }}
                  accessibilityLabel={isLogin ? "Entrar na conta" : "Criar nova conta"}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isLoading }}
                >
                  <LinearGradient
                    colors={[COLORS.primary[400], COLORS.primary[600]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: RADIUS.xl,
                      paddingVertical: SPACING.lg + 4,
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: COLORS.primary[500],
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.35,
                      shadowRadius: 16,
                      elevation: 8,
                    }}
                  >
                    {isLoading ? (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons
                          name="sync-outline"
                          size={22}
                          color={COLORS.neutral[0]}
                          style={{ marginRight: SPACING.sm }}
                        />
                        <Text
                          style={{
                            color: COLORS.neutral[0],
                            fontSize: TYPOGRAPHY.labelLarge.fontSize,
                            fontWeight: "700",
                            letterSpacing: 0.5,
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
                          letterSpacing: 0.5,
                        }}
                      >
                        {isLogin ? "Entrar" : "Criar minha conta"}
                      </Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              {/* Social Login Buttons - apenas em login */}
              {isLogin && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: SPACING["3xl"],
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
                        fontSize: TYPOGRAPHY.labelSmall.fontSize,
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: 1,
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

                  {/* Social Login Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: SPACING.md,
                      marginBottom: SPACING["3xl"],
                    }}
                  >
                    <SocialLoginButton
                      platform="apple"
                      icon="logo-apple"
                      onPress={() => handleSocialLogin("apple")}
                    />
                    <SocialLoginButton
                      platform="google"
                      icon="logo-google"
                      onPress={() => handleSocialLogin("google")}
                    />
                  </View>

                  {/* Biometric Login Button */}
                  {biometricAvailable && (
                    <Animated.View
                      entering={FadeInUp.duration(600)}
                      style={{ marginBottom: SPACING.lg }}
                    >
                      <Pressable
                        onPress={handleBiometricLogin}
                        disabled={isLoading}
                        style={{
                          opacity: isLoading ? 0.7 : 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingVertical: SPACING.md,
                          backgroundColor: COLORS.neutral[50],
                          borderRadius: RADIUS.lg,
                          borderWidth: 1,
                          borderColor: COLORS.neutral[200],
                          gap: SPACING.sm,
                        }}
                        accessibilityLabel="Login com biometria"
                        accessibilityRole="button"
                        accessibilityState={{ disabled: isLoading }}
                      >
                        <Ionicons
                          name="finger-print"
                          size={20}
                          color={COLORS.primary[500]}
                        />
                        <Text
                          style={{
                            fontSize: TYPOGRAPHY.labelMedium.fontSize,
                            fontWeight: "600",
                            color: COLORS.primary[500],
                          }}
                        >
                          Login com Biometria
                        </Text>
                      </Pressable>
                    </Animated.View>
                  )}
                </>
              )}

              {/* Divisor - REDESIGN */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: SPACING["3xl"],
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
                    fontSize: TYPOGRAPHY.labelSmall.fontSize,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {isLogin ? "sem conta?" : "com conta?"}
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
                  {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                </Text>
                <Pressable
                  onPress={toggleMode}
                  accessibilityLabel={isLogin ? "Ir para cadastro" : "Ir para login"}
                  accessibilityRole="button"
                >
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
                Ao continuar, você concorda com nossos{"\n"}
                <Text style={{ color: COLORS.primary[500], fontWeight: "600" }}>
                  Termos de Uso
                </Text>{" "}
                e{" "}
                <Text style={{ color: COLORS.primary[500], fontWeight: "600" }}>
                  Política de Privacidade
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
