/**
 * Expo App Configuration
 * Processa variáveis de ambiente do .env e injeta no app.json
 */

require('dotenv').config();

module.exports = {
  expo: {
    name: 'Nossa Maternidade',
    slug: 'nossa-maternidade',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic', // Segue preferência do sistema (iOS/Android)
    scheme: 'nossamaternidade',
    owner: 'liongab',
    primaryColor: '#FF7A96',
    backgroundColor: '#FFFFFF',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#FF7A96',
    },
    updates: {
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 30000,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.nossamaternidade.app',
      buildNumber: '1',
      icon: './assets/icon.png',
      requireFullScreen: false,
      infoPlist: {
        NSMicrophoneUsageDescription:
          'Precisamos acessar o microfone para você poder gravar mensagens de áudio para a IA e participar de videochamadas.',
        NSCameraUsageDescription:
          'Precisamos acessar a câmera para você tirar fotos e compartilhar momentos especiais.',
        NSPhotoLibraryUsageDescription:
          'Precisamos acessar suas fotos para você poder compartilhar com a comunidade.',
        NSPhotoLibraryAddUsageDescription:
          'Precisamos de permissão para salvar fotos na sua galeria.',
        NSLocationWhenInUseUsageDescription:
          'Precisamos da sua localização para conectar você com mães próximas.',
        NSUserTrackingUsageDescription:
          'Precisamos de sua permissão para personalizar sua experiência e melhorar o conteúdo oferecido.',
        CFBundleDisplayName: 'Nossa Maternidade',
        NSPrivacyPolicyURL: 'https://nossamaternidade.com.br/privacidade',
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ['fetch', 'remote-notification'],
        UIStatusBarStyle: 'UIStatusBarStyleDefault',
      },
      config: {
        usesNonExemptEncryption: false,
      },
      // Privacy Manifest (iOS 17+)
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1'], // App Functionality
          },
        ],
      },
    },
    android: {
      package: 'com.nossamaternidade.app',
      versionCode: 1,
      targetSdkVersion: 34, // Android 14
      compileSdkVersion: 34,
      icon: './assets/icon.png',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FF7A96',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.VIBRATE',
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
      ],
      splash: {
        backgroundColor: '#FF7A96',
        resizeMode: 'cover',
        image: './assets/splash.png',
      },
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'nossamaternidade.com.br',
              pathPrefix: '/',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    notification: {
      icon: './assets/notification-icon.png',
      color: '#FF7A96',
      iosDisplayInForeground: true,
      androidMode: 'default',
    },
    extra: {
      // Variáveis de ambiente públicas (EXPO_PUBLIC_*)
      // Estas são automaticamente expostas via process.env no app
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
      supabaseFunctionsUrl:
        process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL || '',
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
      stripePublishableKey:
        process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      oneSignalAppId: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || '',
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
      // Feature flags
      enableAIFeatures:
        process.env.EXPO_PUBLIC_ENABLE_AI_FEATURES === 'true' || false,
      enableGamification:
        process.env.EXPO_PUBLIC_ENABLE_GAMIFICATION === 'true' || false,
      enableAnalytics:
        process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true' || false,
      // EAS Project ID
      eas: {
        projectId: 'ceee9479-e404-47b8-bc37-4f913c18f270',
      },
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8080',
      // URLs obrigatórias para stores
      privacyPolicyUrl: 'https://nossamaternidade.com.br/privacidade',
      termsOfServiceUrl: 'https://nossamaternidade.com.br/termos',
      supportEmail: 'suporte@nossamaternidade.com.br',
    },
    plugins: [
      'expo-secure-store',
      'expo-font',
      'expo-localization',
      'expo-tracking-transparency',
      '@sentry/react-native/expo',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#FF7A96',
          sounds: [],
        },
      ],
    ],
  },
};

