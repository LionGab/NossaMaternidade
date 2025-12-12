# 📊 Análise do Repositório - Nossa Maternidade

**Data:** 2025-01-27  
**Status:** ✅ TypeScript sem erros | ⚠️ Melhorias necessárias

---

## 🎯 Resumo Executivo

O repositório está em **bom estado geral** com TypeScript strict mode funcionando sem erros. No entanto, existem várias oportunidades de melhoria em conformidade com as regras do projeto, qualidade de código, testes e arquitetura.

### Pontuação Geral: 7.5/10

- ✅ **TypeScript:** 0 erros (excelente)
- ⚠️ **Conformidade com Regras:** 6/10 (98 console.log encontrados)
- ⚠️ **Testes:** Cobertura baixa (necessário verificar)
- ✅ **Design System:** Tokens bem estruturados
- ⚠️ **Arquitetura:** Alguns componentes com lógica de negócio

---

## 🔴 CRÍTICO (Prioridade 1)

### 1. Uso de `console.log` em vez de Logger

**Problema:** Encontrados **98 usos de `console.log/error/warn`** em 15 arquivos, violando a regra obrigatória de usar `logger` centralizado.

**Arquivos Afetados:**
- `src/components/atoms/ChatBubble.tsx`
- `src/agents/examples/AdvancedToolUseExamples.ts`
- `src/agents/health/checks/QualityChecks.ts`
- `src/polyfills.ts`
- `src/mcp/runners/*.js` (múltiplos arquivos)
- E mais 10 arquivos

**Impacto:** 
- Logs não estruturados em produção
- Perda de contexto de sessão
- Dificuldade de debugging
- Não integrado com Sentry

**Solução:**
```typescript
// ❌ ERRADO
console.log('Mensagem');
console.error('Erro', error);

// ✅ CORRETO
import { logger } from '@/utils/logger';
logger.info('Mensagem');
logger.error('Erro', error);
```

**Ação:** Substituir todos os `console.*` por `logger.*` usando busca e substituição sistemática.

---

### 2. Uso de `any` em `src/services/sentry.ts`

**Problema:** 2 ocorrências de `any` em arquivo crítico de segurança.

**Localização:**
- Linha 13: `let Sentry: any = null;`
- Linha 103: `const sentryEvent = event as any;`

**Impacto:** 
- Perda de type safety em código de segurança
- Potencial para bugs em produção

**Solução:**
```typescript
// ✅ CORRETO
import type * as SentryType from '@sentry/react-native';
let Sentry: typeof SentryType | null = null;

// Para beforeSend
interface SentryEvent {
  user?: { id?: string; [key: string]: unknown };
  [key: string]: unknown;
}
const sentryEvent = event as SentryEvent;
```

---

### 3. Uso de `StyleSheet.create` em vez de Design Tokens

**Problema:** Encontrados **81 arquivos** usando `StyleSheet.create`, violando a regra de usar apenas design tokens e NativeWind.

**Impacto:**
- Inconsistência visual
- Dificuldade de manutenção
- Não suporta dark mode automaticamente
- Não segue o design system estabelecido

**Solução:**
```typescript
// ❌ ERRADO
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
});

// ✅ CORRETO
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/theme';

const colors = useThemeColors();
<Box 
  backgroundColor={colors.background.card}
  padding={Tokens.spacing['4']}
/>
```

**Ação:** Refatorar gradualmente, começando pelos componentes mais usados.

---

## 🟡 ALTO (Prioridade 2)

### 4. Componentes com Lógica de Negócio

**Problema:** Componentes em `src/components` podem estar fazendo chamadas diretas a APIs/Supabase, violando a arquitetura de separação de responsabilidades.

**Regra Violada:**
> "Componentes em `src/components` são APENAS apresentacionais. Toda lógica de negócio e comunicação com backend deve ficar em `src/services`"

**Ação Necessária:**
- Auditar componentes críticos (HomeScreen, ChatScreen, ProfileScreen)
- Mover lógica de negócio para services
- Criar hooks em `src/hooks` para conectar UI e services

**Exemplo de Refatoração:**
```typescript
// ❌ ERRADO: Componente com lógica de negócio
export const MaternalCard = () => {
  const [emotion, setEmotion] = useState();
  
  useEffect(() => {
    supabase.from('emotion_logs').select().then(setEmotion);
  }, []);
  
  return <Text>{emotion?.label}</Text>;
};

// ✅ CORRETO: Componente apresentacional + Hook + Service
// src/hooks/useEmotionTracking.ts
export const useEmotionTracking = () => {
  return useQuery({
    queryKey: ['emotion', 'today'],
    queryFn: () => emotionService.getTodayEmotion()
  });
};

// src/components/organisms/MaternalCard.tsx
export const MaternalCard = () => {
  const { data: emotion } = useEmotionTracking();
  return <Text>{emotion?.label}</Text>;
};
```

---

### 5. Cobertura de Testes Insuficiente

**Problema:** 
- Meta: 40% MVP, 60% Phase 2, 80% final
- Status atual: Não verificado (necessário rodar `npm run test:coverage`)

**Arquivos de Teste Encontrados:**
- ✅ 24 arquivos `.test.ts` (services, agents, utils)
- ✅ 5 arquivos `.test.tsx` (components)
- ⚠️ Necessário verificar cobertura real

**Ação:**
1. Rodar `npm run test:coverage`
2. Identificar gaps de cobertura
3. Priorizar testes para:
   - Services críticos (authService, chatService, emotionService)
   - Hooks customizados
   - Componentes de UI críticos

---

### 6. Validação de Inputs com Zod

**Problema:** Não verificado se todos os formulários estão usando Zod/Yup para validação.

**Regra:**
> "Valide **toda entrada de usuário** com **Zod ou Yup** (de preferência Zod)"

