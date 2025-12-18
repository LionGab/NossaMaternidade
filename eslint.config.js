// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/*",
      "index.ts",
      "rootStore.example.ts",
      "nativewind-env.d.ts",
      "patches/*",
      "bun.lock",
      "eslint.config.js",
    ],
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    plugins: {
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    rules: {
      // Ignore native modules that ESLint resolver can't find
      "import/no-unresolved": [
        "error",
        {
          ignore: [
            "expo-local-authentication",
            "@sentry/react-native",
            "react-native-purchases",
            "react-native-purchases-ui",
          ],
        },
      ],
      // Formatting nits the sorter doesn't fix
      "comma-spacing": ["warn", { before: false, after: true }],
      // React recommended rules (only those not already covered by expo config)
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off", // React 17+ JSX transform
      "react/react-in-jsx-scope": "off",

      // Enforce React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Project-specific rules
      // Bloquear console.log - usar logger centralizado
      "no-console": ["error", { allow: ["warn", "error"] }],
      // Bloquear alert/confirm - usar modais customizados
      "no-alert": "error",
      // TypeScript rules - use tsconfig.json "strict" mode instead
      // @typescript-eslint rules removed (plugin conflict with expo flat config)
    },
  },
]);
