# Google Play Service Account - Guia Completo

## Informações da Conta

- **Tipo:** Pessoal
- **ID da Conta:** 5390773732388254763
- **Nome do Desenvolvedor:** Gabriel Sfreddo Johner Vesz
- **URL do Console:** https://play.google.com/console

---

## Passo a Passo: Criar Service Account

### 1. Acessar API Access no Google Play Console

1. Acesse: https://play.google.com/console
2. Selecione seu app (ou crie um novo se necessário)
3. No menu lateral, vá em **Setup** → **API access**

### 2. Criar Service Account

1. Na página "API access", role até a seção **Service accounts**
2. Clique em **Create new service account**
3. Você será redirecionado para o Google Cloud Console
4. Clique em **Create Service Account** (canto superior direito)

### 3. Configurar Service Account no Google Cloud

**Nome do Service Account:**

```
RevenueCat Nossa Maternidade
```

**Descrição:**

```
Service account para gerenciar assinaturas e compras in-app via RevenueCat
```

**Role (Função):**

- Selecione: **Service Account User** (básico)
- OU **Editor** (se precisar de mais permissões)

Clique em **Create and Continue**

### 4. Gerar Chave JSON

1. Após criar o Service Account, você voltará para a lista
2. Clique no Service Account recém-criado
3. Vá na aba **Keys**
4. Clique em **Add Key** → **Create new key**
5. Selecione **JSON**
6. Clique em **Create**
7. O arquivo JSON será baixado automaticamente

### 5. Conceder Acesso no Google Play Console

1. Volte para: https://play.google.com/console → **Setup** → **API access**
2. Na seção **Service accounts**, você verá o Service Account criado
3. Clique em **Grant access** ao lado do Service Account
4. Selecione seu app: **Nossa Maternidade**
5. Marque as seguintes permissões:
   - ✅ **View financial data**
   - ✅ **Manage orders and subscriptions**
   - ✅ **View app information and download bulk reports**
6. Clique em **Invite user**

### 6. Salvar o Arquivo JSON

1. Renomeie o arquivo baixado para: `google-play-service-account.json`
2. Mova para a raiz do projeto: `/Users/lion/Documents/Lion/NossaMaternidade/`
3. **IMPORTANTE:** Adicione ao `.gitignore`:

```gitignore
# Google Play Service Account (contém credenciais sensíveis)
google-play-service-account.json
```

---

## Estrutura do Arquivo JSON

O arquivo deve ter esta estrutura:

```json
{
  "type": "service_account",
  "project_id": "seu-project-id",
  "private_key_id": "chave-privada-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "nome-service-account@projeto.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## Verificação

Após configurar, verifique se está funcionando:

```bash
# Verificar se o arquivo existe
ls -la google-play-service-account.json

# Verificar estrutura JSON (deve retornar sem erros)
cat google-play-service-account.json | jq .
```

---

## Configuração no eas.json

O arquivo `eas.json` já está configurado para usar este arquivo:

```json
"android": {
  "serviceAccountKeyPath": "./google-play-service-account.json",
  "track": "production",
  "releaseStatus": "completed"
}
```

---

## Troubleshooting

### Erro: "Service account not found"

- Verifique se o arquivo está na raiz do projeto
- Verifique se o caminho em `eas.json` está correto: `./google-play-service-account.json`

### Erro: "Permission denied"

- Verifique se concedeu acesso no Google Play Console
- Verifique se as permissões estão corretas (View financial data, Manage orders)

### Erro: "Invalid JSON"

- Verifique se o arquivo não foi corrompido
- Use `jq .` para validar a estrutura JSON

---

## Segurança

⚠️ **NUNCA** commite este arquivo no Git!

O arquivo já está no `.gitignore`, mas verifique:

```bash
# Verificar se está ignorado
git check-ignore google-play-service-account.json
# Deve retornar: google-play-service-account.json
```

---

## Próximos Passos

Após configurar o Service Account:

1. ✅ Criar app no Google Play Console (se ainda não criou)
2. ✅ Configurar produtos de assinatura (mensal/anual)
3. ✅ Configurar RevenueCat com as credenciais
4. ✅ Testar compras em ambiente de sandbox

---

## Referências

- [Google Play Console](https://play.google.com/console)
- [Google Cloud Console](https://console.cloud.google.com)
- [EAS Submit Documentation](https://docs.expo.dev/submit/android/)
