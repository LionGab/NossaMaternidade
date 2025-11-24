# 🚀 Quick Start - Deploy no Cloud Run

Guia rápido para fazer deploy sem complicações.

## ⚡ Opção Mais Rápida (Recomendada)

### Cloud Code no VS Code - SEM precisar instalar gcloud CLI

1. **Instalar extensão Cloud Code:**
   ```bash
   code --install-extension GoogleCloudTools.cloudcode
   ```

2. **Abrir projeto:**
   ```bash
   code .
   ```

3. **Deploy:**
   - Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
   - Digite: `Cloud Code: Sign in to Google Cloud`
   - Faça login com sua conta Google Cloud
   - Depois: `Cloud Code: Deploy to Cloud Run`
   - Selecione `service.yaml`

**Pronto!** 🎉 Não precisa instalar nada além da extensão.

---

## 🔧 Se Preferir Usar CLI

### 1. Verificar se gcloud está instalado

```powershell
npm run check:gcloud
# Ou:
.\scripts\check-gcloud.ps1
```

### 2. Se não estiver instalado

**Opção A: Instalação automática (Windows - Requer Admin)**
```powershell
npm run install:gcloud
# Ou:
.\scripts\install-gcloud.ps1
```

**Opção B: Instalador manual**
- Baixe: https://cloud.google.com/sdk/docs/install
- Execute o instalador
- Reinicie o terminal

**Opção C: Chocolatey**
```powershell
choco install gcloudsdk
```

### 3. Configurar

```powershell
npm run setup:cloud-run -- -ProjectId SEU_PROJECT_ID
# Ou:
.\scripts\setup-cloud-run.ps1 -ProjectId SEU_PROJECT_ID
```

### 4. Deploy

```powershell
npm run deploy:cloud-run
```

---

## 📋 Ver Alternativas

Se não quiser instalar o gcloud CLI:

```powershell
npm run deploy:alternatives
# Ou:
.\scripts\deploy-without-gcloud.ps1
```

Isso mostra todas as opções disponíveis.

---

## 🆘 Problemas?

### "gcloud não é reconhecido"
- Execute: `npm run check:gcloud` para verificar
- Ou use Cloud Code (não precisa do gcloud)

### "Permission denied"
- Verifique se está autenticado: `gcloud auth login`
- Verifique projeto: `gcloud config get-value project`

### Erro no build
- Verifique se Node.js 20 está instalado
- Verifique se pnpm está instalado: `pnpm --version`

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `CLOUD_CODE_SETUP.md` - Guia completo
- `scripts/README.md` - Documentação dos scripts

