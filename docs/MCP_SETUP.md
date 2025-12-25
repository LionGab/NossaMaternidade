# Configuração de MCPs - Nossa Maternidade

Este documento descreve como configurar os MCPs (Model Context Protocol) recomendados para o projeto.

**Atualizado em**: Dezembro 2025

## Instalação Rápida

### Windows (PowerShell)

```powershell
# Executar script de setup
.\scripts\setup-mcps.ps1

# Ou manualmente:
# 1. Supabase CLI
supabase login
supabase link --project-ref <SEU_PROJECT_REF>

# 2. Expo MCP (via Cursor Settings ou editar settings.json)
# Abrir Cursor Settings (Ctrl+,) > Buscar "MCP" > Adicionar servidor HTTP
# URL: https://mcp.expo.dev/mcp

# 3. Playwright (se necessário)
npx playwright install chromium
```

### macOS/Linux

```bash
# Supabase CLI
supabase login
supabase link --project-ref <SEU_PROJECT_REF>

# Context7 (documentação atualizada)
npx -y @smithery/cli@latest install @upstash/context7-mcp --client claude

# Expo MCP (via Claude Desktop CLI)
# Se 'claude' apresentar erro EPERM, use npx:
npx -y @anthropic-ai/claude-code mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
# Ou configure manualmente em ~/Library/Application Support/Cursor/User/settings.json

# Memory (persistência de contexto)
npx -y @anthropic-ai/claude-code mcp add memory-keeper -- npx -y mcp-memory-keeper

# Playwright (testes visuais)
npx -y @anthropic-ai/claude-code mcp add playwright -- npx -y @anthropic/mcp-server-playwright
npx playwright install chromium
```

### Configuração Manual (Windows)

No Windows, os MCPs são configurados via arquivo de configuração do Cursor:

1. **Localização do arquivo**: `%APPDATA%\Cursor\User\settings.json`
2. **Arquivo de exemplo**: `.claude/mcp-settings-example.json`
3. **Adicionar ao `settings.json`**:

```json
{
  "mcpServers": {
    "expo-mcp": {
      "transport": "http",
      "url": "https://mcp.expo.dev/mcp"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "memory-keeper": {
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "env": {
        "MCP_MEMORY_DB_PATH": ".claude/context.db"
      }
    }
  }
}
```

## Slash Commands Disponíveis

| Comando          | Descrição                      |
| ---------------- | ------------------------------ |
| `/build-ios`     | Build iOS com quality gate     |
| `/build-android` | Build Android com quality gate |
| `/db-migrate`    | Gerenciar migrations Supabase  |
| `/db-types`      | Gerar tipos TypeScript         |
| `/ai-debug`      | Debug NathIA/Edge Functions    |
| `/ota-update`    | Deploy OTA updates             |
| `/context7-docs` | Buscar documentação atualizada |
| `/perf-check`    | Verificações de performance    |
| `/design-check`  | Verificar design system        |
| `/design-tokens` | Listar tokens disponíveis      |
| `/audit-colors`  | Auditar cores hardcoded        |
| `/audit-a11y`    | Auditoria de acessibilidade    |

## MCPs Configurados

### 1. Supabase MCP (Prioridade Alta)

**Status**: ✅ Já disponível via ferramentas MCP

**Configuração Necessária**:

- Autenticação via Supabase CLI ou token de acesso
- Projeto ID do Supabase configurado

**Uso**:

- Migrations: `supabase/migrations/*`
- Diagnósticos: Security/Performance Advisors
- Logs: API, Auth, Storage, Realtime
- Geração de tipos TypeScript do banco

**Comandos Úteis**:

```bash
# Listar projetos
supabase projects list

# Linkar projeto local
supabase link --project-ref YOUR_PROJECT_REF

# Ver advisors de segurança
# (via MCP tool: mcp_Supabase_get_advisors)
```

### 2. Expo MCP (Prioridade Alta)

**Status**: ⚠️ Requer configuração manual

**Configuração**:

Para **Claude Desktop**:

```bash
npx -y @anthropic-ai/claude-code mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
```

**Autenticação**:

Após adicionar o servidor, você pode precisar autenticar via OAuth 2.0. Execute `/mcp` no Claude Desktop e siga as instruções no navegador para fazer login.

**Uso**:

- Gerenciamento de projetos Expo
- Interação com EAS (Expo Application Services)
- Builds e deployments
- Acesso à documentação em tempo real
- Gerenciamento inteligente de dependências
- Testes visuais automatizados

**Recursos**:

- Criar e gerenciar builds via EAS
- Verificar status de builds
- Gerenciar atualizações OTA (Over-The-Air)
- Acessar documentação do Expo SDK
- Validar configurações do projeto

**Exemplo de Uso**:

```bash
# No Claude Desktop, após configurar:
# Use comandos MCP para interagir com projetos Expo
# Exemplo: criar build, verificar status, etc.
```

### 3. Context7 MCP (Prioridade Alta)

**Status**: ✅ Já disponível via ferramentas MCP

**Configuração**: Automática - não requer setup adicional

**Uso**:

- Documentação atualizada de:
  - `react-navigation` v7
  - `expo-notifications`
  - `supabase-js` v2
  - `react-native-reanimated`
  - `nativewind`
  - `@shopify/flash-list`

**Exemplo de Uso**:

```typescript
// Buscar docs de react-navigation
mcp_Context7_get -
  library -
  docs({
    context7CompatibleLibraryID: "/react-navigation/react-navigation",
    mode: "code",
    topic: "navigation",
  });
```

