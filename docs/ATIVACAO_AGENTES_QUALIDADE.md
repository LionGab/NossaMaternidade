# 🚀 Ativação de Agentes e MCPs para Correção de Qualidade

**Data:** 2025-01-27  
**Status:** 🟢 Pronto para Uso

---

## 📋 Visão Geral

Este documento explica como ativar e usar os agentes e MCPs necessários para executar o **Plano de Correção de Qualidade** do projeto Nossa Maternidade.

---

## 🤖 Agentes Disponíveis

### DesignQualityAgent ✅
**Localização:** `src/agents/design/DesignQualityAgent.ts`

**Capabilities:**
- ✅ `validate-design-tokens` - Valida uso correto de design tokens
- ✅ `fix-design-violations` - Sugere correções automáticas
- ✅ `suggest-design-improvements` - Sugere melhorias de design
- ✅ `audit-accessibility` - Auditoria WCAG AAA
- ✅ `check-dark-mode` - Verifica suporte a dark mode
- ✅ `analyze-code-quality` - Análise de qualidade de código

**Como usar:**
```typescript
import { useAgents } from '@/contexts/AgentsContext';

function MyComponent() {
  const { designAgent } = useAgents();
  
  // Validar design tokens
  const result = await designAgent?.process({
    filePath: 'src/screens/HomeScreen.tsx',
    validateTokens: true,
    validateAccessibility: true,
    suggestFixes: true,
  });
  
  console.log(result?.violations);
  console.log(result?.suggestions);
}
```

---

## 🔌 MCPs Configurados

### 1. code-quality ✅
**Runner:** `src/mcp/runners/code-quality-runner.js`  
**Configurado em:** `mcp.json`

**Funcionalidades:**
- Validação de qualidade de código (ESLint, TypeScript)
- Detecção de tipos `any`
- Detecção de `console.log`
- Análise de complexidade ciclomática

**Como usar:**
```bash
# Via script de validação
npm run validate:design

# Via MCP diretamente (via AgentOrchestrator)
const result = await orchestrator.callMCP('code-quality', 'analyze', {
  filePath: 'src/screens/HomeScreen.tsx',
});
```

---

### 2. design-tokens ✅
**Runner:** `src/mcp/runners/design-tokens-runner.js`  
**Configurado em:** `mcp.json`

**Funcionalidades:**
- Validação de design tokens
- Detecção de cores hardcoded
- Sugestão de tokens equivalentes
- Validação de spacing, typography, etc.

**Como usar:**
```bash
# Via script de validação
npm run validate:design

# Via MCP diretamente
const result = await orchestrator.callMCP('design-tokens', 'validate', {
  filePath: 'src/components/Button.tsx',
});
```

---

### 3. accessibility ✅
**Runner:** `src/mcp/runners/accessibility-runner.js`  
**Configurado em:** `mcp.json`

**Funcionalidades:**
- Auditoria WCAG AAA
- Verificação de contrast ratios
- Verificação de touch targets (44pt+ iOS, 48dp+ Android)
- Validação de accessibility labels

**Como usar:**
```bash
# Via script de validação (quando disponível)
npm run validate:a11y

# Via MCP diretamente
const result = await orchestrator.callMCP('accessibility', 'audit', {
  screenPath: 'src/screens/HomeScreen.tsx',
});
```

---

### 4. mobile-optimization ✅
**Runner:** `src/mcp/runners/mobile-optimization-runner.js`  
**Configurado em:** `mcp.json`

**Funcionalidades:**
- Validação de FlatList otimizado
- Verificação de memo() em componentes pesados
- Verificação de lazy loading de imagens
- Análise de performance mobile

**Como usar:**
```bash
# Via script de validação (quando disponível)
npm run validate:mobile

# Via MCP diretamente
const result = await orchestrator.callMCP('mobile-optimization', 'check', {
  screenPath: 'src/screens/FeedScreen.tsx',
});
```

---

### 5. prompt-testing ✅
**Runner:** `src/mcp/runners/prompt-testing-runner.js`  
**Configurado em:** `mcp.json`

**Funcionalidades:**
- Teste de prompts de IA
- Validação de prompts do sistema
- Análise de eficiência de prompts

**Como usar:**
```bash
# Via MCP diretamente
const result = await orchestrator.callMCP('prompt-testing', 'validate', {
  promptPath: 'src/ai/prompts/nathia.system.md',
});
```

---

## 🚀 Como Ativar

### Método 1: Script Automático (Recomendado)

Execute o script de ativação:

```bash
npm run activate:quality-agents
```

O script irá:
1. ✅ Verificar se os agentes estão configurados
2. ✅ Verificar se os MCPs estão funcionando
3. ✅ Gerar relatório de status
4. ✅ Mostrar próximos passos

