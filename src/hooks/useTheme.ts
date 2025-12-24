/**
 * Hook para gerenciar tema (light/dark)
 * Integra com useAppStore para persistência
 *
 * Usa calmFemtech preset como fonte única de verdade
 */

import React, { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useAppStore } from "../state/store";
import { COLORS, COLORS_DARK } from "../theme/design-system";
import {
  neutral,
  feeling,
  typography,
  spacing,
  radius,
  shadows,
  components,
  layout,
  getThemeTokens,
  border,
} from "../theme/tokens";
import {
  brand,
  gradients,
  getPresetTokens,
} from "../theme/presets/calmFemtech";

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const theme = useAppStore((s) => s.theme);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const setIsDarkMode = useAppStore((s) => s.setIsDarkMode);
  const setTheme = useAppStore((s) => s.setTheme);

  // Determina se deve usar dark mode baseado no tema escolhido
  const shouldUseDark =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark");

  // Atualiza isDarkMode quando necessário
  React.useEffect(() => {
    if (shouldUseDark !== isDarkMode) {
      setIsDarkMode(shouldUseDark);
    }
  }, [shouldUseDark, isDarkMode, setIsDarkMode]);

  // Retorna as cores baseadas no tema (usando design-system.ts para compat)
  const colors = shouldUseDark ? COLORS_DARK : COLORS;

  // Tokens legados (compatibilidade)
  const legacyTokens = useMemo(() => getThemeTokens(shouldUseDark ? "dark" : "light"), [shouldUseDark]);

  // Novos tokens calmFemtech (fonte de verdade)
  const presetTokens = useMemo(() => getPresetTokens(shouldUseDark ? "dark" : "light"), [shouldUseDark]);

  return {
    // Compat com código existente
    theme,
    isDark: shouldUseDark,
    colors,
    setTheme,
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
    },

    // =========================================
    // Calm FemTech Preset (NOVA API - usar esta)
    // =========================================
    preset: presetTokens,
    brand,
    surface: presetTokens.surface,
    text: presetTokens.text,
    semantic: presetTokens.semantic,
    border: presetTokens.border,
    button: presetTokens.button,
    card: presetTokens.card,
    gradients,

    // =========================================
    // Tokens legados (compatibilidade)
    // =========================================
    tokens: legacyTokens,
    neutral,
    border: border[shouldUseDark ? "dark" : "light"],
    feeling,
    typography,
    spacing,
    radius,
    shadows,
    components,
    layout,
  };
}
