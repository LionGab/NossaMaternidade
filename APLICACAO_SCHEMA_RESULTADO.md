# Aplicação do Schema SQL do Supabase - Relatório Final

## Status da Execução: PARCIALMENTE CONCLUÍDO

### Por que "Parcialmente"?

A Supabase, por questões de segurança, **não permite execução automática de SQL DDL (CREATE TABLE, ALTER, etc.) via API HTTP**. Isso significa que não é possível aplicar o schema completamente de forma automatizada via script.

### Tentativas Realizadas:

1. **Conexão direta PostgreSQL via `pg`**
   - Status: FALHOU
   - Erro: `ETIMEDOUT` - Conexão bloqueada por firewall/VPN
   - Motivo: O Supabase bloqueia conexões diretas PostgreSQL por padrão

2. **Supabase REST API**
   - Status: NÃO SUPORTADO
   - Motivo: A REST API só permite operações DML (SELECT, INSERT, UPDATE, DELETE), não DDL (CREATE, ALTER, DROP)

3. **Supabase Management API**
   - Status: NÃO APLICÁVEL
   - Motivo: Requer Personal Access Token diferente (não service_role_key)

4. **Edge Functions**
   - Status: NÃO IMPLEMENTADO
   - Motivo: Requer setup adicional e deploy de função

5. **Supabase CLI**
   - Status: DISPONÍVEL mas REQUER AUTENTICAÇÃO MANUAL
   - Motivo: O CLI está instalado mas requer `supabase login` interativo

---

## Solução Implementada

Foram criados **3 métodos** para aplicar o schema:

### Método 1: Supabase Dashboard (RECOMENDADO)

**Mais rápido e visual**

1. Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/sql
2. Clique em "New query"
3. Copie e cole o conteúdo de `supabase/schema.sql`
4. Execute (Ctrl+Enter)
5. Repita com `supabase/seed.sql`

### Método 2: Supabase CLI

**Para automação futura**

```bash
# 1. Login (uma vez)
supabase login

# 2. Link com o projeto (uma vez)
supabase link --project-ref mnszbkeuerjcevjvdqme

# 3. Aplicar schema
supabase db execute --file supabase/schema.sql

# 4. Aplicar seed
supabase db execute --file supabase/seed.sql
```

Ou use o comando NPM:

```bash
npm run db:apply
```

### Método 3: Interface Web HTML

Foi gerado um arquivo `apply-schema.html` com interface visual que:
- Conecta ao Supabase via JavaScript
- Permite verificar o banco de dados
- Mostra instruções interativas

---

## Arquivos Gerados

### Scripts

| Arquivo | Descrição | Uso |
|---------|-----------|-----|
| `scripts/apply-schema.mjs` | Tentativa via PostgreSQL direto | Falhou (conexão bloqueada) |
| `scripts/apply-schema-http.mjs` | Verificação de métodos HTTP | Informativo |
| `scripts/apply-schema-final.mjs` | Gerador de instruções | `npm run db:schema` |
| `scripts/apply-via-cli.ps1` | Script PowerShell para Windows | Manual |

### Documentação

| Arquivo | Descrição |
|---------|-----------|
| `supabase/APLICAR_SCHEMA.md` | Instruções completas passo a passo |
| `apply-schema.html` | Interface web interativa |
| `APLICACAO_SCHEMA_RESULTADO.md` | Este documento |

### Comandos NPM Adicionados

```json
{
  "db:schema": "node scripts/apply-schema-final.mjs",
  "db:apply": "supabase db execute --file supabase/schema.sql && supabase db execute --file supabase/seed.sql",
  "db:reset": "supabase db reset",
  "db:diff": "supabase db diff"
}
```

---

## Estrutura do Schema SQL

### Informações Técnicas

- **Arquivo**: `supabase/schema.sql`
- **Tamanho**: 18.585 caracteres (527 linhas)
- **Tabelas**: 13 tabelas principais
- **Buckets**: 3 buckets de storage
- **Triggers**: 7 triggers automáticos
- **Functions**: 2 functions PostgreSQL
- **Índices**: 15+ índices para performance

