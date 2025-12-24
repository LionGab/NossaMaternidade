# Configuração iOS-Only - Nossa Maternidade

## Status Atual

✅ **iOS configurado e pronto para produção**

- Apple Team ID configurado no `eas.json`
- App Store Connect ID configurado no `eas.json`
- Bundle ID: `com.nossamaternidade.app`

⚠️ **Android opcional** (pode ser configurado depois)

---

## Checklist iOS - Pronto para Build

### ✅ Já Configurado

- [x] Apple Developer Account criado
- [x] App Store Connect ID configurado
- [x] Apple Team ID configurado
- [x] Bundle ID: `com.nossamaternidade.app`
- [x] Privacy Manifest iOS 17+ configurado
- [x] Permissões iOS configuradas
- [x] Supabase configurado
- [x] Edge Functions criadas

### ⚠️ Pendente (Opcional mas Recomendado)

- [ ] RevenueCat iOS Key configurado (para monetização)
- [ ] EAS Secrets configurados (para builds)
- [ ] App criado no App Store Connect
- [ ] Produtos de assinatura criados no App Store Connect

---

## Próximos Passos para iOS

### 1. Criar App no App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Clique em **My Apps** → **+** → **New App**
3. Preencha:
   - **Platform:** iOS
   - **Name:** Nossa Maternidade
   - **Primary Language:** Português (Brasil)
   - **Bundle ID:** `com.nossamaternidade.app` (selecione o existente)
   - **SKU:** `NOSSA_MATERNIDADE_2025`
4. Clique em **Create**

### 2. Configurar Assinaturas (Premium)

1. No App Store Connect, vá em **Features** → **Subscriptions**
2. Clique em **+** para criar Subscription Group
3. Nome do grupo: **Nossa Maternidade Premium**
4. Crie 2 produtos:

**Produto Mensal:**

- **Product ID:** `nossa_maternidade_monthly`
- **Reference Name:** Plano Mensal
- **Duration:** 1 Month
- **Price:** R$ 19,90 (Brasil)
- **Free Trial:** 7 days (opcional)

**Produto Anual:**

- **Product ID:** `nossa_maternidade_yearly`
- **Reference Name:** Plano Anual
- **Duration:** 1 Year
- **Price:** R$ 99,00 (Brasil)
- **Free Trial:** 7 days (opcional)

### 3. Configurar RevenueCat (Opcional mas Recomendado)

1. Acesse: https://app.revenuecat.com
2. Crie projeto: **Nossa Maternidade**
3. Configure app iOS:
   - **Bundle ID:** `com.nossamaternidade.app`
   - **App Store Connect:** Conecte sua conta
4. Copie a **Public SDK Key** (iOS)
5. Configure no EAS Secrets:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "sua-ios-key-aqui"
```

### 4. Configurar EAS Secrets (Para Builds)

```bash
# Supabase (obrigatório)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sua-anon-key"

# RevenueCat (opcional mas recomendado)
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "sua-ios-key"

# Sentry (opcional)
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "sua-sentry-dsn"
```

### 5. Build para iOS

```bash
# Build de desenvolvimento (para testar)
eas build --profile development --platform ios

# Build de preview (para TestFlight)
eas build --profile preview --platform ios

# Build de produção (para App Store)
eas build --profile production --platform ios
```

### 6. Submit para App Store

```bash
# Após o build ser aprovado
eas submit --profile production --platform ios
```

---

## Verificação Rápida

Execute o script de verificação (Android será ignorado):

```bash
bash scripts/verify-production-ready.sh
```

---

## Notas Importantes

### iOS-Only Development

- Você pode desenvolver e testar apenas no iOS
- O app funcionará normalmente sem configuração Android
- RevenueCat funciona apenas no iOS se configurado
- Builds Android podem ser feitos depois quando necessário

### Quando Adicionar Android

Quando decidir publicar no Android:

1. Crie conta Google Play Developer ($25 único)
2. Siga: `docs/GOOGLE_PLAY_SERVICE_ACCOUNT.md`
3. Configure RevenueCat Android Key
4. Faça build Android: `eas build --profile production --platform android`

---

## Referências

- [App Store Connect](https://appstoreconnect.apple.com)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/ios/)
