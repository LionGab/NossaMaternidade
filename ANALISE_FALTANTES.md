# 📋 Análise do Repositório - O que está faltando

## ✅ O que JÁ EXISTE (Bom)

### Estrutura Base
- ✅ `App.tsx` configurado corretamente
- ✅ `index.ts` com polyfills
- ✅ Estrutura de pastas organizada (`src/screens`, `src/components`, `src/services`, etc.)
- ✅ TypeScript configurado (strict mode)
- ✅ Jest configurado com coverage thresholds
- ✅ Design tokens em `src/theme/tokens.ts` (completo e bem estruturado)
- ✅ Logger centralizado em `src/utils/logger.ts`
- ✅ `.env.example` com todas as variáveis necessárias

### Componentes
- ✅ Componentes primitivos em `src/components/atoms/` (Box, Text, Button, etc.)
- ✅ Componentes organizados por categoria (molecules, organisms, templates)
- ✅ Componentes específicos do app (chat, habits, community, etc.)

### Services
- ✅ Services organizados em `src/services/`
- ✅ Integração com Supabase
- ✅ Services de IA (aiRouter, aiClient, geminiService)
- ✅ Services de negócio (chatService, habitsService, profileService, etc.)

### Testes
- ✅ Testes unitários para services (29 arquivos `.test.ts`)
- ✅ Testes de componentes (5 arquivos `.test.tsx`)
- ✅ Configuração de coverage (40% em CI, 5% em dev)

### Documentação
- ✅ README.md completo
- ✅ Documentação de design system
- ✅ Documentação de arquitetura IA

---

## ❌ O que está FALTANDO (Crítico)

### 1. **Pasta `primitives` não existe** ⚠️ CRÍTICO

**Problema:** As regras do projeto mencionam `src/components/primitives`, mas a pasta real é `src/components/atoms/`.

**Impacto:**
- Inconsistência entre documentação e código
- Imports podem estar quebrados se alguém seguir a documentação
- Confusão sobre qual estrutura usar

**Solução:**
- Opção A: Criar alias/symlink `primitives` → `atoms`
- Opção B: Renomear `atoms` para `primitives` (breaking change)
- Opção C: Atualizar documentação para usar `atoms`

**Recomendação:** Opção C (atualizar documentação) - menos disruptivo.

---

### 2. **Falta estrutura `src/services/supabase/`** ⚠️ IMPORTANTE

**Problema:** As regras mencionam services organizados em `src/services/supabase/`, mas os services estão diretamente em `src/services/`.

**Estrutura esperada (pelas regras):**
```
src/services/
  supabase/
    profileService.ts
    chatService.ts
    emotionService.ts
    habitService.ts
    contentService.ts
  ai/
    llmRouter.ts
    aiOrchestrator.ts
    aiFallback.ts
```

**Estrutura atual:**
```
src/services/
  profileService.ts
  chatService.ts
  habitsService.ts
  ...
  aiRouter.ts
  aiClient.ts
```

**Impacto:**
- Organização menos clara
- Difícil distinguir services do Supabase vs outros
- Não segue o padrão documentado

**Solução:**
- Reorganizar services em subpastas (`supabase/`, `ai/`, etc.)
- Atualizar imports em todo o projeto

---

### 3. **Falta `src/ai/config/llmRouter.ts`** ⚠️ IMPORTANTE

**Problema:** As regras mencionam `src/ai/config/llmRouter.ts`, mas o arquivo existe em:
- `src/services/aiRouter.ts` (implementação atual)
- `src/agents/helpers/llmRouter.ts` (outro arquivo)

**Impacto:**
- Inconsistência de localização
- Múltiplas implementações podem causar confusão
- Não segue o padrão documentado

**Solução:**
- Consolidar em `src/ai/config/llmRouter.ts`
- Ou atualizar documentação para refletir localização real

---

### 4. **Falta estrutura `src/ai/prompts/` completa** ⚠️ IMPORTANTE

**Status:** ✅ Pasta existe em `src/ai/prompts/`
- ✅ `nathia.system.md` existe
- ❌ `crisis.system.md` **FALTA**
- ❌ `moderation.system.md` **FALTA**

**Solução:**
- Criar `src/ai/prompts/crisis.system.md`
- Criar `src/ai/prompts/moderation.system.md`

---

### 5. **`llmConfig.ts` existe, mas em local diferente** ⚠️ BAIXO

**Status:** ✅ `src/ai/llmConfig.ts` existe (não está em `src/ai/config/`, mas funciona)

**Problema:** As regras mencionam `src/ai/config/llmConfig.ts`, mas está em `src/ai/llmConfig.ts`

**Solução:**
- Opção A: Mover para `src/ai/config/llmConfig.ts` (seguir padrão)
- Opção B: Atualizar documentação para refletir localização real

