# Relatório de Auditoria do Schema Supabase
## Nossa Maternidade - Análise Completa

**Data:** 10 de Dezembro de 2025
**Versão Schema:** 1.0.0 (8 migrations aplicadas)
**Status:** 🟡 Parcialmente Completo - Faltam 8 tabelas críticas

---

## 1. RESUMO EXECUTIVO

### Estado Atual
- ✅ **17 tabelas criadas** e funcionais
- ✅ **RLS habilitado** em todas as tabelas
- ✅ **12 ENUMs** definidos para validação
- ✅ **Triggers e Functions** implementados
- ❌ **8 tabelas faltando** (usadas pelos services)
- ❌ **Notifications** não implementado
- ❌ **Mundo Nath** (articles, videos) faltando

### Impacto
- **Crítico:** App depende de tabelas inexistentes
- **Risco:** Queries falhando em produção
- **Bloqueio:** Features não funcionam completamente

---

## 2. TABELAS EXISTENTES (17)

### Grupo A: Core/Usuário (6 tabelas)
| Tabela | Propósito | RLS | Indexes | Status |
|--------|-----------|-----|---------|--------|
| `profiles` | Perfis das usuárias | ✅ | 4 | ✅ OK |
| `chat_sessions` | Conversas com NathIA | ✅ | 3 | ✅ OK |
| `chat_messages` | Mensagens do chat | ✅ | 4 | ✅ OK |
| `habits` | Hábitos definidos | ✅ | 2 | ✅ OK |
| `habit_logs` | Logs de conclusão | ✅ | 4 | ✅ OK |
| `micro_actions` | Ações rápidas (Home) | ✅ | 3 | ✅ OK |

### Grupo B: Comunidade (4 tabelas)
| Tabela | Propósito | RLS | Indexes | Status |
|--------|-----------|-----|---------|--------|
| `community_posts` | Posts da comunidade | ✅ | 5 | ✅ OK |
| `community_comments` | Comentários (threading) | ✅ | 5 | ✅ OK |
| `community_likes` | Likes em posts/comments | ✅ | 4 | ✅ OK |
| `post_reactions` | Reações (love, hug) | ✅ | 3 | ✅ OK |

### Grupo C: LGPD/Compliance (4 tabelas)
| Tabela | Propósito | RLS | Indexes | Status |
|--------|-----------|-----|---------|--------|
| `consent_terms_versions` | Versões dos termos | ✅ | 2 | ✅ OK |
| `user_consents` | Consentimentos LGPD | ✅ | 5 | ✅ OK |
| `user_feature_flags` | Feature flags A/B | ✅ | 4 | ✅ OK |
| `postpartum_screenings` | EPDS, PHQ-9, GAD-7 | ✅ | 6 | ✅ OK |

### Grupo D: Moderação/Crise (2 tabelas)
| Tabela | Propósito | RLS | Indexes | Status |
|--------|-----------|-----|---------|--------|
| `crisis_interventions` | Detecção de crise | ✅ | 6 | ✅ OK |
| `moderation_queue` | Fila de moderação | ✅ | 6 | ✅ OK |

### Grupo E: Misc (1 tabela)
| Tabela | Propósito | RLS | Indexes | Status |
|--------|-----------|-----|---------|--------|
| `content_favorites` | Favoritos (genérico) | ✅ | 5 | ✅ OK |

---

## 3. TABELAS FALTANDO (8) - CRÍTICAS

### 🔴 Prioridade ALTA (Bloqueiam features)

#### 3.1. `diary_entries` (Refúgio)
**Service:** `diaryService.ts`
**Uso:** Salvar desabafos privados com resposta da IA
**Queries Falhando:**
- `saveToRefuge()` → INSERT em `diary_entries`
- `getRecentEntries()` → SELECT de `diary_entries`
- `toggleFavorite()` → UPDATE `is_favorite`

**Schema Necessário:**
```sql
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_response TEXT,
  emotion_detected TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.2. `sleep_logs` (Sleep Tracker)
**Service:** `sleepService.ts`
**Uso:** Rastrear horas de sono
**Queries Falhando:**
- `logSleep()` → INSERT em `sleep_logs`
- `getRecentLogs()` → SELECT últimos 7 dias
- `getWeeklyAverage()` → agregação

**Schema Necessário:**
```sql
CREATE TABLE sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_hours DECIMAL(3,1) NOT NULL CHECK (duration_hours >= 0 AND duration_hours <= 24),
  logged_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.3. `baby_milestones` (Sistema de Marcos)
**Service:** `milestonesService.ts`
**Uso:** Milestones do desenvolvimento do bebê
**Queries Falhando:**
- `getMilestonesByAge()` → SELECT de `baby_milestones`
- `trackProgress()` → JOIN com `user_baby_milestones`

