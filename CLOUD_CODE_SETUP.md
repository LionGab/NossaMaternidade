# 🚀 Guia de Configuração Cloud Code - Google Cloud

Este guia explica como configurar e fazer deploy do aplicativo **Nossa Maternidade** no Google Cloud usando Cloud Code.

## 📋 Pré-requisitos

1. **Google Cloud Account** com projeto criado
2. **Cloud Code** instalado no VS Code ou IntelliJ IDEA
3. **Google Cloud SDK** (`gcloud`) instalado e configurado
4. **Docker** instalado (para builds locais)

## 🔧 Configuração Inicial

### 1. Instalar Cloud Code

**VS Code:**
```bash
# Instalar extensão Cloud Code no VS Code
code --install-extension GoogleCloudTools.cloudcode
```

**IntelliJ IDEA:**
- Instalar plugin "Cloud Code" via Marketplace

### 2. Instalar Google Cloud SDK (Windows)

**Opção A: Instalador Oficial (Recomendado)**
1. Baixe: https://cloud.google.com/sdk/docs/install
2. Execute o instalador
3. Reinicie o terminal

**Opção B: PowerShell (Como Administrador)**
```powershell
# Baixar instalador
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")

# Executar instalador
Start-Process "$env:Temp\GoogleCloudSDKInstaller.exe"
```

**Opção C: Chocolatey**
```powershell
choco install gcloudsdk
```

**Verificar instalação:**
```powershell
# Executar script de verificação
.\scripts\check-gcloud.ps1
```

### 3. Configurar Google Cloud

**Setup Automático (Windows):**
```powershell
# Executar script de setup
.\scripts\setup-cloud-run.ps1 -ProjectId SEU_PROJECT_ID
```

**Ou Manualmente:**
```bash
# Login no Google Cloud
gcloud auth login

# Configurar projeto
gcloud config set project SEU_PROJECT_ID

# Habilitar APIs necessárias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 3. Configurar Secrets no Google Cloud

As variáveis sensíveis devem ser armazenadas como secrets:

```bash
# Criar secret para Supabase Anon Key
echo -n "sua_chave_anon_aqui" | gcloud secrets create supabase-anon-key --data-file=-

# Criar secret para Gemini API Key
echo -n "sua_chave_gemini_aqui" | gcloud secrets create gemini-api-key --data-file=-

