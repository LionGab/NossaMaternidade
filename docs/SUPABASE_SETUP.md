# Guia de Configuração do Supabase

Este guia detalha o processo completo de configuração do backend Supabase para o app Nossa Maternidade.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com/) (gratuita)
- Git e Node.js instalados
- Acesso ao código do projeto

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com/)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: Nossa Maternidade
   - **Database Password**: Escolha uma senha forte (guarde com segurança!)
   - **Region**: South America (São Paulo) - Para melhor latência no Brasil
   - **Pricing Plan**: Free (pode upgrade depois)
5. Clique em **"Create New Project"**
6. Aguarde 2-3 minutos para provisioning

## 📊 Passo 2: Aplicar Schema do Banco de Dados

### Opção A: Via SQL Editor (Recomendado)

1. No painel do Supabase, vá para **SQL Editor** (ícone de raio no menu lateral)
2. Clique em **"New Query"**
3. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](../supabase/schema.sql)
4. Cole no editor SQL
5. Clique em **"Run"** (ou Ctrl/Cmd + Enter)
6. Verifique se não há erros (deve aparecer "Success. No rows returned")

### Opção B: Via Supabase CLI (Avançado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref your-project-ref

# Aplicar migrations
supabase db push
```

## 🔐 Passo 3: Verificar RLS (Row Level Security)

O schema já inclui políticas RLS, mas é importante verificar:

1. Vá para **Database** > **Tables**
2. Para cada tabela (profiles, chat_messages, emotion_logs, etc):
   - Clique na tabela
   - Vá para a aba **"Policies"**
   - Verifique se há políticas ativas (ícone de cadeado verde)

**Políticas esperadas:**
- `profiles`: 3 políticas (SELECT, UPDATE, INSERT - próprio perfil)
- `chat_conversations`: 1 política (ALL - próprias conversas)
- `chat_messages`: 1 política (ALL - mensagens de suas conversas)
- `emotion_logs`: 1 política (ALL - próprios logs)
- `habits`: 1 política (ALL - próprios hábitos)
- `content_interactions`: 1 política (ALL - próprias interações)
- `community_posts`: 2 políticas (SELECT público, INSERT/UPDATE próprios)
- `community_comments`: 2 políticas (SELECT público, INSERT/UPDATE próprios)

## 🔑 Passo 4: Obter Credenciais

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie as seguintes credenciais:

### Project URL
```
https://your-project-id.supabase.co
```
Copie este valor para `SUPABASE_URL` no `.env`

### API Keys

**anon / public** (copie para `SUPABASE_ANON_KEY`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
⚠️ Esta key é segura para uso no client (app)

**service_role** (copie para `SUPABASE_SERVICE_ROLE_KEY`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
⚠️ Esta key tem acesso TOTAL ao banco - NUNCA exponha no app!
Use apenas em Edge Functions ou scripts server-side.

## 🗄️ Passo 5: Configurar Storage (Opcional)

Para armazenar avatares e mídias:

1. Vá para **Storage** no menu lateral
2. Clique em **"Create Bucket"**
3. Crie os seguintes buckets:

### Bucket: `avatars`
- **Public**: ✅ Sim (avatares são públicos)
- **File size limit**: 2 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

### Bucket: `audio-messages`
- **Public**: ❌ Não (áudios são privados)
- **File size limit**: 5 MB
- **Allowed MIME types**: `audio/mpeg`, `audio/wav`, `audio/m4a`

### Bucket: `content-media`
- **Public**: ✅ Sim (mídia de conteúdo é pública)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/*`, `video/*`

## ⚙️ Passo 6: Configurar Variáveis de Ambiente

1. Na raiz do projeto, copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e preencha:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Apenas para Edge Functions
   ```

3. Valide a configuração:
   ```bash
   npm run validate:env
   ```

## 🧪 Passo 7: Testar Conexão

Execute o script de teste:

```bash
npm run test:connection
```

**Saída esperada:**
```
✅ Supabase connection: OK
✅ Database accessible: OK
✅ RLS policies active: OK
✅ Profiles table: OK
✅ Chat tables: OK
✅ Emotion logs: OK
✅ Habits: OK
```

Se houver erros, verifique:
- As credenciais estão corretas no `.env`?
- O schema foi aplicado com sucesso?
- As políticas RLS estão ativas?

## 🔄 Passo 8: Deploy de Edge Functions (Opcional - Para IA)

As Edge Functions orquestram chamadas de IA e lógica complexa.

### Funções Disponíveis:
- `chat-ai`: Orquestra chat com Gemini/GPT/Claude
- `analyze-emotion`: Analisa check-in emocional
- `moderate-content`: Modera posts da comunidade
- `recommend-content`: Recomendações personalizadas

### Deploy:

```bash
# Instalar Supabase CLI (se ainda não tem)
npm install -g supabase

# Fazer login
supabase login

# Linkar projeto
supabase link --project-ref your-project-ref

# Deploy de todas as funções
supabase functions deploy

# Ou deploy individual
supabase functions deploy chat-ai
```

### Configurar Secrets para Edge Functions:

```bash
# Gemini API Key
supabase secrets set GEMINI_API_KEY=your-gemini-api-key

# OpenAI API Key (fallback)
supabase secrets set OPENAI_API_KEY=your-openai-api-key

# Claude API Key (fallback)
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-api-key
```

## ✅ Checklist de Verificação Final

Antes de seguir para o próximo passo do plano, verifique:

- [ ] Projeto Supabase criado com sucesso
- [ ] Schema SQL aplicado sem erros
- [ ] Todas as tabelas criadas (9 tabelas esperadas)
- [ ] RLS ativado em todas as tabelas
- [ ] Políticas RLS configuradas corretamente
- [ ] Storage buckets criados (opcional)
- [ ] Credenciais copiadas para `.env`
- [ ] `npm run validate:env` passa sem erros
- [ ] `npm run test:connection` passa sem erros
- [ ] Edge Functions deployadas (opcional)

## 🆘 Troubleshooting

### Erro: "relation does not exist"
**Causa:** Schema não foi aplicado corretamente  
**Solução:** Reaplique o [`supabase/schema.sql`](../supabase/schema.sql) via SQL Editor

### Erro: "JWT expired" ou "Invalid JWT"
**Causa:** Credenciais incorretas no `.env`  
**Solução:** Recopie as keys de **Settings** > **API** no Supabase

### Erro: "permission denied for table"
**Causa:** RLS bloqueando acesso  
**Solução:** Verifique se as políticas RLS estão corretas e ativas

### Erro: "connect ECONNREFUSED"
**Causa:** `SUPABASE_URL` incorreta ou projeto não provisionado  
**Solução:** Verifique a URL em **Settings** > **API**

### Erro ao fazer upload de imagens
**Causa:** Storage bucket não criado ou configurado incorretamente  
**Solução:** Recrie o bucket e verifique as permissões (Public/Private)

## 📚 Recursos Adicionais

- [Documentação Oficial do Supabase](https://supabase.com/docs)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🔗 Próximos Passos

Após concluir este setup:
1. ✅ Marcar to-do `setup-backend` como completo
2. ➡️ Prosseguir para `setup-gemini` (obter API key do Google Gemini)
3. ➡️ Prosseguir para `setup-env` (validação final de todas as variáveis)

---

**Última atualização:** 28 de novembro de 2025  
**Versão:** 1.0.0