---

### Método 2: Verificação Manual

#### 1. Verificar Agentes

```bash
# Verificar se DesignQualityAgent existe
ls -la src/agents/design/DesignQualityAgent.ts

# Verificar se está exportado
grep "DesignQualityAgent" src/agents/index.ts
```

#### 2. Verificar MCPs

```bash
# Verificar se mcp.json existe e está configurado
cat mcp.json | grep -A 5 "code-quality"

# Verificar se os runners existem
ls -la src/mcp/runners/
```

#### 3. Verificar Scripts de Validação

```bash
# Verificar scripts no package.json
npm run validate:design
npm run type-check
npm run lint
```

---

## 📊 Status Atual dos Agentes

### ✅ Agentes Ativos (via AgentsContext)

O `AgentsContext` já inicializa automaticamente:

1. ✅ `DesignQualityAgent` - Principal para correção de qualidade
2. ✅ `MaternalChatAgent` - Chat principal
3. ✅ `ContentRecommendationAgent` - Recomendações
4. ✅ `HabitsAnalysisAgent` - Análise de hábitos
5. ✅ `EmotionAnalysisAgent` - Análise emocional
6. ✅ `NathiaPersonalityAgent` - Personalidade NathIA
7. ✅ `SleepAnalysisAgent` - Análise de sono

**Como acessar:**
```typescript
import { useAgents } from '@/contexts/AgentsContext';

function MyScreen() {
  const {
    initialized,
    designAgent,
    chatAgent,
    // ... outros agentes
  } = useAgents();
  
  // Usar designAgent quando inicializado
  if (initialized && designAgent) {
    // ...
  }
}
```

---

## 🔧 Configuração dos MCPs

### Arquivo: `mcp.json`

Os MCPs estão configurados no arquivo `mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "code-quality": {
      "command": "node",
      "args": ["src/mcp/runners/code-quality-runner.js"]
    },
    "design-tokens": {
      "command": "node",
      "args": ["src/mcp/runners/design-tokens-runner.js"]
    },
    // ... outros MCPs
  }
}
```

**Nota:** Os paths no `mcp.json` podem precisar ser ajustados para o caminho correto do workspace.

---

## 🎯 Uso no Plano de Correção

### Fase 1: Limpeza Rápida

Use `DesignQualityAgent` para:
1. Detectar `console.log`
2. Detectar variáveis não usadas
3. Detectar `let` que pode ser `const`

```typescript
const result = await designAgent?.process({
  validateTokens: false,
  validateAccessibility: false,
  suggestFixes: true,
});
```

### Fase 2: Tipagem TypeScript

Use `code-quality` MCP para:
1. Detectar tipos `any`
2. Sugerir tipos específicos
3. Validar type guards

### Fase 3: Testes

Use `code-quality` MCP para:
1. Verificar test coverage
2. Sugerir testes faltantes
3. Validar mocks

### Fase 4: Refinamento Final

Use `design-tokens`, `accessibility`, `mobile-optimization` para:
1. Validar design tokens
2. Auditoria WCAG AAA
3. Otimização mobile

---

## 🐛 Troubleshooting

### Problema: Agente não inicializa

**Solução:**
1. Verificar se `AgentsContext` está envolvendo a app
2. Verificar logs: `logger.info('[AgentsContext] ...')`
3. Verificar erros no console

### Problema: MCP não responde

**Solução:**
1. Verificar se o runner existe: `ls -la src/mcp/runners/`
2. Verificar se está em `mcp.json`
3. Verificar logs do MCP
4. Tentar executar o runner diretamente: `node src/mcp/runners/code-quality-runner.js`

### Problema: Script de validação falha

**Solução:**
1. Verificar se o script existe no `package.json`
2. Verificar dependências: `npm install`
3. Verificar permissões do arquivo
4. Executar manualmente: `node scripts/validate-design-tokens.js`

---

## 📝 Próximos Passos

1. ✅ Execute: `npm run activate:quality-agents`
2. ✅ Revise o relatório gerado
3. ✅ Comece pela **Fase 1** do plano de correção
4. ✅ Use os agentes e MCPs conforme necessário

---

## 🔗 Referências

- [Plano de Correção de Qualidade](../plano-de-correcao-de-qualidade-nossa-maternidade.plan.md)
- [Estado de Qualidade](./STATE_OF_QUALITY.md)
- [Design Quality Agent](../src/agents/design/DesignQualityAgent.ts)
- [Agents Context](../src/contexts/AgentsContext.tsx)

---

**Última atualização:** 2025-01-27  
**Responsável:** Sistema de Agentes  
**Status:** 🟢 Ativo e Funcional

