# PROMPT DE MIGRAÇÃO: PWA React → React Native/Expo

## ATUAÇÃO
Atue como um **Engenheiro Sênior Mobile** especialista em React Native, Expo SDK 54+, TypeScript e arquitetura de aplicativos nativos. Seu objetivo é migrar completamente uma PWA React (Vite + Tailwind) para um aplicativo nativo iOS/Android usando Expo Go.

## CONTEXTO DO PROJETO ORIGINAL
Tenho uma aplicação web completa (PWA) construída com:
- **Framework:** React 18 + Vite
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Navegação:** React Router (estado manual com `view === 'LOGIN'`)
- **IA:** Google Gemini API (@google/genai)
- **Armazenamento:** localStorage (síncrono)
- **Áudio:** window.AudioContext (navegador)
- **Design:** Mobile-first, mas implementado para web

**Estrutura de arquivos original:**
```
/
├── App.tsx (gerencia view state manualmente)
├── pages/
│   ├── Splash.tsx
│   ├── Login.tsx
│   ├── Onboarding.tsx (9 steps em um arquivo)
│   ├── Home.tsx
│   ├── Chat.tsx
│   ├── Feed.tsx
│   ├── Community.tsx
│   ├── Habits.tsx
│   ├── Ritual.tsx
│   └── Diary.tsx
├── components/
│   ├── UI.tsx (Button, Input)
│   └── Navigation.tsx (BottomNavigation)
├── services/
│   └── geminiService.ts
├── types.ts
└── constants.ts
```

## STACK TECNOLÓGICA ALVO (REACT NATIVE)

### Dependências Core
- `expo@~54.0.25`
- `react@19.1.0`
- `react-native@0.81.5`
- `typescript@~5.9.2`

### UI e Estilização
- `nativewind@^4.2.1` (Tailwind para React Native)
- `react-native-safe-area-context@~5.6.0` (SafeAreaView)
- `expo-linear-gradient@^15.0.7` (gradientes)

### Navegação
- `@react-navigation/native@^7.1.21`
- `@react-navigation/native-stack@^7.6.4`
- `@react-navigation/bottom-tabs@^7.8.6`
- `react-native-screens@~4.16.0`
- `react-native-gesture-handler@~2.28.0`

### Ícones e Assets
- `lucide-react-native@^0.554.0`
- `react-native-svg@15.12.1`
- `expo-image@~1.14.0` (recomendado para performance)

### Armazenamento e Estado
- `@react-native-async-storage/async-storage@^2.2.0`
- `expo-secure-store@~15.0.7` (para dados sensíveis)

### Áudio e Mídia
- `expo-av@~15.0.1` (reprodução de áudio)
- `expo-file-system@^19.0.19` (manipulação de arquivos)

### IA e APIs
- `@google/generative-ai@^0.24.1`
- `expo-constants@^18.0.10` (variáveis de ambiente)

### Performance
- `@shopify/flash-list@^2.0.2` (listas performáticas)
- `react-native-reanimated@~4.1.1` (animações)

### Utilitários
- `expo-haptics@~15.0.7` (feedback háptico)
- `expo-splash-screen@~31.0.11`

## REGRAS ESTRITAS DE MIGRAÇÃO

### 1. TRADUÇÃO DE COMPONENTES HTML → REACT NATIVE

#### Tags Básicas
```typescript
// ❌ Web
<div className="..."> → ✅ Native
<View className="...">

// ❌ Web
<h1>, <h2>, <p>, <span> → ✅ Native
<Text className="...">

// ❌ Web
<button onClick={...}> → ✅ Native
<TouchableOpacity onPress={...} activeOpacity={0.7}>

// ❌ Web
<img src="..." /> → ✅ Native
<Image source={{ uri: "..." }} className="..." resizeMode="cover" />

// ❌ Web
<input onChange={...} /> → ✅ Native
<TextInput onChangeText={...} />

// ❌ Web
<textarea> → ✅ Native
<TextInput multiline numberOfLines={10} />
```

#### Containers e Layout
```typescript
// ❌ Web
<div className="min-h-screen"> → ✅ Native
<SafeAreaView className="flex-1" edges={['top', 'bottom']}>

// ❌ Web
<div className="overflow-y-auto"> → ✅ Native
<ScrollView showsVerticalScrollIndicator={false}>

// ❌ Web
posts.map(...) → ✅ Native (para listas longas)
<FlashList data={posts} renderItem={...} estimatedItemSize={200} />
```

### 2. ESTILIZAÇÃO COM NATIVEWIND

#### Classes que DEVEM ser removidas
- `min-h-screen` → use `flex-1`
- `cursor-pointer` → não existe em mobile
- `hover:` → não existe em mobile
- `active:` → use `activeOpacity` no TouchableOpacity
- `backdrop-blur` → use `expo-blur` se necessário

#### Classes que FUNCIONAM
- Todas as classes de espaçamento (`p-4`, `m-2`, `gap-3`)
- Classes de cores (`bg-nath-blue`, `text-white`)
- Classes de flexbox (`flex`, `flex-row`, `items-center`)
- Classes de border radius (`rounded-xl`, `rounded-full`)
- Classes de font (`font-bold`, `text-sm`)

