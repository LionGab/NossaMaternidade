# Apple Developer Account - Aguardando Aprovação

## Status Atual

✅ **Pagamento realizado**
⏳ **Aguardando aprovação da Apple**

---

## Tempo de Aprovação Normal

- **Tempo médio:** 24-48 horas úteis
- **Máximo:** Até 5 dias úteis
- **Finais de semana:** Não contam no prazo

---

## O Que Fazer Enquanto Aguarda

### 1. Verificar Status da Conta

1. Acesse: https://developer.apple.com/account
2. Faça login com sua Apple ID
3. Verifique o status em **Membership**
4. Status possíveis:
   - ⏳ **Pending** - Aguardando aprovação
   - ✅ **Active** - Aprovado e ativo
   - ❌ **Expired** - Conta expirada

### 2. Verificar Email

- Verifique a caixa de entrada do email associado à Apple ID
- Verifique a pasta de spam/lixo eletrônico
- A Apple pode enviar emails sobre:
  - Confirmação de pagamento
  - Solicitação de informações adicionais
  - Aprovação da conta

### 3. Preparar Documentação (Se Solicitado)

A Apple pode solicitar:

- **Comprovante de identidade** (RG, CNH, Passaporte)
- **Comprovante de endereço** (conta de luz, água, etc.)
- **Informações fiscais** (CPF, CNPJ se empresa)
- **Informações bancárias** (se necessário)

### 4. Continuar Desenvolvimento

Você pode continuar desenvolvendo enquanto aguarda:

✅ **Funciona sem conta ativa:**
- Desenvolvimento local
- Testes no simulador iOS
- Expo Go (para testes básicos)
- Builds de desenvolvimento local

❌ **Não funciona sem conta ativa:**
- Builds EAS (precisa de Team ID)
- TestFlight
- Submissão para App Store
- Certificados de distribuição

---

## O Que Fazer Quando Aprovar

### 1. Obter Apple Team ID

1. Acesse: https://developer.apple.com/account
2. Vá em **Membership**
3. Copie o **Team ID** (formato: `ABC123DEF4`)
4. Atualize `eas.json`:

```json
"submit": {
  "production": {
    "ios": {
      "appleTeamId": "SEU_TEAM_ID_AQUI"
    }
  }
}
```

### 2. Criar App no App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Faça login com a mesma Apple ID
3. Clique em **My Apps** → **+** → **New App**
4. Preencha:
   - **Platform:** iOS
   - **Name:** Nossa Maternidade
   - **Primary Language:** Português (Brasil)
   - **Bundle ID:** `com.nossamaternidade.app`
   - **SKU:** `NOSSA_MATERNIDADE_2025`
5. Clique em **Create**

### 3. Obter App Store Connect ID

1. No App Store Connect, selecione seu app
2. Vá em **App Information**
3. Copie o **Apple ID** (número, ex: `1234567890`)
4. Atualize `eas.json`:

```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "SEU_APP_STORE_CONNECT_ID_AQUI"
    }
  }
}
```

### 4. Configurar Certificados (Automático com EAS)

O EAS Build gerencia certificados automaticamente:

```bash
# Primeiro build criará os certificados automaticamente
eas build --profile production --platform ios
```

---

## Troubleshooting

### Pagamento Processado Mas Conta Ainda Pendente

**Causa comum:** Verificação de identidade pendente

**Solução:**
1. Verifique se há emails da Apple solicitando documentos
2. Acesse: https://developer.apple.com/account
3. Verifique se há pendências em **Membership**
4. Entre em contato: https://developer.apple.com/contact/

### Não Recebeu Email de Confirmação

**Solução:**
1. Verifique spam/lixo eletrônico
2. Verifique se o email está correto na Apple ID
3. Acesse: https://appleid.apple.com → Verificar email
4. Aguarde 48 horas úteis antes de contatar suporte

### Conta Aprovada Mas Não Consegue Acessar App Store Connect

**Causa comum:** Conta Developer e App Store Connect são diferentes

**Solução:**
1. Certifique-se de usar a mesma Apple ID
2. Acesse: https://appstoreconnect.apple.com
3. Se não conseguir, aguarde até 24h após aprovação
4. Entre em contato: https://developer.apple.com/contact/

---

## Contato com Suporte Apple

Se passou de 5 dias úteis sem resposta:

1. **Suporte Developer:**
   - https://developer.apple.com/contact/
   - Telefone: 0800-761-0867 (Brasil)

2. **Informações necessárias:**
   - Apple ID usado
   - Data do pagamento
   - Número do pedido (se tiver)
   - Comprovante de pagamento

---

## Checklist Pós-Aprovação

Quando a conta for aprovada:

- [ ] Verificar Team ID no Developer Portal
- [ ] Atualizar `eas.json` com Team ID
- [ ] Criar app no App Store Connect
- [ ] Obter App Store Connect ID
- [ ] Atualizar `eas.json` com App Store Connect ID
- [ ] Configurar assinaturas (Premium)
- [ ] Fazer primeiro build: `eas build --profile production --platform ios`
- [ ] Testar no TestFlight
- [ ] Submeter para review

---

## Enquanto Aguarda - Desenvolvimento

Você pode continuar desenvolvendo:

```bash
# Desenvolvimento local (funciona sem conta ativa)
npm start

# Testes no simulador (funciona sem conta ativa)
npm run ios

# Expo Go (funciona sem conta ativa)
# Escaneie QR code no Expo Go app

# Builds EAS (NÃO funciona - precisa de conta ativa)
# eas build --profile production --platform ios
```

---

## Referências

- [Apple Developer Portal](https://developer.apple.com/account)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Suporte Apple Developer](https://developer.apple.com/contact/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

