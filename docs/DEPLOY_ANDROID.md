# 🚀 Guia Completo de Deploy Android

Guia passo a passo para fazer deploy do app Nossa Maternidade na Google Play Store.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Validação Pré-Build](#validação-pré-build)
4. [Build Local](#build-local)
5. [Deploy Automatizado (CI/CD)](#deploy-automatizado-cicd)
6. [Deep Links](#deep-links)
7. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Contas e Serviços Necessários

- ✅ **Conta Google Play Console** ($25 taxa única)
- ✅ **Conta Expo** (gratuita)
- ✅ **EAS CLI** instalado globalmente
- ✅ **Node.js 20.11.1+** instalado
- ✅ **Variáveis de ambiente** configuradas (`.env`)

### Instalação do EAS CLI

```bash
npm install -g eas-cli
eas login
```

---

## Configuração Inicial

### 1. Configurar EAS Project

```bash
# Inicializar projeto EAS (se ainda não feito)
eas init

# O EAS_PROJECT_ID será gerado e adicionado ao app.config.js
```

### 2. Configurar Google Play Service Account

1. Acesse [Google Play Console](https://play.google.com/console)
2. Vá em **Configurações** > **Acesso à API**
3. Clique em **Criar conta de serviço**
4. Baixe o arquivo JSON da conta de serviço
5. Renomeie para `google-play-service-account.json`
6. Coloque na raiz do projeto
7. **⚠️ IMPORTANTE**: O arquivo está no `.gitignore` e não será commitado

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz:

```env
# Supabase (obrigatório)
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto.supabase.co/functions/v1

# Gemini AI (opcional)
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini

# EAS Project ID
EAS_PROJECT_ID=seu_project_id
```

---

## Validação Pré-Build

Antes de fazer build, sempre valide a configuração:

```bash
npm run validate:android
```

O script verifica:
- ✅ Variáveis de ambiente obrigatórias
- ✅ Configuração Android em `app.config.js`
- ✅ Assets necessários (ícones, splash screens)
- ✅ Configuração EAS (`eas.json`)
- ✅ Service account key (se configurado)

### Preparar Assets

```bash
npm run prepare:assets
```

Isso cria a estrutura de diretórios para screenshots e valida assets existentes.

---

## Build Local

### Build de Produção

```bash
npm run build:android
```

Ou diretamente com EAS:

```bash
eas build --platform android --profile production
```

### Build de Preview (Teste Interno)

```bash
npm run build:preview
# ou
eas build --platform android --profile preview
```

### Monitorar Build

O EAS fornece um link para acompanhar o progresso do build. O build leva aproximadamente 15-30 minutos.

---

## Deploy Automatizado (CI/CD)

### Configurar Secrets no GitHub

Vá em **Settings** > **Secrets and variables** > **Actions** e adicione:

#### Secrets Obrigatórios

- `EAS_TOKEN` - Token do Expo (gerar em https://expo.dev/accounts/[sua-conta]/settings/access-tokens)
- `EXPO_PUBLIC_SUPABASE_URL` - URL do Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase

#### Secrets Opcionais

- `EXPO_PUBLIC_GEMINI_API_KEY` - Chave da API Gemini
- `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL` - URL das Edge Functions
- `EAS_PROJECT_ID` - ID do projeto EAS
- `GOOGLE_PLAY_SERVICE_ACCOUNT` - Conteúdo do arquivo `google-play-service-account.json` (JSON completo)

### Workflows Disponíveis

#### 1. Android Build (`android-build.yml`)

**Triggers:**
- Push para `main` ou `develop`
- Pull requests
- Manual (workflow_dispatch)

**O que faz:**
- Valida configuração
- Faz build Android no EAS
- Comenta no PR com status

#### 2. Android Submit (`android-submit.yml`)

**Triggers:**
- Push de tag `v*.*.*` (ex: `v1.0.0`)
- Manual (workflow_dispatch)

**O que faz:**
- Submete build mais recente para Google Play
- Cria release no GitHub

### Fluxo de Deploy Automatizado

1. **Desenvolvimento**: Push para branch `develop` → Build preview
2. **Teste**: Merge para `main` → Build production
3. **Release**: Criar tag `v1.0.0` → Build + Submit automático

```bash
# Criar tag e fazer release
git tag v1.0.0
git push origin v1.0.0
```

---

## Deep Links

### Configuração Atual

O app já está configurado para receber deep links de `nossamaternidade.com.br` em `app.config.js`:

```javascript
intentFilters: [
  {
    action: 'VIEW',
    autoVerify: true,
    data: [
      {
        scheme: 'https',
        host: 'nossamaternidade.com.br',
        pathPrefix: '/',
      },
    ],
    category: ['BROWSABLE', 'DEFAULT'],
  },
],
```

### Configurar Asset Links no Domínio

1. **Obter SHA-256 Fingerprint do App**

Após o primeiro build, execute:

```bash
# Obter fingerprint do keystore
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Ou use o fingerprint do build de produção (disponível no EAS após build).

2. **Criar arquivo `assetlinks.json`**

No servidor web do domínio `nossamaternidade.com.br`, crie:

```
https://nossamaternidade.com.br/.well-known/assetlinks.json
```

Com o conteúdo (substitua o fingerprint):

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.nossamaternidade.app",
      "sha256_cert_fingerprints": [
        "SEU_SHA256_FINGERPRINT_AQUI"
      ]
    }
  }
]
```

3. **Validar Asset Links**

Use a ferramenta do Google:
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://nossamaternidade.com.br&relation=delegate_permission/common.handle_all_urls

Ou teste localmente:

```bash
adb shell pm get-app-links com.nossamaternidade.app
```

### Testar Deep Links

```bash
# Testar deep link
adb shell am start -a android.intent.action.VIEW \
  -d "https://nossamaternidade.com.br/chat" \
  com.nossamaternidade.app
```

---

## Submit Manual para Google Play

Se preferir fazer submit manualmente:

```bash
npm run submit:android
```

Ou:

```bash
eas submit --platform android --profile production
```

### Tracks Disponíveis

- **internal** - Teste interno (até 100 testadores)
- **alpha** - Teste fechado (até 2000 testadores)
- **beta** - Teste aberto (ilimitado)
- **production** - Produção (público)

---

## Checklist Pré-Deploy

Antes de fazer deploy para produção, verifique:

### Configuração
- [ ] `eas.json` configurado corretamente
- [ ] `app.config.js` com package name correto
- [ ] Variáveis de ambiente configuradas
- [ ] Service account key configurado (para submit automático)

### Assets
- [ ] Ícone do app (1024x1024px)
- [ ] Adaptive icon (1024x1024px)
- [ ] Splash screen
- [ ] Screenshots Android (mínimo 2, 1080x1920px)
- [ ] Feature graphic (1024x500px)

### Build
- [ ] Build de produção testado localmente
- [ ] Version code incrementado (ou autoIncrement habilitado)
- [ ] Release notes preparadas

### Google Play Console
- [ ] App criado na Google Play Console
- [ ] Informações da loja preenchidas
- [ ] Política de privacidade publicada
- [ ] Classificação de conteúdo (IARC) respondida
- [ ] Data Safety preenchido

---

## Troubleshooting

### Erro: "Service account key not found"

**Solução:**
1. Verifique se `google-play-service-account.json` existe na raiz
2. Verifique se o arquivo está no `.gitignore` (não deve ser commitado)
3. Para CI/CD, configure o secret `GOOGLE_PLAY_SERVICE_ACCOUNT` no GitHub

### Erro: "EAS_PROJECT_ID not found"

**Solução:**
```bash
eas init
# Isso criará o project ID e adicionará ao app.config.js
```

### Erro: "Build failed - Invalid package name"

**Solução:**
- Verifique se o package name em `app.config.js` segue o padrão: `com.nossamaternidade.app`
- Não use caracteres especiais ou espaços

### Erro: "Deep links not working"

**Solução:**
1. Verifique se `assetlinks.json` está acessível em `https://nossamaternidade.com.br/.well-known/assetlinks.json`
2. Verifique se o SHA-256 fingerprint está correto
3. Aguarde até 24h para propagação do DNS
4. Teste com `adb` para verificar se o app está verificando os links

### Build muito lento

**Solução:**
- Use `resourceClass: "l"` no `eas.json` (já configurado)
- Limpe cache: `eas build --clear-cache`
- Verifique se há builds em fila no EAS

### Erro: "Version code already exists"

**Solução:**
- Habilite `autoIncrement: true` no `eas.json` (já configurado)
- Ou incremente manualmente o `versionCode` em `app.config.js`

---

## Comandos Úteis

```bash
# Validar configuração
npm run validate:android

# Preparar assets
npm run prepare:assets

# Build produção
npm run build:android

# Build preview
npm run build:preview

# Submit para Google Play
npm run submit:android

# Ver builds recentes
eas build:list --platform android

# Ver detalhes de um build
eas build:view [BUILD_ID]

# Atualização OTA (sem rebuild)
npm run update "Mensagem da atualização"
```

---

## Recursos Adicionais

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Android App Links](https://developer.android.com/training/app-links)
- [Expo Submit](https://docs.expo.dev/submit/introduction/)

---

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do Expo
- Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: Dezembro 2024