**Schema Necessário:**
```sql
CREATE TABLE baby_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('motor', 'cognitivo', 'linguagem', 'social', 'sensorial')),
  age_months INTEGER NOT NULL CHECK (age_months >= 0 AND age_months <= 60),
  tips TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_baby_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES baby_milestones(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);
```

#### 3.4. `check_in_logs` (Check-ins Emocionais)
**Service:** `checkInService.ts`
**Uso:** Registrar estado emocional diário
**Queries Falhando:**
- `saveCheckIn()` → INSERT em `check_in_logs`
- `getTodayCheckIn()` → SELECT com filtro de data
- `getWeeklyMood()` → agregação de 7 dias

**Schema Necessário:**
```sql
CREATE TABLE check_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL CHECK (emotion IN ('bem', 'triste', 'ansiosa', 'cansada', 'calma')),
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  notes TEXT,
  triggers TEXT[],
  activities TEXT[],
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🟡 Prioridade MÉDIA (Features futuras)

#### 3.5. `notifications` (Push Notifications)
**Uso:** Sistema de notificações do app
**Impacto:** Onboarding e engagement

**Schema Necessário:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'milestone', 'community', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.6. `content_articles` (Mundo Nath - Artigos)
**Service:** `feedService.ts` (implícito)
**Uso:** Conteúdo editorial do Mundo Nath

**Schema Necessário:**
```sql
CREATE TABLE content_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author TEXT DEFAULT 'Nossa Maternidade',
  category TEXT,
  tags TEXT[],
  reading_time_minutes INTEGER,
  target_phase TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.7. `content_videos` (Mundo Nath - Vídeos)
**Service:** `feedService.ts` (implícito)
**Uso:** Vídeos educativos do Mundo Nath

**Schema Necessário:**
```sql
CREATE TABLE content_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category TEXT,
  tags TEXT[],
  target_phase TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.8. `guilt_entries` (Sistema de Culpa)
**Service:** `guiltService.ts`
**Uso:** Rastreamento e análise de culpa materna

**Schema Necessário:**
```sql
CREATE TABLE guilt_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
  category TEXT CHECK (category IN ('autocuidado', 'trabalho', 'tempo', 'amamentacao', 'outro')),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. ANÁLISE DE DEPENDÊNCIAS

### Services vs Tabelas

| Service | Tabelas Usadas | Status | Impacto |
|---------|----------------|--------|---------|
| `authService.ts` | `profiles` | ✅ OK | - |
| `chatService.ts` | `chat_sessions`, `chat_messages` | ✅ OK | - |
| `checkInService.ts` | `check_in_logs` | ❌ FALTANDO | 🔴 Crítico |
| `communityService.ts` | `community_posts`, `community_comments` | ✅ OK | - |
| `diaryService.ts` | `diary_entries` | ❌ FALTANDO | 🔴 Crítico |
| `guiltService.ts` | `guilt_entries` | ❌ FALTANDO | 🟡 Médio |
| `habitsService.ts` | `habits`, `habit_logs` | ✅ OK | - |
| `milestonesService.ts` | `baby_milestones`, `user_baby_milestones` | ❌ FALTANDO | 🔴 Crítico |
| `sleepService.ts` | `sleep_logs` | ❌ FALTANDO | 🔴 Crítico |
| `bookmarkService.ts` | AsyncStorage (local) | 🟡 Temporário | Migrar para DB |
| `feedService.ts` | `content_articles`, `content_videos` | ❌ FALTANDO | 🟡 Médio |

---

## 5. PROBLEMAS IDENTIFICADOS

### 5.1. Inconsistências de Nomenclatura
- ❌ `chat_sessions` vs `chat_conversations` (código espera ambos)
- ❌ `content_favorites` é genérico mas falta `content_articles`
- ❌ ENUMs duplicados: `consent_type` no schema difere do código

### 5.2. Falta de Indexes Importantes
Tabelas a criar precisam de:
- `idx_check_in_logs_user_date` para queries temporais
- `idx_sleep_logs_user_logged_at` para agregações
- `idx_diary_entries_user_created` para timeline
- `idx_content_articles_published` para feed

### 5.3. RLS Policies Faltando
Novas tabelas precisarão de:
- User-owned data: `diary_entries`, `check_in_logs`, `sleep_logs`
- Public read: `content_articles`, `content_videos`, `baby_milestones`
- Mixed: `user_baby_milestones` (own data + public milestones)

---

## 6. PLANO DE AÇÃO

