/**
 * LoginScreen - Cinematic Redesign
 *
 * DESIGN CONCEPT: "Portal to Motherhood"
 * A cinematic, emotional entry point that feels like opening
 * a premium wellness or meditation app.
 *
 * AESTHETIC:
 * - Deep navy to rose gradient (night sky awakening)
 * - Floating particles (stars/sparkles) for magic
 * - Bold, staggered typography reveals
 * - Glass-morphism auth card
 * - Smooth, choreographed animations
 *
 * INSPIRATION:
 * - Calm app's meditative login
 * - Spotify's bold typography
 * - Apple TV+ cinematic reveals
 *
 * EXPO GO COMPATIBLE ✓
 *
 * @version 2.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image as RNImage,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { signInWithMagicLink } from "../api/auth";
import { signInWithApple, signInWithFacebook, signInWithGoogle } from "../api/social-auth";
import { Tokens, brand, premium, semantic, typography } from "../theme/tokens";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"Login">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============================================
// DESIGN SYSTEM - Using Tokens
// ============================================

const COLORS = {
  // Deep night sky gradient - from Tokens.premium
  gradientTop: premium.gradient.top,
  gradientMid: premium.gradient.mid,
  gradientBottom: premium.gradient.bottom,
  gradientAccent: premium.gradient.accent,

  // Aurora accents - from Tokens.premium
  aurora1: premium.aurora.pink,
  aurora2: premium.aurora.purple,
  aurora3: premium.aurora.blue,

  // Text - from Tokens.premium
  textPrimary: premium.text.primary,
  textSecondary: premium.text.secondary,
  textMuted: premium.text.muted,

  // Glass - from Tokens.premium
  glassBg: premium.glass.background,
  glassBorder: premium.glass.border,
  glassHighlight: premium.glass.highlight,

  // CTAs
  ctaPrimary: brand.accent[500],
  ctaSecondary: premium.glass.background,

  // Inputs - from Tokens.premium
  inputBg: premium.input.background,
  inputBorder: premium.input.border,
  inputFocus: brand.accent[400],

  // States - from Tokens.semantic
  error: semantic.dark.error,
  success: semantic.dark.success,
};

const FONTS = {
  display: typography.fontFamily.extrabold,
  headline: typography.fontFamily.bold,
  body: typography.fontFamily.medium,
  accent: typography.fontFamily.semibold,
  light: typography.fontFamily.base,
};

// ============================================
// ANIMATED PARTICLES
// ============================================

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT * 0.6,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 2000,
  }));
};

const FloatingParticle: React.FC<{ particle: Particle }> = React.memo(({ particle }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(particle.opacity);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Gentle floating animation
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Gentle pulsing
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(particle.opacity * 1.5, { duration: 2000 }),
          withTiming(particle.opacity * 0.5, { duration: 2000 })
        ),
        -1,
        true
      )
    );

    // Subtle scale
    scale.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(withTiming(1.2, { duration: 2500 }), withTiming(0.8, { duration: 2500 })),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [translateY, opacity, scale, particle]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    />
  );
});

FloatingParticle.displayName = "FloatingParticle";

// ============================================
// GLASS CARD COMPONENT
// ============================================

const GlassCard: React.FC<{ children: React.ReactNode; style?: object }> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.glassCard, style]}>
      {/* Highlight edge */}
      <View style={styles.glassHighlight} />
      {children}
    </View>
  );
};

// ============================================
// PRESSABLE WITH SCALE
// ============================================