### Tabelas Criadas

#### Core (Autenticação e Perfis)

1. **profiles** - Perfis de usuárias (1:1 com auth.users)
   - Campos: email, full_name, avatar_url, phone
   - Onboarding: motherhood_stage, pregnancy_week, baby_birth_date
   - Preferências: emotions, needs, interests, theme, language
   - RLS: Usuárias veem apenas seu próprio perfil

#### Chat IA

2. **chat_conversations** - Conversas do chat
   - Campos: user_id, title, model (gemini-pro, claude, gpt-4)
   - RLS: Usuárias veem apenas suas conversas

3. **chat_messages** - Mensagens individuais
   - Campos: conversation_id, role (user/assistant/system), content
   - RLS: Mensagens visíveis apenas para dona da conversa

#### Conteúdos (Feed)

4. **content_items** - Vídeos, áudios, artigos, reels
   - Campos: title, description, type, category
   - URLs: thumbnail_url, video_url, audio_url
   - Controle: is_premium, is_exclusive, is_published
   - Estatísticas: views_count, likes_count
   - RLS: Conteúdos publicados são públicos

5. **user_content_interactions** - Curtidas, saves, progresso
   - Campos: user_id, content_id, is_liked, is_saved, progress_seconds
   - RLS: Cada usuária vê apenas suas interações

#### Hábitos

6. **habits** - Hábitos disponíveis no app
   - Campos: name, description, icon, color, category, frequency
   - RLS: Visível para todos

7. **user_habits** - Hábitos ativos das usuárias
   - Campos: user_id, habit_id, custom_name, custom_target
   - RLS: Cada usuária vê apenas seus hábitos

8. **habit_logs** - Registro de conclusão
   - Campos: user_habit_id, completed_at, notes
   - RLS: Logs privados

#### Marcos do Bebê

9. **baby_milestones** - Marcos de desenvolvimento (0-24 meses)
   - Campos: title, description, category, age_months, tips
   - RLS: Visível para todos

10. **user_baby_milestones** - Progresso individual
    - Campos: user_id, milestone_id, is_completed, completed_at
    - RLS: Progresso privado

#### Comunidade

11. **community_posts** - Posts da comunidade
    - Campos: user_id, content, image_url, tags
    - Moderação: is_reported, is_approved
    - Estatísticas: likes_count, comments_count
    - RLS: Posts aprovados são públicos

12. **community_comments** - Comentários em posts
    - Campos: post_id, user_id, content, likes_count
    - RLS: Visível para todos

13. **community_likes** - Curtidas em posts/comentários
    - Campos: user_id, post_id OR comment_id
    - RLS: Usuárias gerenciam suas próprias curtidas

### Storage Buckets

1. **avatars** - Fotos de perfil (público)
2. **content** - Vídeos, áudios, imagens de conteúdo (público)
3. **community** - Imagens de posts da comunidade (público)

### Triggers Automáticos

1. `update_profiles_updated_at` - Atualiza timestamp em profiles
2. `update_chat_conversations_updated_at` - Atualiza timestamp em conversas
3. `update_content_items_updated_at` - Atualiza timestamp em conteúdos
4. `update_user_content_interactions_updated_at` - Atualiza interações
5. `update_community_posts_updated_at` - Atualiza posts
6. `update_community_comments_updated_at` - Atualiza comentários
7. `on_auth_user_created` - Cria perfil automaticamente ao criar usuária

### Functions PostgreSQL

1. **update_updated_at_column()** - Atualiza campo updated_at
2. **handle_new_user()** - Cria perfil ao criar usuária em auth.users

---

## Dados Seed (seed.sql)

### Informações Técnicas

- **Arquivo**: `supabase/seed.sql`
- **Tamanho**: 9.693 caracteres (126 linhas)
- **Registros**: 40+ registros iniciais

### Dados Inseridos

#### Hábitos (10 registros)

