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

- **DesignTokensValidationMCP**: Detecta hardcoded values
- **CodeQualityMCP**: Analisa qualidade geral do código
- **AccessibilityMCP**: Valida WCAG AAA compliance

### Como funciona o score de design quality?

```
score = max(0, 100 - totalIssues * 2)
```

Cada issue reduz 2 pontos. Score mínimo recomendado: 70.

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
