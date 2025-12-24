/**
 * Skeleton Loader Component
 * Placeholder animado para estados de loading
 */

import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { neutral, spacing, radius } from "../../theme/tokens";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: Record<string, unknown>;
}

export function SkeletonLoader({ 
  width = "100%", 
  height = 20, 
  borderRadius = radius.md,
  style 
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: neutral[200],
          opacity,
        },
        style,
      ]}
    />
  );
}

/**
 * Skeleton para cards
 */
export function CardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: neutral[0],
        borderRadius: radius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
      }}
    >
      <SkeletonLoader width="60%" height={20} style={{ marginBottom: spacing.md }} />
      <SkeletonLoader width="100%" height={16} style={{ marginBottom: spacing.xs }} />
      <SkeletonLoader width="80%" height={16} />
    </View>
  );
}

/**
 * Skeleton para lista
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </>
  );
}
