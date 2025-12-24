# 📱 App Store Connect - Guia Completo de Configuração

**App**: Nossa Maternidade
**Status**: ✅ Configurado no App Store Connect
**Bundle ID**: `br.com.nossamaternidade.app`
**Data**: 24 de dezembro de 2024

---

## ✅ CONFIGURAÇÕES APLICADAS

### 1. Bundle ID Atualizado
- [x] `app.json:27` → `br.com.nossamaternidade.app`
- [x] SKU atualizado em `eas.json` → `nossamaternidade001`

### 2. App Store Connect
- [x] App criado
- [x] Bundle ID registrado
- [x] Status: "Preparar para envio"

---

## 🔧 PRÓXIMOS PASSOS OBRIGATÓRIOS

### PASSO 1: Obter IDs Necessários

Você precisa de 2 IDs para completar a configuração:

#### 1.1 App Store Connect ID (ascAppId)

**Como encontrar:**
```
1. Acesse: https://appstoreconnect.apple.com/apps
2. Clique em "Nossa Maternidade"
3. Na URL, veja o número após /apps/
   Exemplo: https://appstoreconnect.apple.com/apps/1234567890/appstore
   Seu ID: 1234567890
```

#### 1.2 Apple Team ID (appleTeamId)

**Como encontrar:**
```
1. Acesse: https://developer.apple.com/account
2. Clique em "Membership" no menu lateral
3. Procure por "Team ID"
   Formato: ABC123DEFG (10 caracteres alfanuméricos)
```

---

### PASSO 2: Atualizar eas.json

Depois de obter os IDs, edite `eas.json:100-101`:

```json
"ascAppId": "1234567890",        // Substituir com seu ID real
"appleTeamId": "ABC123DEFG"      // Substituir com seu Team ID real
```

**Comando rápido:**
```bash
# Editar arquivo
code eas.json  # ou vim/nano/etc

# Ou usar sed (substitua pelos seus IDs)
sed -i 's/SEU_APP_STORE_CONNECT_ID_AQUI/1234567890/' eas.json
sed -i 's/SEU_TEAM_ID_AQUI/ABC123DEFG/' eas.json
```

---

### PASSO 3: Configurar RevenueCat (CRÍTICO!)

RevenueCat precisa do **Bundle ID correto** no dashboard:

```
1. Acesse: https://app.revenuecat.com
2. Vá em "Projects" → "Nossa Maternidade"
3. Configure o Bundle ID: br.com.nossamaternidade.app
4. Adicione os produtos (monthly/yearly):
   - nossa_maternidade_monthly
   - nossa_maternidade_yearly
```

**⚠️ Importante**: Bundle ID no RevenueCat **DEVE** corresponder exatamente ao do app.

---

### PASSO 4: Criar Produtos In-App Purchase (App Store Connect)

Configure as assinaturas no App Store Connect:

```
1. App Store Connect → "Nossa Maternidade" → "In-App Purchases"
2. Clique em "+" para criar novo produto
3. Escolha "Auto-Renewable Subscription"

PRODUTO 1: Mensal
- Product ID: nossa_maternidade_monthly
- Reference Name: Nossa Maternidade Premium - Mensal
- Subscription Group: Nossa Maternidade Premium
- Subscription Duration: 1 Month
- Price: R$ 29,90/mês (ou seu preço)

PRODUTO 2: Anual
- Product ID: nossa_maternidade_yearly
- Reference Name: Nossa Maternidade Premium - Anual
- Subscription Group: Nossa Maternidade Premium
- Subscription Duration: 1 Year
- Price: R$ 299,90/ano (ou seu preço, ~20% desconto)
```

**Depois de criar**, configure no RevenueCat dashboard:
```
RevenueCat → "Products" → "Add Product"
- Platform: iOS
- Product ID: nossa_maternidade_monthly (deve corresponder EXATAMENTE)
- Product ID: nossa_maternidade_yearly
```

---

### PASSO 5: Primeiro Build com EAS

Agora que tudo está configurado, faça o primeiro build:

