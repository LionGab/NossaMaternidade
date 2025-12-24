# 🚀 Próximos Passos: Build e Publicação

**App**: Nossa Maternidade
**Status**: ✅ **100% CONFIGURADO - PRONTO PARA BUILD!**
**Data**: 24 de dezembro de 2024

---

## ✅ CONFIGURAÇÃO COMPLETA

Todos os IDs necessários foram configurados:

| Item | Valor | Status |
|------|-------|--------|
| Bundle ID | `br.com.nossamaternidade.app` | ✅ |
| App Store Connect ID | `6756980888` | ✅ |
| Apple Team ID | `KZPW4S77UH` | ✅ |
| SKU | `nossamaternidade001` | ✅ |
| APN Key ID | `7NM7SXW7DV` | ⚠️ REVOGAR |

---

## 🎯 ROADMAP COMPLETO

### FASE 1: Segurança e Preparação (URGENTE!)

#### 1.1 Revogar Chave APNs Exposta
**Tempo**: 5 minutos
**Prioridade**: 🔴 CRÍTICA

```
1. Acesse: https://developer.apple.com/account/resources/authkeys/list
2. Encontre "APN Nossa Maternidade" (ID: 7NM7SXW7DV)
3. Clique no ícone de lixeira ou "Revoke"
4. Confirme a revogação
```

#### 1.2 Gerar Nova Chave APNs
**Tempo**: 3 minutos

```
1. No mesmo portal, clique no botão "+"
2. Nome: "APN Nossa Maternidade v2"
3. Habilite: "Apple Push Notifications service (APNs)"
4. Clique em "Continue" → "Register"
5. BAIXE o arquivo .p8 IMEDIATAMENTE
6. Guarde em gerenciador de senhas (1Password, Bitwarden)
```

**⚠️ CRÍTICO**: Você só pode baixar a chave UMA VEZ!

#### 1.3 Configurar Nova Chave no Supabase
**Tempo**: 5 minutos

```bash
# Substituir pelos seus valores reais
npx supabase secrets set APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[CONTEÚDO DA NOVA CHAVE .p8]
-----END PRIVATE KEY-----"

npx supabase secrets set APNS_KEY_ID="ABC123XYZ"  # ID da nova chave
npx supabase secrets set APNS_TEAM_ID="KZPW4S77UH"
```

---

### FASE 2: Configuração RevenueCat

#### 2.1 Acessar Dashboard
**Tempo**: 2 minutos

```
1. Acesse: https://app.revenuecat.com
2. Login com sua conta
3. Selecione projeto "Nossa Maternidade" (ou crie se não existir)
```

#### 2.2 Configurar App iOS
**Tempo**: 3 minutos

```
1. Dashboard → "Apps" → "Add App" (ou editar existente)
2. Platform: iOS
3. Bundle ID: br.com.nossamaternidade.app ← EXATO!
4. App Name: Nossa Maternidade
5. Clique em "Save"
```

#### 2.3 Conectar Apple App Store
**Tempo**: 5 minutos

```
1. Dashboard → "Integrations" → "App Store Connect"
2. Clique em "Add Credentials"
3. Upload da chave In-App Purchase (.p8):
   - Gere em: https://appstoreconnect.apple.com/access/api
   - Permissões: "App Manager" ou "Admin"
4. Issuer ID: (encontre em App Store Connect → Users and Access → Keys)
5. Key ID: (ID da chave que você acabou de gerar)
6. Clique em "Save"
```

---

### FASE 3: In-App Purchases (App Store Connect)

#### 3.1 Criar Subscription Group
**Tempo**: 2 minutos

```
1. App Store Connect → "Nossa Maternidade" → "Subscriptions"
2. Clique em "+" para criar grupo
3. Reference Name: "Nossa Maternidade Premium"
4. Clique em "Create"
```

#### 3.2 Criar Produto Mensal
**Tempo**: 5 minutos

```
1. Dentro do grupo, clique em "+" para criar assinatura
2. Preencha:
   - Reference Name: Nossa Maternidade Premium - Mensal
   - Product ID: nossa_maternidade_monthly ← EXATO!
   - Subscription Duration: 1 Month

3. Pricing (Próxima tela):
   - Brasil: R$ 29,90/mês (ou seu preço)
   - Pode adicionar outros países depois

4. Localization (pt-BR):
   - Subscription Display Name: Premium Mensal
   - Description: Acesso completo a todos os recursos premium

5. Review Information:
   - Screenshot: (pode pular por enquanto)
   - Review Notes: "Assinatura mensal com renovação automática"

6. Clique em "Save"
```

#### 3.3 Criar Produto Anual
**Tempo**: 5 minutos

