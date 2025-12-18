# Setup Windows 11 - Nossa Maternidade

**Guia completo para configurar o ambiente de desenvolvimento no Windows 11**

Tempo estimado: 30-60 minutos (máquina zerada)

---

## 1. PRE-REQUISITOS

### 1.1 Git for Windows

```powershell
# Baixar e instalar:
# https://git-scm.com/download/win

# Verificar instalacao:
git --version
# Esperado: git version 2.x.x
```

**Importante:** Durante a instalacao, selecione:
- "Git Bash Here" no menu de contexto
- "Use Git from Git Bash only" OU "Git from the command line and also from 3rd-party software"

### 1.2 Node.js LTS

```powershell
# Baixar e instalar:
# https://nodejs.org/ (versao LTS - atualmente 20.x ou 22.x)

# Verificar instalacao:
node --version
npm --version
# Esperado: v20.x.x ou v22.x.x
```

### 1.3 Bun (opcional, mas recomendado)

```powershell
# PowerShell (como administrador):
irm bun.sh/install.ps1 | iex

# Fechar e reabrir o terminal, depois verificar:
bun --version
# Esperado: 1.x.x
```

---

## 2. ANDROID TOOLCHAIN

Esta secao e **obrigatoria** para rodar o app no emulador Android.

### 2.1 JDK 17 (Java Development Kit)

**Opcao A: Via Chocolatey (recomendado)**
```powershell
# Instalar Chocolatey primeiro (se nao tiver):
# https://chocolatey.org/install

# PowerShell (administrador):
choco install microsoft-openjdk17 -y

# Verificar:
java -version
# Esperado: openjdk version "17.x.x"
```

**Opcao B: Download manual**
- Baixar: https://learn.microsoft.com/en-us/java/openjdk/download
- Selecionar: Windows x64 MSI
- Instalar e reiniciar o terminal

### 2.2 Android Studio

1. Baixar: https://developer.android.com/studio
2. Executar instalador
3. Durante instalacao, marcar:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

### 2.3 Android SDK (via SDK Manager)

1. Abrir Android Studio
2. Ir em: **More Actions** > **SDK Manager** (ou **Tools** > **SDK Manager**)
3. Aba **SDK Platforms**:
   - Marcar: **Android 14.0 (API 34)** ou mais recente
4. Aba **SDK Tools**:
   - Marcar: **Android SDK Build-Tools**
   - Marcar: **Android SDK Command-line Tools**
   - Marcar: **Android Emulator**
   - Marcar: **Android SDK Platform-Tools**
5. Clicar **Apply** e aguardar download

### 2.4 Configurar ANDROID_HOME e PATH

**PowerShell (administrador):**
```powershell
# Configurar ANDROID_HOME (ajuste o caminho se necessario)
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")

# Adicionar platform-tools ao PATH
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$currentPath;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")

# FECHAR E REABRIR O TERMINAL para aplicar as mudancas
```

**Verificar configuracao (em novo terminal):**
```powershell
echo $env:ANDROID_HOME
# Esperado: C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk

adb --version
# Esperado: Android Debug Bridge version 1.x.x
```

### 2.5 Criar AVD (Android Virtual Device)

1. Abrir Android Studio
2. Ir em: **More Actions** > **Virtual Device Manager**
3. Clicar **Create Device**
4. Selecionar: **Pixel 7** (ou similar)
5. Clicar **Next**
6. Selecionar imagem do sistema: **API 34** (fazer download se necessario)
7. Clicar **Next** > **Finish**
8. Na lista de devices, clicar no botao **Play** para iniciar o emulador

**Verificar emulador via terminal:**
```powershell
# Listar emuladores disponiveis
emulator -list-avds

# Verificar dispositivos conectados (emulador deve aparecer)
adb devices
# Esperado:
# List of devices attached
# emulator-5554   device
```

---

## 3. SSH KEY (se ainda nao tiver)

### Opcao 1: Usar mesma SSH key de outra maquina

```bash
# 1. Copiar a chave para: C:\Users\SEU_USUARIO\.ssh\
# 2. No Git Bash, configurar permissoes:
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# 3. Testar conexao:
ssh -T git@github.com
# Esperado: Hi usuario! You've successfully authenticated...
```

### Opcao 2: Gerar nova SSH key

```bash
# Git Bash:
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Adicionar ao ssh-agent:
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave publica:
cat ~/.ssh/id_ed25519.pub
# Cole no GitHub: Settings > SSH and GPG keys > New SSH key
```

---

## 4. CLONAR REPOSITORIO

