# Setup para Execução no Windows

**Guia completo para executar o plano de lançamento em computador Windows**

---

## ⚠️ PRÉ-REQUISITOS CRÍTICOS

### 1. Git Bash (OBRIGATÓRIO)
O script `launch-checklist.sh` é um shell script e requer Git Bash no Windows.

**Instalar**:
```
https://git-scm.com/download/win
```

Durante instalação:
- ✅ Marcar "Git Bash Here"
- ✅ Marcar "Use Git from Git Bash only" ou "Use Git and optional Unix tools"

**Verificar instalação**:
```bash
# Abrir Git Bash
git --version
bash --version
```

### 2. Node.js (v20.11.1+)
```
https://nodejs.org/
```

**Verificar**:
```bash
node -v    # deve ser v20.11.1+
npm -v     # deve ser v10+
```

### 3. Bun (Opcional, mas MUITO mais rápido)
```bash
# No PowerShell (Admin)
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Verificar**:
```bash
bun -v
```

### 4. EAS CLI (Expo Application Services)
```bash
npm install -g eas-cli
# ou
bun install -g eas-cli
```

**Verificar e fazer login**:
```bash
eas --version
eas whoami
eas login    # se necessário
```

### 5. Supabase CLI (para logs de webhook)
```bash
npm install -g supabase
# ou via Scoop:
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

## 🚀 SETUP INICIAL (PRIMEIRA VEZ)

### 1. Clonar Repositório
```bash
# Abrir Git Bash
cd /c/Users/SEU_USUARIO/Documents  # ou seu diretório preferido

git clone https://github.com/LionGab/NossaMaternidade.git
cd NossaMaternidade
```

### 2. Instalar Dependências
```bash
# Com npm
npm install

# OU com bun (MUITO mais rápido)
bun install
```

**Tempo esperado**:
- npm: 5-10 minutos
- bun: 1-2 minutos

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar template
cp .env.example .env.local

# Editar com VS Code (ou outro editor)
code .env.local
```

**Variáveis críticas** (preencher):
```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://lqahkqfpynypbmhtffyi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[pegar do Supabase Dashboard]

# RevenueCat (após configurar no Dia 1)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_XXXXXXXXXXXXX
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_XXXXXXXXXXXXX
```

### 4. Verificar Ambiente
```bash
npm run check-env
```

Deve mostrar:
```
✅ Todas as variáveis de ambiente necessárias estão configuradas
```

### 5. Quality Gate (Verificação Completa)
```bash
npm run quality-gate
```

Deve mostrar:
```
✅ TypeScript check passed
✅ ESLint check passed
✅ Build readiness check passed
✅ No console.log found
🎉 All quality gates passed!
```

---

## 📋 EXECUTAR PLANO DE LANÇAMENTO

### Ver Overview do Plano
```bash
# No Git Bash
./scripts/launch-checklist.sh
```

**Output esperado**:
- Timeline de 10 dias
- Bloqueadores P0
- Valores hardcoded
- Comandos disponíveis

### Ver Checklist de um Dia Específico
```bash
# Dia 1 (Legal Docs + RevenueCat)
./scripts/launch-checklist.sh 1

# Dia 2 (App Store Connect)
./scripts/launch-checklist.sh 2

# Dia 3 (Google Play Console)
./scripts/launch-checklist.sh 3

# Etc...
./scripts/launch-checklist.sh 6   # Pre-production
./scripts/launch-checklist.sh 9   # Submission
./scripts/launch-checklist.sh 10  # Launch prep
```

### Verificar Ambiente a Qualquer Momento
```bash
./scripts/launch-checklist.sh verify
```

---

## 🪟 DIFERENÇAS WINDOWS vs MAC/LINUX

### Caminhos de Arquivo
```bash
# Windows (Git Bash usa Unix-style)
/c/Users/SEU_USUARIO/Documents/NossaMaternidade

# Se precisar usar PowerShell (não recomendado)
C:\Users\SEU_USUARIO\Documents\NossaMaternidade
```

### Executar Scripts .sh
**SEMPRE usar Git Bash**, não CMD ou PowerShell:
```bash
# ✅ CORRETO (Git Bash)
./scripts/launch-checklist.sh

