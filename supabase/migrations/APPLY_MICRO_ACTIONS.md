# Como Aplicar a Migration de Micro-Ações

## Opção 1: Via Supabase Dashboard (Recomendado) ⭐

### Passo a Passo

1. **Acesse o Dashboard do Supabase**
   - Vá para: https://app.supabase.com/project/[seu-project-ref]
   - Ou acesse pelo seu projeto específico

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Copie e Cole a Migration**
   - Abra o arquivo `supabase/migrations/20251208000007_micro_actions.sql`
   - Copie **TODO** o conteúdo
   - Cole no editor SQL do Supabase

4. **Execute o SQL**
   - Clique no botão **Run** (ou pressione Ctrl+Enter)
   - Aguarde a execução (pode levar 5-10 segundos)

5. **Verifique o Resultado**
   - Deve aparecer "Success. No rows returned" ou mensagens de NOTICE
   - Verifique se a tabela foi criada:
     - Vá em **Table Editor** no menu lateral
     - Você deve ver a tabela `micro_actions`
   - Verifique se os dados foram inseridos:
     - Clique na tabela `micro_actions`
     - Você deve ver 10 micro-ações de exemplo

## Opção 2: Via Supabase CLI

### Pré-requisitos

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Ou via Homebrew (macOS)
brew install supabase/tap/supabase
```

### Passo a Passo

1. **Login no Supabase**

```bash
supabase login
```

2. **Link ao Projeto**

```bash
# Usar o project ref do seu projeto
supabase link --project-ref [seu-project-ref]
```

3. **Aplicar Migration**

```bash
# Aplicar migration específica
supabase migration up

# Ou aplicar todas as migrations pendentes
supabase db push
```

4. **Verificar**

```bash
# Verificar se a tabela foi criada
supabase db diff
```

## Verificação Manual

Execute este SQL no Supabase Dashboard para verificar:

```sql
-- Verificar se a tabela existe
SELECT
  table_name,
  (SELECT COUNT(*) FROM micro_actions WHERE deleted_at IS NULL) as total_actions
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'micro_actions';

-- Ver todas as micro-ações
SELECT
  id,
  title,
  description,
  duration,
  icon,
  category,
  priority,
  active
FROM micro_actions
WHERE deleted_at IS NULL
ORDER BY priority ASC, sort_order ASC;
```

## Estrutura da Tabela

A tabela `micro_actions` contém:

- **id**: UUID (chave primária)
- **title**: Título da micro-ação (obrigatório)
- **description**: Descrição detalhada
- **duration**: Duração estimada (ex: "5 min")
- **icon**: Emoji ou código de ícone
- **category**: Categoria (wellness, self-care, mindfulness, exercise)
- **priority**: Prioridade (menor número = maior prioridade)
- **active**: Se está ativa (default: TRUE)
- **created_at**, **updated_at**, **deleted_at**: Timestamps

## RLS Policies

A tabela tem RLS habilitado com as seguintes policies:

- **SELECT**: Qualquer usuário autenticado pode ler micro-ações ativas
- **INSERT/UPDATE/DELETE**: Apenas service role (para adicionar via SQL ou Edge Functions)

**Nota**: Para adicionar novas micro-ações, você pode:

1. Usar o service role do Supabase (via Dashboard SQL Editor)
2. Criar uma Edge Function com service role
3. Ou remover a restrição de RLS se quiser permitir que usuários adicionem suas próprias micro-ações

## Dados Iniciais

A migration já inclui 10 micro-ações de exemplo:

1. 🧘 Respiração Consciente (2 min)
2. 🙏 Gratidão do Dia (3 min)
3. 🤸 Alongamento Suave (5 min)
4. 🌙 Momento de Silêncio (5 min)
5. 💧 Água e Hidratação (1 min)
6. ✨ Auto-Cuidado Básico (5 min)
7. 👶 Conexão com o Bebê (3 min)
8. ☕ Pausa para o Chá (5 min)
9. 🚶 Caminhada Curta (10 min)
10. 🎵 Música Relaxante (5 min)

## Próximos Passos

Após aplicar a migration:

1. ✅ A tabela `micro_actions` estará criada
2. ✅ 10 micro-ações de exemplo estarão disponíveis
3. ✅ A Home Screen poderá carregar as micro-ações
4. ✅ Você pode adicionar mais micro-ações via SQL ou interface do Supabase

## Adicionar Novas Micro-Ações

Para adicionar novas micro-ações, execute:

```sql
INSERT INTO micro_actions (title, description, duration, icon, category, priority, sort_order)
VALUES (
  'Título da Ação',
  'Descrição detalhada',
  '5 min',
  '🎯',
  'wellness',
  11,
  11
);
```
