# Setup do Backend - Nossa Maternidade

Este guia explica como configurar o backend do app Nossa Maternidade, incluindo Supabase e APIs de IA.

---

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (https://supabase.com)
- Conta no Google Cloud (para Gemini API) - opcional
- Conta no OpenAI (para GPT-4o fallback) - opcional
- Conta no Anthropic (para Claude fallback) - opcional

---

## 1. Configuração do Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Anote o **Project URL** e **anon key** (disponíveis em Settings > API)

### 1.2 Configurar Variáveis de Ambiente

1. Copie o arquivo template:
   ```bash
   cp env.template .env
   ```

2. Edite o arquivo `.env` e preencha:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto.supabase.co/functions/v1
   ```

3. Valide a configuração:
   ```bash
   npm run validate:env
   ```

### 1.3 Aplicar Schema do Banco de Dados

1. Execute as migrations:
   ```bash
   # Via Supabase CLI (recomendado)
   npx supabase db push
   
   # Ou via SQL direto no Supabase Dashboard
   # Copie e execute o conteúdo de supabase/schema.sql
   ```

2. Verifique se as tabelas foram criadas:
   - `user_profiles`
   - `chat_messages`
   - `emotion_logs`
   - `habits`
   - `content_interactions`
   - `community_posts`
   - `community_comments`

### 1.4 Configurar RLS (Row Level Security)

As RLS policies já estão definidas nas migrations. Verifique se estão ativas:

```sql
-- Verificar políticas ativas
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### 1.5 Testar Conexão

```bash
# Testar conexão com Supabase
npx ts-node scripts/test-supabase-connection.ts
```

---

## 2. Configuração de APIs de IA

### 2.1 Google Gemini (Obrigatório - IA Principal)

**IMPORTANTE:** A chave do Gemini deve ser configurada como **SECRET** no Supabase, não no `.env` do app.

1. Obtenha uma API key:
   - Acesse https://makersuite.google.com/app/apikey
   - Crie uma nova API key

2. Configure como secret no Supabase:
   ```bash
   npx supabase secrets set GEMINI_API_KEY=sua_chave_aqui
   ```

3. A Edge Function `chat-gemini` usará esta chave automaticamente.

### 2.2 OpenAI (Opcional - Fallback para Crise)

1. Obtenha uma API key:
   - Acesse https://platform.openai.com/api-keys
   - Crie uma nova API key

2. Adicione no `.env`:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=sk-...
   ```

3. Configure como secret no Supabase (para Edge Functions):
   ```bash
   npx supabase secrets set OPENAI_API_KEY=sk-...
   ```

### 2.3 Anthropic Claude (Opcional - Fallback)

1. Obtenha uma API key:
   - Acesse https://console.anthropic.com/
   - Crie uma nova API key

2. Adicione no `.env`:
   ```env
   EXPO_PUBLIC_CLAUDE_API_KEY=sk-ant-...
   ```

3. Configure como secret no Supabase:
   ```bash
   npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```

---

## 3. Configuração de Edge Functions

### 3.1 Deploy da Edge Function chat-gemini

1. Faça login no Supabase CLI:
   ```bash
   npx supabase login
   ```

2. Link seu projeto:
   ```bash
   npx supabase link --project-ref seu-project-ref
   ```

3. Deploy da função:
   ```bash
   npx supabase functions deploy chat-gemini
   ```

4. Teste a função:
   ```bash
   npm run test:gemini-edge
   ```

---

## 4. Configuração de Storage (Supabase)

### 4.1 Criar Buckets

No Supabase Dashboard, vá em Storage e crie os seguintes buckets:

- `avatars` (público) - Para fotos de perfil
- `content` (público) - Para imagens de conteúdo
- `uploads` (privado) - Para uploads de usuários

### 4.2 Configurar Políticas de Storage

As políticas devem permitir:
- **avatars**: Leitura pública, escrita apenas para usuários autenticados
- **content**: Leitura pública, escrita apenas para admins
- **uploads**: Leitura/escrita apenas para o dono do arquivo

---

## 5. Validação Final

Execute todos os testes:

```bash
# Validar variáveis de ambiente
npm run validate:env

# Testar conexão Supabase
npx ts-node scripts/test-supabase-connection.ts

# Testar Gemini Edge Function
npm run test:gemini-edge
```

---

## 6. Troubleshooting

### Problema: Variáveis de ambiente não são lidas

**Solução:**
- Reinicie o servidor Expo: `npx expo start -c`
- Verifique se o arquivo `.env` está na raiz do projeto
- Verifique se as variáveis começam com `EXPO_PUBLIC_`

### Problema: Erro ao conectar com Supabase

**Solução:**
- Verifique se a URL e anon key estão corretas
- Verifique se o projeto Supabase está ativo
- Verifique se há políticas RLS bloqueando acesso

### Problema: Edge Function retorna erro

**Solução:**
- Verifique se os secrets estão configurados: `npx supabase secrets list`
- Verifique os logs da função no Supabase Dashboard
- Teste a função localmente primeiro

---

## 7. Próximos Passos

Após configurar o backend:

1. ✅ Validar todas as conexões
2. ✅ Testar autenticação
3. ✅ Testar chat com IA
4. ✅ Testar upload de arquivos
5. ✅ Verificar RLS policies

---

## Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Google Gemini API](https://ai.google.dev/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