```
1. Repita o processo acima com:
   - Reference Name: Nossa Maternidade Premium - Anual
   - Product ID: nossa_maternidade_yearly ← EXATO!
   - Subscription Duration: 1 Year
   - Price: R$ 299,90/ano (~20% desconto)
   - Display Name: Premium Anual
   - Description: Acesso completo por 1 ano (economize 20%)
```

#### 3.4 Vincular no RevenueCat
**Tempo**: 3 minutos

```
1. RevenueCat Dashboard → "Products"
2. Clique em "Add Product"
3. Platform: iOS
4. Product ID: nossa_maternidade_monthly ← EXATAMENTE como App Store
5. Display Name: Premium Mensal
6. Clique em "Save"

7. Repita para yearly:
   - Product ID: nossa_maternidade_yearly
   - Display Name: Premium Anual
```

#### 3.5 Criar Entitlement
**Tempo**: 2 minutos

```
1. RevenueCat → "Entitlements"
2. Clique em "New Entitlement"
3. Identifier: premium ← Já usado no código!
4. Attach Products:
   - nossa_maternidade_monthly ✅
   - nossa_maternidade_yearly ✅
5. Clique em "Save"
```

---

### FASE 4: Primeiro Build EAS

#### 4.1 Instalar EAS CLI
**Tempo**: 2 minutos

```bash
# Instalar globalmente
npm install -g eas-cli

# Verificar instalação
eas --version
```

#### 4.2 Login no Expo
**Tempo**: 1 minuto

```bash
eas login
# Insira suas credenciais Expo
```

#### 4.3 Executar Build de Produção
**Tempo**: 15-20 minutos (build remoto)

```bash
# Build para iOS (produção)
eas build --platform ios --profile production

# O que vai acontecer:
# 1. EAS vai perguntar se quer gerar credenciais → SIM
# 2. Upload do código para servidor EAS
# 3. Build remoto (15-20 min)
# 4. Download automático do .ipa (ou disponível no dashboard)
```

**⚠️ Durante o build:**
- EAS vai gerar certificados automaticamente
- Vai criar provisioning profiles
- Vai assinar o app com seu Team ID
- Vai gerar arquivo `.ipa` pronto para upload

#### 4.4 Monitorar Build
**Tempo**: Enquanto aguarda

```bash
# Ver status do build
eas build:list

# Ver logs em tempo real
eas build:view --log
```

**Ou acompanhe no dashboard**: https://expo.dev/accounts/liongab/projects/nossa-maternidade/builds

---

### FASE 5: Upload para App Store Connect

#### 5.1 Submit Automático (Recomendado)
**Tempo**: 5-10 minutos

```bash
# Depois do build completar
eas submit --platform ios --profile production

# EAS vai:
# 1. Pegar o .ipa do build anterior
# 2. Fazer upload para App Store Connect
# 3. Processar automaticamente
```

#### 5.2 Verificar Upload
**Tempo**: 2 minutos

```
1. App Store Connect → "Nossa Maternidade" → "TestFlight"
2. Aguarde ~5 minutos para processamento
3. Build vai aparecer em "iOS Builds"
4. Aguarde aprovação para TestFlight (~24h)
```

---

### FASE 6: Completar Informações do App

#### 6.1 Screenshots (OBRIGATÓRIO)
**Tempo**: 30-60 minutos

**Dimensões necessárias:**
- iPhone 6.7" (1290 x 2796 px) - iPhone 15 Pro Max
- iPhone 6.5" (1242 x 2688 px) - iPhone 11 Pro Max

**Mínimo**: 3 screenshots
**Recomendado**: 5-10 screenshots

**Como capturar:**
```bash
# 1. Rodar no simulador
npx expo start --ios

# 2. No simulador iOS:
#    - Cmd + S para capturar tela
#    - Screenshots salvos em ~/Desktop

# 3. Ou usar ferramentas:
#    - Fastlane Frameit (adiciona moldura do iPhone)
#    - Figma/Sketch (criar mockups profissionais)
```

**Dicas de conteúdo:**
1. Tela de boas-vindas/onboarding
2. Chat com NathIA (IA)
3. Feed da comunidade
4. Rastreador de ciclo menstrual
5. Perfil do usuário
6. (Opcional) Tela de premium/paywall

#### 6.2 App Information
**Tempo**: 10 minutos

```
App Store Connect → "Nossa Maternidade" → "App Information"

- Name: Nossa Maternidade
- Subtitle: Sua companheira durante a gestação
- Primary Category: Health & Fitness
- Secondary Category: Lifestyle (ou Medical)
- Privacy Policy URL: https://nossamaternidade.com.br/privacidade
- License Agreement: (pode usar padrão da Apple)
```

