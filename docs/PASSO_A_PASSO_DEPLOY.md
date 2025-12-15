# 🚀 Passo a Passo Completo - Deploy nas Stores

Este documento contém **TODOS os passos necessários** para fazer o deploy do app Nossa Maternidade na App Store (iOS) e Google Play Store (Android), na ordem correta de execução.

---

## 📋 Índice

1. [Pré-requisitos e Contas](#1-pré-requisitos-e-contas)
2. [Configuração de Secrets no EAS](#2-configuração-de-secrets-no-eas)
3. [Preparação de Assets](#3-preparação-de-assets)
4. [Configuração das Lojas](#4-configuração-das-lojas)
5. [Build de Produção](#5-build-de-produção)
6. [Submissão para Review](#6-submissão-para-review)
7. [Pós-Deploy e Monitoramento](#7-pós-deploy-e-monitoramento)

---

## 1. Pré-requisitos e Contas

### 1.1 Criar Contas Necessárias

#### Apple Developer Account
- **Custo:** $99/ano
- **Link:** [developer.apple.com](https://developer.apple.com)
- **Tempo:** 24-48 horas para aprovação
- **Ação:**
  1. Acesse o site
  2. Clique em "Enroll"
  3. Preencha dados pessoais/empresa
  4. Aguarde aprovação por email

#### Google Play Console
- **Custo:** $25 (único, não recorrente)
- **Link:** [play.google.com/console](https://play.google.com/console)
- **Tempo:** Imediato após pagamento
- **Ação:**
  1. Acesse o site
  2. Clique em "Criar conta"
  3. Pague a taxa única
  4. Preencha dados da conta

#### EAS Account (Expo)
- **Custo:** Gratuito (plano básico)
- **Link:** [expo.dev](https://expo.dev)
- **Tempo:** Imediato
- **Ação:**
  1. Acesse o site
  2. Crie conta com GitHub/Google
  3. Confirme email

### 1.2 Instalar Ferramentas

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Verificar instalação
eas --version

# Login no EAS
eas login

# Verificar login
eas whoami
```

**✅ Checkpoint:** Você deve estar logado no EAS e ver seu email/username.

---

## 2. Configuração de Secrets no EAS

### 2.1 Lista de Secrets Obrigatórios

Você precisa configurar os seguintes secrets no EAS:

```bash
# Supabase (obrigatório)
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL

# APIs de IA (obrigatório)
EXPO_PUBLIC_OPENAI_API_KEY
EXPO_PUBLIC_GROK_API_KEY

# Feature Flags (opcional, mas recomendado)
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=false
```

### 2.2 Como Obter os Valores

#### Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Entre no seu projeto
3. Vá em **Settings > API**
4. Copie:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **Project URL + /functions/v1** → `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL`

#### OpenAI
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Vá em **API Keys**
3. Crie uma nova chave ou copie existente
4. Formato: `sk-...`

#### Grok (X.AI)
1. Acesse [x.ai](https://x.ai)
2. Vá em **API Keys**
3. Crie uma nova chave
4. Formato: `xai-...`

### 2.3 Configurar Secrets no EAS

Execute os comandos abaixo **um por um**, substituindo os valores:

```bash
# 1. Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://seu-projeto.supabase.co"

# 2. Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sua-chave-anon-aqui"

# 3. Supabase Functions URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://seu-projeto.supabase.co/functions/v1"

# 4. OpenAI API Key
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-sua-chave-aqui"

# 5. Grok API Key (opcional)
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "xai-sua-chave-aqui"

# 6. Feature Flags (opcional)
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value "true"
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_ANALYTICS --value "true"
```

### 2.4 Verificar Secrets Configurados

```bash
# Listar todos os secrets
eas secret:list

# Ver valor de um secret específico (sem mostrar o valor completo por segurança)
eas secret:get EXPO_PUBLIC_SUPABASE_URL
```

**✅ Checkpoint:** Todos os secrets devem aparecer na lista.

---

## 3. Preparação de Assets

### 3.1 Assets Já Existentes

Estes assets já estão criados:
- ✅ `assets/icon.png` (1024×1024px)
- ✅ `assets/splash.png`
- ✅ `assets/adaptive-icon.png` (Android)

### 3.2 Assets que Precisam ser Criados

#### Screenshots iOS (OBRIGATÓRIO)

**Tamanhos necessários:**
- **iPhone 6.7"** (1290×2796px) - mínimo 3 screenshots
- **iPhone 6.5"** (1284×2778px) - mínimo 3 screenshots
- **iPhone 5.5"** (1242×2208px) - mínimo 3 screenshots

**Telas para capturar:**
1. Onboarding/Welcome
2. Home/Feed principal
3. Chat com IA (NathIA)
4. Comunidade (Mães Valente)
5. Hábitos/Tracking

**Como criar:**
```bash
# Opção 1: Simulador iOS (requer Mac)
# 1. Abrir Xcode
# 2. Abrir Simulator
# 3. Escolher iPhone 15 Pro Max (6.7")
# 4. Executar app: npm run ios
# 5. Navegar para cada tela
# 6. Cmd + S para salvar screenshot
# 7. Repetir para outros tamanhos

# Opção 2: Dispositivo físico
# 1. Instalar app no iPhone
# 2. Navegar para cada tela
# 3. Capturar screenshot (botões laterais)
# 4. Ajustar tamanho no Photoshop/Figma se necessário
```

#### Screenshots Android (OBRIGATÓRIO)

**Tamanho necessário:**
- **Phone** (1080×1920px) - mínimo 2, máximo 8 screenshots

**Telas para capturar:**
- Mesmas 5 telas do iOS

**Como criar:**
```bash
# Opção 1: Emulador Android
# 1. Abrir Android Studio
# 2. Abrir AVD Manager
# 3. Criar/abrir emulador Pixel 7 Pro
# 4. Executar app: npm run android
# 5. Navegar para cada tela
# 6. Screenshot button ou Ctrl+S

# Opção 2: Dispositivo físico
# 1. Instalar app no Android
# 2. Navegar para cada tela
# 3. Capturar screenshot (botões de volume + power)
```

#### Feature Graphic Android (OBRIGATÓRIO)

**Especificações:**
- **Tamanho:** 1024×500px
- **Formato:** PNG ou JPG
- **Peso máximo:** 1MB

**Conteúdo sugerido:**
- Logo do app centralizado
- Texto: "Nossa Maternidade - Sua jornada maternal com IA e comunidade"
- Cores do tema (Rose #E11D48)

**Como criar:**
- Use Figma, Canva ou Photoshop
- Template disponível em: `docs/STORE_ASSETS_GUIDE.md`

**✅ Checkpoint:** Todos os screenshots e feature graphic criados e salvos em pasta organizada.

---

## 4. Configuração das Lojas

### 4.1 App Store Connect (iOS)

#### 4.1.1 Criar App no App Store Connect

1. Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Faça login com Apple Developer Account
3. Vá em **My Apps**
4. Clique em **+** (criar novo app)
5. Preencha:
   - **Platform:** iOS
   - **Name:** Nossa Maternidade
   - **Primary Language:** Portuguese (Brazil)
   - **Bundle ID:** Selecione `com.nossamaternidade.app` (criar se não existir)
   - **SKU:** NOSSA_MATERNIDADE_2025
   - **User Access:** Full Access

#### 4.1.2 Configurar Informações do App

Vá em **App Information** e preencha:

- **Name:** Nossa Maternidade (30 caracteres max)
- **Subtitle:** Apoio emocional para mães (30 caracteres max)
- **Category:** Health & Fitness
- **Content Rights:** Marque "I have the rights to use this content"

#### 4.1.3 Configurar Pricing and Availability

- **Price:** Free
- **Availability:** All countries (ou selecione países específicos)

#### 4.1.4 Adicionar Screenshots

Vá em **App Store** > **iOS App** > **Screenshots**

1. **iPhone 6.7" Display:**
   - Arraste 3-5 screenshots (1290×2796px)

2. **iPhone 6.5" Display:**
   - Arraste 3-5 screenshots (1284×2778px)

3. **iPhone 5.5" Display:**
   - Arraste 3-5 screenshots (1242×2208px)

#### 4.1.5 Preencher Descrição

Vá em **App Store** > **iOS App** > **Description**

```
Nossa Maternidade é um espaço seguro e acolhedor para mães brasileiras.

✨ RECURSOS:
• NathIA - Assistente de maternidade pessoal com IA
• Comunidade Mães Valentes - Conecte-se com outras mães
• Rastreamento de hábitos e bem-estar
• Conteúdo educativo e inspiracional
• Suporte emocional 24/7

💙 Criado por mães, para mães.
```

#### 4.1.6 Configurar Keywords

Vá em **App Store**> **iOS App** > **Keywords**

```
maternidade, saúde, comunidade, apoio, bem-estar, mães, gravidez, pós-parto
```

#### 4.1.7 Configurar Classificação Etária

Vá em **App Store** > **iOS App** > **Age Rating**

- Responda o questionário
- Classificação esperada: **17+** (conteúdo sensível relacionado a saúde mental)

#### 4.1.8 Configurar URLs

Vá em **App Store** > **iOS App** > **App Information**

- **Privacy Policy URL:** https://nossamaternidade.com.br/privacidade
- **Support URL:** https://nossamaternidade.com.br/suporte

**✅ Checkpoint:** App criado no App Store Connect com todas as informações preenchidas.

### 4.2 Google Play Console (Android)

#### 4.2.1 Criar App no Play Console

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Faça login
3. Clique em **Criar app**
4. Preencha:
   - **Nome do app:** Nossa Maternidade
   - **Idioma padrão:** Português (Brasil)
   - **Tipo de app:** App
   - **Gratuito ou pago:** Gratuito
   - **Declaração de conformidade:** Marque as opções aplicáveis

#### 4.2.2 Configurar Informações da Listagem

Vá em **Crescer** > **Listagem na loja**

**Informações básicas:**
- **Nome do app:** Nossa Maternidade (50 caracteres max)
- **Descrição curta:** Apoio emocional e comunidade para mães brasileiras (80 caracteres max)
- **Descrição completa:**
```
Nossa Maternidade é um espaço seguro e acolhedor para mães brasileiras.

✨ RECURSOS:
• NathIA - Assistente de maternidade pessoal com IA
• Comunidade Mães Valentes - Conecte-se com outras mães
• Rastreamento de hábitos e bem-estar
• Conteúdo educativo e inspiracional
• Suporte emocional 24/7
• Diário emocional e check-ins
• Mundo Nath - Feed personalizado de conteúdo

💙 Criado por mães, para mães.

Conformidade LGPD ✅
```

#### 4.2.3 Adicionar Feature Graphic

Vá em **Crescer** > **Listagem na loja** > **Imagens**

1. **Feature Graphic:**
   - Faça upload de `feature-graphic.png` (1024×500px)

#### 4.2.4 Adicionar Screenshots

1. **Screenshots de telefone:**
   - Faça upload de 2-8 screenshots (1080×1920px)

#### 4.2.5 Configurar Categoria

Vá em **Crescer** > **Listagem na loja** > **Categorização**

- **Categoria:** Saúde e fitness
- **Tags:** Maternidade, Saúde, Comunidade

#### 4.2.6 Preencher Data Safety

Vá em **Política e programas** > **Data safety**

Responda o questionário sobre:
- Dados coletados
- Dados compartilhados
- Segurança de dados
- Práticas de privacidade

**Importante:** Seja transparente sobre dados coletados (LGPD).

#### 4.2.7 Configurar Classificação de Conteúdo

Vá em **Política e programas** > **Classificação de conteúdo**

- Responda o questionário IARC
- Classificação esperada: **PEGI 3 / Everyone**

#### 4.2.8 Configurar URLs

Vá em **Política e programas** > **Políticas do app**

- **URL da Política de Privacidade:** https://nossamaternidade.com.br/privacidade
- **URL de Suporte:** https://nossamaternidade.com.br/suporte

**✅ Checkpoint:** App criado no Play Console com todas as informações preenchidas.

---

## 5. Build de Produção

### 5.1 Validação Pré-Build

Antes de fazer o build, valide tudo:

```bash
# 1. Verificar prontidão
npm run check-build-ready

# 2. Verificar tipos TypeScript
npm run typecheck

# 3. Verificar lint
npm run lint
```

**✅ Checkpoint:** Todos os checks devem passar sem erros.

### 5.2 Build iOS

```bash
# Build para App Store
eas build --platform ios --profile production
```

**O que acontece:**
1. EAS valida configuração
2. Cria certificados e provisioning profiles (se necessário)
3. Faz build na nuvem (~20-30 minutos)
4. Gera arquivo `.ipa` para App Store

**Acompanhar progresso:**
- Link será exibido no terminal
- Ou acesse: [expo.dev/accounts/[seu-username]/builds](https://expo.dev)

**✅ Checkpoint:** Build iOS concluída com sucesso.

### 5.3 Build Android

```bash
# Build para Google Play (AAB)
eas build --platform android --profile production
```

**O que acontece:**
1. EAS valida configuração
2. Faz build na nuvem (~15-20 minutos)
3. Gera arquivo `.aab` (Android App Bundle) para Play Store

**Acompanhar progresso:**
- Link será exibido no terminal
- Ou acesse: [expo.dev/accounts/[seu-username]/builds](https://expo.dev)

**✅ Checkpoint:** Build Android concluída com sucesso.

### 5.4 Build Ambas as Plataformas (Opcional)

```bash
# Build iOS + Android simultaneamente
eas build --platform all --profile production
```

**Nota:** Isso pode demorar mais, mas é mais eficiente se você tem tempo.

### 5.5 Testar Builds (Recomendado)

Antes de submeter, teste os builds:

```bash
# Download do build iOS
# Link será exibido após build concluir
# Instalar via TestFlight ou dispositivo físico

# Download do build Android
# Link será exibido após build concluir
# Instalar via ADB ou compartilhar APK
```

**Testes a fazer:**
- [ ] App abre sem crashes
- [ ] Login/autenticação funciona
- [ ] Onboarding completo funciona
- [ ] Chat com IA funciona
- [ ] Comunidade funciona
- [ ] Hábitos funcionam
- [ ] Navegação fluida
- [ ] Permissões funcionam (câmera, microfone, etc.)

**✅ Checkpoint:** Builds testadas e funcionando corretamente.

---

## 6. Submissão para Review

### 6.1 Submeter iOS (App Store)

#### 6.1.1 Configurar Credenciais (Primeira Vez)

Se for a primeira submissão, você precisa configurar:

```bash
# Configurar credenciais iOS
eas credentials

# Seguir prompts:
# 1. Selecionar projeto
# 2. Selecionar iOS
# 3. Selecionar "production"
# 4. EAS vai criar certificados automaticamente
```

#### 6.1.2 Atualizar eas.json com IDs

Após criar o app no App Store Connect, atualize `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "SEU_APP_ID_AQUI",  // Encontre no App Store Connect
        "appleTeamId": "SEU_TEAM_ID_AQUI"  // Encontre no Apple Developer
      }
    }
  }
}
```

**Onde encontrar:**
- **ascAppId:** App Store Connect > My Apps > [Seu App] > App Information > Apple ID
- **appleTeamId:** [developer.apple.com/account](https://developer.apple.com/account) > Membership > Team ID

#### 6.1.3 Submeter Build

```bash
# Submeter build mais recente
eas submit --platform ios

# Ou submeter build específica
eas submit --platform ios --latest
```

**O que acontece:**
1. EAS faz upload do `.ipa` para App Store Connect
2. Build aparece em **App Store Connect > My Apps > [Seu App] > TestFlight**
3. Depois aparece em **Versions** para review

#### 6.1.4 Finalizar Submissão no App Store Connect

1. Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Vá em **My Apps** > **Nossa Maternidade**
3. Vá em **App Store** > **iOS App**
4. Clique em **+ Version** ou selecione versão existente
5. Selecione o build submetido
6. Preencha **What's New in This Version:**
   ```
   Primeira versão do Nossa Maternidade!
   
   • Chat com IA personalizado
   • Comunidade de mães
   • Rastreamento de hábitos
   • Conteúdo educativo
   ```
7. Revise todas as informações
8. Clique em **Submit for Review**

**✅ Checkpoint:** App submetido para review na App Store.

### 6.2 Submeter Android (Google Play)

#### 6.2.1 Configurar Service Account (Primeira Vez)

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto ou selecione existente
3. Vá em **IAM & Admin** > **Service Accounts**
4. Clique em **Create Service Account**
5. Preencha nome e descrição
6. Clique em **Create and Continue**
7. Role: **Editor** (ou mínimo necessário)
8. Clique em **Done**
9. Clique no service account criado
10. Vá em **Keys** > **Add Key** > **Create new key**
11. Escolha **JSON**
12. Baixe o arquivo JSON
13. Renomeie para `google-play-service-account.json`
14. Coloque na raiz do projeto
15. Adicione ao `.gitignore` (NUNCA commite este arquivo!)

#### 6.2.2 Conceder Acesso no Play Console

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Vá em **Setup** > **API access**
3. Clique em **Link service account**
4. Selecione o service account criado
5. Conceda acesso: **Admin (all permissions)**

#### 6.2.3 Submeter Build

```bash
# Submeter build mais recente
eas submit --platform android

# Ou submeter build específica
eas submit --platform android --latest
```

**O que acontece:**
1. EAS faz upload do `.aab` para Google Play Console
2. Build aparece em **Production** > **Releases** > **Create release**

#### 6.2.4 Finalizar Release no Play Console

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Vá em **Production** > **Releases** > **Create release**
3. Selecione o build submetido
4. Preencha **Release name:** `1.0.0`
5. Preencha **Release notes:**
   ```
   Primeira versão do Nossa Maternidade!
   
   • Chat com IA personalizado
   • Comunidade de mães
   • Rastreamento de hábitos
   • Conteúdo educativo
   ```
6. Revise todas as informações
7. Clique em **Review release**
8. Revise novamente
9. Clique em **Start rollout to Production**

**✅ Checkpoint:** App submetido para review no Google Play.

---

## 7. Pós-Deploy e Monitoramento

### 7.1 Acompanhar Review

#### App Store (iOS)
- **Tempo médio:** 24-48 horas
- **Acompanhar:** App Store Connect > My Apps > [Seu App] > App Store > Status
- **Status possíveis:**
  - **Waiting for Review**
  - **In Review**
  - **Pending Developer Release**
  - **Ready for Sale** ✅
  - **Rejected** (se houver problemas)

#### Google Play (Android)
- **Tempo médio:** 2-24 horas
- **Acompanhar:** Play Console > Production > Releases
- **Status possíveis:**
  - **Draft**
  - **Pending publication**
  - **Published** ✅
  - **Rejected** (se houver problemas)

### 7.2 Responder a Problemas (Se Rejeitado)

#### App Store
- Leia o feedback em **Resolution Center**
- Corrija os problemas
- Refaça build se necessário
- Resubmeta

#### Google Play
- Leia o feedback em **Policy status**
- Corrija os problemas
- Refaça build se necessário
- Resubmeta

### 7.3 Configurar Monitoramento (Opcional mas Recomendado)

#### Sentry (Crash Reporting)
```bash
# Instalar Sentry
npm install @sentry/react-native

# Configurar (ver documentação Sentry)
# Adicionar DSN no app.json ou secrets
```

#### Analytics (Opcional)
- Firebase Analytics
- Amplitude
- Mixpanel

### 7.4 Atualizações OTA (Over-the-Air)

Após app publicado, você pode fazer atualizações sem rebuild:

```bash
# Publicar update OTA
eas update --branch production --message "Correções de bugs e melhorias"

# Ver status
eas update:list
```

**Nota:** OTA só funciona para JavaScript. Mudanças nativas requerem novo build.

---

## ✅ Checklist Final

Antes de considerar completo, verifique:

- [ ] Todas as contas criadas (Apple, Google, EAS)
- [ ] Todos os secrets configurados no EAS
- [ ] Todos os assets criados (screenshots, feature graphic)
- [ ] Apps criados nas lojas (App Store Connect, Play Console)
- [ ] Metadata preenchida completamente
- [ ] Builds de produção criadas e testadas
- [ ] Builds submetidas para review
- [ ] Apps aprovados e publicados
- [ ] Monitoramento configurado (opcional)

---

## 🆘 Troubleshooting

### Build Falha

```bash
# Limpar cache e tentar novamente
eas build --platform ios --clear-cache --profile production

# Ver logs detalhados
eas build:list
eas build:view [BUILD_ID]
```

### Submit Falha

```bash
# Ver logs detalhados
eas submit --platform ios --verbose

# Verificar credenciais
eas credentials
```

### Secrets Não Funcionam

```bash
# Verificar secrets
eas secret:list

# Verificar se secret existe
eas secret:get EXPO_PUBLIC_SUPABASE_URL

# Recriar secret se necessário
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "novo-valor"
```

---

## 📚 Recursos Adicionais

- **EAS Build Docs:** [docs.expo.dev/build](https://docs.expo.dev/build/introduction/)
- **EAS Submit Docs:** [docs.expo.dev/submit](https://docs.expo.dev/submit/introduction/)
- **App Store Connect:** [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
- **Google Play Console:** [play.google.com/console](https://play.google.com/console)
- **Documentação do Projeto:** Ver `docs/` neste repositório

---

**Última atualização:** 2025

**Tempo estimado total:** 2-3 dias (incluindo aprovações e reviews)

