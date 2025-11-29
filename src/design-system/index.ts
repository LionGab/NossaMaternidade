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
import { logger } from '@/utils/logger';

if (__DEV__) {
  logger.warn(
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
// EXEMPLO DE USO (DEPRECATED - NÃO USAR)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Exemplo antigo (DEPRECATED):
// import { COLORS, TYPOGRAPHY, SPACING, BORDERS } from '@/design-system';
//
// Use em vez disso:
// import { Tokens } from '@/theme/tokens';
// import { useThemeColors } from '@/theme';
//
// const colors = useThemeColors();
// padding: Tokens.spacing['4']
// backgroundColor: colors.background.card