# Dar permissão ao Cloud Run service account
PROJECT_NUMBER=$(gcloud projects describe SEU_PROJECT_ID --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding supabase-anon-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 4. Atualizar service.yaml

Edite `service.yaml` e substitua:
- `PROJECT_ID` pelo seu ID do projeto Google Cloud
- Ajuste a região se necessário (`us-central1`)

## 🚀 Deploy via Cloud Code

### Método 1: VS Code (Recomendado)

1. **Abrir projeto no VS Code**
   ```bash
   code .
   ```

2. **Conectar ao Google Cloud**
   - Abrir Command Palette (`Ctrl+Shift+P` ou `Cmd+Shift+P`)
   - Digitar: `Cloud Code: Sign in to Google Cloud`
   - Selecionar sua conta e projeto

3. **Deploy no Cloud Run**
   - Command Palette → `Cloud Code: Deploy to Cloud Run`
   - Selecionar `service.yaml`
   - Aguardar build e deploy

### Método 2: IntelliJ IDEA

1. **Abrir projeto**
2. **Cloud Code → Deploy to Cloud Run**
3. **Selecionar `service.yaml`**
4. **Aguardar deploy**

### Método 3: CLI (gcloud)

**Windows PowerShell:**
```powershell
# Build e deploy em um comando (usa --source)
gcloud run deploy nossa-maternidade-web `
  --source . `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated

# Ou via npm script
npm run deploy:cloud-run
```

**Linux/Mac:**
```bash
# Build da imagem
gcloud builds submit --tag gcr.io/SEU_PROJECT_ID/nossa-maternidade-web

# Deploy no Cloud Run
gcloud run deploy nossa-maternidade-web \
  --image gcr.io/SEU_PROJECT_ID/nossa-maternidade-web \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

## 🔄 CI/CD com Cloud Build

Para automatizar deploys via Git:

### 1. Conectar Repositório

```bash
# Criar trigger do Cloud Build
gcloud builds triggers create github \
  --repo-name=SEU_REPO \
  --repo-owner=SEU_USUARIO \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 2. Deploy Automático

A cada push na branch `main`, o Cloud Build irá:
1. Buildar a aplicação web
2. Criar imagem Docker
3. Fazer push para Container Registry
4. Deployar no Cloud Run

## 📝 Estrutura de Arquivos

```
.
├── Dockerfile              # Configuração do container
├── nginx.conf              # Configuração do servidor web
├── service.yaml            # Configuração do Cloud Run
├── cloudbuild.yaml         # Configuração do Cloud Build
├── .gcloudignore          # Arquivos ignorados no deploy
└── .cloudcode/
    └── settings.json       # Configurações do Cloud Code
```

## 🔍 Verificação e Monitoramento

### Ver logs do Cloud Run

```bash
# Via CLI
gcloud run services logs read nossa-maternidade-web --region us-central1

# Via Cloud Code
Command Palette → Cloud Code: View Cloud Run Logs
```

### Verificar status do serviço

```bash
gcloud run services describe nossa-maternidade-web --region us-central1
```

### Acessar aplicação

Após o deploy, você receberá uma URL:
```
https://nossa-maternidade-web-XXXXX-uc.a.run.app
```

## 🐛 Troubleshooting

### Erro: "gcloud não é reconhecido" (Windows)

**Solução 1: Instalar Google Cloud SDK**
```powershell
# Verificar instalação
.\scripts\check-gcloud.ps1

# Se não instalado, siga as instruções exibidas
```

**Solução 2: Usar Cloud Code (sem gcloud CLI)**
- Instale extensão Cloud Code no VS Code
- Use interface visual para deploy
- Não requer gcloud CLI instalado

**Solução 3: Usar scripts PowerShell**
```powershell
# Setup automático
.\scripts\setup-cloud-run.ps1 -ProjectId SEU_PROJECT_ID
```

### Erro: "Permission denied"
```bash
# Verificar permissões do service account
gcloud projects get-iam-policy SEU_PROJECT_ID
```

### Erro: "Image not found"
```bash
# Verificar se a imagem foi criada
gcloud container images list --repository=gcr.io/SEU_PROJECT_ID
```

### Erro: "Secret not found"
```bash
# Verificar secrets criados
gcloud secrets list

# Verificar permissões
gcloud secrets get-iam-policy supabase-anon-key
```

### Build falha no Dockerfile

Verifique se:
- Node.js 20 está disponível
- pnpm está instalado
- Variáveis de ambiente estão configuradas
- Diretório `dist/` foi criado após build

### Erro no Windows PowerShell com backticks

Se o comando `gcloud run deploy` falhar no PowerShell:
```powershell
# Use aspas simples ou escape correto
gcloud run deploy nossa-maternidade-web --source . --region us-central1 --allow-unauthenticated

# Ou use o script npm
npm run deploy:cloud-run
```

## 📚 Recursos Adicionais

- [Documentação Cloud Code](https://cloud.google.com/code/docs)
- [Documentação Cloud Run](https://cloud.google.com/run/docs)
- [Documentação Cloud Build](https://cloud.google.com/build/docs)
- [Expo Web Deployment](https://docs.expo.dev/workflow/web/)

## 🔐 Segurança

⚠️ **Importante:**
- Nunca commite secrets no repositório
- Use Google Secret Manager para variáveis sensíveis
- Configure IAM adequadamente
- Use HTTPS sempre (Cloud Run já fornece)

## 🎯 Próximos Passos

1. Configurar domínio customizado
2. Configurar CDN (Cloud CDN)
3. Configurar monitoramento (Cloud Monitoring)
4. Configurar alertas
5. Otimizar performance e custos