- Meditação Diária
- Hidratação
- Caminhada
- Diário da Gratidão
- Alongamento
- Leitura para o Bebê
- Skincare
- Sono Adequado
- Alimentação Saudável
- Tempo para Si

#### Marcos de Desenvolvimento (20+ registros)

Por faixa etária:
- **0-3 meses**: Levanta cabeça, sorri socialmente, segue objetos, reage a sons
- **4-6 meses**: Rola, pega objetos, balbucia, reconhece rostos
- **7-9 meses**: Senta sem apoio, transfere objetos, engatinha, entende "não"
- **10-12 meses**: Fica em pé, faz pinça, fala primeiras palavras, acena
- **13-18 meses**: Anda sozinho, usa colher, aponta, vocabulário expandido
- **19-24 meses**: Corre, sobe escadas, forma frases, brinca de faz de conta

#### Conteúdos (10+ registros)

**Vídeos:**
- Técnicas de Respiração para o Parto (7min)
- Como Amamentar Corretamente (6min)
- Yoga Pré-Natal (15min)

**Áudios:**
- Meditação Guiada para Mães (10min)
- Sons Relaxantes para o Bebê Dormir (30min)

**Artigos:**
- Desenvolvimento do Bebê: 0-3 Meses
- Introdução Alimentar: Guia Completo
- Depressão Pós-Parto: Sinais e Ajuda

**Reels:**
- 5 Dicas Rápidas para Acalmar o Bebê (1min)
- Produtos Essenciais para o Enxoval (45s)

---

## Segurança (RLS - Row Level Security)

Todas as tabelas têm RLS habilitado com policies específicas:

### Privacidade Total
- profiles: Usuárias veem apenas seu próprio perfil
- user_habits, habit_logs: Hábitos privados
- user_baby_milestones: Progresso privado
- user_content_interactions: Interações privadas
- chat_conversations, chat_messages: Chats privados

### Visibilidade Pública Controlada
- content_items: Apenas conteúdos publicados (is_published = true)
- community_posts: Apenas posts aprovados (is_approved = true)
- habits, baby_milestones: Dados públicos (biblioteca)

### Permissões de Escrita
- Usuárias podem criar seus próprios posts
- Usuárias podem editar apenas seus próprios dados
- Usuárias podem deletar apenas seus próprios registros

---

## Como Verificar se Funcionou

### Via Dashboard (Visual)

1. **Table Editor**
   - Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/editor
   - Verifique se as 13 tabelas aparecem na lista

2. **Storage**
   - Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/storage/buckets
   - Verifique se os 3 buckets existem (avatars, content, community)

3. **SQL Editor**
   - Execute: `SELECT * FROM habits;`
   - Deve retornar 10 hábitos

4. **Auth**
   - Crie uma usuária de teste
   - Verifique se o perfil foi criado automaticamente em `profiles`

### Via App (Funcional)

1. **Inicie o app**: `npm start`
2. **Teste o sign up**: Criar nova conta
3. **Verifique o onboarding**: Salvar dados do perfil
4. **Teste o feed**: Visualizar conteúdos (vídeos, áudios)
5. **Teste o chat**: Conversar com IA
6. **Teste hábitos**: Adicionar e marcar hábitos
7. **Teste marcos**: Visualizar marcos de desenvolvimento

### Via Supabase JS (Código)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mnszbkeuerjcevjvdqme.supabase.co',
  'YOUR_ANON_KEY'
);

// Verificar hábitos
const { data: habits, error } = await supabase
  .from('habits')
  .select('*');

console.log(habits); // Deve retornar 10 hábitos

// Verificar marcos
const { data: milestones } = await supabase
  .from('baby_milestones')
  .select('*');

console.log(milestones.length); // Deve ser > 20

// Verificar conteúdos
const { data: content } = await supabase
  .from('content_items')
  .select('*');

