# Migração do Design System

## Status Atual

O projeto está em transição de `src/utils/colors.ts` para `src/theme/design-system.ts` como fonte única de verdade.

## Arquitetura

```
src/theme/design-system.ts  ← FONTE ÚNICA DE VERDADE
    ↓ (re-exporta)
src/utils/colors.ts         ← COMPATIBILIDADE (deprecated)
    ↓ (usado por)
Componentes e Telas
```

## Regras de Migração

### ✅ FAZER

1. **Novos componentes**: Sempre usar `COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`, `SHADOWS` de `design-system.ts`
2. **Novas telas**: Importar diretamente de `design-system.ts`
3. **Refatorações**: Migrar gradualmente de `colors.ts` para `design-system.ts`

### ❌ NÃO FAZER

1. **Não adicionar novas cores** em `colors.ts` - adicione em `design-system.ts`
2. **Não criar novos arquivos de cores** - use o design-system
3. **Não usar valores hardcoded** - sempre use tokens

## Como Migrar

### Passo 1: Identificar Uso

```bash
# Encontrar todos os imports de colors.ts
grep -r "from.*utils/colors" src/
```

### Passo 2: Substituir Import

**Antes**:

```typescript
import { Colors } from "../utils/colors";
```

**Depois**:

```typescript
import { COLORS, TYPOGRAPHY, SPACING } from "../theme/design-system";
```

### Passo 3: Substituir Uso

**Antes**:

```typescript
const bg = Colors.background.DEFAULT;
const text = Colors.text.dark;
```

**Depois**:

```typescript
const bg = COLORS.background.primary;
const text = COLORS.neutral[900];
```

### Passo 4: Usar Tokens do Design System

**Antes**:

```typescript
padding: 16,
fontSize: 18,
borderRadius: 12,
```

**Depois**:

```typescript
padding: SPACING.lg,
fontSize: TYPOGRAPHY.bodyLarge.fontSize,
borderRadius: RADIUS.lg,
```

## Mapeamento de Cores

| colors.ts                   | design-system.ts            |
| --------------------------- | --------------------------- |
| `Colors.primary.DEFAULT`    | `COLORS.primary[500]`       |
| `Colors.background.DEFAULT` | `COLORS.background.primary` |
| `Colors.text.dark`          | `COLORS.neutral[900]`       |
| `Colors.ui.border`          | `COLORS.neutral[200]`       |

## Mapeamento Completo

Ver `src/utils/colors.ts` para o mapeamento completo de compatibilidade.

## Dark Mode

O dark mode usa `COLORS_DARK` de `design-system.ts`:

```typescript
import { COLORS, COLORS_DARK } from "../theme/design-system";
import { useTheme } from "../hooks/useTheme";

function MyComponent() {
  const { isDark, colors } = useTheme();
  // colors já retorna COLORS ou COLORS_DARK baseado no tema
}
```

## Checklist de Migração

Para cada componente/tela:

- [ ] Substituir import de `colors.ts` para `design-system.ts`
- [ ] Substituir `Colors.*` por `COLORS.*`
- [ ] Substituir valores hardcoded por tokens (`SPACING`, `TYPOGRAPHY`, etc.)
- [ ] Verificar se dark mode funciona corretamente
- [ ] Testar em diferentes tamanhos de tela
- [ ] Verificar acessibilidade (contraste, touch targets)

## Prioridade de Migração

1. **Alta**: Componentes base (`src/components/ui/*`)
2. **Média**: Telas principais (Home, Login, Community)
3. **Baixa**: Telas secundárias e modais

## Timeline

- **Fase 1**: Componentes base (semana 1-2)
- **Fase 2**: Telas principais (semana 3-4)
- **Fase 3**: Telas secundárias (semana 5-6)
- **Fase 4**: Remover `colors.ts` (após migração completa)

## Suporte

Para dúvidas sobre migração, consulte:

- `src/theme/design-system.ts` - Documentação completa
- `docs/COLOR_SYSTEM.md` - Sistema de cores detalhado