### 4. Figma MCP (Prioridade Média - Requer Figma Desktop)

**Status**: ⚠️ Requer configuração manual

**Pré-requisitos**:

1. Figma Desktop App instalado
2. Arquivo do design aberto no Figma
3. Acesso ao fileKey do projeto

**Configuração**:

1. Abra o Figma Desktop App
2. Abra o arquivo do design "Nossa Maternidade"
3. Obtenha o fileKey da URL: `https://figma.com/design/{fileKey}/...`
4. Use as ferramentas MCP do Figma para:
   - Capturar screenshots de frames
   - Ler design variables
   - Gerar regras do design system
   - Mapear componentes (Code Connect)

**Uso**:

```typescript
// Capturar screenshot de um frame
mcp_Figma_get_screenshot({
  fileKey: "YOUR_FILE_KEY",
  nodeId: "123:456",
});

// Obter design context
mcp_Figma_get_design_context({
  fileKey: "YOUR_FILE_KEY",
  nodeId: "123:456",
});
```

### 5. Linear MCP (Prioridade Média - Requer Linear Account)

**Status**: ⚠️ Requer configuração manual

**Pré-requisitos**:

1. Conta Linear criada
2. Workspace configurado
3. API Key gerada

**Configuração**:

1. Acesse: https://linear.app/settings/api
2. Gere uma API Key pessoal
3. Configure no Cursor MCP settings (se necessário)

**Uso**:

- Criar issues do plano de melhorias
- Rastrear progresso por fase
- Comentários e status updates
- Integração com o plano de desenvolvimento

**Exemplo**:

```typescript
// Criar issue
mcp_Linear_create_issue({
  title: "Implementar dark mode completo",
  team: "Engineering",
  description: "Aplicar dark mode em todas as telas usando useTheme",
});
```

### 6. Playwright MCP (Prioridade Baixa - Para Web Testing)

**Status**: ✅ Já disponível via ferramentas MCP

**Uso**:

- Testes visuais no Expo Web (`http://localhost:8081/`)
- Snapshots de telas para regressão
- Validação de layout responsivo
- Debug de problemas de renderização

**Exemplo**:

```typescript
// Navegar e capturar snapshot
mcp_Playwright_browser_navigate({ url: "http://localhost:8081/" });
mcp_Playwright_browser_snapshot();
mcp_Playwright_browser_take_screenshot({ fullPage: true });
```

### 7. Memory MCP (NOVO - Persistência de Contexto)

**Status**: ⚠️ Requer instalação

**Instalação**:

```bash
npx -y @anthropic-ai/claude-code mcp add memory-keeper -- npx -y mcp-memory-keeper
```

**Configuração** (adicionar a `~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "memory-keeper": {
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "env": {
        "MCP_MEMORY_DB_PATH": "/Users/lion/NossaMaternidade/.claude/context.db"
      }
    }
  }
}
```

**Uso**:

- Manter contexto entre sessões
- Histórico de decisões do projeto
- Progresso de features
- Debug de sessões anteriores

## Ordem de Implementação Recomendada

1. **Supabase MCP** - Já configurado, usar imediatamente
2. **Expo MCP** - ⭐ **RECOMENDADO** - Essencial para builds e EAS
3. **Context7** - Já disponível, usar para documentação
4. **Playwright** - Para validação visual durante desenvolvimento
5. **Figma** - Se você tem acesso ao design file
6. **Linear** - Se você usa Linear para gerenciamento de projetos

## Verificação de Configuração

Para verificar quais MCPs estão disponíveis, use:

```bash
# No Cursor, os MCPs aparecem automaticamente nas ferramentas disponíveis
# Verifique as ferramentas que começam com "mcp_"
```

## Troubleshooting

### Supabase MCP não funciona

- Verifique se o Supabase CLI está instalado: `supabase --version`
- Verifique se está autenticado: `supabase login`
- Verifique se o projeto está linkado: `supabase link`

### Figma MCP não funciona

- Certifique-se de que o Figma Desktop App está aberto
- Verifique se o arquivo está aberto no Figma
- Confirme que o fileKey está correto

### Expo MCP não funciona

**Windows:**

- Verifique se o servidor está configurado em `%APPDATA%\Cursor\User\settings.json`
- Abra Cursor Settings (Ctrl+,) e busque por "MCP" para verificar configuração
- Certifique-se de estar autenticado no Expo: `npx expo login` ou `eas login`
- Reinicie o Cursor após adicionar o MCP

**macOS/Linux:**

- Verifique se o comando foi executado corretamente: `npx -y @anthropic-ai/claude-code mcp add --transport http expo-mcp https://mcp.expo.dev/mcp`
- Certifique-se de estar autenticado no Expo: `npx expo login` ou `eas login`
- Se necessário, autentique via OAuth 2.0 usando `/mcp` no Claude Desktop
- Verifique se você tem acesso ao projeto Expo configurado

### Linear MCP não funciona

- Verifique se a API Key está configurada corretamente
- Confirme que você tem permissões no workspace Linear

### Termius MCP

**Status**: ⚠️ Não existe servidor MCP oficial do Termius

**Alternativas**:

- Use SSH diretamente no terminal integrado do Cursor
- Crie um servidor MCP customizado (veja [TERMIUS_MCP_SETUP.md](./TERMIUS_MCP_SETUP.md))

**Documentação completa**: [TERMIUS_MCP_SETUP.md](./TERMIUS_MCP_SETUP.md)
