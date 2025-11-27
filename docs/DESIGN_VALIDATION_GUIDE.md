# 🎨 Guia de Validação de Design

Guia completo para usar o sistema de validação de design tokens no projeto Nossa Maternidade.

## 📋 Índice

1. [Instalação e Setup](#instalação-e-setup)
2. [Comandos Disponíveis](#comandos-disponíveis)
3. [Pre-commit Hooks](#pre-commit-hooks)
4. [CI/CD Integration](#cicd-integration)
5. [Como Corrigir Violações](#como-corrigir-violações)
6. [Exemplos Práticos](#exemplos-práticos)
7. [FAQ](#faq)

---

## Instalação e Setup

### Requisitos

- Node.js 20+
- npm 10+
- Git

### Instalação

O sistema já está configurado! Apenas execute:

```bash
# Instalar dependências (inclui Husky)
npm install

# Husky será configurado automaticamente via "prepare" script
```

---

## Comandos Disponíveis

### Validar Design Tokens

```bash
# Validar todo o projeto
npm run validate:design

# Validar específico arquivo (usando script Node.js customizado)
node scripts/validate-design-tokens.js src/screens/HomeScreen.tsx
```

**Output esperado:**
```
🔍 Analisando 184 arquivos...

════════════════════════════════════════════════════════════════
📊 RELATÓRIO DE VALIDAÇÃO DE DESIGN TOKENS
════════════════════════════════════════════════════════════════

📁 Arquivos analisados: 184
⚠️  Arquivos com violações: 40
🔴 Total de violações: 193

📈 Resumo por tipo:
   • Hex colors: 149
   • RGB colors: 0
   • RGBA colors: 23
   • Named colors: 21
```

### TypeScript Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

### Validação Completa

```bash
# Roda validação de design + type-check + lint
npm run validate
```

---

## Integração com Claude Code CLI

### Validação Agentica com Prompts Robustos

O Claude Code CLI permite validação avançada de design usando prompts estruturados e subagentes especializados.

#### Comando Base Recomendado

```bash
claude -p "Valide o design desta tela conforme as diretrizes em CLAUDE.md. \
Analise tokens de cor, espaçamento e acessibilidade. \
Gere um relatório com violações e sugestões de correção." \
--append-system-prompt "Você é um especialista em UI/UX para React Native. \
Sempre priorize WCAG AAA, consistência visual e responsividade. \
Use MCPs para capturar screenshots e validar contra mocks."
```

**Componentes do comando:**
- `-p`: Prompt principal (não-interativo)
- `--append-system-prompt`: Adiciona diretrizes de design sem substituir o prompt padrão
- `--model`: Especifica modelo (opcional: `claude-sonnet-4-5-20250929`)

#### Validação Avançada com Subagentes

Para validações complexas, use subagentes especializados:

```bash
claude -p "Ultrathink esta tarefa: Valide o design da tela MaesValenteScreen.tsx. \
Analise tokens de cor, espaçamento, tipografia e dark mode. \
Verifique acessibilidade (contraste 7:1, labels ARIA, alvos de toque). \
Gere um relatório com violações estruturadas e sugestões de fix." \
--append-system-prompt "Você é um especialista em validação de design systems para React Native. \
Sempre consulte src/theme/tokens.ts. Priorize WCAG AAA, evite hardcoded values e garanta responsividade. \
Documente em Markdown com severidade (error/warning), linha e sugestão." \
--model claude-sonnet-4-5-20250929 \
--json-schema '{"type":"object","properties":{"status":{"type":"string"},"violations":{"type":"array"}}}' \
--agents '{"design-validator":{"description":"Valida UI contra tokens e mocks","prompt":"Foque em tokens de cor, espaçamento e acessibilidade.","tools":["Read","Grep"],"model":"sonnet"}}'
```

#### Casos de Uso Práticos

**1. Validação Rápida de Tokens**
```bash
claude -p "Analise MaesValenteScreen.tsx por valores hardcoded. \
Compare com src/theme/tokens.ts e sugira refatorações."
```

**2. Auditoria de Acessibilidade**
```bash
claude -p "Audite acessibilidade da tela HomeScreen.tsx: \
- Contraste de cores (mínimo 7:1 para WCAG AAA) \
- ARIA labels em TouchableOpacity \
- Alvos de toque (mínimo 44pt) \
Gere relatório JSON estruturado." \
--json-schema '{"type":"object","properties":{"violations":{"type":"array"}}}'
```

**3. Validação Dark Mode**
```bash
claude -p "Verifique suporte a dark mode em ProfileScreen.tsx: \
- Todos os estilos usam useThemeColors() \
- Sem valores hardcoded (#FFFFFF, #000000) \
- Contraste adequado em ambos os temas"
```

**4. Refatoração Automática**
```bash
claude -p "Refatore HabitsScreen.tsx para usar design tokens: \
1. Substitua valores hardcoded por Tokens.spacing, Tokens.typography \
2. Cores devem usar colors.background.*, colors.text.* \
3. Mantenha funcionalidade existente \
4. Gere diff das mudanças"
```

#### Melhores Práticas

1. **Especificidade**: Sempre mencione arquivos específicos e critérios de validação
2. **Iteração**: Use `/clear` para resets entre validações diferentes
3. **Integração**: Combine com MCPs como Playwright para feedback visual
4. **Automação**: Integre comandos no CI/CD via GitHub Actions

#### Tabela de Flags Úteis

| Flag | Uso | Exemplo |
|------|-----|---------|
| `-p` | Prompt não-interativo | `-p "Valide design tokens"` |
| `--append-system-prompt` | Adiciona contexto persistente | `--append-system-prompt "Priorize WCAG AAA"` |
| `--model` | Especifica modelo | `--model claude-sonnet-4-5-20250929` |
| `--json-schema` | Força saída estruturada | `--json-schema '{...}'` |
| `--agents` | Define subagentes | `--agents '{"design-validator":{...}}'` |
| `--allowedTools` | Permite ferramentas específicas | `--allowedTools "Read,Grep,Playwright"` |

#### Exemplo: Workflow Completo de Validação

```bash
# 1. Validar design tokens
claude -p "Valide tokens em src/screens/HomeScreen.tsx"

# 2. Se houver violações, refatorar
claude -p "Refatore HomeScreen.tsx usando tokens. Preserve funcionalidade."

# 3. Validar dark mode
claude -p "Verifique dark mode em HomeScreen.tsx após refatoração"

# 4. Verificar acessibilidade
claude -p "Audite acessibilidade WCAG AAA em HomeScreen.tsx"

# 5. Type-check final
npm run type-check
```

---

## Pre-commit Hooks

O Husky está configurado para **bloquear commits** se houver violações críticas de design.

### Arquivo: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🎨 Validando design tokens..."
npm run validate:design

echo "✅ TypeScript type checking..."
npm run type-check
```

### Comportamento

1. ✅ **PASS**: Commit é permitido
2. 🔴 **FAIL**: Commit é bloqueado com mensagem de erro

**Exemplo de bloqueio:**
```bash
git commit -m "feat: adiciona nova tela"

🎨 Validando design tokens...
❌ Encontradas 5 violações críticas. Corrija antes de commitar.

husky - pre-commit hook exited with code 1 (error)
```

### Bypass (⚠️ Use com cuidado!)

Se ABSOLUTAMENTE necessário (ex: work in progress), você pode bypass:

```bash
git commit --no-verify -m "WIP: em progresso"
```

**IMPORTANTE:** PRs ainda serão bloqueados no CI/CD!

---

## CI/CD Integration

### GitHub Actions Workflow

**Arquivo:** `.github/workflows/design-validation.yml`

**Triggers:**
- Pull Requests para `main` e `dev`
- Pushes para `main` e `dev`
- Apenas se modificou arquivos em `src/**/*.ts` ou `src/**/*.tsx`

**Jobs:**
1. ✅ Validate design tokens
2. ✅ TypeScript type checking
3. ⚠️ ESLint (continue-on-error)
4. 📊 Generate design report

**Resultado:**
- ✅ **PASS**: Merge é permitido
- 🔴 **FAIL**: Merge é bloqueado

**Exemplo de summary no PR:**
```markdown
## 🔴 Design Validation Failed

Design tokens validation encontrou violações.
Por favor, corrija as violações antes de fazer merge.

### Como corrigir:
1. Execute `npm run validate:design` localmente
2. Substitua cores hardcoded por design tokens
3. Use `useThemeColors()` hook para acessar cores do tema
```

---

## Como Corrigir Violações

### 1. Cores Hardcoded → Design Tokens

#### ❌ ERRADO

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  text: {
    color: '#0F172A',
  },
});
```

#### ✅ CORRETO

```typescript
import { useThemeColors } from '@/hooks/useTheme';

const MyComponent = () => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderColor: colors.border.medium,
    },
    text: {
      color: colors.text.primary,
    },
  });

  return <View style={styles.container}>...</View>;
};
```

### 2. Spacing Hardcoded → Tokens.spacing

#### ❌ ERRADO

```typescript
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
});
```

#### ✅ CORRETO

```typescript
import { Tokens } from '@/theme/tokens';

const styles = StyleSheet.create({
  container: {
    padding: Tokens.spacing["4"],     // 16px
    marginTop: Tokens.spacing["6"],   // 24px
    gap: Tokens.spacing["3"],         // 12px
  },
});
```

### 3. Typography Hardcoded → Tokens.typography

#### ❌ ERRADO

```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
});
```

#### ✅ CORRETO

```typescript
import { Tokens } from '@/theme/tokens';

const styles = StyleSheet.create({
  title: {
    fontSize: Tokens.typography.sizes["2xl"],
    fontWeight: Tokens.typography.weights.bold,
    lineHeight: Tokens.typography.lineHeights["2xl"],
  },
  body: {
    fontSize: Tokens.typography.sizes.md,
    fontWeight: Tokens.typography.weights.regular,
  },
});
```

### 4. Dark Mode Support

#### ❌ ERRADO (Ternários manuais)

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#020617' : '#FFFFFF',
    color: isDark ? '#F8FAFC' : '#0F172A',
  },
});
```

#### ✅ CORRETO (Tokens automáticos)

```typescript
import { useThemeColors } from '@/hooks/useTheme';

const MyComponent = () => {
  const colors = useThemeColors(); // Já retorna cores corretas para light/dark

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,  // Auto light/dark
      color: colors.text.primary,               // Auto light/dark
    },
  });

  return <View style={styles.container}>...</View>;
};
```

### 5. Acessibilidade - Labels

#### ❌ ERRADO

```typescript
<TouchableOpacity onPress={handleLogin}>
  <Text>Login</Text>
</TouchableOpacity>
```

#### ✅ CORRETO

```typescript
<TouchableOpacity
  onPress={handleLogin}
  accessibilityLabel="Botão de login"
  accessibilityRole="button"
  accessibilityHint="Toque para fazer login"
>
  <Text>Login</Text>
</TouchableOpacity>
```

### 6. Touch Targets

#### ❌ ERRADO (< 44pt)

```typescript
<TouchableOpacity
  style={{
    width: 32,
    height: 32,
  }}
>
  <Icon size={16} />
</TouchableOpacity>
```

#### ✅ CORRETO (≥ 44pt)

```typescript
import { Tokens } from '@/theme/tokens';

<TouchableOpacity
  style={{
    width: Tokens.touchTargets.min,   // 44pt
    height: Tokens.touchTargets.min,  // 44pt
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Icon size={16} />
</TouchableOpacity>
```

### 7. Emoji Sizes → Tokens.emojiSizes

#### ❌ ERRADO

```typescript
const styles = StyleSheet.create({
  emoji: {
    fontSize: 44,  // Hardcoded
    lineHeight: 52,
  },
});

<Text style={styles.emoji}>😊</Text>
```

#### ✅ CORRETO

```typescript
import { Tokens } from '@/theme/tokens';

const styles = StyleSheet.create({
  emoji: {
    fontSize: Tokens.emojiSizes.lg,        // 44pt (WCAG AAA compliant)
    lineHeight: Tokens.emojiSizes.lg + 8,  // 52pt
  },
});

<Text style={styles.emoji}>😊</Text>
```

**Escala disponível:**
- `xs`: 20pt - Emojis pequenos em badges
- `sm`: 28pt - Emojis em labels
- `md`: 32pt - Emojis padrão
- `lg`: 44pt - Emojis touchable (mínimo WCAG AAA)
- `xl`: 56pt - Emojis em destaque

### 8. Opacity → Tokens.opacity

#### ❌ ERRADO

```typescript
const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.5,  // Hardcoded
  },
  overlay: {
    backgroundColor: 'rgba(255, 122, 150, 0.12)',  // Hardcoded opacity
  },
});
```

#### ✅ CORRETO

```typescript
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