```bash
# 1. Instale EAS CLI (se não tiver)
npm install -g eas-cli

# 2. Login no Expo
eas login

# 3. Build de produção para iOS
eas build --platform ios --profile production

# Aguarde ~10-15 minutos para o build completar
# EAS vai gerar um arquivo .ipa automaticamente
```

**O que o EAS faz automaticamente:**
- ✅ Gera certificados de distribuição
- ✅ Cria provisioning profiles
- ✅ Assina o app
- ✅ Gera arquivo .ipa pronto para upload

---

### PASSO 6: Upload para App Store Connect

Depois do build completar:

**Opção A: EAS Submit (Recomendado)**
```bash
eas submit --platform ios --profile production
```

**Opção B: Transporter App**
```
1. Baixe o .ipa do EAS build
2. Abra "Transporter" no Mac
3. Arraste o .ipa para o Transporter
4. Clique em "Deliver"
```

---

### PASSO 7: Completar Informações no App Store Connect

Depois do upload, complete no App Store Connect:

#### 7.1 App Information
```
- Name: Nossa Maternidade
- Subtitle: Sua companheira durante a gestação
- Privacy Policy URL: https://nossamaternidade.com.br/privacidade
- Category: Health & Fitness (ou Lifestyle)
- Secondary Category: Medical
```

#### 7.2 Pricing and Availability
```
- Price: Free (com In-App Purchases)
- Availability: All countries ou Brazil only
```

#### 7.3 Version Information (1.0)
```
- What's New: "Versão inicial do Nossa Maternidade!"
- Description: [Sua descrição completa do app]
- Keywords: maternidade,gestação,gravidez,bebê,saúde,mãe
- Support URL: https://nossamaternidade.com.br/suporte
- Marketing URL: https://nossamaternidade.com.br
```

#### 7.4 Screenshots (OBRIGATÓRIO)

Você precisa de screenshots para:
- iPhone 6.7" (iPhone 15 Pro Max, 14 Pro Max, etc)
- iPhone 6.5" (iPhone 11 Pro Max, XS Max, etc)

**Dimensões:**
- 6.7": 1290 x 2796 pixels (portrait)
- 6.5": 1242 x 2688 pixels (portrait)

**Mínimo**: 3 screenshots
**Recomendado**: 5-10 screenshots

**Dica**: Use o simulador iOS para capturar:
```bash
# Executar no simulador
npx expo start --ios

# No simulador: Cmd + S para capturar screenshot
# Screenshots salvos em: ~/Desktop
```

#### 7.5 App Privacy (CRÍTICO!)

Configure a privacidade do app:

```
Data Types Collected:
- ✅ Contact Info (email)
- ✅ Health & Fitness (menstrual cycle, pregnancy data)
- ✅ User Content (posts, messages)
- ✅ Identifiers (user ID)
- ✅ Usage Data (analytics)

Purpose:
- App Functionality
- Analytics
- Product Personalization
```

**Link útil**: Você já tem privacy policy em `https://nossamaternidade.com.br/privacidade`

#### 7.6 Age Rating
```
- Infrequent/Mild Medical/Treatment Information: Yes
- Unrestricted Web Access: Yes (se houver browser)
- Age Rating: 12+ (devido a conteúdo de saúde/gravidez)
```

---

### PASSO 8: Testes Finais

Antes de submeter para review:

```bash
# 1. Instale o build no dispositivo físico
eas build --platform ios --profile preview
# Baixe o .ipa e instale via TestFlight

# 2. Teste TODOS os fluxos críticos:
- [ ] Login/Cadastro
- [ ] Onboarding completo
- [ ] Chat com NathIA (AI)
- [ ] Comunidade (posts, likes, comentários)
- [ ] Ciclo menstrual
- [ ] Notificações push
- [ ] Compra de assinatura (IN-APP PURCHASE!)
- [ ] Restaurar compras

# 3. Teste em DIFERENTES dispositivos:
- iPhone com iOS 15 (mínimo suportado)
- iPhone com iOS 17/18 (mais recente)
```

---

