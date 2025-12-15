# ⚡ Quick Start - Deploy Rápido

Guia rápido para quem já tem tudo configurado e só quer fazer o deploy.

## 🚀 Passos Rápidos

### 1. Verificar Pré-requisitos

```bash
# Instalar EAS CLI (se ainda não tiver)
npm install -g eas-cli

# Login no EAS
eas login

# Verificar login
eas whoami
```

### 2. Configurar Secrets no EAS

```bash
# Configure os secrets necessários:
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://seu-projeto.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sua-chave"
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "xai-..."
```

### 3. Validar Projeto

```bash
# Verificar se está tudo OK
npm run check-build-ready
npm run typecheck
```

### 4. Build

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Ou ambos
eas build --platform all --profile production
```

### 5. Submeter

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

## 📋 Checklist Mínimo

- [ ] EAS CLI instalado e logado
- [ ] Secrets configurados (veja `docs/SECRETS_SETUP.md`)
- [ ] Screenshots criados
- [ ] Apps criados nas lojas (App Store Connect + Play Console)
- [ ] Builds concluídas
- [ ] Builds submetidas

## 📚 Documentação Completa

Para guia detalhado passo a passo, veja:
- **`docs/PASSO_A_PASSO_DEPLOY.md`** - Guia completo e detalhado
- **`DEPLOY_STORES.md`** - Guia de referência
- **`docs/DEPLOYMENT_CHECKLIST.md`** - Checklist completo
