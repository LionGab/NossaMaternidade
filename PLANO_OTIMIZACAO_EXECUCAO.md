# 🎯 Plano de Otimização - Execução Detalhada

## 📊 Estado Atual Identificado

### ✅ Já Implementado Corretamente
- ✅ React Navigation configurado
- ✅ SafeAreaView em algumas telas
- ✅ FlashList no FeedScreen (linha 68)
- ✅ Estrutura de navegação com Stack e Tabs
- ✅ Onboarding com 9 steps separados

### ⚠️ Problemas Críticos Identificados

#### 1. **Segurança - Supabase Storage** 🔐
**Arquivo:** `src/services/supabase.ts` (linha 32)
- **Problema:** Usa `AsyncStorage` (não criptografado) para tokens OAuth
- **Risco:** Tokens de autenticação expostos
- **Solução:** Criar adaptador SecureStore compatível com Supabase

#### 2. **Audio Player Mockado** 🎵
**Arquivo:** `src/components/AudioPlayer.tsx`
- **Problema:** Apenas UI mockada, não toca áudio real
- **Solução:** Implementar `expo-av` com controles reais

#### 3. **Race Condition Onboarding** ⚡
**Arquivo:** `src/navigation/StackNavigator.tsx` (linha 34)
- **Problema:** `checkOnboarding()` sem await pode causar estado inconsistente
- **Solução:** Adicionar await e loading state adequado

### 🏎️ Problemas de Performance

#### 4. **MundoNathScreen - ScrollView com .map()** 📜
**Arquivo:** `src/screens/MundoNathScreen.tsx` (linha 169)
- **Problema:** `.map()` em ScrollView horizontal
- **Solução:** Converter para FlashList horizontal

#### 5. **CommunityScreen - .map() em lista** 💬
**Arquivo:** `src/screens/CommunityScreen.tsx` (linha 160)
- **Problema:** Discussões renderizadas com `.map()`
- **Solução:** Converter para FlatList com virtualização

#### 6. **FeedScreen - Chips com ScrollView** 📱
**Arquivo:** `src/screens/FeedScreen.tsx` (linhas 35-57)
- **Problema:** Chips de filtro usam ScrollView + `.map()`
- **Solução:** Converter para FlashList horizontal

#### 7. **Image Nativo sem Cache** 🖼️
**Arquivos:** Múltiplos (MundoNathScreen, CommunityScreen, etc.)
- **Problema:** `<Image>` nativo não tem cache otimizado
- **Solução:** Migrar para `expo-image`

### 🛡️ Melhorias de Qualidade

#### 8. **Tratamento de Erros Storage** 🐛
**Arquivo:** `src/screens/MundoNathScreen.tsx` (linha 49)
- **Problema:** `JSON.parse` sem try-catch adequado
- **Solução:** Adicionar try-catch e fallback

#### 9. **Error Boundary Global** 🔄
- **Problema:** Não existe
- **Solução:** Criar componente ErrorBoundary

## 📋 Ordem de Execução Recomendada

### Fase 1: Segurança & Crítico (4-6h)
1. ✅ **SecureStore para Supabase** (1.1) - PRIMEIRO
2. ✅ **Race condition onboarding** (1.3)
3. ✅ **AudioPlayer expo-av** (1.2)

### Fase 2: Performance (6-8h)
4. ✅ **expo-image migration** (2.4) - Rápido, alto impacto
5. ✅ **MundoNathScreen FlashList** (2.1)
6. ✅ **CommunityScreen FlatList** (2.2)
7. ✅ **FeedScreen chips FlashList** (2.3)

### Fase 3: Qualidade (3-4h)
8. ✅ **Error handling storage** (3.1)
9. ✅ **ErrorBoundary global** (3.3)
10. ✅ **Audit SafeAreaView** (3.2)

## 🔧 Arquivos que Serão Criados/Modificados

### Novos Arquivos
- `src/services/secureStorage.ts` - Adaptador SecureStore para Supabase
- `src/components/ErrorBoundary.tsx` - Error boundary global

### Arquivos a Modificar
- `src/services/supabase.ts` - Migrar para SecureStore
- `src/navigation/StackNavigator.tsx` - Corrigir race condition
- `src/components/AudioPlayer.tsx` - Implementar expo-av
- `src/screens/MundoNathScreen.tsx` - FlashList + expo-image
- `src/screens/CommunityScreen.tsx` - FlatList + expo-image
- `src/screens/FeedScreen.tsx` - FlashList chips + expo-image
- `package.json` - Adicionar expo-image, expo-av

## 📦 Dependências a Adicionar

```bash
expo install expo-image expo-av
```

## ✅ Checklist de Validação

Após cada implementação, verificar:
- [ ] Código compila sem erros
- [ ] TypeScript sem erros
- [ ] Funcionalidade testada manualmente
- [ ] Performance melhorada (60 FPS)
- [ ] Sem regressões em outras telas

