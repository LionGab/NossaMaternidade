import { SPACING } from "../theme/tokens";

type SpacingKey = keyof typeof SPACING;

/**
 * Hook for 8pt Grid System
 *
 * Provides easy access to standardized spacing values based on 8pt grid.
 * All values are multiples or fractions of 8px for visual consistency.
 *
 * @example
 * ```tsx
 * const s = useSpacing();
 *
 * <View style={{ padding: s.lg, margin: s.md }}>
 *   <Text>Content</Text>
 * </View>
 *
 * // Or use individual values
 * <View style={{ paddingHorizontal: s["2xl"], paddingVertical: s.md }}>
 * ```
 */
export function useSpacing() {
  return {
    ...SPACING,

    /**
     * Get spacing value with optional multiplier
     * @param key - Spacing key (xs, sm, md, lg, etc.)
     * @param multiplier - Optional multiplier (default: 1)
     * @returns Calculated spacing value
     *
     * @example
     * ```tsx
     * const s = useSpacing();
     * s.get('lg', 2) // Returns 32 (16 * 2)
     * ```
     */
    get: (key: SpacingKey, multiplier: number = 1): number => {
      return SPACING[key] * multiplier;
    },

    /**
     * Create responsive spacing based on screen width
     * Useful for adapting spacing to different device sizes
     *
     * @param baseKey - Base spacing key
     * @param screenWidth - Screen width in pixels
     * @returns Adjusted spacing value
     */
    responsive: (baseKey: SpacingKey, screenWidth: number): number => {
      const baseValue = SPACING[baseKey];
      const scaleFactor = screenWidth / 375; // iPhone 12/13 base
      return Math.round(baseValue * scaleFactor);
    },
  };
}

/**
 * Static spacing values for use outside components
 * Equivalent to SPACING from design-system.ts
 */
export const spacing = SPACING;

/**
 * Common spacing patterns
 * Pre-defined combinations for common use cases
 */
export const SPACING_PATTERNS = {
  /** Card padding */
  cardPadding: {
    small: SPACING.md,      // 12px
    medium: SPACING.lg,     // 16px
    large: SPACING["2xl"],  // 24px
  },

  /** Screen padding */
  screenPadding: {
    horizontal: SPACING["2xl"], // 24px
    vertical: SPACING.lg,       // 16px
  },

  /** Stack spacing (vertical gaps) */
  stack: {
    tight: SPACING.sm,   // 8px
    normal: SPACING.md,  // 12px
    relaxed: SPACING.lg, // 16px
    loose: SPACING.xl,   // 20px
  },

  /** Inline spacing (horizontal gaps) */
  inline: {
    tight: SPACING.xs,   // 4px
    normal: SPACING.sm,  // 8px
    relaxed: SPACING.md, // 12px
  },
} as const;
