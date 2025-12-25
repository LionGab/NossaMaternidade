/**
 * ConcernCard - Card premium para seleção de preocupações
 * Design: Grid 2 colunas com animações fluidas
 * Animações: Scale bounce, selection spring, pulse effect quando selecionado
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
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { ConcernCardData } from "../../types/nath-journey-onboarding.types";

const isWeb = Platform.OS === "web";

interface ConcernCardProps {
  data: ConcernCardData;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function ConcernCardComponent({ data, isSelected, onPress, disabled }: ConcernCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const emojiScale = useSharedValue(1);

  // Gesture handling
  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      // Bounce do emoji quando selecionado
      if (!isSelected) {
        emojiScale.value = withSequence(
          withSpring(1.3, { damping: 8, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        );
      }
      runOnJS(onPress)();
    });

  // Animated styles - cores mais suaves
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isSelected ? Tokens.brand.accent[300] : theme.colors.border.subtle,
    borderWidth: withSpring(isSelected ? 2 : 1, { damping: 20 }),
  }));

  const animatedEmojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  // Badge animation
  const badgeScale = useSharedValue(isSelected ? 1 : 0);
  React.useEffect(() => {
    badgeScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 12,
      stiffness: 250,
    });
  }, [isSelected, badgeScale]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  // Card content (shared between web and native)
  const cardContent = (
    <>
      {/* Image com overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={data.image}
          style={styles.image}
          contentFit="cover"
          contentPosition="top"
          placeholder={data.image}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={styles.imageOverlay}
        />

        {/* Badge de seleção - cores suaves */}
        <Animated.View style={[styles.badge, animatedBadgeStyle]}>
          <LinearGradient
            colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
            style={styles.badgeGradient}
          >
            <Ionicons name="checkmark" size={14} color={Tokens.neutral[0]} />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.Text style={[styles.emoji, animatedEmojiStyle]}>
          {data.emoji}
        </Animated.Text>
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

      {/* Selection highlight - mais suave */}
      {isSelected && (
        <View style={styles.selectionHighlight} pointerEvents="none">
          <LinearGradient
            colors={[`${Tokens.brand.accent[200]}25`, "transparent"]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </>
  );

  // Use Pressable for web, GestureDetector for native
  if (isWeb) {
    return (
      <Pressable onPress={disabled ? undefined : onPress} disabled={disabled}>
        <AnimatedView
          style={[
            styles.card,
            { backgroundColor: theme.surface.card },
            animatedCardStyle,
            disabled && !isSelected && styles.cardDisabled,
          ]}
          accessible
          accessibilityLabel={`${data.title}. ${data.quote}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled }}
        >
          {cardContent}
        </AnimatedView>
      </Pressable>
    );
  }

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedView
        style={[
          styles.card,
          { backgroundColor: theme.surface.card },
          animatedCardStyle,
          disabled && !isSelected && styles.cardDisabled,
        ]}
        accessible
        accessibilityLabel={`${data.title}. ${data.quote}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled }}
      >
        {cardContent}
      </AnimatedView>
    </GestureDetector>
  );
}

export const ConcernCard = memo(ConcernCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius.lg, // Bordas mais suaves
    overflow: "hidden",
    ...Tokens.shadows.sm,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  imageContainer: {
    width: "100%",
    height: 130,
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
  badge: {
    position: "absolute",
    top: Tokens.spacing.sm,
    right: Tokens.spacing.sm,
  },
  badgeGradient: {
    width: 26,
    height: 26,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  content: {
    padding: Tokens.spacing.md,
    gap: Tokens.spacing.xs,
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: Tokens.typography.labelLarge.fontSize,
    fontWeight: Tokens.typography.labelLarge.fontWeight,
    textAlign: "center",
    lineHeight: Tokens.typography.labelLarge.lineHeight,
  },
  quote: {
    fontSize: Tokens.typography.caption.fontSize,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: Tokens.typography.caption.lineHeight * 1.1,
  },
  selectionHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Tokens.radius.xl,
  },
});

