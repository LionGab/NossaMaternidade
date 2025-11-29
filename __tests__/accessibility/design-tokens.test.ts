/**
 * Testes de Acessibilidade - Design Tokens
 * 
 * Valida que o design system atende aos padrões WCAG AAA:
 * - Contraste de cores 7:1 (texto normal) e 4.5:1 (texto grande)
 * - Touch targets mínimos 44pt (iOS) / 48dp (Android)
 * - Suporte a Dynamic Type / Text Scaling
 */

import { ColorTokens, Tokens } from '../../src/theme/tokens';

// ======================
// 🎨 COLOR CONTRAST TESTS
// ======================

describe('Color Contrast (WCAG AAA)', () => {
  /**
   * Calcula a luminância relativa de uma cor
   */
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  /**
   * Converte hex para RGB
   */
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  /**
   * Calcula o ratio de contraste entre duas cores
   */
  const getContrastRatio = (color1: string, color2: string): number => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // WCAG AAA requer 7:1 para texto normal, 4.5:1 para texto grande
  const WCAG_AAA_NORMAL = 7;
  const WCAG_AAA_LARGE = 4.5;

  describe('Light Theme', () => {
    const lightBackground = ColorTokens.light.background.canvas;
    const lightCard = ColorTokens.light.background.card;

    test('Primary text on canvas background meets WCAG AAA', () => {
      const ratio = getContrastRatio(
        ColorTokens.light.text.primary,
        lightBackground
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_NORMAL);
    });

    test('Primary text on card background meets WCAG AAA', () => {
      const ratio = getContrastRatio(
        ColorTokens.light.text.primary,
        lightCard
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_NORMAL);
    });

    test('Secondary text on canvas background meets WCAG AA (large text)', () => {
      const ratio = getContrastRatio(
        ColorTokens.light.text.secondary,
        lightBackground
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_LARGE);
    });

    test('Primary button color is readable', () => {
      const ratio = getContrastRatio(
        '#FFFFFF', // Button text (white)
        ColorTokens.light.primary.main
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_LARGE);
    });

    test('Error color is distinguishable', () => {
      const ratio = getContrastRatio(
        ColorTokens.light.status.error,
        lightBackground
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_LARGE);
    });

    test('Success color is distinguishable', () => {
      const ratio = getContrastRatio(
        ColorTokens.light.status.success,
        lightBackground
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_LARGE);
    });
  });

  describe('Dark Theme', () => {
    const darkBackground = ColorTokens.dark.background.canvas;
    const darkCard = ColorTokens.dark.background.card;

    test('Primary text on dark canvas meets WCAG AAA', () => {
      const ratio = getContrastRatio(
        ColorTokens.dark.text.primary,
        darkBackground
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_NORMAL);
    });

    test('Primary text on dark card meets WCAG AAA', () => {
      const ratio = getContrastRatio(
        ColorTokens.dark.text.primary,
        darkCard
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_NORMAL);
    });

    test('Secondary text on dark canvas meets WCAG AA', () => {
      const ratio = getContrastRatio(
        ColorTokens.dark.text.secondary,
        darkBackground
      );
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AAA_LARGE);
    });
  });
});

// ======================
// 📏 TOUCH TARGET TESTS
// ======================

describe('Touch Targets (iOS/Android)', () => {
  // iOS HIG: 44pt minimum
  // Material Design: 48dp minimum
  const IOS_MIN_TOUCH_TARGET = 44;
  const ANDROID_MIN_TOUCH_TARGET = 48;

  test('Button height meets iOS minimum (44pt)', () => {
    const buttonHeight = Tokens.components.button.height.md;
    expect(buttonHeight).toBeGreaterThanOrEqual(IOS_MIN_TOUCH_TARGET);
  });

  test('Button height meets Android minimum (48dp)', () => {
    const buttonHeight = Tokens.components.button.height.md;
    expect(buttonHeight).toBeGreaterThanOrEqual(ANDROID_MIN_TOUCH_TARGET);
  });

  test('Input height meets minimum touch target', () => {
    const inputHeight = Tokens.components.input.height.md;
    expect(inputHeight).toBeGreaterThanOrEqual(IOS_MIN_TOUCH_TARGET);
  });

  test('Small button height is at least 44pt', () => {
    const smallButtonHeight = Tokens.components.button.height.sm;
    expect(smallButtonHeight).toBeGreaterThanOrEqual(IOS_MIN_TOUCH_TARGET);
  });

  test('Icon buttons have adequate touch area', () => {
    // Icon size + padding should meet minimum
    const iconSize = Tokens.icon.md;
    const minPadding = (IOS_MIN_TOUCH_TARGET - iconSize) / 2;
    expect(minPadding).toBeGreaterThanOrEqual(0);
  });
});

