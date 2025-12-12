# Supabase Database - Nossa Maternidade

## Visão Geral

Schema completo do banco de dados PostgreSQL para o app Nossa Maternidade.

## Estrutura de Migrations

```
supabase/migrations/
├── 001_profiles.sql        # Perfis de usuárias + Auth trigger
├── 002_community.sql       # Posts, comentários, grupos, likes
├── 003_cycle_tracking.sql  # Ciclo menstrual + Daily logs
├── 004_habits_checkins.sql # Hábitos + Check-ins diários
├── 005_chat.sql            # Conversas com NathIA + Cache de contexto
├── 006_affirmations.sql    # Afirmações + 100 seeds em PT-BR
└── 007_ai_context_view.sql # VIEW consolidada para IA
```

## Deploy das Migrations

### Opção 1: Via Supabase CLI

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref lqahkqfpynypbmhtffyi

# Executar migrations
supabase db push
```

### Opção 2: Via SQL Editor (Dashboard)

1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/sql
2. Execute cada arquivo na ordem (001 → 007)
3. Aguarde cada um completar antes do próximo

### Opção 3: Script de Deploy

```bash
# Concatenar todos em um arquivo
cat supabase/migrations/*.sql > supabase/full_schema.sql

# Executar via psql (requer conexão direta)
psql "postgresql://postgres:[PASSWORD]@db.lqahkqfpynypbmhtffyi.supabase.co:5432/postgres" -f supabase/full_schema.sql
```

## Tabelas Criadas

### Core
| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de usuárias (sincronizado com auth.users) |
| `cycle_settings` | Configurações do ciclo menstrual |

### Community
| Tabela | Descrição |
|--------|-----------|
| `community_groups` | Grupos temáticos |
| `group_members` | Membros de grupos |
| `community_posts` | Posts da comunidade |
| `post_likes` | Likes em posts |
| `community_comments` | Comentários |
| `comment_likes` | Likes em comentários |

### Tracking
| Tabela | Descrição |
|--------|-----------|
| `cycle_logs` | Logs do ciclo menstrual |
| `daily_logs` | Logs diários completos (CONTEXTO IA) |
| `weight_logs` | Histórico de peso |
| `habits` | Definição de hábitos |
| `habit_completions` | Registro de hábitos completados |
| `daily_check_ins` | Check-ins diários (CONTEXTO IA) |
| `user_streaks` | Streaks gerais |

### AI/Chat
| Tabela | Descrição |
|--------|-----------|
| `chat_conversations` | Conversas com NathIA |
| `chat_messages` | Mensagens individuais |
| `ai_context_cache` | Cache de contexto para IA |
| `ai_insights` | Insights gerados pela IA |

### Content
| Tabela | Descrição |
|--------|-----------|
| `affirmations` | Banco de afirmações (100+ seeds) |
| `user_favorite_affirmations` | Favoritas da usuária |
| `user_daily_affirmations` | Histórico diário |
| `habit_templates` | Templates de hábitos padrão |

## Views

| View | Descrição |
|------|-----------|
| `user_context_full` | Consolida TODO contexto da usuária para NathIA |

## Funções Importantes

### Para a NathIA
```sql
-- Obter contexto completo em JSONB
SELECT * FROM user_context_full WHERE user_id = 'uuid';

-- Gerar prompt formatado para IA
SELECT generate_nathia_context_prompt('uuid');

-- Construir e cachear contexto
SELECT build_user_context('uuid');

-- Tendência de humor
SELECT get_mood_trend('uuid'); -- 'improving' | 'stable' | 'declining'

-- Média de humor
SELECT get_mood_average('uuid', 7); -- últimos 7 dias
```

### Para Hábitos
```sql
-- Status dos hábitos de hoje
SELECT * FROM get_today_habit_status('uuid');

-- Resumo semanal
SELECT * FROM get_weekly_habit_summary('uuid');
```

### Para Afirmações
```sql
-- Afirmação do dia personalizada
SELECT * FROM get_daily_affirmation('uuid');
```

## Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com policies:
- Usuárias só veem/editam seus próprios dados
- Posts/comentários públicos visíveis para autenticados
- Afirmações e templates são públicos (read-only)

## ENUMs

```sql
pregnancy_stage: trying | pregnant | postpartum
user_interest: nutrition | exercise | mental_health | baby_care | breastfeeding | sleep | relationships | career
mood_type: happy | excited | grateful | peaceful | confident | energetic | hopeful | loving | neutral | calm | tired | sleepy | anxious | worried | sad | frustrated | overwhelmed | irritable | lonely | stressed | hormonal | nesting | bonding | touched_out | mom_guilt | empowered
symptom_type: nausea | fatigue | headache | backache | cramping | bloating | breast_tenderness | mood_swings | food_cravings | food_aversions | spotting | heavy_flow | light_flow | pms | postpartum_bleeding | breastfeeding_pain | night_sweats | hair_loss | insomnia | dizziness | swelling | constipation | heartburn | baby_movement | braxton_hicks | contractions
flow_level: spotting | light | medium | heavy | very_heavy
habit_category: self_care | health | mindfulness | connection | growth | nutrition | movement | rest
affirmation_category: self_love | strength | motherhood | body_positivity | anxiety_relief | gratitude | empowerment | healing | patience | joy
```

## Dados de Seed

- **100 afirmações** em português brasileiro (categorias variadas)
- **10 templates de hábitos** padrão

## Troubleshooting

### Migration falhou
1. Verifique a ordem (001 → 007)
2. Verifique se não há tabelas existentes com conflito
3. Execute `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` para reset total (CUIDADO: apaga tudo)

### RLS bloqueando queries
- Certifique que está autenticado
- Use `service_role` key para operações de backend

### Função não encontrada
- Execute migrations na ordem correta
- `update_updated_at_column()` é criada na migration 001

## Variáveis de Ambiente

```env
EXPO_PUBLIC_SUPABASE_URL=https://lqahkqfpynypbmhtffyi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (apenas backend)
SUPABASE_JWT_SECRET=xG9... (apenas Edge Functions)
```

## Próximos Passos

1. [ ] Executar migrations no Supabase
2. [ ] Testar auth flow (criar usuário → profile auto-criado)
3. [ ] Testar RLS policies
4. [ ] Criar Edge Functions para operações sensíveis
5. [ ] Configurar Realtime para community

---

**Projeto:** Nossa Maternidade
**URL:** https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi
