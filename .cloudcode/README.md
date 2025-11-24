# Cloud Code Configuration

Este diretório contém as configurações do Cloud Code para deploy no Google Cloud.

## Arquivos

- `settings.json` - Configurações do Cloud Code (projeto, deploy, build)

## Uso Rápido

1. **Instalar Cloud Code** no VS Code ou IntelliJ
2. **Conectar ao Google Cloud** via Command Palette
3. **Deploy**: `Cloud Code: Deploy to Cloud Run`
4. **Selecionar**: `service.yaml`

## Configuração

Antes do primeiro deploy, edite `service.yaml`:
- Substitua `PROJECT_ID` pelo seu ID do projeto Google Cloud
- Configure secrets no Google Secret Manager
- Ajuste região se necessário

Veja `CLOUD_CODE_SETUP.md` na raiz do projeto para guia completo.

