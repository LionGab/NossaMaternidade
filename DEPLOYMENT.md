# Deployment Guide - Apple App Store & Google Play Store

## 📋 Pre-Deployment Checklist

### App Metadata
- [ ] App Name: "Nossa Maternidade"
- [ ] Bundle ID iOS: `com.nossmaternidade.app`
- [ ] Package Name Android: `com.nossmaternidade.app`
- [ ] Version: 1.0.0
- [ ] Build Number: 1

### Assets
- [ ] App Icon (1024x1024px) - `assets/icon.png`
- [ ] Splash Screen (1242x2436px) - `assets/splash.png`
- [ ] Screenshots for App Store (6-10 per platform)
- [ ] Promotional graphics & descriptions

### Legal
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] COPPA compliance (if targeting under 13)
- [ ] Parental consent forms if needed

---

## 🍎 Apple App Store Deployment

### Step 1: Prepare Apple Developer Account
```bash
# Create Apple Developer account if you don't have one
# https://developer.apple.com/account/

# Create App ID in Xcode or App Store Connect
# Use Bundle ID: com.nossmaternidade.app
```

### Step 2: Generate Build with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo/EAS account
eas login

# Configure for iOS
eas build --platform ios --setup

# Build for App Store (production)
eas build --platform ios --auto-submit
```

### Step 3: Upload to App Store Connect

```bash
# After successful build, submit automatically with --auto-submit
# Or manually upload via Transporter app

# Manual submission:
# 1. Download .ipa file from EAS
# 2. Open Transporter app on Mac
# 3. Select .ipa and upload
# 4. Go to App Store Connect to submit for review
```

### Step 4: App Store Review

1. **Submit for Review** in App Store Connect
2. **Wait for Apple Review** (typically 24-48 hours)
3. **Monitor Status** and respond to any requests
4. **Release** when approved (automatic or manual)

### iOS Build Metadata in app.json

```json
{
  "ios": {
    "bundleIdentifier": "com.nossmaternidade.app",
    "buildNumber": "1",
    "supportsTabletMode": false,
    "infoPlist": {
      "UIRequiredDeviceCapabilities": ["opengles2"]
    }
  }
}
```

---

## 🤖 Google Play Store Deployment

### Step 1: Create Google Play Developer Account
```bash
# Create account at https://play.google.com/console
# Pay $25 one-time fee
# Complete merchant profile setup
```

### Step 2: Generate Build with EAS

```bash
# Configure for Android
eas build --platform android --setup

# Choose production build (not preview)
eas build --platform android --release-channel production
```

### Step 3: Generate Signing Key

```bash
# EAS will prompt you to create a signing key
# Store credentials securely in eas.json
# Never share private keys

# If creating manually:
# keytool -genkey -v -keystore nossa-maternidade.keystore \
#   -keyalg RSA -keysize 2048 -validity 10000 \
#   -alias nossa-maternidade
```

### Step 4: Upload to Google Play Console

```bash
# After successful build, download .aab (Android App Bundle)
# Or configure automatic upload in eas.json

# Manual submission:
# 1. Go to Google Play Console
# 2. Create new app: "Nossa Maternidade"
# 3. Fill content rating questionnaire
# 4. Add app icon, screenshots, description
# 5. Upload .aab file in Production track
# 6. Review pricing and distribution
# 7. Submit for review
```

### Step 5: Staged Rollout

```bash
# Start with 5-10% of users for stability testing
# Monitor crash reports and ratings
# Increase to 25% → 50% → 100% over 3-5 days
```

### Android Build Metadata in app.json

```json
{
  "android": {
    "package": "com.nossmaternidade.app",
    "versionCode": 1,
    "permissions": ["INTERNET"],
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#FFFFFF"
    }
  }
}
```

---

## 📊 App Store Screenshots & Description

### Screenshots (All Platforms)

**Screenshot 1: Home Feed**
- Featured Nathália content
- Viral content card
- Copy: "Acompanhe as novidades com Nathália Valente"

**Screenshot 2: Comunidade**
- Trending topics
- Community stats
- Copy: "Conecte-se com outras mães"

**Screenshot 3: NathIA**
- AI Assistant
- Quick questions
- Copy: "Assistência 24/7 sobre maternidade"

**Screenshot 4: Hábitos**
- Habit tracker
- Daily progress
- Copy: "Cuide de si mesma com hábitos diários"

**Screenshot 5: Mundo da Nath**
- NAVA shop + courses
- Exclusive content
- Copy: "Acesse conteúdo exclusivo"

**Screenshot 6: Download CTA**
- App icon
- Main benefits
- Copy: "Baixe agora gratuitamente"

### App Store Description

```
🤰 Nossa Maternidade - Sua Companheira na Jornada Maternal