console.log(content.length); // Deve ser > 10
```

---

## Próximos Passos

### 1. Aplicar o Schema

Use um dos métodos documentados acima.

### 2. Configurar Autenticação

- Habilitar Email Auth no dashboard
- Configurar Email Templates (boas-vindas, recuperação de senha)
- Opcional: Configurar OAuth (Google, Apple)

### 3. Testar o App

```bash
npm start
```

### 4. Popular com Mais Dados

- Adicionar mais conteúdos (vídeos, áudios, artigos)
- Criar posts de exemplo na comunidade
- Adicionar mais hábitos personalizados

### 5. Configurar Storage

- Fazer upload de thumbnails reais
- Fazer upload de vídeos/áudios
- Configurar CORS se necessário

### 6. Monitoramento

- Configurar Logs no Supabase Dashboard
- Configurar Alerts para erros
- Monitorar uso de API (requisições/dia)

---

## Problemas Conhecidos e Soluções

### Problema 1: Conexão PostgreSQL Bloqueada

**Erro**: `ETIMEDOUT` ao tentar conectar via `pg`

**Causa**: Supabase bloqueia conexões diretas por padrão

**Solução**: Use Supabase CLI ou SQL Editor do dashboard

### Problema 2: CLI requer autenticação

**Erro**: `failed to parse environment file: .env`

**Causa**: Arquivo .env com caracteres especiais

**Solução**: Use `supabase login` interativo ou fixe o .env

### Problema 3: RLS bloqueia queries

**Erro**: `new row violates row-level security policy`

**Causa**: Tentando inserir dados sem autenticação

**Solução**:
- Use service_role_key para operações admin
- Ou autentique a usuária antes de inserir

### Problema 4: Tabelas já existem

**Erro**: `relation "profiles" already exists`

**Causa**: Schema já foi aplicado anteriormente

**Solução**:
- Use `IF NOT EXISTS` no SQL (já incluído no schema)
- Ou faça `DROP TABLE IF EXISTS` antes

---

## Estatísticas do Projeto

### Arquivos SQL
- Schema: 527 linhas, 18.585 caracteres
- Seed: 126 linhas, 9.693 caracteres
- Total: 653 linhas de SQL

### Estrutura do Banco
- 13 tabelas
- 3 storage buckets
- 7 triggers
- 2 functions
- 15+ índices
- 20+ RLS policies

### Dados Iniciais
- 10 hábitos
- 20+ marcos de desenvolvimento
- 10+ conteúdos (vídeos, áudios, artigos)

### Scripts Criados
- 4 scripts JavaScript/Node.js
- 1 script PowerShell
- 2 arquivos de documentação
- 1 interface HTML

---

## Links Úteis

### Supabase Dashboard
- **Projeto**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
- **SQL Editor**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/sql
- **Table Editor**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/editor
- **Storage**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/storage
- **Auth**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/auth/users
- **API Docs**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/api

### Documentação
- **Supabase Docs**: https://supabase.com/docs
- **Supabase CLI**: https://supabase.com/docs/guides/cli
- **PostgREST**: https://postgrest.org/en/stable/
- **PostgreSQL**: https://www.postgresql.org/docs/

### Projeto
- **Repositório**: NossaMaternidadeMelhor-clone
- **URL Supabase**: https://mnszbkeuerjcevjvdqme.supabase.co

---

## Conclusão

A aplicação do schema SQL do Supabase **não pode ser totalmente automatizada via API** devido a restrições de segurança da plataforma. No entanto, foram criadas **ferramentas e documentação completa** para facilitar o processo manual.

**Recomendação**: Use o **Supabase Dashboard** (Método 1) para uma aplicação rápida e visual do schema. É o método mais simples e confiável.

**Para automação futura**: Configure o **Supabase CLI** (Método 2) com `supabase login` e use os comandos NPM criados (`npm run db:apply`).

**Todos os arquivos necessários foram gerados e estão prontos para uso.**

---

## Comandos Rápidos

```bash
# Ver instruções
npm run db:schema

# Aplicar schema (via CLI, requer login)
npm run db:apply

# Verificar diferenças
npm run db:diff

# Resetar banco (CUIDADO!)
npm run db:reset

# Iniciar app
npm start
```

---

**Gerado em**: 2025-11-24
**Projeto**: Nossa Maternidade
**Versão**: 1.0.0
