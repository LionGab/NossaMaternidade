# 🚀 Guia Completo de Implementação - Cloud Code

## 📖 Índice

1. [Introdução](#introdução)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração Inicial](#configuração-inicial)
4. [Passo a Passo da Implementação](#passo-a-passo-da-implementação)
5. [Deploy usando Cloud Code](#deploy-usando-cloud-code)
6. [Monitoramento e Debug](#monitoramento-e-debug)
7. [Troubleshooting](#troubleshooting)

---

## 📋 Introdução

Este guia fornece instruções passo a passo para implementar e fazer deploy do aplicativo **Nossa Maternidade** no Google Cloud usando **Cloud Code** no Visual Studio Code.

### O que é Cloud Code?

Cloud Code é uma extensão do VS Code e IntelliJ que facilita o desenvolvimento, build, deploy e debug de aplicações em Google Cloud Platform, especialmente para:

- **Cloud Run** (aplicações serverless conteinerizadas)
- **Google Kubernetes Engine (GKE)**
- **App Engine**
- **Cloud Functions**

### Arquivos de Configuração Criados

- ✅ `.vscode/tasks.json` - Tarefas automatizadas
- ✅ `.vscode/launch.json` - Configurações de debug e deploy
- ✅ `.vscode/settings.json` - Configurações do projeto
- ✅ `skaffold.yaml` - Orquestração de build e deploy
- ✅ `Dockerfile` - Contêinerização da aplicação
- ✅ `service.yaml` - Configuração do Cloud Run

---

## 🔧 Pré-requisitos

### 1. Ferramentas Necessárias

| Ferramenta           | Versão Mínima | Status       | Como Instalar                                  |
| -------------------- | ------------- | ------------ | ---------------------------------------------- |
| VS Code              | 1.85+         | ⚠️ Verificar | https://code.visualstudio.com/                 |
| Node.js              | 20.x          | ⚠️ Verificar | https://nodejs.org/                            |
| pnpm                 | 9.x           | ⚠️ Verificar | `npm install -g pnpm`                          |
| Docker               | 24.x          | ⚠️ Verificar | https://www.docker.com/products/docker-desktop |
| Google Cloud SDK     | Latest        | ⚠️ Verificar | `.\scripts\install-gcloud.ps1`                 |
| Cloud Code Extension | Latest        | ⚠️ Verificar | Marketplace do VS Code                         |

### 2. Conta Google Cloud

- ✅ Conta Google Cloud ativa
- ✅ Projeto criado no GCP
- ✅ Faturamento habilitado
- ✅ APIs necessárias ativadas:
  - Cloud Run API
  - Cloud Build API
  - Container Registry API
  - Artifact Registry API

### 3. Verificar Instalações

Execute no PowerShell:

```powershell
# Verificar todas as ferramentas
.\scripts\check-gcloud.ps1

# Verificar Node.js
node --version  # Deve ser v20.x ou superior

# Verificar pnpm
pnpm --version  # Deve ser 9.x ou superior

# Verificar Docker
docker --version
docker ps  # Verificar se está rodando

# Verificar gcloud
gcloud --version
gcloud auth list
gcloud config get-value project
```

---

## ⚙️ Configuração Inicial

### Passo 1: Instalar Cloud Code

**No VS Code:**

1. Abra o VS Code
2. Vá para Extensions (`Ctrl+Shift+X`)
3. Procure por "Cloud Code"
4. Clique em "Install" na extensão **Cloud Code** by Google Cloud

**Ou via linha de comando:**

```powershell
code --install-extension GoogleCloudTools.cloudcode
```

### Passo 2: Configurar Google Cloud SDK

**Se ainda não instalou o gcloud:**

```powershell
# Executar script de instalação
.\scripts\install-gcloud.ps1

# Ou instalar manualmente
# Baixar de: https://cloud.google.com/sdk/docs/install
```

**Após instalação, autenticar:**

```powershell
# Fazer login no Google Cloud
gcloud auth login

# Configurar projeto (substitua PROJECT_ID pelo seu ID)
gcloud config set project PROJECT_ID

# Configurar região padrão
gcloud config set run/region us-central1

# Habilitar APIs necessárias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Passo 3: Configurar Docker para Google Cloud

```powershell
# Configurar autenticação do Docker com GCR
gcloud auth configure-docker gcr.io

# Verificar configuração
docker info | Select-String -Pattern "gcr.io"
```

### Passo 4: Atualizar Arquivos de Configuração

**Editar `.vscode/settings.json`:**

```json
{
  "cloudcode.project": "SEU_PROJECT_ID", // ⚠️ ALTERAR
  "cloudcode.duetAI.project": "SEU_PROJECT_ID" // ⚠️ ALTERAR
}
```

**Editar `skaffold.yaml`:**

Substituir todas as ocorrências de `PROJECT_ID` pelo ID real do seu projeto:

```yaml
googleCloudBuild:
  projectId: SEU_PROJECT_ID  // ⚠️ ALTERAR
```

**Editar `service.yaml`:**

```yaml
serviceAccountName: nossa-maternidade-sa@SEU_PROJECT_ID.iam.gserviceaccount.com # ⚠️ ALTERAR
containers:
  - image: gcr.io/SEU_PROJECT_ID/nossa-maternidade-web:latest # ⚠️ ALTERAR
```

### Passo 5: Criar Service Account (Opcional mas Recomendado)

```powershell
# Criar service account
gcloud iam service-accounts create nossa-maternidade-sa `
  --display-name="Nossa Maternidade Service Account"

# Dar permissões
$PROJECT_ID = gcloud config get-value project
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:nossa-maternidade-sa@${PROJECT_ID}.iam.gserviceaccount.com" `
  --role="roles/run.invoker"
```

### Passo 6: Configurar Secrets (Variáveis de Ambiente Sensíveis)

```powershell
# Criar secrets no Secret Manager
gcloud secrets create supabase-anon-key `
  --data-file=- <<< "sua_supabase_anon_key_aqui"

gcloud secrets create gemini-api-key `
  --data-file=- <<< "sua_gemini_api_key_aqui"

# Dar permissão ao Cloud Run para acessar os secrets
gcloud secrets add-iam-policy-binding supabase-anon-key `
  --member="serviceAccount:nossa-maternidade-sa@${PROJECT_ID}.iam.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding gemini-api-key `
  --member="serviceAccount:nossa-maternidade-sa@${PROJECT_ID}.iam.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"
```

---

## 🎯 Passo a Passo da Implementação

### Método 1: Usando Interface do Cloud Code (Recomendado)

#### 1️⃣ Abrir Cloud Code

1. No VS Code, clique na barra lateral esquerda no ícone **Cloud Code** (☁️)
2. Ou abra a Command Palette: `Ctrl+Shift+P` → Digite "Cloud Code"

#### 2️⃣ Selecionar Projeto Google Cloud

1. Na sidebar do Cloud Code, clique em **"Select a Google Cloud Project"**
2. Escolha seu projeto da lista
3. Confirme a seleção

#### 3️⃣ Deploy para Cloud Run

**Opção A: Via Interface Gráfica**

1. Abra Command Palette (`Ctrl+Shift+P`)
2. Digite: `Cloud Code: Deploy to Cloud Run`
3. Selecione as configurações:
   - **Service name:** `nossa-maternidade-web`
   - **Region:** `us-central1`
   - **Platform:** `managed`
   - **Allow unauthenticated:** `Yes`
4. Clique em **"Deploy"**
5. Aguarde o build e deploy (pode levar 5-10 minutos)

**Opção B: Via Debug/Run (F5)**

1. Vá para a aba **Run and Debug** (`Ctrl+Shift+D`)
2. Selecione **"Cloud Code: Deploy to Cloud Run"** no dropdown
3. Pressione **F5** ou clique no botão ▶️ verde
4. O Cloud Code irá:
   - ✅ Build da aplicação web (`pnpm run build:web`)
   - ✅ Build da imagem Docker
   - ✅ Push para Google Container Registry
   - ✅ Deploy no Cloud Run
5. Acompanhe o progresso no terminal integrado

#### 4️⃣ Monitorar o Deploy

Durante o deploy, você verá:

```
Building image...
✓ Build completed
Pushing image to gcr.io/PROJECT_ID/nossa-maternidade-web...
✓ Image pushed
Deploying to Cloud Run...
✓ Service deployed
✓ Service URL: https://nossa-maternidade-web-xxxxx-uc.a.run.app
```

---

### Método 2: Usando Tasks do VS Code

#### 1️⃣ Pipeline Completo (Recomendado)

```powershell
# Executar task completa
# Ctrl+Shift+P → "Tasks: Run Task" → "Cloud Code: Full Deploy Pipeline"
```

Esta task executa em sequência:

1. ✅ Build da versão web do Expo
2. ✅ Build da imagem Docker
3. ✅ Push da imagem para GCR
4. ✅ Deploy no Cloud Run

#### 2️⃣ Tasks Individuais

Se preferir executar etapas separadamente:

```powershell
# 1. Build da web
pnpm run build:web

# 2. Build da imagem Docker (via task)
# Ctrl+Shift+P → "Tasks: Run Build Task" → "Cloud Code: Build Docker Image"

# 3. Push da imagem (via task)
# Ctrl+Shift+P → "Tasks: Run Task" → "Cloud Code: Push Docker Image"

# 4. Deploy (via task)
# Ctrl+Shift+P → "Tasks: Run Task" → "Cloud Code: Deploy to Cloud Run"
```

---

### Método 3: Usando Linha de Comando (PowerShell)

#### Deploy Manual Completo

```powershell
# Passo 1: Build da versão web
Write-Host "📦 Building web version..." -ForegroundColor Cyan
pnpm run build:web

# Passo 2: Definir variáveis
$PROJECT_ID = gcloud config get-value project
$IMAGE_NAME = "gcr.io/$PROJECT_ID/nossa-maternidade-web"
$SERVICE_NAME = "nossa-maternidade-web"
$REGION = "us-central1"

# Passo 3: Build da imagem Docker
Write-Host "🐋 Building Docker image..." -ForegroundColor Cyan
docker build -t ${IMAGE_NAME}:latest .

# Passo 4: Push para Google Container Registry
Write-Host "☁️ Pushing to GCR..." -ForegroundColor Cyan
docker push ${IMAGE_NAME}:latest

# Passo 5: Deploy no Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME `
  --image ${IMAGE_NAME}:latest `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --max-instances 10 `
  --memory 512Mi `
  --timeout 300 `
  --set-env-vars "EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co" `
  --set-secrets "EXPO_PUBLIC_SUPABASE_ANON_KEY=supabase-anon-key:latest,EXPO_PUBLIC_GEMINI_API_KEY=gemini-api-key:latest"

# Passo 6: Obter URL do serviço
Write-Host "✅ Deployment complete!" -ForegroundColor Green
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)"
Write-Host "🌐 Service URL: $SERVICE_URL" -ForegroundColor Yellow
Start-Process $SERVICE_URL
```

#### Script Simplificado

Ou use o script npm existente:

```powershell
# Deploy usando gcloud direto
pnpm run deploy:cloud-run

# Verificar status
gcloud run services list --platform managed

# Ver logs
gcloud run services logs read nossa-maternidade-web --region us-central1
```

---

## 🔍 Monitoramento e Debug

### Visualizar Logs em Tempo Real

**Via Cloud Code:**

1. Na sidebar do Cloud Code, expanda **"Cloud Run"**
2. Clique com botão direito em `nossa-maternidade-web`
3. Selecione **"Stream Logs"**

**Via CLI:**

```powershell
# Logs em tempo real
gcloud run services logs tail nossa-maternidade-web --region us-central1

# Logs das últimas 100 linhas
gcloud run services logs read nossa-maternidade-web --region us-central1 --limit 100

# Filtrar por severity
gcloud run services logs read nossa-maternidade-web --region us-central1 --log-filter="severity>=ERROR"
```

### Acessar Cloud Console

```powershell
# Abrir serviço no Cloud Console
$PROJECT_ID = gcloud config get-value project
Start-Process "https://console.cloud.google.com/run/detail/us-central1/nossa-maternidade-web?project=$PROJECT_ID"
```

### Debug Remoto (Avançado)

1. Configure breakpoints no código
2. Execute: `Ctrl+Shift+P` → `Cloud Code: Debug on Cloud Run`
3. Cloud Code irá:
   - Criar versão debug da imagem
   - Deploy temporário
   - Conectar debugger

---

## 🐛 Troubleshooting

### Problema: "Docker daemon not running"

**Solução:**

```powershell
# Iniciar Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Aguardar 30 segundos e verificar
Start-Sleep -Seconds 30
docker ps
```

### Problema: "gcloud not found"

**Solução:**

```powershell
# Reinstalar gcloud
.\scripts\install-gcloud.ps1

# Ou adicionar ao PATH manualmente
$env:Path += ";C:\Users\$env:USERNAME\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin"

# Verificar
gcloud --version
```

### Problema: "Permission denied" ao fazer push da imagem

**Solução:**

```powershell
# Reconfigurar autenticação Docker
gcloud auth configure-docker gcr.io

# Se ainda não funcionar, fazer login novamente
gcloud auth login
gcloud auth application-default login
```

### Problema: "Build failed" no Expo

**Solução:**

```powershell
# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules, .expo, dist
pnpm install
pnpm run build:web
```

### Problema: Deploy falha com "Project not found"

**Solução:**

```powershell
# Verificar e configurar projeto correto
gcloud projects list
gcloud config set project PROJECT_ID_CORRETO

# Atualizar em todos os arquivos de configuração
# .vscode/settings.json
# skaffold.yaml
# service.yaml
```

### Problema: "Insufficient permissions"

**Solução:**

```powershell
# Verificar permissões
gcloud projects get-iam-policy $(gcloud config get-value project)

# Adicionar role necessário (como owner do projeto)
$PROJECT_ID = gcloud config get-value project
$USER_EMAIL = gcloud config get-value account
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="user:$USER_EMAIL" `
  --role="roles/run.admin"
```

### Problema: Serviço não responde ou erro 502

**Verificações:**

1. **Porta correta:**

   - Dockerfile deve expor porta 8080
   - Nginx deve ouvir em porta 8080
   - Cloud Run espera porta 8080

2. **Health check:**

```powershell
# Testar localmente primeiro
docker build -t test-local .
docker run -p 8080:8080 test-local

# Abrir no navegador
Start-Process "http://localhost:8080"
```

3. **Logs de erro:**

```powershell
gcloud run services logs read nossa-maternidade-web --region us-central1 --limit 50
```

---

## 📊 Verificação Final

Após o deploy, verifique:

### ✅ Checklist de Sucesso

- [ ] Serviço está rodando: `gcloud run services list`
- [ ] URL retorna página web
- [ ] Não há erros nos logs
- [ ] Métricas aparecem no Cloud Console
- [ ] Autenticação Supabase funciona
- [ ] Chat com Gemini funciona

### 🔗 Links Úteis

```powershell
# URL do serviço
$SERVICE_URL = gcloud run services describe nossa-maternidade-web --region us-central1 --format "value(status.url)"
Write-Host "Service URL: $SERVICE_URL"

# Cloud Console
$PROJECT_ID = gcloud config get-value project
Write-Host "Console: https://console.cloud.google.com/run/detail/us-central1/nossa-maternidade-web?project=$PROJECT_ID"

# Logs
Write-Host "Logs: https://console.cloud.google.com/logs/query?project=$PROJECT_ID"
```

---

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. **Configurar CI/CD:** Use `cloudbuild.yaml` para deploys automáticos
2. **Configurar domínio customizado:** Mapear domínio próprio
3. **Configurar HTTPS/SSL:** Certificado automático do Cloud Run
4. **Monitoramento:** Cloud Monitoring e Alertas
5. **Load testing:** Testar com carga real

---

## 📚 Recursos Adicionais

- [Cloud Code Documentation](https://cloud.google.com/code/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Skaffold Documentation](https://skaffold.dev/docs/)

---

**🚀 Bom deploy!**
