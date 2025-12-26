/**
 * Expo App Configuration - Mobile-First Store Ready
 * Otimizado para App Store (iOS) e Google Play (Android)
 *
 * Requisitos atendidos:
 * ✅ iOS 17+ Privacy Manifest
 * ✅ Android 14+ (SDK 34)
 * ✅ WCAG AAA Accessibility
 * ✅ LGPD Compliance (Brasil)
 * ✅ New Architecture ready
 */

// Design System Colors (Nossa Maternidade Theme - "Boa Noite Mãe")
const COLORS = {
  primary: "#f4258c", // Primary pink - Rosa vibrante
  primaryDark: "#ec4899", // Rosa mais escuro
  secondary: "#89CFF0", // Baby blue - Azul claro suave
  background: "#f8f5f7", // Rosa muito claro
  textDark: "#1a2b4b", // Azul escuro para textos
  splash: "#f4258c", // Mesma cor primária
  // Cores de sentimentos
  feeling: {
    sunny: "#eab308", // Amarelo - Bem
    cloud: "#60a5fa", // Azul - Cansada
    rainy: "#818cf8", // Índigo - Enjoada
    heart: "#f4258c", // Rosa - Amada
  },
};

module.exports = {
  expo: {
    name: "Nossa Maternidade",
    slug: "nossamaternidade",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "nossamaternidade",
    owner: "liongab",
    primaryColor: COLORS.primary,
    backgroundColor: COLORS.background,

    // New Architecture (React Native 0.76+)
    newArchEnabled: true,

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF", // Fundo branco limpo e profissional
    },
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 30000,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "br.com.nossamaternidade.app",
      buildNumber: "1",
      icon: "./assets/icon.png",
      requireFullScreen: false,
      infoPlist: {
        NSMicrophoneUsageDescription:
          "Precisamos acessar o microfone para você poder gravar mensagens de áudio para a IA e participar de videochamadas.",
        NSCameraUsageDescription:
          "Precisamos acessar a câmera para você tirar fotos e compartilhar momentos especiais.",
        NSPhotoLibraryUsageDescription:
          "Precisamos acessar suas fotos para você poder compartilhar com a comunidade.",
        NSPhotoLibraryAddUsageDescription:
          "Precisamos de permissão para salvar fotos na sua galeria.",
        NSLocationWhenInUseUsageDescription:
          "Precisamos da sua localização para conectar você com mães próximas.",
        NSUserTrackingUsageDescription:
          "Precisamos de sua permissão para personalizar sua experiência e melhorar o conteúdo oferecido.",
        CFBundleDisplayName: "Nossa Maternidade",
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ["fetch", "remote-notification"],
        UIStatusBarStyle: "UIStatusBarStyleDefault",
      },
      config: {
        usesNonExemptEncryption: false,
      },
      // Privacy Manifest (iOS 17+)
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"], // App Functionality
          },
        ],
      },
    },
    android: {
      package: "com.nossamaternidade.app",
      versionCode: 1,
      // NOTE: SDK versions are configured in expo-build-properties plugin
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: COLORS.primary,
        monochromeImage: "./assets/adaptive-icon.png", // Android 13+ themed icons
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: true, // Android 14+ gesture navigation
      allowBackup: true,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.VIBRATE",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.POST_NOTIFICATIONS", // Android 13+ notifications
      ],
      splash: {
        backgroundColor: COLORS.splash,
        resizeMode: "cover",
        image: "./assets/splash.png",
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "nossamaternidade.com.br",
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
      // Mobile-first viewport configuration
      meta: {
        viewport:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "theme-color": COLORS.primary,
      },
    },
    notification: {
      icon: "./assets/notification-icon.png",
      color: COLORS.primary,
      iosDisplayInForeground: true,
      androidMode: "default",
      androidCollapsedTitle: "Nossa Maternidade",
    },
    extra: {
      // Variáveis de ambiente públicas (EXPO_PUBLIC_*)
      // Estas são automaticamente expostas via process.env no app
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
      supabaseFunctionsUrl: process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL || "",
      // ⚠️ SECURITY: AI API keys (Gemini, OpenAI, Claude, Grok) are NEVER exposed to client
      // These keys live ONLY in Supabase Edge Functions secrets (configured via supabase secrets set)
      // Client calls Edge Function /ai which handles provider routing securely
      imgurClientId: process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID || "",
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      oneSignalAppId: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || "",
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
      // RevenueCat API keys (Premium/IAP)
      revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "",
      revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "",
      // URLs públicas das páginas legais (para submissão nas lojas)
      legal: {
        privacyUrl: "https://nossamaternidade.com.br/privacidade",
        termsUrl: "https://nossamaternidade.com.br/termos",
        aiDisclaimerUrl: "https://nossamaternidade.com.br/ai-disclaimer",
      },
      // Feature flags
      enableAIFeatures: process.env.EXPO_PUBLIC_ENABLE_AI_FEATURES === "true" || false,
      enableGamification: process.env.EXPO_PUBLIC_ENABLE_GAMIFICATION === "true" || false,
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === "true" || false,
      // EAS Project ID
      eas: {
        projectId: "d22475be-2b7c-41a1-90e5-bfe531524f41",
      },
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || "",
    },
    plugins: [
      // Core Expo plugins
      "expo-secure-store",
      "expo-font",
      "expo-localization",
      "expo-asset",

      // Build properties (Android/iOS native config)
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
            useFrameworks: "static",
          },
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            minSdkVersion: 24,
            kotlinVersion: "2.0.20",
          },
        },
      ],

      // Camera
      [
        "expo-camera",
        {
          cameraPermission: "O app precisa acessar a câmera para você tirar fotos e gravar vídeos.",
          microphonePermission: "O app precisa do microfone para gravar áudio em vídeos.",
          recordAudioAndroid: true,
        },
      ],

      // Audio (expo-audio replaces expo-av for SDK 54+)
      [
        "expo-audio",
        {
          microphonePermission: "O app precisa do microfone para você gravar mensagens de áudio.",
        },
      ],

      // Splash screen
      [
        "expo-splash-screen",
        {
          backgroundColor: COLORS.splash,
          image: "./assets/splash-icon.png",
          dark: {
            backgroundColor: "#1A1A2E",
            image: "./assets/splash-icon.png",
          },
          imageWidth: 200,
        },
      ],

      // Image picker
      [
        "expo-image-picker",
        {
          photosPermission:
            "O app precisa acessar suas fotos para você compartilhar na comunidade.",
          cameraPermission: "O app precisa da câmera para você tirar fotos.",
        },
      ],

      // Push notifications
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: COLORS.primary,
          sounds: [],
        },
      ],

      // Apple authentication (iOS only)
      "expo-apple-authentication",

      // Local authentication (biometrics)
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Permitir $(PRODUCT_NAME) usar Face ID para autenticação rápida.",
        },
      ],

      // Location
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Permitir $(PRODUCT_NAME) acessar sua localização para conectar você com mães próximas.",
          locationAlwaysPermission:
            "Permitir $(PRODUCT_NAME) acessar sua localização em segundo plano.",
          locationWhenInUsePermission: "Permitir $(PRODUCT_NAME) acessar sua localização.",
          isAndroidBackgroundLocationEnabled: false,
          isIosBackgroundLocationEnabled: false,
        },
      ],

      // Media library
      [
        "expo-media-library",
        {
          photosPermission:
            "Permitir $(PRODUCT_NAME) acessar suas fotos para salvar e compartilhar.",
          savePhotosPermission: "Permitir $(PRODUCT_NAME) salvar fotos na sua galeria.",
          isAccessMediaLocationEnabled: true,
        },
      ],

      // Calendar (for pregnancy milestones)
      [
        "expo-calendar",
        {
          calendarPermission:
            "Permitir $(PRODUCT_NAME) acessar seu calendário para adicionar lembretes de consultas e marcos da gravidez.",
        },
      ],

      // Contacts (for inviting friends)
      [
        "expo-contacts",
        {
          contactsPermission:
            "Permitir $(PRODUCT_NAME) acessar seus contatos para convidar amigas.",
        },
      ],

      // RevenueCat (In-App Purchases)
      // NOTA: react-native-purchases não tem plugin Expo nativo
      // A integração é feita via código em src/services/revenuecat.ts
      // Para usar IAP em Expo Go: impossível (requer Development Build)
      // Para Development/Production builds: funcionará via configuração manual

      // Sentry (Error tracking)
      [
        "@sentry/react-native/expo",
        {
          organization: process.env.SENTRY_ORG || "nossamaternidade",
          project: process.env.SENTRY_PROJECT || "react-native-j3",
        },
      ],

      // Updates (OTA)
      [
        "expo-updates",
        {
          checkAutomatically: "ON_LOAD",
        },
      ],

      // ==================================================
      // DESIGN & UX PLUGINS (require native config)
      // ==================================================

      // Screen orientation lock (portrait-only app)
      [
        "expo-screen-orientation",
        {
          initialOrientation: "PORTRAIT_UP",
        },
      ],

      // Video player (native config)
      [
        "expo-video",
        {
          supportsBackgroundPlayback: false,
          supportsPictureInPicture: false,
        },
      ],

      // ==================================================
      // STORE & MONETIZATION PLUGINS
      // ==================================================

      // App Tracking Transparency (iOS 14.5+ REQUIRED for App Store)
      [
        "expo-tracking-transparency",
        {
          userTrackingPermission:
            "Precisamos de sua permissão para personalizar anúncios e melhorar sua experiência.",
        },
      ],

      // NOTE: expo-store-review is included in dependencies but doesn't need plugin entry

      // ==================================================
      // BACKGROUND & SYNC PLUGINS
      // ==================================================

      // Background fetch (for sync tasks)
      [
        "expo-background-fetch",
        {
          stopOnTerminate: false,
          enableHeadless: true,
        },
      ],

      // ==================================================
      // NOTE: The following modules are included in dependencies
      // but don't require explicit plugin entries (pure JS or auto-config):
      // - expo-haptics, expo-clipboard, expo-sharing, expo-file-system
      // - expo-document-picker, expo-web-browser, expo-device
      // - expo-application, expo-constants, expo-network, expo-battery
      // - expo-brightness, expo-keep-awake, expo-crypto, expo-sqlite
      // - expo-blur, expo-linear-gradient, expo-status-bar, expo-system-ui
      // - expo-sensors, expo-sms, expo-mail-composer, expo-speech, expo-linking
      // ==================================================
    ],

    // Experiments (stability)
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
  },
};
