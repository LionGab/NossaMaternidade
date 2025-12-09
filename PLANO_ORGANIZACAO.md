# 📋 Plano de Organização do Projeto

## Problemas Identificados

### 1. Componentes Duplicados ⚠️
- `Button.tsx` - existe na raiz e em `atoms/`
- `Card.tsx` - existe na raiz e em `atoms/`
- `ProgressIndicator.tsx` - existe na raiz e em `atoms/`
- `OptimizedImage.tsx` - existe na raiz e em `atoms/`

**Decisão:** Manter versões em `atoms/` (mais modernas e completas), remover da raiz

### 2. Componentes Soltos na Raiz (38 arquivos) ⚠️
Muitos componentes estão na raiz de `src/components/` quando deveriam estar organizados:
- Atoms: Button, Card, Input, Badge, etc.
- Molecules: Alert, Toast, etc.
- Organisms: Alguns componentes complexos

### 3. Services Não Organizados ⚠️
Todos os services estão na raiz de `src/services/` sem agrupamento por domínio

### 4. Falta de Index.ts em Algumas Pastas ⚠️
Algumas pastas não têm index.ts para facilitar imports

## Plano de Ação

### Fase 1: Consolidar Duplicações ✅
1. Remover componentes duplicados da raiz
2. Atualizar `src/components/index.ts` para exportar de `atoms/`
3. Verificar e atualizar imports que usam versões antigas

### Fase 2: Organizar Componentes Soltos
1. Mover atoms para `atoms/`
2. Mover molecules para `molecules/`
3. Mover organisms para `organisms/`
4. Criar/atualizar index.ts files

### Fase 3: Organizar Services
1. Criar subpastas por domínio:
   - `supabase/` - services do Supabase
   - `ai/` - services de IA
   - `analytics/` - analytics
   - `storage/` - storage services
2. Mover services apropriados
3. Criar index.ts files

### Fase 4: Limpeza Final
1. Verificar imports quebrados
2. Atualizar documentação
3. Verificar que tudo funciona