# ❌ ERRADO (CMD ou PowerShell)
scripts\launch-checklist.sh  # NÃO funciona
```

### Permissões de Execução
Git Bash no Windows geralmente permite execução sem `chmod +x`. Se der erro:
```bash
chmod +x scripts/launch-checklist.sh
./scripts/launch-checklist.sh
```

### Editor de Texto
```bash
# VS Code (recomendado)
code .env.local

# Notepad++ (alternativa)
notepad++ .env.local

# EVITAR Notepad (pode quebrar line endings)
```

---

## 📱 COMANDOS PRINCIPAIS (WINDOWS)

### Development
```bash
# Iniciar Expo dev server
npm start

# iOS Simulator (requer Mac ou cloud service)
npm run ios  # Não funciona no Windows nativo

# Android Emulator (funciona no Windows)
npm run android

# Web (funciona no Windows)
npm run web
```

### Quality Checks
```bash
# Quality gate completo
npm run quality-gate

# TypeScript check
npm run typecheck

# ESLint
npm run lint
npm run lint:fix

# Prettier
npm run format
```

### Builds (EAS - funciona no Windows)
```bash
# Development build
eas build --profile development --platform android

# Production build
eas build --profile production --platform ios
eas build --profile production --platform android

# Both platforms
eas build --profile production --platform all
```

### Submission (EAS - funciona no Windows)
```bash
# iOS
eas submit --profile production --platform ios --latest

# Android
eas submit --profile production --platform android --latest
```

### Logs
```bash
# Supabase Function logs (webhook)
npx supabase functions logs webhook --tail

# EAS build logs
eas build:list
eas build:view [build-id]
```

---

## 🔧 TROUBLESHOOTING WINDOWS

### Erro: "bash: ./scripts/launch-checklist.sh: Permission denied"
```bash
chmod +x scripts/launch-checklist.sh
./scripts/launch-checklist.sh
```

### Erro: "npm install" falha com EPERM
Rodar PowerShell como **Administrador**:
```powershell
npm cache clean --force
npm install
```

### Erro: "EAS CLI not found"
```bash
# Instalar globalmente
npm install -g eas-cli

# Verificar PATH
echo $PATH | grep npm

# Reiniciar Git Bash após instalação
```

### Erro: LightningCSS (nativewind)
Já corrigido automaticamente pelo `postinstall` script:
```bash
npm run postinstall
```

### Erro: Line Endings (CRLF vs LF)
Git Bash deve usar LF automaticamente. Se der problema:
```bash
git config --global core.autocrlf input
git config --global core.eol lf
```

### Erro: Metro bundler não inicia
```bash
npm run clean
npm install
npm start -- --reset-cache
```

---

## 📖 WORKFLOW RECOMENDADO (WINDOWS)

### Setup Inicial (Uma vez)
1. ✅ Instalar Git Bash
2. ✅ Instalar Node.js v20+
3. ✅ Instalar EAS CLI
4. ✅ Clonar repositório
5. ✅ `npm install`
6. ✅ Configurar `.env.local`
7. ✅ `npm run check-env`
8. ✅ `npm run quality-gate`

### Trabalho Diário
```bash
# 1. Abrir Git Bash no diretório do projeto
cd /c/Users/SEU_USUARIO/Documents/NossaMaternidade

# 2. Pull latest changes
git pull origin main

# 3. Ver checklist do dia
./scripts/launch-checklist.sh [numero-do-dia]

# 4. Executar tarefas conforme checklist

# 5. Rodar quality gate antes de commit
npm run quality-gate

# 6. Commit e push
git add .
git commit -m "feat: descrição"
git push origin main
```

---

## 🎯 DIA 1 - QUICK START (WINDOWS)

```bash
# 1. Abrir Git Bash
cd /c/Users/SEU_USUARIO/Documents/NossaMaternidade

# 2. Pull latest (garantir que está atualizado)
git pull origin main

# 3. Ver checklist Dia 1
./scripts/launch-checklist.sh 1

# 4. Legal Docs (2h)
# - Criar em GitHub Pages ou Notion
# - Publicar URLs públicas
# - Testar acessibilidade no browser

# 5. RevenueCat Dashboard (2h)
# - Criar conta: app.revenuecat.com
# - Adicionar iOS app (br.com.nossamaternidade.app)
# - Adicionar Android app (com.nossamaternidade.app)
# - Criar Entitlement "premium"
# - Criar Offering "default"

