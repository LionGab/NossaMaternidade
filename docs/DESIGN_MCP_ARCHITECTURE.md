# 🎨 Design MCP Architecture

## Visão Geral

Sistema de validação automatizada de design tokens usando **Model Context Protocol (MCP)** para garantir conformidade com o Design System em toda a aplicação Nossa Maternidade.

## Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                    AgentOrchestrator                          │
│  (Gerenciador central de agentes e MCPs)                     │
└───────────────────────┬──────────────────────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
┌───────▼────────┐              ┌───────▼────────┐
│ DesignQuality  │              │   Design MCPs  │
│     Agent      │◄────────────►│   Servers      │
│                │              │                │
└────────────────┘              └───────┬────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        │               │               │
                ┌───────▼────────┐ ┌───▼────────┐ ┌───▼────────┐
                │DesignTokens    │ │CodeQuality │ │Accessibility│
                │ValidationMCP   │ │    MCP     │ │    MCP     │
                └────────────────┘ └────────────┘ └────────────┘
```

## Componentes

### 1. DesignTokensValidationMCPServer

**Localização:** `src/mcp/servers/DesignTokensValidationMCPServer.ts`

**Responsabilidades:**
- Detecta cores hardcoded (hex, rgb, rgba, named colors)
- Detecta spacing hardcoded
- Detecta typography hardcoded
- Sugere tokens equivalentes
- Valida dark mode

**Métodos disponíveis:**
- `design.validate.tokens` - Valida arquivo específico ou projeto inteiro
- `design.validate.screen` - Valida tela específica
- `design.suggest.fix` - Sugere correção para violação
- `design.check.darkmode` - Verifica conformidade dark mode

**Exemplo de uso:**
```typescript
import { designTokensValidationMCP, createMCPRequest } from '@/mcp/servers';

const request = createMCPRequest('design.validate.tokens', {
  filePath: 'src/screens/HomeScreen.tsx'
});

const response = await designTokensValidationMCP.handleRequest(request);
console.log(response.data); // { violations, summary, ... }
```

### 2. CodeQualityMCPServer

**Localização:** `src/mcp/servers/CodeQualityMCPServer.ts`

**Responsabilidades:**
- Análise estática de código
- Detecção de padrões hardcoded
- Cálculo de score de qualidade (0-100)
- Sugestões de refactoring

**Métodos disponíveis:**
- `code.analyze.design` - Analisa qualidade de design do arquivo
- `code.find.hardcoded` - Encontra valores hardcoded (colors, spacing, typography, dimension)
- `code.refactor.suggest` - Sugere refactorings automáticos

**Exemplo de uso:**
```typescript
import { codeQualityMCP, createMCPRequest } from '@/mcp/servers';

const request = createMCPRequest('code.analyze.design', {
  filePath: 'src/screens/HomeScreen.tsx'
});

const response = await codeQualityMCP.handleRequest(request);
console.log(response.data); // { score, issues, suggestions }
```

### 3. AccessibilityMCPServer

**Localização:** `src/mcp/servers/AccessibilityMCPServer.ts`

**Responsabilidades:**
- Valida contrast ratios (WCAG AAA - 7:1)
- Valida touch targets (mínimo 44pt iOS / 48dp Android)
- Detecta missing accessibilityLabel/accessibilityRole
- Gera score de acessibilidade

**Métodos disponíveis:**
- `a11y.check.contrast` - Calcula contrast ratio entre cores
- `a11y.check.touchTargets` - Valida tamanho de touch targets
- `a11y.check.labels` - Detecta labels faltantes
- `a11y.audit.screen` - Auditoria completa de acessibilidade

**Exemplo de uso:**
```typescript
import { accessibilityMCP, createMCPRequest } from '@/mcp/servers';

const request = createMCPRequest('a11y.check.contrast', {
  foreground: '#0F172A',
  background: '#FFFFFF'
});

const response = await accessibilityMCP.handleRequest(request);
console.log(response.data); // { ratio: 15.2, level: 'AAA', passes: true }
```

### 4. DesignQualityAgent

**Localização:** `src/agents/design/DesignQualityAgent.ts`

**Responsabilidades:**
- Orquestra chamadas para todos os MCPs de design
- Consolida resultados
- Gera relatório unificado
- Sugere correções automáticas

**Métodos disponíveis:**
- `validateFile(filePath)` - Valida arquivo específico
- `validateScreen(screenPath)` - Valida tela específica
- `checkDarkMode(filePath)` - Verifica dark mode
- `process(input, options)` - Processamento customizado

**Exemplo de uso:**
```typescript
import { designQualityAgent } from '@/agents/design/DesignQualityAgent';

const result = await designQualityAgent.validateFile('src/screens/HomeScreen.tsx');

console.log(result);
// {
//   violations: [...],
//   analysis: { score: 85, issues: {...}, suggestions: [...] },
//   accessibility: { score: 90, issues: {...} },
//   suggestions: [...],
//   score: 87,
//   summary: { totalViolations: 5, criticalIssues: 2, ... }
// }
```

## Fluxo de Validação

```
┌──────────────────┐
│  Developer       │
│  edita código    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     FAIL    ┌──────────────────┐
│  git commit      ├────────────►│  Pre-commit      │
└────────┬─────────┘              │  hook blocked    │
         │ PASS                   └──────────────────┘
         ▼
