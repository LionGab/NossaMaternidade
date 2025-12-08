# 🚀 Compatibilidade Expo Go - Nossa Maternidade

Este documento descreve as configurações e limitações para executar o app no **Expo Go** (desenvolvimento rápido).

---

## ✅ O que funciona no Expo Go

- ✅ Navegação (React Navigation)
- ✅ Supabase (Auth, Database, Storage, Realtime)
- ✅ TanStack Query (React Query)
- ✅ Design System (NativeWind, Theme)
- ✅ Todas as telas e componentes
- ✅ Hooks e services
- ✅ Integração com APIs de IA (Gemini, OpenAI, Claude)
- ✅ Haptics, Image Picker, File System
- ✅ AsyncStorage
- ✅ Fonts e assets

---

## ⚠️ Limitações do Expo Go

### 1. Nova Arquitetura do React Native

**Status:** ❌ Desabilitada no `app.config.js`

```javascript
newArchEnabled: false, // ⚠️ DESABILITADO para compatibilidade com Expo Go
```

**Para usar nova arquitetura:**
```bash
npm run build:dev  # Cria development build com nova arquitetura
```

---

### 2. Sentry (Crash Reporting)

**Status:** ⚠️ Não inicializa no Expo Go (fail-safe)

O Sentry está configurado para **não quebrar** no Expo Go:
- Plugin removido do `app.config.js`
- Importação segura com try-catch
- Funções retornam `undefined` silenciosamente

**Para usar Sentry:**
```bash
npm run build:dev  # Development build com Sentry habilitado
```

---

### 3. Plugins que requerem Development Build

Alguns plugins do Expo requerem **development build** e não funcionam no Expo Go:

- `@sentry/react-native/expo` - Removido do `app.config.js`
- `expo-dev-client` - Disponível mas não necessário para Expo Go

---

## 🔧 Configurações para Expo Go

### app.config.js

```javascript
{
  expo: {
    // Nova arquitetura DESABILITADA
    newArchEnabled: false,
    
    plugins: [
      // Sentry plugin REMOVIDO
      // '@sentry/react-native/expo',
      
      // Plugins compatíveis com Expo Go
      'expo-secure-store',
      'expo-font',
      'expo-localization',
      'expo-tracking-transparency',
      'expo-splash-screen',
      'expo-image-picker',
    ],
  }
}
```

---

## 🚀 Como executar no Expo Go

### 1. Instalar Expo Go no dispositivo

- **iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android:** [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Iniciar servidor de desenvolvimento

```bash
npm start
```

### 3. Escanear QR Code

- **iOS:** Abra a câmera e escaneie o QR code
- **Android:** Abra o app Expo Go e escaneie o QR code

---

## 🔄 Migrando para Development Build

Se você precisar de recursos que não funcionam no Expo Go:

### 1. Criar Development Build

```bash
npm run build:dev
```

### 2. Instalar no dispositivo

- **iOS:** Baixe o build do EAS e instale via TestFlight ou link direto
- **Android:** Baixe o APK e instale manualmente

### 3. Habilitar recursos avançados

No `app.config.js`:

```javascript
{
  expo: {
    newArchEnabled: true,  // ✅ Habilitar nova arquitetura
    plugins: [
      '@sentry/react-native/expo',  // ✅ Habilitar Sentry
    ],
  }
}
```

---

## 📋 Checklist de Compatibilidade

Antes de testar no Expo Go, verifique:

- [ ] `newArchEnabled: false` no `app.config.js`
- [ ] Plugin `@sentry/react-native/expo` removido
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Supabase configurado (URL e Anon Key)
- [ ] Assets (ícones, splash) presentes

---

## 🐛 Troubleshooting

### Erro: "Module not found: @sentry/react-native"

**Causa:** Sentry não está instalado ou não está disponível no Expo Go.

**Solução:** Isso é esperado. O Sentry está configurado para não quebrar no Expo Go. Se você precisar do Sentry, use development build.

---

### Erro: "New Architecture is enabled but not supported"

**Causa:** `newArchEnabled: true` no `app.config.js`.

**Solução:** Defina `newArchEnabled: false` no `app.config.js`.

---

### Erro: "Plugin not found: @sentry/react-native/expo"

**Causa:** Plugin do Sentry está no `app.config.js` mas não funciona no Expo Go.

**Solução:** Remova o plugin do `app.config.js` (já feito).

---

## 📚 Referências

- [Expo Go Documentation](https://docs.expo.dev/workflow/expo-go/)
- [Development Builds](https://docs.expo.dev/development/introduction/)
- [Expo SDK Compatibility](https://docs.expo.dev/versions/latest/)

---

**Última atualização:** 24 de novembro de 2025

