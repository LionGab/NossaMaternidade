/**
 * StageCard - Card premium para seleção de estágio da jornada
 * Design: Foto com overlay gradiente + título + frase da Nath
 * Animações: Scale on press, spring selection, parallax-like effect
 */

import React, { memo } from "react";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import { Image } from "expo-image";
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
      ? Tokens.brand.accent[300] // Rosa mais suave
      : theme.colors.border.subtle,
    borderWidth: withSpring(isSelected ? 2 : 1, { damping: 20 }),
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
          contentFit="cover"
          contentPosition="top"
          placeholder={data.image}
          accessible
          accessibilityLabel={`${data.title}. ${data.quote}`}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.imageOverlay}
        />

        {/* Checkmark com animação */}
        <Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
          <LinearGradient
            colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
            style={styles.checkmark}
          >
            <Ionicons name="checkmark" size={18} color={Tokens.neutral[0]} />
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

      {/* Selection glow effect - mais suave */}
      {isSelected && (
        <View style={styles.glowEffect} pointerEvents="none">
          <LinearGradient
            colors={[`${Tokens.brand.accent[200]}30`, "transparent"]}
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
    borderRadius: Tokens.radius.xl,
    overflow: "hidden",
    flex: 1,
    ...Tokens.shadows.sm, // Sombra mais suave
  },
  imageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
    backgroundColor: Tokens.neutral[100],
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
    bottom: Tokens.spacing.xs,
    left: Tokens.spacing.xs,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 28,
    height: 28,
    borderRadius: Tokens.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  icon: {
    fontSize: 16,
  },
  checkmarkContainer: {
    position: "absolute",
    top: Tokens.spacing.xs,
    right: Tokens.spacing.xs,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  content: {
    flex: 1,
    padding: Tokens.spacing.sm,
    gap: 2,
    justifyContent: "center",
  },
  title: {
    fontSize: Tokens.typography.labelMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
    lineHeight: Tokens.typography.labelMedium.lineHeight,
  },
  quote: {
    fontSize: Tokens.typography.caption.fontSize,
    fontStyle: "italic",
    lineHeight: Tokens.typography.caption.lineHeight,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Tokens.radius["2xl"],
  },
});