#### SafeArea e Notch
```typescript
// SEMPRE use SafeAreaView nas telas principais
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1" style={{ backgroundColor: '#020617' }}>
  {/* conteúdo */}
</SafeAreaView>
```

### 3. NAVEGAÇÃO (REFATORAÇÃO CRÍTICA)

#### ❌ PROBLEMA ATUAL
O `App.tsx` usa estado manual:
```typescript
const [view, setView] = useState<ViewState>('SPLASH');
// ...
{view === 'LOGIN' && <Login />}
```

**Por que isso é ruim em mobile:**
- Botão "voltar" do Android não funciona
- Gestos de swipe back (iOS) não funcionam
- Histórico de navegação não existe
- Deep linking impossível

#### ✅ SOLUÇÃO OBRIGATÓRIA
Criar estrutura de navegação com React Navigation:

```typescript
// Estrutura esperada:
RootNavigator
├── AuthStack (Stack Navigator)
│   ├── Splash
│   ├── Login
│   └── Onboarding (9 steps)
└── AppStack (Stack Navigator)
    ├── MainTabs (Bottom Tab Navigator)
    │   ├── Home
    │   ├── Community
    │   ├── Chat (botão central destacado)
    │   ├── Feed (Mundo Nath)
    │   └── Habits
    └── Modals (Group)
        ├── Ritual (modal)
        └── Diary (modal)
```

**Regras de navegação:**
- Onboarding deve ser um Stack Navigator com 9 telas
- Chat deve ter botão "voltar" que funciona nativamente
- Ritual e Diary devem abrir como modais (presentation: 'modal')
- Bottom Tabs devem ter o Chat destacado no centro (como no original)

### 4. ARMAZENAMENTO LOCAL (AsyncStorage)

#### ❌ PROBLEMA ATUAL
```typescript
// Síncrono - não funciona no React Native
const saved = localStorage.getItem('nath_user');
const user = JSON.parse(saved);
```

#### ✅ SOLUÇÃO
```typescript
// Assíncrono - obrigatório no React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar wrapper em src/services/storage.ts
export const storageService = {
  async getUser(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem('nath_user');
    return data ? JSON.parse(data) : null;
  },
  
  async saveUser(user: UserProfile): Promise<void> {
    await AsyncStorage.setItem('nath_user', JSON.stringify(user));
  },
  
  // ... outros métodos
};
```

**Impacto nos componentes:**
- Estados iniciais não podem usar localStorage diretamente
- Use `useEffect` para carregar dados após o mount
- Mostre loading state enquanto carrega

### 5. ÁUDIO (O DESAFIO MAIOR)

#### ❌ PROBLEMA ATUAL
O código usa `window.AudioContext` e `decodeAudioData`:
```typescript
// Isso NÃO EXISTE no React Native
const audioContext = new window.AudioContext();
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
```

#### ✅ SOLUÇÃO PARA MOBILE
O Gemini retorna áudio em base64. No mobile:

1. **Salvar base64 como arquivo temporário:**
```typescript
import * as FileSystem from 'expo-file-system';

const base64Audio = response.audio; // do Gemini
const uri = `${FileSystem.cacheDirectory}audio_${Date.now()}.wav`;
await FileSystem.writeAsStringAsync(uri, base64Audio, {
  encoding: FileSystem.EncodingType.Base64,
});
```

2. **Tocar com expo-av:**
```typescript
import { Audio } from 'expo-av';

const { sound } = await Audio.Sound.createAsync({ uri });
await sound.playAsync();
```

**Criar componente `AudioPlayer.tsx`** que abstraia essa lógica.

### 6. GEMINI SERVICE

#### Ajustes Necessários
```typescript
// ❌ Web
const apiKey = process.env.API_KEY;

// ✅ React Native
import Constants from 'expo-constants';
const apiKey = Constants.expoConfig?.extra?.geminiApiKey 
  || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
```

**Configurar em `app.json`:**
```json
{
  "expo": {
    "extra": {
      "geminiApiKey": "sua_chave_aqui"
    }
  }
}
```

### 7. PERFORMANCE DE LISTAS

#### ❌ PROBLEMA
```typescript
// Em Feed.tsx e Community.tsx
{posts.map(post => <PostCard key={post.id} {...post} />)}
```

**Se a lista tiver 50+ itens, o app vai travar.**

#### ✅ SOLUÇÃO OBRIGATÓRIA
```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={posts}
  renderItem={({ item }) => <PostCard {...item} />}
  estimatedItemSize={200}
  keyExtractor={(item) => item.id}
/>
```

### 8. KEYBOARD AVOIDING VIEW

#### OBRIGATÓRIO em telas com input:
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  className="flex-1"
>
  <ScrollView>
    {/* mensagens */}
  </ScrollView>
  <View>
    <TextInput />
  </View>
