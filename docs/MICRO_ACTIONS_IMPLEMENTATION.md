# Micro-ações de Descanso - Documentação

## Resumo

Catálogo de 8 micro-ações de descanso para mães, com filtros por fase da vida e sistema de analytics.

## Arquivos Criados

### 1. Database (Supabase)

| Arquivo | Descrição |
|---------|-----------|
| `supabase/migrations/20251209000001_create_micro_actions_catalog.sql` | Migration da tabela |
| `supabase/seeds/micro_actions_catalog.sql` | Seed com as 8 micro-ações |

### 2. TypeScript

| Arquivo | Descrição |
|---------|-----------|
| `src/types/microActions.ts` | Tipos e interfaces |
| `src/services/supabase/microActionsService.ts` | Queries Supabase |
| `src/services/microActions/filters.ts` | Lógica de filtro por fase |
| `src/services/analytics/microActionsAnalytics.ts` | Tracking de eventos |
| `src/hooks/useMicroActions.ts` | React hooks (React Query) |
| `src/hooks/useMicroActionLogger.ts` | Hook de logging |
| `__tests__/services/microActionsFilters.test.ts` | Testes unitários |

---

## Como Aplicar no Supabase

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://app.supabase.com/project/[seu-project]/sql
2. Cole o conteúdo de `20251209000001_create_micro_actions_catalog.sql`
3. Execute
4. Cole o conteúdo de `supabase/seeds/micro_actions_catalog.sql`
5. Execute

### Opção 2: Via CLI

```bash
# Link ao projeto (se ainda não fez)
supabase link --project-ref [seu-project-ref]

# Aplicar migrations
supabase migration up

# Aplicar seed
supabase db push
```

### Verificação

```sql
SELECT id, title, label_duration, stages
FROM micro_actions_catalog
ORDER BY priority ASC;
```

Deve retornar 8 micro-ações.

---

## Estrutura da Tabela

```sql
micro_actions_catalog (
  id TEXT PRIMARY KEY,          -- Slug único (ex: rest_close_eyes_30s)
  category micro_action_category, -- ENUM: rest, breathe, mindfulness, movement
  title TEXT NOT NULL,
  label_duration TEXT NOT NULL, -- "30 seg", "1-2 min"
  description_short TEXT NOT NULL,
  description_full TEXT NOT NULL, -- Com quebras de linha
  can_do_with_baby BOOLEAN,
  stages life_stage[],          -- Array de fases
  priority INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

## As 8 Micro-ações

| ID | Título | Duração | Fases |
|----|--------|---------|-------|
| `rest_close_eyes_30s` | 30 segundos de pausa | 30 seg | Todas |
| `rest_double_sigh` | Dois suspiros, só | 10 seg | Todas |
| `rest_with_baby_window` | Deite junto, sem culpa | 1-2 min | new-mother, experienced-mother |
| `rest_reduce_stimulus` | Menos 1 coisa irritando | 30 seg | Todas |
| `rest_relax_shoulders` | Solta esses ombros | 15 seg | Todas |
| `rest_mental_airplane_30s` | 30s sem resolver nada | 30 seg | Todas |
| `rest_self_forgiveness_sleep` | Antes de dormir, fala isso | 10 seg | Todas |
| `rest_one_win_today` | Uma vitória de hoje | 30 seg | Todas |

---

## Uso nos Componentes

### Hook Principal

```tsx
import { useMicroActionsForProfile } from '@/hooks';

function HomeScreen() {
  const { profile } = useProfile();

  const {
    actions,
    priorityActions,
    suggestedAction,
    isLoading,
    error,
    lifeStage,
  } = useMicroActionsForProfile(profile, {
    sleepScore: profile?.sleep_score,
  });

  if (isLoading) return <Loading />;

  return (
    <View>
      {suggestedAction && (
        <MicroActionCard action={suggestedAction} featured />
      )}

      <FlatList
        data={actions}
        renderItem={({ item }) => <MicroActionCard action={item} />}
      />
    </View>
  );
}
```

### Hook de Logging

```tsx
import { useMicroActionLogger } from '@/hooks';

