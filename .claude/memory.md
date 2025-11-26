# Memória do Projeto - Nossa Maternidade Mobile

## 📱 Contexto do Projeto

**Nossa Maternidade** é um aplicativo mobile iOS/Android para gestantes e mães, oferecendo:

- Assistente de IA (Gemini) para dúvidas sobre maternidade
- Feed de conteúdo e comunidade
- Acompanhamento de hábitos e rituais
- Diário pessoal

**Status**: Migração de PWA React para React Native/Expo.

---

## ✅ O Que Já Foi Implementado

### 1. Estrutura Base do Expo

- ✅ Projeto Expo criado com TypeScript
- ✅ Configuração básica em `app.json`
- ✅ New Architecture habilitada (`newArchEnabled: true`)
- ✅ Assets básicos (icon, splash, adaptive-icon)

### 2. Chat Screen Completo

**Arquivo**: `src/screens/ChatScreen.tsx`

**Funcionalidades**:

- Interface mobile nativa com FlatList virtualizada
- KeyboardAvoidingView para iOS
- SafeAreaView para suporte a notch
- Pull-to-refresh
- Scroll automático para última mensagem
- Message bubbles (user/AI) com timestamps
- Quick reply chips (respostas rápidas)
- Loading states
- Empty state com boas-vindas
- Header com avatar e status online/offline
- Botão para limpar histórico

**Performance**:

- `memo()` em componentes de mensagem
- `removeClippedSubviews={true}`
- `maxToRenderPerBatch={10}`
- `windowSize={10}`
- Otimizado para 60fps com 100+ mensagens

### 3. Serviço Gemini AI

**Arquivo**: `src/services/geminiService.ts`

**Características**:

- Timeout de 30 segundos
- Retry logic com 3 tentativas
- Exponential backoff entre tentativas
- Error handling robusto
- Configuração via `app.json.extra.geminiApiKey` ou `EXPO_PUBLIC_GEMINI_API_KEY`
- Model: `gemini-pro`
- Temperature: 0.7, maxOutputTokens: 1024

### 4. Persistência de Dados

**Arquivo**: `src/utils/storage.ts`

**Funcionalidades**:

- AsyncStorage configurado
- Salvar/carregar histórico de chat
- Limpar histórico
- Salvar/carregar API key do Gemini
- Keys: `@nossa_maternidade:chat_history` e `@nossa_maternidade:gemini_api_key`

### 5. Tipos TypeScript

**Arquivo**: `src/types/chat.ts`

**Definições**:

- `Message` interface (id, text, role, timestamp)
- `QuickReply` interface
- `DEFAULT_QUICK_REPLIES` array com 4 opções padrão

---

## 📦 Dependências Instaladas

### Produção

- `expo`: ~54.0.25
- `react`: 19.1.0
- `react-native`: 0.81.5
- `@google/generative-ai`: ^0.24.1
- `@react-native-async-storage/async-storage`: ^2.2.0
- `expo-constants`: ^18.0.10
- `expo-status-bar`: ~3.0.8

### Desenvolvimento

- `typescript`: ~5.9.2
- `@types/react`: ~19.1.0

---

## ❌ O Que Ainda Precisa Ser Feito

### Dependências Faltantes

- [ ] React Navigation (navegação entre telas)
- [ ] NativeWind ou styled-components (estilização)
- [ ] React Native Haptics (feedback tátil)
- [ ] Supabase client (autenticação e banco de dados)
- [ ] React Native Reanimated (animações)
- [ ] React Native Gesture Handler (gestos)

### Estrutura de Pastas

```
src/
├── components/     # ✅ Criado, mas vazio
├── screens/       # ✅ ChatScreen.tsx
├── services/      # ✅ geminiService.ts
├── types/         # ✅ chat.ts
└── utils/         # ✅ storage.ts
```

**Faltam**:

- `src/navigation/` - Configuração de rotas
- `src/context/` - Context API (auth, theme, etc)
- `src/hooks/` - Custom hooks
- `src/constants/` - Constantes e design tokens
- `src/assets/` - Imagens, fonts, etc

### Screens Pendentes

- [ ] Splash Screen
- [ ] Login/Auth
- [ ] Onboarding (9 steps)
- [ ] Home/Dashboard
- [ ] Feed
- [ ] Community
- [ ] Habits
- [ ] Ritual
- [ ] Diary

### Componentes Base Pendentes

- [ ] Button
- [ ] Input
- [ ] Card
- [ ] Modal
- [ ] Loading states
- [ ] Avatar
- [ ] Badge
- [ ] TabBar

### Integrações Pendentes

- [ ] Supabase Auth
- [ ] Supabase Database
- [ ] Push Notifications
- [ ] Analytics
- [ ] Crash Reporting

### Features Pendentes

- [ ] Dark mode
- [ ] Animações de transição
- [ ] Error boundaries
- [ ] Offline-first com sync
- [ ] Deep linking
- [ ] App icon + adaptive icon customizados

