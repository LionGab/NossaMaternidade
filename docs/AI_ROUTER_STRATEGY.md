# 🎯 Estratégia de IA: Gemini 2.5 Flash Focus

## 📊 Visão Geral

Sistema robusto focado em **custo-benefício**, priorizando Gemini 2.5 Flash para 90%+ dos casos, com fallback inteligente e segurança em crise.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    ChatService                          │
│  (recebe mensagem da usuária)                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    AIRouter                            │
│  • Detecta crise (sync, rápido)                       │
│  • Escolhe modelo inicial                              │
│  • Gerencia fallback automático                        │
│  • Circuit breaker                                     │
│  • Tracking de custos                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    AIClient                            │
│  • Chama Edge Function apropriada                      │
│  • Suporta Tool Calling                                │
│  • Trata respostas e erros                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Edge Functions                   │
│  • chat-ai (Gemini)                                    │
│  • chat-ai-openai (GPT-4o)                            │
│  • chat-ai-claude (Claude Opus)                       │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Fluxo de Decisão

```
Mensagem da Usuária
        │
        ▼
┌───────────────────┐
│ Detecta Crise?    │ ← Sync, rápido (pattern matching)
└───┬───────────┬───┘
    │           │
   SIM         NÃO
    │           │
    ▼           ▼
┌─────────┐  ┌──────────────┐
│ GPT-4o  │  │ Gemini Flash │ ← 90%+ dos casos
└────┬────┘  └──────┬───────┘
     │              │
     └──────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Chama IA      │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Sucesso?      │
    └───┬───────┬───┘
        │       │
       SIM     NÃO
        │       │
        ▼       ▼
    Retorna  Fallback
    Resposta  Próximo
              Modelo
```

## 💰 Análise de Custos

### Custo por 1.000 Tokens

| Modelo | Input | Output | Total (70/30) |
|--------|-------|--------|---------------|
| Gemini 2.5 Flash | $0.0001 | $0.0002 | **$0.00013** |
| GPT-4o | $0.005 | $0.015 | **$0.008** |
| Claude Opus | $0.015 | $0.075 | **$0.033** |

### Cenário Real: 10.000 mensagens/mês

**Assumindo:**
- 500 tokens médios por mensagem
- 70% input, 30% output
- 90% Flash, 9% GPT-4o, 1% Claude

**Cálculo:**
```
Flash:    9.000 msgs × 500 tokens × $0.00013 = $0.585
GPT-4o:     900 msgs × 500 tokens × $0.008   = $3.600
Claude:     100 msgs × 500 tokens × $0.033   = $1.650
─────────────────────────────────────────────────────
TOTAL:                                    ~$5.84/mês
```

**Conclusão:** Custo extremamente baixo mesmo em escala!

## 🔒 Segurança em Crise

### Quando Usa GPT-4o (Não Flash)

1. **Crise detectada** (pattern matching)
   - Keywords: "suicídio", "não aguento mais", etc.
   - Nível: critical/severe

2. **Padrão emocional negativo**
   - Histórico: 60%+ emoções negativas
   - Duração: 7+ dias consecutivos

3. **Solicitação explícita**
   - Usuária pede ajuda profissional
   - Menciona necessidade de terapia

### Por Que GPT-4o em Crise?

- ✅ Moderação integrada melhor
- ✅ Safety features mais robustas
- ✅ Respostas mais consistentes
- ✅ Menos chance de alucinações
- ✅ Custo aceitável para casos críticos

## 🛡️ Circuit Breaker

### Como Funciona

```
Falha 1 → Registra
Falha 2 → Registra
Falha 3 → Registra
Falha 4 → Registra
Falha 5 → CIRCUIT ABERTO (pausa tentativas)
         ↓
    Aguarda 5min
         ↓
    Reset automático
```

### Benefícios

- ✅ Evita custos desnecessários
- ✅ Protege contra problemas persistentes
- ✅ Reset automático após cooldown
- ✅ Transparente para usuário

## 📈 Monitoramento

### Estatísticas Disponíveis

```typescript
const stats = aiRouter.getStats();

// Custos acumulados por modelo
stats.costs = {
  'gemini-1.5-flash': 0.45,
  'gpt-4o': 2.25,
  'claude-opus': 0.75,
};

// Estado dos circuit breakers
stats.circuitBreakers = {
  'gemini-1.5-flash': {
    failures: 0,
    isOpen: false,
  },
  // ...
};
```

### Reset Mensal

```typescript
// No início de cada mês
aiRouter.resetStats();
```

## ✅ Vantagens da Estratégia

1. **💰 Custo Baixo**
   - 90%+ usa Flash (mais barato)
   - Apenas crise usa GPT-4o (justificado)

2. **🚀 Performance**
   - Flash é rápido (<1s resposta)
   - Fallback automático garante resposta

3. **🔒 Segurança**
   - GPT-4o em crise (não economiza em segurança)
   - Detecção sync e rápida

4. **🛡️ Confiabilidade**
   - Fallback automático
   - Circuit breaker evita loops
   - Retry inteligente

5. **📊 Monitorável**
   - Tracking completo de custos
   - Estatísticas por modelo
   - Logging detalhado

## 🎯 Próximos Passos

### Fase 1 (MVP) ✅
- [x] Router implementado
- [x] Circuit breaker funcionando
- [x] Tracking de custos
- [x] Fallback automático

### Fase 2 (Ampliação)
- [ ] Dashboard de monitoramento
- [ ] Alertas de custo (ex: >$50/mês)
- [ ] Cache de respostas frequentes
- [ ] A/B testing de modelos

### Fase 3 (Otimização)
- [ ] Machine learning para escolha de modelo
- [ ] Previsão de custos mensais
- [ ] Otimização automática de prompts
- [ ] Rate limiting inteligente

## 📝 Conclusão

Esta estratégia oferece:
- ✅ **Custo mínimo** (90% Flash)
- ✅ **Segurança máxima** (GPT-4o em crise)
- ✅ **Confiabilidade alta** (fallback automático)
- ✅ **Monitoramento completo** (estatísticas)

**Ideal para MVP e escalabilidade!** 🚀

