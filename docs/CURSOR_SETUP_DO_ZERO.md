# 🚀 Guia Definitivo: Setup do Cursor do Zero

Este guia configura o Cursor IDE do absoluto zero para desenvolver neste repositório **Nossa Maternidade**.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Setup Inicial](#-setup-inicial)
3. [Configuração de Ambiente](#-configuração-de-ambiente)
4. [Extensões Essenciais](#-extensões-essenciais)
5. [MCPs (Model Context Protocols)](#-mcps-model-context-protocols)
6. [Comandos Personalizados](#-comandos-personalizados)
7. [Agentes Especializados](#-agentes-especializados)
8. [Configurações de Performance](#-configurações-de-performance)
9. [Quality Gate](#-quality-gate)
10. [Troubleshooting](#-troubleshooting)

---

## 🔧 Pré-requisitos

### Software Necessário

| Software | Versão Mínima | Download |
|----------|---------------|----------|
| Node.js | 20.x LTS | [nodejs.org](https://nodejs.org) |
| Bun (recomendado) | 1.x | `curl -fsSL https://bun.sh/install \| bash` |
| Git | 2.x | [git-scm.com](https://git-scm.com) |
| Cursor IDE | Latest | [cursor.com](https://cursor.com) |

### Opcional (para builds)

| Software | Propósito |
|----------|-----------|
| Xcode 16+ | Builds iOS (Mac only) |
| Android Studio | Builds Android |
| EAS CLI | `npm install -g eas-cli` |

---

## 🏁 Setup Inicial

### 1. Clone e Instale

```bash
# Clone o repositório
git clone <repo-url>
cd nossa-maternidade

# Instale dependências (bun é 3-5x mais rápido)
bun install
# ou
npm install
```

### 2. Configure Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas chaves
# Mínimo necessário: EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**Variáveis obrigatórias:**

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 3. Verifique o Setup

```bash
# Verifica se tudo está configurado
npm run check-env

# Inicia o servidor de desenvolvimento
npm start
```

---

## ⚙️ Configuração de Ambiente

### Estrutura de Arquivos de Config

```
/workspace/
├── .cursorrules           # ⭐ Regras do projeto (lido automaticamente)
├── CLAUDE.md              # ⭐ Contexto principal para AI
├── .cursorignore          # Arquivos ignorados pela indexação
├── .vscode/
│   ├── settings.json      # Configurações do editor
│   └── extensions.json    # Extensões recomendadas
└── .claude/
    ├── commands/          # 16 comandos personalizados
    ├── agents/            # 6 agentes especializados
    ├── mcp-config.json    # Configuração de MCPs
    └── settings.local.json # Permissões locais
```

### Arquivos Já Configurados

O projeto já inclui configurações otimizadas em `.vscode/settings.json`:

- ✅ TypeScript com workspace SDK
- ✅ ESLint com auto-fix on save
- ✅ Prettier como formatter padrão
- ✅ Tailwind CSS IntelliSense
- ✅ Performance otimizada para M1 8GB RAM
- ✅ File watchers excluindo node_modules/.expo

---

## 🧩 Extensões Essenciais

### Instalar via Cursor

Abra Cursor → `Cmd/Ctrl + Shift + X` → Busque e instale:

| Extensão | ID | Propósito |
|----------|----|-----------|
| **ESLint** | `dbaeumer.vscode-eslint` | Linting TypeScript/JS |
| **Prettier** | `esbenp.prettier-vscode` | Formatação de código |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Autocomplete NativeWind |
| **GitLens** | `eamodio.gitlens` | Git supercharged |

### Extensões Opcionais (Recomendadas)

| Extensão | ID | Propósito |
|----------|----|-----------|
| Error Lens | `usernamehw.errorlens` | Erros inline |
| Todo Tree | `gruntfuggly.todo-tree` | TODOs no sidebar |
| Import Cost | `wix.vscode-import-cost` | Tamanho de imports |

### Instalação Rápida (Terminal)

```bash
# Extensões obrigatórias
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
cursor --install-extension eamodio.gitlens
```

---

## 🔌 MCPs (Model Context Protocols)

MCPs expandem as capacidades da AI no Cursor. Este projeto suporta:

### MCPs Disponíveis

| MCP | Status | Propósito |
|-----|--------|-----------|
| **expo-mcp** | 🟢 Disponível | Builds, docs Expo, screenshots |
| **context7** | 🟢 Disponível | Docs atualizados de libs |
| **supabase** | 🟢 Ativo | Queries, migrations, RLS |
| **sequential-thinking** | 🟢 Ativo | Raciocínio estruturado |
| **figma-devmode** | 🟡 Local | Design tokens do Figma |
| **playwright** | 🟡 Opcional | Testes visuais web |

### Configurar MCPs

1. **Abra Settings** → `Cmd/Ctrl + ,`
2. Busque **"MCP"** ou **"Model Context Protocol"**
3. Adicione os servers desejados

**Exemplo de configuração (Cursor Settings → MCP):**

```json
{
  "expo-mcp": {
    "transport": "http",
    "url": "https://mcp.expo.dev/mcp"
  },
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"]
  }
}
```

### MCP: Expo (Recomendado)

```bash
# Via CLI
npx @anthropic/mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
```

Capacidades:
- `learn` - Aprende sobre Expo SDK
- `search_documentation` - Busca docs
- `add_library` - Adiciona dependências
- `screenshot` - Captura tela do app

### MCP: Context7 (Docs Atualizados)

```bash
# Adiciona context7 para docs de libs
npx @anthropic/mcp add context7 -- npx -y @upstash/context7-mcp
```

Libs suportadas:
- react-navigation
- expo-notifications
- supabase-js
- react-native-reanimated
- nativewind

---

## 📝 Comandos Personalizados

O projeto inclui **16 comandos customizados** em `.claude/commands/`:

### Como Usar

No chat do Cursor, digite `/` seguido do comando:

```
/design-check src/screens/HomeScreen.tsx
```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `/design-check` | Verifica consistência com Design System |
| `/design-tokens` | Lista todos os tokens disponíveis |
| `/design-quality` | Quality gate completo de design |
| `/design-audit` | Auditoria visual detalhada |
| `/audit-colors` | Encontra cores hardcoded |
| `/audit-a11y` | Verifica acessibilidade WCAG |
| `/component-gen` | Gera componente do design system |
| `/ai-debug` | Debug de features de IA |
| `/build-ios` | Guia de build iOS |
| `/build-android` | Guia de build Android |
| `/db-migrate` | Cria migration Supabase |
| `/db-types` | Gera tipos TypeScript do DB |
| `/context7-docs` | Busca docs com Context7 |
| `/figma-setup` | Setup do Figma MCP |
| `/ota-update` | Deploy OTA (expo-updates) |
| `/perf-check` | Análise de performance |

---

## 🤖 Agentes Especializados

O projeto inclui **6 agentes especializados** em `.claude/agents/`:

### Como Usar

Mencione o agente no chat ou selecione no dropdown:

```
@design-ui Preciso criar um card de post para a comunidade
```

### Agentes Disponíveis

| Agente | Especialização |
|--------|----------------|
| **@ai-nathia** | NathIA (assistente IA do app) |
| **@build-deploy** | Builds EAS, deploys, CI/CD |
| **@data-admin** | LGPD, dados do usuário, exports |
| **@database** | Supabase, migrations, RLS |
| **@design-ui** | Design System, UI, acessibilidade |
| **@performance** | Otimização, lazy loading, memoização |

---

## ⚡ Configurações de Performance

### Para MacBook M1 8GB RAM

As configurações em `.vscode/settings.json` já estão otimizadas:

```json
{
  // TypeScript otimizado
  "typescript.tsserver.maxTsServerMemory": 4096,
  
  // Reduz uso de recursos
  "editor.minimap.enabled": false,
  "editor.smoothScrolling": false,
  "editor.cursorSmoothCaretAnimation": "off",
  
  // GPU off (economia de memória)
  "terminal.integrated.gpuAcceleration": "off",
  
  // Desabilita updates automáticos
  "extensions.autoUpdate": false,
  "update.mode": "manual"
}
```

### Otimizações Adicionais

```bash
# Limpar cache se Cursor ficar lento
npm run clean

# Limpeza completa (reinicia node_modules)
npm run clean:all
```

### Arquivos Ignorados pela Indexação

O `.cursorignore` exclui:
- `node_modules/`
- `.expo/`
- `ios/build/`, `android/build/`
- Vídeos grandes em `assets/`
- Lock files (`bun.lock`, `package-lock.json`)

---

## ✅ Quality Gate

### Antes de Qualquer PR

**SEMPRE execute:**

```bash
npm run quality-gate
# ou
bun run quality-gate
```

Isso verifica:
1. **TypeScript** - `tsc --noEmit` (zero erros)
2. **ESLint** - Sem `console.log`, `any`, etc.
3. **Build Readiness** - Pronto para build
4. **Console.log Check** - Deve usar `logger.*`

### Comandos Individuais

```bash
# TypeScript apenas
npm run typecheck

# Lint apenas
npm run lint

# Lint com auto-fix
npm run lint:fix

# Formatação
npm run format
```

### Regras Críticas do Projeto

| Regra | ❌ Proibido | ✅ Correto |
|-------|------------|-----------|
| Logging | `console.log()` | `logger.info()` |
| Types | `any` | `unknown` + type guard |
| Cores | `#FF0000`, `'white'` | `Tokens.brand.primary` |
| Listas | `ScrollView + map()` | `FlatList` ou `FlashList` |
| State | `{ user, setUser }` | Selectors individuais |

---

## 🔍 Troubleshooting

### Cursor Lento / Alta Memória

```bash
# 1. Limpar cache do projeto
npm run clean

# 2. Reiniciar Cursor
# Cmd/Ctrl + Shift + P → "Reload Window"

# 3. Se persistir, limpeza completa
npm run clean:all
```

### TypeScript Não Reconhece Tipos

```bash
# Reiniciar TS Server
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### ESLint Não Funciona

```bash
# Verificar se ESLint está habilitado
# Cmd/Ctrl + Shift + P → "ESLint: Show Output Channel"

# Reinstalar dependências
rm -rf node_modules && bun install
```

### Expo Não Inicia

```bash
# Limpar cache do Expo
npm run start:clear

# Se persistir
rm -rf .expo node_modules/.cache
bun install
npm start
```

### MCP Não Conecta

1. Verifique se o server está rodando (ex: Figma Desktop)
2. Confira a URL/porta nas settings
3. Reinicie o Cursor após configurar

### iOS Build Falha (Mac)

```bash
# Fix comum para CocoaPods
npm run fix:ios
```

---

## 📚 Referências Rápidas

### Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `CLAUDE.md` | Contexto principal para AI |
| `.cursorrules` | Regras do projeto |
| `src/theme/tokens.ts` | **Design Tokens (fonte única)** |
| `src/hooks/useTheme.ts` | Hook de tema light/dark |
| `src/utils/logger.ts` | Sistema de logging |
| `src/state/store.ts` | Todos os Zustand stores |

### Scripts Úteis

```bash
# Desenvolvimento
npm start              # Inicia Expo
npm run ios            # Roda no simulador iOS
npm run android        # Roda no emulador Android

# Qualidade
npm run quality-gate   # ⭐ Rodar antes de PR
npm run typecheck      # Apenas TypeScript
npm run lint:fix       # Corrige lint automaticamente

# Builds
npm run build:dev:ios  # Build dev iOS
npm run build:prod     # Build produção
```

### Stack Tecnológica

- **Expo SDK 54+** (managed workflow)
- **React Native 0.81+**
- **TypeScript 5.9+** strict
- **NativeWind 4+** (Tailwind para RN)
- **React Navigation 7**
- **Zustand** (state management)
- **Supabase** (auth/DB/storage)
- **Gemini 2.5 Flash** (IA principal)

---

## 🎯 Checklist de Setup Completo

- [ ] Node.js 20+ instalado
- [ ] Bun instalado (opcional mas recomendado)
- [ ] Repositório clonado
- [ ] `bun install` executado
- [ ] `.env.local` configurado com Supabase
- [ ] Extensões do Cursor instaladas (ESLint, Prettier, Tailwind)
- [ ] `npm run check-env` passou
- [ ] `npm start` funciona
- [ ] `npm run quality-gate` passa

**Pronto! Agora você tem o Cursor configurado para máxima produtividade neste projeto. 🚀**

---

**Última atualização**: 2025-01-24  
**Versão**: 1.0.0  
**Status**: ✅ Completo e pronto para uso

