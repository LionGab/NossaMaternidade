/**
 * Hook para gerenciar tema (light/dark)
 * Integra com useAppStore para persistência
 */

import React from "react";
import { useColorScheme } from "react-native";
import { useAppStore } from "../state/store";
import { Colors, ColorsDark } from "../utils/colors";

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

  // Retorna as cores baseadas no tema (usando colors.ts para compatibilidade)
  const colors = shouldUseDark ? ColorsDark : Colors;

  return {
    theme,
    isDark: shouldUseDark,
    colors,
    setTheme,
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
    },
  };
}