```bash
# Git Bash ou PowerShell:
cd C:\Users\SEU_USUARIO\Documents
git clone git@github.com:LionGab/NossaMaternidade.git
cd NossaMaternidade
```

**Configurar git (se ainda nao configurou):**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Configurar line endings (IMPORTANTE no Windows):
git config --global core.autocrlf true
```

---

## 5. INSTALAR DEPENDENCIAS

```powershell
# No diretorio do projeto:
cd C:\Users\SEU_USUARIO\Documents\NossaMaternidade

# Com Bun (mais rapido):
bun install

# OU com npm:
npm install
```

**Nota:** O script `postinstall` executa automaticamente e corrige problemas do LightningCSS no Windows.

---

## 6. VARIAVEIS DE AMBIENTE

### 6.1 Criar arquivo .env.local

```powershell
# PowerShell (no diretorio do projeto):
Copy-Item .env.example .env.local

# Abrir para editar:
notepad .env.local
# OU
code .env.local
```

### 6.2 AVISO DE SEGURANCA

```
+------------------------------------------------------------------+
|  !! ATENCAO - SEGURANCA !!                                       |
|                                                                  |
|  Variaveis EXPO_PUBLIC_* sao EMBUTIDAS no bundle do app.         |
|  Qualquer pessoa pode extrair esses valores do APK/IPA.          |
|                                                                  |
|  NUNCA coloque nestas variaveis:                                 |
|  - Service role keys do Supabase                                 |
|  - Chaves de API com permissoes administrativas                  |
|  - Secrets de autenticacao server-side                           |
|  - Tokens de acesso a bancos de dados                            |
|                                                                  |
|  USE APENAS:                                                     |
|  - Chaves anonimas/publicas (ex: Supabase anon key)              |
|  - Client IDs para OAuth                                         |
|  - URLs publicas de APIs                                         |
|  - Feature flags                                                 |
+------------------------------------------------------------------+
```

### 6.3 Preencher valores obrigatorios

```env
# Supabase (OBRIGATORIO)
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto.supabase.co/functions/v1

# APIs de IA (para NathIA funcionar)
EXPO_PUBLIC_OPENAI_API_KEY=sk-...

# Feature flags
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

**NUNCA commite .env.local** - ele ja esta no .gitignore.

---

## 7. VALIDACAO

Execute cada comando e verifique se passa sem erros:

### 7.1 TypeScript

```powershell
npx tsc --noEmit
# Esperado: nenhum output (sem erros)
```

### 7.2 ESLint

```powershell
npm run lint
# Esperado: sem erros (warnings sao aceitaveis)
```

### 7.3 Quality Gate (completo)

```powershell
npm run quality-gate
# Esperado: "All quality gates passed!"
```

### 7.4 Verificar ambiente

```powershell
npm run check-env
# Esperado: lista de variaveis configuradas
```

### 7.5 Iniciar Expo (teste final)

```powershell
# Iniciar com cache limpo:
npx expo start --clear

# Esperado:
# - QR code aparece
# - Metro bundler inicia na porta 8081
# - Pressione 'a' para abrir no emulador Android
```

### 7.6 Testar no emulador Android

1. Inicie o emulador Android (via Android Studio ou comando `emulator -avd NOME_AVD`)
2. No terminal do Expo, pressione `a`
3. O app deve abrir no emulador

```powershell
# Verificar se emulador esta conectado:
adb devices
# Esperado: emulator-5554   device
```

---

## 8. COMANDOS UTEIS

### Desenvolvimento

```powershell
# Iniciar dev server:
npm start
# ou: bun start

# Rodar no Android:
npm run android

# Rodar no Web:
npm run web

# Limpar cache e reiniciar:
npx expo start --clear
```

### Qualidade

```powershell
# TypeScript check:
npm run typecheck

# Lint:
npm run lint

# Format:
npm run format

# Quality gate completo:
npm run quality-gate

# Verificar build readiness:
npm run check-build-ready
```

### Git

```powershell
# Status:
git status

# Pull (atualizar):
git pull origin main

# Commit:
git add .
git commit -m "feat: descricao"
git push origin main
```

---

## 9. TROUBLESHOOTING

### 9.1 Scripts .sh nao funcionam

**Sintoma:** Erro ao rodar `npm run quality-gate`

**Causa:** bash nao esta no PATH

**Solucao:**
```powershell
# Verificar se bash existe:
where bash
# Se nao aparecer, adicione Git Bash ao PATH:
# C:\Program Files\Git\bin

# Alternativa: rodar diretamente no Git Bash:
bash scripts/quality-gate.sh
```

### 9.2 LightningCSS erro no Windows

**Sintoma:** Erro de binario durante `npm install`

