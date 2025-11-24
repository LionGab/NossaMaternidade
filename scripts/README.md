# Scripts de Deploy - Cloud Run

Scripts auxiliares para deploy no Google Cloud Run.

## Scripts Disponíveis

### check-gcloud.ps1
Verifica se o Google Cloud SDK está instalado e configurado.

```powershell
.\scripts\check-gcloud.ps1
# Ou via npm:
npm run check:gcloud
```

### install-gcloud.ps1
Instala o Google Cloud SDK automaticamente (requer Admin).

```powershell
# Execute PowerShell como Administrador
.\scripts\install-gcloud.ps1
# Ou via npm:
npm run install:gcloud
```

### setup-cloud-run.ps1
Setup automático do ambiente Cloud Run.

```powershell
.\scripts\setup-cloud-run.ps1 -ProjectId SEU_PROJECT_ID
# Ou via npm:
npm run setup:cloud-run -- -ProjectId SEU_PROJECT_ID
```

### deploy-without-gcloud.ps1
Mostra alternativas de deploy sem precisar do gcloud CLI.

```powershell
.\scripts\deploy-without-gcloud.ps1
# Ou via npm:
npm run deploy:alternatives
```

## Alternativas sem gcloud CLI

Se você não quiser instalar o gcloud CLI, use:

1. **Cloud Code no VS Code** (Recomendado)
   - Instale a extensão Cloud Code
   - Use a interface visual para deploy

2. **Google Cloud Console**
   - Acesse: https://console.cloud.google.com/run
   - Crie um novo serviço
   - Faça upload do Dockerfile

3. **GitHub Actions** (CI/CD)
   - Configure workflow para deploy automático
   - Veja exemplo em `.github/workflows/deploy.yml` (se existir)

## Troubleshooting

### "gcloud não é reconhecido"
- Instale o Google Cloud SDK (veja `check-gcloud.ps1`)
- Ou use Cloud Code no VS Code

### Erro de autenticação
```powershell
gcloud auth login
```

### Erro de projeto
```powershell
gcloud config set project SEU_PROJECT_ID
```

