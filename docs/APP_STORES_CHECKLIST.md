# ✅ Checklist Final - App Store & Google Play Store

**Data:** 27 de novembro de 2025  
**Status:** 🟡 Em progresso

---

## 📱 Configuração Atual (app.config.js)

### ✅ Já Configurado

- [x] **Bundle Identifier iOS:** `com.nossamaternidade.app`
- [x] **Package Android:** `com.nossamaternidade.app`
- [x] **Permissões iOS:** Camera, Microphone, Photo Library, Location, Tracking
- [x] **Permissões Android:** Camera, Audio, Storage, Location, Internet
- [x] **Splash Screen:** Configurado
- [x] **EAS Project ID:** Configurado
- [x] **Plugins:** Secure Store, Font, Localization, Tracking Transparency, Sentry

### ⚠️ Melhorias Necessárias

#### 1. Dark Mode Automático

**Atual:**
```javascript
userInterfaceStyle: 'light',
```

**Recomendado:**
```javascript
userInterfaceStyle: 'automatic', // Segue preferência do sistema
```

#### 2. Privacy Manifest (iOS 17+)

**Adicionar:**
```javascript
ios: {
  // ... existente
  privacyManifests: {
    NSPrivacyAccessedAPITypes: [
      {
        NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
        NSPrivacyAccessedAPITypeReasons: ['CA92.1'], // App Functionality
      },
    ],
  },
}
```

#### 3. Target SDK Android

**Adicionar:**
```javascript
android: {
  // ... existente
  targetSdkVersion: 34, // Android 14
  compileSdkVersion: 34,
}
```

---

## 🎨 Assets Necessários

### iOS

- [ ] **App Icon:** 1024x1024px (PNG, sem transparência)
- [ ] **Launch Screen:** 1242x2688px (iPhone 14 Pro Max)
- [ ] **Screenshots:**
  - iPhone 6.7" (1290x2796) - 3-5 imagens
  - iPhone 6.5" (1242x2688) - 3-5 imagens
  - iPhone 5.5" (1242x2208) - 3-5 imagens
- [ ] **App Preview:** Vídeo opcional (30s max, 1080p)

### Android

- [ ] **App Icon:** 512x512px (PNG, sem transparência)
- [ ] **Adaptive Icon:** 1024x1024px (foreground + background)
- [ ] **Feature Graphic:** 1024x500px
- [ ] **Screenshots:**
  - Phone: 1080x1920px (mínimo 2, máximo 8)
  - Tablet: 1200x1920px (opcional)
- [ ] **App Preview:** Vídeo opcional (2min max, 720p+)

---

## 📝 Metadata para Lojas

### App Store (iOS)

**Nome:** Nossa Maternidade (30 caracteres max) ✅

**Subtítulo:** Apoio emocional para mães (30 caracteres max)

**Descrição:**
```
Nossa Maternidade é um espaço seguro e acolhedor para mães brasileiras. 

✨ RECURSOS:
• Naty AI - Assistente de maternidade pessoal
• Comunidade Mães Valentes - Conecte-se com outras mães
• Rastreamento de hábitos e bem-estar
• Conteúdo educativo e inspiracional
• Suporte emocional 24/7

💙 Criado por mães, para mães.
```

**Keywords:** maternidade, saúde, comunidade, apoio, bem-estar, mães, gravidez, pós-parto

**Categoria:** Saúde e Fitness

**Idade:** 17+ (conteúdo sensível relacionado a saúde mental)

**Preço:** Gratuito (com compras in-app opcionais)

---

### Google Play Store (Android)

**Nome:** Nossa Maternidade (50 caracteres max) ✅

**Descrição Curta:** Apoio emocional e comunidade para mães brasileiras (80 caracteres max)

**Descrição Completa:**
```
Nossa Maternidade é um espaço seguro e acolhedor para mães brasileiras.

✨ RECURSOS:
• Naty AI - Assistente de maternidade pessoal com IA
• Comunidade Mães Valentes - Conecte-se com outras mães
• Rastreamento de hábitos e bem-estar
• Conteúdo educativo e inspiracional
• Suporte emocional 24/7
• Diário emocional e check-ins
• Mundo Naty - Feed personalizado de conteúdo

💙 Criado por mães, para mães.

Conformidade LGPD ✅
```

**Categoria:** Saúde e Fitness

**Classificação:** PEGI 3 / Everyone

**Preço:** Gratuito

---

## 🔒 Conformidade e Legal

### LGPD (Lei Geral de Proteção de Dados)

- [x] **Política de Privacidade:** URL obrigatória
- [x] **Termos de Uso:** URL obrigatória
- [ ] **Consentimento granular:** Implementar no onboarding
- [ ] **Direito ao esquecimento:** Implementar em Settings
- [ ] **Exportação de dados:** Implementar em Settings

### Disclaimer Médico

- [ ] **Aviso visível:** "Este app não substitui consulta médica"
- [ ] **Em cada resposta da IA:** Disclaimer dinâmico
- [ ] **Em conteúdo de saúde:** Avisos apropriados

---

## 🧪 Testes Antes de Submeter

### iOS

- [ ] Testar em iPhone 14 Pro Max (iOS 17+)
- [ ] Testar em iPhone SE (iOS 15+)
- [ ] Testar em iPad (opcional)
- [ ] Verificar safe areas (notch, home indicator)
- [ ] Testar dark mode
- [ ] Testar permissões (câmera, microfone, etc.)
- [ ] Testar navegação (swipe back)
- [ ] Testar acessibilidade (VoiceOver)

### Android

- [ ] Testar em Pixel 7 (Android 14)
- [ ] Testar em dispositivo Android 8.0+ (API 26+)
- [ ] Verificar safe areas (edge-to-edge)
- [ ] Testar dark mode
- [ ] Testar permissões
- [ ] Testar botão voltar
- [ ] Testar acessibilidade (TalkBack)

---

## 📦 Build e Deploy

### EAS Build

```bash
# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production

# Build ambos
eas build --platform all --profile production
```

### EAS Submit

```bash
# Submit iOS
eas submit --platform ios

# Submit Android
eas submit --platform android

# Submit ambos
eas submit --platform all
```

---

## ✅ Checklist Final

### Antes de Submeter

- [ ] **Testes completos** em dispositivos reais
- [ ] **Performance** - Sem crashes, sem lag
- [ ] **Acessibilidade** - VoiceOver/TalkBack funcionando
- [ ] **Privacidade** - Política completa e acessível
- [ ] **LGPD** - Conformidade verificada
- [ ] **Conteúdo** - Sem conteúdo ofensivo
- [ ] **IA** - Disclaimer médico visível
- [ ] **Assets** - Todos os tamanhos corretos
- [ ] **Metadata** - Preenchido completamente
- [ ] **Screenshots** - Atualizados e representativos

---

## 🚀 Próximos Passos Imediatos

1. **Atualizar app.config.js:**
   - `userInterfaceStyle: 'automatic'`
   - Adicionar `privacyManifests` (iOS)
   - Adicionar `targetSdkVersion` (Android)

2. **Criar assets:**
   - App icons (iOS + Android)
   - Splash screens
   - Screenshots para lojas

3. **Testar em dispositivos:**
   - iOS 15+ e Android 8.0+
   - Verificar safe areas
   - Testar dark mode

4. **Preparar metadata:**
   - Descrições
   - Keywords
   - Categorias

5. **Build de produção:**
   - EAS Build
   - Testar build
   - EAS Submit

---

**App pronto para submissão nas lojas!** 📱✨

