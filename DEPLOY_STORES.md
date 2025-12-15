# 🚀 Guia de Deploy para App Store e Google Play Store

**App:** Nossa Maternidade  
**Versão:** 1.0.0  
**Data:** 2025

---

## 📋 Pré-requisitos

### Contas Necessárias

- [ ] **Apple Developer Account** ($99/ano) - [developer.apple.com](https://developer.apple.com)
- [ ] **Google Play Console** ($25 único) - [play.google.com/console](https://play.google.com/console)
- [ ] **EAS Account** (gratuito) - [expo.dev](https://expo.dev)

### Ferramentas

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no EAS
eas login

# Verificar configuração
eas whoami
```

---

## 🔧 Configuração Inicial

### 1. Configurar EAS Project

O projeto já está configurado com:
- **Project ID:** `ceee9479-e404-47b8-bc37-4f913c18f270`
- **Bundle ID iOS:** `com.nossamaternidade.app`
- **Package Android:** `com.nossamaternidade.app`

### 2. Configurar Secrets (Variáveis de Ambiente)

Configure secrets para produção no EAS:

```bash
# Supabase
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"

# APIs de IA
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "xai-..."

# Feature Flags
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value "true"
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_ANALYTICS --value "true"

# Ver todos os secrets
eas secret:list
```

---

## 📦 Build para Produção

### iOS (App Store)

```bash
# Build para App Store
eas build --platform ios --profile production

# Ou build local (requer macOS)
eas build --platform ios --profile production --local
```

**Notas:**
- Builds iOS requerem certificados e provisioning profiles (EAS gerencia automaticamente)
- Primeira build pode demorar ~20-30 minutos
- Builds subsequentes são mais rápidas devido ao cache

### Android (Google Play)

```bash
# Build para Google Play (AAB)
eas build --platform android --profile production

# Ou APK para testes internos
eas build --platform android --profile preview
```

**Notas:**
- Build Android gera AAB (Android App Bundle) por padrão
- AAB é obrigatório para Google Play (APK é apenas para testes)
- Build Android demora ~15-20 minutos

### Build Ambas as Plataformas

```bash
# Build iOS + Android simultaneamente
eas build --platform all --profile production
```

---

## 📤 Submissão para as Lojas

### iOS (App Store Connect)

```bash
# Submit para App Store
eas submit --platform ios

# Ou submit de build específica
eas submit --platform ios --latest
```

**Antes de Submeter:**
1. Crie o app no [App Store Connect](https://appstoreconnect.apple.com)
2. Configure metadata (nome, descrição, screenshots)
3. Preencha informações de privacidade
4. Configure preço e disponibilidade

**Requisitos iOS:**
- Screenshots: iPhone 6.7" (1290×2796px) - mínimo 3
- Screenshots: iPhone 6.5" (1284×2778px) - mínimo 3
- Privacy Policy URL obrigatória
- Classificação etária: 17+ (conteúdo sensível relacionado a saúde mental)

### Android (Google Play Console)

```bash
# Submit para Google Play
eas submit --platform android

# Ou submit de build específica
eas submit --platform android --latest
```

**Antes de Submeter:**
1. Crie o app no [Google Play Console](https://play.google.com/console)
2. Configure metadata (nome, descrição, screenshots)
3. Preencha Data Safety
4. Configure classificação de conteúdo (PEGI/ESRB)

**Requisitos Android:**
- Feature Graphic: 1024×500px (obrigatório)
- Screenshots: 1080×1920px - mínimo 2, máximo 8
- Privacy Policy URL obrigatória
- Classificação: PEGI 3 / Everyone

---

## ✅ Checklist Pré-Deploy

### Configuração Técnica

- [x] `app.json` configurado com bundle ID/package
- [x] `eas.json` configurado com perfis de build
- [x] Secrets configurados no EAS
- [x] Ícones e splash screens criados
- [ ] Screenshots criados (iOS e Android)
- [ ] Feature Graphic criado (Android)

### Testes

- [ ] Testado em dispositivo iOS real
- [ ] Testado em dispositivo Android real
- [ ] Testado notificações push
- [ ] Testado permissões (câmera, microfone, localização)
- [ ] Testado dark mode
- [ ] Testado navegação e gestos
- [ ] Testado acessibilidade (VoiceOver/TalkBack)

### Conformidade

- [ ] Privacy Policy criada e hospedada
- [ ] Terms of Service criados e hospedados
- [ ] LGPD compliance verificada
- [ ] Disclaimer médico implementado
- [ ] Data Safety configurado (Google Play)
- [ ] Privacy Manifest configurado (iOS)

### Assets

- [x] App Icon (1024×1024px)
- [x] Splash Screen
- [x] Adaptive Icon (Android)
- [ ] Screenshots iOS (mínimo 3 por tamanho)
- [ ] Screenshots Android (mínimo 2)
- [ ] Feature Graphic Android (1024×500px)

---

## 📊 Monitoramento Pós-Deploy

### EAS Updates (OTA)

```bash
# Publicar update OTA
eas update --branch production --message "Bug fixes and improvements"

# Ver status dos updates
eas update:list
```

### Analytics e Crash Reporting

Configure (quando implementado):
- **Sentry** para crash reporting
- **Analytics** para métricas de uso
- **RevenueCat** para analytics de compras (se aplicável)

---

## 🐛 Troubleshooting

### Build Falha

```bash
# Limpar cache e tentar novamente
eas build --platform ios --clear-cache --profile production
```

### Submit Falha

```bash
# Ver logs detalhados
eas submit --platform ios --verbose
```

### Secrets Não Funcionam

```bash
# Verificar secrets configurados
eas secret:list

# Verificar se secret existe
eas secret:get EXPO_PUBLIC_SUPABASE_URL
```

---

## 📚 Recursos Adicionais

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [Google Play Console Guide](https://support.google.com/googleplay/android-developer)

---

**Última atualização:** 2025

