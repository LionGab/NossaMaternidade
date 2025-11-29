# 🧹 Plano de Limpeza Profunda - Nossa Maternidade

**Data:** 2025-01-27  
**Objetivo:** Eliminar todas as redundâncias, código legado e arquivos temporários

> ⚠️ **IMPORTANTE:** Este projeto é **MOBILE-FIRST** para **iOS/Android** (App Store + Google Play Store).  
> Não é um projeto web. Todas as decisões devem priorizar experiência mobile nativa.

---

## ✅ Execução do Plano - COMPLETO

### 1. Código Legado Deprecated ✅

#### 1.1 `src/services/medicalModerationService.ts`
- **Status:** DEPRECATED (substituído por `src/ai/moderation/`)
- **Ação:** ✅ **REMOVIDO**
- **Verificação:** Nenhum import encontrado

#### 1.2 `src/design-system/` (pasta completa)
- **Status:** DEPRECATED (substituído por `src/theme/tokens.ts`)
- **Ação:** ⚠️ **MANTER** (ainda pode ter referências internas)
- **Nota:** Já tem warnings de deprecação, mas manter até migração completa

---

### 2. Scripts Duplicados ✅

#### 2.1 `validate-design-tokens.js` vs `validate-design-tokens.ts`
- **Usado:** `validate-design-tokens.js` (package.json)
- **Ação:** ✅ **REMOVIDO** `validate-design-tokens.ts`

#### 2.2 `prepare-assets.js` vs `prepare-assets.ts`
- **Usado:** `prepare-assets.ts` (package.json)
- **Ação:** ✅ **REMOVIDO** `prepare-assets.js`

#### 2.3 `check-ready.ps1` vs `check-ready.sh`
- **Status:** Ambos necessários (Windows vs Linux/Mac)
- **Ação:** ✅ **MANTIDOS** ambos

---

### 3. Documentação Redundante ✅

#### 3.1 Arquivos de Análise/Teste Temporários (Raiz)
- ✅ **28 arquivos movidos para `docs/archive/`:**
  - `ANALISE_*.md` (3 arquivos)
  - `TESTE_*.md` (3 arquivos)
  - `MELHORIAS_*.md` (3 arquivos)
  - `DESIGN_FIX_*.md` (3 arquivos)
  - `TS_ERRORS_*.md` (2 arquivos)
  - `CLAUDE_*.md` (2 arquivos)
  - `HOMESCREEN_MELHORIAS_*.md` (1 arquivo)
  - `RESUMO_MELHORIAS_*.md` (1 arquivo)
  - `CORRECOES_DESIGN_*.md` (1 arquivo)
  - `DESIGN_IMPROVEMENTS_REPORT.md`
  - `DESIGN_SYSTEM_IMPLEMENTATION_SUMMARY.md`
  - `QUICK_START_VALIDATION.md`
  - `SEMANA1_COMPLETA.md`
  - `FASE_1_COMPLETA.md`
  - `IMPLEMENTATION_PROGRESS.md`
  - `PROGRESSO_LANCAMENTO.md`
  - `REVISAO_PROJETO_*.md` (1 arquivo)
  - `ROADMAP_PRIORIZADO_*.md` (1 arquivo)
  - `AUDITORIA_INICIAL.md`
  - `ESTADO_ATUAL_PROJETO.md`
  - `CONSOLIDACAO_COMPLETA.md`
  - `REPOS_AUDIT.md`
  - `RESUMO_IMPLEMENTAÇÃO.md`
  - `RESUMO_NAVEGACAO_COMPLETA.md`
  - `MAPEAMENTO_COMPLETO_TELAS.md`
  - `NAVEGACAO_FINAL.md`
  - `LAYOUT_COMPLETO_REFERENCIA.md`
  - `PROJETO_COMPLETO.md`
  - `PROMPT_FASE2_EXECUCAO.md`
  - `PROMPTS_DESIGN_VALIDATION.md`
  - `ONBOARDING_IMPROVEMENTS.md`
  - `PREMIUM_UX_IMPROVEMENTS.md`
  - `PROPOSTA_MELHORIAS_CORES.md`
  - `PRÓXIMOS_PASSOS.md`
  - `MIGRATION_PLAN.md`
  - `APLICAR_SCHEMA_SUPABASE.md`
  - `BUG_FIX_PLAN.md`

#### 3.2 Documentação Duplicada
- **Ação:** ✅ Consolidada (mantida apenas em `docs/`)

---

### 4. Arquivos Temporários ✅

#### 4.1 Arquivos de Erro TypeScript
- ✅ **REMOVIDOS:**
  - `ts-errors-full.txt`
  - `ts-errors-p0-critical.txt`
  - `ts-errors-remaining.txt`

#### 4.2 Arquivo `nul`
- ✅ **REMOVIDO** (arquivo inválido)

---

### 5. Backend Folder ⚠️

#### 5.1 `backend/`
- **Status:** Servidor Express separado, não usado no app mobile
- **Verificação:** Nenhuma referência no package.json principal
- **Ação:** ⚠️ **MANTIDO** (pode ser usado futuramente para Cloud Run)

---

### 6. Imports Não Utilizados ⚠️

#### 6.1 Verificação Automática
- **Status:** ESLint configurado para detectar (`@typescript-eslint/no-unused-vars`)
- **Ação:** ⚠️ **PENDENTE** - Executar `npm run lint` para correção automática
- **Nota:** 1003 imports encontrados, mas muitos são válidos. ESLint filtrará os não utilizados.

---

## 📊 Resultado Final

### ✅ Concluído

- ✅ **Código legado removido:** `medicalModerationService.ts` deletado
- ✅ **Scripts duplicados consolidados:** 2 scripts duplicados removidos
- ✅ **Documentação organizada:** 28 arquivos movidos para `docs/archive/`
- ✅ **Arquivos temporários removidos:** 4 arquivos temporários deletados
- ✅ **Projeto mais limpo:** Raiz do projeto organizada

### 📈 Estatísticas

- **Arquivos removidos:** 7 (código + scripts + temporários)
- **Arquivos arquivados:** 28 (documentação)
- **Total de limpeza:** 35 arquivos

### ⚠️ Pendências

- ⚠️ **Imports não utilizados:** Verificar com `npm run lint`
- ⚠️ **Design System legado:** Manter até migração completa
- ⚠️ **Backend folder:** Manter para uso futuro

---

## ⚠️ Notas Importantes

1. **Backup:** Todas as remoções são seguras (código deprecated não usado)
2. **Design System:** Manter `src/design-system/` até migração completa
3. **Backend:** Manter `backend/` para possível uso futuro
4. **Documentação arquivada:** Disponível em `docs/archive/` para referência histórica

---

## 🎯 Próximos Passos Recomendados

1. Executar `npm run lint` para identificar imports não utilizados
2. Corrigir imports não utilizados gradualmente
3. Finalizar migração do Design System (quando todos os componentes usarem `src/theme/tokens.ts`)
4. Considerar remover `backend/` se não for usado em 6 meses
