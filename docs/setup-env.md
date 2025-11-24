# 🔐 Configuração de Variáveis de Ambiente

## ✅ Arquivo .env Atualizado

O arquivo `.env` foi atualizado com as seguintes variáveis para o **Expo Go**:

### Variáveis Públicas (EXPO_PUBLIC_*)

Estas variáveis são **seguras** para serem incluídas no bundle do app:

```env
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://mnszbkeuerjcevjvdqme.supabase.co/functions/v1
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyBKBrBAZDzsxErgpezItOayUzRGUAy4oNg
```

### Variáveis Privadas (Servidor/Backend)

Estas variáveis **NÃO devem** ser expostas no app:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSyBKBrBAZDzsxErgpezItOayUzRGUAy4oNg
GITHUB_PERSONAL_ACCESS_TOKEN=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
POSTGRES_CONNECTION_STRING=postgresql://postgres:9E2XLJVsYzGGhuKP@db.mnszbkeuerjcevjvdqme.supabase.co:5432/postgres
```

---

## 📱 Como Funciona no Expo Go

### 1. Variáveis EXPO_PUBLIC_*

Estas variáveis são automaticamente incluídas no bundle quando você roda:
```bash
npm start
```

Elas são acessadas no código via:
```typescript
process.env.EXPO_PUBLIC_SUPABASE_URL
// ou
Constants.expoConfig?.extra?.supabaseUrl
```

### 2. Serviços Configurados

Os serviços já estão configurados para ler essas variáveis:

**src/services/supabase.ts:**
```typescript
const supabaseUrl = 
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL || '';
```

**src/services/geminiService.ts:**
```typescript
this.apiKey = 
  Constants.expoConfig?.extra?.geminiApiKey ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
```

---

## 🚀 Próximos Passos

### 1. Reiniciar o Servidor Expo

Se o servidor já estiver rodando, **reinicie** para carregar as novas variáveis:

```bash
# Parar o servidor (Ctrl+C)
# Depois reiniciar:
npm start -- --clear
```

### 2. Testar no Expo Go

1. Escaneie o QR code com o Expo Go
2. O app deve carregar com as novas configurações
3. Verifique se o chat com IA funciona (Gemini)
4. Verifique se a autenticação funciona (Supabase)

---

## ✅ Verificação

### Checklist:

- [x] Arquivo `.env` atualizado com variáveis corretas
- [x] Variáveis `EXPO_PUBLIC_*` configuradas
- [x] `.env` está no `.gitignore` (não será commitado)
- [x] Serviços configurados para ler as variáveis
- [ ] Servidor Expo reiniciado
- [ ] App testado no Expo Go

---

## 🔒 Segurança

### ✅ O Que Está Seguro:

- ✅ `.env` está no `.gitignore` (não será commitado)
- ✅ Variáveis privadas não são expostas no app
- ✅ Apenas `EXPO_PUBLIC_*` são incluídas no bundle

### ⚠️ Importante:

- ⚠️ **NUNCA** commite o arquivo `.env`
- ⚠️ Variáveis `EXPO_PUBLIC_*` são visíveis no código do app (ok para chaves públicas)
- ⚠️ Service Role Keys **NUNCA** devem ter prefixo `EXPO_PUBLIC_`

---

## 🆘 Troubleshooting

### Variáveis não carregam?

1. **Reinicie o servidor Expo:**
   ```bash
   npm start -- --clear
   ```

2. **Verifique o formato:**
   - Variáveis devem começar com `EXPO_PUBLIC_`
   - Sem espaços antes ou depois do `=`
   - Sem aspas nos valores

3. **Verifique o arquivo .env:**
   - Deve estar na raiz do projeto
   - Deve ter extensão `.env` (sem `.local` ou outra extensão)

---

**Tudo configurado!** Reinicie o servidor Expo e teste no Expo Go. 🚀

