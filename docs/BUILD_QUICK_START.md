# 🚀 Quick Start - Build Android/iOS

## Situação Atual

✅ **Correção do módulo nativo aplicada** - `expo-tracking-transparency` não quebra mais no Expo Go  
✅ **EAS CLI instalado** - Pronto para builds na nuvem  
✅ **EAS Update configurado** - OTA updates habilitados  
⚠️ **Android SDK não configurado** - Build local requer Android Studio

---

## 🎯 Opção Recomendada: EAS Build na Nuvem

**Mais simples e não requer configuração local!**

### Passo a Passo:

1. **Execute o build:**

   ```bash
   npm run build:dev:android
   ```

2. **Quando perguntar sobre metro.config.js:**
   - Responda: **`n`** (não abortar)
   - O arquivo está correto, é apenas um aviso

3. **Acompanhe o build:**
   - O build será feito na nuvem
   - Leva cerca de 5-15 minutos
   - Você receberá um link para download do APK

4. **Instale no dispositivo:**
   - Baixe o APK do link fornecido
   - Instale no seu dispositivo Android
   - O módulo `expo-tracking-transparency` funcionará normalmente!

---

## 🔧 Alternativa: Build Local (Requer Android Studio)

Se você quiser fazer build local, precisa:

1. **Instalar Android Studio:**
   - Download: https://developer.android.com/studio
   - Instale com Android SDK incluído

2. **Configurar variáveis de ambiente:**

   ```powershell
   # ANDROID_HOME
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\SeuUsuario\AppData\Local\Android\Sdk', 'User')

   # Adicionar ao PATH
   $env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
   ```

3. **Fazer prebuild e rodar:**
   ```bash
   npx expo prebuild --platform android --clean
   npm run android
   ```

**Nota:** Build local é mais rápido para desenvolvimento, mas requer configuração inicial.

---

## 📱 Testando o Tracking Transparency

### No Expo Go:

- ❌ Módulo não funciona (esperado)
- ✅ App não quebra (retorna `'unavailable'`)

### Em Development Build (EAS ou Local):

- ✅ Módulo funciona normalmente
- ✅ Permissões de tracking funcionam
- ✅ Teste completo disponível

---

## 🆘 Troubleshooting

### Erro: "Failed to resolve the Android SDK path"

→ Use EAS Build na nuvem (não requer SDK local)

### Erro: "Would you like to abort?" sobre metro.config.js

→ Responda `n` - o arquivo está correto

### Build demora muito?

→ Normal! Builds na nuvem levam 5-15 minutos. Você receberá notificação quando terminar.

---

## 📚 Mais Informações

- Guia completo: `docs/BUILD_WINDOWS_GUIDE.md`
- EAS Build docs: https://docs.expo.dev/build/introduction/

---

**Última atualização:** 2025-01-27