function MicroActionCard({ action }) {
  const logger = useMicroActionLogger({
    actionId: action.id,
    context: 'home',
    lifeStage: 'new-mother',
    logImpressionOnMount: true,
  });

  const handlePress = () => {
    logger.onClick();
    logger.startTimer();
    // Abrir modal...
  };

  const handleComplete = () => {
    const duration = logger.stopTimer();
    logger.onComplete(duration);
  };

  const handleDismiss = () => {
    logger.onAbandon('dismissed');
  };

  return (
    <Pressable onPress={handlePress}>
      <Text>{action.title}</Text>
    </Pressable>
  );
}
```

---

## Regras de Filtro por Fase

### Pregnant (Gestante)

- Mostra TODAS as micro-ações (exceto `rest_with_baby_window`)
- **Alta prioridade**: `double_sigh`, `reduce_stimulus`, `relax_shoulders`

### New-Mother (Puérpera, até ~12 meses)

- **NUNCA** mostra `rest_sleep_15min_earlier`
- **Alta prioridade**: `close_eyes_30s`, `double_sigh`, `relax_shoulders`, `mental_airplane_30s`, `self_forgiveness_sleep`, `one_win_today`

### Experienced-Mother (bebê >= 18 meses)

- Mostra todas as 8 base
- **Adiciona** `rest_sleep_15min_earlier` se `sleepScore < 5`

---

## Tipos Principais

```typescript
type LifeStage = 'pregnant' | 'new-mother' | 'experienced-mother';

type MicroActionId =
  | 'rest_close_eyes_30s'
  | 'rest_double_sigh'
  | 'rest_with_baby_window'
  | 'rest_reduce_stimulus'
  | 'rest_relax_shoulders'
  | 'rest_mental_airplane_30s'
  | 'rest_self_forgiveness_sleep'
  | 'rest_one_win_today'
  | 'rest_sleep_15min_earlier';

interface MicroAction {
  id: MicroActionId;
  category: 'rest' | 'breathe' | 'mindfulness' | 'movement';
  title: string;
  label_duration: string;
  description_short: string;
  description_full: string;
  can_do_with_baby: boolean;
  stages: LifeStage[];
  priority?: number;
}
```

---

## Analytics

### Eventos Disponíveis

| Evento | Quando |
|--------|--------|
| `micro_action_suggested` | Quando ação é sugerida |
| `micro_action_impression` | Quando card aparece na tela |
| `micro_action_clicked` | Quando card é clicado |
| `micro_action_completed` | Quando usuário marca como feita |
| `micro_action_abandoned` | Quando usuário pula/fecha |

### Tabela de Eventos (Opcional)

```sql
CREATE TABLE IF NOT EXISTS micro_action_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  action_id TEXT NOT NULL,
  user_id UUID,
  context TEXT,
  life_stage TEXT,
  reason TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Testes

```bash
# Rodar testes
npm test -- microActionsFilters

# Ou específico
npx jest __tests__/services/microActionsFilters.test.ts
```

### Casos Testados

- [x] Pregnant vê todas as 8 ações
- [x] New-mother NÃO vê `rest_sleep_15min_earlier`
- [x] Experienced-mother com sleep_score=3 vê `rest_sleep_15min_earlier`
- [x] Experienced-mother com sleep_score=8 NÃO vê `rest_sleep_15min_earlier`
- [x] Cálculo de idade do bebê em meses
- [x] Sugestão de ação por hora do dia

---

## Próximos Passos

1. [ ] Criar componente `MicroActionCard` com UI
2. [ ] Integrar na HomeScreen
3. [ ] Criar modal de execução da micro-ação
4. [ ] Criar tabela `micro_action_events` para analytics persistente
5. [ ] Dashboard de analytics
