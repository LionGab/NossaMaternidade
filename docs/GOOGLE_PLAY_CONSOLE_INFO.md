# Google Play Console - Informações da Conta

## Dados da Conta

- **Tipo:** Pessoal
- **ID da Conta do Desenvolvedor:** `5390773732388254763`
- **Nome do Desenvolvedor:** Gabriel Sfreddo Johner Vesz
- **URL do Console:** https://play.google.com/console

---

## Próximos Passos

### 1. Criar App no Google Play Console

1. Acesse: https://play.google.com/console
2. Clique em **Create app**
3. Preencha:
   - **App name:** Nossa Maternidade
   - **Default language:** Português (Brasil)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** Marque todas as declarações necessárias
4. Clique em **Create app**

### 2. Configurar Detalhes do App

#### Informações Básicas

- **Package name:** `com.nossamaternidade.app` (já configurado no `app.json`)
- **App name:** Nossa Maternidade
- **Short description:** Acompanhamento completo da sua jornada materna
- **Full description:** [Descrição completa do app]

#### Categoria

- **App category:** Saúde e fitness
- **Tags:** Gravidez, Maternidade, Saúde da Mulher, Bem-estar

### 3. Configurar Assinaturas (Premium)

1. Vá em **Monetization** → **Subscriptions**
2. Clique em **Create subscription**
3. Crie 2 produtos:

**Produto Mensal:**

- **Product ID:** `nossa_maternidade_monthly`
- **Name:** Plano Mensal
- **Billing period:** Monthly
- **Price:** R$ 19,90 (Brasil)
- **Free trial:** 7 days (opcional)

**Produto Anual:**

- **Product ID:** `nossa_maternidade_yearly`
- **Name:** Plano Anual
- **Billing period:** Yearly
- **Price:** R$ 99,00 (Brasil)
- **Free trial:** 7 days (opcional)

### 4. Configurar Service Account

Siga o guia completo em: [docs/GOOGLE_PLAY_SERVICE_ACCOUNT.md](./GOOGLE_PLAY_SERVICE_ACCOUNT.md)

### 5. Configurar Política de Privacidade

- **Privacy Policy URL:** https://nossamaternidade.com.br/privacidade
- **Data Safety:** Preencher todas as seções obrigatórias

### 6. Upload do App

Após criar o app e configurar tudo:

```bash
# Build para produção
eas build --profile production --platform android

# Submit para Google Play
eas submit --profile production --platform android
```

---

## Checklist de Lançamento

- [ ] App criado no Google Play Console
- [ ] Package name configurado: `com.nossamaternidade.app`
- [ ] Assinaturas criadas (mensal + anual)
- [ ] Service Account JSON configurado
- [ ] Política de privacidade publicada
- [ ] Data Safety preenchido
- [ ] Screenshots e assets adicionados
- [ ] Build de produção criado
- [ ] App submetido para review

---

## Referências

- [Google Play Console](https://play.google.com/console)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [EAS Submit Documentation](https://docs.expo.dev/submit/android/)
