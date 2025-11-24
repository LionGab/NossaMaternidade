# 🔧 Correção de Erro: conversation_id does not exist

## Problema

Erro ao executar schema SQL:
```
ERROR: 42703: column "conversation_id" does not exist
```

## Causa

O erro ocorre quando:
1. Parte do schema já foi executada parcialmente
2. A tabela `chat_conversations` não existe quando tenta criar a foreign key
3. Ordem de execução incorreta

## Solução

Foi criado um arquivo corrigido: **`supabase/schema-fixed.sql`**

Este arquivo:
- ✅ Usa `DROP POLICY IF EXISTS` antes de criar policies (evita conflitos)
- ✅ Usa `DROP TRIGGER IF EXISTS` antes de criar triggers
- ✅ Usa `CREATE INDEX IF NOT EXISTS` para índices
- ✅ Usa `ON CONFLICT DO NOTHING` para buckets
- ✅ Ordem correta garantida

## Como Usar

### Opção 1: Usar schema-fixed.sql (Recomendado)

1. **Acesse:** https://app.supabase.com/project/bbcwitnbnosyfpfjtzkr/sql

2. **New Query**

3. **Copie TODO o conteúdo** de `supabase/schema-fixed.sql`

4. **Cole e Execute** (Run)

### Opção 2: Limpar e Recriar (Se ainda der erro)

Se ainda houver erro, limpe as tabelas primeiro:

```sql
-- Executar APENAS se precisar limpar tudo (CUIDADO: apaga dados!)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_conversations CASCADE;
DROP TABLE IF EXISTS public.habit_logs CASCADE;
DROP TABLE IF EXISTS public.user_habits CASCADE;
DROP TABLE IF EXISTS public.user_content_interactions CASCADE;
DROP TABLE IF EXISTS public.community_likes CASCADE;
DROP TABLE IF EXISTS public.community_comments CASCADE;
DROP TABLE IF EXISTS public.community_posts CASCADE;
DROP TABLE IF EXISTS public.user_baby_milestones CASCADE;
DROP TABLE IF EXISTS public.baby_milestones CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;
DROP TABLE IF EXISTS public.content_items CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

Depois execute `schema-fixed.sql` normalmente.

### Opção 3: Executar em Partes

Se preferir executar em partes menores:

#### Parte 1: Tabelas Base
```sql
-- Executar até criar chat_conversations
-- (linhas 1-75 do schema-fixed.sql)
```

#### Parte 2: Chat Messages
```sql
-- Depois executar criação de chat_messages
-- (linhas 81-88 do schema-fixed.sql)
```

## Diferenças do schema-fixed.sql

### Correções Principais:

1. **Adicionado campo `context` em chat_conversations:**
   ```sql
   context JSONB DEFAULT '{}'::jsonb,
   ```
   (Isso estava faltando e pode causar erros no código)

2. **Adicionado campo `user_id` em habit_logs:**
   ```sql
   user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
   ```
   (Facilita queries diretas)

3. **RLS Policy melhorada para chat_messages:**
   ```sql
   USING (
     EXISTS (
       SELECT 1 FROM public.chat_conversations 
       WHERE id = chat_messages.conversation_id 
       AND user_id = auth.uid()
     )
   )
   ```
   (Mais eficiente que subquery com IN)

4. **DROP IF EXISTS em todas as policies e triggers:**
   - Evita erro "already exists"
   - Permite reexecutar o script

5. **CREATE INDEX IF NOT EXISTS:**
   - Não falha se índice já existe

## Verificação Pós-Execução

Após executar, verifique:

```sql
-- Verificar se tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles',
    'chat_conversations',
    'chat_messages',
    'content_items',
    'user_content_interactions',
    'habits',
    'user_habits',
    'habit_logs',
    'community_posts',
    'community_comments',
    'community_likes',
    'baby_milestones',
    'user_baby_milestones'
  )
ORDER BY table_name;
```

**Resultado esperado:** 13 linhas (todas as tabelas)

## Se Ainda Der Erro

1. Verifique qual linha está causando erro
2. Execute apenas até a tabela anterior
3. Depois continue com a próxima parte
4. Ou use o método de limpar e recriar (Opção 2)

---

**Arquivo:** `supabase/schema-fixed.sql` ✅ Use este arquivo!

