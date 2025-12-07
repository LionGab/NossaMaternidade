# 🏗️ Arquitetura NathIA - Documento Completo

**Data:** 6 de dezembro de 2025  
**Versão:** 2.0  
**Status:** ✅ Ativo e em Produção

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura Multi-Provider](#arquitetura-multi-provider)
3. [Sistema de Agentes](#sistema-de-agentes)
4. [Fluxo de Processamento](#fluxo-de-processamento)
5. [Roteamento Inteligente](#roteamento-inteligente)
6. [Moderação e Segurança](#moderação-e-segurança)
7. [Observabilidade e Custos](#observabilidade-e-custos)
8. [MCP Architecture](#mcp-architecture)
9. [Design System Integration](#design-system-integration)
10. [Performance e Otimizações](#performance-e-otimizações)

---

## 🎯 Visão Geral

**NathIA** é o assistente virtual de IA do app Nossa Maternidade, projetado para oferecer apoio emocional, informações relevantes e acompanhamento personalizado para mães brasileiras.

### Princípios Fundamentais

1. **Autenticidade**: Voz da Nathália Valente (real, vulnerável, firme, sem "guru vibes")
2. **Segurança**: Detecção de crise emocional com redirecionamento para profissionais
3. **Multi-Provider**: Fallback automático entre Gemini, OpenAI e Claude
4. **Contextualização**: Personalização baseada em perfil, emoções e estágio da gravidez
5. **LGPD Compliant**: Privacidade e segurança de dados em primeiro lugar

---

## 🌐 Arquitetura Multi-Provider

### Stack de IA

| Caso de Uso | Primary | Fallback 1 | Fallback 2 |
|-------------|---------|-----------|-----------|
| Chat NathIA (default) | Gemini 2.5 Flash | GPT-4o | Claude Opus 4 |
| Crise emocional | GPT-4o (safety) | Gemini 2.5 Flash thinking | Claude Opus 4 |
| Análise profunda | Gemini 2.5 Flash thinking | Claude Opus 4 | — |
| Mensagens curtas | Gemini 2.5 Flash-Lite | Gemini 2.5 Flash | GPT-4o-mini |
| Embeddings | Gemini 1.5 | OpenAI text-embed-3 | — |
| Moderação conteúdo | Claude API | OpenAI Moderation | — |

### Perfis de Modelo (`src/ai/llmConfig.ts`)

```typescript
type LlmProfile =
  | 'CHAT_DEFAULT'      // Gemini 2.5 Flash - conversas gerais
  | 'CHAT_CHEAP'        // Gemini 2.5 Flash-Lite - mensagens curtas
  | 'CRISIS_SAFE'       // GPT-4o - crise emocional
  | 'ANALYSIS_DEEP'     // Gemini 2.5 Flash - análises profundas
  | 'AGENT_MAX';        // Claude Opus 4 - contexto extremo
```

### Configuração de Modelos

```typescript
interface LlmModelConfig {
  provider: 'gemini' | 'openai' | 'anthropic';
  modelName: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  topK?: number;
  costPer1kTokens?: {
    input: number;  // USD
    output: number; // USD
  };
}
```

---

## 🤖 Sistema de Agentes

### Estrutura Hierárquica

```
AgentOrchestrator (core/AgentOrchestrator.ts)
│
├── NathiaPersonalityAgent (nathia/NathiaPersonalityAgent.ts)
│   └── Garante autenticidade da voz + previne conselhos médicos
│
├── MaternalChatAgent (maternal/MaternalChatAgent.ts)
│   └── Chat principal com contexto maternal
│
├── EmotionAnalysisAgent (emotion/EmotionAnalysisAgent.ts)
│   └── Análise de sentimentos e padrões emocionais
│
├── HabitsAnalysisAgent (habits/HabitsAnalysisAgent.ts)
│   └── Análise de hábitos e rastreamento de progresso
│
├── ContentRecommendationAgent (content/ContentRecommendationAgent.ts)
│   └── Recomendação personalizada de conteúdo
│
├── SleepAnalysisAgent (sleep/SleepAnalysisAgent.ts)
│   └── Análise de padrões de sono
│
└── ProjectHealthAgent (health/ProjectHealthAgent.ts)
    └── Monitoramento de saúde do projeto (dev)
```

### AgentOrchestrator

**Responsabilidades:**

- Inicialização de agentes (lazy loading)
- Roteamento de requisições para agentes apropriados
- Gerenciamento de ciclo de vida (initialize, execute, shutdown)
- Integração com MCP servers
- Fallback automático entre providers

**Fluxo:**

```typescript
orchestrator.execute({
  agent: 'maternal-chat',
  input: message,
  context: {
    userId,
    emotion,
    lifeStage,
    conversationHistory
  }
})
```

### NathiaPersonalityAgent

**Princípios Inegociáveis:**

1. ✅ NUNCA fugir do contexto maternal
2. ✅ NUNCA dar conselhos médicos
3. ✅ SEMPRE validar emocionalmente ANTES de orientar
4. ✅ SEMPRE redirecionar para profissionais quando necessário
5. ✅ Falar como a Nathália: real, vulnerável, firme, sem guru vibes

**Detecção de Crise:**

- Keywords: `['suicídio', 'me matar', 'machucar o bebê', ...]`
- Auto-escala para `CRISIS_SAFE` (GPT-4o)
- Resposta com recursos de ajuda imediata

**Prevenção de Conselhos Médicos:**

- Flags médicos: `['você deve tomar', 'tome esse medicamento', 'diagnóstico', ...]`
- Bloqueio automático + redirecionamento para profissional

---

## 🔄 Fluxo de Processamento

### Fluxo Completo de uma Mensagem

```
1. Usuário envia mensagem
   ↓
2. ChatScreen → useNathIA hook
   ↓
3. NathiaPersonalityAgent.detectCrisis() [SYNC]
   ├── Se crise → CRISIS_SAFE (GPT-4o)
   └── Se normal → llmRouter.selectLlmProfile()
   ↓
4. AgentOrchestrator.execute()
   ├── Carrega agent apropriado (lazy)
   ├── Valida contexto (emotion, lifeStage, history)
   ├── Seleciona MCP server (googleai/openai/anthropic)
   └── Prepara prompt com system prompt + contexto
   ↓
5. MCP Server → LLM API
   ├── Tenta provider primário
   ├── Se falha → fallback automático
   └── Se todos falham → erro graceful
   ↓
6. NathiaPersonalityAgent.validateResponse()
   ├── Valida tom (não pode ser médico)
   ├── Valida contexto (deve ser maternal)
   └── Ajusta se necessário
   ↓
7. Response → ChatScreen
   ├── Salva em Supabase (chat_messages)
   ├── Track analytics (tokens, custo, provider)
   └── Anuncia para screen reader
```

### Detalhamento por Camada

#### 1. UI Layer (`src/screens/ChatScreen.tsx`)

```typescript
const { sendMessage, messages, isLoading } = useNathIA({
  userId: profile.id,
  initialContext: {
    emotion: todayEmotion,
    lifeStage: profile.lifeStage
  }
});
```

**Componentes:**

- `ChatScreen`: Tela principal
- `ChatBubble`: Bolha de mensagem (user/assistant)
- `ChatHeader`: Header com modo (flash/deep)
- `ChatEmptyState`: Estado vazio empático
- `NathIAChatInput`: Input com voice mode
- `TypingIndicator`: Indicador de digitação

#### 2. Hook Layer (`src/features/nathia/hooks/useNathIA.ts`)

```typescript
interface UseNathIAOptions {
  userId: string;
  initialContext?: {
    emotion?: string;
    lifeStage?: string;
  };
  chatMode?: 'flash' | 'deep';
}

interface UseNathIAResult {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}
```

**Responsabilidades:**

- Gerencia estado de mensagens
- Integra com `chatService`
- Cache local (AsyncStorage)
- Sincronização com Supabase

#### 3. Service Layer (`src/services/chatService.ts`)

```typescript
export const chatService = {
  async sendMessage(message: string, context: ChatContext): Promise<ChatResponse> {
    // 1. Detectar crise (sync)
    const crisisCheck = CrisisDetectionService.detectCrisisSync(message);
    
    // 2. Selecionar perfil LLM
    const profile = selectLlmProfile(message, context);
    
    // 3. Orquestrar agente
    const response = await orchestrator.execute({
      agent: 'maternal-chat',
      input: message,
      context: { ...context, crisisFlags: crisisCheck }
    });
    
    // 4. Salvar em Supabase
    await supabase.from('chat_messages').insert({
      user_id: context.userId,
      role: 'user',
      content: message
    });
    
    // 5. Retornar resposta
    return response;
  }
};
```

#### 4. Agent Layer (`src/agents/`)

**BaseAgent** (core/BaseAgent.ts):

```typescript
abstract class BaseAgent {
  abstract name: string;
  abstract description: string;
  abstract capabilities: string[];
  
  async initialize(): Promise<void>;
  async execute(input: AgentInput, context: AgentContext): Promise<AgentOutput>;
  async shutdown(): Promise<void>;
}
```

**MaternalChatAgent** (maternal/MaternalChatAgent.ts):

- Combina `NathiaPersonalityAgent` + `EmotionAnalysisAgent`
- Adiciona contexto de perfil (gravidez, pós-parto, etc.)
- Personaliza respostas baseado em histórico

#### 5. MCP Layer (`src/mcp/`)

**Servers:**

- `GoogleAIMCPServer.ts`: Gemini API
- `OpenAIMCPServer.ts`: GPT-4o / GPT-4o-mini
- `AnthropicMCPServer.ts`: Claude Opus 4 / Sonnet

**Abstração:**

```typescript
interface MCPServer {
  name: string;
  initialize(): Promise<void>;
  generate(prompt: string, config: LlmModelConfig): Promise<string>;
  isAvailable(): boolean;
}
```

---

## 🎯 Roteamento Inteligente

### llmRouter (`src/agents/helpers/llmRouter.ts`)

**Algoritmo de Seleção:**

```typescript
function selectLlmProfile(message: string, context?: Context): LlmProfile {
  // 1. PRIORIDADE MÁXIMA: Crise emocional
  if (CrisisDetectionService.detectCrisisSync(message).isCrisis) {
    return 'CRISIS_SAFE'; // GPT-4o
  }
  
  // 2. Ansiedade intensa
  if (hasAnxietyKeywords(message) && context?.emotion === 'anxious') {
    return 'CRISIS_SAFE';
  }
  
  // 3. Contexto complexo
  if (message.length > 500 || conversationDepth > 15) {
    return 'ANALYSIS_DEEP'; // Gemini Flash com mais tokens
  }
  
  // 4. Mensagens curtas
  if (message.length < 100) {
    return 'CHAT_CHEAP'; // Gemini Flash-Lite
  }
  
  // 5. Padrão
  return 'CHAT_DEFAULT'; // Gemini Flash
}
```

### Fallback Order

**Por Provider:**

```typescript
const fallbackMap = {
  googleai: ['googleai', 'openai', 'anthropic'],
  openai: ['openai', 'googleai', 'anthropic'],
  anthropic: ['anthropic', 'googleai', 'openai']
};
```

**Implementação:**

```typescript
async function generateWithFallback(
  prompt: string,
  profile: LlmProfile
): Promise<string> {
  const providers = getFallbackOrder(profile);
  
  for (const provider of providers) {
    try {
      const server = mcpServers.get(provider);
      if (server?.isAvailable()) {
        return await server.generate(prompt, config);
      }
    } catch (error) {
      logger.warn(`[${provider}] Falha, tentando próximo...`);
      continue;
    }
  }
  
  throw new Error('Todos os providers falharam');
}
```

---

## 🛡️ Moderação e Segurança

### CrisisDetectionService (`src/ai/moderation/CrisisDetectionService.ts`)

**Detecção Síncrona (Rápida):**

```typescript
function detectCrisisSync(message: string): CrisisCheck {
  const keywords = ['suicídio', 'me matar', 'machucar o bebê', ...];
  const lowerMessage = message.toLowerCase();
  
  const matchedKeywords = keywords.filter(kw => lowerMessage.includes(kw));
  
  return {
    isCrisis: matchedKeywords.length > 0,
    severity: matchedKeywords.length > 2 ? 'high' : 'medium',
    matchedKeywords,
    recommendedAction: 'redirect_to_professional'
  };
}
```

**Detecção Assíncrona (IA):**

- Usa Claude API para análise profunda
- Detecção de padrões sutis
- Análise de contexto emocional

### MedicalModerationService (`src/ai/moderation/MedicalModerationService.ts`)

**Prevenção de Conselhos Médicos:**

```typescript
function detectMedicalAdvice(response: string): MedicalCheck {
  const medicalFlags = [
    'você deve tomar',
    'tome esse medicamento',
    'diagnóstico',
    'prescrevo',
    'tratamento recomendado',
    ...
  ];
  
  const hasMedicalAdvice = medicalFlags.some(flag => 
    response.toLowerCase().includes(flag)
  );
  
  return {
    hasMedicalAdvice,
    blocked: hasMedicalAdvice,
    replacement: hasMedicalAdvice 
      ? "Por favor, consulte um profissional de saúde para orientações médicas."
      : null
  };
}
```

### Respostas de Crise

**Template:**

```typescript
const CRISIS_RESPONSE_TEMPLATE = `
Olá, querida. Percebi que você está passando por um momento muito difícil.

É importante que você saiba que você não está sozinha e que existe ajuda disponível:

🆘 **Recursos Imediatos:**
- CVV (Centro de Valorização da Vida): 188 (ligação gratuita)
- SAMU: 192
- Emergência: 190

👩‍⚕️ **Profissional de Saúde:**
Recomendo fortemente que você busque ajuda de um profissional de saúde mental ou entre em contato com seu obstetra/médico de confiança.

Você quer que eu te ajude a encontrar um profissional na sua região?
`;
```

---

## 📊 Observabilidade e Custos

### CostTracker (`src/ai/observability/CostTracker.ts`)

**Rastreamento:**

```typescript
class CostTracker {
  trackCall(params: {
    provider: LlmProvider;
    profile: LlmProfile;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }): void {
    // Log em Supabase (ai_usage_logs)
    // Analytics (evento)
    // Cache local (AsyncStorage)
  }
  
  getDailyCost(userId: string): Promise<number>;
  getMonthlyCost(userId: string): Promise<number>;
  getProviderBreakdown(): Promise<Record<LlmProvider, number>>;
}
```

**Estimativa de Custo:**

```typescript
function estimateCost(
  profile: LlmProfile,
  inputTokens: number,
  outputTokens: number
): number {
  const config = resolveModel(profile);
  const inputCost = (inputTokens / 1000) * config.costPer1kTokens.input;
  const outputCost = (outputTokens / 1000) * config.costPer1kTokens.output;
  return inputCost + outputCost;
}
```

### Métricas Rastreadas

- ✅ Tokens (input/output) por provider
- ✅ Custo por chamada
- ✅ Custo diário/mensal por usuário
- ✅ Taxa de sucesso por provider
- ✅ Tempo de resposta (latency)
- ✅ Taxa de fallback

---

## 🔌 MCP Architecture

### Estrutura MCP

```
MCP Servers (src/mcp/servers/)
│
├── GoogleAIMCPServer.ts
│   ├── Gemini 2.5 Flash
│   ├── Gemini 2.5 Flash-Lite
│   └── Gemini 1.5 (embeddings)
│
├── OpenAIMCPServer.ts
│   ├── GPT-4o
│   ├── GPT-4o-mini
│   └── text-embed-3-small (embeddings)
│
└── AnthropicMCPServer.ts
    ├── Claude Opus 4
    ├── Claude Sonnet 4.5
    └── Claude API (moderação)
```

### Interface MCP

```typescript
interface MCPServer {
  name: string;
  provider: LlmProvider;
  
  initialize(): Promise<void>;
  isAvailable(): boolean;
  
  generate(
    prompt: string,
    config: LlmModelConfig,
    context?: Message[]
  ): Promise<MCPResponse>;
  
  embed(texts: string[]): Promise<number[][]>;
  moderate(content: string): Promise<ModerationResult>;
}
```

### MCPLoader (`src/agents/core/MCPLoader.ts`)

**Lazy Loading:**

```typescript
class MCPLoader {
  private servers = new Map<string, MCPServer>();
  
  async loadServer(name: string): Promise<MCPServer> {
    if (this.servers.has(name)) {
      return this.servers.get(name)!;
    }
    
    const ServerClass = this.getServerClass(name);
    const server = new ServerClass();
    await server.initialize();
    
    this.servers.set(name, server);
    return server;
  }
}
```

---

## 🎨 Design System Integration

### Tokens Usados (`src/theme/tokens.ts`)

**Chat Colors:**

```typescript
Tokens.colors.chat.userBubble.bg.light
Tokens.colors.chat.userBubble.bg.dark
Tokens.colors.chat.aiBubble.bg.light
Tokens.colors.chat.aiBubble.bg.dark
Tokens.colors.chat.input.bg.light
Tokens.colors.chat.input.bg.dark
```

**NathIA Gradients:**

```typescript
ColorTokens.nathIA.gradient.light
ColorTokens.nathIA.gradient.dark
ColorTokens.nathIA.warm.light
ColorTokens.nathIA.warm.dark
```

**Spacing:**

```typescript
Tokens.spacing['1'] // 4px
Tokens.spacing['2'] // 8px
Tokens.spacing['4'] // 16px
```

**Touch Targets:**

```typescript
Tokens.touchTargets.min // 44pt (WCAG AAA)
```

### Componentes UI

- `ChatBubble`: Bolha reutilizável
- `ChatHeader`: Header com gradiente
- `ChatEmptyState`: Empty state empático
- `NathIAChatInput`: Input com voice mode
- `TypingIndicator`: Animação de digitação

---

## ⚡ Performance e Otimizações

### Otimizações Implementadas

1. **Lazy Loading de Agentes**: Agentes carregados sob demanda
2. **Cache de Mensagens**: AsyncStorage para histórico local
3. **Memoização**: React.memo, useMemo, useCallback
4. **FlashList**: Virtualização para listas longas
5. **Debounce**: Input com debounce para evitar chamadas excessivas
6. **Fallback Rápido**: Timeout de 5s por provider

### Métricas de Performance

- **Latency Target**: < 2s para resposta (flash mode)
- **Fallback Timeout**: 5s por provider
- **Cache Hit Rate**: > 80% para sugestões
- **Memory Usage**: < 50MB para chat screen

### Estratégias de Caching

**Mensagens:**

```typescript
// AsyncStorage
await AsyncStorage.setItem(
  `chat_history_${userId}`,
  JSON.stringify(messages)
);
```

**Sugestões:**

```typescript
// Memoização em memória (5min TTL)
const suggestionCache = new Map<string, {
  suggestions: string[];
  expiresAt: number;
}>();
```

---

## 📁 Estrutura de Arquivos

```
src/
├── ai/
│   ├── llmConfig.ts                    # Configuração de modelos
│   ├── moderation/
│   │   ├── CrisisDetectionService.ts   # Detecção de crise
│   │   └── MedicalModerationService.ts # Prevenção médica
│   └── observability/
│       └── CostTracker.ts              # Rastreamento de custos
│
├── agents/
│   ├── core/
│   │   ├── AgentOrchestrator.ts        # Orquestrador principal
│   │   ├── BaseAgent.ts                # Classe base
│   │   ├── MCPLoader.ts                # Loader de MCPs
│   │   └── ToolExecutor.ts             # Executor de tools
│   ├── helpers/
│   │   └── llmRouter.ts                # Roteamento inteligente
│   ├── maternal/
│   │   └── MaternalChatAgent.ts        # Chat principal
│   ├── nathia/
│   │   └── NathiaPersonalityAgent.ts   # Voz da Nathália
│   ├── emotion/
│   │   └── EmotionAnalysisAgent.ts     # Análise emocional
│   ├── habits/
│   │   └── HabitsAnalysisAgent.ts      # Análise de hábitos
│   └── content/
│       └── ContentRecommendationAgent.ts # Recomendações
│
├── mcp/
│   └── servers/
│       ├── GoogleAIMCPServer.ts        # Gemini
│       ├── OpenAIMCPServer.ts          # GPT-4o
│       └── AnthropicMCPServer.ts       # Claude
│
├── features/
│   └── nathia/
│       ├── hooks/
│       │   └── useNathIA.ts            # Hook principal
│       └── constants/
│           └── systemPrompt.ts         # System prompts
│
├── services/
│   └── chatService.ts                  # Service de chat
│
└── screens/
    └── ChatScreen.tsx                  # UI principal
```

---

## 🔮 Roadmap Futuro

### Fase 1: Embeddings e Semantic Search (Q1 2026)

- [ ] Integrar pgvector no Supabase
- [ ] Implementar `embeddingService.ts`
- [ ] Criar profile vector (preferências + histórico)
- [ ] Semantic search para MundoNath

### Fase 2: Voice Mode Completo (Q2 2026)

- [ ] Speech-to-text (Expo Speech)
- [ ] Text-to-speech com voz da Nathália
- [ ] Modo conversação contínua

### Fase 3: Multi-Agent Collaboration (Q3 2026)

- [ ] Agentes especializados (nutrição, sono, exercício)
- [ ] Orquestração complexa (múltiplos agentes)
- [ ] Memory persistente entre sessões

---

## 📚 Referências

- [Design System](./DESIGN_MCP_ARCHITECTURE.md)
- [Moderação](./MODERATION_ARCHITECTURE.md)
- [Refatoração NathIA](./NATHIA_REFACTOR_COMPLETE.md)
- [CLAUDE.md](../CLAUDE.md) - Quick reference
- [CONTEXTO.md](../CONTEXTO.md) - Contexto completo

---

**Documento mantido por:** Claude Code  
**Última atualização:** 6 de dezembro de 2025  
**Versão:** 2.0

