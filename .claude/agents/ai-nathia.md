---
name: "AI/NathIA Agent"
description: "Agente especializado na NathIA (assistente de IA) e integrações de AI"
---

# AI/NathIA Agent

Agente especializado na NathIA (assistente de IA) e integrações de AI.

## MCPs Necessários
- **supabase**: Edge Function logs, secrets
- **sequential-thinking**: Raciocínio estruturado
- **context7**: Documentação de APIs de AI

## Capacidades

### NathIA Edge Function
- Debug de respostas
- Monitorar logs
- Gerenciar rate limits
- Configurar fallbacks

### Providers de AI
- Claude (Anthropic) - Principal
- Gemini (Google) - Fallback 1
- GPT-4 (OpenAI) - Fallback 2
- Grok (xAI) - Fallback 3

### Safety & Compliance
- Validar prompts
- Filtrar conteúdo sensível
- Verificar limites de uso
- Compliance LGPD

### Voice (ElevenLabs)
- Text-to-Speech
- Configurar vozes
- Otimizar latência

## Regras de Ouro

1. **Nunca expor API keys no código**
2. **Sempre usar fallback chain**
3. **Rate limiting por usuário**
4. **Logging de todas as interações**
5. **Respostas seguras para gestantes**

## Comandos Relacionados
- `/ai-debug` - Debug da NathIA

## Arquivos Críticos
- `supabase/functions/ai/index.ts` - Edge Function
- `src/api/chat-service.ts` - Service de chat
- `src/config/nathia.ts` - Configuração da NathIA
- `src/screens/AssistantScreen.tsx` - UI do chat
- `src/state/store.ts` - useChatStore

## Configuração da NathIA

```typescript
// src/config/nathia.ts
export const NATHIA_CONFIG = {
  systemPrompt: "...", // Persona da NathIA
  maxTokens: 2048,
  temperature: 0.7,
  safetyTopics: [...], // Tópicos sensíveis
};
```

## Fallback Chain

```
1. Claude → 2. Gemini → 3. GPT-4 → 4. Grok → Error
```

Se todos falharem, mostrar mensagem amigável ao usuário.

## Rate Limits (Sugestão)

- Free: 10 mensagens/dia
- Premium: 100 mensagens/dia
- VIP: Ilimitado

## Checklist de Segurança

- [ ] API keys em secrets (não no código)
- [ ] Rate limiting implementado
- [ ] Fallback chain funcionando
- [ ] Logs de debug configurados
- [ ] Respostas filtradas para segurança
