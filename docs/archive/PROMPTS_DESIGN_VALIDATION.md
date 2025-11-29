# 🎨 Prompts Robustos para Validação de Design - Nossa Maternidade

## 📋 Guia de Prompts para Claude Code CLI

**Projeto**: Nossa Maternidade (React Native + Expo)  
**Plataforma**: iOS App Store + Android Google Play  
**Foco**: Validação de design systems, acessibilidade e consistência visual

---

## 🎯 Prompt Base Recomendado

```bash
claude -p "Ultrathink esta tarefa: Valide o design da tela [NOME_TELA].tsx conforme as diretrizes em LAYOUT_COMPLETO_REFERENCIA.md e tokens em src/theme/tokens.ts. Analise tokens de cor, espaçamento, tipografia e dark mode. Verifique acessibilidade WCAG AAA (contraste 7:1, labels ARIA, alvos de toque 44pt+). Gere um relatório estruturado com violações (severidade, linha, sugestão) e sugestões de correção. Use MCPs para capturar screenshots e validar contra mocks quando disponíveis." --append-system-prompt "Você é um especialista em validação de design systems para React Native + Expo. Sempre consulte src/theme/tokens.ts e LAYOUT_COMPLETO_REFERENCIA.md. Priorize WCAG AAA, evite valores hardcoded, garanta responsividade mobile e suporte a dark mode. Documente violações em Markdown com severidade (error/warning/info), número da linha e sugestão de correção. Para React Native, use apenas componentes nativos (View, Text, Image, ScrollView, FlatList)."
```

---

## 🔍 Prompts Específicos por Tipo de Validação

### 1. Validação de Tokens de Design

```bash
claude -p "Analise [ARQUIVO].tsx por valores hardcoded de cor, espaçamento e tipografia. Compare com src/theme/tokens.ts e identifique violações. Para cada violação encontrada, forneça: (1) linha do código, (2) valor hardcoded, (3) token correto a usar, (4) exemplo de correção. Priorize cores do design system (primary: #FF7A96, secondary: #A78BFA) e espaçamentos do grid (múltiplos de 4px)." --append-system-prompt "Nunca aceite valores hardcoded. Sempre use tokens do design system."
```

**Exemplo de uso**:
```bash
claude -p "Analise HomeScreen.tsx por valores hardcoded..." --append-system-prompt "..."
```

### 2. Validação de Acessibilidade

```bash
claude -p "Audite acessibilidade da tela [NOME_TELA].tsx: (1) Verifique contraste de cores (WCAG AAA requer 7:1 para texto normal, 4.5:1 para texto grande), (2) Valide accessibilityLabel e accessibilityHint em todos os componentes interativos, (3) Confirme alvos de toque mínimos de 44x44pt, (4) Verifique suporte a Dynamic Type (allowFontScaling), (5) Teste navegação por teclado/VoiceOver. Gere relatório JSON estruturado com violações e sugestões." --append-system-prompt "Acessibilidade é crítica para apps mobile. Sempre valide contra WCAG AAA."
```

**JSON Schema sugerido**:
```json
{
  "type": "object",
  "properties": {
    "status": {"type": "string", "enum": ["pass", "fail", "warning"]},
    "violations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "severity": {"type": "string", "enum": ["error", "warning", "info"]},
          "type": {"type": "string"},
          "component": {"type": "string"},
          "lineNumber": {"type": "integer"},
          "message": {"type": "string"},
          "suggestion": {"type": "string"},
          "wcagLevel": {"type": "string"}
        },
        "required": ["severity", "type", "message", "suggestion"]
      }
    },
    "summary": {
      "type": "object",
      "properties": {
        "totalViolations": {"type": "integer"},
        "errors": {"type": "integer"},
        "warnings": {"type": "integer"},
        "info": {"type": "integer"}
      }
    }
  },
  "required": ["status", "violations"]
}
```

### 3. Validação de Responsividade Mobile

```bash
claude -p "Valide responsividade da tela [NOME_TELA].tsx para diferentes tamanhos de tela mobile: (1) iPhone SE (375x667), (2) iPhone 14 Pro (393x852), (3) iPhone 14 Pro Max (430x932), (4) Android pequeno (360x640), (5) Android grande (412x915). Verifique: uso de Flexbox, SafeAreaView para iOS notch, KeyboardAvoidingView em formulários, FlatList para listas longas (não ScrollView), e adaptação de espaçamentos. Identifique problemas de overflow ou elementos cortados." --append-system-prompt "React Native deve funcionar em todos os tamanhos de tela. Use Flexbox e dimensões relativas."
```

