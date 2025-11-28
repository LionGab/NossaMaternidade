/**
 * Design System Central - Nossa Maternidade
 * 
 * ⚠️ DEPRECATED: Este módulo está obsoleto.
 * Use: import { Tokens } from '@/theme/tokens'
 * Use: import { useThemeColors } from '@/hooks/useTheme'
 * 
 * Migração:
 * - COLORS.primary[500] → colors.primary.main (com useThemeColors())
 * - SPACING[4] → Tokens.spacing['4']
 * - TYPOGRAPHY.button → Tokens.typography.semantic.button
 * - BORDERS.buttonRadius → Tokens.radius.lg
 * 
 * @version 1.0 (DEPRECATED)
 * @date 2025-11-27
 * @deprecated Use @/theme/tokens instead
 */

// Log de deprecação
if (__DEV__) {
  console.warn(
    '[DEPRECATED] @/design-system está obsoleto. ' +
    'Use @/theme/tokens e useThemeColors() em vez disso. ' +
    'Veja docs/DESIGN_VALIDATION_GUIDE.md para migração.'
  );
}

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

