# 🔗 MCP Deeplinks - Nossa Maternidade

Este documento foi **gerado automaticamente** pelo script `scripts/generate-mcp-deeplinks.js`.

> ⚠️ **Não edite este arquivo manualmente!** Execute o script para atualizar.

## 📖 O que são Deeplinks MCP?

Deeplinks MCP são URLs padronizadas que permitem acesso direto a recursos e ferramentas através do protocolo MCP (Model Context Protocol).

## 🎯 Formato Geral

```
cursor-mcp://nossa-maternidade/{server}/{method}?{params}
```

## 📋 Índice Rápido

- [SUPABASE](#supabase-mcp)
- [GOOGLE-AI](#google-ai-mcp)
- [OPENAI](#openai-mcp)
- [ANTHROPIC](#anthropic-mcp)
- [ANALYTICS](#analytics-mcp)

---

## SUPABASE MCP

**Descrição:** Servidor MCP para acesso ao Supabase (banco de dados, autenticação, storage)

**Métodos disponíveis:** query, insert, update, delete, auth.login, auth.signup, auth.logout, storage.upload, storage.download, storage.list

### query

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/query?table={table}&select={select}&filter={filter}
```

**Parâmetros:**
- `table` (obrigatório)
- `select` (obrigatório)
- `filter` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/query?table=user_profiles&select=id,name,email&filter=active=true
```

---

### insert

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/insert?table={table}&data={data}
```

**Parâmetros:**
- `table` (obrigatório)
- `data` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/insert?table=user_profiles&data={"name":"Maria Silva"}
```

---

### update

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/update?table={table}&id={id}&data={data}
```

**Parâmetros:**
- `table` (obrigatório)
- `id` (obrigatório)
- `data` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/update?table=user_profiles&id=123&data={"name":"Maria Silva"}
```

---

### delete

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/delete?table={table}&id={id}
```

**Parâmetros:**
- `table` (obrigatório)
- `id` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/delete?table=user_profiles&id=123
```

---

### auth.login

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/auth/login?email={email}&password={password}
```

**Parâmetros:**
- `email` (obrigatório)
- `password` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/auth/login?email=user@example.com&password=***
```

---

### auth.signup

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/auth/signup?email={email}&password={password}
```

**Parâmetros:**
- `email` (obrigatório)
- `password` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/auth/signup?email=user@example.com&password=***
```

---

### storage.upload

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/storage/upload?bucket={bucket}&path={path}&file={file}
```

**Parâmetros:**
- `bucket` (obrigatório)
- `path` (obrigatório)
- `file` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/storage/upload?bucket=avatars&path=user-123.jpg&file={base64data}
```

---

### storage.download

**Deeplink:**
```
cursor-mcp://nossa-maternidade/supabase/storage/download?bucket={bucket}&path={path}
```

**Parâmetros:**
- `bucket` (obrigatório)
- `path` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/supabase/storage/download?bucket=avatars&path=user-123.jpg
```

---

## GOOGLE-AI MCP

**Descrição:** Servidor MCP para acesso ao Google AI (Gemini 2.5 Flash) - IA principal do projeto

**Métodos disponíveis:** chat, generate, embed

### chat

**Deeplink:**
```
cursor-mcp://nossa-maternidade/google-ai/chat?message={message}&model={model}&temperature={temperature}
```

**Parâmetros:**
- `message` (obrigatório)
- `model` (obrigatório)
- `temperature` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/google-ai/chat?message=Olá, NathIA!&model=gemini-2.5-flash&temperature=0.7
```

---

### generate

**Deeplink:**
```
cursor-mcp://nossa-maternidade/google-ai/generate?prompt={prompt}&type={type}
```

**Parâmetros:**
- `prompt` (obrigatório)
- `type` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/google-ai/generate?prompt=Escreva um artigo sobre maternidade&type=article
```

---

### embed

**Deeplink:**
```
cursor-mcp://nossa-maternidade/google-ai/embed?text={text}&model={model}
```

**Parâmetros:**
- `text` (obrigatório)
- `model` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/google-ai/embed?text=Conteúdo a ser moderado&model=gemini-2.5-flash
```

---

## OPENAI MCP

**Descrição:** Servidor MCP para acesso ao OpenAI (GPT-4o) - Usado para crises emocionais e moderação

**Métodos disponíveis:** chat, moderate

### chat

**Deeplink:**
```
cursor-mcp://nossa-maternidade/openai/chat?message={message}&model={model}&system={system}
```

**Parâmetros:**
- `message` (obrigatório)
- `model` (obrigatório)
- `system` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/openai/chat?message=Olá, NathIA!&model=gemini-2.5-flash&system=crisis-helper
```

---

### moderate

**Deeplink:**
```
cursor-mcp://nossa-maternidade/openai/moderate?text={text}
```

**Parâmetros:**
- `text` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/openai/moderate?text=Conteúdo a ser moderado
```

---

## ANTHROPIC MCP

**Descrição:** Servidor MCP para acesso ao Anthropic (Claude Opus) - Análise profunda e moderação

**Métodos disponíveis:** chat, analyze

### chat

**Deeplink:**
```
cursor-mcp://nossa-maternidade/anthropic/chat?message={message}&model={model}
```

**Parâmetros:**
- `message` (obrigatório)
- `model` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/anthropic/chat?message=Olá, NathIA!&model=gemini-2.5-flash
```

---

### analyze

**Deeplink:**
```
cursor-mcp://nossa-maternidade/anthropic/analyze?content={content}&type={type}
```

**Parâmetros:**
- `content` (obrigatório)
- `type` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/anthropic/analyze?content={json}&type=article
```

---

## ANALYTICS MCP

**Descrição:** Servidor MCP para métricas e analytics do projeto

**Métodos disponíveis:** track, metrics, report

### track

**Deeplink:**
```
cursor-mcp://nossa-maternidade/analytics/track?event={event}&properties={properties}
```

**Parâmetros:**
- `event` (obrigatório)
- `properties` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/analytics/track?event=screen_view&properties={"screen":"HomeScreen"}
```

---

### metrics

**Deeplink:**
```
cursor-mcp://nossa-maternidade/analytics/metrics?type={type}&period={period}
```

**Parâmetros:**
- `type` (obrigatório)
- `period` (obrigatório)

**Exemplo:**
```
cursor-mcp://nossa-maternidade/analytics/metrics?type=article&period=7d
```

---

## 📝 Notas de Uso

### Encoding de Parâmetros

Todos os parâmetros devem ser URL-encoded:

```javascript
// JavaScript
encodeURIComponent(JSON.stringify({ name: "Maria" }))
```

### Respostas

Todas as respostas são em formato JSON:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": 1234567890
}
```

### Erros

Em caso de erro:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem de erro"
  },
  "timestamp": 1234567890
}
```

## 🧪 Testar Deeplinks

### Via Cursor AI

```
@mcp deeplink cursor-mcp://nossa-maternidade/supabase/query?table=user_profiles
```

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- Nunca exponha deeplinks com credenciais em logs públicos
- Use autenticação para deeplinks sensíveis
- Valide todos os parâmetros de entrada

---

**Última atualização:** 2025-12-08  
**Versão:** 1.0.0  
**Gerado por:** `scripts/generate-mcp-deeplinks.js`
