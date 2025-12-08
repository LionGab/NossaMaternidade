# 🤖 Modelos de IA Recomendados - Dezembro 2025

> Guia de seleção e uso de modelos de IA para o app Nossa Maternidade

---

## 1. Estratégia Geral

### Princípio: Custo-Benefício com Segurança

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTRATÉGIA DE ROUTING                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  90% dos casos ──► Gemini 2.5 Flash (barato, rápido)        │
│       │                                                      │
│       └─► Crise detectada? ──► GPT-4o (segurança máxima)    │
│                                                              │
│  Fallback automático: Flash → GPT-4o → Claude Opus          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Por que essa estratégia?

| Razão | Explicação |
|-------|------------|
| **Custo** | Gemini Flash é 50x mais barato que GPT-4o |
| **Velocidade** | Flash responde em <1s, GPT-4o em 2-5s |
| **Segurança** | GPT-4o tem melhores guardrails para crise |
| **Resiliência** | Se um provider cair, outro assume |

---

## 2. Modelos Recomendados

### Tabela Comparativa (Dezembro 2025)

| Modelo | Provider | Custo/1M tokens | Latência | Uso Recomendado |
|--------|----------|-----------------|----------|-----------------|
| **Gemini 2.5 Flash** | Google | ~$0.10 | <1s | Chat normal (90%) |
| **Gemini 2.5 Pro** | Google | ~$1.25 | 2-3s | Análises profundas |
| **GPT-4o** | OpenAI | ~$5.00 | 2-4s | Detecção de crise |
| **GPT-4o-mini** | OpenAI | ~$0.30 | 1-2s | Moderação rápida |
| **Claude 3.5 Sonnet** | Anthropic | ~$3.00 | 2-3s | Análise emocional |
| **Claude Opus** | Anthropic | ~$15.00 | 3-5s | Último fallback |

### Detalhamento por Modelo

#### Gemini 2.5 Flash (Principal)

```yaml
Provider: Google AI
Modelo: gemini-2.5-flash-preview-05-20 (ou mais recente)
Custo: ~$0.10/1M tokens (input) | ~$0.40/1M tokens (output)
Contexto: 1M tokens
Latência: <1 segundo

Pontos fortes:
  - Extremamente rápido
  - Muito barato
  - Bom para conversação
  - Suporta português brasileiro

Pontos fracos:
  - Guardrails menos robustos que GPT-4o
  - Pode ser inconsistente em casos de crise

Quando usar:
  - 90% do chat normal
  - Perguntas gerais sobre maternidade
  - Validação emocional básica
  - Desafios do dia
```

#### GPT-4o (Segurança)

```yaml
Provider: OpenAI
Modelo: gpt-4o
Custo: ~$5.00/1M tokens (input) | ~$15.00/1M tokens (output)
Contexto: 128K tokens
Latência: 2-4 segundos

Pontos fortes:
  - Guardrails de segurança robustos
  - Excelente detecção de crise
  - Respostas empáticas em situações difíceis
  - Melhor em nuances emocionais

Pontos fracos:
  - 50x mais caro que Flash
  - Mais lento

Quando usar:
  - Detecção de crise ativada
  - Ideação suicida detectada
  - Depressão pós-parto
  - Violência doméstica
```

#### Claude 3.5 Sonnet (Análise)

```yaml
Provider: Anthropic
Modelo: claude-3-5-sonnet-20241022
Custo: ~$3.00/1M tokens (input) | ~$15.00/1M tokens (output)
Contexto: 200K tokens
Latência: 2-3 segundos

Pontos fortes:
  - Excelente análise emocional
  - Nuances em português
  - Bom para moderação de conteúdo
  - Respostas bem estruturadas

Pontos fracos:
  - Mais caro que Flash
  - Menos disponível que Gemini/OpenAI

Quando usar:
  - Análise profunda de sentimentos
  - Moderação de comunidade
  - Casos complexos de relacionamento
```

#### Claude Opus (Fallback Premium)

```yaml
Provider: Anthropic
Modelo: claude-3-opus-20240229
Custo: ~$15.00/1M tokens (input) | ~$75.00/1M tokens (output)
Contexto: 200K tokens
Latência: 3-5 segundos

Pontos fortes:
  - Modelo mais capaz da Anthropic
  - Excelente raciocínio
  - Análises muito detalhadas

Pontos fracos:
  - MUITO caro
  - Lento

Quando usar:
  - Apenas como último fallback
  - Quando Gemini E GPT-4o falharem
```

---

## 3. Arquitetura de Routing (Implementada)

### Fluxo de Decisão

```
┌──────────────────┐
│  Mensagem chega  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌─────────────────┐
│ Detecção de      │ SIM │  Usar GPT-4o    │
│ Crise (sync)?    │────►│  (segurança)    │
└────────┬─────────┘     └─────────────────┘
         │ NÃO
         ▼
┌──────────────────┐
│ Usar Gemini Flash│
│ (default)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌─────────────────┐
│ Gemini falhou?   │ SIM │  Tentar GPT-4o  │
└────────┬─────────┘────►│  (fallback)     │
         │ NÃO           └────────┬────────┘
         │                        │
         ▼                        ▼
┌──────────────────┐     ┌─────────────────┐
│ Retornar         │     │ GPT-4o falhou?  │
│ resposta         │     └────────┬────────┘
└──────────────────┘              │ SIM
                                  ▼
                         ┌─────────────────┐
                         │ Tentar Claude   │
                         │ Opus (último)   │
                         └─────────────────┘
```

### Código de Referência