</KeyboardAvoidingView>
```

### 9. HAPTIC FEEDBACK

#### Substituir navigator.vibrate:
```typescript
// ❌ Web
navigator.vibrate(10);

// ✅ React Native
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

### 10. TEMA (DARK MODE)

#### ❌ PROBLEMA ATUAL
```typescript
// Web
document.documentElement.classList.add('dark');
```

#### ✅ SOLUÇÃO
```typescript
// Criar ThemeContext
import { useColorScheme } from 'react-native';
// ou usar nativewind que detecta automaticamente

// NativeWind já suporta dark: automaticamente
<View className="bg-white dark:bg-nath-dark-card" />
```

## ARQUIVOS QUE DEVEM SER GERADOS

### 1. Configuração Base
- `package.json` (dependências)
- `app.json` (config Expo)
- `tailwind.config.js` (NativeWind)
- `babel.config.js` (com plugin nativewind)
- `tsconfig.json` (TypeScript)

### 2. Navegação
- `src/navigation/types.ts` (tipos de navegação)
- `src/navigation/AppNavigator.tsx` (Root Navigator)
- `src/navigation/AuthStack.tsx` (Splash, Login, Onboarding)
- `src/navigation/AppStack.tsx` (Tabs + Modais)
- `src/navigation/TabNavigator.tsx` (Bottom Tabs)

### 3. Serviços
- `src/services/storage.ts` (wrapper AsyncStorage)
- `src/services/geminiService.ts` (adaptado)
- `src/services/audioService.ts` (novo - para expo-av)

### 4. Componentes
- `src/components/Button.tsx` (TouchableOpacity)
- `src/components/Input.tsx` (TextInput)
- `src/components/AudioPlayer.tsx` (novo)
- `src/components/BottomNavigation.tsx` (adaptado)

### 5. Telas (Pages → Screens)
- `src/screens/SplashScreen.tsx`
- `src/screens/LoginScreen.tsx`
- `src/screens/Onboarding/OnboardingFlow.tsx` (container)
- `src/screens/Onboarding/OnboardingStep1.tsx` até `OnboardingStep9.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/ChatScreen.tsx` (com KeyboardAvoidingView)
- `src/screens/FeedScreen.tsx` (com FlashList)
- `src/screens/CommunityScreen.tsx` (com FlashList)
- `src/screens/HabitsScreen.tsx`
- `src/screens/RitualScreen.tsx`
- `src/screens/DiaryScreen.tsx`

### 6. Tipos e Constantes
- `src/types/user.ts` (reutilizar do original)
- `src/types/chat.ts` (adaptar se necessário)
- `src/constants/data.ts` (reutilizar)

### 7. Contextos
- `src/context/AuthContext.tsx` (gerenciar usuário)
- `src/context/ThemeContext.tsx` (gerenciar tema)

### 8. App Principal
- `App.tsx` (entry point com NavigationContainer)

## CHECKLIST DE QUALIDADE

Antes de considerar a migração completa, verifique:

- [ ] Todas as telas usam `SafeAreaView`
- [ ] Listas longas usam `FlashList` ou `FlatList`
- [ ] Todas as chamadas de storage são assíncronas
- [ ] Navegação usa React Navigation (não estado manual)
- [ ] Telas com input usam `KeyboardAvoidingView`
- [ ] Imagens remotas usam `expo-image` ou têm `width/height`
- [ ] Áudio usa `expo-av` (não AudioContext)
- [ ] Haptic feedback usa `expo-haptics`
- [ ] Variáveis de ambiente usam `EXPO_PUBLIC_` prefix
- [ ] Onboarding tem 9 steps separados (não tudo em um arquivo)
- [ ] Bottom Tabs têm Chat destacado no centro
- [ ] Modais Ritual e Diary abrem por cima (presentation: 'modal')
- [ ] Loading states enquanto carrega dados do AsyncStorage
- [ ] Tratamento de erros em todas as operações async

## EXEMPLOS DE CÓDIGO ESPERADOS

### Exemplo 1: HomeScreen.tsx
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#020617' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* conteúdo */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Exemplo 2: ChatScreen.tsx
```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <FlashList data={messages} renderItem={...} />
        <View>
          <TextInput />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

## INSTRUÇÕES FINAIS

1. **Gere código COMPLETO** - sem `// ...` ou placeholders
2. **Mantenha a estrutura de pastas** similar ao original
3. **Preserve a lógica de negócio** - apenas adapte a camada de UI
4. **Use TypeScript** com tipos explícitos
5. **Siga as convenções** do projeto original (nomes, padrões)
6. **Teste mentalmente** cada conversão antes de gerar

## COMEÇAR POR

1. Primeiro: `package.json` e configurações base
2. Segundo: `src/services/storage.ts` e `src/navigation/AppNavigator.tsx`
3. Terceiro: Componentes base (`Button`, `Input`)
4. Quarto: Telas principais (`Home`, `Chat`)
5. Quinto: Restante das telas

---

**IMPORTANTE:** Este é um projeto real em produção. O código gerado deve ser funcional, performático e seguir as melhores práticas do React Native/Expo.