**Ação:**
- Auditar formulários:
  - OnboardingScreen
  - ChatScreen (input de mensagem)
  - ProfileScreen
  - LoginScreen
- Criar schemas Zod centralizados em `src/schemas/validation.ts`
- Aplicar validação em todos os inputs

---

## 🟢 MÉDIO (Prioridade 3)

### 7. Estrutura de Pastas - Componentes Duplicados

**Problema:** Alguns componentes podem estar duplicados em diferentes locais.

**Observações:**
- `src/components/Button.tsx` e `src/components/atoms/Button.tsx`
- `src/components/Card.tsx` e `src/components/atoms/Card.tsx`
- `src/components/ProgressIndicator.tsx` e `src/components/atoms/ProgressIndicator.tsx`

**Ação:**
- Consolidar componentes duplicados
- Manter apenas versão em `atoms/` (Atomic Design)
- Atualizar imports em todo o projeto

---

### 8. Acessibilidade (WCAG AAA)

**Problema:** Regras de acessibilidade estão como `warn` no ESLint, mas devem ser `error` após Fase 2.

**Status Atual:**
- ESLint config: `react-native-a11y/*` rules estão como `warn`
- Meta: WCAG AAA compliance

**Ação:**
- Auditar componentes críticos:
  - Botões (touch targets >= 44pt)
  - Inputs (labels, hints)
  - Navegação (roles, states)
- Adicionar `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`
- Validar contraste de cores (7:1 mínimo)

---

### 9. Performance - Componentes Grandes

**Problema:** Regra estabelece que componentes devem ter até ~300 linhas.

**Ação:**
- Identificar componentes grandes:
  ```bash
  find src/components src/screens -name "*.tsx" -exec wc -l {} \; | sort -rn | head -20
  ```
- Quebrar em subcomponentes ou hooks
- Aplicar `React.memo` onde apropriado

---

### 10. Dependências Deprecadas

**Problema:** Warnings durante `npm install`:
- `eslint@8.57.1` está deprecated
- `glob@7.2.3` está deprecated (múltiplas ocorrências)

**Ação:**
- Atualizar ESLint para v9+ (pode requerer migração de config)
- Atualizar dependências que usam `glob` antigo

---

## 🔵 BAIXO (Prioridade 4)

### 11. Documentação de Componentes

**Problema:** Componentes podem não ter JSDoc adequado.

**Ação:**
- Adicionar JSDoc em componentes públicos
- Documentar props, exemplos de uso
- Criar Storybook (opcional, mas recomendado)

---

### 12. Error Boundaries

**Problema:** Verificar se todas as telas críticas têm Error Boundaries.

**Ação:**
- Auditar telas principais
- Garantir que `ErrorBoundary` está aplicado no App.tsx
- Adicionar Error Boundaries específicos onde necessário

---

### 13. Otimizações de Bundle Size

**Ação:**
- Analisar bundle size: `npx expo export --platform web`
- Identificar imports desnecessários
- Usar lazy loading para telas não críticas
- Code splitting onde apropriado

---

## 📋 Checklist de Ações Imediatas

### Semana 1 (Crítico)
- [ ] Substituir todos os `console.*` por `logger.*` (98 ocorrências)
- [ ] Remover `any` de `src/services/sentry.ts`
- [ ] Rodar `npm run test:coverage` e documentar gaps
- [ ] Auditar componentes críticos para lógica de negócio

### Semana 2 (Alto)
- [ ] Refatorar 10 componentes mais usados de `StyleSheet.create` para tokens
- [ ] Criar schemas Zod para todos os formulários
- [ ] Consolidar componentes duplicados
- [ ] Mover lógica de negócio de componentes para services

### Semana 3-4 (Médio)
- [ ] Adicionar testes para services críticos (meta: 40% cobertura)
- [ ] Melhorar acessibilidade (WCAG AAA)
- [ ] Quebrar componentes grandes (>300 linhas)
- [ ] Atualizar dependências deprecadas

---

## 🎯 Métricas de Sucesso

### Fase 1 (MVP) - Meta em 4 semanas
- ✅ 0 erros TypeScript (já alcançado)
- ⚠️ 0 `console.*` no código (98 → 0)
- ⚠️ 0 `any` em código crítico (2 → 0)
- ⚠️ 40%+ cobertura de testes
- ⚠️ Todos os formulários validados com Zod

### Fase 2 (Ampliação) - Meta em 8 semanas
- ⚠️ 60%+ cobertura de testes
- ⚠️ 0 componentes com lógica de negócio
- ⚠️ WCAG AAA compliance
- ⚠️ Todos os componentes usando design tokens

### Fase 3 (Lançamento) - Meta em 12 semanas
- ⚠️ 80%+ cobertura de testes
- ⚠️ Performance otimizada (bundle size, lazy loading)
- ⚠️ Documentação completa

---

## 📚 Recursos e Referências

- **Design System:** `src/theme/tokens.ts` (excelente estrutura)
- **Logger:** `src/utils/logger.ts` (bem implementado)
- **Regras do Projeto:** `.cursorrules` (detalhadas e claras)
- **TypeScript Config:** `tsconfig.json` (strict mode ativo)

---

## 🚀 Próximos Passos Recomendados

1. **Criar issue no GitHub** para cada item crítico
2. **Priorizar** substituição de `console.*` (mais rápido de resolver)
3. **Estabelecer PR template** com checklist de conformidade
4. **Configurar CI/CD** para bloquear PRs com:
   - `console.*` no código
   - `any` em arquivos críticos
   - Cobertura de testes abaixo da meta
5. **Criar guia de migração** para `StyleSheet.create` → tokens

---

**Última atualização:** 2025-01-27  
**Próxima revisão:** Após implementação dos itens críticos
