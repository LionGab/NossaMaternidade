# ⚡ APLICAR SCHEMA DO SUPABASE - AÇÃO IMEDIATA

## 🎯 Status Atual

✅ **Conexão com Supabase**: Funcionando
❌ **Schema do banco**: **NÃO APLICADO**
❌ **Dados seed**: **NÃO APLICADOS**

---

## 🚨 AÇÃO NECESSÁRIA

Você precisa aplicar o schema SQL no dashboard do Supabase **AGORA**.

---

## 📋 Passo a Passo (5 minutos)

### 1️⃣ Abrir Dashboard do Supabase

1. Acesse: [https://app.supabase.com](https://app.supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **"nossa-maternidade"**
   - URL: `https://mnszbkeuerjcevjvdqme.supabase.co`

---

### 2️⃣ Aplicar Schema (Criar Tabelas)

1. No menu lateral, clique em **"SQL Editor"** (ícone 📝)
2. Clique no botão **"+ New query"**
3. **COPIE TODO O CONTEÚDO** do arquivo:
   ```
   📁 supabase/schema.sql
   ```
4. **COLE** no editor SQL do Supabase
5. Clique no botão **"Run"** (ou pressione `Ctrl + Enter`)
6. ⏱️ Aguarde 10-15 segundos
7. ✅ Você deve ver: **"Success. No rows returned"**

**⚠️ IMPORTANTE**: Copie TUDO do arquivo `schema.sql` (527 linhas)

---

### 3️⃣ Popular Banco (Seed Data)

1. Ainda no **SQL Editor**, clique em **"+ New query"** novamente
2. **COPIE TODO O CONTEÚDO** do arquivo:
   ```
   📁 supabase/seed.sql
   ```
3. **COLE** no editor SQL
4. Clique em **"Run"**
5. ⏱️ Aguarde 5 segundos
6. ✅ Você deve ver uma mensagem de sucesso

---

### 4️⃣ Verificar se Funcionou

Execute o teste novamente:

```bash
npx ts-node scripts/test-supabase-connection.ts
```

**Resultado esperado:**
```
✅ Conexão estabelecida! Encontrados 10 hábitos.
✅ Encontrados 24 marcos de desenvolvimento.
✅ Encontrados 10 conteúdos.
🎉 Supabase está configurado corretamente!
```

---

## 📊 O Que Será Criado

### Tabelas (11 no total)
- ✅ `profiles` - Perfis das usuárias
- ✅ `habits` - Hábitos disponíveis
- ✅ `user_habits` - Hábitos de cada usuária
- ✅ `habit_logs` - Registros de conclusão
- ✅ `baby_milestones` - Marcos de desenvolvimento
- ✅ `user_baby_milestones` - Progresso individual
- ✅ `content_items` - Conteúdos do feed
- ✅ `user_content_interactions` - Likes, saves
- ✅ `chat_conversations` - Conversas com IA
- ✅ `chat_messages` - Mensagens
- ✅ `community_posts` - Posts da comunidade
- ✅ `community_comments` - Comentários
- ✅ `community_likes` - Curtidas

### Dados Iniciais (Seed)
- ✅ 10 hábitos padrão
- ✅ 24+ marcos de desenvolvimento do bebê
- ✅ 10+ conteúdos de exemplo

### Storage Buckets
- ✅ `avatars` - Fotos de perfil
- ✅ `content` - Vídeos e áudios
- ✅ `community` - Imagens de posts

### Segurança
- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Políticas de acesso configuradas
- ✅ Triggers automáticos
- ✅ Índices para performance

---

## 🔍 Como Verificar Manualmente

### Via Dashboard:

1. No menu lateral, clique em **"Table Editor"** (ícone 🗂️)
2. Você deve ver as seguintes tabelas listadas:
   - profiles
   - habits
   - baby_milestones
   - content_items
   - chat_conversations
   - community_posts
   - user_habits
   - habit_logs
   - etc.

3. Clique na tabela **`habits`**
   - Você deve ver **10 linhas** (hábitos)

4. Clique na tabela **`baby_milestones`**
   - Você deve ver **~24 linhas** (marcos)

5. Clique na tabela **`content_items`**
   - Você deve ver **~10 linhas** (conteúdos)

---

## ⚠️ Problemas Comuns

### Erro: "syntax error at or near..."

**Causa**: Você não copiou todo o conteúdo do arquivo.

**Solução**: Abra o arquivo novamente, pressione `Ctrl+A` para selecionar tudo, e copie.

---

### Erro: "relation already exists"

**Causa**: O schema já foi aplicado parcialmente.

**Solução**:
1. Vá em **SQL Editor**
2. Execute este comando para limpar tudo:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
3. Depois, execute o `schema.sql` novamente

---

### Tabelas aparecem mas estão vazias

**Causa**: Você aplicou o schema mas esqueceu do seed.

**Solução**: Execute o arquivo `seed.sql` conforme o passo 3️⃣

---

## 📞 Próximos Passos

Após aplicar o schema com sucesso:

1. ✅ Execute o teste: `npx ts-node scripts/test-supabase-connection.ts`
2. ✅ Inicie o app: `npm start`
3. ✅ Teste o login/cadastro
4. ✅ Verifique se os hábitos aparecem
5. ✅ Teste o chat com IA

---

## 🎯 Checklist Final

- [ ] Schema aplicado (`schema.sql`)
- [ ] Seed aplicado (`seed.sql`)
- [ ] Teste de conexão passou
- [ ] Tabelas visíveis no Table Editor
- [ ] Dados aparecem nas tabelas
- [ ] App conecta com sucesso

---

**💡 Dica**: Depois de aplicar, mantenha o dashboard do Supabase aberto em uma aba para monitorar logs e verificar dados em tempo real.

---

**✨ Assim que aplicar o schema, execute o teste novamente para confirmar que tudo está funcionando!**

```bash
npx ts-node scripts/test-supabase-connection.ts
```
