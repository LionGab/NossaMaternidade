/**
 * Nossa Maternidade - LoginScreen v7 (FINAL PREMIUM)
 *
 * DESIGN REFERENCES (Apps mais usados por mulheres):
 * - Flo App (período/gravidez) - 200M+ downloads
 * - Sweat by Kayla Itsines - Influenciadora fitness
 * - Calm - Meditação premium
 * - Ovia/BabyCenter - Gravidez
 * - Natural Cycles - Saúde feminina
 *
 * PATTERN: Full hero + floating card + zero scroll
 *
 * @version 7.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signInWithMagicLink } from "../api/auth";
import { signInWithApple, signInWithGoogle } from "../api/social-auth";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"Login">;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isCompact = SCREEN_HEIGHT < 700;

// Assets
const LOGO = require("../../assets/logo-01.png");
const HERO = require("../../assets/onboarding/images/nath-profile-small.jpg");

// ============================================
// DESIGN SYSTEM - Acolhimento, Pertencimento, Amor
// Rosa + Azul (favoritos da Nath)
// Inspirado: Peanut, Headspace, Hatch
// ============================================
const DS = {
  // Core
  white: "#FFFFFF",
  black: "#0A0A14",

  // Rosa (amor, carinho, acolhimento)
  rose: {
    light: "#FFF0F3",    // Fundo suave
    soft: "#FFD4E0",     // Destaque leve
    main: "#F687A5",     // Principal
    deep: "#E56B8A",     // CTA gradiente
  },

  // Azul (calma, confiança, serenidade)
  sky: {
    light: "#EBF5FF",    // Fundo alternativo
    soft: "#B8E0FF",     // Destaque
    main: "#6FB8E5",     // Principal
    deep: "#4A9ED4",     // Contraste
  },

  // Text
  text: {
    primary: "#2D2D42",    // Quase preto, suave
    secondary: "#5C5C7A",  // Médio
    muted: "#9999B3",      // Suave
    inverse: "#FFFFFF",
    inverseMuted: "rgba(255,255,255,0.85)",
  },

  // UI
  border: "#E8E8F0",
  inputBg: "#FAFBFC",
  inputFocus: "#6FB8E5",   // Azul calmo

  // States
  error: "#E85B6B",
  success: "#4CAF78",
};

// Spacing (8pt grid - como apps premium)
const sp = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ============================================
// COMPONENTS
// ============================================

const PressableScale = ({
  onPress,
  disabled,
  children,
  style,
}: {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: object;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [disabled, onPress]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        disabled={disabled}
        style={style}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

// Social button - Inspired by Calm/Flo
const SocialBtn = ({
  type,
  onPress,
  loading,
  disabled,
}: {
  type: "apple" | "google";
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}) => {
  const isApple = type === "apple";

  return (
    <PressableScale onPress={onPress} disabled={disabled || loading}>
      <View
        style={[
          s.socialBtn,
          isApple ? s.socialBtnApple : s.socialBtnGoogle,
          disabled && s.socialBtnDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isApple ? DS.white : DS.text.primary} size="small" />
        ) : (
          <>
            {isApple ? (
              <Ionicons name="logo-apple" size={20} color={DS.white} />
            ) : (
              <Image
                source={require("../../assets/google-logo.jpg")}
                style={s.googleLogo}
                resizeMode="contain"
              />
            )}
            <Text style={[s.socialBtnText, isApple && s.socialBtnTextWhite]}>
              Continuar com {isApple ? "Apple" : "Google"}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
};

// Email input - Minimal design like Calm
const EmailBox = ({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled: boolean;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View style={[s.inputBox, focused && s.inputBoxFocused, error && s.inputBoxError]}>
        <Ionicons
          name="mail-outline"
          size={18}
          color={focused ? DS.inputFocus : DS.text.muted}
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="seu@email.com"
          placeholderTextColor={DS.text.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={s.input}
          accessibilityLabel="Email"
        />
      </View>
      {error && (
        <View style={s.errorRow}>
          <Ionicons name="alert-circle" size={14} color={DS.error} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// CTA Button - Gradiente Rosa (amor, acolhimento)
const CtaBtn = ({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}) => (
  <PressableScale onPress={onPress} disabled={disabled || loading}>
    <LinearGradient
      colors={[DS.rose.main, DS.rose.deep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[s.ctaBtn, disabled && s.ctaBtnDisabled]}
    >
      {loading ? (
        <ActivityIndicator color={DS.white} size="small" />
      ) : (
        <Text style={s.ctaBtnText}>{label}</Text>
      )}
    </LinearGradient>
  </PressableScale>
);

// ============================================
// MAIN SCREEN
// ============================================
export default function LoginScreen({ navigation }: Props) {
  void navigation;
  const insets = useSafeAreaInsets();

  // State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const anyLoading = loading || appleLoading || googleLoading;
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Handlers
  const onApple = async () => {
    try {
      setAppleLoading(true);
      setError(null);
      const res = await signInWithApple();
      if (!res.success) setError(res.error || "Erro ao entrar com Apple");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setAppleLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      const res = await signInWithGoogle();
      if (!res.success) setError(res.error || "Erro ao entrar com Google");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGoogleLoading(false);
    }
  };

  const onEmail = async () => {
    Keyboard.dismiss();
    if (!email) return setError("Digite seu email");
    if (!isValidEmail(email)) return setError("Email inválido");

    try {
      setLoading(true);
      setError(null);
      const { error: err } = await signInWithMagicLink(email.trim());
      if (err) return setError(err instanceof Error ? err.message : "Erro");
      setSuccess("Link enviado! Verifique seu email.");
    } finally {
      setLoading(false);
    }
  };

  // Layout calculations
  const cardTopMargin = isCompact ? -20 : -28;
  const heroHeight = SCREEN_HEIGHT * (isCompact ? 0.42 : 0.46);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.flex}
      >
        <Pressable onPress={Keyboard.dismiss} style={s.flex}>
          {/* ===============================
              HERO - Full width, foto da Nath
             =============================== */}
          <View style={[s.hero, { height: heroHeight }]}>
            <ExpoImage
              source={HERO}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              contentPosition="top center"
              transition={400}
            />

            {/* Gradient overlay - Rosa/Azul suave sobre foto */}
            <LinearGradient
              colors={[
                "rgba(107, 184, 229, 0.15)",  // Azul suave no topo
                "rgba(0,0,0,0.25)",
                "rgba(45, 45, 66, 0.85)",     // Escuro acolhedor embaixo
              ]}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Top bar */}
            <Animated.View
              entering={FadeIn.duration(600)}
              style={[s.topBar, { paddingTop: insets.top + 8 }]}
            >
              <Image source={LOGO} style={s.logo} />
              <Text style={s.brand}>Nossa Maternidade</Text>
            </Animated.View>

            {/* Hero content */}
            <View style={s.heroContent}>
              {/* Stats row */}
              <Animated.View entering={FadeInUp.delay(150).springify()} style={s.statsRow}>
                <View style={s.stat}>
                  <Text style={s.statValue}>40M+</Text>
                  <Text style={s.statLabel}>seguidoras</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.stat}>
                  <Text style={s.statValue}>500K+</Text>
                  <Text style={s.statLabel}>mães no app</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.stat}>
                  <Text style={s.statValue}>#1</Text>
                  <Text style={s.statLabel}>Brasil</Text>
                </View>
              </Animated.View>

              {/* Headline */}
              <Animated.View entering={FadeInUp.delay(250).springify()}>
                <Text style={s.headline}>
                  Sua jornada{"\n"}começa aqui
                </Text>
                <Text style={s.subheadline}>por Nathalia Valente</Text>
              </Animated.View>
            </View>
          </View>

          {/* ===============================
              CARD - Floating login form
             =============================== */}
          <View
            style={[
              s.card,
              {
                marginTop: cardTopMargin,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            {/* Card header */}
            <Animated.View entering={FadeInDown.delay(100)} style={s.cardHeader}>
              <Text style={s.cardTitle}>Entre agora</Text>
              <Text style={s.cardSubtitle}>Faça parte da comunidade</Text>
            </Animated.View>

            {/* Social buttons */}
            <Animated.View entering={FadeInDown.delay(200)} style={s.socialSection}>
              <SocialBtn
                type="apple"
                onPress={onApple}
                loading={appleLoading}
                disabled={anyLoading && !appleLoading}
              />
              <SocialBtn
                type="google"
                onPress={onGoogle}
                loading={googleLoading}
                disabled={anyLoading && !googleLoading}
              />
            </Animated.View>

            {/* Divider */}
            <Animated.View entering={FadeInDown.delay(300)} style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>ou</Text>
              <View style={s.dividerLine} />
            </Animated.View>

            {/* Email */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <EmailBox
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (error) setError(null);
                  if (success) setSuccess(null);
                }}
                error={error || undefined}
                disabled={anyLoading}
              />
            </Animated.View>

            {success && <Text style={s.successText}>{success}</Text>}

            {/* CTA */}
            <Animated.View entering={FadeInDown.delay(500)} style={s.ctaContainer}>
              <CtaBtn
                label="Continuar"
                onPress={onEmail}
                loading={loading}
                disabled={anyLoading && !loading}
              />
            </Animated.View>

            {/* Legal */}
            <Animated.View entering={FadeInDown.delay(600)}>
              <Text style={s.legal}>
                Ao continuar, você concorda com nossos{" "}
                <Text style={s.legalLink}>Termos</Text> e{" "}
                <Text style={s.legalLink}>Privacidade</Text>
              </Text>
            </Animated.View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================
// STYLES - Premium, pixel-perfect
// ============================================
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.black,
  },
  flex: {
    flex: 1,
  },

  // Hero
  hero: {
    position: "relative",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sp.lg,
    gap: sp.sm,
    zIndex: 10,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
  },
  brand: {
    fontSize: 14,
    fontWeight: "600",
    color: DS.text.inverse,
    fontFamily: "Manrope_600SemiBold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: sp.lg,
    paddingBottom: sp.xl + 4,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: sp.md,
  },
  stat: {
    alignItems: "center",
    paddingHorizontal: sp.md,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: DS.text.inverse,
    fontFamily: "Manrope_800ExtraBold",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: DS.text.inverseMuted,
    fontFamily: "Manrope_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Headline
  headline: {
    fontSize: isCompact ? 28 : 32,
    fontWeight: "800",
    color: DS.text.inverse,
    fontFamily: "Manrope_800ExtraBold",
    textAlign: "center",
    lineHeight: isCompact ? 34 : 40,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: "500",
    color: DS.text.inverseMuted,
    fontFamily: "Manrope_500Medium",
    textAlign: "center",
    marginTop: 6,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: DS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    shadowColor: DS.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: sp.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: DS.text.primary,
    fontFamily: "Manrope_800ExtraBold",
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: DS.text.secondary,
    fontFamily: "Manrope_500Medium",
    marginTop: 4,
  },

  // Social
  socialSection: {
    gap: 10,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 12,
    gap: 10,
  },
  socialBtnApple: {
    backgroundColor: DS.black,
  },
  socialBtnGoogle: {
    backgroundColor: DS.white,
    borderWidth: 1,
    borderColor: DS.border,
  },
  socialBtnDisabled: {
    opacity: 0.5,
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: DS.text.primary,
    fontFamily: "Manrope_600SemiBold",
  },
  socialBtnTextWhite: {
    color: DS.white,
  },
  googleLogo: {
    width: 18,
    height: 18,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: sp.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DS.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: "500",
    color: DS.text.muted,
    fontFamily: "Manrope_500Medium",
  },

  // Input
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DS.inputBg,
    borderWidth: 1.5,
    borderColor: DS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  inputBoxFocused: {
    borderColor: DS.inputFocus,
    backgroundColor: DS.white,
  },
  inputBoxError: {
    borderColor: DS.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: DS.text.primary,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: DS.error,
    fontFamily: "Manrope_500Medium",
  },
  successText: {
    fontSize: 13,
    color: DS.success,
    fontFamily: "Manrope_500Medium",
    marginTop: 6,
  },

  // CTA
  ctaContainer: {
    marginTop: 14,
  },
  ctaBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DS.rose.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnDisabled: {
    opacity: 0.6,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: DS.white,
    fontFamily: "Manrope_700Bold",
  },

  // Legal
  legal: {
    fontSize: 11,
    color: DS.text.muted,
    textAlign: "center",
    lineHeight: 16,
    fontFamily: "Manrope_400Regular",
    marginTop: 12,
  },
  legalLink: {
    color: DS.text.secondary,
    fontWeight: "600",
  },
});
