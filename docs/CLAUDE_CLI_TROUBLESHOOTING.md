# Troubleshooting: Claude CLI (EPERM Error)

## Problema

Ao executar `claude` no diretório do projeto, você recebe:

```
Error: EPERM: operation not permitted, uv_cwd
```

## Causa

Este erro geralmente ocorre quando:

1. O Node.js/Bun não consegue acessar o diretório atual
2. Há extended attributes no diretório que interferem
3. Problema conhecido com Bun + Node.js v25.2.1

## Soluções Rápidas

### Solução 1: Usar npx (Recomendado)

Em vez de usar `claude` diretamente, use `npx`:

```bash
# Em vez de:
claude mcp add --transport http expo-mcp https://mcp.expo.dev/mcp

# Use:
npx -y @anthropic-ai/claude-code mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
```

### Solução 2: Executar de Diretório Temporário

Execute o comando de um diretório que não tenha problemas:

```bash
cd /tmp
claude mcp add --transport http expo-mcp https://mcp.expo.dev/mcp
```

### Solução 3: Configurar Manualmente no Cursor

Para a maioria dos MCPs, você pode configurar diretamente no arquivo de configuração do Cursor:

**macOS:**

```bash
open ~/Library/Application\ Support/Cursor/User/settings.json
```

**Windows:**

```bash
notepad %APPDATA%\Cursor\User\settings.json
```

Adicione a configuração do MCP diretamente:

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
    }
  }
}
```

### Solução 4: Corrigir Permissões

Execute o script de correção:

```bash
bash scripts/fix-claude-permission.sh
```

Ou manualmente:

```bash
# Remover extended attributes (se necessário)
xattr -c ~/Documents/Lion/NossaMaternidade

# Corrigir permissões
chmod 755 ~/Documents/Lion/NossaMaternidade
```

### Solução 5: Reinstalar Claude CLI

Se o problema persistir, reinstale o Claude CLI:

```bash
# Remover
bun remove -g @anthropic-ai/claude-code

# Reinstalar
bun install -g @anthropic-ai/claude-code
```

## Configuração de MCPs sem Claude CLI

Para configurar MCPs no Cursor, você **não precisa** do Claude CLI. Basta editar o arquivo de configuração:

### Localização dos Arquivos

**macOS:**

```
~/Library/Application Support/Cursor/User/settings.json
```

**Windows:**

```
%APPDATA%\Cursor\User\settings.json
```

### Exemplo Completo de Configuração

```json
{
  "mcpServers": {
    "expo-mcp": {
      "description": "Expo MCP Server para builds iOS/Android",
      "transport": "http",
      "url": "https://mcp.expo.dev/mcp"
    },
    "context7": {
      "description": "Documentação atualizada de libraries",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "memory-keeper": {
      "description": "Persistência de contexto entre sessões",
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "env": {
        "MCP_MEMORY_DB_PATH": ".claude/context.db"
      }
    },
    "playwright": {
      "description": "Testes visuais automatizados",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-playwright"]
    },
    "figma-devmode": {
      "description": "Figma Dev Mode MCP Server (local)",
      "transport": "sse",
      "url": "http://127.0.0.1:3845/sse"
    }
  }
}
```

## Verificação

Após configurar, reinicie o Cursor e verifique se os MCPs estão disponíveis:

1. Abra o Cursor
2. Verifique as ferramentas disponíveis (devem começar com `mcp_`)
3. Consulte `docs/MCP_SETUP.md` para mais detalhes

## Referências

- [MCP Setup Guide](./MCP_SETUP.md)
- [MCP Setup Windows](./MCP_SETUP_WINDOWS.md)
- [Termius MCP Setup](./TERMIUS_MCP_SETUP.md)
