# 📱 Guia Rápido: Testar no Expo Go

Guia passo a passo para testar o app **Nossa Maternidade** no Expo Go.

---

## ✅ Pré-requisitos

### 1. Instalar Expo Go no Celular

**iOS:**
- App Store: [Expo Go](https://apps.apple.com/app/expo-go/id982107779)

**Android:**
- Google Play: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Verificar Dependências no Computador

```bash
# Verificar Node.js (precisa 18+)
node --version

# Verificar se Expo CLI está instalado
npx expo --version

# Se não tiver, instalar globalmente (opcional)
npm install -g expo-cli
```

---

## 🚀 Passo a Passo

### 1️⃣ Instalar Dependências

```bash
# Na raiz do projeto
cd "C:\Users\User\Documents\NossaMaternidade\projects\nossa-maternidade-mobile"

# Instalar todas as dependências
npm install
```

### 2️⃣ Verificar Arquivo .env

Certifique-se que o arquivo `.env` existe na raiz e tem as variáveis:

```env
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

**⚠️ IMPORTANTE:** Variáveis devem começar com `EXPO_PUBLIC_` para funcionar no Expo Go.

### 3️⃣ Iniciar o Servidor Expo

```bash
# Opção 1: Modo simples
npm start

# Opção 2: Limpar cache e iniciar (se tiver problemas)
npm start -- --clear

# Opção 3: Tunnel mode (para testar em rede diferente)
npm start -- --tunnel
```

### 4️⃣ Escanear QR Code

Após rodar `npm start`, você verá um QR code no terminal.

**📱 No iPhone:**
1. Abra o app **Câmera** (nativo do iOS)
2. Aponte para o QR code
3. Toque na notificação que aparecer
4. O Expo Go abrirá automaticamente

**🤖 No Android:**
1. Abra o app **Expo Go**
2. Toque em **Scan QR Code**
3. Escaneie o QR code do terminal

---

## 🎯 Comandos Úteis

### Iniciar em Modos Específicos

```bash
# Modo desenvolvimento (padrão)
npm start

# iOS Simulator (se tiver Mac/Simulator)
npm run ios

# Android Emulator (se tiver Android Studio)
npm run android

# Web (navegador)
npm run web
```

### Comandos de Depuração

```bash
# Limpar cache do Metro Bundler
npm start -- --clear

# Modo tunnel (funciona mesmo fora da mesma rede)
npm start -- --tunnel

# Ver logs detalhados
npm start -- --verbose

# Reload manual (aperte 'r' no terminal)
# Shake o celular para abrir menu de desenvolvedor
```

---

## 🔧 Troubleshooting Comum

### ❌ "Metro bundler failed to start"

```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npm start -- --clear
```

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm start -- --clear
```

### ❌ QR Code não aparece

1. Verifique se está na mesma rede Wi-Fi (ou use `--tunnel`)
2. Verifique firewall/antivírus
3. Tente `npm start -- --tunnel`

### ❌ App não carrega no Expo Go

1. **Verifique erros no terminal** - geralmente mostra o problema
2. **Limpe o cache do Expo Go** no celular:
   - iOS: Remova e reinstale o app
   - Android: Limpar dados do app nas configurações
3. **Reinicie o servidor:**
   ```bash
   # Pressione Ctrl+C para parar
   npm start -- --clear
   ```

### ❌ Variáveis de ambiente não funcionam

1. Certifique-se que começam com `EXPO_PUBLIC_`
2. Reinicie o servidor: `npm start -- --clear`
3. Verifique se o arquivo `.env` está na raiz do projeto
4. Não edite `.env` enquanto o servidor está rodando - reinicie após mudanças

### ❌ Erro "Unable to resolve module"

```bash
# Limpar tudo e reinstalar
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

**Windows:**
```powershell
Remove-Item -Recurse -Force node_modules,package-lock.json
npm install
npm start -- --clear
```

### ❌ App fecha ao abrir (crash)

1. **Verifique logs no terminal** - o erro aparece lá
2. **Verifique console do Expo Go:**
   - Shake o celular → "Debug Remote JS"
   - Ou aperte `j` no terminal para abrir debugger
3. **Verifique dependências nativas:**
   - Alguns módulos não funcionam no Expo Go
   - Veja lista de compatibilidade abaixo

---

## 📦 Compatibilidade com Expo Go

### ✅ Funcionam no Expo Go:

- ✅ React Navigation
- ✅ NativeWind (Tailwind CSS)
- ✅ Expo Haptics
- ✅ Expo AV (áudio/vídeo)
- ✅ AsyncStorage
- ✅ Supabase JS SDK
- ✅ Gemini AI SDK
- ✅ Todos os componentes React Native básicos
- ✅ Expo Fonts
- ✅ Expo Linear Gradient

### ❌ Não funcionam no Expo Go:

- ❌ Módulos nativos customizados
- ❌ Alguns plugins do Expo que requerem build nativo
- ❌ Code Push (precisa EAS Update)

---

## 🎨 Hot Reload e Fast Refresh

O Expo Go tem **Hot Reload** automático:

- ✅ Salve um arquivo → app atualiza automaticamente
- ✅ Mudanças de estilo → atualiza instantaneamente
- ✅ Erros aparecem no terminal e no celular

### Menu de Desenvolvedor

**Abrir menu:**
- iOS: Shake o celular
- Android: Shake o celular ou Ctrl+M no emulador

**Opções disponíveis:**
- **Reload** - Recarregar app
- **Debug Remote JS** - Abrir debugger no navegador
- **Show Element Inspector** - Inspecionar elementos
- **Performance Monitor** - Monitorar performance

---

## 🌐 Testar em Rede Externa

Se quiser testar de outro computador ou celular em outra rede:

```bash
# Modo Tunnel (mais lento, mas funciona sempre)
npm start -- --tunnel

# Ou usar LAN (mesma rede Wi-Fi)
npm start -- --lan
```

**Nota:** Tunnel usa servidores da Expo, então pode ser mais lento.

---

## 📊 Verificar se Está Funcionando

### Checklist de Teste:

- [ ] App abre no Expo Go
- [ ] Tela de splash aparece
- [ ] Onboarding aparece (primeira vez)
- [ ] Navegação funciona (tabs)
- [ ] Tema light/dark funciona
- [ ] Chat com IA funciona
- [ ] Feed carrega posts
- [ ] Hábitos aparecem
- [ ] Comunidade funciona

### Testar Funcionalidades Específicas:

```bash
# Abrir debugger no navegador
# No terminal, pressione 'j' após iniciar

# Ver logs no terminal
# Todos os console.log aparecem no terminal

# Inspecionar elementos
# Shake → Show Element Inspector
```

---

## 🔄 Atualizar App no Celular

Depois de fazer mudanças no código:

1. **Salve o arquivo** (Ctrl+S / Cmd+S)
2. O app **atualiza automaticamente** (Hot Reload)
3. Se não atualizar, aperte `r` no terminal para reload manual
4. Ou shake o celular → **Reload**

---

## 🚨 Erros Comuns e Soluções

### "Network request failed"

```bash
# Verifique conexão Wi-Fi
# Use --tunnel se estiver em redes diferentes
npm start -- --tunnel
```

### "Unable to find expo in this project"

```bash
# Reinstalar Expo
npm install expo@latest
```

### "Metro bundler process exited with code 1"

```bash
# Limpar tudo
rm -rf node_modules .expo
npm install
npm start -- --clear
```

---

## 📱 Próximos Passos

Depois de testar no Expo Go:

1. **Para produção:** Use `eas build` para criar build nativo
2. **Para preview:** Use `eas build --profile preview`
3. **Para desenvolvimento nativo:** Use `eas build --profile development`

---

## 💡 Dicas

- ✅ **Sempre teste no celular real** - Emulador pode ter diferenças
- ✅ **Teste em iOS e Android** - Comportamentos podem variar
- ✅ **Use modo tunnel** apenas quando necessário (é mais lento)
- ✅ **Mantenha Expo Go atualizado** no celular
- ✅ **Verifique console regularmente** para erros

---

**Precisa de ajuda?** Veja também:
- `EXPO_GO_SETUP.md` - Configuração detalhada
- `README.md` - Documentação geral
- `DEPLOYMENT_GUIDE.md` - Guia para produção

