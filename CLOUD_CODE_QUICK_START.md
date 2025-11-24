# 🎯 Guia Rápido - Cloud Code Deploy

## 🚀 Deploy em 3 Passos

### 1️⃣ Pré-requisitos Rápidos

```powershell
# Instalar Cloud Code no VS Code
code --install-extension GoogleCloudTools.cloudcode

# Verificar ferramentas
.\scripts\check-gcloud.ps1

# Configurar projeto
gcloud config set project SEU_PROJECT_ID
gcloud auth configure-docker gcr.io
```

### 2️⃣ Configurar Projeto

**Editar 3 arquivos com seu PROJECT_ID:**

1. `.vscode/settings.json` (linha 2)
2. `skaffold.yaml` (linhas 28, 58, 68, 80, 91)
3. `service.yaml` (linha 27, 29)

**Buscar e substituir:**

```
PROJECT_ID → seu-project-id-real
```

### 3️⃣ Deploy

**Método 1: Via Interface (Mais Fácil)**

```
1. Pressione F5
2. Escolha: "Cloud Code: Deploy to Cloud Run"
3. Aguarde 5-10 minutos
4. Acesse a URL gerada
```

**Método 2: Via Task**

```
Ctrl+Shift+P → Tasks: Run Task → Cloud Code: Full Deploy Pipeline
```

**Método 3: Via Terminal**

```powershell
pnpm run deploy:cloud-run
```

---

## 🔧 Comandos Úteis

```powershell
# Ver logs em tempo real
gcloud run services logs tail nossa-maternidade-web --region us-central1

# Ver serviços
gcloud run services list

# Obter URL
gcloud run services describe nossa-maternidade-web --region us-central1 --format="value(status.url)"

# Deletar serviço
gcloud run services delete nossa-maternidade-web --region us-central1
```

---

## ⚠️ Troubleshooting Rápido

| Problema                | Solução                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| Docker não está rodando | Abrir Docker Desktop                                                      |
| gcloud not found        | `.\scripts\install-gcloud.ps1`                                            |
| Permission denied       | `gcloud auth login`                                                       |
| Build failed            | Limpar: `Remove-Item -Recurse node_modules, .expo, dist` → `pnpm install` |

---

## 📚 Documentação Completa

Para guia detalhado, ver: **`CLOUD_CODE_IMPLEMENTATION.md`**

---

## ✅ Checklist Final

- [ ] Cloud Code instalado
- [ ] gcloud configurado
- [ ] Docker rodando
- [ ] PROJECT_ID atualizado nos arquivos
- [ ] APIs habilitadas no GCP
- [ ] Secrets criados (opcional)
- [ ] Deploy executado com sucesso
- [ ] URL acessível

**🎉 Pronto! Seu app está no Cloud Run!**
