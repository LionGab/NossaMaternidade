/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Design System - Primary Colors
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAD4FF',
          300: '#7CACFF',
          400: '#4285F4',    // Main - Google Blue
          500: '#0D5FFF',    // Brand principal
          600: '#0047E6',
          700: '#0036B8',
          800: '#002D96',
          900: '#002979',
          DEFAULT: '#4285F4',
        },

        // Design System - Secondary Colors
        secondary: {
          50: '#FFF0F6',
          100: '#FFE0EC',
          200: '#FFC2D9',
          300: '#FF94BA',
          400: '#FF8FA3',    // Rosa coral
          500: '#FF2576',    // Brand secondary
          600: '#E60A5B',
          700: '#C10048',
          800: '#A0003D',
          900: '#840036',
          DEFAULT: '#FF8FA3',
        },

        // Legacy compatibility
        'nath-blue': '#4285F4',
        'nath-light-blue': '#E8F0FE',
        'nath-warm': '#F8F9FA',
        'nath-dark': '#5D4E4B',
        'nath-pink': '#FF8FA3',

        // Background
        background: {
          DEFAULT: '#F8F9FA',
          canvas: '#F8F9FA',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          input: '#FFFFFF',
        },

        // Ocean Dark Theme
        'nath-dark-bg': '#020617',
        'nath-dark-card': '#0B1220',
        'nath-dark-sleep': '#111827',
        'nath-dark-pause': '#1D2843',
        'nath-dark-hero': '#3B82F6',
        'nath-dark-hero-soft': '#1D4ED8',
        'nath-dark-tab': '#020617',
        'nath-dark-border': 'rgba(148, 163, 184, 0.24)',
        'nath-dark-text': '#F9FAFB',

        // Text
        text: {
          DEFAULT: '#5D4E4B',
          primary: '#5D4E4B',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
          light: '#F9FAFB',
          placeholder: '#9CA3AF',
        },

        // Border
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          light: 'rgba(0, 0, 0, 0.08)',
          medium: 'rgba(0, 0, 0, 0.12)',
          dark: 'rgba(148, 163, 184, 0.24)',
          focus: '#4285F4',
        },

        // Status Colors (Design System)
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },

        // Legacy utilities
        card: '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: {
          green: '#10B981',
          orange: '#F59E0B',
          pink: '#FF8FA3',
          blue: '#4285F4',
        },
      },

      // Design System Spacing
      spacing: {
        '0': '0px',
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        // Legacy
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },

      // Design System Border Radius
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
        // Legacy
        'bubble': '16px',
        'chip': '20px',
      },

      // Design System Shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },

      // Design System Typography
      fontFamily: {
        body: ['System'],
        heading: ['System'],
        mono: ['Courier'],
      },

      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
      },

      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}

