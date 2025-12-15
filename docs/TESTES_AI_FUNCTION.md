# Testes da Edge Function /ai

## ✅ Teste Automatizado (Completo)

### Teste 1: 401 sem Authorization Header

**Status**: ✅ PASSOU

```bash
curl -X POST https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Oi"}],"provider":"claude"}'
```

**Resultado esperado**:
```json
{
  "code": 401,
  "message": "Missing authorization header"
}
```

**✅ Confirmado**: JWT é obrigatório, função está segura.

---

## 📱 Testes Manuais (Via App Mobile)

### Pré-requisito: Obter Token JWT

1. Abrir app mobile Nossa Maternidade
2. Fazer login com usuário válido
3. No código, adicionar log temporário:

```typescript
// src/api/ai-service.ts
const { data: { session } } = await supabase.auth.getSession();
console.log("ACCESS_TOKEN:", session.access_token);
```

4. Copiar o token do console

### Teste 2: 200 com Token Válido

**Comando**:
```bash
curl -X POST https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "messages": [{"role":"user","content":"Diga apenas Oi e nada mais."}],
    "provider": "claude"
  }'
```

**Resultado esperado**:
```json
{
  "content": "Oi!",
  "usage": {
    "promptTokens": 15,
    "completionTokens": 3,
    "totalTokens": 18
  },
  "provider": "claude",
  "latency": 1200,
  "fallback": false
}
```

**Validações**:
- ✅ Status 200
- ✅ `content` presente e coerente
- ✅ `provider` === "claude"
- ✅ `usage.totalTokens` > 0
- ✅ `latency` < 5000ms

---

### Teste 3: 429 Rate Limiting

**Objetivo**: Verificar que após 20 requests/min, retorna 429.

**Script de teste**:
```bash
# Fazer 21 requests rápidos (use seu token)
for i in {1..21}; do
  curl -X POST https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer SEU_TOKEN" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Teste $i\"}],\"provider\":\"claude\"}" \
    -w "\nStatus: %{http_code}\n" \
    -s -o /dev/null &
done
wait
```

**Resultado esperado**:
- Primeiros 20: Status 200
- Request 21+: Status 429

**Resposta 429**:
```json
{
  "code": 429,
  "message": "Rate limit exceeded. Try again in 60 seconds."
}
```

**Validações**:
- ✅ Rate limit ativa após 20 requests
- ✅ Retorna 429 com mensagem apropriada
- ✅ Usuários diferentes têm limites independentes

---

### Teste 4: Grounding com Google Search

**Comando**:
```bash
curl -X POST https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "messages": [{"role":"user","content":"O que é pré-eclâmpsia e quais os sintomas?"}],
    "provider": "gemini",
    "grounding": true
  }'
```

**Resultado esperado**:
```json
{
  "content": "Pré-eclâmpsia é uma condição...",
  "usage": {
    "promptTokens": 25,
    "completionTokens": 150,
    "totalTokens": 175
  },
  "provider": "gemini",
  "latency": 2500,
  "grounding": {
    "searchEntryPoint": { ... },
    "citations": [
      {
        "title": "Pré-eclâmpsia: sintomas, causas e tratamento",
        "url": "https://..."
      }
    ]
  }
}
```

**Validações**:
- ✅ Status 200
- ✅ `provider` === "gemini"
- ✅ `grounding.citations` presente
- ✅ Citations têm `title` e `url`
- ✅ URLs são de fontes confiáveis (Gov, OMS, Ministério da Saúde)

**⚠️ Nota**: Grounding pode falhar se:
- Gemini API estiver instável
- google_search tool desabilitado
- Quota do Gemini esgotada

---

### Teste 5: Fallback para OpenAI

**⚠️ Teste destrutivo** - Requer desabilitar Claude temporariamente.

**Passos**:
1. Desabilitar Claude API key:
   ```bash
   supabase secrets unset ANTHROPIC_API_KEY
   ```

2. Fazer request normal:
   ```bash
   curl -X POST https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer SEU_TOKEN" \
     -d '{
       "messages": [{"role":"user","content":"Oi"}],
       "provider": "claude"
     }'
   ```

3. **Resultado esperado**:
   ```json
   {
     "content": "Olá! Como posso ajudar?",
     "provider": "openai-fallback",
     "fallback": true,
     "latency": 1800
   }
   ```

4. **Restaurar Claude**:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

**Validações**:
- ✅ Status 200 (não falha)
- ✅ `provider` === "openai-fallback"
- ✅ `fallback` === true
- ✅ Resposta ainda é coerente

---

## 🎯 Checklist Completo