### 4. Validação de Dark Mode

```bash
claude -p "Valide suporte a dark mode na tela [NOME_TELA].tsx: (1) Verifique uso de colors do useTheme() hook, (2) Confirme que não há cores hardcoded que quebram no dark mode, (3) Valide contraste adequado em ambos os temas, (4) Teste transição entre temas. Liste todas as cores usadas e confirme que vêm de colors.background, colors.text, colors.primary, etc." --append-system-prompt "Dark mode é obrigatório. Todas as cores devem vir do theme context."
```

### 5. Validação de Componentes Primitivos

```bash
claude -p "Valide que [NOME_TELA].tsx usa apenas componentes primitivos de src/components/primitives/: Box, Text, Heading, Button, HapticButton, Input. Não deve usar View, Text ou TouchableOpacity diretamente do React Native, exceto quando necessário para casos específicos. Liste todos os componentes usados e identifique violações. Para cada violação, sugira substituição pelo componente primitivo equivalente." --append-system-prompt "Consistência visual requer uso de componentes primitivos do design system."
```

### 6. Validação de Performance Mobile

```bash
claude -p "Analise performance da tela [NOME_TELA].tsx: (1) Verifique uso de FlatList para listas (não ScrollView com map), (2) Confirme uso de useMemo e useCallback onde apropriado, (3) Valide lazy loading de imagens (expo-image), (4) Verifique re-renders desnecessários, (5) Confirme uso de getItemLayout em FlatList quando possível. Identifique oportunidades de otimização." --append-system-prompt "Performance é crítica em mobile. Otimize renderizações e use listas virtuais."
```

---

## 🛠️ Prompts para Tarefas Específicas

### Implementar Tela Baseada em Layout

```bash
claude -p "Implemente [NOME_TELA].tsx baseado no layout descrito em LAYOUT_COMPLETO_REFERENCIA.md, seção [SEÇÃO]. Use apenas componentes React Native nativos e primitivos de src/components/primitives/. Siga o design system em src/theme/tokens.ts. Implemente: (1) Estrutura básica com SafeAreaView, (2) Header conforme especificação, (3) Seções principais, (4) Navegação inferior se aplicável, (5) Dark mode completo, (6) Acessibilidade WCAG AAA. Após implementar, valide contra tokens e gere relatório de conformidade." --append-system-prompt "Implementação deve seguir exatamente o layout de referência, usando apenas componentes mobile nativos."
```

### Refatorar Tela para Design System

```bash
claude -p "Refatore [NOME_TELA].tsx para usar design tokens: (1) Substitua todas as cores hardcoded por colors do useTheme(), (2) Substitua espaçamentos hardcoded por Spacing tokens, (3) Substitua tamanhos de fonte hardcoded por Typography.sizes, (4) Substitua componentes React Native diretos por primitivos do design system, (5) Adicione suporte a dark mode se faltar, (6) Adicione accessibilityLabels onde faltar. Mantenha funcionalidade idêntica, apenas melhore design e acessibilidade." --append-system-prompt "Refatoração deve manter funcionalidade, apenas melhorar design e consistência."
```

### Validar Onboarding Completo

```bash
claude -p "Valide OnboardingFlowNew.tsx contra LAYOUT_COMPLETO_REFERENCIA.md: (1) Confirme todas as 8 etapas implementadas, (2) Valide textos corrigidos (sem erros de digitação), (3) Verifique indicadores de progresso (dots), (4) Confirme navegação voltar/avançar, (5) Valide persistência de dados, (6) Teste validações de campos, (7) Verifique animações de transição, (8) Confirme integração com profileService. Gere checklist completo com status de cada item." --append-system-prompt "Onboarding é primeira impressão. Deve ser perfeito."
```

---

## 📊 Template de Relatório de Validação

Após executar qualquer prompt de validação, o relatório deve seguir este formato:

