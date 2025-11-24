# Aplicar Schema SQL no Supabase

## ⚠️ Por que não é automático?

A Supabase não fornece um endpoint HTTP para executar SQL arbitrário por questões de segurança. As opções são:

1. **SQL Editor no Dashboard** (recomendado)
2. **Supabase CLI**
3. **Conexão direta PostgreSQL** (requer configuração de rede)
4. **Edge Functions** (requer setup adicional)

## 🎯 Método Recomendado: Supabase Dashboard

### Passo a Passo:

1. **Acesse o SQL Editor:**
   https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/sql

2. **Aplicar Schema:**
   - Clique em "New query"
   - Cole o conteúdo de `supabase/schema.sql`
   - Clique em "Run" ou pressione `Ctrl+Enter`
   - Aguarde a execução (pode demorar alguns segundos)

3. **Aplicar Seed (dados iniciais):**
   - Crie uma nova query
   - Cole o conteúdo de `supabase/seed.sql`
   - Execute

4. **Verificar:**
   - Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/editor
   - Verifique se as tabelas foram criadas

## 🖥️ Método Alternativo: Supabase CLI

Se você tem o Supabase CLI instalado:

```bash
# Login (uma vez)
supabase login

# Link com o projeto (uma vez)
supabase link --project-ref mnszbkeuerjcevjvdqme

# Aplicar schema
supabase db execute --file supabase/schema.sql

# Aplicar seed
supabase db execute --file supabase/seed.sql
```

## 📊 Tabelas que serão criadas:

### Core Tables:
- ✅ `profiles` - Perfis de usuárias
- ✅ `chat_conversations` - Conversas do chat
- ✅ `chat_messages` - Mensagens do chat
- ✅ `content_items` - Conteúdos (vídeos, áudios, artigos)
- ✅ `user_content_interactions` - Interações com conteúdos

### Habits & Milestones:
- ✅ `habits` - Hábitos disponíveis
- ✅ `user_habits` - Hábitos das usuárias
- ✅ `habit_logs` - Registro de hábitos
- ✅ `baby_milestones` - Marcos de desenvolvimento
- ✅ `user_baby_milestones` - Progresso dos marcos

### Community:
- ✅ `community_posts` - Posts da comunidade
- ✅ `community_comments` - Comentários
- ✅ `community_likes` - Curtidas

### Storage Buckets:
- ✅ `avatars` - Fotos de perfil
- ✅ `content` - Conteúdos de mídia
- ✅ `community` - Imagens de posts

## 🌱 Dados Seed:

O `seed.sql` irá inserir:
- 10 hábitos padrão
- 20+ marcos de desenvolvimento do bebê (0-24 meses)
- 10+ conteúdos de exemplo (vídeos, áudios, artigos)

## 🔐 Segurança (RLS):

Todas as tabelas têm Row Level Security (RLS) habilitado com policies:
- Usuárias só veem seus próprios dados
- Conteúdos públicos são visíveis para todos
- Posts da comunidade são visíveis após aprovação

## 🚀 Próximos Passos:

Após aplicar o schema:

1. **Testar no app:**
   ```bash
   npm start
   ```

2. **Verificar no Dashboard:**
   - Table Editor: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/editor
   - Auth: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/auth/users

3. **Criar usuária de teste:**
   - Use o sign up no app
   - Ou crie via Auth > Users no dashboard

## 📝 Arquivos:

- `supabase/schema.sql` - Schema completo (527 linhas)
- `supabase/seed.sql` - Dados iniciais (126 linhas)
- `apply-schema.html` - Interface web (este arquivo foi gerado)

## ❓ Problemas?

1. **Erro de permissão:**
   - Certifique-se de estar usando a SERVICE_ROLE_KEY correta
   - Verifique se está logado no projeto correto

2. **Tabelas já existem:**
   - Use DROP TABLE IF EXISTS antes de recriar
   - Ou modifique o schema para usar IF NOT EXISTS

3. **Timeout:**
   - Execute o schema em partes menores
   - Use o SQL Editor do dashboard (sem limite de tempo)

## 🔗 Links Úteis:

- Dashboard: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
- SQL Editor: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/sql
- Table Editor: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/editor
- Docs: https://supabase.com/docs
