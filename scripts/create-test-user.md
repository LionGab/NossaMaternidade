# Criar Usuário de Teste no Supabase

## Método 1: Dashboard (Recomendado - 1 minuto)

1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/auth/users

2. Clique em **"Add user"** → **"Create new user"**

3. Preencha:
   - **Email**: `teste-ai@nossamaternidade.com`
   - **Password**: `TesteSenha123!`
   - **Auto Confirm User**: ✅ Marcado (importante!)

4. Clique em **"Create user"**

5. ✅ Usuário criado e confirmado automaticamente

---

## Método 2: SQL Editor (Alternativo)

1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/sql/new

2. Cole o SQL:

```sql
-- Criar usuário de teste com senha criptografada
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste-ai@nossamaternidade.com',
  crypt('TesteSenha123!', gen_salt('bf')),
  now(),
  '',
  '',
  now(),
  now()
);
```

3. Execute (Run)

4. ✅ Usuário criado

---

## Método 3: REST API (Programático)

⚠️ Requer `service_role_key` (nunca commitar!)

```bash
curl -X POST "https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/admin/users" \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste-ai@nossamaternidade.com",
    "password": "TesteSenha123!",
    "email_confirm": true
  }'
```

---

## Verificar Usuário Criado

```bash
# Login para testar
curl -X POST "https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste-ai@nossamaternidade.com",
    "password": "TesteSenha123!"
  }'
```

**Resposta esperada** (sucesso):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { ... }
}
```

---

## Adicionar Credenciais ao .env.local

**Criar arquivo** (se não existir): `.env.local`

```bash
# Usuário de teste para smoke tests
TEST_EMAIL=teste-ai@nossamaternidade.com
TEST_PASSWORD=TesteSenha123!
```

⚠️ **NUNCA commitar .env.local** (já está no .gitignore)

---

## Usar no Script de Testes

```js
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error("Set TEST_EMAIL and TEST_PASSWORD in .env.local");
}
```

---

**Status**: Usuário criado via Dashboard é mais rápido e seguro.
