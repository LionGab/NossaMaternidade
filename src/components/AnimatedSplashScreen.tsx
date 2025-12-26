import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedSplashScreenProps {
  isReady: boolean;
  onFinish: () => void;
}

// Keep splash screen visible until app is ready
SplashScreen.preventAutoHideAsync();

export function AnimatedSplashScreen({ isReady, onFinish }: AnimatedSplashScreenProps) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);

  // Hide native splash immediately to show our custom one
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Already hidden, ignore error
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Animação de entrada
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Tagline aparece depois do logo
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    taglineTranslateY.value = withDelay(400, withSpring(0, { damping: 10 }));

    // Fade out após 2 segundos
    const timeout = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 400 });
      taglineOpacity.value = withTiming(0, { duration: 400 });

      setTimeout(() => {
        onFinish();
      }, 450);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isReady, logoScale, logoOpacity, taglineOpacity, taglineTranslateY, onFinish]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={["#f4258c", "#fce7f3"]} // Rosa vibrante → Rosa muito claro
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
        Sua jornada maternal começa aqui ✨
      </Animated.Text>

      {/* Subtle loading indicator */}
      {!isReady && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 180,
    height: 180,
  },
  tagline: {
    fontSize: 18,
    fontFamily: "Manrope_600SemiBold",
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    opacity: 0.8,
  },
  loadingDotDelay1: {
    opacity: 0.5,
  },
  loadingDotDelay2: {
    opacity: 0.3,
  },
});