const MyComponent = () => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    disabledButton: {
      opacity: Tokens.opacity.disabled,  // 0.5
    },
    overlay: {
      // Rosa maternal com 12% opacity (1F em hex)
      backgroundColor: `${colors.primary.main}${Math.round(Tokens.opacity.overlay * 255).toString(16).padStart(2, '0')}`,
    },
  });

  return <View style={styles.overlay}>...</View>;
};
```

**Valores disponíveis:**
- `disabled`: 0.5 - Elementos desabilitados
- `hover`: 0.75 - Estados de hover/press
- `selected`: 0.9 - Itens selecionados
- `overlay`: 0.12 - Backgrounds sutis (1F em hex)
- `full`: 1 - Opacidade total

### 9. Emotion Gradients → Tokens.emotionGradients

#### ❌ ERRADO

```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#FF7A96', '#FFE4E9']}  // Hardcoded
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text>Como você está se sentindo?</Text>
</LinearGradient>
```

#### ✅ CORRETO

```typescript
import { Tokens } from '@/theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={Tokens.emotionGradients.calm}  // Semantic gradient
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text>Como você está se sentindo?</Text>
</LinearGradient>
```

**Gradientes disponíveis (Flo-inspired):**
- `calm`: Rosa maternal (main → light) - Tranquilidade, acolhimento
- `warm`: Pink gradient - Calor humano, conexão
- `energetic`: Yellow → Orange - Energia, motivação
- `peaceful`: Green → Mint - Paz, serenidade
- `safe`: Rosa → Roxo - Segurança, proteção
- `spiritual`: Roxo gradient - Espiritualidade, reflexão
- `joyful`: Pink → Yellow - Alegria, celebração

**Uso em EmotionalPrompt:**
```typescript
// Background sutil para emoção selecionada
backgroundColor: isSelected
  ? `${colors.primary.main}1F`  // Usa opacity.overlay (12%)
  : 'transparent'
