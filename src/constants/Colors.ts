/**
 * Design Tokens - Nossa Maternidade
 * Sistema de cores unificado extraído do projeto web
 * Baseado no tema "Ocean Dark" e Google Material Design
 */

export const Colors = {
  // Brand Colors (Light Mode)
  brand: {
    blue: '#4285F4',       // Google Blue - cor principal
    lightBlue: '#E8F0FE',  // Azul claro arejado
    warm: '#F8F9FA',       // Branco quente sutil
    dark: '#5D4E4B',       // Cinza-marrom profundo
    pink: '#FF8FA3',       // Rosa coral suave
  },

  // Backgrounds (Ocean Dark Theme)
  background: {
    canvas: '#020617',     // Fundo principal dark
    card: '#0B1220',       // Cards e superfícies
    sleep: '#111827',      // Superfície sleep
    pause: '#1D2843',      // Superfície pause
    light: '#F8F9FA',      // Fundo light mode
    dark: '#020617',       // Fundo dark mode
    tab: '#020617',        // Tab bar
  },

  // Text
  text: {
    primary: '#F9FAFB',    // Texto principal (dark mode)
    secondary: '#D1D5DB',  // Texto secundário
    tertiary: '#9CA3AF',   // Texto terciário
    muted: '#9CA3AF',      // Texto desbotado
    dark: '#5D4E4B',       // Texto dark (light mode)
  },

  // Primary Colors (compatibilidade)
  primary: {
    main: '#4285F4',       // nath-blue
    light: '#E8F0FE',      // nath-light-blue
    dark: '#1D4ED8',       // dark-hero-soft
    hero: '#3B82F6',       // Azul hero (dark mode)
  },

  // Accent Colors
  accent: {
    green: '#10B981',      // Verde (sucesso)
    orange: '#F59E0B',     // Laranja (notificações)
    pink: '#FF8FA3',       // Rosa coral
    blue: '#4285F4',       // Azul destaque
  },

  // Borders
  border: {
    light: 'rgba(0, 0, 0, 0.1)',           // Light mode
    medium: 'rgba(0, 0, 0, 0.15)',         // Light mode médio
    dark: 'rgba(148, 163, 184, 0.24)',     // Dark mode
    subtle: 'rgba(255, 255, 255, 0.05)',   // Muito sutil
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#4285F4',
  },

  // Progress Indicators
  progress: {
    active: '#4285F4',                     // Azul (ativo)
    inactive: 'rgba(255, 255, 255, 0.3)', // Cinza (inativo)
  },
} as const;

// Light Mode Colors
export const LightColors = {
  background: {
    canvas: '#F8F9FA',     // nath-warm
    card: '#FFFFFF',
    input: '#FFFFFF',
  },
  text: {
    primary: '#5D4E4B',    // nath-dark
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  primary: {
    main: '#4285F4',       // nath-blue
    light: '#E8F0FE',
    dark: '#1D4ED8',
  },
  border: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.05)',
  },
} as const;

// Dark Mode Colors (Ocean Dark Theme)
export const DarkColors = {
  background: {
    canvas: '#020617',
    card: '#0B1220',
    sleep: '#111827',
    pause: '#1D2843',
    tab: '#020617',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
  },
  primary: {
    main: '#3B82F6',       // dark-hero
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  border: {
    light: 'rgba(148, 163, 184, 0.24)',
    medium: 'rgba(148, 163, 184, 0.35)',
    dark: 'rgba(148, 163, 184, 0.15)',
  },
} as const;

export default Colors;