```markdown
# Relatório de Validação - [NOME_TELA].tsx

**Data**: [DATA]  
**Arquivo**: `src/screens/[NOME_TELA].tsx`  
**Status Geral**: ✅ Pass / ⚠️ Warning / ❌ Fail

## 📋 Resumo
- **Total de Violações**: X
- **Erros**: X
- **Warnings**: X
- **Info**: X

## 🔴 Erros Críticos
1. **[Tipo]**: [Descrição]
   - **Linha**: X
   - **Código**: `[código problemático]`
   - **Sugestão**: `[código corrigido]`
   - **WCAG**: [Nível se aplicável]

## ⚠️ Warnings
1. **[Tipo]**: [Descrição]
   - **Linha**: X
   - **Sugestão**: [Correção sugerida]

## ℹ️ Informações
1. **[Tipo]**: [Descrição]
   - **Sugestão**: [Melhoria opcional]

## ✅ Conformidade
- [x] Tokens de design: Conforme
- [x] Acessibilidade: WCAG AAA
- [x] Dark mode: Implementado
- [x] Responsividade: Testado
- [x] Performance: Otimizado
```

---

## 🎯 Prompts para Workflows Completos

### Workflow: Implementar + Validar + Corrigir

```bash
# Passo 1: Implementar
claude -p "Implemente [NOME_TELA].tsx conforme LAYOUT_COMPLETO_REFERENCIA.md..." 

# Passo 2: Validar
claude -p "Valide [NOME_TELA].tsx: tokens, acessibilidade, dark mode, responsividade..." --json-schema '{...}'

# Passo 3: Corrigir (se necessário)
claude -p "Corrija violações identificadas no relatório de validação de [NOME_TELA].tsx. Mantenha funcionalidade, apenas corrija design e acessibilidade."
```

### Workflow: Refatoração Completa

```bash
claude -p "Refatore [NOME_TELA].tsx completamente: (1) Substitua todos os componentes por primitivos, (2) Use apenas tokens de design, (3) Adicione dark mode completo, (4) Melhore acessibilidade, (5) Otimize performance. Após refatoração, valide e gere relatório."
```

---

## 🔧 Configuração de Subagentes (Opcional)

Para validação paralela especializada:

```json
{
  "design-validator": {
    "description": "Valida UI contra tokens e mocks",
    "prompt": "Foque em tokens de cor, espaçamento e acessibilidade. Use screenshots para feedback visual.",
    "tools": ["Read", "Grep", "Playwright"],
    "model": "sonnet"
  },
  "accessibility-auditor": {
    "description": "Audita acessibilidade WCAG AAA",
    "prompt": "Valide contraste, labels ARIA, alvos de toque e navegação por teclado.",
    "tools": ["Read", "Grep"],
    "model": "sonnet"
  },
  "performance-optimizer": {
    "description": "Otimiza performance mobile",
    "prompt": "Analise re-renders, listas virtuais e lazy loading.",
    "tools": ["Read", "Grep"],
    "model": "sonnet"
  }
}
```

Uso:
```bash
claude -p "Use subagente design-validator para auditar [NOME_TELA].tsx" --agents '{...json acima...}'
```

---

## 📝 Checklist de Validação Rápida

Para validação rápida antes de commit:

```bash
claude -p "Validação rápida de [ARQUIVO].tsx: (1) Tokens usados? (2) Dark mode OK? (3) Acessibilidade básica? (4) Componentes primitivos? (5) Performance OK? Resposta: Sim/Não para cada item + lista de problemas encontrados."
```

---

## 🚨 Erros Comuns a Evitar

1. **Valores hardcoded**: Sempre usar tokens
2. **Componentes web**: Apenas React Native nativos
3. **Acessibilidade ignorada**: Sempre WCAG AAA
4. **Dark mode esquecido**: Sempre implementar
5. **Performance negligenciada**: Usar FlatList, memoização
6. **Responsividade**: Testar em múltiplos tamanhos

---

## 💡 Dicas de Uso

1. **Especificidade**: Sempre mencione arquivo específico e seção do layout
2. **Iteração**: Use `/clear` para reset e itere até perfeição
3. **Visual**: Inclua screenshots quando disponíveis para comparação
4. **Contexto**: Sempre referencie LAYOUT_COMPLETO_REFERENCIA.md e tokens.ts
5. **Mobile-first**: Lembre que é React Native, não web

---

**Última atualização**: 2025-11-27  
**Versão**: 1.0

