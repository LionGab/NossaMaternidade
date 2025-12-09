/**
 * Accessibility Utilities
 * Ferramentas para garantir WCAG AAA compliance
 * 
 * @version 3.0.0
 */

/**
 * Calculate relative luminance of a color
 * Used for contrast ratio calculation
 */
const getLuminance = (color: string): number => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const gamma = (val: number) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const R = gamma(r);
  const G = gamma(g);
  const B = gamma(b);

  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1 formula
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG standards
 */
export const meetsWCAGStandard = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AAA',
  size: 'normal' | 'large' = 'normal'
): { passes: boolean; ratio: number; required: number } => {
  const ratio = getContrastRatio(foreground, background);

  const requirements = {
    AA: size === 'large' ? 3 : 4.5,
    AAA: size === 'large' ? 4.5 : 7,
  };

  const required = requirements[level];
  const passes = ratio >= required;

  return { passes, ratio, required };
};

/**
 * Validate touch target size
 * iOS: 44pt minimum, Android: 48dp minimum
 */
export const validateTouchTarget = (
  width: number,
  height: number,
  platform: 'ios' | 'android' = 'ios'
): { passes: boolean; minimum: number; actual: { width: number; height: number } } => {
  const minimum = platform === 'ios' ? 44 : 48;
  const passes = width >= minimum && height >= minimum;

  return {
    passes,
    minimum,
    actual: { width, height },
  };
};

/**
 * Accessibility Labels Generator
 * Creates proper accessibility labels for screen readers
 */
export const createAccessibilityLabel = (
  element: string,
  state?: {
    selected?: boolean;
    expanded?: boolean;
    checked?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }
): string => {
  let label = element;

  if (state) {
    const stateLabels: string[] = [];

    if (state.selected) stateLabels.push('selecionado');
    if (state.expanded) stateLabels.push('expandido');
    if (state.checked) stateLabels.push('marcado');
    if (state.disabled) stateLabels.push('desabilitado');
    if (state.loading) stateLabels.push('carregando');

    if (stateLabels.length > 0) {
      label += `, ${stateLabels.join(', ')}`;
    }
  }

  return label;
};

/**
 * Color Blindness Simulation
 * Helps validate designs for different types of color blindness
 */
export const simulateColorBlindness = (
  color: string,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia'
): string => {
  // Simplified simulation - in production, use proper color transformation matrices
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  let newR = r;
  let newG = g;
  let newB = b;

  switch (type) {
    case 'protanopia': // Red-blind
      newR = Math.round(r * 0.567 + g * 0.433);
      newG = Math.round(r * 0.558 + g * 0.442);
      newB = Math.round(g * 0.242 + b * 0.758);
      break;
    case 'deuteranopia': // Green-blind
      newR = Math.round(r * 0.625 + g * 0.375);
      newG = Math.round(r * 0.7 + g * 0.3);
      newB = Math.round(g * 0.3 + b * 0.7);
      break;
    case 'tritanopia': // Blue-blind
      newR = Math.round(r * 0.95 + g * 0.05);
      newG = Math.round(g * 0.433 + b * 0.567);
      newB = Math.round(g * 0.475 + b * 0.525);
      break;
  }

  const toHex = (val: number) => Math.min(255, Math.max(0, val)).toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

/**
 * Validate focus indicators
 * Ensures focus states are visible and meet WCAG standards
 */
export const validateFocusIndicator = (
  focusBorderWidth: number,
  focusColor: string,
  backgroundColor: string
): { passes: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check border width (minimum 2px)
  if (focusBorderWidth < 2) {
    issues.push('Focus indicator deve ter pelo menos 2px de largura');
  }

  // Check contrast
  const contrast = getContrastRatio(focusColor, backgroundColor);
  if (contrast < 3) {
    issues.push(`Contraste do focus indicator muito baixo: ${contrast.toFixed(2)}:1 (mínimo 3:1)`);
  }

  return {
    passes: issues.length === 0,
    issues,
  };
};

/**
 * Accessibility Report Generator
 * Creates a comprehensive accessibility report for a component
 */
export interface AccessibilityReport {
  component: string;
  passes: boolean;
  issues: Array<{
    type: 'contrast' | 'touch-target' | 'focus' | 'label';
    severity: 'critical' | 'warning' | 'info';
    message: string;
  }>;
  recommendations: string[];
}

export const generateAccessibilityReport = (config: {
  component: string;
  foreground: string;
  background: string;
  touchTarget?: { width: number; height: number };
  hasLabel?: boolean;
  focusIndicator?: { width: number; color: string };
}): AccessibilityReport => {
  const issues: AccessibilityReport['issues'] = [];
  const recommendations: string[] = [];

  // Check contrast
  const contrast = meetsWCAGStandard(config.foreground, config.background, 'AAA');
  if (!contrast.passes) {
    issues.push({
      type: 'contrast',
      severity: 'critical',
      message: `Contraste insuficiente: ${contrast.ratio.toFixed(2)}:1 (requerido: ${contrast.required}:1)`,
    });
    recommendations.push('Ajuste as cores para melhorar o contraste');
  }

  // Check touch target
  if (config.touchTarget) {
    const touch = validateTouchTarget(
      config.touchTarget.width,
      config.touchTarget.height
    );
    if (!touch.passes) {
      issues.push({
        type: 'touch-target',
        severity: 'critical',
        message: `Área de toque muito pequena: ${touch.actual.width}x${touch.actual.height}px (mínimo: ${touch.minimum}px)`,
      });
      recommendations.push(`Aumente o tamanho da área de toque para pelo menos ${touch.minimum}x${touch.minimum}px`);
    }
  }

  // Check accessibility label
  if (config.hasLabel === false) {
    issues.push({
      type: 'label',
      severity: 'warning',
      message: 'Componente sem label de acessibilidade',
    });
    recommendations.push('Adicione accessibilityLabel para leitores de tela');
  }

  // Check focus indicator
  if (config.focusIndicator) {
    const focus = validateFocusIndicator(
      config.focusIndicator.width,
      config.focusIndicator.color,
      config.background
    );
    if (!focus.passes) {
      issues.push({
        type: 'focus',
        severity: 'warning',
        message: focus.issues.join('; '),
      });
      recommendations.push('Melhore a visibilidade do indicador de foco');
    }
  }

  return {
    component: config.component,
    passes: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    recommendations,
  };
};

export default {
  getContrastRatio,
  meetsWCAGStandard,
  validateTouchTarget,
  createAccessibilityLabel,
  simulateColorBlindness,
  validateFocusIndicator,
  generateAccessibilityReport,
};