**Solucao:**
```powershell
node scripts/fix-lightningcss.js
npm install
```

### 9.3 Permissoes SSH

**Sintoma:** "Permissions are too open" ou "bad permissions"

**Solucao (Git Bash):**
```bash
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### 9.4 Node modules corrompidos

**Sintoma:** Erros estranhos apos pull ou mudanca de branch

**Solucao:**
```powershell
# Limpar tudo e reinstalar:
rm -rf node_modules
npm cache clean --force
npm install
```

### 9.5 CRLF/LF quebrando scripts

**Sintoma:** Scripts .sh falham com erros de sintaxe

**Causa:** Windows usa CRLF, scripts precisam de LF

**Solucao:**
```powershell
# Configurar git para converter automaticamente:
git config --global core.autocrlf true

# Se o problema persistir, converter arquivo manualmente:
# VS Code: canto inferior direito, clicar em "CRLF" e mudar para "LF"
```

### 9.6 Emulador Android nao aparece

**Sintoma:** `adb devices` nao mostra o emulador

**Solucoes:**
```powershell
# 1. Verificar se ANDROID_HOME esta configurado:
echo $env:ANDROID_HOME

# 2. Reiniciar ADB:
adb kill-server
adb start-server
adb devices

# 3. Verificar se emulador esta rodando:
# Abrir Android Studio > Virtual Device Manager > Play

# 4. Se ainda nao funcionar, criar novo AVD
```

### 9.7 adb not recognized

**Sintoma:** Comando `adb` nao encontrado

**Solucao:**
```powershell
# Verificar se platform-tools esta no PATH:
echo $env:Path | Select-String "platform-tools"

# Se nao estiver, adicionar manualmente:
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"

# Testar:
adb --version
```

### 9.8 Porta 8081 ocupada

**Sintoma:** "Something is already running on port 8081"

**Solucao:**
```powershell
# Encontrar processo na porta:
netstat -ano | findstr :8081

# Matar processo (substitua PID pelo numero encontrado):
taskkill /PID NUMERO_PID /F

# OU usar porta diferente:
npx expo start --port 8082
```

### 9.9 Metro bundler travado

**Sintoma:** Build trava, app nao atualiza

**Solucao:**
```powershell
# 1. Parar o servidor (Ctrl+C)

# 2. Limpar cache:
npm run clean
npx expo start --clear

# 3. Se persistir, limpar cache do Metro global:
rm -rf $env:USERPROFILE\.metro-cache
```

### 9.10 Expo nao encontra .env.local

**Sintoma:** Variaveis de ambiente undefined

**Solucao:**
```powershell
# Verificar nome do arquivo (deve ser exatamente .env.local):
ls -la .env*

# Verificar conteudo:
cat .env.local

# Reiniciar Expo com cache limpo:
npx expo start --clear
```

---

## 10. CHECKLIST FINAL

Execute cada item e marque como concluido:

### Instalacoes
- [ ] Git instalado (`git --version`)
- [ ] Node.js instalado (`node --version`)
- [ ] Bun instalado (`bun --version`) - opcional
- [ ] JDK 17 instalado (`java -version`)
- [ ] Android Studio instalado
- [ ] Android SDK configurado
- [ ] ANDROID_HOME configurado (`echo $env:ANDROID_HOME`)
- [ ] adb no PATH (`adb --version`)
- [ ] Emulador Android criado e funcionando

### Projeto
- [ ] Repositorio clonado
- [ ] SSH key configurada (`ssh -T git@github.com`)
- [ ] Dependencias instaladas (`bun install` ou `npm install`)
- [ ] `.env.local` configurado (copiado de `.env.example`)

### Validacao
- [ ] TypeScript sem erros (`npx tsc --noEmit`)
- [ ] ESLint sem erros (`npm run lint`)
- [ ] Quality gate passou (`npm run quality-gate`)
- [ ] Expo inicia (`npx expo start --clear`)
- [ ] App abre no emulador Android (pressionar `a`)

---

## COMO USAR (Resumo em 6 passos)

```powershell
# 1. Clonar repositorio
git clone git@github.com:LionGab/NossaMaternidade.git
cd NossaMaternidade

# 2. Instalar dependencias
bun install  # ou: npm install

# 3. Configurar ambiente
Copy-Item .env.example .env.local
notepad .env.local  # Preencher valores

# 4. Validar instalacao
npm run quality-gate

# 5. Iniciar emulador Android
# (via Android Studio > Virtual Device Manager)

# 6. Rodar app
npx expo start --clear
# Pressionar 'a' para abrir no Android
```

---

**Pronto!** Ambiente configurado para desenvolvimento no Windows 11.