#### 6.3 Descrição do App
**Tempo**: 15 minutos

```
Escreva uma descrição atraente (4000 caracteres máx):

ESTRUTURA SUGERIDA:
1. Introdução (1-2 frases): O que é o app
2. Principais recursos (bullets):
   - Chat com IA especializada em maternidade (NathIA)
   - Rastreador de ciclo menstrual e fertilidade
   - Comunidade de mães para trocar experiências
   - Conteúdo personalizado para cada fase da gestação
   - Diário de gravidez com fotos e memórias

3. Quem é para: Mulheres grávidas, tentantes ou novas mães

4. Premium (opcional):
   - Chat ilimitado com IA
   - Conteúdo exclusivo
   - Sem anúncios

5. Call to action: Baixe agora e comece sua jornada!
```

**Keywords** (100 caracteres max):
```
maternidade,gestação,gravidez,bebê,saúde,mãe,fertilidade,ciclo
```

#### 6.4 App Privacy
**Tempo**: 10 minutos

```
App Store Connect → "Nossa Maternidade" → "App Privacy"

DADOS COLETADOS:
✅ Contact Information (Email)
   - Purpose: App Functionality, Account Creation

✅ Health & Fitness (Cycle tracking, pregnancy data)
   - Purpose: App Functionality, Product Personalization

✅ User Content (Posts, comments, messages)
   - Purpose: App Functionality

✅ Identifiers (User ID)
   - Purpose: App Functionality, Analytics

✅ Usage Data (Analytics)
   - Purpose: Analytics, Product Personalization

LINKED TO USER: Yes (all data)
TRACKING: No (se não usar AdMob/Facebook Ads)
```

#### 6.5 Age Rating
**Tempo**: 3 minutos

```
App Store Connect → "Nossa Maternidade" → "Age Rating"

Responda o questionário:
- Medical/Treatment Information: Infrequent/Mild
- Unrestricted Web Access: Yes (se tiver links externos)
- Recomendação: 12+ ou 17+ (gestação é tema adulto)
```

#### 6.6 Pricing and Availability
**Tempo**: 2 minutos

```
- Price: Free (com In-App Purchases)
- Availability: All Territories (ou apenas Brazil)
- Pre-Order: No
```

---

### FASE 7: Testar com TestFlight

#### 7.1 Criar Grupo de Teste Interno
**Tempo**: 3 minutos

```
TestFlight → "Nossa Maternidade" → "Internal Testing"

1. Clique em "+" para criar grupo
2. Nome: "Time Nossa Maternidade"
3. Adicione seu email e de outros testadores
4. Clique em "Save"
```

#### 7.2 Adicionar Build ao Grupo
**Tempo**: 1 minuto

```
1. Selecione o build processado
2. Clique em "Add Build to Group"
3. Selecione "Time Nossa Maternidade"
4. Testadores receberão email com link
```

#### 7.3 Instalar e Testar
**Tempo**: 30-60 minutos

```
1. Abra email do TestFlight no iPhone
2. Instale o app TestFlight (App Store)
3. Clique em "Start Testing"
4. Instale Nossa Maternidade

TESTAR:
- [ ] Login/Cadastro funciona
- [ ] Onboarding completo
- [ ] Chat com NathIA
- [ ] Comunidade (posts, likes)
- [ ] Ciclo menstrual
- [ ] Notificações push (permitir e testar)
- [ ] Compra de assinatura (sandbox)
- [ ] Restaurar compras
- [ ] Logout e login novamente
```

---

### FASE 8: Submissão para Review

#### 8.1 Checklist Pré-Submissão
**Tempo**: 10 minutos

```
Antes de submeter, CONFIRME:
- [ ] Todos os screenshots adicionados
- [ ] Descrição completa e sem erros
- [ ] Privacy policy configurada
- [ ] In-App Purchases configurados
- [ ] Testado com TestFlight (zero crashes)
- [ ] Todos os links funcionam (privacy, terms, support)
- [ ] Age rating correto
- [ ] App funciona offline (se aplicável)
```

#### 8.2 App Review Information
**Tempo**: 5 minutos

```
App Store Connect → "Nossa Maternidade" → "App Review Information"

CRÍTICO:
- [ ] Sign-in Required: Yes
- [ ] Demo Account:
      Email: demo@nossamaternidade.com.br
      Password: DemoTeste123!

      ⚠️ CRIE UMA CONTA DE TESTE REAL NO APP!

- [ ] Notes: "App para gestantes. Todas as funcionalidades
              disponíveis após login. Use a conta demo fornecida."
```

