# Prompt de Setup Inicial - Nossa Maternidade Mobile

## 🎯 Objetivo

Configurar completamente o projeto React Native/Expo para migração do app "Nossa Maternidade" de PWA para mobile nativo.

---

## 📋 Checklist de Setup

### Fase 1: Dependências Essenciais ✅ (Parcial)

- [x] Expo SDK ~54.0
- [x] React Native 0.81.5
- [x] TypeScript
- [x] AsyncStorage
- [x] Gemini AI service
- [ ] **React Navigation** (navegação)
- [ ] **NativeWind** ou **styled-components** (estilização)
- [ ] **React Native Reanimated** (animações)
- [ ] **React Native Gesture Handler** (gestos)
- [ ] **React Native Haptics** (feedback tátil)
- [ ] **@supabase/supabase-js** (backend)
- [ ] **expo-notifications** (push)
- [ ] **expo-haptics** (vibração)

### Fase 2: Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Loading.tsx
├── screens/            # Telas do app
│   ├── ChatScreen.tsx  ✅
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   └── ...
├── navigation/         # Configuração de rotas
│   ├── index.tsx
│   └── types.ts
├── services/           # Serviços externos
│   ├── geminiService.ts ✅
│   ├── supabase.ts
│   └── notifications.ts
├── context/            # Context API
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── AppContext.tsx
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useStorage.ts
├── types/              # TypeScript types
│   ├── chat.ts ✅
│   ├── user.ts
│   └── navigation.ts
├── utils/              # Utilitários
│   ├── storage.ts ✅
│   ├── validation.ts
│   └── formatting.ts
├── constants/          # Constantes
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
└── assets/             # Recursos estáticos
    ├── images/
    ├── fonts/
    └── icons/
```

### Fase 3: Configurações

#### TypeScript (`tsconfig.json`)
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@screens/*": ["./src/screens/*"],
      "@services/*": ["./src/services/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

#### NativeWind (`tailwind.config.js`)
```js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4',
        secondary: '#FFE0F0',
        // ... outras cores
      }
    }
  }
}
```

#### App Config (`app.json`)
```json
{
  "expo": {
    "name": "Nossa Maternidade",
    "slug": "nossa-maternidade-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFE0F0"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.nossamaternidade.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFE0F0"
      },
      "package": "com.nossamaternidade.app",
      "edgeToEdgeEnabled": true
    },
    "plugins": [
      "expo-router",
      "expo-notifications"
    ],
    "extra": {
      "geminiApiKey": "",
      "supabaseUrl": "",
      "supabaseAnonKey": ""
    }
  }
}
```

### Fase 4: Componentes Base

#### Button Component
- Variantes: primary, secondary, outline, ghost
- Tamanhos: sm, md, lg
- Estados: loading, disabled
- Feedback háptico opcional

#### Input Component
- Label opcional
- Error state
- Icon support
- Mask support (telefone, CPF, etc)

#### Card Component
- Header, body, footer opcionais
- Shadow/elevation
- Pressable opcional

### Fase 5: Navegação

#### Stack Navigator
- Splash → Auth → Onboarding → Home
- Home → Chat, Feed, Community, Habits, Ritual, Diary

#### Tab Navigator (Home)
- Chat, Feed, Community, Habits, Profile

### Fase 6: Integrações

#### Supabase
- Auth: email/password, OAuth (Google, Apple)
- Database: PostgreSQL
- Storage: imagens de perfil, diário
- Realtime: chat em tempo real (futuro)

#### Notificações
- Push notifications configurado
- Deep linking para telas específicas

---

## 🚀 Comandos de Setup

### 1. Instalar Dependências

```bash
# Navegação
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# Dependências do React Navigation
npx expo install react-native-screens react-native-safe-area-context

# Estilização (escolher uma opção)
# Opção A: NativeWind
npm install nativewind
npm install --save-dev tailwindcss

# Opção B: styled-components
npm install styled-components
npm install --save-dev @types/styled-components-react-native

# Animações
npx expo install react-native-reanimated react-native-gesture-handler

# Haptics
npx expo install expo-haptics

# Supabase
npm install @supabase/supabase-js

# Notificações
npx expo install expo-notifications

# Utilitários
npx expo install expo-linking expo-constants
```

### 2. Configurar NativeWind (se escolhido)

```bash
# Criar tailwind.config.js
npx tailwindcss init

# Atualizar babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

### 3. Configurar Reanimated

Adicionar no início do `App.tsx`:
```tsx
import 'react-native-reanimated';
```

### 4. Configurar Supabase

Criar `src/services/supabase.ts`:
```tsx
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 📝 Tarefas de Setup Automatizado

Execute em ordem:

1. **Instalar todas as dependências** (comandos acima)
2. **Criar estrutura de pastas** completa
3. **Configurar TypeScript paths** (tsconfig.json)
4. **Criar componentes base** (Button, Input, Card, Modal, Loading)
5. **Configurar React Navigation** (Stack + Tab navigators)
6. **Setup Supabase client** e Auth context
7. **Criar constants** (colors, spacing, typography)
8. **Configurar NativeWind** (se escolhido)
9. **Criar primeira screen funcional** (Splash ou Login)
10. **Commit inicial** com conventional commits

---

## ✅ Validação Final

Após setup, verificar:

- [ ] `npm start` roda sem erros
- [ ] TypeScript compila sem erros
- [ ] Navegação básica funciona
- [ ] Componentes base renderizam corretamente
- [ ] Supabase client inicializa
- [ ] AsyncStorage funciona
- [ ] Haptics funciona (testar em device físico)

---

## 🎯 Próximos Passos Após Setup

1. Implementar Splash Screen
2. Implementar Login/Auth com Supabase
3. Criar Onboarding (9 steps)
4. Migrar Chat Screen para usar novos componentes
5. Criar Home/Dashboard
6. Implementar outras screens

---

## 📚 Referências

- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [NativeWind](https://www.nativewind.dev)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

**Última atualização**: 2024-12-19