const PressableScale: React.FC<{
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: object;
}> = ({ onPress, disabled, children, style }) => {
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
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        disabled={disabled}
        style={style}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

// ============================================
// SOCIAL AUTH BUTTON
// ============================================

const SocialButton: React.FC<{
  type: "apple" | "google" | "facebook";
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}> = React.memo(({ type, onPress, loading, disabled }) => {
  const isApple = type === "apple";
  const isFacebook = type === "facebook";

  return (
    <PressableScale onPress={onPress} disabled={disabled || loading}>
      <View
        style={[
          styles.socialButton,
          isApple
            ? styles.socialButtonApple
            : isFacebook
              ? styles.socialButtonFacebook
              : styles.socialButtonGoogle,
          disabled && styles.socialButtonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={isApple || isFacebook ? COLORS.textPrimary : COLORS.textPrimary}
            size="small"
          />
        ) : (
          <>
            {isApple ? (
              <Ionicons name="logo-apple" size={20} color={COLORS.textPrimary} />
            ) : isFacebook ? (
              <Ionicons name="logo-facebook" size={20} color={COLORS.textPrimary} />
            ) : (
              <RNImage
                source={require("../../assets/google-logo.jpg")}
                style={styles.googleLogo}
                resizeMode="contain"
              />
            )}
            <Text style={styles.socialButtonText}>
              {isApple
                ? "Continuar com Apple"
                : isFacebook
                  ? "Continuar com Facebook"
                  : "Continuar com Google"}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
});

SocialButton.displayName = "SocialButton";

// ============================================
// EMAIL INPUT
// ============================================

const EmailInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled: boolean;
}> = React.memo(({ value, onChange, error, disabled }) => {
  const [focused, setFocused] = useState(false);
  const borderColor = useSharedValue(0);

  useEffect(() => {
    borderColor.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused, borderColor]);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor:
      interpolate(borderColor.value, [0, 1], [0, 1]) === 1 ? COLORS.inputFocus : COLORS.inputBorder,
  }));

  return (
    <View>
      <Animated.View
        style={[styles.inputContainer, animatedBorderStyle, error && styles.inputError]}
      >
        <Ionicons
          name="mail-outline"
          size={18}
          color={focused ? COLORS.inputFocus : COLORS.textMuted}
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="seu@email.com"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
          accessibilityLabel="Email"
        />
      </Animated.View>
      {error && (
        <Animated.View entering={FadeInDown.duration(200)} style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
});

EmailInput.displayName = "EmailInput";

// ============================================
// CTA BUTTON
// ============================================

const CTAButton: React.FC<{
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}> = React.memo(({ label, onPress, loading, disabled }) => {
  const glow = useSharedValue(0);

  useEffect(() => {
    if (!disabled) {
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
    return () => cancelAnimation(glow);
  }, [disabled, glow]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.7]),
    shadowRadius: interpolate(glow.value, [0, 1], [10, 25]),
  }));

  return (
    <PressableScale onPress={onPress} disabled={disabled || loading}>
      <Animated.View style={[styles.ctaButtonShadow, !disabled && glowStyle]}>
        <LinearGradient
          colors={
            disabled
              ? ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)"]
              : [brand.accent[400], brand.accent[500], brand.accent[600]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaButton}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textPrimary} size="small" />
          ) : (
            <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>{label}</Text>
          )}
        </LinearGradient>
      </Animated.View>
    </PressableScale>
  );
});

CTAButton.displayName = "CTAButton";

// ============================================
// MAIN SCREEN
// ============================================