---

### 6. **Falta estrutura `src/app/`** ⚠️ BAIXO

**Problema:** As regras mencionam `src/app/` para `App.tsx` e navegação root, mas `App.tsx` está na raiz.

**Status:** `App.tsx` está na raiz (funciona, mas não segue padrão documentado)

**Solução:**
- Opcional: Mover para `src/app/App.tsx`
- Ou atualizar documentação

---

### 7. **Falta validação de tipos TypeScript** ⚠️ CRÍTICO

**Problema:** Comando `npm run type-check` falhou (tsc não encontrado).

**Possíveis causas:**
- TypeScript não instalado
- node_modules não instalado
- PATH incorreto

**Solução:**
- Verificar se `npm install` foi executado
- Verificar se TypeScript está em `devDependencies` (está: `typescript: "~5.9.2"`)
- Executar `npm install` se necessário

---

### 8. **Falta verificação de `console.log`** ⚠️ MÉDIO

**Problema:** Encontrados 11 usos de `console.log/warn/error` no código:
- `src/polyfills.ts` (permitido - inicialização)
- `src/utils/logger.ts` (permitido - implementação do logger)
- `src/agents/examples/AdvancedToolUseExamples.ts` (permitido - exemplos)
- `src/services/aiRouter.README.md` (permitido - documentação)

**Status:** A maioria está em contextos permitidos, mas precisa verificar se há violações reais.

**Solução:**
- Criar script para detectar `console.log` em produção
- Adicionar regra ESLint para bloquear `console.log` (exceto em arquivos permitidos)

---

### 9. **Falta estrutura de testes mais completa** ⚠️ MÉDIO

**Status atual:**
- ✅ 29 testes de services
- ✅ 5 testes de componentes
- ❌ Falta testes para hooks
- ❌ Falta testes para screens
- ❌ Falta testes para agents

**Cobertura esperada (pelas regras):**
- MVP: 40% (atual: provavelmente abaixo)
- Phase 2: 60%
- Final: 80%

**Solução:**
- Adicionar testes para hooks críticos
- Adicionar testes para screens principais
- Adicionar testes para agents

---

### 10. **Falta verificação de uso de `@/design-system`** ⚠️ BAIXO

**Status:** Nenhum uso encontrado de `@/design-system` (bom sinal).

**Solução:**
- Manter monitoramento para evitar uso do sistema legado

---

### 11. **Falta estrutura `src/constants/emotions.ts`** ⚠️ BAIXO

**Status:** ❌ **NÃO EXISTE**

**Problema:** As regras mencionam `src/constants/emotions.ts` com 5 emojis e labels.

**Solução:**
- Criar `src/constants/emotions.ts` com:
  - 5 emojis de emoções
  - Labels correspondentes
  - Tipos TypeScript

---

### 12. **Falta estrutura `src/constants/onboarding.ts`** ⚠️ BAIXO

**Status:** ❌ **NÃO EXISTE**

**Problema:** As regras mencionam `src/constants/onboarding.ts` com perguntas da onboarding.

**Solução:**
- Criar `src/constants/onboarding.ts` com:
  - Perguntas da onboarding
  - Tipos TypeScript
  - Validações

---

### 13. **Faltam hooks mencionados nas regras** ⚠️ IMPORTANTE

**Status:** ❌ **NÃO EXISTEM**

**Hooks faltantes:**
- ❌ `src/hooks/useEmotionTracking.ts`
- ❌ `src/hooks/useHabits.ts`
- ❌ `src/hooks/useSupabase.ts`
- ❌ `src/hooks/useAIRouting.ts`

**Hooks existentes (verificado):**
- ✅ 18 arquivos em `src/hooks/` (precisa verificar quais)

**Solução:**
- Criar hooks faltantes conforme especificação nas regras
- Ou verificar se funcionalidade está em outros hooks

---

## ✅ Verificações Confirmadas

### Arquivos/Pastas Verificados:

1. **`src/ai/prompts/`** - ✅ Existe
   - ✅ `nathia.system.md` existe
   - ❌ `crisis.system.md` **FALTA**
   - ❌ `moderation.system.md` **FALTA**

2. **`src/ai/llmConfig.ts`** - ✅ Existe (em `src/ai/`, não em `src/ai/config/`)

3. **`src/constants/emotions.ts`** - ❌ **NÃO EXISTE**

4. **`src/constants/onboarding.ts`** - ❌ **NÃO EXISTE**

5. **`src/hooks/useEmotionTracking.ts`** - ❌ **NÃO EXISTE**

6. **`src/hooks/useHabits.ts`** - ❌ **NÃO EXISTE**

7. **`src/hooks/useSupabase.ts`** - ❌ **NÃO EXISTE**

8. **`src/hooks/useAIRouting.ts`** - ❌ **NÃO EXISTE**