```typescript
// src/services/aiRouter.ts

const config: RouterConfig = {
  defaultModel: 'gemini-1.5-flash',   // 90% dos casos
  crisisModel: 'gpt-4o',              // Segurança
  fallbackChain: ['gemini-1.5-flash', 'gpt-4o', 'claude-opus'],
  circuitBreakerThreshold: 5,         // Após 5 falhas, pausar
  maxRetries: 2,
  timeoutMs: 30000,                   // 30s timeout
};
```

---

## 4. Circuit Breaker

### O que é?

Sistema que **pausa tentativas** para um provider que está falhando, evitando:
- Custos desnecessários
- Timeouts repetidos
- Experiência ruim para usuária

### Como funciona?

```
Estado FECHADO (normal):
┌─────────┐    ┌─────────┐
│ Request │───►│ Provider│───► Sucesso
└─────────┘    └─────────┘

Após 5 falhas consecutivas:
┌─────────┐    ┌─────────┐
│ Request │───►│ CIRCUIT │───► Pula para próximo provider
└─────────┘    │ ABERTO  │
               └─────────┘

Após 5 minutos, tenta novamente:
┌─────────┐    ┌─────────┐
│ Request │───►│ HALF-   │───► Tenta 1x
└─────────┘    │ OPEN    │
               └─────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
Sucesso?              Falhou?
Reset circuit         Mantém aberto
```

---

## 5. Estimativa de Custos

### Cenário: 100.000 usuárias ativas/mês

| Item | Volume | Custo Estimado |
|------|--------|----------------|
| **Gemini Flash** (90%) | ~5M msgs | $100-300/mês |
| **GPT-4o** (crise ~5%) | ~250K msgs | $50-100/mês |
| **Claude** (fallback ~1%) | ~50K msgs | $20-50/mês |
| **Total IA** | | **$170-450/mês** |

### Cenário: 500.000 usuárias ativas/mês

| Item | Volume | Custo Estimado |
|------|--------|----------------|
| **Gemini Flash** (90%) | ~25M msgs | $500-1500/mês |
| **GPT-4o** (crise ~5%) | ~1.25M msgs | $250-500/mês |
| **Claude** (fallback ~1%) | ~250K msgs | $100-250/mês |
| **Total IA** | | **$850-2250/mês** |

### Otimizações de Custo

1. **Cache de respostas similares** - Perguntas frequentes
2. **Rate limiting** - 50 msgs/dia grátis, premium ilimitado
3. **Respostas pré-computadas** - FAQs, saudações
4. **Streaming** - Não reprocessar mensagens inteiras
5. **Compressão de contexto** - Resumir histórico longo

---

## 6. Configuração por Ambiente

### Desenvolvimento

```typescript
const DEV_CONFIG = {
  defaultModel: 'gemini-1.5-flash',
  enableFallback: true,
  logAllRequests: true,
  mockCrisis: false,
};
```

### Staging

```typescript
const STAGING_CONFIG = {
  defaultModel: 'gemini-1.5-flash',
  enableFallback: true,
  logAllRequests: true,
  enableCostTracking: true,
};
```

### Produção

```typescript
const PROD_CONFIG = {
  defaultModel: 'gemini-1.5-flash',
  crisisModel: 'gpt-4o',
  fallbackChain: ['gemini-1.5-flash', 'gpt-4o', 'claude-opus'],
  circuitBreakerThreshold: 5,
  enableCostTracking: true,
  alertOnHighCost: true,
  costAlertThreshold: 1000, // $1000/dia
};
```

---

## 7. Métricas a Monitorar

### Qualidade

| Métrica | Meta | Alerta |
|---------|------|--------|
| Latência P50 | <2s | >3s |
| Latência P99 | <5s | >10s |
| Taxa de erro | <1% | >5% |
| Fallback rate | <5% | >15% |

### Custo

| Métrica | Meta | Alerta |
|---------|------|--------|
| Custo/usuária/mês | <$0.05 | >$0.10 |
| Custo diário | Variável | +50% do normal |
| GPT-4o usage | <10% | >20% |

### Segurança

| Métrica | Meta | Alerta |
|---------|------|--------|
| Crises detectadas | Monitorar | Pico repentino |
| Recursos mostrados | 100% das crises | <95% |
| Follow-up rate | >80% | <50% |

---

## 8. Troubleshooting

### Provider não responde

```bash
# Verificar status dos providers
curl https://status.openai.com/api/v2/status.json
curl https://status.cloud.google.com/

# Forçar fallback manual
aiRouter.markProviderFailed('gemini');
```

### Custos disparando

```bash
# Verificar estatísticas
const stats = aiRouter.getStats();
console.log(stats.costs);

# Identificar modelo mais custoso
# Verificar se GPT-4o está sendo usado demais
# Revisar threshold de detecção de crise
```

### Respostas inadequadas

```bash
# Verificar qual modelo respondeu
const response = await aiRouter.route(message, context);
console.log(response.model_used);

# Se Flash dando respostas ruins em crise:
# Ajustar threshold de detecção
```

---

## 9. Próximos Passos Recomendados

### Curto Prazo (1-2 semanas)

- [ ] Configurar API keys de produção
- [ ] Testar fallback em staging
- [ ] Definir alertas de custo

### Médio Prazo (1-2 meses)

- [ ] Implementar cache de respostas
- [ ] Fine-tune de detecção de crise
- [ ] Dashboard de monitoramento

### Longo Prazo (3-6 meses)

- [ ] Avaliar fine-tuning de modelo próprio
- [ ] A/B testing de modelos
- [ ] Otimização de prompts por performance

---

*Documento criado em Dezembro 2025 para o projeto Nossa Maternidade / NathIA*