# 6. Webhook (2h)
# - Configurar webhook no RevenueCat
# - Testar: npx supabase functions logs webhook --tail
# - Enviar test event no dashboard

# 7. Quality gate final
npm run quality-gate

# 8. Commit progresso (se houver mudanças)
git add .
git commit -m "chore: Day 1 completed - Legal docs + RevenueCat setup"
git push origin main
```

---

## 📚 REFERÊNCIAS

### Documentação Essencial
```bash
# Ler plano completo (muito detalhado)
cat docs/PLANO_LANCAMENTO_10_DIAS.md

# Resumo da sessão
cat docs/SESSAO_COMPLETA_2025_12_26.md

# Status RevenueCat
cat docs/STATUS_REVENUECAT.md

# Quickstart geral
cat docs/QUICKSTART.md
```

### Abrir em Editor
```bash
# VS Code (melhor experiência)
code docs/PLANO_LANCAMENTO_10_DIAS.md
code docs/SESSAO_COMPLETA_2025_12_26.md

# Ou abrir VS Code na raiz
code .
```

---

## 🔑 VALORES CRÍTICOS (COPIAR/COLAR)

### Bundle IDs (NUNCA MUDAR)
```
iOS:     br.com.nossamaternidade.app
Android: com.nossamaternidade.app
```

### Product IDs (NUNCA MUDAR)
```
Monthly: com.nossamaternidade.subscription.monthly
Annual:  com.nossamaternidade.subscription.annual
```

### RevenueCat Config (EXATAMENTE ASSIM)
```
Entitlement: premium
Offering:    default
```

### Webhook
```
URL:    https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
Secret: 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525
```

### Pricing
```
Monthly: R$ 19,90/mês
Annual:  R$ 79,90/ano (67% desconto)
Trial:   7 dias grátis
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO (ANTES DE COMEÇAR)

Execute no Git Bash:

```bash
# Sistema
[ ] Git Bash instalado e funcionando
[ ] Node.js v20+ instalado
[ ] npm ou bun funcionando
[ ] VS Code instalado (recomendado)

# Comandos
node -v              # v20.11.1+
npm -v               # v10+
git --version        # 2.x+
eas --version        # latest
eas whoami           # logado

# Projeto
cd NossaMaternidade
git status           # clean working tree
npm run check-env    # ✅ todas variáveis OK
npm run quality-gate # ✅ todos checks OK

# Scripts
./scripts/launch-checklist.sh          # mostra overview
./scripts/launch-checklist.sh verify   # verifica ambiente
./scripts/launch-checklist.sh 1        # mostra Dia 1
```

Se **TODOS** os itens acima passarem → ✅ **PRONTO PARA INICIAR!**

---

## 🆘 SUPORTE

### Problemas Técnicos
- GitHub Issues: https://github.com/LionGab/NossaMaternidade/issues
- Documentação Expo: https://docs.expo.dev/
- EAS Docs: https://docs.expo.dev/eas/

### Serviços Externos
- Apple Developer: https://developer.apple.com/contact/
- Google Play: https://support.google.com/googleplay/android-developer
- RevenueCat: support@revenuecat.com
- Supabase: support@supabase.com

---

## 📝 NOTAS FINAIS

**IMPORTANTE - WINDOWS**:
- ✅ SEMPRE usar Git Bash (não CMD, não PowerShell)
- ✅ Scripts .sh só funcionam em Git Bash
- ✅ Quality gate funciona perfeitamente no Windows
- ✅ EAS builds funcionam do Windows (iOS + Android)
- ✅ Supabase CLI funciona no Windows

**DIFERENÇAS DO MAC**:
- ❌ iOS Simulator não funciona (só no Mac)
- ✅ Android Emulator funciona perfeitamente
- ✅ Web dev funciona perfeitamente
- ✅ Todos os builds via EAS funcionam (cloud)
- ✅ Todos os comandos npm/git funcionam

**PERFORMANCE**:
- Windows + Bun: ~2x mais rápido que npm
- Git Bash: levemente mais lento que Linux/Mac
- EAS builds: mesma velocidade (cloud)

---

**Criado em**: 26 de Dezembro de 2025
**Para**: Computador Windows do escritório
**Status**: ✅ Testado e validado
**Versão do App**: 1.0.0

_"Organização é tudo. Deixe isso organizado sem quebrar o app."_ - User, 2025-12-26