### Segurança
- [x] 401 sem Authorization header
- [ ] 401 com token inválido/expirado
- [ ] 403 se usuário não existir no banco
- [ ] API keys NÃO estão no bundle do app (verificar com apktool)

### Funcionalidade
- [ ] 200 com Claude (chat normal)
- [ ] 200 com Gemini (grounding)
- [ ] 200 com Claude Vision (imagem)
- [ ] Fallback Claude → OpenAI funciona
- [ ] Latência < 5s (P95)

### Rate Limiting
- [ ] 20 requests/min por usuário
- [ ] 429 após limite
- [ ] Limite reseta após 60s
- [ ] Usuários diferentes não interferem

### Validação de Payload
- [ ] Rejeita > 100 mensagens
- [ ] Rejeita mensagens > 4K chars
- [ ] Rejeita total > 200K chars
- [ ] Valida formato de AIMessage[]

### CORS
- [ ] Aceita requests de domínios permitidos
- [ ] Rejeita requests de domínios não permitidos
- [ ] OPTIONS (preflight) funciona

### Grounding
- [ ] Citations têm title + url
- [ ] URLs são relevantes à pergunta
- [ ] Funciona apenas com provider=gemini + grounding=true

### Monitoring
- [ ] Logs aparecem no Supabase Dashboard
- [ ] Requests são salvos em ai_requests (se tabela existe)
- [ ] Métricas de latência estão corretas

---

## 🚀 Teste de Integração (App Mobile)

### Fluxo completo no AssistantScreen:

1. **Usuário digita**: "Oi, NathIA!"
   - ✅ Chama `getNathIAResponse()`
   - ✅ Usa Claude (provider padrão)
   - ✅ Resposta com persona da Nathalia

2. **Usuário pergunta**: "O que é diabetes gestacional?"
   - ✅ `detectMedicalQuestion()` retorna true
   - ✅ Usa Gemini com grounding
   - ✅ Citations aparecem na UI

3. **Usuário envia imagem**: Ultrassom
   - ✅ `imageUriToBase64()` converte
   - ✅ Usa Claude Vision
   - ✅ Resposta analisa a imagem

4. **Usuário faz 25 perguntas rápidas**:
   - ✅ Primeiras 20 respondem
   - ✅ A partir da 21ª: erro "Muitas mensagens. Aguarde um minuto."

5. **Claude API offline** (simular):
   - ✅ Fallback automático para OpenAI
   - ✅ Usuário nem percebe (resposta continua vindo)

---

## 📊 Métricas de Sucesso

### Performance
- **Latência P50**: < 2s
- **Latência P95**: < 5s
- **Latência P99**: < 10s

### Custo
- **Target**: $60/mês (1000 usuários × 20 msgs)
- **Breakdown**:
  - Claude: $51/mês (85% dos requests)
  - Gemini: $2/mês (10% dos requests)
  - OpenAI: $6.50/mês (5% fallback + transcrição)

### Qualidade
- **Persona consistency**: > 95% (avaliação manual de 100 respostas)
- **Grounding accuracy**: > 90% (citations relevantes)
- **Fallback rate**: < 5% (Claude uptime > 95%)

---

## 🐛 Troubleshooting

### Erro: "Missing authorization header"
- **Causa**: JWT não enviado
- **Solução**: Verificar `Authorization: Bearer TOKEN` no header

### Erro: "Invalid or expired token"
- **Causa**: Token JWT inválido ou expirado
- **Solução**: Fazer novo login e obter token atualizado

### Erro: "Rate limit exceeded"
- **Causa**: Mais de 20 requests/min
- **Solução**: Aguardar 60s ou implementar throttling no client

### Erro: "Payload too large"
- **Causa**: Mensagens excedem limites
- **Solução**: Reduzir histórico de conversa ou tamanho das mensagens

### Erro: "Provider error: Claude API..."
- **Causa**: Claude API offline ou quota esgotada
- **Solução**: Verificar fallback ativou (provider=openai-fallback)

### Grounding não retorna citations
- **Causa**: google_search tool não encontrou resultados
- **Solução**: Refinar pergunta ou aceitar resposta sem grounding

---

## 📝 Notas

- **Teste 1** é o único 100% automatizado (não precisa token)
- **Testes 2-4** precisam de token JWT de usuário real
- **Teste 5** é destrutivo (desabilita Claude temporariamente)
- Rate limiting é **in-memory** (OK para MVP, migrar para Redis em produção)
- Grounding pode ter latência maior (2-5s vs 1-2s normal)
- Vision com imagens grandes (>5MB base64) pode exceder limites - adicionar validação futura

---

**Última atualização**: 2025-12-14
**Status**: ✅ Teste 1 automatizado passou, Testes 2-5 documentados para execução manual