┌──────────────────┐
│  git push        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     FAIL    ┌──────────────────┐
│  GitHub Actions  ├────────────►│  PR blocked      │
│  CI/CD           │              │  (merge disabled)│
└────────┬─────────┘              └──────────────────┘
         │ PASS
         ▼
┌──────────────────┐
│  Merge allowed   │
└──────────────────┘
```

## Integração com AgentOrchestrator

Os MCPs de design estão registrados no `AgentOrchestrator` e inicializados automaticamente:

```typescript
// src/agents/core/AgentOrchestrator.ts

async initialize(): Promise<void> {
  // Inicializar servidores MCP
  await Promise.all([
    designTokensValidationMCP.initialize(),
    codeQualityMCP.initialize(),
    accessibilityMCP.initialize(),
  ]);

  // Registrar servidores MCP
  this.mcpServers.set('design-validation', designTokensValidationMCP);
  this.mcpServers.set('code-quality', codeQualityMCP);
  this.mcpServers.set('accessibility', accessibilityMCP);
}
```

## Tipos TypeScript

### DesignViolation
```typescript
interface DesignViolation {
  file: string;
  line: number;
  content: string;
  type: 'hex' | 'rgb' | 'rgba' | 'named' | 'spacing' | 'typography';
  suggestion?: string;
  severity: 'critical' | 'warning' | 'info';
}
```

### ValidationResult
```typescript
interface ValidationResult {
  violations: DesignViolation[];
  totalFiles: number;
  filesWithViolations: string[];
  summary: {
    hex: number;
    rgb: number;
    rgba: number;
    named: number;
    spacing: number;
    typography: number;
  };
}
```

### DesignAnalysis
```typescript
interface DesignAnalysis {
  file: string;
  score: number; // 0-100
  issues: {
    hardcodedColors: number;
    hardcodedSpacing: number;
    hardcodedTypography: number;
    missingDarkMode: number;
    accessibilityIssues: number;
  };
  suggestions: string[];
}
```

### A11yAuditResult
```typescript
interface A11yAuditResult {
  file: string;
  score: number; // 0-100
  issues: {
    contrast: number;
    touchTargets: number;
    missingLabels: number;
    missingRoles: number;
    keyboardNavigation: number;
  };
  details: {
    contrastIssues: ContrastRatio[];
    touchTargetIssues: TouchTargetIssue[];
    missingLabels: MissingLabel[];
  };
  suggestions: string[];
}
```

## Automação

### Pre-commit Hook (Husky)

**Arquivo:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🎨 Validando design tokens..."
npm run validate:design

echo "✅ TypeScript type checking..."
npm run type-check
```

### GitHub Actions Workflow

**Arquivo:** `.github/workflows/design-validation.yml`

- Roda em todos os PRs para `main` e `dev`
- Valida design tokens
- Executa type-check
- Executa linting
- Bloqueia merge se houver violações críticas

## Métricas

### Score de Design Quality

O score é calculado como:
```
score = max(0, 100 - totalIssues * 2)
```

Onde cada issue reduz 2 pontos.

**Níveis:**
- 90-100: Excelente ✅
- 70-89: Bom ⚠️
- 50-69: Precisa melhorias 🔴
- 0-49: Crítico 🚨

### WCAG AAA Compliance

**Contrast ratios:**
- AAA: ≥ 7:1 ✅
- AA: ≥ 4.5:1 ⚠️
- AA-Large: ≥ 3:1 (texto grande) ⚠️
- Fail: < 3:1 🔴

**Touch targets:**
- iOS mínimo: 44pt
- Android mínimo: 48dp
- Recomendado: 56px

## Boas Práticas

1. **Sempre use hooks do tema:**
   ```typescript
   const colors = useThemeColors();
   backgroundColor: colors.background.canvas
   ```

2. **Nunca use valores hardcoded:**
   ```typescript
   // ❌ ERRADO
   backgroundColor: '#FFFFFF'
   padding: 16
   fontSize: 14

   // ✅ CORRETO
   backgroundColor: colors.background.card
   padding: Tokens.spacing["4"]
   fontSize: Tokens.typography.sizes.sm
   ```

3. **Valide localmente antes de commitar:**
   ```bash
   npm run validate:design
   ```

4. **Adicione accessibilityLabel em todos os componentes interativos:**
   ```typescript
   <TouchableOpacity
     accessibilityLabel="Botão de login"
     accessibilityRole="button"
   >
   ```

## Roadmap Futuro

- [ ] Dashboard de métricas de design quality
- [ ] Visual regression testing (screenshot comparison)
- [ ] Auto-fix de violações simples
- [ ] CLI tool para correção interativa
- [ ] Integration com Figma para validar designs
- [ ] Suporte a Tailwind/NativeWind classes

## Troubleshooting

### "MCP Server not initialized"
- Certifique-se que `AgentOrchestrator.initialize()` foi chamado
- Verifique logs de inicialização

### "File not found"
- Use caminhos absolutos ou relativos ao project root
- Verifique se arquivo existe

### Muitas violações detectadas
- Comece validando arquivos novos primeiro
- Use `ALLOWED_FILES` para excluir definições de tokens
- Refatore progressivamente

## Referências

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [WCAG AAA Guidelines](https://www.w3.org/WAI/WCAG2AAA-Conformance)
- [Design Tokens Specification](https://designtokens.org/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
