/**
 * StageCard - Card premium para seleção de estágio da jornada
 * Design: Foto com overlay gradiente + título + frase da Nath
 * Animações: Scale on press, spring selection, parallax-like effect
 */

import React, { memo } from "react";
import { View, Text, Image, StyleSheet, Platform, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { StageCardData } from "../../types/nath-journey-onboarding.types";

const isWeb = Platform.OS === "web";

interface StageCardProps {
  data: StageCardData;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function StageCardComponent({ data, isSelected, onPress }: StageCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  // Gesture handling com spring physics
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      pressed.value = withTiming(1, { duration: 100 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      pressed.value = withTiming(0, { duration: 200 });
    })
    .onEnd(() => {
      onPress();
    });

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedSelectionStyle = useAnimatedStyle(() => ({
    borderColor: isSelected
      ? Tokens.brand.accent[500]
      : theme.colors.border.subtle,
    borderWidth: withSpring(isSelected ? 3 : 1.5, { damping: 20 }),
  }));

  const checkmarkScale = useSharedValue(isSelected ? 1 : 0);
  React.useEffect(() => {
    checkmarkScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 12,
      stiffness: 200,
    });
  }, [isSelected, checkmarkScale]);

  const animatedCheckmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkScale.value,
  }));

  // Card content (shared between web and native)
  const cardContent = (
    <>
      {/* Image with gradient overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={data.image}
          style={styles.image}
          resizeMode="cover"
          defaultSource={data.image}
          accessible
          accessibilityLabel={`${data.title}. ${data.quote}`}
          accessibilityRole="button"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.imageOverlay}
        />

        {/* Checkmark com animação */}
        <Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
          <LinearGradient
            colors={Tokens.gradients.accent}
            style={styles.checkmark}
          >
            <Ionicons name="checkmark" size={20} color={Tokens.neutral[0]} />
          </LinearGradient>
        </Animated.View>

        {/* Icon flutuando na imagem */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{data.icon}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={[styles.content, { backgroundColor: theme.surface.card }]}>
        <Text
          style={[
            styles.title,
            { color: theme.text.primary },
          ]}
          numberOfLines={1}
        >
          {data.title}
        </Text>
        <Text
          style={[
            styles.quote,
            { color: theme.text.secondary },
          ]}
          numberOfLines={2}
        >
          {'"'}{data.quote}{'"'}
        </Text>
      </View>

      {/* Selection glow effect */}
      {isSelected && (
        <View style={styles.glowEffect} pointerEvents="none">
          <LinearGradient
            colors={[`${Tokens.brand.accent[500]}20`, "transparent"]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </>
  );

  // Use Pressable for web, GestureDetector for native (better animation support)
  if (isWeb) {
    return (
      <Pressable onPress={onPress}>
        <AnimatedView
          style={[styles.card, animatedCardStyle, animatedSelectionStyle]}
        >
          {cardContent}
        </AnimatedView>
      </Pressable>
    );
  }

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedView
        style={[styles.card, animatedCardStyle, animatedSelectionStyle]}
      >
        {cardContent}
      </AnimatedView>
    </GestureDetector>
  );
}

export const StageCard = memo(StageCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius["2xl"],
    overflow: "hidden",
    minHeight: 220,
    ...Tokens.shadows.md,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    position: "absolute",
    bottom: Tokens.spacing.md,
    left: Tokens.spacing.md,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 44,
    height: 44,
    borderRadius: Tokens.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  icon: {
    fontSize: 24,
  },
  checkmarkContainer: {
    position: "absolute",
    top: Tokens.spacing.md,
    right: Tokens.spacing.md,
  },
  checkmark: {
    width: 36,
    height: 36,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.md,
  },
  content: {
    flex: 1,
    padding: Tokens.spacing.lg,
    gap: Tokens.spacing.xs,
    justifyContent: "center",
  },
  title: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    lineHeight: Tokens.typography.titleMedium.lineHeight,
  },
  quote: {
    fontSize: Tokens.typography.bodySmall.fontSize,
    fontStyle: "italic",
    lineHeight: Tokens.typography.bodySmall.lineHeight,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Tokens.radius["2xl"],
  },
});
