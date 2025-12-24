# Checklist Pós-Aprovação Apple Developer

## Quando Sua Conta For Aprovada

Execute estes passos na ordem:

---

## ✅ Passo 1: Verificar Team ID

1. Acesse: https://developer.apple.com/account
2. Faça login
3. Vá em **Membership**
4. Copie o **Team ID** (ex: `ABC123DEF4`)

**Atualizar `eas.json`:**
```json
"submit": {
  "production": {
    "ios": {
      "appleTeamId": "COLE_SEU_TEAM_ID_AQUI"
    }
  }
}
```

---

## ✅ Passo 2: Criar App no App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Clique em **My Apps** → **+** → **New App**
3. Preencha:
   - **Platform:** iOS
   - **Name:** Nossa Maternidade
   - **Primary Language:** Português (Brasil)
   - **Bundle ID:** `com.nossamaternidade.app` (selecione existente ou crie)
   - **SKU:** `NOSSA_MATERNIDADE_2025`
4. Clique em **Create**

---

## ✅ Passo 3: Obter App Store Connect ID

1. No App Store Connect, selecione **Nossa Maternidade**
2. Vá em **App Information**
3. Copie o **Apple ID** (número, ex: `1234567890`)

**Atualizar `eas.json`:**
```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "COLE_SEU_APP_STORE_CONNECT_ID_AQUI"
    }
  }
}
```

---

## ✅ Passo 4: Configurar Assinaturas (Premium)

1. No App Store Connect, vá em **Features** → **Subscriptions**
2. Clique em **+** para criar Subscription Group
3. Nome: **Nossa Maternidade Premium**
4. Crie 2 produtos:

**Mensal:**
- Product ID: `nossa_maternidade_monthly`
- Price: R$ 19,90
- Free Trial: 7 days

**Anual:**
- Product ID: `nossa_maternidade_yearly`
- Price: R$ 99,00
- Free Trial: 7 days

---

## ✅ Passo 5: Configurar RevenueCat (Opcional)

1. Acesse: https://app.revenuecat.com
2. Crie projeto: **Nossa Maternidade**
3. Configure app iOS:
   - Bundle ID: `com.nossamaternidade.app`
   - Conecte App Store Connect
4. Copie a **Public SDK Key** (iOS)
5. Configure EAS Secret:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "sua-ios-key"
```

---

## ✅ Passo 6: Primeiro Build

```bash
# Build de produção
eas build --profile production --platform ios

# Aguarde conclusão (15-30 min)
# O EAS criará certificados automaticamente
```

---

## ✅ Passo 7: Testar no TestFlight

**Guia completo:** Veja `docs/TESTFLIGHT_GUIA_COMPLETO.md`

**Resumo rápido:**
1. Após o build concluir, vá em **App Store Connect**
2. Selecione seu app → Aba **TestFlight**
3. Preencha **Test Information** (descrição do beta)
4. Crie grupo **Internal Testing**
5. Adicione seu email como testador interno
6. Instale **TestFlight app** no iPhone (App Store)
7. Abra email de convite → Instale o beta
8. Teste todas as funcionalidades

**Referência:** [TestFlight - Apple Developer](https://developer.apple.com/testflight/)

---

## ✅ Passo 8: Preparar Submissão

1. Preencha **App Information**:
   - Descrição curta
   - Descrição completa
   - Keywords
   - Categoria: Saúde e fitness
   - Privacy Policy URL: https://nossamaternidade.com.br/privacidade

2. Adicione **Screenshots**:
   - iPhone 6.7" (Pro Max)
   - iPhone 6.5" (Plus)
   - iPhone 5.5" (SE)

3. Configure **App Privacy**:
   - Declare tipos de dados coletados
   - Configure permissões

---

## ✅ Passo 9: Submeter para Review

```bash
# Submit para App Store
eas submit --profile production --platform ios
```

Ou via App Store Connect:
1. Vá em **App Store** → **+ Version**
2. Selecione build
3. Preencha informações
4. Clique em **Submit for Review**

---

## ⏱️ Tempo Estimado Total

- Verificação e configuração: **30 min**
- Primeiro build: **15-30 min**
- TestFlight: **1-2 horas de testes**
- Preparação submissão: **1-2 horas**
- Review Apple: **24-48 horas**

**Total:** ~2-3 horas de trabalho + aguardar review

---

## 📝 Notas Importantes

- **Certificados:** EAS cria automaticamente (não precisa fazer manualmente)
- **Provisioning Profiles:** EAS gerencia automaticamente
- **Privacy Policy:** Deve estar publicada antes de submeter
- **TestFlight:** Obrigatório para testar antes de publicar

---

## 🆘 Problemas Comuns

### "Team ID not found"
- Verifique se copiou o Team ID corretamente
- Aguarde alguns minutos após aprovação

### "App Store Connect ID invalid"
- Verifique se criou o app no App Store Connect
- Verifique se o ID está correto (número, não Bundle ID)

### "Build failed - certificates"
- EAS cria automaticamente na primeira vez
- Se falhar, aguarde 5 min e tente novamente

---

## Referências

- [App Store Connect](https://appstoreconnect.apple.com)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/ios/)