#### 8.3 Submeter para Review
**Tempo**: 2 minutos

```
1. App Store Connect → "Nossa Maternidade" → "1.0 Prepare for Submission"
2. Revise TODAS as seções (✅ verdes)
3. Clique em "Add for Review"
4. Clique em "Submit for Review"
5. Aguarde email de confirmação
```

#### 8.4 Monitorar Status
**Tempo**: Aguardar 24-72h

```
Status possíveis:
- Waiting for Review (24-48h normalmente)
- In Review (2-24h)
- Approved ✅ → Publicar!
- Rejected ❌ → Ver motivo e corrigir

Notificações:
- Email de cada mudança de status
- Push notification (se ativado no App Store Connect)
```

---

### FASE 9: Publicação (Após Aprovação)

#### 9.1 Revisar Build Aprovado
**Tempo**: 2 minutos

```
1. App Store Connect → "Nossa Maternidade"
2. Status: "Ready for Sale"
3. Revise última vez todas as informações
```

#### 9.2 Publicar
**Tempo**: 1 minuto

```
Opção A: Publicação Automática
- Já configurado em "Version Release" → "Automatic"
- App vai ao ar assim que aprovado

Opção B: Publicação Manual
- "Version Release" → "Manual"
- Clique em "Release this Version"
```

#### 9.3 Aguardar Processamento
**Tempo**: 2-24h

```
Depois de publicar:
- App aparece na busca em ~2-24h
- Link direto funciona imediatamente
```

#### 9.4 Testar na App Store
**Tempo**: 5 minutos

```
1. Busque "Nossa Maternidade" na App Store (iPhone)
2. Verifique screenshots, descrição, rating
3. Instale e teste novamente (build de produção!)
4. Teste compras REAIS (não sandbox)
```

---

## 📋 RESUMO DOS TEMPOS

| Fase | Tempo Estimado |
|------|----------------|
| 1. Segurança (Chaves APNs) | 15 min |
| 2. RevenueCat | 15 min |
| 3. In-App Purchases | 30 min |
| 4. Build EAS | 20 min (remoto) |
| 5. Upload App Store | 10 min |
| 6. Info do App + Screenshots | 1-2h |
| 7. TestFlight | 1h |
| 8. Submissão | 20 min |
| 9. Review Apple | **3-5 dias** |
| 10. Publicação | 24h |
| **TOTAL (seu tempo)** | **~4-5 horas** |
| **TOTAL (com review)** | **4-6 dias** |

---

## ⚠️ ALERTAS CRÍTICOS

### 1. Chave APNs Exposta
🔴 **URGENTE**: Revogar `7NM7SXW7DV` ANTES de qualquer build!

### 2. Conta de Teste para Review
🔴 **OBRIGATÓRIO**: Criar conta demo funcional antes de submeter

### 3. Screenshots Reais
🔴 **OBRIGATÓRIO**: Usar screenshots reais do app (não mockups genéricos)

### 4. In-App Purchase Testing
🟡 **IMPORTANTE**: Testar compras em sandbox ANTES de produção

### 5. Privacy Policy Válida
🟡 **IMPORTANTE**: URL `nossamaternidade.com.br/privacidade` deve estar acessível

---

## 🆘 TROUBLESHOOTING COMUM

### Build Falha no EAS
**Erro**: "Provisioning profile doesn't match"
**Solução**:
```bash
eas credentials
# Delete credenciais antigas
# EAS vai gerar novas automaticamente
```

### Rejeição da Apple: "Missing Functionality"
**Erro**: App não tem funcionalidades suficientes
**Solução**: Certifique-se que chat IA, comunidade e ciclo estão funcionando

### Rejeição: "Guideline 2.1 - Information Needed"
**Erro**: Apple não conseguiu testar o app
**Solução**: Verifique que credenciais de teste estão corretas

### In-App Purchase Não Aparece
**Erro**: Produtos não carregam no app
**Solução**:
1. Verifique IDs exatos em App Store Connect e RevenueCat
2. Aguarde até 24h após criar produtos
3. Teste com conta sandbox (não produção)

---

## 📚 RECURSOS ÚTEIS

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [RevenueCat iOS Setup](https://docs.revenuecat.com/docs/ios)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)

---

## 🎯 AÇÃO IMEDIATA (COMEÇAR AGORA!)

```bash
# PASSO 1: Revogar chave APNs exposta
https://developer.apple.com/account/resources/authkeys/list

# PASSO 2: Configurar RevenueCat
https://app.revenuecat.com

# PASSO 3: Primeiro build
eas build --platform ios --profile production
```

---

**Última atualização**: 24 de dezembro de 2024
**Status**: ✅ READY TO BUILD!
