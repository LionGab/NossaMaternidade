# Migração Completa: PWA Web → React Native/Expo

## 📦 Dependências Necessárias

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install nativewind tailwindcss
npm install @react-native-community/slider
npm install expo-linear-gradient
npm install @shopify/flash-list
npm install lucide-react-native react-native-svg
npm install @google/generative-ai
npm install expo-av expo-haptics
npm install expo-image
```

## 📁 Estrutura de Arquivos Criados

1. `App.tsx` - Configuração principal com NavigationContainer
2. `src/navigation/AuthStack.tsx` - Stack de autenticação (Splash, Login, Onboarding)
3. `src/navigation/AppStack.tsx` - Stack principal com Bottom Tabs
4. `src/components/UI.tsx` - Componentes Button e Input nativos
5. `src/screens/HomeScreen.tsx` - Tela Home completa
6. `src/screens/ChatScreen.tsx` - Chat com KeyboardAvoidingView
7. `src/screens/Onboarding/` - Onboarding completo (9 steps)
8. `src/screens/DiaryScreen.tsx` - Diário emocional
9. `src/screens/RitualScreen.tsx` - Ritual de respiração
10. `src/services/geminiService.ts` - Serviço adaptado para RN

## 🔄 Principais Mudanças

- HTML → React Native: `<div>` → `<View>`, `<button>` → `<TouchableOpacity>`, etc.
- localStorage → AsyncStorage (async/await)
- Tailwind CSS → NativeWind (classes adaptadas)
- window/document → Removido, usando APIs nativas do Expo
- Navegação manual → React Navigation (Stack + Bottom Tabs)

