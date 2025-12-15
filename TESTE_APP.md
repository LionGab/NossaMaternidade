# 🧪 Guia de Teste - Nossa Maternidade

## ✅ Pré-requisitos

1. **Bun instalado** (gerenciador de pacotes)
2. **Expo CLI** (via `bunx expo`)
3. **Dispositivo/Emulador**:
   - iOS: Simulador (Mac) ou Expo Go no iPhone
   - Android: Emulador ou Expo Go no Android

---

## 🚀 Como Iniciar o App

### Opção 1: Servidor de Desenvolvimento (Recomendado)

```bash
# Iniciar servidor Expo
bun start

# Ou com flags específicas:
bun start --clear          # Limpar cache
bun start --tunnel         # Usar tunnel (útil para testar em dispositivos físicos)
```

### Opção 2: Rodar Diretamente

```bash
# iOS Simulator (Mac)
bun run ios

# Android Emulator
bun run android

# Web (não recomendado para este app)
bun run web
```

---

## 📱 O Que Testar Após Remoção do WeightCalculator

### ✅ 1. HomeScreen - Ações Rápidas

**Localização**: Tab "Home" → Seção "Ações Rápidas"

**Verificar**:

- [ ] Existem **3 cards** de ações (não 4)
- [ ] Cards visíveis:
  1. **Meus Cuidados** (ícone: heart, gradiente rosa/vermelho)
  2. **NathIA** (ícone: chatbubble, gradiente verde)
  3. **Afirmações** (ícone: sparkles, gradiente roxo)
- [ ] **NÃO** existe card "Peso Ideal" ou "Calculator"
- [ ] Cada card navega corretamente ao tocar

**Teste de Navegação**:

```
Home → Meus Cuidados → ✅ Abre tab "Meus Cuidados"
Home → NathIA → ✅ Abre tab "Assistant"
Home → Afirmações → ✅ Abre modal "Affirmations"
```

### ✅ 2. Navegação - Sem Erros

**Verificar**:

- [ ] App inicia sem erros no console
- [ ] Nenhum erro de tipo TypeScript
- [ ] Navegação entre tabs funciona
- [ ] Modais abrem e fecham corretamente

### ✅ 3. TypeScript - Compilação

```bash
# Verificar erros TypeScript (apenas código da app)
bunx tsc --noEmit --skipLibCheck | Select-String "src/"
```

**Esperado**: Nenhum erro em `src/`

### ✅ 4. Linter - Qualidade de Código

```bash
bun run lint
```

**Esperado**: Sem erros ou warnings

---

## 🔍 Checklist Completo de Teste

### Navegação Principal

- [ ] **Tab Home**: Carrega corretamente
- [ ] **Tab Ciclo**: Abre CycleTrackerScreen
- [ ] **Tab NathIA**: Abre AssistantScreen (com integração Claude/Gemini)
- [ ] **Tab MãesValente**: Abre CommunityScreen
- [ ] **Tab Meus Cuidados**: Abre MyCareScreen

### Ações Rápidas (HomeScreen)

- [ ] Card "Meus Cuidados" → Navega para tab MyCare
- [ ] Card "NathIA" → Navega para tab Assistant
- [ ] Card "Afirmações" → Abre modal AffirmationsScreen
- [ ] **NÃO** existe card "Peso Ideal" (removido)

### Modais e Screens

- [ ] DailyLog abre como modal
- [ ] Affirmations abre como modal
- [ ] Habits abre com header nativo
- [ ] ComingSoon funciona com parâmetros

### Funcionalidades Core

- [ ] Check-in diário funciona
- [ ] Chat com NathIA funciona (Claude/Gemini)
- [ ] Comunidade carrega posts
- [ ] Perfil do usuário exibe dados corretos

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpar cache e reinstalar
rm -rf node_modules
bun install
bun start --clear
```

### Erro: "WeightCalculator is not defined"

- Verificar se `src/types/navigation.ts` não tem `WeightCalculator`
- Verificar se `src/screens/HomeScreen.tsx` não tem referência
- Verificar se `RootNavigator.tsx` não importa WeightCalculatorScreen

### App não inicia

```bash
# Verificar logs
bun start --verbose

# Verificar TypeScript
bunx tsc --noEmit
```

---

## 📊 Resultado Esperado

Após remoção do WeightCalculator:

✅ **3 ações rápidas** no HomeScreen (não 4)
✅ **Nenhum erro** de navegação
✅ **TypeScript compila** sem erros em `src/`
✅ **Todas as navegações** funcionam corretamente
✅ **Nenhuma referência** ao WeightCalculator no código

---

## 🎯 Teste Rápido (2 minutos)

1. `bun start`
2. Abrir app no dispositivo/emulador
3. Ir para tab **Home**
4. Verificar que existem **3 cards** de ações rápidas
5. Tocar em cada card e verificar navegação
6. ✅ Tudo funcionando!

---

## 📝 Notas

- Erros TypeScript em `supabase/functions/ai/index.ts` são **esperados** (backend Deno)
- Focar em erros apenas em `src/` (código da aplicação)
- Se encontrar problemas, verificar console do Expo e logs do dispositivo