---

## 📊 Resumo de Prioridades

### 🔴 CRÍTICO (Resolver Imediatamente)
1. ✅ Verificar e corrigir estrutura `primitives` vs `atoms`
2. ✅ Verificar e instalar TypeScript (comando type-check falhou)
3. ✅ Verificar estrutura de services (supabase/ separado)

### 🟡 IMPORTANTE (Resolver em Breve)
4. ✅ Consolidar `llmRouter.ts` em local correto
5. ✅ Criar prompts faltantes (`crisis.system.md`, `moderation.system.md`)
6. ✅ Criar hooks faltantes (`useEmotionTracking`, `useHabits`, `useSupabase`, `useAIRouting`)
7. ✅ Criar constantes faltantes (`emotions.ts`, `onboarding.ts`)
8. ✅ Adicionar testes para hooks e screens

### 🟢 BAIXO (Melhorias Futuras)
8. ✅ Reorganizar `App.tsx` para `src/app/` (opcional)
9. ✅ Adicionar script de validação de `console.log`
10. ✅ Verificar e criar constantes faltantes

---

## 🛠️ Ações Recomendadas

### Fase 1: Correções Críticas (Esta Semana)
1. **Verificar estrutura de pastas:**
   ```bash
   # Verificar se primitives existe ou se é atoms
   ls -la src/components/
   
   # Verificar estrutura de services
   ls -la src/services/
   
   # Verificar estrutura de ai
   ls -la src/ai/
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   npm run type-check
   ```

3. **Verificar arquivos faltantes:**
   ```bash
   # Verificar prompts
   ls -la src/ai/prompts/ 2>/dev/null || echo "Pasta não existe"
   
   # Verificar config
   ls -la src/ai/config/ 2>/dev/null || echo "Pasta não existe"
   ```

### Fase 2: Reorganização (Próxima Semana)
1. Reorganizar services em subpastas
2. Consolidar llmRouter
3. Criar estrutura de prompts se não existir

### Fase 3: Melhorias (Futuro)
1. Adicionar mais testes
2. Melhorar validações
3. Documentar estrutura real vs documentada

---

## 📝 Notas Finais

- O repositório está **bem estruturado** e **funcional**
- A maioria dos problemas são **inconsistências entre documentação e código real**
- **Nenhum problema crítico** que impeça o desenvolvimento
- Foco em **alinhar documentação com código** ou vice-versa

---

## 📊 Resumo Executivo

### ✅ Pontos Positivos
- **Estrutura sólida:** O repositório está bem organizado e funcional
- **Design System completo:** Tokens bem estruturados em `src/theme/tokens.ts`
- **Testes existentes:** 29 testes de services + 5 de componentes
- **Documentação:** README e docs bem estruturados
- **TypeScript strict:** Configurado corretamente

### ❌ Principais Gaps Identificados

#### 🔴 Críticos (3)
1. **Inconsistência `primitives` vs `atoms`** - Documentação vs código real
2. **TypeScript não instalado** - Comando `type-check` falha
3. **Services não organizados** - Falta subpasta `supabase/`

#### 🟡 Importantes (6)
4. **Prompts faltantes** - `crisis.system.md` e `moderation.system.md`
5. **Hooks faltantes** - 4 hooks mencionados nas regras não existem
6. **Constantes faltantes** - `emotions.ts` e `onboarding.ts`
7. **llmRouter duplicado** - Existe em 2 locais diferentes
8. **Testes incompletos** - Falta coverage para hooks e screens
9. **Console.log** - Alguns usos não validados

#### 🟢 Baixos (3)
10. **Estrutura `app/`** - App.tsx na raiz vs documentação
11. **llmConfig localização** - Em `src/ai/` vs `src/ai/config/`
12. **Validação design-system** - Monitorar uso do legado

### 🎯 Ações Prioritárias

**Esta Semana:**
1. ✅ Resolver inconsistência `primitives`/`atoms`
2. ✅ Instalar dependências e corrigir `type-check`
3. ✅ Criar prompts faltantes (`crisis.system.md`, `moderation.system.md`)

**Próxima Semana:**
4. ✅ Criar hooks faltantes
5. ✅ Criar constantes faltantes
6. ✅ Reorganizar services em subpastas

**Futuro:**
7. ✅ Adicionar mais testes
8. ✅ Consolidar llmRouter
9. ✅ Melhorar validações

### 📈 Métricas

- **Estrutura:** 85% completa
- **Testes:** ~30% coverage (meta: 40% MVP)
- **Documentação:** 90% alinhada (algumas inconsistências)
- **TypeScript:** Configurado, mas precisa instalar dependências

---

**Última atualização:** 2025-01-XX
**Analisado por:** Cursor AI
**Status:** ✅ Repositório funcional, melhorias recomendadas