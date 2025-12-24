# Guia: Como Obter Chave .p8 do App Store Connect

**Para configurar iOS App no RevenueCat**

---

## 📋 Informações Necessárias

Para preencher o formulário do RevenueCat, você precisa de:

1. ✅ **P8 key file** (arquivo `.p8`)
2. ✅ **Key ID** (ex: `ABC123DEFG`)
3. ✅ **Issuer ID** (ex: `57246542-96fe-1a63-e053-0824d0110`)

---

## 🚀 Passo a Passo Completo

### PASSO 1: Acessar App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Faça login com sua conta Apple Developer
3. Certifique-se de ter permissões de **Admin** ou **Account Holder**

### PASSO 2: Navegar até Keys

1. No menu superior, clique em **"Users and Access"**
2. No menu lateral esquerdo, clique em **"Keys"**
3. Você verá duas abas:
   - **App Store Connect API** (para CI/CD)
   - **In-App Purchase** ← **USE ESTA ABA**

### PASSO 3: Obter Issuer ID (Primeiro)

**O Issuer ID aparece no topo da página de Keys:**

1. Na página de Keys, procure no topo por **"Issuer ID"**
2. Copie o valor completo (formato: `57246542-96fe-1a63-e053-0824d0110`)
3. **Guarde este valor** - você precisará dele

**Localização visual:**
```
App Store Connect
  └─ Users and Access
      └─ Keys
          └─ [Topo da página] Issuer ID: 57246542-96fe-1a63-e053-0824d0110
```

### PASSO 4: Criar In-App Purchase Key

1. Na aba **"In-App Purchase"**, clique no botão **"+"** (Generate In-App Purchase Key)
2. Uma janela modal aparecerá pedindo:
   - **Name**: Digite `Nossa Maternidade RevenueCat` (ou qualquer nome descritivo)
   - **Access**: Selecione **"In-App Purchase"** (já deve estar selecionado)
3. Clique em **"Generate"**

### PASSO 5: Baixar e Anotar Informações

**⚠️ ATENÇÃO: Você só pode baixar o arquivo .p8 UMA VEZ!**

Após clicar em "Generate", você verá:

1. **Key ID**: Aparece na tela (ex: `ABC123DEFG`)
   - **COPIE E GUARDE** este valor
   - Formato: Letras e números, sem espaços

2. **Download do arquivo .p8**:
   - Clique em **"Download"** para baixar o arquivo
   - O arquivo terá formato: `SubscriptionKey_XXXXXXXXXX.p8`
   - **GUARDE EM LOCAL SEGURO** - você não poderá baixar novamente!

3. **Issuer ID**: Já copiado no Passo 3

### PASSO 6: Verificar Arquivo Baixado

O arquivo `.p8` deve:
- ✅ Ter extensão `.p8`
- ✅ Começar com `SubscriptionKey_`
- ✅ Conter uma chave privada (texto longo)

**Exemplo de nome:** `SubscriptionKey_ABC123DEFG.p8`

---

## 📝 Preencher Formulário RevenueCat

Agora você tem todas as informações:

### No Formulário RevenueCat:

1. **P8 key file**:
   - Clique em "Drop a file here, or click to select"
   - Selecione o arquivo `SubscriptionKey_XXXXXXXXXX.p8` baixado
   - Aguarde upload completar

2. **Key ID**:
   - Cole o Key ID copiado (ex: `ABC123DEFG`)
   - Sem espaços, exatamente como aparece

3. **Issuer ID**:
   - Cole o Issuer ID copiado (ex: `57246542-96fe-1a63-e053-0824d0110`)
   - Formato completo com hífens

4. **Clique em "Save changes"**

---

## 🔍 Verificação

Após salvar, o RevenueCat deve mostrar:
- ✅ Status: "Connected" ou "Active"
- ✅ Última sincronização: Data/hora recente

Se houver erro:
- Verifique se o arquivo .p8 está correto
- Verifique se Key ID e Issuer ID estão corretos (sem espaços extras)
- Certifique-se de que a conta tem permissões adequadas

---

## 📋 Checklist

- [ ] Acessei App Store Connect
- [ ] Naveguei para Users and Access → Keys → In-App Purchase
- [ ] Copiei o Issuer ID (do topo da página)
- [ ] Criei nova In-App Purchase Key
- [ ] Anotei o Key ID
- [ ] Baixei o arquivo .p8 (e guardei em local seguro)
- [ ] Fiz upload do .p8 no RevenueCat
- [ ] Preenchi Key ID no RevenueCat
- [ ] Preenchi Issuer ID no RevenueCat
- [ ] Salvei as alterações
- [ ] Verifiquei status "Connected" no RevenueCat

---

## ⚠️ Importante

1. **Backup do arquivo .p8**: 
   - Guarde em local seguro (password manager, cloud seguro)
   - Você não poderá baixar novamente
   - Se perder, precisará criar nova chave

2. **Permissões**:
   - Apenas Admin ou Account Holder pode criar keys
   - Se não conseguir, peça acesso ao administrador da conta

3. **App-specific shared secret (Legacy)**:
   - Esta opção é para versões antigas do RevenueCat
   - **NÃO é necessária** se você está usando Purchases v5.x+ (StoreKit 2)
   - Pode deixar em branco

---

## 🆘 Troubleshooting

### Erro: "Invalid key file"
- Verifique se o arquivo é realmente `.p8`
- Certifique-se de que não foi corrompido no download
- Tente baixar novamente (se ainda estiver disponível)

### Erro: "Key ID not found"
- Verifique se copiou o Key ID corretamente
- Sem espaços antes/depois
- Case-sensitive (maiúsculas/minúsculas importam)

### Erro: "Issuer ID invalid"
- Verifique se copiou o Issuer ID completo
- Inclua todos os hífens
- Formato correto: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

### Não consigo ver a aba "In-App Purchase"
- Verifique se tem permissões de Admin
- Certifique-se de estar na página correta: Users and Access → Keys
- Algumas contas podem ter interface diferente

---

## 🔗 Links Úteis

- App Store Connect: https://appstoreconnect.apple.com
- RevenueCat Docs: https://www.revenuecat.com/docs/app-store-connect
- Suporte Apple: https://developer.apple.com/contact/

---

**Última atualização**: 2024-12-24

