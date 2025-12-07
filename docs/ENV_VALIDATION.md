# 🔒 Validação de Variáveis de Ambiente

## ⚠️ AVISO DE SEGURANÇA

**NUNCA compartilhe seu arquivo `.env` com valores reais publicamente!**

Se você acidentalmente compartilhou suas API keys:
1. ✅ **ROTACIONAR TODAS AS CHAVES IMEDIATAMENTE**
2. ✅ Verificar logs de uso das APIs
3. ✅ Revogar chaves comprometidas

---

## ✅ Checklist de Variáveis de Ambiente

### Variáveis OBRIGATÓRIAS

- [ ] `EXPO_PUBLIC_SUPABASE_URL`
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL`

### Variáveis OPCIONAIS (mas recomendadas)

- [ ] `EXPO_PUBLIC_OPENAI_API_KEY` (para crise emocional)
- [ ] `EXPO_PUBLIC_CLAUDE_API_KEY` (para análise profunda)
- [ ] `EXPO_PUBLIC_PERPLEXITY_API_KEY` (para pesquisa)
- [ ] `EXPO_PUBLIC_SENTRY_DSN` (para error tracking)

### Variáveis NÃO USAR NO APP

- ❌ `EXPO_PUBLIC_GEMINI_API_KEY` - **DEPRECATED**
  - **Motivo**: API key do Gemini fica segura no Supabase Edge Function
  - **Ação**: Configure como SECRET no Supabase: `npx supabase secrets set GEMINI_API_KEY=xxx`
  - **Se você tem essa variável no .env, REMOVA imediatamente**

### Variáveis de Servidor (apenas para MCP local)

- `BRAVE_API_KEY` - Apenas se usar MCP server localmente (sem `EXPO_PUBLIC_`)

---

## 🔍 Problemas Comuns

### 1. Duplicação de Variáveis

❌ **ERRADO:**
```bash
EXPO_PUBLIC_OPENAI_API_KEY=key1
EXPO_PUBLIC_OPENAI_API_KEY=key2  # ← Duplicado!
```

✅ **CORRETO:**
```bash
EXPO_PUBLIC_OPENAI_API_KEY=key1  # Apenas uma vez
```

### 2. Variável Deprecated

❌ **ERRADO:**
```bash
EXPO_PUBLIC_GEMINI_API_KEY=xxx  # ← Não usar mais!
```

✅ **CORRETO:**
```bash
# Remover esta linha completamente
# API key vai no Supabase: npx supabase secrets set GEMINI_API_KEY=xxx
```

### 3. Comentários Mal Posicionados

❌ **ERRADO:**
```bash
EXPO_PUBLIC_OPENAI_API_KEY=key
  # OpenAI (recomendado para crise)  # ← Comentário depois de variável
  EXPO_PUBLIC_ANTHROPIC_API_KEY=key  # ← Indentação errada
```

✅ **CORRETO:**
```bash
# OpenAI (recomendado para crise)
EXPO_PUBLIC_OPENAI_API_KEY=key

# Anthropic (opcional)
EXPO_PUBLIC_CLAUDE_API_KEY=key
```

---

## 📋 Estrutura Correta do .env

```bash
# ============================================
# VARIÁVEIS PÚBLICAS (EXPO_PUBLIC_*)
# ===========================================

# Supabase - OBRIGATÓRIAS
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://xxx.supabase.co/functions/v1

# AI APIs - OPCIONAIS
EXPO_PUBLIC_OPENAI_API_KEY=xxx
EXPO_PUBLIC_CLAUDE_API_KEY=xxx
EXPO_PUBLIC_PERPLEXITY_API_KEY=xxx

# Sentry - OPCIONAL
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_GAMIFICATION=false

# ============================================
# VARIÁVEIS PRIVADAS (não usar no app)
# ============================================
# (todas comentadas - apenas para referência)
```

---

## 🧪 Como Validar

### 1. Verificar Tipos TypeScript

```bash
npm run type-check
```

### 2. Verificar se variáveis estão sendo usadas

```bash
# Buscar uso de variável específica
grep -r "EXPO_PUBLIC_OPENAI_API_KEY" src/
```

### 3. Validar que .env não está no git

```bash
# Verificar .gitignore
cat .gitignore | grep .env

# Verificar se .env foi commitado acidentalmente
git ls-files | grep .env
```

---

## 🚨 Rotação de Chaves (se comprometidas)

Se você compartilhou acidentalmente suas chaves:

### 1. OpenAI
- Acesse: https://platform.openai.com/api-keys
- Delete a chave antiga
- Crie uma nova

### 2. Anthropic (Claude)
- Acesse: https://console.anthropic.com/settings/keys
- Delete a chave antiga
- Crie uma nova

### 3. Supabase
- Acesse: https://app.supabase.com/project/_/settings/api
- Gere nova `anon key` (não afeta service role key)
- Atualize `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 4. Gemini
- Acesse: https://aistudio.google.com/app/apikey
- Delete a chave antiga
- Crie uma nova
- **IMPORTANTE**: Configure no Supabase: `npx supabase secrets set GEMINI_API_KEY=nova_chave`

---

## 📚 Referências

- [env.template](../env.template) - Template limpo
- [env.ts](../env.ts) - Tipagem TypeScript
- [setup-env.md](./setup-env.md) - Guia completo de setup

