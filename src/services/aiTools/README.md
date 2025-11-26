# 🛠️ Tool Calling - NathIA

Sistema de Tool Calling permite que a NathIA acesse dados reais da usuária automaticamente para fornecer respostas contextualizadas e úteis.

## 📋 Tools Disponíveis

### 1. `check_pregnancy_week`
Verifica informações da gestação da usuária.

**Quando usar:** Quando a usuária perguntar sobre gestação, semanas, trimestre ou desenvolvimento do bebê.

**Retorna:**
```typescript
{
  found: boolean;
  week?: number;
  trimester?: number;
  due_date?: string;
  days_remaining?: number;
  baby_name?: string;
}
```

### 2. `get_emotion_history`
Busca histórico emocional dos últimos dias.

**Quando usar:** Quando a usuária mencionar sentimentos ou quando quiser entender padrões emocionais.

**Parâmetros:**
- `days` (opcional): Número de dias (padrão: 7)

**Retorna:**
```typescript
{
  found: boolean;
  emotions: string[];
  total_days: number;
  negative_count: number;
  pattern: 'preocupante' | 'normal';
  suggestion?: string;
}
```

### 3. `search_content`
Busca conteúdo relevante no MundoNath.

**Quando usar:** Quando a usuária pedir informações, dicas ou artigos.

**Parâmetros:**
- `query` (obrigatório): Termo de busca
- `category` (opcional): Categoria do conteúdo

**Retorna:**
```typescript
{
  found: boolean;
  count: number;
  results: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
  }>;
}
```

### 4. `get_habits_status`
Verifica status dos hábitos da usuária.

**Quando usar:** Quando a usuária perguntar sobre hábitos ou rotina.

**Parâmetros:**
- `date` (opcional): Data no formato YYYY-MM-DD (padrão: hoje)

**Retorna:**
```typescript
{
  found: boolean;
  completed: number;
  total: number;
  percentage: number;
  habits: Array<{
    id: string;
    title: string;
    completed: boolean;
    streak: number;
  }>;
}
```

### 5. `detect_crisis`
Analisa mensagem para detectar sinais de crise.

**Quando usar:** SEMPRE que detectar palavras preocupantes.

**Parâmetros:**
- `message` (obrigatório): Texto da mensagem

**Retorna:**
```typescript
{
  is_crisis: boolean;
  severity: 'alta' | 'baixa';
  action_required: 'immediate_support' | 'none';
}
```

### 6. `recommend_professional`
Sugere ajuda profissional quando necessário.

**Quando usar:** Quando detectar crise ou quando a usuária pedir ajuda profissional.

**Parâmetros:**
- `reason` (obrigatório): Motivo da recomendação

**Retorna:**
```typescript
{
  type: 'professional_referral';
  message: string;
  resources: Array<{
    name: string;
    phone?: string;
    url?: string;
    description: string;
    available: boolean;
  }>;
}
```

## 🚀 Como Funciona

### Fluxo de Tool Calling

1. **Usuária envia mensagem** → `ChatService.sendMessageWithAI()`
2. **ChatService chama Gemini** → `geminiService.sendMessage()` com tools habilitadas
3. **IA decide usar tool** → Retorna `toolCall` em vez de resposta direta
4. **ToolExecutor executa** → `aiToolExecutor.executeTool()` busca dados reais
5. **IA recebe resultado** → `geminiService.sendMessageWithToolResult()` gera resposta final
6. **Resposta contextualizada** → Retorna para usuária com dados reais

### Exemplo de Conversa

**Usuária:** "Como está meu bebê essa semana?"

**Fluxo:**
1. IA detecta necessidade de informações de gestação
2. Chama `check_pregnancy_week(user_id)`
3. Recebe: `{ week: 24, trimester: 2, days_remaining: 112 }`
4. Responde: "Você está na semana 24! Seu bebê tem cerca de 30cm e está desenvolvendo o paladar. Quer saber mais sobre essa fase?"

## 📝 Adicionar Nova Tool

1. **Definir tool** em `toolDefinitions.ts`:
```typescript
{
  name: 'nova_tool',
  description: 'Descrição do que a tool faz',
  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Descrição do parâmetro',
      },
    },
    required: ['param1'],
  },
}
```

2. **Implementar executor** em `toolExecutor.ts`:
```typescript
case 'nova_tool':
  return await this.novaTool(parameters.param1);
```

3. **Adicionar método privado**:
```typescript
private async novaTool(param1: string): Promise<AIToolResult> {
  // Implementação
  return {
    success: true,
    data: { /* resultado */ },
  };
}
```

## ✅ Boas Práticas

- ✅ Sempre logar execução de tools com `logger.info()`
- ✅ Tratar erros graciosamente
- ✅ Retornar dados estruturados
- ✅ Validar parâmetros antes de executar
- ✅ Usar tipos TypeScript strict
- ❌ Não usar `console.log` (use `logger`)
- ❌ Não expor dados sensíveis
- ❌ Não fazer queries sem filtrar por `user_id` (LGPD)

## 🔒 Segurança

- Todas as tools filtram por `user_id` automaticamente
- Detecção de crise sempre executada antes de responder
- Dados sensíveis nunca expostos em logs
- RLS policies no Supabase garantem isolamento de dados

