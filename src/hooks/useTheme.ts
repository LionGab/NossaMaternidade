import { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, LightColors } from '../constants/Colors';

export type ThemeMode = 'light' | 'dark' | 'auto';

export const useTheme = (mode: ThemeMode = 'dark') => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(mode);

  // Determinar tema atual
  const currentTheme =
    themeMode === 'auto'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const isDark = currentTheme === 'dark';
  const colors = isDark ? Colors : LightColors;

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'auto';
      return 'dark';
    });
  }, []);

  return {
    colors,
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
  };
};

export default useTheme;