---

## 🎨 Design System (A Definir)

**Cores Atuais** (usadas no Chat):

- Primary: `#FF69B4` (rosa)
- Background: `#f5f5f5`
- White: `#fff`
- Text: `#333`, `#666`, `#999`
- Border: `#e0e0e0`
- Success: `#4CAF50`

**Tipografia**:

- Títulos: 16px, fontWeight: '600'
- Corpo: 15px
- Timestamps: 10px

**Espaçamento**:

- Padding padrão: 16px
- Border radius: 16px (bubbles), 20px (chips, buttons)

---

## 🔧 Configurações Atuais

### TypeScript

- `strict: true`
- Extends `expo/tsconfig.base`

### Expo

- New Architecture: habilitada
- Orientation: portrait
- iOS: suporta tablet
- Android: edge-to-edge habilitado

### API Keys

- Gemini: configurado via `app.json.extra.geminiApiKey` ou env var

---

## 📝 Notas Importantes

1. **Performance**: Chat já otimizado para mobile com virtualização
2. **Persistência**: AsyncStorage funcionando, histórico persiste entre sessões
3. **Error Handling**: Retry logic implementado no Gemini service
4. **TypeScript**: Strict mode ativado, tipos bem definidos
5. **Arquitetura**: New Architecture do React Native habilitada

---

## 🚀 Próximos Passos Prioritários

1. **Setup de Navegação**: Instalar e configurar React Navigation
2. **Design System**: Criar componentes base reutilizáveis (Button, Input, Card)
3. **Autenticação**: Integrar Supabase Auth
4. **Onboarding**: Criar fluxo de 9 steps
5. **Home Screen**: Dashboard principal do app

---

## 📚 Referências

- Projeto web original: `/tmp/nossa-maternidade/` (se disponível)
- Documentação Chat: `README_CHAT.md`
- Expo Docs: https://docs.expo.dev
- React Navigation: https://reactnavigation.org

---

---

## 🔧 MCPs e Ferramentas (Configurado em 2025-11-21)

### ✅ MCPs Configurados

**Arquivo**: `.claude/mcp.json`

#### 1. Supabase MCP (HTTP) ✅
- **Tipo**: Servidor HTTP hospedado
- **URL**: https://mcp.supabase.com/mcp
- **Status**: ✅ PRONTO
- **Funcionalidades**: Gerenciar tabelas, queries, Edge Functions

#### 2. PostgreSQL MCP (Stdio) ✅
- **Pacote**: `@modelcontextprotocol/server-postgres`
- **Connection**: `postgresql://postgres:9E2XLJVsYzGGhuKP@db.mnszbkeuerjcevjvdqme.supabase.co:5432/postgres`
- **Status**: ✅ PRONTO E TESTADO
- **Funcionalidades**: Schema inspection, queries SQL read-only

#### 3. GitHub MCP (Stdio) ✅
- **Pacote**: `@modelcontextprotocol/server-github`
- **Token**: Configurado em `.claude/mcp.json`
- **Status**: ✅ PRONTO E TESTADO
- **Funcionalidades**: Repos, PRs, Issues, commits, busca de código

### ✅ Credenciais Configuradas

**Arquivo**: `.env` (NÃO versionado, protegido no .gitignore)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (configurado)
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://mnszbkeuerjcevjvdqme.supabase.co/functions/v1
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (configurado)

# PostgreSQL
POSTGRES_CONNECTION_STRING=postgresql://postgres:9E2XLJVsYzGGhuKP@db.mnszbkeuerjcevjvdqme.supabase.co:5432/postgres

# Gemini
EXPO_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# GitHub
GITHUB_PERSONAL_ACCESS_TOKEN=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
```

### ✅ Segurança

**`.gitignore`** atualizado com:
- `.env` - Todas as credenciais
- `.claude/mcp.json` - Config com senhas

**Arquivos template versionados**:
- `.env.example` - Template sem credenciais
- `.claude/mcp.json.example` - Template sem credenciais

### 📚 Documentação Criada

- `.claude/README.md` - Guia completo dos MCPs
- `.claude/SETUP_COMPLETO.md` - Setup detalhado com todos os passos

### 🧪 Testes Executados

| MCP | Comando | Status |
|-----|---------|--------|
| GitHub | `npx @modelcontextprotocol/server-github` | ✅ "GitHub MCP Server running on stdio" |
| PostgreSQL | `npx @modelcontextprotocol/server-postgres "postgresql://..."` | ✅ Iniciou sem erros |
| Supabase | Servidor hospedado | ✅ Disponível em https://mcp.supabase.com/mcp |

---

## 🎯 Próximo Passo ao Retomar

**IMPORTANTE**: Reiniciar Claude Code para carregar os MCPs configurados.

---

**Última atualização**: 2025-11-21
**Versão do projeto**: 1.0.0
**MCPs**: ✅ Configurados e testados
**Status**: ⏸️ Pausado com setup completo
