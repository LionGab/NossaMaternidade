# 🎯 PROMPT DE EXECUÇÃO - FASE 2: Substituição console.* → logger

## CONTEXTO DO PROJETO

**Projeto:** Nossa Maternidade (React Native + Expo + TypeScript)
**Branch:** feature/code-quality-refactor
**Status:** FASE 2 em progresso - 92/129 console.* já substituídos (71%)

**Progresso Anterior:**
- ✅ Batch 1: 55 console.* → logger (milestonesService, feedService, habitsService)
- ✅ Batch 2: 37 console.* → logger (storage, chatService, utils)
- ⏳ Batch 3-5: 37 console.* restantes (este prompt)

**Arquivos Intencionais (NÃO MODIFICAR):**
- `src/utils/logger.ts` (4 console.*) - Fallback do próprio logger
- `src/services/sentry.ts` (8 console.*) - Fallback para monitoramento

---

## OBJETIVO

Substituir os **37 console.* restantes** por `logger` seguindo o padrão já estabelecido:
- `console.error` → `logger.error(message, error, context?)`
- `console.warn` → `logger.warn(message, error?, context?)`
- `console.log` → `logger.debug(message, context?)` (para logs de debug)
- `console.info` → `logger.info(message, context?)`

---

## PADRÃO DE SUBSTITUIÇÃO

### 1. console.error → logger.error

**Antes:**
```typescript
catch (error) {
  console.error('Erro ao inicializar chat:', error);
  Alert.alert('Erro', 'Não foi possível carregar o chat');
}
```

**Depois:**
```typescript
import { logger } from '../utils/logger';

catch (error) {
  logger.error('Erro ao inicializar chat', error);
  Alert.alert('Erro', 'Não foi possível carregar o chat');
}
```

### 2. console.warn → logger.warn

**Antes:**
```typescript
console.warn('[Supabase] Warning message');
```

**Depois:**
```typescript
import { logger } from '../utils/logger';

logger.warn('[Supabase] Warning message');
```

### 3. console.log (debug) → logger.debug

**Antes:**
```typescript
console.log('Opening external link:', href);
```

**Depois:**
```typescript
import { logger } from '../utils/logger';

logger.debug('Opening external link', { href });
```

### 4. console.log (ação) → logger.debug

**Antes:**
```typescript
onPress: () => console.log('Ação executada'),
```

**Depois:**
```typescript
import { logger } from '../utils/logger';

onPress: () => logger.debug('Ação executada'),
```

---

## BATCH 3: SCREENS (14 console.*)

### 1. `src/screens/ChatScreen.tsx` (4 ocorrências)

**Linha ~121:**
```typescript
// ANTES
console.error('Erro ao inicializar chat:', error);

// DEPOIS
logger.error('Erro ao inicializar chat', error);
```

**Linha ~154:**
```typescript
// ANTES
console.error('Erro ao enviar mensagem:', error);

// DEPOIS
logger.error('Erro ao enviar mensagem', error);
```

**Linha ~209:**
```typescript
// ANTES
console.error('Erro ao limpar histórico:', error);

// DEPOIS
logger.error('Erro ao limpar histórico', error);
```

**Linha ~261:**
```typescript
// ANTES
console.error('Error picking image:', error);

// DEPOIS
logger.error('Error picking image', error);
```

**Import necessário (adicionar no topo se não existir):**
```typescript
import { logger } from '../utils/logger';
```

---

### 2. `src/screens/OnboardingFlowNew.tsx` (2 ocorrências)

**Linha ~95:**
```typescript
// ANTES
console.error('Erro ao salvar dados do usuário:', error);

// DEPOIS
logger.error('Erro ao salvar dados do usuário', error);
```

**Linha ~752:**
```typescript
// ANTES
console.error('Erro ao salvar aceitação:', error);

// DEPOIS
logger.error('Erro ao salvar aceitação', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 3. `src/screens/LoginScreenNew.tsx` (2 ocorrências)

**Linha ~50:**
```typescript
// ANTES
console.error('Erro no login:', error);

// DEPOIS
logger.error('Erro no login', error);
```

**Linha ~72:**
```typescript
// ANTES
console.error(`Erro no login ${provider}:`, error);