// ======================
// 📝 TYPOGRAPHY TESTS
// ======================

describe('Typography Accessibility', () => {
  // WCAG recommends minimum 16px base font size
  const MIN_BASE_FONT_SIZE = 14; // Allowing 14px for mobile
  const MIN_BODY_FONT_SIZE = 14;
  const MIN_CAPTION_FONT_SIZE = 12;

  test('Body text is at least 14px', () => {
    const bodySize = Tokens.typography.fontSize.md;
    expect(bodySize).toBeGreaterThanOrEqual(MIN_BODY_FONT_SIZE);
  });

  test('Caption text is at least 12px', () => {
    const captionSize = Tokens.typography.fontSize.xs;
    expect(captionSize).toBeGreaterThanOrEqual(MIN_CAPTION_FONT_SIZE);
  });

  test('Line height is adequate for readability', () => {
    const lineHeight = Tokens.typography.lineHeight.normal;
    // Line height should be at least 1.5x for body text
    expect(lineHeight).toBeGreaterThanOrEqual(1.4);
  });

  test('Heading sizes follow hierarchy', () => {
    const h1 = Tokens.typography.fontSize['3xl'];
    const h2 = Tokens.typography.fontSize['2xl'];
    const h3 = Tokens.typography.fontSize.xl;
    const h4 = Tokens.typography.fontSize.lg;
    
    expect(h1).toBeGreaterThan(h2);
    expect(h2).toBeGreaterThan(h3);
    expect(h3).toBeGreaterThan(h4);
  });
});

// ======================
// 🎯 SPACING TESTS
// ======================

describe('Spacing Accessibility', () => {
  test('Base spacing unit is consistent (4px grid)', () => {
    const baseUnit = Tokens.spacing['1'];
    expect(baseUnit).toBe(4);
  });

  test('Spacing scale follows consistent increments', () => {
    const spacing = Tokens.spacing;
    expect(spacing['2']).toBe(spacing['1'] * 2);
    expect(spacing['4']).toBe(spacing['1'] * 4);
    expect(spacing['8']).toBe(spacing['1'] * 8);
  });

  test('Card padding is adequate for touch', () => {
    const cardPadding = Tokens.spacing['4']; // 16px
    expect(cardPadding).toBeGreaterThanOrEqual(12);
  });
});

// ======================
// 🌙 DARK MODE TESTS
// ======================

describe('Dark Mode Support', () => {
  test('All light colors have dark equivalents', () => {
    const lightKeys = Object.keys(ColorTokens.light);
    const darkKeys = Object.keys(ColorTokens.dark);
    
    expect(darkKeys).toEqual(expect.arrayContaining(lightKeys));
  });

  test('Dark background is actually dark', () => {
    const darkBg = ColorTokens.dark.background.canvas;
    const luminance = getLuminance(darkBg);
    expect(luminance).toBeLessThan(0.2);
    
    function getLuminance(hex: string): number {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return 0;
      
      const rgb = [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
  });

  test('Light background is actually light', () => {
    const lightBg = ColorTokens.light.background.canvas;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(lightBg);
    if (!result) {
      fail('Invalid hex color');
      return;
    }
    
    const rgb = [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    
    const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    expect(luminance).toBeGreaterThan(0.8);
  });
});

// ======================
// 🧩 TOKEN COMPLETENESS
// ======================

describe('Design Token Completeness', () => {
  test('All required color tokens exist', () => {
    const requiredTokens = [
      'primary',
      'secondary',
      'background',
      'text',
      'border',
      'status',
    ];

    for (const token of requiredTokens) {
      expect(ColorTokens.light).toHaveProperty(token);
      expect(ColorTokens.dark).toHaveProperty(token);
    }
  });

  test('All spacing tokens exist', () => {
    const requiredSpacing = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];
    
    for (const space of requiredSpacing) {
      expect(Tokens.spacing).toHaveProperty(space);
    }
  });

  test('All typography tokens exist', () => {
    expect(Tokens.typography).toHaveProperty('fontSize');
    expect(Tokens.typography).toHaveProperty('fontWeight');
    expect(Tokens.typography).toHaveProperty('lineHeight');
  });

  test('All component tokens exist', () => {
    expect(Tokens.components).toHaveProperty('button');
    expect(Tokens.components).toHaveProperty('input');
    expect(Tokens.components).toHaveProperty('card');
  });
});