```

---

## Exemplos Práticos

### Exemplo 1: Refatorar HomeScreen

**Antes (com violações):**
```typescript
const HomeScreen = () => {
  return (
    <View style={{ backgroundColor: '#FFFFFF', padding: 16 }}>
      <Text style={{ color: '#0F172A', fontSize: 24, fontWeight: '700' }}>
        Bem-vinda!
      </Text>
      <TouchableOpacity
        style={{ backgroundColor: '#004E9A', padding: 12, borderRadius: 8 }}
        onPress={handlePress}
      >
        <Text style={{ color: '#FFFFFF' }}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};
```

**Depois (sem violações):**
```typescript
import { useThemeColors } from '@/hooks/useTheme';
import { Tokens } from '@/theme/tokens';

const HomeScreen = () => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.canvas,
      padding: Tokens.spacing["4"],
    },
    title: {
      color: colors.text.primary,
      fontSize: Tokens.typography.sizes["2xl"],
      fontWeight: Tokens.typography.weights.bold,
    },
    button: {
      backgroundColor: colors.primary.main,
      padding: Tokens.spacing["3"],
      borderRadius: Tokens.radius.md,
      minHeight: Tokens.touchTargets.min,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: colors.text.inverse,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vinda!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        accessibilityLabel="Continuar para próxima tela"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Exemplo 2: Validar Arquivo Programaticamente

```typescript
import { designQualityAgent } from '@/agents/design/DesignQualityAgent';

const validateMyScreen = async () => {
  const result = await designQualityAgent.validateFile(
    'src/screens/MyScreen.tsx'
  );

  console.log('Score:', result.score);
  console.log('Violations:', result.violations.length);
  console.log('Accessibility Score:', result.accessibility?.score);

  if (result.score < 70) {
    console.warn('⚠️ Qualidade de design abaixo do esperado!');
    result.suggestions.forEach(s => console.log('💡', s.explanation));
  }
};
```

---

## FAQ

### Por que meu commit foi bloqueado?

O pre-commit hook detectou violações críticas de design tokens. Execute `npm run validate:design` para ver detalhes.

### Posso desabilitar a validação temporariamente?

Para commit local: `git commit --no-verify`
Para CI/CD: Não é possível (proteção obrigatória)

### Como validar apenas arquivos que mudei?

```bash
# Validar arquivos staged
git diff --cached --name-only | grep -E '\.(ts|tsx)$' | xargs node scripts/validate-design-tokens.js
```

### O que fazer se encontrar muitas violações?

1. Priorize arquivos novos primeiro
2. Refatore progressivamente
3. Use `ALLOWED_FILES` para excluir definições de tokens
4. Peça ajuda ao time de design

### Como contribuir para o Design System?

1. Adicione novos tokens em `src/theme/tokens.ts`
2. Documente em `THEME_DOCUMENTATION.md`
3. Atualize `TOKEN_SUGGESTIONS` em `DesignTokensValidationMCPServer.ts`

### Como testar acessibilidade?

```bash
# Auditar tela específica
npm run validate:design

# Verificar contrast ratio
# Use DevTools: Chrome > Inspect > Accessibility
```

### Qual a diferença entre os MCPs?

| MCP | Foco | Quando usar | Status |
|-----|------|-------------|--------|
| **DesignTokensValidationMCP** | Detecta hardcoded values (cores, spacing, typography) | Validação básica | ✅ Implementado |
| **CodeQualityMCP** | Analisa qualidade geral do código (duplicação, complexidade) | Code review | ✅ Implementado |
| **AccessibilityMCP** | Valida WCAG AAA (contrast, touch targets, labels) | Antes de release | ✅ Implementado |
| **MobileOptimizationMCP** | React Native best practices (FlatList, Image optimization) | Performance audit | ✅ Implementado |
| **PromptTestingMCP** | Valida prompts de AI para safety e clareza | Validação de agents | ✅ Implementado |

### Como integrar Design Validation com Agents?

O **DesignQualityAgent** pode ser chamado programaticamente para validação avançada:

```typescript
import { AgentOrchestrator } from '@/agents/core/AgentOrchestrator';

const orchestrator = AgentOrchestrator.getInstance();
await orchestrator.initialize();

// Validar arquivo via DesignQualityAgent
const result = await orchestrator.executeTask('design-quality', {
  filePath: 'src/screens/MyScreen.tsx',
  validateColors: true,
  validateSpacing: true,
  validateA11y: true,
});

console.log('Score:', result.score);       // 0-100
console.log('Issues:', result.issues.length);
console.log('Severity:', result.severity);  // error/warning/info
```

### Como os Agents usam design tokens?

**Exemplo: HabitsAnalysisAgent**

Quando integrado (TODO: Semana 2), o agent vai gerar dados para HabitsBarChart:

```typescript
import { habitsAgent } from '@/agents/habits/HabitsAnalysisAgent';

const analysis = await habitsAgent.process({
  userId: 'user-123',
  entries: habitsData,
  timeRange: { start: oneWeekAgo, end: today },
});

// Retorna dados estruturados:
{
  patterns: [...],
  insights: [...],
  recommendations: [...],
  weeklyData: [3, 4, 2, 5, 4, 3, 5],  // Para HabitsBarChart!
  wellbeingScore: 82,                  // 0-100
  alerts: [...]                         // Avisos importantes
}
```

**Exemplo: MaternalChatAgent**

Agent de chat com crisis detection e medical moderation:

```typescript
import { maternalChatAgent } from '@/agents/maternal/MaternalChatAgent';

const response = await maternalChatAgent.startSession(userId, {
  lifeStage: 'pregnant',
  challenges: ['anxiety', 'sleep'],
});

// Resposta automática com:
// - Crisis detection (se detectar risco)
// - Medical moderation (previne conselhos perigosos)
// - Emotional support (tom empático)
// - Intelligent LLM routing (Gemini vs OpenAI vs Anthropic)
```

### Quais Agents estão disponíveis?

| Agent | Status | Integração | Uso Principal |
|-------|--------|-----------|---------------|
| **MaternalChatAgent** | ✅ Implementado | ⚠️ Não integrado | Chat com crisis detection e medical moderation |
| **ContentRecommendationAgent** | ✅ Implementado | ⚠️ Não integrado | Personalização de conteúdo por life stage |
| **HabitsAnalysisAgent** | ✅ Implementado | ⚠️ Não integrado | Análise de padrões de hábitos, insights |
| **EmotionAnalysisAgent** | ✅ Implementado | ⚠️ Não integrado | Tracking emocional, detecção de risco mental |
| **NathiaPersonalityAgent** | ✅ Implementado | ⚠️ Não integrado | Validação de tom/voz da Nathália Valente |
| **SleepAnalysisAgent** | ✅ Implementado | ⚠️ Não integrado | Análise de padrões de sono, recomendações |
| **DesignQualityAgent** | ✅ Implementado | ⚠️ Não integrado | Validação de design tokens e acessibilidade |

**Nota:** Agents estão implementados mas **não ativamente usados nas telas**. Integração planejada para Semana 2-3.

### Como funciona o score de design quality?

```
score = max(0, 100 - totalIssues * 2)
```

Cada issue reduz 2 pontos. Score mínimo recomendado: 70.

**Breakdown de score:**
- **90-100**: Excelente - Compliance total
- **70-89**: Bom - Pequenas violações aceitáveis
- **50-69**: Regular - Precisa atenção
- **0-49**: Crítico - Muitas violações, refatoração urgente

---

## Recursos Adicionais

- [Arquitetura dos MCPs](./DESIGN_MCP_ARCHITECTURE.md)
- [Documentação do Theme](./THEME_DOCUMENTATION.md)
- [CLAUDE.md](../CLAUDE.md) - Guia geral do projeto
- [WCAG AAA Guidelines](https://www.w3.org/WAI/WCAG2AAA-Conformance)

---

## Suporte

Problemas? Abra uma issue no GitHub ou consulte o time de design/engineering.

**Última atualização:** 27/11/2025
