# 🤖 Modelos de IA Recomendados - Dezembro 2025

> Guia de escolha de modelos para o app NathIA

---

## Estratégia de Custos

```
┌─────────────────────────────────────────────────────────┐
│  DISTRIBUIÇÃO RECOMENDADA                               │
├─────────────────────────────────────────────────────────┤
│  90% → Gemini 2.5 Flash  - Chat normal                  │
│   5% → GPT-4o            - Detecção de crise            │
│   5% → Claude 3.5 Sonnet - Análises complexas/fallback  │
└─────────────────────────────────────────────────────────┘
```

---

## Comparativo de Modelos

### 1. Gemini 2.5 Flash (Google)

| Aspecto | Valor |
|---------|-------|
| **Custo** | $0.10 / 1M tokens |
| **Velocidade** | Muito rápida |
| **Qualidade** | Boa para chat geral |
| **Contexto** | 1M tokens |
| **Uso** | 90% das conversas |

**Quando usar:**
- Chat normal do dia a dia
- Perguntas sobre maternidade
- Dicas e conselhos gerais
- Respostas rápidas

**Configuração:**
```typescript
{
  model: 'gemini-2.5-flash',
  maxTokens: 1024,
  temperature: 0.7,
}
```

---

### 2. GPT-4o (OpenAI)

| Aspecto | Valor |
|---------|-------|
| **Custo** | $5.00 / 1M tokens |
| **Velocidade** | Moderada |
| **Qualidade** | Excelente |
| **Contexto** | 128K tokens |
| **Uso** | 5% (crises) |

**Quando usar:**
- Detecção de crise emocional
- Ideação suicida
- Depressão pós-parto
- Situações sensíveis

**Configuração:**
```typescript
{
  model: 'gpt-4o',
  maxTokens: 2048,
  temperature: 0.3, // Mais determinístico para segurança
}
```

**Palavras-chave para ativar:**
- "quero morrer"
- "não aguento mais"
- "me machucar"
- "suicídio"
- "desistir de tudo"

---

### 3. Claude 3.5 Sonnet (Anthropic)

| Aspecto | Valor |
|---------|-------|
| **Custo** | $3.00 / 1M tokens |
| **Velocidade** | Moderada |
| **Qualidade** | Excelente em contexto longo |
| **Contexto** | 200K tokens |
| **Uso** | 5% (fallback/análise) |

**Quando usar:**
- Fallback quando Gemini falha
- Análises longas e profundas
- Resumos de histórico
- Planos personalizados

**Configuração:**
```typescript
{
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 4096,
  temperature: 0.5,
}
```

---

## Tabela de Custos

| Modelo | Input | Output | Uso | Custo/100k msgs |
|--------|-------|--------|-----|-----------------|
| Gemini 2.5 Flash | $0.075/1M | $0.30/1M | 90% | ~$27 |
| GPT-4o | $2.50/1M | $10/1M | 5% | ~$62 |
| Claude 3.5 Sonnet | $3/1M | $15/1M | 5% | ~$90 |

**Estimativa mensal para 100k usuárias:**
- Assumindo 10 mensagens/usuária/mês
- 1M mensagens totais
- **Custo total: $350-600/mês**

---

## Arquitetura de Roteamento

```
┌──────────────────┐
│   Mensagem       │
│   da Usuária     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Classificador   │◄─── Detecta intenção e urgência
│  de Intenção     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Normal │ │ Crise  │
└────┬───┘ └────┬───┘
     │          │
     ▼          ▼
┌────────┐ ┌────────┐
│ Gemini │ │ GPT-4o │
│ Flash  │ │        │
└────────┘ └────────┘
```

---

## Implementação no Código

### aiRouter.ts
```typescript
export async function routeMessage(message: string, context: ChatContext) {
  // 1. Detectar crise
  const isCrisis = detectCrisis(message);

  if (isCrisis) {
    return {
      model: 'gpt-4o',
      addDisclaimer: true,
      suggestHelp: true,
    };
  }

  // 2. Default: Gemini Flash
  return {
    model: 'gemini-2.5-flash',
    addDisclaimer: false,
    suggestHelp: false,
  };
}

function detectCrisis(message: string): boolean {
  const crisisKeywords = [
    'quero morrer',
    'me matar',
    'suicídio',
    'não aguento mais',
    'desistir de tudo',
    'me machucar',
    'acabar com tudo',
  ];

  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}
```

---

## Guardrails de Segurança

### Para TODA resposta de IA:
```typescript
const DISCLAIMER = `
⚠️ Lembre-se: Sou uma IA e não substituo profissionais de saúde.
Se você está passando por dificuldades, procure ajuda profissional.
`;
```

### Para respostas de CRISE:
```typescript
const CRISIS_RESPONSE = `
🆘 Percebo que você está passando por um momento muito difícil.
Você não está sozinha.

📞 Ligue agora para o CVV: 188 (24h, gratuito)
💬 Ou acesse: www.cvv.org.br

Estou aqui para ouvir, mas um profissional pode te ajudar melhor.
`;
```

---

## Monitoramento

### Métricas a Acompanhar
| Métrica | Alvo |
|---------|------|
| Latência Gemini | < 2s |
| Latência GPT-4o | < 5s |
| Taxa de erro | < 1% |
| Custo/usuária | < $0.01/msg |
| Crises detectadas | 100% |

### Alertas
- Custo > $100/dia → Alerta Slack
- Taxa de erro > 5% → Circuit breaker
- Crise não respondida → Alerta crítico

---

## Configuração de Ambiente

```bash
# .env
# Gemini (principal)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key

# OpenAI (crise)
OPENAI_API_KEY=your_openai_key

# Anthropic (fallback)
ANTHROPIC_API_KEY=your_anthropic_key

# Configuração
AI_DEFAULT_MODEL=gemini-2.5-flash
AI_CRISIS_MODEL=gpt-4o
AI_FALLBACK_MODEL=claude-3-5-sonnet
```

---

## Referências de Preços (Dez/2025)

| Provider | Modelo | Input | Output |
|----------|--------|-------|--------|
| Google | Gemini 2.5 Flash | $0.075/1M | $0.30/1M |
| Google | Gemini 2.5 Pro | $1.25/1M | $5/1M |
| OpenAI | GPT-4o | $2.50/1M | $10/1M |
| OpenAI | GPT-4o-mini | $0.15/1M | $0.60/1M |
| Anthropic | Claude 3.5 Sonnet | $3/1M | $15/1M |
| Anthropic | Claude 3.5 Haiku | $0.25/1M | $1.25/1M |

---

*Última atualização: 08/12/2025*
*Preços sujeitos a alteração pelos providers*
