# 🚀 Deploy com Supabase Edge Functions

## **Arquitetura Final:**

```
React Native App
     ↓
Supabase Edge Function (chat-ai)
     ↓
Gemini 2.0 Flash API
     ↓
Resposta → App
```

---

## **1. Instalar Supabase CLI**

### **Windows:**
```powershell
# Via npm
npm install -g supabase

# Ou via Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### **macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Verificar instalação:**
```bash
supabase --version
```

---

## **2. Login no Supabase**

```bash
# Login (abre navegador)
supabase login

# Ou use access token
supabase login --access-token <your-access-token>
```

**Onde pegar o Access Token:**
1. Vá em: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate new token"
3. Copie e use no comando acima

---

## **3. Link ao Projeto**

```bash
# Link ao projeto Supabase
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# Ou se pedir:
supabase link
# Depois selecione: bbcwitnbnosyfpfjtzkr
```

---

## **4. Configurar Secrets (API Keys)**

```bash
# Configurar Gemini API Key na Edge Function
supabase secrets set GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg

# Verificar secrets
supabase secrets list
```

---

## **5. Deploy da Edge Function**

### **Opção A: Deploy Manual**
```bash
# Deploy chat-ai function
supabase functions deploy chat-ai --no-verify-jwt

# Ver logs em tempo real
supabase functions logs chat-ai --follow
```

### **Opção B: Deploy via Script** (Recomendado)
```bash
# Windows (PowerShell)
cd supabase/functions
.\deploy.ps1

# macOS/Linux
cd supabase/functions
chmod +x deploy.sh
./deploy.sh
```

---

## **6. Testar a Edge Function**

### **Teste via cURL:**
```bash
curl -i --location --request POST \
  'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo' \
  --header 'Content-Type: application/json' \
  --data '{"message":"Olá, estou me sentindo ansiosa hoje","history":[]}'
```

**Resposta esperada:**
```json
{
  "text": "Olá! Percebo que você está se sentindo ansiosa hoje...",
  "model": "gemini-2.0-flash-exp",
  "tokensUsed": 150
}
```

### **Teste via Supabase CLI:**
```bash
supabase functions invoke chat-ai \
  --body '{"message":"Olá","history":[]}' \
  --no-verify-jwt
```

---

## **7. Testar no App**

### **Passo 1: Verificar .env**
Seu `.env` já está correto com:
```env
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Passo 2: Rodar o App**
```bash
# iOS
npm run ios

# Android
npm run android

# Expo Go (mais rápido)
npm start
```

### **Passo 3: Testar Chat**
1. Abra o app
2. Vá para a aba **Chat** (💬)
3. Digite: "Estou me sentindo ansiosa"
4. Aguarde 2-5 segundos
5. Você DEVE receber resposta da NathIA

---

## **8. Monitorar Logs**

### **Ver logs em tempo real:**
```bash
supabase functions logs chat-ai --follow
```

### **Ver últimos erros:**
```bash
supabase functions logs chat-ai --limit 50 | grep ERROR
```

---

## **9. Troubleshooting**

### **Problema: "Function not found"**
```bash
# Re-deploy
supabase functions deploy chat-ai --no-verify-jwt
```

### **Problema: "GEMINI_API_KEY not set"**
```bash
# Configurar secret
supabase secrets set GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg

# Re-deploy
supabase functions deploy chat-ai --no-verify-jwt
```

### **Problema: "Authorization header missing"**
Verifique se o app está enviando o JWT:
- `supabase.auth.getSession()` deve retornar uma sessão válida
- O token é enviado automaticamente pelo `supabase.functions.invoke()`

### **Problema: Timeout ou erro 500**
```bash
# Ver logs detalhados
supabase functions logs chat-ai --limit 100

# Verificar se Gemini API Key está correta
# Testar diretamente: https://aistudio.google.com/apikey
```

---

## **10. Custos**

### **Supabase Edge Functions:**
- ✅ **500k invocações/mês GRÁTIS**
- ✅ Depois: $2 por 1M invocações

### **Gemini 2.0 Flash:**
- ✅ **15 requisições/minuto GRÁTIS**
- ✅ **1M tokens input/dia GRÁTIS**
- ✅ Depois: $0.075 por 1M tokens

**Para 1000 usuárias ativas (10 msgs/dia cada):**
- 10.000 mensagens/dia = 300k/mês
- Custo Supabase: **GRÁTIS** (< 500k)
- Custo Gemini: **~$5/mês**

---

## **11. Próximos Passos**

✅ **Deploy completo? Agora:**

1. **Testar no app** (iOS/Android)
2. **Build para TestFlight**:
   ```bash
   npm run build:ios
   ```
3. **Build para Play Store**:
   ```bash
   npm run build:android
   ```
4. **Submeter para lojas**:
   ```bash
   npm run submit:ios
   npm run submit:android
   ```

---

## **12. Comandos Úteis**

```bash
# Ver todas as funções deployadas
supabase functions list

# Deletar uma função
supabase functions delete chat-ai

# Ver secrets
supabase secrets list

# Remover secret
supabase secrets unset GEMINI_API_KEY

# Ver status do projeto
supabase status

# Ver URL do projeto
supabase projects list
```

---

## **13. Produção vs Dev**

### **Dev (Local):**
```bash
# Rodar função localmente
supabase functions serve chat-ai

# Testar localmente
curl http://localhost:54321/functions/v1/chat-ai \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### **Produção:**
- URL: `https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai`
- Sempre use `--no-verify-jwt` se não tiver Row Level Security customizado

---

## **🎯 RESUMO RÁPIDO:**

```bash
# 1. Login
supabase login

# 2. Link projeto
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# 3. Configurar secret
supabase secrets set GEMINI_API_KEY=AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg

# 4. Deploy
supabase functions deploy chat-ai --no-verify-jwt

# 5. Testar
npm run ios
# ou
npm run android

# 6. Ver logs
supabase functions logs chat-ai --follow
```

**Pronto! Chat com IA funcionando! 🚀**