export default function LoginScreenRedesign({ navigation }: Props): React.JSX.Element {
  void navigation;
  const insets = useSafeAreaInsets();

  // State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // Generate particles once
  const [particles] = useState(() => generateParticles(20));

  const anyLoading = loading || appleLoading || googleLoading || facebookLoading;
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Handlers
  const handleApple = async () => {
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

  const handleGoogle = async () => {
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

  const handleFacebook = async () => {
    try {
      setFacebookLoading(true);
      setError(null);
      const res = await signInWithFacebook();
      if (!res.success) setError(res.error || "Erro ao entrar com Facebook");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleEmail = async () => {
    Keyboard.dismiss();
    if (!email) return setError("Digite seu email");
    if (!isValidEmail(email)) return setError("Email inválido");

    try {
      setLoading(true);
      setError(null);
      const { error: err } = await signInWithMagicLink(email.trim());
      if (err) return setError(err instanceof Error ? err.message : "Erro");
      setSuccess("Link mágico enviado! Verifique seu email.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient
        colors={[
          COLORS.gradientTop,
          COLORS.gradientMid,
          COLORS.gradientBottom,
          COLORS.gradientAccent,
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Aurora effect */}
      <View style={styles.auroraContainer}>
        <LinearGradient
          colors={["transparent", COLORS.aurora1, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.aurora, { top: "10%", left: "-20%", transform: [{ rotate: "-15deg" }] }]}
        />
        <LinearGradient
          colors={["transparent", COLORS.aurora2, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.aurora, { top: "20%", right: "-30%", transform: [{ rotate: "10deg" }] }]}
        />
        <LinearGradient
          colors={["transparent", COLORS.aurora3, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.aurora, { top: "5%", left: "10%", transform: [{ rotate: "-5deg" }] }]}
        />
      </View>

      {/* Floating particles */}
      <View style={styles.particlesContainer}>
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <Pressable onPress={Keyboard.dismiss} style={styles.flex}>
          {/* Header section */}
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            {/* Logo */}
            <Animated.View entering={FadeIn.delay(100).duration(800)} style={styles.logoContainer}>
              <Image
                source={require("../../assets/logo-01.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </Animated.View>

            {/* Hero text - staggered reveal */}
            <View style={styles.heroTextContainer}>
              <Animated.Text
                entering={FadeInUp.delay(300).duration(600).springify()}
                style={styles.heroLabel}
              >
                NOSSA MATERNIDADE
              </Animated.Text>

              <Animated.Text
                entering={FadeInUp.delay(450).duration(600).springify()}
                style={styles.heroTitle}
              >
                Sua jornada{"\n"}começa aqui
              </Animated.Text>

              <Animated.Text
                entering={FadeInUp.delay(600).duration(600).springify()}
                style={styles.heroSubtitle}
              >
                por Nathalia Valente
              </Animated.Text>
            </View>

            {/* Stats */}
            <Animated.View entering={FadeInUp.delay(750).duration(500)} style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>40M+</Text>
                <Text style={styles.statLabel}>seguidoras</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>500K+</Text>
                <Text style={styles.statLabel}>mães no app</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>#1</Text>
                <Text style={styles.statLabel}>Brasil</Text>
              </View>
            </Animated.View>
          </View>

          {/* Auth card */}
          <Animated.View
            entering={SlideInUp.delay(900).duration(600).springify()}
            style={[styles.cardContainer, { paddingBottom: insets.bottom + 16 }]}
          >
            <GlassCard>
              {/* Social buttons */}
              <View style={styles.socialSection}>
                {Platform.OS === "ios" && (
                  <SocialButton
                    type="apple"
                    onPress={handleApple}
                    loading={appleLoading}
                    disabled={anyLoading && !appleLoading}
                  />
                )}
                <SocialButton
                  type="google"
                  onPress={handleGoogle}
                  loading={googleLoading}
                  disabled={anyLoading && !googleLoading}
                />
                <SocialButton
                  type="facebook"
                  onPress={handleFacebook}
                  loading={facebookLoading}
                  disabled={anyLoading && !facebookLoading}
                />
                {Platform.OS !== "ios" && (
                  <SocialButton
                    type="apple"
                    onPress={handleApple}
                    loading={appleLoading}
                    disabled={anyLoading && !appleLoading}
                  />
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email input */}
              <EmailInput
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (error) setError(null);
                  if (success) setSuccess(null);
                }}
                error={error || undefined}
                disabled={anyLoading}
              />

              {/* Success message */}
              {success && (
                <Animated.View entering={FadeInDown.duration(300)} style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={styles.successText}>{success}</Text>
                </Animated.View>
              )}

              {/* CTA */}
              <View style={styles.ctaContainer}>
                <CTAButton
                  label="Continuar"
                  onPress={handleEmail}
                  loading={loading}
                  disabled={anyLoading && !loading}
                />
              </View>

              {/* Legal */}
              <Text style={styles.legal}>
                Ao continuar, você concorda com nossos <Text style={styles.legalLink}>Termos</Text>{" "}
                e <Text style={styles.legalLink}>Privacidade</Text>
              </Text>
            </GlassCard>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientTop,
  },
  flex: {
    flex: 1,
  },

  // Aurora effect
  auroraContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  aurora: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.5,
    height: 200,
    opacity: 0.6,
  },

  // Particles
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    backgroundColor: Tokens.neutral[0],
    borderRadius: 100,
  },

  // Header
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  // Hero text
  heroTextContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroLabel: {
    fontSize: 11,
    fontFamily: FONTS.accent,
    color: brand.accent[400],
    letterSpacing: 3,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 38,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: 46,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 8,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  stat: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: FONTS.accent,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

  // Card
  cardContainer: {
    paddingHorizontal: 16,
  },
  glassCard: {
    backgroundColor: COLORS.glassBg,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: 24,
    overflow: "hidden",
  },
  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.glassHighlight,
  },

  // Social buttons
  socialSection: {
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    gap: 10,
  },
  socialButtonApple: {
    backgroundColor: COLORS.textPrimary,
  },
  socialButtonGoogle: {
    backgroundColor: COLORS.ctaSecondary,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  socialButtonFacebook: {
    backgroundColor: "#1877F2", // Facebook brand color
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  socialButtonText: {
    fontSize: 15,
    fontFamily: FONTS.accent,
    color: COLORS.textPrimary,
  },
  googleLogo: {
    width: 18,
    height: 18,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.glassBorder,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textPrimary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.error,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    borderRadius: 10,
  },
  successText: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.success,
    flex: 1,
  },

  // CTA
  ctaContainer: {
    marginTop: 16,
  },
  ctaButtonShadow: {
    shadowColor: brand.accent[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 14,
  },
  ctaButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 16,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
  },
  ctaTextDisabled: {
    color: COLORS.textMuted,
  },

  // Legal
  legal: {
    fontSize: 11,
    fontFamily: FONTS.light,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 16,
  },
  legalLink: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.accent,
  },
});
