# Instruções Completas de Migração - PWA Web → React Native/Expo

## 📦 1. Instalar Dependências

Execute o comando para instalar a dependência adicional necessária:

```bash
npm install @react-native-community/slider
```

Todas as outras dependências já estão no `package.json`.

## 🔧 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui
EXPO_PUBLIC_SUPABASE_URL=sua_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

## 📁 3. Estrutura de Arquivos Criados

### Navegação
- `src/navigation/types.ts` - Tipos atualizados
- `src/navigation/StackNavigator.tsx` - Stack com modais
- `src/navigation/TabNavigator.tsx` - Tabs atualizado

### Tipos
- `src/types/user.ts` - Tipos do usuário (UserStage, UserEmotion, etc.)

### Serviços
- `src/services/storage.ts` - Wrapper AsyncStorage
- `src/services/geminiService.ts` - Adicionado `analyzeDiaryEntry`

### Onboarding (9 Steps)
- `src/screens/Onboarding/OnboardingFlow.tsx`
- `src/screens/Onboarding/OnboardingStep1.tsx` até `OnboardingStep9.tsx`

### Telas
- `src/screens/HomeScreen.tsx` - Home completa
- `src/screens/DiaryScreen.tsx` - Diário emocional
- `src/screens/RitualScreen.tsx` - Ritual de respiração
- `src/screens/ChatScreen.tsx` - Já existia, mantido

## 🚀 4. Como Testar

1. **Iniciar o app:**
   ```bash
   npm start
   ```

2. **Testar no Expo Go:**
   - Escaneie o QR code com o app Expo Go
   - Ou pressione `i` para iOS simulator
   - Ou pressione `a` para Android emulator

3. **Fluxo de teste:**
   - Splash → Login → Onboarding (9 steps) → Home
   - Navegar pelas tabs (Home, Chat, Feed, Community, Habits)
   - Abrir modais (Ritual, Diary)
   - Testar chat com IA
   - Testar diário emocional

## 🔄 5. Principais Mudanças Implementadas

### HTML → React Native
- ✅ `<div>` → `<View>` / `<SafeAreaView>`
- ✅ `<button>` → `<TouchableOpacity>`
- ✅ `<img>` → `<Image source={{ uri: ... }} />`
- ✅ `<input>` → `<TextInput>` (com `onChangeText`)
- ✅ `<textarea>` → `<TextInput multiline>`

### localStorage → AsyncStorage
- ✅ Todas as chamadas são assíncronas (`await`)
- ✅ Wrapper `storage.ts` criado
- ✅ Métodos: `getUser()`, `saveUser()`, `getChatHistory()`, etc.

### Navegação
- ✅ Estado manual → React Navigation
- ✅ Stack Navigator com modais
- ✅ Bottom Tabs para navegação principal

### Estilização
- ✅ Tailwind CSS → NativeWind
- ✅ Classes web-only removidas
- ✅ Adaptado para mobile

## ⚠️ 6. Ajustes Necessários

1. **Imagens:** Verificar se todas as URLs de imagens estão acessíveis
2. **Supabase:** Configurar se necessário para waitlist
3. **Estilos:** Ajustar conforme necessário para diferentes tamanhos de tela
4. **Testes:** Testar em dispositivos reais iOS e Android

## 📝 7. Notas Importantes

- O `ChatScreen` já estava implementado e foi mantido
- O `HomeScreen` substitui o `MundoNathScreen` na tab Home
- Os modais `Ritual` e `Diary` são acessados via Stack Navigator
- O onboarding completo (9 steps) substitui o onboarding básico anterior
- Todas as telas usam NativeWind para estilização
- O tema dark/light está integrado via `ThemeContext`

## ✅ Checklist Final

- [x] Dependências instaladas
- [x] Navegação configurada
- [x] Onboarding completo (9 steps)
- [x] Home Screen rica
- [x] Chat com KeyboardAvoidingView
- [x] Diary Screen
- [x] Ritual Screen
- [x] Storage wrapper (AsyncStorage)
- [x] Gemini Service adaptado
- [x] Tipos completos
- [x] Documentação criada

