# 🔑 Guia Completo: Token do Supabase

Este guia mostra **tudo** sobre o token do Supabase: como obter, configurar e usar no código.

---

## 📋 Índice

1. [O que é o Token do Supabase](#o-que-é-o-token-do-supabase)
2. [Como Obter o Token](#como-obter-o-token)
3. [Configuração Automática (Recomendado)](#configuração-automática-recomendado)
4. [Configuração Manual](#configuração-manual)
5. [Como o Token é Usado no Código](#como-o-token-é-usado-no-código)
6. [Validação e Testes](#validação-e-testes)
7. [Troubleshooting](#troubleshooting)

---

## O que é o Token do Supabase

O token do Supabase é a **chave anônima (anon key)** que permite que seu app se conecte ao Supabase de forma segura.

### Tipos de Chaves

| Chave | Uso | Segurança |
|-------|-----|-----------|
| **anon public** | ✅ App mobile/web | Pública, mas protegida por RLS |
| **service_role** | ❌ Backend apenas | ⚠️ NUNCA use no app! |

**IMPORTANTE**: Use sempre a chave **anon public** no app. Ela é projetada para ser pública e é protegida por Row Level Security (RLS).

---

## Como Obter o Token

### Passo 1: Acessar Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login (ou crie uma conta)

### Passo 2: Selecionar/Criar Projeto

- Se já tiver projeto: selecione na lista
- Se não tiver: clique em **"New Project"**
  - Nome: `Nossa Maternidade`
  - Database Password: Crie uma senha forte (GUARDE!)
  - Region: **South America (São Paulo)**
  - Plan: Free (para desenvolvimento)
  - Aguarde ~2 minutos para provisionar

### Passo 3: Obter Credenciais

1. No menu lateral, vá em **Settings** → **API**
2. Você verá duas seções importantes:

```
Project URL:    https://seu-projeto-id.supabase.co
anon public:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Copie ambos os valores**

⚠️ **ATENÇÃO**: Use a chave **anon public** (não a service_role!)

---

## Configuração Automática (Recomendado)

Use o script interativo que faz tudo automaticamente:

```bash
npm run get-supabase-token
```

O script vai:
1. ✅ Guiar você passo a passo
2. ✅ Validar formato do token e URL
3. ✅ Criar/atualizar `.env.local`
4. ✅ Testar conexão com Supabase
5. ✅ Mostrar resumo final

### Exemplo de Execução

```bash
$ npm run get-supabase-token

════════════════════════════════════════════════════════════
  Configuração do Token Supabase
════════════════════════════════════════════════════════════

▶ Como Obter o Token do Supabase
...
[Instruções detalhadas]

EXPO_PUBLIC_SUPABASE_URL (https://xxx.supabase.co): https://abc123.supabase.co
✅ URL válida!

EXPO_PUBLIC_SUPABASE_ANON_KEY (eyJ...): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ Token coletado!

✅ Arquivo .env.local criado/atualizado!
✅ Conexão com Supabase estabelecida com sucesso!
```

---

## Configuração Manual

Se preferir configurar manualmente:

### 1. Criar Arquivo `.env.local`

```bash
cp .env.example .env.local
```

### 2. Editar `.env.local`

Abra o arquivo e preencha:

```bash
# Supabase - URL do projeto
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co

# Supabase - Chave anônima (pública, segura para o app)
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase - URL das Edge Functions
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto-id.supabase.co/functions/v1
```

### 3. Verificar Configuração

```bash
npm run check-env
```

Deve aparecer:
```
✅ EXPO_PUBLIC_SUPABASE_URL
✅ EXPO_PUBLIC_SUPABASE_ANON_KEY
✅ EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL
```

---

## Como o Token é Usado no Código

### 1. Inicialização do Cliente Supabase

**Arquivo**: `src/api/supabase.ts`

```typescript
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Lê variáveis de ambiente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Cria cliente Supabase (só se credenciais existirem)
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === "web",
    },
  });
}

export { supabase };
```

### 2. Uso em Serviços

**Exemplo**: `src/api/auth.ts`

```typescript
import { supabase } from '@/api/supabase';

export async function signIn(email: string, password: string) {
  if (!supabase) {
    throw new Error(
      "Supabase não está configurado. " +
      "Adicione EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY " +
      "nas variáveis de ambiente."
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### 3. Acesso via Config Helper

**Arquivo**: `src/config/env.ts`

```typescript
import { getEnv } from '@/config/env';

// Obter URL do Supabase
const supabaseUrl = getEnv('EXPO_PUBLIC_SUPABASE_URL');
// ou
const supabaseUrl = getEnv('supabaseUrl'); // camelCase também funciona

// Obter token
const anonKey = getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
```

---

## Validação e Testes

### Verificar Configuração

```bash
npm run check-env
```

### Testar Conexão Manualmente

**Script**: `scripts/test-login.mjs`

```bash
node scripts/test-login.mjs
```

### Testar no App

```bash
npm start
# Pressione 'w' para web ou 'i' para iOS / 'a' para Android
```

**Teste básico**:
1. Abra o app
2. Tente criar uma conta
3. Verifique no Supabase Dashboard → Authentication → Users

---

## Troubleshooting

### ❌ "Supabase URL is undefined"

**Causa**: Variável de ambiente não configurada

**Solução**:
```bash
# Verificar se .env.local existe
ls -la .env.local

# Verificar conteúdo
cat .env.local

# Re-executar check
npm run check-env
```

### ❌ "Invalid API key"

**Causa**: Token incorreto ou copiado errado

**Solução**:
1. Volte ao Supabase Dashboard → Settings → API
2. Copie novamente a chave **anon public** (não service_role)
3. Certifique-se de não ter espaços extras
4. Token deve começar com `eyJ`

### ❌ "relation 'profiles' does not exist"

**Causa**: Schema do banco não foi aplicado

**Solução**:
1. Abra Supabase Dashboard → SQL Editor
2. Execute o conteúdo de `supabase-setup.sql`
3. Verifique se todas as tabelas foram criadas

### ❌ Token não funciona após build

**Causa**: Secrets não configurados no EAS

**Solução**:
```bash
# Configurar secrets para produção
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
```

---

## 📚 Referências

- **Supabase Dashboard**: https://app.supabase.com
- **Documentação Supabase**: https://supabase.com/docs
- **API Keys**: https://app.supabase.com/project/_/settings/api
- **SQL Editor**: https://app.supabase.com/project/_/sql

---

## ✅ Checklist Final

- [ ] Token obtido do Supabase Dashboard
- [ ] `.env.local` criado e configurado
- [ ] `npm run check-env` passou
- [ ] Conexão testada com sucesso
- [ ] Schema SQL aplicado (se necessário)
- [ ] App conectando corretamente

---

**Configuração completa!** 🎉

Agora você pode usar o Supabase no app sem problemas.
