# ✅ CHECKLIST - Setup Supabase Schema

**Projeto:** Nossa Maternidade
**Data:** 10 de Dezembro de 2025

---

## 📋 ANTES DE COMEÇAR

- [ ] Tenho acesso ao Supabase Dashboard
- [ ] Sei qual é o Project ID do Supabase
- [ ] Fiz backup do banco (recomendado)
- [ ] Li o arquivo `LEIA-ME_SUPABASE.md`

---

## 🚀 EXECUÇÃO (ESCOLHA UMA OPÇÃO)

### Opção A: Tudo de uma vez (RÁPIDO)

- [ ] Abrir Supabase Dashboard → SQL Editor
- [ ] Copiar conteúdo de `APPLY_ALL_MISSING_TABLES.sql`
- [ ] Colar e executar (Run)
- [ ] Aguardar ~15 segundos
- [ ] Ver mensagem "Instalação concluída com sucesso!"

**OU**

### Opção B: Via CLI (AUTOMÁTICO)

- [ ] Abrir terminal no projeto
- [ ] Executar: `supabase db push`
- [ ] Aguardar conclusão
- [ ] Ver mensagem de sucesso

**OU**

### Opção C: Uma migration por vez (CONTROLADO)

- [ ] Executar `20251210000008_missing_core_tables.sql`
- [ ] Verificar 7 tabelas criadas
- [ ] Executar `20251210000009_rls_missing_tables.sql`
- [ ] Verificar RLS habilitado
- [ ] Executar `20251210000010_content_tables.sql`
- [ ] Verificar tabelas de conteúdo criadas

---

## ✅ VALIDAÇÃO

### No Supabase Dashboard

- [ ] Table Editor mostra `diary_entries`
- [ ] Table Editor mostra `sleep_logs`
- [ ] Table Editor mostra `check_in_logs`
- [ ] Table Editor mostra `baby_milestones`
- [ ] Table Editor mostra `notifications`
- [ ] Table Editor mostra `guilt_entries`
- [ ] Table Editor mostra `content_articles`

### Query de Verificação

```sql
-- Executar no SQL Editor:
SELECT COUNT(*) as total_tabelas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'diary_entries', 'sleep_logs', 'check_in_logs',
    'baby_milestones', 'user_baby_milestones',
    'notifications', 'guilt_entries',
    'content_articles', 'content_videos'
  );

-- Resultado esperado: 9 tabelas (ou mais)
```

- [ ] Query retornou 9+ tabelas

### Milestones Seed

```sql
-- Verificar milestones inseridos:
SELECT category, COUNT(*) as total
FROM baby_milestones
GROUP BY category;
```

- [ ] Retornou milestones (pelo menos 4-5 categorias)

---

## 🔧 PÓS-INSTALAÇÃO

### 1. Regenerar Types TypeScript

```bash
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.generated.ts
```

- [ ] Types gerados sem erro
- [ ] Arquivo `src/types/supabase.generated.ts` atualizado
- [ ] `npm run type-check` passa sem erros

### 2. Testar Services no App

```bash
npm run dev
```

- [ ] App abre sem crashes
- [ ] **Refúgio:** Consigo salvar entrada no diário
- [ ] **Sleep Tracker:** Consigo registrar horas de sono
- [ ] **Check-in:** Consigo fazer check-in emocional
- [ ] **Milestones:** Consigo ver marcos do bebê
- [ ] **Notificações:** Sistema de notificações funciona

### 3. Verificar RLS Policies

```sql
-- Ver policies criadas:
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('diary_entries', 'sleep_logs', 'check_in_logs')
ORDER BY tablename;
```

- [ ] Cada tabela tem pelo menos 2 policies
- [ ] Existe policy "own_data" ou similar
- [ ] Existe policy "service_role_all"

---

## 🔄 ROLLBACK (SE ALGO DEU ERRADO)

### Opção 1: Via CLI

```bash
# Reverter última migration
supabase db reset
```

- [ ] Database resetado

### Opção 2: Via Dashboard

```bash
# SQL Editor → Executar:
DROP TABLE IF EXISTS diary_entries CASCADE;
DROP TABLE IF EXISTS sleep_logs CASCADE;
DROP TABLE IF EXISTS check_in_logs CASCADE;
DROP TABLE IF EXISTS baby_milestones CASCADE;
DROP TABLE IF EXISTS user_baby_milestones CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS guilt_entries CASCADE;
DROP TABLE IF EXISTS content_articles CASCADE;
DROP TABLE IF EXISTS content_videos CASCADE;
DROP TABLE IF EXISTS content_interactions CASCADE;
```

- [ ] Tabelas removidas
- [ ] Pronto para tentar novamente

---

## 📊 MÉTRICAS FINAIS

### Schema Completo

- [ ] **32 tabelas** no total (17 existentes + 15 novas)
- [ ] **100% RLS habilitado** em todas
- [ ] **~80 indexes** criados
- [ ] **~60 policies** de segurança
- [ ] **8 funções auxiliares**
- [ ] **Triggers** de cache automático

### Performance

- [ ] Queries de diary_entries < 100ms
- [ ] Queries de sleep_logs < 100ms
- [ ] Queries de check_in_logs < 100ms
- [ ] Full-text search em articles funciona

---

## 🎯 STATUS DO PROJETO

### Antes das Migrations
- 🟡 **Schema:** Parcialmente completo
- 🔴 **Services:** Falhando
- 🔴 **Features:** Bloqueadas
- 🔴 **Deploy:** Bloqueado

### Depois das Migrations
- 🟢 **Schema:** Completo
- 🟢 **Services:** Funcionando
- 🟢 **Features:** Operacionais
- 🟢 **Deploy:** Liberado

---

## 📝 NOTAS FINAIS

### Data de Conclusão
- [ ] Migrations aplicadas em: ____/____/2025

### Responsável
- [ ] Aplicado por: ________________

### Ambiente
- [ ] Desenvolvimento
- [ ] Staging
- [ ] Produção

### Observações
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## ✨ PRÓXIMOS PASSOS

Após completar este checklist:

1. ✅ Marcar issue/ticket como concluído
2. 📝 Atualizar documentação do projeto
3. 🚀 Seguir para próxima fase (deploy/testes)
4. 🎉 Comemorar! Schema completo! 🎊

---

**Tempo total estimado:** 30-60 minutos
**Dificuldade:** Baixa/Média
**Impacto:** 🔴 Crítico (bloqueia deploy)

---

**IMPORTANTE:** Este checklist deve ser completado ANTES de qualquer deploy para produção!