### Fase 1: CRÍTICO (Executar AGORA)
1. ✅ Criar migration `08_missing_core_tables.sql`
   - `diary_entries`
   - `sleep_logs`
   - `check_in_logs`
   - `baby_milestones` + `user_baby_milestones`

2. ✅ Criar migration `09_rls_missing_tables.sql`
   - RLS policies para tabelas novas
   - Indexes de performance

3. ⏳ Testar queries dos services
   - Validar INSERTs/SELECTs
   - Verificar CASCADE deletes

### Fase 2: MÉDIO PRAZO (Próxima Sprint)
4. ⏳ Criar migration `10_content_tables.sql`
   - `content_articles`
   - `content_videos`
   - `notifications`

5. ⏳ Criar migration `11_guilt_system.sql`
   - `guilt_entries`
   - Triggers de análise

6. ⏳ Migrar bookmarks para Supabase
   - Usar tabela `content_favorites` existente
   - Refatorar `bookmarkService.ts`

### Fase 3: OTIMIZAÇÕES (Backlog)
7. ⏳ Adicionar Full-Text Search
   - Indexes GIN em `content_articles.content`
   - Indexes GIN em `community_posts.content`

8. ⏳ Implementar Soft Deletes consistentemente
   - Todas as tabelas devem ter `deleted_at`
   - Triggers para cascade soft delete

9. ⏳ Analytics e Métricas
   - Tabelas de eventos
   - Aggregation views

---

## 7. ARQUIVOS SQL PRONTOS

### 📄 Arquivo 1: `20251210000008_missing_core_tables.sql`
**Localização:** `C:\Users\User\NossaMaternidade-1\supabase\migrations\`
**Conteúdo:** Disponível no próximo arquivo deste relatório
**Tamanho:** ~400 linhas
**Tempo estimado de execução:** 2-5 segundos

### 📄 Arquivo 2: `20251210000009_rls_missing_tables.sql`
**Localização:** `C:\Users\User\NossaMaternidade-1\supabase\migrations\`
**Conteúdo:** RLS policies + indexes
**Tamanho:** ~250 linhas
**Tempo estimado de execução:** 1-3 segundos

---

## 8. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Queries falhando em prod | 🔴 Alta | 🔴 Crítico | Executar migrations ASAP |
| RLS policies permissivas | 🟡 Média | 🔴 Crítico | Revisar todas as policies |
| Performance de queries | 🟡 Média | 🟡 Médio | Adicionar indexes missing |
| Migração de dados locais | 🟢 Baixa | 🟡 Médio | Script de migração AsyncStorage → Supabase |

---

## 9. CHECKLIST DE VALIDAÇÃO

Após aplicar as migrations, validar:

- [ ] `diaryService.saveToRefuge()` funciona sem erros
- [ ] `sleepService.logSleep()` salva dados corretamente
- [ ] `checkInService.saveCheckIn()` registra emoções
- [ ] `milestonesService.getMilestones()` retorna dados
- [ ] RLS permite usuárias lerem próprios dados
- [ ] RLS bloqueia acesso a dados de outras usuárias
- [ ] Indexes criados (verificar com `EXPLAIN ANALYZE`)
- [ ] Triggers de `updated_at` funcionando
- [ ] Cascade deletes funcionando (testar com usuário de teste)

---

## 10. PRÓXIMOS PASSOS IMEDIATOS

1. **[EXECUTAR] Aplicar migration 08** (5 min)
   - Rodar SQL no Supabase Dashboard ou via CLI
   - Verificar logs de criação

2. **[EXECUTAR] Aplicar migration 09** (3 min)
   - RLS policies + indexes
   - Testar permissões

3. **[TESTAR] Validar services** (15 min)
   - Rodar app em dev
   - Testar cada feature afetada
   - Verificar logs do Supabase

4. **[DOCUMENTAR] Atualizar types** (10 min)
   - Regenerar `supabase.generated.ts`
   - Atualizar `database.ts` se necessário

---

## 11. CONCLUSÃO

**Status Geral:** 🟡 **Funcional mas Incompleto**

### Pontos Positivos
✅ Arquitetura bem planejada (ENUMs, RLS, Triggers)
✅ 17 tabelas core funcionando perfeitamente
✅ LGPD compliance implementado corretamente
✅ Sistema de moderação robusto

### Pontos de Atenção
❌ 8 tabelas críticas faltando bloqueiam features
❌ Services esperando tabelas inexistentes
❌ Risco de falhas silenciosas em produção

### Recomendação
**EXECUTAR MIGRATIONS 08 e 09 IMEDIATAMENTE** antes de qualquer deploy para produção.

---

**Relatório gerado por:** Claude Code
**Última atualização:** 10 de Dezembro de 2025, 15:30 BRT
**Versão do relatório:** 1.0.0
