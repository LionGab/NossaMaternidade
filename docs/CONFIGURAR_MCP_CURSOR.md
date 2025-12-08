# 🔧 Configurar MCP no Cursor AI

Este guia explica como configurar os servidores MCP (Model Context Protocol) do projeto **Nossa Maternidade** no Cursor AI.

## 📋 Pré-requisitos

- Cursor AI instalado e configurado
- Node.js 18+ instalado
- Acesso ao projeto Nossa Maternidade

## 🎯 O que são MCP Servers?

MCP (Model Context Protocol) permite que o Cursor AI acesse ferramentas e recursos externos através de servidores padronizados. No nosso projeto, temos servidores MCP para:

- **Supabase**: Banco de dados, autenticação, storage
- **Google AI (Gemini)**: IA principal (Gemini 2.5 Flash)
- **OpenAI**: Fallback para crises emocionais (GPT-4o)
- **Anthropic (Claude)**: Análise profunda e moderação
- **Analytics**: Métricas e tracking

## 🚀 Configuração Rápida

### 1. Localizar arquivo de configuração do Cursor

O Cursor armazena configurações MCP em:

**Windows:**

```
%APPDATA%\Cursor\User\globalStorage\mcp.json
```

**macOS:**

```
~/Library/Application Support/Cursor/User/globalStorage/mcp.json
```

**Linux:**

```
~/.config/Cursor/User/globalStorage/mcp.json
```

### 2. Adicionar configuração MCP

Abra o arquivo `mcp.json` e adicione a configuração do projeto:

```json
{
  "mcpServers": {
    "nossa-maternidade": {
      "command": "node",
      "args": ["${workspaceFolder}/scripts/mcp-server.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 3. Usar configuração via arquivo do projeto

Alternativamente, você pode usar o arquivo `docs/mcp-configs.json` que contém todas as configurações pré-formatadas.

Execute o script de geração:

```bash
node scripts/generate-mcp-deeplinks.js
```

Isso criará os deeplinks e configurações necessárias.

## 📝 Configuração Detalhada

### Servidores MCP Disponíveis

#### 1. Supabase MCP Server

**Arquivo:** `src/mcp/servers/SupabaseMCPServer.ts`

**Métodos disponíveis:**

- `supabase.query` - Executar queries SQL
- `supabase.insert` - Inserir dados
- `supabase.update` - Atualizar dados
- `supabase.delete` - Deletar dados
- `supabase.auth` - Operações de autenticação
- `supabase.storage` - Operações de storage

**Configuração:**

```json
{
  "name": "supabase-mcp",
  "type": "supabase",
  "env": {
    "SUPABASE_URL": "${SUPABASE_URL}",
    "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}"
  }
}
```

#### 2. Google AI MCP Server

**Arquivo:** `src/mcp/servers/GoogleAIMCPServer.ts`

**Métodos disponíveis:**

- `google-ai.chat` - Chat com Gemini
- `google-ai.generate` - Geração de conteúdo
- `google-ai.embed` - Embeddings

**Configuração:**

```json
{
  "name": "google-ai-mcp",
  "type": "google-ai",
  "env": {
    "GEMINI_API_KEY": "${GEMINI_API_KEY}"
  }
}
```

#### 3. OpenAI MCP Server

**Arquivo:** `src/mcp/servers/OpenAIMCPServer.ts`

**Métodos disponíveis:**

- `openai.chat` - Chat com GPT-4o
- `openai.moderate` - Moderação de conteúdo

**Configuração:**

```json
{
  "name": "openai-mcp",
  "type": "openai",
  "env": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}"
  }
}
```

#### 4. Anthropic MCP Server

**Arquivo:** `src/mcp/servers/AnthropicMCPServer.ts`

**Métodos disponíveis:**

- `anthropic.chat` - Chat com Claude
- `anthropic.analyze` - Análise profunda

**Configuração:**

```json
{
  "name": "anthropic-mcp",
  "type": "anthropic",
  "env": {
    "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
  }
}
```

## 🔗 Deeplinks MCP

Deeplinks permitem que o Cursor AI acesse recursos específicos do projeto através de URLs padronizadas.

### Formato de Deeplink

```
cursor-mcp://nossa-maternidade/{server}/{method}?{params}
```

### Exemplos

**Acessar Supabase:**

```
cursor-mcp://nossa-maternidade/supabase/query?table=user_profiles&select=*
```

**Chat com Gemini:**

```
cursor-mcp://nossa-maternidade/google-ai/chat?message=Olá
```

**Moderar conteúdo:**

```
cursor-mcp://nossa-maternidade/openai/moderate?text=conteúdo a moderar
```

### Gerar Deeplinks

Execute o script para gerar todos os deeplinks disponíveis:

```bash
node scripts/generate-mcp-deeplinks.js
```

Isso criará um arquivo `docs/MCP_DEEPLINKS.md` com todos os deeplinks documentados.

## 🧪 Testar Configuração

### 1. Verificar servidores disponíveis

No Cursor AI, use o comando:

```
@mcp list
```

Isso deve listar todos os servidores MCP configurados.

### 2. Testar conexão Supabase

```
@mcp supabase-mcp query
```

### 3. Testar chat Gemini

```
@mcp google-ai-mcp chat "Olá, NathIA!"
```

## 🛠️ Troubleshooting

### Erro: "MCP server not found"

**Solução:**

1. Verifique se o arquivo `mcp.json` está no local correto
2. Reinicie o Cursor AI
3. Verifique se as variáveis de ambiente estão configuradas

### Erro: "Connection refused"

**Solução:**

1. Verifique se o Node.js está instalado e no PATH
2. Verifique se o script `scripts/mcp-server.js` existe
3. Execute manualmente: `node scripts/mcp-server.js`

### Erro: "Environment variables missing"

**Solução:**

1. Crie arquivo `.env` na raiz do projeto
2. Adicione as variáveis necessárias:
   ```
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   GEMINI_API_KEY=...
   OPENAI_API_KEY=...
   ANTHROPIC_API_KEY=...
   ```

## 📚 Recursos Adicionais

- [Documentação MCP Oficial](https://modelcontextprotocol.io)
- [Cursor AI MCP Docs](https://docs.cursor.com/mcp)
- [Projeto MCP no GitHub](https://github.com/modelcontextprotocol)

## 🔐 Segurança

⚠️ **IMPORTANTE:** Nunca commite arquivos `.env` ou chaves de API no repositório.

Use `.env.example` como template e mantenha `.env` no `.gitignore`.

## ✅ Checklist de Configuração

- [ ] Cursor AI instalado
- [ ] Arquivo `mcp.json` configurado
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Script `generate-mcp-deeplinks.js` executado
- [ ] Servidores MCP testados
- [ ] Deeplinks funcionando

## 🎉 Próximos Passos

Após configurar o MCP:

1. Explore os deeplinks disponíveis em `docs/MCP_DEEPLINKS.md`
2. Use `@mcp` no Cursor para acessar servidores
3. Integre MCP em seus workflows de desenvolvimento
4. Contribua com novos servidores MCP conforme necessário

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0
