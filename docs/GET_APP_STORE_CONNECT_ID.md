# 🔍 Como Obter o App Store Connect ID

**App**: Nossa Maternidade
**Status**: ✅ **CONFIGURAÇÃO COMPLETA!** Todos os IDs foram configurados.

---

## O QUE É?

O **App Store Connect ID** é um número único que identifica seu app no sistema da Apple.

Formato: **10 dígitos numéricos** (exemplo: `1234567890`)

---

## COMO ENCONTRAR (Passo-a-Passo Visual)

### PASSO 1: Acessar App Store Connect

```
1. Abra seu navegador
2. Acesse: https://appstoreconnect.apple.com
3. Faça login com sua Apple ID
```

### PASSO 2: Encontrar o App

```
1. Na página inicial, clique em "Apps" (ou "Meus Apps")
2. Você verá uma lista de apps
3. Clique em "Nossa Maternidade"
```

### PASSO 3: Pegar o ID da URL

Depois de clicar no app, você será redirecionado para uma página como:

```
https://appstoreconnect.apple.com/apps/1234567890/appstore/ios/version/inflight
                                        ^^^^^^^^^^
                                        ESTE É SEU ID!
```

**O número após `/apps/` é seu App Store Connect ID.**

---

## EXEMPLOS VISUAIS

### URL Completa (Exemplo):

```
https://appstoreconnect.apple.com/apps/6756980888/appstore/ios/version/inflight
```

**App Store Connect ID**: `6756980888`

### Onde NÃO Procurar

❌ **NÃO é o Team ID** (`KZPW4S77UH`) - Já temos esse!
❌ **NÃO é o Bundle ID** (`br.com.nossamaternidade.app`)
❌ **NÃO é o Developer ID** (`f483d4df-0161-497b-8936-729c4674d1ab`)
❌ **NÃO é o SKU** (`nossamaternidade001`)

✅ **É o número de 10 dígitos na URL do App Store Connect**

---

## ALTERNATIVA: Pelo Xcode (Se tiver Mac)

Se você tem acesso a um Mac com Xcode:

```
1. Abra Xcode
2. Vá em "Window" → "Organizer"
3. Selecione "Nossa Maternidade"
4. Na seção "App Information", você verá "Apple ID"
5. Esse número é o App Store Connect ID
```

---

## O QUE FAZER DEPOIS DE OBTER

### PASSO 1: Copiar o ID

Exemplo de ID: `6756980888`

### PASSO 2: Atualizar eas.json

Abra o arquivo `eas.json` e encontre a linha 100:

**ANTES:**

```json
"ascAppId": "SEU_APP_STORE_CONNECT_ID_AQUI",
```

**DEPOIS** (substituindo pelo seu ID):

```json
"ascAppId": "6756980888",
```

### PASSO 3: Salvar e Validar

```bash
# Salve o arquivo
# Execute para verificar sintaxe JSON
cat eas.json | jq .

# Ou apenas verifique que o arquivo está correto
cat eas.json | grep ascAppId
```

---

## TROUBLESHOOTING

### "Não vejo o número na URL"

**Possível causa**: Você está na página errada.

**Solução**:

```
1. Certifique-se de estar em App Store Connect (não Apple Developer)
2. Clique em "Apps" no menu principal
3. Clique no card "Nossa Maternidade"
4. Verifique a URL do navegador
```

### "A URL é diferente do exemplo"

**Possível causa**: Você está em outra seção do App Store Connect.

**Não importa! O ID é sempre o mesmo na URL.**

Exemplos de URLs válidas:

```
https://appstoreconnect.apple.com/apps/1234567890/appstore
https://appstoreconnect.apple.com/apps/1234567890/appstore/ios/version
https://appstoreconnect.apple.com/apps/1234567890/distribution
https://appstoreconnect.apple.com/apps/1234567890/testflight
                                        ^^^^^^^^^^
                                        SEMPRE O MESMO!
```

### "Não tenho acesso ao App Store Connect"

**Possível causa**: Conta não está configurada como Titular/Admin.

**Solução**:

```
1. Peça ao titular da conta para adicionar você
2. Ou use a conta do titular para obter o ID
3. Role "Admin" ou "Titular da conta" é necessário
```

---

## ✅ CHECKLIST

Antes de continuar, confirme:

- [ ] Acessei App Store Connect
- [ ] Encontrei "Nossa Maternidade" na lista de apps
- [ ] Cliquei no app e vi a URL mudar
- [ ] Copiei o número de 10 dígitos da URL
- [ ] Atualizei `eas.json` linha 100 com o ID
- [ ] Salvei o arquivo

---

## PRÓXIMO PASSO

Depois de atualizar o `eas.json`, você estará **100% pronto** para:

1. ✅ Fazer o primeiro build EAS
2. ✅ Configurar RevenueCat
3. ✅ Configurar In-App Purchases
4. ✅ Submeter para review

---

## 🆘 PRECISA DE AJUDA?

Se não conseguir encontrar o ID:

**Opção 1**: Tire um screenshot da página "Nossa Maternidade" no App Store Connect
**Opção 2**: Cole a URL completa aqui (remova dados sensíveis se houver)
**Opção 3**: Peça ajuda ao titular da conta Apple Developer

---

**Data**: 24 de dezembro de 2024
**Status**: ✅ **CONCLUÍDO** - App Store Connect ID: `6756980888` configurado em `eas.json`