// DEPOIS
logger.error(`Erro no login ${provider}`, error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 4. `src/screens/TermsOfServiceScreen.tsx` (1 ocorrência)

**Linha ~68:**
```typescript
// ANTES
console.error('Erro ao aceitar termos:', error);

// DEPOIS
logger.error('Erro ao aceitar termos', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 5. `src/screens/SplashScreen.tsx` (1 ocorrência)

**Linha ~32:**
```typescript
// ANTES
console.warn('Erro ao verificar onboarding:', error);

// DEPOIS
logger.warn('Erro ao verificar onboarding', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 6. `src/screens/OnboardingFlow.tsx` (1 ocorrência)

**Linha ~58:**
```typescript
// ANTES
console.error('Erro ao salvar dados do usuário:', error);

// DEPOIS
logger.error('Erro ao salvar dados do usuário', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 7. `src/screens/MundoNathScreen.tsx` (1 ocorrência)

**Linha ~248:**
```typescript
// ANTES
Linking.openURL('https://forms.gle/waitlist').catch((err) => console.error('Erro ao abrir link:', err));

// DEPOIS
import { logger } from '../utils/logger';

Linking.openURL('https://forms.gle/waitlist').catch((err) => logger.error('Erro ao abrir link', err));
```

---

### 8. `src/screens/DiaryScreen.tsx` (1 ocorrência)

**Linha ~33:**
```typescript
// ANTES
console.error('Error analyzing diary:', error);

// DEPOIS
logger.error('Error analyzing diary', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 9. `src/screens/DesignSystemScreen.tsx` (1 ocorrência)

**Linha ~276:**
```typescript
// ANTES
onPress: () => console.log('Ação executada'),

// DEPOIS
onPress: () => logger.debug('Ação executada'),
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

## BATCH 4: SERVICES + UTILS (6 console.*)

### 10. `src/services/trackingService.ts` (2 ocorrências)

**Linha ~25:**
```typescript
// ANTES
console.error('Erro ao verificar status de tracking:', error);

// DEPOIS
logger.error('Erro ao verificar status de tracking', error);
```

**Linha ~55:**
```typescript
// ANTES
console.error('Erro ao solicitar permissão de tracking:', error);

// DEPOIS
logger.error('Erro ao solicitar permissão de tracking', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 11. `src/services/supabase.ts` (2 ocorrências)

**Linha ~20:**
```typescript
// ANTES
console.warn(
  '⚠️ Supabase não configurado. Adicione supabaseUrl e supabaseAnonKey em app.json.extra ou variáveis de ambiente.'
);

// DEPOIS
import { logger } from './logger'; // ou '../utils/logger' dependendo da estrutura

logger.warn('⚠️ Supabase não configurado. Adicione supabaseUrl e supabaseAnonKey em app.json.extra ou variáveis de ambiente.');
```

**Linha ~34:**
```typescript
// ANTES
console.error('[Supabase] Erro na migração para SecureStore:', error);

// DEPOIS
logger.error('[Supabase] Erro na migração para SecureStore', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 12. `src/hooks/useStorage.ts` (2 ocorrências)

**Linha ~24:**
```typescript
// ANTES
console.error(`Erro ao carregar ${key}:`, error);

// DEPOIS
logger.error(`Erro ao carregar ${key}`, error);
```

**Linha ~42:**
```typescript
// ANTES
console.error(`Erro ao salvar ${key}:`, error);

// DEPOIS
logger.error(`Erro ao salvar ${key}`, error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

## BATCH 5: COMPONENTS + AGENTS + CONTEXTS + NAVIGATION (17 console.*)

### 13. `src/components/primitives/Link.tsx` (2 ocorrências)

**Linha ~61:**
```typescript
// ANTES
console.log('Opening external link:', href);

// DEPOIS
logger.debug('Opening external link', { href });
```

**Linha ~64:**
```typescript
// ANTES
console.log('Navigating to:', href);

// DEPOIS
logger.debug('Navigating to', { href });
```

**Import necessário:**
```typescript
import { logger } from '../../utils/logger';
```

---

### 14. `src/agents/habits/HabitsAnalysisAgent.ts` (2 ocorrências)

**Linha ~136:**
```typescript
// ANTES
console.error('[HabitsAnalysisAgent] Error analyzing habits:', error);

// DEPOIS
logger.error('[HabitsAnalysisAgent] Error analyzing habits', error);
```

**Linha ~442:**
```typescript
// ANTES
console.error('[HabitsAnalysisAgent] Failed to generate recommendations:', error);

// DEPOIS
logger.error('[HabitsAnalysisAgent] Failed to generate recommendations', error);
```

**Import necessário:**
```typescript
import { logger } from '../../utils/logger';
```

---

### 15. `src/agents/content/ContentRecommendationAgent.ts` (2 ocorrências)

**Linha ~134:**
```typescript
// ANTES
console.error(
  '[ContentRecommendationAgent] Failed to generate recommendations:',
  error
);

// DEPOIS
logger.error('[ContentRecommendationAgent] Failed to generate recommendations', error);
```

**Linha ~312:**
```typescript
// ANTES
console.error('[ContentRecommendationAgent] Failed to generate reasoning:', error);

// DEPOIS
logger.error('[ContentRecommendationAgent] Failed to generate reasoning', error);
```

**Import necessário:**
```typescript
import { logger } from '../../utils/logger';
```

---

### 16. `src/theme/ThemeContext.tsx` (2 ocorrências)

**Linha ~136:**
```typescript
// ANTES
console.error('Failed to load theme preference:', error);

// DEPOIS
logger.error('Failed to load theme preference', error);
```

**Linha ~146:**
```typescript
// ANTES
console.error('Failed to save theme preference:', error);

// DEPOIS
logger.error('Failed to save theme preference', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 17. `src/contexts/AuthContext.tsx` (2 ocorrências)

**Linha ~31:**
```typescript
// ANTES
console.error('[AuthContext] Erro ao inicializar session manager:', error);

// DEPOIS
logger.error('[AuthContext] Erro ao inicializar session manager', error);
```

**Linha ~121:**
```typescript
// ANTES
console.warn('[AuthContext] Erro ao fazer logout:', error);

// DEPOIS
logger.warn('[AuthContext] Erro ao fazer logout', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 18. `src/navigation/StackNavigator.tsx` (1 ocorrência)

**Linha ~44:**
```typescript
// ANTES
console.warn('[StackNavigator] Erro ao verificar onboarding:', error);

// DEPOIS
logger.warn('[StackNavigator] Erro ao verificar onboarding', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

### 19. `src/navigation/index.tsx` (1 ocorrência)

**Linha ~11:**
```typescript
// ANTES
console.error('[Navigation] Erro ao inicializar network monitor:', error);

// DEPOIS
logger.error('[Navigation] Erro ao inicializar network monitor', error);
```

**Import necessário:**
```typescript
import { logger } from '../utils/logger';
```

---

## REGRAS CRÍTICAS

1. **NUNCA modificar:**
   - `src/utils/logger.ts` (4 console.* são intencionais com eslint-disable)
   - `src/services/sentry.ts` (8 console.* são intencionais com eslint-disable)

2. **Sempre adicionar import:**
   - Verificar se `logger` já está importado antes de adicionar
   - Usar caminho relativo correto baseado na estrutura de pastas:
     - `src/screens/*` → `import { logger } from '../utils/logger';`
     - `src/services/*` → `import { logger } from '../utils/logger';`
     - `src/components/primitives/*` → `import { logger } from '../../utils/logger';`
     - `src/agents/*/*` → `import { logger } from '../../utils/logger';`
     - `src/theme/*` → `import { logger } from '../utils/logger';`
     - `src/contexts/*` → `import { logger } from '../utils/logger';`
     - `src/navigation/*` → `import { logger } from '../utils/logger';`
     - `src/hooks/*` → `import { logger } from '../utils/logger';`

3. **Padrão de mensagens:**
   - Remover dois pontos (`:`) após a mensagem quando o erro vem como segundo parâmetro
   - `console.error('Mensagem:', error)` → `logger.error('Mensagem', error)`
   - Para logs de debug com contexto, usar objeto: `logger.debug('Mensagem', { key: value })`

4. **Manter funcionalidade:**
   - Não alterar lógica, apenas substituir console.* por logger
   - Manter todos os Alert.alert e tratamento de erro existentes

---

## VALIDAÇÃO PÓS-EXECUÇÃO

Após completar todos os batches, executar:

```bash
# 1. Verificar que não há console.* não intencionais
grep -r "console\.\(log\|error\|warn\|info\|debug\)" src/ --exclude-dir=node_modules | grep -v "eslint-disable" | grep -v "logger.ts" | grep -v "sentry.ts"

# 2. Verificar TypeScript
npm run type-check

# 3. Verificar lint
npm run lint

# 4. Contar console.* restantes (deve ser 12: 4 em logger.ts + 8 em sentry.ts)
grep -r "console\." src/ --exclude-dir=node_modules | wc -l
```

**Resultado esperado:**
- ✅ 0 console.* não intencionais
- ✅ 0 erros TypeScript
- ✅ 0 warnings críticos de lint
- ✅ Apenas 12 console.* (4 em logger.ts + 8 em sentry.ts)

---

## ORDEM DE EXECUÇÃO RECOMENDADA

1. **Batch 3: Screens** (14 arquivos) - Maior impacto visual
2. **Batch 4: Services + Utils** (3 arquivos) - Core do sistema
3. **Batch 5: Components + Agents + Contexts + Navigation** (7 arquivos) - Infraestrutura

---

## COMANDO DE EXECUÇÃO

**Para Claude Code:**
```
Execute a FASE 2 completa substituindo todos os 37 console.* restantes por logger seguindo o padrão estabelecido neste prompt. Processe os 3 batches em ordem (Screens → Services/Utils → Components/Agents/Contexts/Navigation). Após cada batch, valide que não há erros de importação ou TypeScript. Ao final, execute as validações pós-execução.
```

---

**Status:** ✅ Prompt pronto para execução
**Estimativa:** 30-40 minutos
**Tokens estimados:** 15-20k

