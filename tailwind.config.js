/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    space: false,
  },
  theme: {
    // NOTE to AI: You can extend the theme with custom colors or styles here.
    extend: {
      colors: {
        // Nossa Maternidade Premium - Sistema de cores 2025
        // Primary Rose - Rosa vibrante principal
        primary: {
          DEFAULT: "#f4258c", // Primary rose
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#f4258c", // Main primary
          600: "#DB1F7D",
          700: "#B8196A",
          800: "#961456",
          900: "#7A1047",
        },
        // Secondary Purple - Roxo vibrante
        secondary: {
          DEFAULT: "#A855F7", // Purple
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7", // Main secondary
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6B21A8",
          900: "#581C87",
        },
        // Rose (alinhado com primary)
        rose: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#f4258c",
          600: "#DB1F7D",
          700: "#B8196A",
          800: "#961456",
          900: "#7A1047",
        },
        blush: {
          50: "#FDF8F6",
          100: "#FAF0ED",
          200: "#F5E1DB",
          300: "#EFD0C7",
          400: "#E8B4A5",
          500: "#D4A394",
          600: "#BC8B7B",
          700: "#9E7269",
          800: "#7A584F",
          900: "#5C4238",
        },
        cream: {
          50: "#f8f5f7",
          100: "#FFF9F3",
          200: "#FFF3E8",
          300: "#FFEBD9",
          400: "#FFE0C7",
          500: "#FFD4B0",
          600: "#E8B88C",
          700: "#C9956A",
          800: "#A67548",
          900: "#7D5632",
        },
        sage: {
          50: "#F6FAF7",
          100: "#ECF5EE",
          200: "#D5E8D9",
          300: "#B8D9BF",
          400: "#8FC49A",
          500: "#6BAD78",
          600: "#4F9260",
          700: "#3F7550",
          800: "#345E42",
          900: "#2A4C36",
        },
        warmGray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        // Cores de sentimentos (Daily Feelings)
        feeling: {
          sunny: {
            DEFAULT: "#F59E0B", // Amarelo - Ótima
            light: "#FEF3C7",
          },
          cloud: {
            DEFAULT: "#60A5FA", // Azul - Bem
            light: "#DBEAFE",
          },
          rainy: {
            DEFAULT: "#A855F7", // Purple - Cansada
            light: "#F3E8FF",
          },
          heart: {
            DEFAULT: "#f4258c", // Rose - Ansiosa
            light: "#FFE4E6",
          },
        },
        // Text colors
        text: {
          dark: "#1a2b4b", // Azul escuro para textos principais
          DEFAULT: "#1a2b4b",
          light: "#64748b",
          muted: "#94a3b8",
        },
        // Background colors
        background: {
          DEFAULT: "#f8f5f7", // Creme suave
          primary: "#f8f5f7",
          secondary: "#F8F5F7",
          tertiary: "#F5F5F4",
          elevated: "#FFFFFF",
        },
        // Neutral colors
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ["DMSans_400Regular"],
        medium: ["DMSans_500Medium"],
        semibold: ["DMSans_600SemiBold"],
        bold: ["DMSans_700Bold"],
        serif: ["DMSerifDisplay_400Regular"],
        serifItalic: ["DMSerifDisplay_400Regular_Italic"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm: ["13px", { lineHeight: "18px", letterSpacing: "0.01em" }],
        base: ["15px", { lineHeight: "22px", letterSpacing: "0" }],
        lg: ["17px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "5xl": ["48px", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "18": "72px",
        "22": "88px",
      },
    },
    // Dark mode colors
    dark: {
      colors: {
        primary: {
          DEFAULT: "#FF80B7",
          50: "#1A0A12",
          100: "#2D0F1A",
          200: "#4D1A2E",
          300: "#6D2542",
          400: "#8D3056",
          500: "#FF80B7",
          600: "#FF66A6",
          700: "#FF4D95",
          800: "#FF3384",
          900: "#FF1A73",
        },
        secondary: {
          DEFAULT: "#3397FF",
          50: "#0A1526",
          100: "#0F1F3D",
          200: "#1F3F7A",
          300: "#2F5FB7",
          400: "#3F7FF4",
          500: "#3397FF",
          600: "#66B1FF",
          700: "#99CBFF",
          800: "#CCE5FF",
          900: "#E6F2FF",
        },
        text: {
          dark: "#E2E8F0",
          DEFAULT: "#E2E8F0",
          light: "#A0AEC0",
          muted: "#718096",
        },
        background: {
          DEFAULT: "#0F0F0F",
          primary: "#0F0F0F",
          secondary: "#1A1A1A",
          tertiary: "#141414",
          elevated: "#1A1A1A",
        },
        neutral: {
          0: "#0F0F0F",
          50: "#1A1A1A",
          100: "#2D2D2D",
          200: "#3D3D3D",
          300: "#4D4D4D",
          400: "#6D6D6D",
          500: "#8D8D8D",
          600: "#ADADAD",
          700: "#CDCDCD",
          800: "#E2E2E2",
          900: "#FFFFFF",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      const spacing = theme("spacing");

      // space-{n}  ->  gap: {n}
      matchUtilities(
        { space: (value) => ({ gap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-x-{n}  ->  column-gap: {n}
      matchUtilities(
        { "space-x": (value) => ({ columnGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-y-{n}  ->  row-gap: {n}
      matchUtilities(
        { "space-y": (value) => ({ rowGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );
    }),
  ],
};