### PASSO 9: Submeter para Review

Quando tudo estiver pronto:

```
1. App Store Connect → "Nossa Maternidade" → "1.0 Prepare for Submission"
2. Revise TODAS as informações
3. Clique em "Submit for Review"
4. Aguarde 24-48h para review da Apple
```

**Checklist final antes de submeter:**
- [ ] Todos os screenshots adicionados
- [ ] Descrição completa e correta
- [ ] Privacy policy configurada
- [ ] In-App Purchases configurados
- [ ] Testado em dispositivo físico
- [ ] Sem crashes ou bugs críticos
- [ ] App funciona offline (se aplicável)

---

## ⚠️ ALERTAS CRÍTICOS

### 1. Bundle ID NÃO PODE SER ALTERADO
Depois de publicar, `br.com.nossamaternidade.app` é **permanente**. Nunca mude!

### 2. In-App Purchases
- Produtos devem ser **idênticos** em App Store Connect e RevenueCat
- **Não teste** compras com sandbox em produção (use preview build)

### 3. Rejeições Comuns da Apple
- ❌ Screenshots sem conteúdo real do app
- ❌ Descrição genérica ou com erros
- ❌ Privacy policy ausente ou incompleta
- ❌ App crasha na review
- ❌ Login obrigatório sem credenciais de teste

**Dica**: Forneça credenciais de teste na seção "App Review Information"

### 4. Primeira Aprovação
Primeira aprovação pode demorar **3-5 dias**. Depois, updates demoram 24-48h.

---

## 📋 CHECKLIST COMPLETO

### Configuração (Você faz AGORA)
- [ ] Obter App Store Connect ID
- [ ] Obter Apple Team ID
- [ ] Atualizar `eas.json` com IDs
- [ ] Configurar RevenueCat dashboard
- [ ] Criar produtos In-App Purchase

### Build & Upload (Você faz DEPOIS)
- [ ] Primeiro build EAS (`eas build --platform ios --profile production`)
- [ ] Upload para App Store Connect (`eas submit`)
- [ ] Verificar build aparece no App Store Connect

### App Store Connect (Você faz DEPOIS)
- [ ] Adicionar screenshots (mínimo 3)
- [ ] Preencher descrição completa
- [ ] Configurar App Privacy
- [ ] Definir Age Rating
- [ ] Configurar In-App Purchases
- [ ] Adicionar Support URL

### Testes (Você faz ANTES de submeter)
- [ ] Testar em dispositivo físico
- [ ] Testar todos os fluxos críticos
- [ ] Testar compras (sandbox)
- [ ] Verificar notificações push

### Review (Último passo)
- [ ] Submeter para review
- [ ] Aguardar aprovação (3-5 dias)
- [ ] Resolver eventuais rejeições

---

## 🆘 COMANDOS ÚTEIS

```bash
# Listar builds
eas build:list

# Ver status de build específico
eas build:view <build-id>

# Cancelar build
eas build:cancel

# Ver logs de build
eas build:view --log

# Verificar configuração EAS
eas config

# Ver credenciais configuradas
eas credentials
```

---

## 📚 RECURSOS

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com/account)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [RevenueCat Dashboard](https://app.revenuecat.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

## ❓ PERGUNTAS FREQUENTES

**Q: Quanto tempo leva para a Apple aprovar?**
A: Primeira submissão: 3-5 dias. Updates subsequentes: 24-48h.

**Q: Posso testar compras antes de publicar?**
A: Sim! Use sandbox testing no Xcode ou preview build do EAS.

**Q: Preciso de Mac para publicar?**
A: **NÃO!** EAS Build faz tudo na nuvem. Você só precisa de conta Apple Developer.

**Q: Quanto custa conta Apple Developer?**
A: $99/ano (USD). Obrigatório para publicar na App Store.

**Q: Posso atualizar o app depois de publicado?**
A: Sim! Incremente `buildNumber` no `app.json` e faça novo build.

---

**Última atualização**: 24 de dezembro de 2024
**Próxima ação**: Obter App Store Connect ID e Apple Team ID
