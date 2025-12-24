/**
 * InstagramSentimentBar - Slider Premium estilo Instagram Stories
 *
 * Features:
 * - Track pill com fill gradiente sutil
 * - Segmentos discretos estilo stories
 * - Thumb circular com sombra e feedback de escala
 * - Acessibilidade completa (adjustable, increment/decrement)
 * - Suporte a gestos (tap + drag)
 */

import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, LayoutChangeEvent, AccessibilityActionEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";
import { brand, spacing, shadows } from "../../theme/tokens";

interface InstagramSentimentBarProps {
  /** Current value (0..1) */
  value: number;
  /** Called during drag */
  onChange: (value: number) => void;
  /** Called when drag ends */
  onChangeEnd?: (value: number) => void;
  /** Number of visual segments (default: 5) */
  segments?: number;
  /** Disable interaction */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const THUMB_SIZE = 30;
const THUMB_HIT_SLOP = 14; // Extra touch area
const TRACK_HEIGHT = 8;
const SEGMENT_GAP = 2;

export const InstagramSentimentBar: React.FC<InstagramSentimentBarProps> = ({
  value,
  onChange,
  onChangeEnd,
  segments = 5,
  disabled = false,
  accessibilityLabel = "Sentimento atual",
}) => {
  const { colors, isDark } = useTheme();

  // Track width (measured via onLayout)
  const trackWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Colors based on theme
  const trackBgColor = isDark ? colors.neutral[700] : colors.neutral[200];
  const trackFillColor = isDark ? colors.legacyAccent.sky : brand.primary[400];
  const thumbBorderColor = isDark ? colors.legacyAccent.sky : brand.primary[500];

  // Sync shared value with prop
  React.useEffect(() => {
    if (trackWidth.value > 0 && !isDragging.value) {
      translateX.value = withSpring(value * trackWidth.value, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [value, trackWidth, translateX, isDragging]);

  // Handle value change
  const handleValueChange = useCallback((newValue: number) => {
    onChange(newValue);
  }, [onChange]);

  const handleValueEnd = useCallback((newValue: number) => {
    onChangeEnd?.(newValue);
  }, [onChangeEnd]);

  // Layout measurement
  const onTrackLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    trackWidth.value = width;
    translateX.value = value * width;
  }, [value, trackWidth, translateX]);

  // Gesture handlers
  const panGesture = useMemo(() =>
    Gesture.Pan()
      .enabled(!disabled)
      .onStart(() => {
        startX.value = translateX.value;
        isDragging.value = true;
      })
      .onUpdate((event) => {
        const newX = Math.max(0, Math.min(trackWidth.value, startX.value + event.translationX));
        translateX.value = newX;
        const newValue = trackWidth.value > 0 ? newX / trackWidth.value : 0;
        runOnJS(handleValueChange)(newValue);
      })
      .onEnd(() => {
        isDragging.value = false;
        const finalValue = trackWidth.value > 0 ? translateX.value / trackWidth.value : 0;
        runOnJS(handleValueEnd)(finalValue);
      }),
    [disabled, trackWidth, translateX, startX, isDragging, handleValueChange, handleValueEnd]
  );

  const tapGesture = useMemo(() =>
    Gesture.Tap()
      .enabled(!disabled)
      .onEnd((event) => {
        const tappedX = Math.max(0, Math.min(trackWidth.value, event.x));
        translateX.value = withSpring(tappedX, { damping: 15 });
        const newValue = trackWidth.value > 0 ? tappedX / trackWidth.value : 0;
        runOnJS(handleValueChange)(newValue);
        runOnJS(handleValueEnd)(newValue);
      }),
    [disabled, trackWidth, translateX, handleValueChange, handleValueEnd]
  );

  const composedGesture = useMemo(() =>
    Gesture.Exclusive(panGesture, tapGesture),
    [panGesture, tapGesture]
  );

  // Animated styles
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - THUMB_SIZE / 2 },
      { scale: isDragging.value ? 1.08 : 1 },
    ],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  const thumbShadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      isDragging.value ? 1 : 0,
      [0, 1],
      [0.15, 0.25],
      Extrapolate.CLAMP
    ),
  }));

  // Accessibility handlers
  const handleAccessibilityAction = useCallback((event: AccessibilityActionEvent) => {
    const step = 0.1;
    let newValue = value;

    if (event.nativeEvent.actionName === "increment") {
      newValue = Math.min(1, value + step);
    } else if (event.nativeEvent.actionName === "decrement") {
      newValue = Math.max(0, value - step);
    }

    if (newValue !== value) {
      onChange(newValue);
      onChangeEnd?.(newValue);
    }
  }, [value, onChange, onChangeEnd]);

  // Render segments overlay
  const renderSegments = () => {
    if (segments <= 1) return null;

    const separators = [];
    for (let i = 1; i < segments; i++) {
      separators.push(
        <View
          key={i}
          style={[
            styles.segmentSeparator,
            {
              left: `${(i / segments) * 100}%`,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        />
      );
    }
    return separators;
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{
            min: 0,
            max: 100,
            now: Math.round(value * 100),
          }}
          accessibilityActions={[
            { name: "increment", label: "Aumentar" },
            { name: "decrement", label: "Diminuir" },
          ]}
          onAccessibilityAction={handleAccessibilityAction}
          style={[styles.trackContainer, disabled && styles.disabled]}
        >
          {/* Track Background */}
          <View
            onLayout={onTrackLayout}
            style={[
              styles.track,
              { backgroundColor: trackBgColor },
            ]}
          >
            {/* Track Fill */}
            <Animated.View
              style={[
                styles.trackFill,
                { backgroundColor: trackFillColor },
                fillStyle,
              ]}
            />

            {/* Segment Separators */}
            {renderSegments()}
          </View>

          {/* Thumb */}
          <Animated.View
            style={[
              styles.thumb,
              {
                borderColor: thumbBorderColor,
                backgroundColor: isDark ? colors.neutral[800] : "#FFFFFF",
              },
              thumbStyle,
              thumbShadowStyle,
            ]}
            hitSlop={{
              top: THUMB_HIT_SLOP,
              bottom: THUMB_HIT_SLOP,
              left: THUMB_HIT_SLOP,
              right: THUMB_HIT_SLOP,
            }}
          />
        </Animated.View>
      </GestureDetector>

      {/* Labels */}
      <View style={styles.labelsContainer}>
        <Animated.Text
          style={[
            styles.label,
            { color: isDark ? colors.neutral[500] : colors.neutral[400] },
          ]}
        >
          BAIXO
        </Animated.Text>
        <Animated.Text
          style={[
            styles.label,
            { color: isDark ? colors.neutral[500] : colors.neutral[400] },
          ]}
        >
          ALTO
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: spacing.md,
  },
  trackContainer: {
    height: THUMB_SIZE + THUMB_HIT_SLOP * 2,
    justifyContent: "center",
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: TRACK_HEIGHT / 2,
  },
  segmentSeparator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SEGMENT_GAP,
    marginLeft: -SEGMENT_GAP / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2.5,
    ...shadows.md,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default InstagramSentimentBar;