Bem-vinda ao aplicativo oficial de suporte à maternidade baseado na experiência de Nathália Valente!

✨ RECURSOS PRINCIPAIS:

📱 Feed Exclusivo
Acompanhe conteúdo original de Nathália sobre maternidade, parto, cuidados com o bebê e muito mais.

👥 Comunidade de Mães
Conecte-se com milhares de mães brasileiras. Compartilhe experiências, dúvidas e celebre vitórias juntas.

🤖 NathIA - Sua Assistente Virtual
Faça perguntas sobre amamentação, sono do bebê, pós-parto e receba respostas personalizadas em tempo real.

🌍 Mundo da Nath
Acesse a NAVA Beachwear, conheça projetos sociais e participe de cursos & mentorias exclusivas.

💪 Rastreador de Hábitos
Desenvolva rotinas de autocuidado com 8 hábitos sugeridos: skincare, meditação, treino, e muito mais!

🔐 SEGURANÇA
Sua privacidade é nossa prioridade. Todos os dados são criptografados e protegidos.

💖 Comunidade Acolhedora
Um espaço seguro, sem julgamentos, onde todas as mães são bem-vindas.

Baixe agora e faça parte de uma comunidade de mais de 12 mil mães que já estão transformando suas vidas!

---
Desenvolvido com ❤️ por e para mães brasileiras.
```

---

## 🔄 Update Deployment Workflow

### Minor Updates (Bug Fixes)

```bash
# 1. Fix bugs and update code
# 2. Update version in app.json and package.json
eas build --platform ios --auto-submit
eas build --platform android

# 3. Upload Android build to Play Console
# 4. Both stores usually approve within 1-2 hours for minor updates
```

### Major Updates (New Features)

```bash
# 1. Implement features
# 2. Test thoroughly on both devices
# 3. Update version numbers (1.0.0 → 1.1.0)
# 4. Build with EAS
# 5. Write detailed release notes
# 6. Submit for review
# 7. Apple: 24-48 hours typical
# 8. Google: 2-3 hours typical
```

---

## 📊 Post-Launch Monitoring

### Analytics to Track
- Daily/Monthly Active Users
- Crash rates
- Average session duration
- Feature usage
- Screen flow/retention

### Tools Recommended
- Firebase Analytics (free)
- Sentry for crash reporting
- App Store Connect dashboard
- Google Play Console dashboard

### Configuration Example

```bash
# Add Firebase Analytics
npm install @react-native-firebase/analytics

# Add Sentry for crashes
npm install @sentry/react-native
```

---

## 🚀 Launch Timeline

**Week 1: Preparation**
- Complete all assets and metadata
- Create App Store Connect listing
- Create Google Play Console listing
- Schedule submission

**Week 2: Submission**
- Submit to both stores
- Monitor review status
- Prepare for approval

**Week 3: Launch**
- Set release date
- Promote on social media
- Monitor early user feedback
- Be ready for critical issues

---

## 💡 Tips for Success

1. **Ratings & Reviews**: Respond to all reviews professionally
2. **Updates**: Release updates regularly (monthly recommended)
3. **Support**: Include support email in app description
4. **Testing**: Use TestFlight (iOS) and Internal Testing (Android) before public release
5. **Marketing**: Leverage Nathália's social media (24M TikTok followers!)
6. **Community**: Engage with users in reviews and through in-app chat

---

## 🔗 Important Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [EAS Build Dashboard](https://expo.dev/eas)
- [Apple Developer Docs](https://developer.apple.com/documentation/)
- [Google Play Developer Docs](https://developer.android.com/)

---

## ⚠️ Common Rejection Reasons & Fixes

### Apple App Store
- **Crash on startup** → Test thoroughly before submission
- **Missing privacy policy** → Add URL in app.json
- **Unclear purpose** → Write clear description
- **Inappropriate content** → Review all user-generated content moderation

### Google Play
- **Excessive ads** → Avoid aggressive monetization early
- **Broken links** → Test all URLs in app
- **Poor quality** → Ensure 60fps, no crashes
- **Policy violations** → Review Google Play policies

---

**Next Steps**: After approval, celebrate! 🎉 Then focus on user acquisition through Nathália's social channels.
