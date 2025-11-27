/**
 * Design System Central - Nossa Maternidade
 * 
 * Exporta todos os tokens de design
 * Usar: import { COLORS, SPACING, TYPOGRAPHY } from '@/design-system'
 * 
 * @version 1.0
 * @date 2025-11-27
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './borders';
export * from './responsive';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPOSIÇÕES (Usar como atalho)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { SPACING, PADDING, GAP } from './spacing';
import { BORDERS } from './borders';

export const DESIGN_SYSTEM = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  padding: PADDING,
  gap: GAP,
  borders: BORDERS,
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXEMPLO DE USO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
import { COLORS, TYPOGRAPHY, SPACING, BORDERS } from '@/design-system';

// Em um componente React Native:

<View
  style={{
    padding: SPACING[4],                    // 16px
    backgroundColor: COLORS.primary[50],    // Rosa muito claro
    borderRadius: BORDERS.cardRadius,       // 16px
    marginBottom: SPACING[3],               // 12px
  }}
>
  <Text
    style={{
      fontSize: TYPOGRAPHY.h3.fontSize,
      fontWeight: TYPOGRAPHY.h3.fontWeight,
      color: COLORS.text.primary,
    }}
  >
    Olá, mãe! 💫
  </Text>
</View>
*/

