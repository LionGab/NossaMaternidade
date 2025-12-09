# 🪟 Guia de Build no Windows - Nossa Maternidade

## ⚠️ Limitações do Windows

No Windows, você **não pode** fazer build local de iOS (requer macOS). Mas você pode:

1. ✅ Fazer build de **Android localmente** (se tiver Android Studio)
2. ✅ Fazer build de **iOS na nuvem** via EAS Build
3. ✅ Testar no **Expo Go** (mas módulos nativos não funcionam)

---

## 📦 Instalação do EAS CLI

O EAS CLI (`eas-cli`) foi adicionado como dependência. Instale as dependências:

```bash
npm install
```

Agora você pode usar os comandos de build com `npx`:

```bash
# Build Android para desenvolvimento (local ou nuvem)
npm run build:dev:android

# Build iOS na nuvem (requer conta Expo)
npm run build:dev:ios

# Build ambos na nuvem
npm run build:dev
```

---

## 🚀 Opções de Build

### Opção 1: Build Android Local (Requer Android Studio)

**Pré-requisitos:**

- Android Studio instalado
- Android SDK configurado (ANDROID_HOME definido)
- Emulador Android ou dispositivo físico conectado

**⚠️ Se você receber erro "Failed to resolve the Android SDK path":**

1. Instale o Android Studio: https://developer.android.com/studio
2. Configure a variável de ambiente `ANDROID_HOME`:
   ```powershell
   # No PowerShell (como Admin)
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\SeuUsuario\AppData\Local\Android\Sdk', 'User')
   ```
3. Adicione ao PATH:
   ```powershell
   $env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

**Depois de configurar:**

```bash
# 1. Fazer prebuild (gera código nativo)
npx expo prebuild --platform android --clean

# 2. Rodar no Android
npm run android

# OU fazer build APK
cd android
./gradlew assembleDebug
cd ..
```

**Vantagens:**

- ✅ Testa módulos nativos (como `expo-tracking-transparency`)
- ✅ Rápido para desenvolvimento
- ✅ Não precisa de conta Expo

**Desvantagens:**

- ❌ Só funciona para Android
- ❌ Requer Android Studio instalado e configurado
- ❌ Configuração inicial pode ser trabalhosa

---

### Opção 2: EAS Build na Nuvem (⭐ RECOMENDADO - Mais Simples)

**Pré-requisitos:**

- Conta Expo (gratuita)
- Login no EAS CLI

```bash
# 1. Login no EAS (primeira vez)
npx eas-cli login

# 2. Configurar projeto (primeira vez)
npx eas-cli build:configure

# 3. Build Android development
npm run build:dev:android

# 4. Build iOS development (na nuvem)
npm run build:dev:ios
```

**Vantagens:**

- ✅ Funciona para iOS e Android
- ✅ Não precisa de macOS para iOS
- ✅ Não precisa de Android Studio/SDK local
- ✅ Builds otimizados e prontos para instalação
- ✅ Simulador iOS disponível
- ✅ Mais simples de configurar

**Desvantagens:**

- ❌ Requer conta Expo (gratuita)
- ❌ Builds levam alguns minutos (5-15 min)
- ❌ Pode ter limites na conta gratuita (mas suficiente para desenvolvimento)

**⚠️ Aviso sobre metro.config.js:**
Quando o EAS perguntar "Would you like to abort?" sobre o metro.config.js, responda **`n` (não)**. O arquivo está correto e o build funcionará normalmente.

---

### Opção 3: Expo Go (Apenas para desenvolvimento rápido)

**Quando usar:**

- Desenvolvimento rápido de UI
- Testes de navegação
- Prototipagem

**Limitações:**

- ❌ Módulos nativos **NÃO funcionam** (como `expo-tracking-transparency`)
- ❌ Alguns plugins não estão disponíveis

```bash
# Iniciar Expo Go
npm start

# Escanear QR code com Expo Go app
```

**Nota:** Com a correção feita em `trackingService.ts`, o app **não quebra** no Expo Go - apenas retorna `'unavailable'` quando o módulo não está disponível.

---

## 🧪 Testando o Tracking Transparency

### No Expo Go

O módulo retornará `'unavailable'` sem quebrar o app. Isso é esperado.

### Em Development Build (Android Local)

```bash
# 1. Fazer prebuild
npx expo prebuild --platform android --clean

# 2. Rodar no dispositivo/emulador
npm run android

# 3. O módulo estará disponível e funcionará normalmente
```

### Em Development Build (iOS - EAS Build)

```bash
# 1. Fazer build na nuvem
npm run build:dev:ios

# 2. Baixar e instalar no dispositivo iOS
# 3. O módulo estará disponível e funcionará normalmente
```

---

## 📝 Comandos Úteis

```bash
# Ver status do build
npx eas-cli build:list

# Ver detalhes de um build específico
npx eas-cli build:view [BUILD_ID]

# Cancelar build em andamento
npx eas-cli build:cancel [BUILD_ID]

# Limpar cache local
npx expo start --clear

# Limpar prebuild
npx expo prebuild --clean
```

---

## 🔧 Troubleshooting

### Erro: "EAS CLI not found"

```bash
# Instalar dependências
npm install

# Usar npx (já configurado nos scripts)
npm run build:dev:android
```

### Erro: "Cannot find native module"

- ✅ **Corrigido!** O `trackingService.ts` agora trata isso graciosamente
- Se ainda ocorrer, faça prebuild: `npx expo prebuild --clean`

### Build Android falha

```bash
# Limpar cache do Gradle
cd android
./gradlew clean
cd ..

# Limpar prebuild e refazer
npx expo prebuild --clean --platform android
```

### Build iOS falha (na nuvem)

- Verifique se está logado: `npx eas-cli whoami`
- Verifique configuração: `npx eas-cli build:configure`
- Veja logs: `npx eas-cli build:view [BUILD_ID]`

---

## ✅ Checklist para Testar Tracking Transparency

- [ ] Instalar dependências: `npm install`
- [ ] Fazer prebuild: `npx expo prebuild --platform android --clean`
- [ ] Rodar no dispositivo: `npm run android`
- [ ] Verificar logs: O serviço deve funcionar sem erros
- [ ] Testar permissão: Chamar `trackingService.requestTrackingPermission()`

---

## 📚 Recursos

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Development Builds](https://docs.expo.dev/development/introduction/)

---

**Última atualização:** 2025-01-27
