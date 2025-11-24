# Configuração do Projeto Google Cloud

## Informações do Projeto

- **ID do Projeto**: `gen-lang-client-0061816054`
- **Número do Projeto**: `854690283424`
- **Região**: `us-central1`
- **Serviço Cloud Run**: `nossa-maternidade-web`

## Arquivos Configurados

Os seguintes arquivos foram atualizados com o ID do projeto:

- ✅ `service.yaml` - Configuração do Cloud Run Service
- ✅ `.cloudcode/settings.json` - Configurações do Cloud Code
- ✅ `package.json` - Script de deploy

## Próximos Passos

### 1. Configurar gcloud CLI (se ainda não fez)

```powershell
# Verificar instalação
npm run check:gcloud

# Se não estiver instalado
npm run install:gcloud

# Configurar projeto
gcloud config set project gen-lang-client-0061816054
```

### 2. Criar Secrets no Google Cloud

```powershell
# Supabase Anon Key
echo -n "sua_chave_supabase_anon" | gcloud secrets create supabase-anon-key --data-file=- --project=gen-lang-client-0061816054

# Gemini API Key
echo -n "sua_chave_gemini" | gcloud secrets create gemini-api-key --data-file=- --project=gen-lang-client-0061816054
```

Ou via Console Web:
https://console.cloud.google.com/security/secret-manager?project=gen-lang-client-0061816054

### 3. Dar Permissões ao Service Account

```powershell
# Obter número do projeto
$PROJECT_NUMBER = "854690283424"

# Dar permissão de acesso aos secrets
gcloud secrets add-iam-policy-binding supabase-anon-key `
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor" `
  --project=gen-lang-client-0061816054

gcloud secrets add-iam-policy-binding gemini-api-key `
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor" `
  --project=gen-lang-client-0061816054
```

### 4. Habilitar APIs Necessárias

```powershell
gcloud services enable cloudbuild.googleapis.com --project=gen-lang-client-0061816054
gcloud services enable run.googleapis.com --project=gen-lang-client-0061816054
gcloud services enable containerregistry.googleapis.com --project=gen-lang-client-0061816054
gcloud services enable secretmanager.googleapis.com --project=gen-lang-client-0061816054
```

Ou use o script automático:
```powershell
npm run setup:cloud-run -- -ProjectId gen-lang-client-0061816054
```

### 5. Fazer Deploy

**Opção A: Cloud Code no VS Code (Recomendado)**
```bash
code --install-extension GoogleCloudTools.cloudcode
code .
# Ctrl+Shift+P → "Cloud Code: Deploy to Cloud Run"
```

**Opção B: CLI**
```powershell
npm run deploy:cloud-run
```

## URLs do Projeto

- **Console do Projeto**: https://console.cloud.google.com/home/dashboard?project=gen-lang-client-0061816054
- **Cloud Run**: https://console.cloud.google.com/run?project=gen-lang-client-0061816054
- **Secret Manager**: https://console.cloud.google.com/security/secret-manager?project=gen-lang-client-0061816054
- **Cloud Build**: https://console.cloud.google.com/cloud-build?project=gen-lang-client-0061816054

## Verificação

Para verificar se tudo está configurado:

```powershell
# Verificar projeto atual
gcloud config get-value project

# Deve retornar: gen-lang-client-0061816054

# Verificar autenticação
gcloud auth list

# Verificar APIs habilitadas
gcloud services list --enabled --project=gen-lang-client-0061816054
```

