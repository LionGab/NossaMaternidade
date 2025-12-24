/**
 * Utilitários de Acessibilidade
 * Helpers para garantir WCAG AAA compliance e iOS HIG
 * 
 * @see Apple HIG - Accessibility
 * @see WCAG 2.1 Level AAA
 */

import { AccessibilityProps } from "react-native";
import { accessibility } from "../theme/tokens";

// ===========================================
// CONSTANTS
// ===========================================

/**
 * Minimum tap target size (iOS HIG)
 */
export const MIN_TAP_TARGET = accessibility.minTapTarget; // 44pt

/**
 * WCAG contrast ratios
 */
export const CONTRAST_RATIO = {
  AA: accessibility.contrastRatioAA,     // 4.5:1
  AAA: accessibility.contrastRatioAAA,   // 7:1
  AA_LARGE: 3,                           // 3:1 (large text ≥18pt)
  AAA_LARGE: 4.5,                        // 4.5:1 (large text ≥18pt)
} as const;

/**
 * Minimum spacing between interactive elements
 */
export const MIN_TOUCH_SPACING = accessibility.minTouchSpacing; // 8pt

export interface AccessibilityConfig {
  label: string;
  hint?: string;
  role?: AccessibilityProps["accessibilityRole"];
  state?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
  };
}

/**
 * Cria props de acessibilidade padronizadas
 */
export function createAccessibilityProps(config: AccessibilityConfig): AccessibilityProps {
  const { label, hint, role = "button", state } = config;

  const props: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: role,
  };

  if (hint) {
    props.accessibilityHint = hint;
  }

  if (state) {
    if (state.disabled !== undefined) {
      props.accessibilityState = { disabled: state.disabled };
    }
    if (state.selected !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, selected: state.selected };
    }
    if (state.checked !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, checked: state.checked };
    }
  }

  return props;
}

/**
 * Helper para botões
 */
export function buttonAccessibility(label: string, hint?: string, disabled?: boolean): AccessibilityProps {
  return createAccessibilityProps({
    label,
    hint,
    role: "button",
    state: { disabled },
  });
}

/**
 * Helper para textos
 */
export function textAccessibility(label: string, role: "text" | "header" = "text"): AccessibilityProps {
  return createAccessibilityProps({
    label,
    role,
  });
}

/**
 * Helper para imagens
 */
export function imageAccessibility(label: string, hint?: string): AccessibilityProps {
  const props: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: "image",
  };
  if (hint) {
    props.accessibilityHint = hint;
  }
  return props;
}

// ===========================================
// TAP TARGET HELPERS
// ===========================================

/**
 * Ensures a component meets minimum tap target size
 */
export function ensureMinTapTarget(size: number): number {
  return Math.max(size, MIN_TAP_TARGET);
}

/**
 * Creates accessible tap target style
 */
export function tapTargetStyle(width?: number, height?: number) {
  return {
    minWidth: ensureMinTapTarget(width || MIN_TAP_TARGET),
    minHeight: ensureMinTapTarget(height || MIN_TAP_TARGET),
  };
}

// ===========================================
// CONTRAST VALIDATION
// ===========================================

/**
 * Calculates relative luminance of a color
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getLuminance(hex: string): number {
  // Validate and normalize hex input
  if (!hex || typeof hex !== 'string') {
    throw new Error('Invalid hex color: must be a non-empty string');
  }
  
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    throw new Error(`Invalid hex color format: ${hex}. Expected format: #RRGGBB`);
  }
  
  const rgb = parseInt(cleanHex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates contrast ratio between two colors
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validates if contrast ratio meets WCAG level
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (isLargeText) {
    return level === 'AA' 
      ? ratio >= CONTRAST_RATIO.AA_LARGE 
      : ratio >= CONTRAST_RATIO.AAA_LARGE;
  }
  
  return level === 'AA' 
    ? ratio >= CONTRAST_RATIO.AA 
    : ratio >= CONTRAST_RATIO.AAA;
}

// ===========================================
// ANNOUNCEMENTS
// ===========================================

/**
 * Announces a message to screen readers
 * @param message - Message to announce
 */
export function announceForAccessibility(message: string): void {
  import('react-native').then(({ AccessibilityInfo }) => {
    AccessibilityInfo.announceForAccessibility(message);
  }).catch(() => {
    // Silently fail on web
  });
}

// ===========================================
// AGGREGATE EXPORT
// ===========================================

export const A11y = {
  MIN_TAP_TARGET,
  CONTRAST_RATIO,
  MIN_TOUCH_SPACING,
  ensureMinTapTarget,
  tapTargetStyle,
  buttonAccessibility,
  textAccessibility,
  imageAccessibility,
  createAccessibilityProps,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  announceForAccessibility,
} as const;
