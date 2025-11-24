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
        // Cores principais (Light Mode)
        primary: '#4285F4',           // nath-blue - Google Blue
        secondary: '#8BB5E8',
        'nath-blue': '#4285F4',
        'nath-light-blue': '#E8F0FE',
        'nath-warm': '#F8F9FA',
        'nath-dark': '#5D4E4B',
        'nath-pink': '#FF8FA3',

        // Background
        background: {
          DEFAULT: '#F8F9FA',        // nath-warm
          card: '#FFFFFF',
          input: '#FFFFFF',
        },

        // Ocean Dark Theme
        'dark-bg': '#020617',
        'dark-card': '#0B1220',
        'dark-sleep': '#111827',
        'dark-pause': '#1D2843',
        'dark-hero': '#3B82F6',
        'dark-hero-soft': '#1D4ED8',
        'dark-tab': '#020617',

        // Text
        text: {
          DEFAULT: '#5D4E4B',        // nath-dark
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
          light: '#F9FAFB',          // dark mode text
          'dark-sec': '#D1D5DB',
          'dark-muted': '#9CA3AF',
        },

        // Border
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          light: 'rgba(0, 0, 0, 0.05)',
          medium: 'rgba(0, 0, 0, 0.15)',
          dark: 'rgba(148, 163, 184, 0.24)',
        },

        // Utilities
        card: '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: {
          green: '#10B981',
          orange: '#F59E0B',
          pink: '#FF8FA3',           // nath-pink
          blue: '#4285F4',           // nath-blue
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      borderRadius: {
        'bubble': '16px',
        'chip': '20px',
      },
    },
  },
  plugins: [],
}

