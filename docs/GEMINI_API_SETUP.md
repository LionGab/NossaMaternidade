# 🔑 Configuração da API Key do Gemini

## ⚠️ IMPORTANTE - Segurança

**A API key do Gemini NÃO deve ser colocada no arquivo `.env` do app mobile!**

Por questões de segurança, a chave deve estar **APENAS** no Supabase Edge Function como um **SECRET**.

---

## ✅ Passo a Passo - Configurar Gemini API Key no Supabase

### 1. Configurar como Secret no Supabase

```bash
# No terminal, execute:
npx supabase secrets set GEMINI_API_KEY=AIzaSyAIeeowYR4ca0d1i90EzHBei1onI2b3lBw
```

### 2. Verificar se foi configurado

```bash
# Listar todos os secrets (não mostra valores, apenas nomes)
npx supabase secrets list
```

### 3. Usar no Edge Function

A Edge Function `chat-gemini` já está configurada para ler este secret:

```typescript
// supabase/functions/chat-gemini/index.ts
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
```

---

## 🔒 Por que NÃO colocar no .env do app?

1. **Segurança**: A chave ficaria exposta no bundle do app
2. **Controle**: No Supabase, você pode rotacionar chaves sem rebuild do app
3. **Rate Limiting**: Melhor controle de uso e limites
4. **LGPD**: Mais seguro para dados sensíveis

---

## 📋 Checklist

- [ ] ✅ Secret configurado no Supabase: `GEMINI_API_KEY`
- [ ] ❌ **NÃO** adicionar `EXPO_PUBLIC_GEMINI_API_KEY` no `.env`
- [ ] ✅ Edge Function `chat-gemini` usando o secret
- [ ] ✅ Testar chamada da Edge Function

---

## 🧪 Como Testar

### 1. Testar Edge Function localmente

```bash
# Iniciar Supabase local
npx supabase start

# Testar a função
curl -X POST http://localhost:54321/functions/v1/chat-gemini \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, NathIA!"}'
```

### 2. Testar no app

A Edge Function será chamada automaticamente quando o app usar o chat da NathIA.

---

## 🔄 Se precisar rotacionar a chave

```bash
# 1. Gerar nova chave no Google AI Studio
# https://aistudio.google.com/app/apikey

# 2. Atualizar secret no Supabase
npx supabase secrets set GEMINI_API_KEY=nova_chave_aqui

# 3. Deploy da Edge Function (se necessário)
npx supabase functions deploy chat-gemini
```

---

## 📚 Referências

- [Supabase Secrets](https://supabase.com/docs/guides/functions/secrets)
- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Edge Functions Documentation](../supabase/functions/chat-gemini/README.md)

---

**⚠️ NOTA:** A chave compartilhada (`AIzaSyAIeeowYR4ca0d1i90EzHBei1onI2b3lBw`) foi configurada no Supabase. Se ela foi exposta publicamente, considere rotacioná-la gerando uma nova no Google AI Studio.
