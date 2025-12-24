# Guia MacBook - Apple Developer Account

## 🍎 Passo a Passo no MacBook

---

## 1️⃣ Verificar Status da Conta Apple Developer

### Opção A: Via Safari (Recomendado)

1. **Abra o Safari** (ou Chrome/Firefox)
2. Acesse: https://developer.apple.com/account
3. Clique em **Sign In** (canto superior direito)
4. Faça login com sua **Apple ID** (a mesma que usou para pagar)
5. Vá em **Membership** (menu lateral esquerdo)
6. Verifique o status:
   - ⏳ **Pending** = Aguardando aprovação
   - ✅ **Active** = Aprovado!

### Opção B: Via Terminal (Rápido)

```bash
# Abrir Developer Portal no navegador padrão
open https://developer.apple.com/account
```

---

## 2️⃣ Verificar Email da Apple

### No Mail App (MacBook)

1. Abra o **Mail** (ícone de envelope na dock)
2. Procure por emails de:
   - `noreply@email.apple.com`
   - `developer@apple.com`
3. Verifique também a pasta **Spam**

### Ou via Gmail/Outlook no navegador

1. Abra seu email no navegador
2. Procure por "Apple Developer"
3. Verifique spam/lixo eletrônico

---

## 3️⃣ Continuar Desenvolvendo (Enquanto Aguarda)

### Abrir Terminal

1. Pressione `Cmd + Espaço` (Spotlight)
2. Digite: `Terminal`
3. Pressione Enter

### Navegar até o Projeto

```bash
cd ~/Documents/Lion/NossaMaternidade
```

### Iniciar Desenvolvimento

```bash
# Instalar dependências (se ainda não fez)
npm install

# Iniciar servidor de desenvolvimento
npm start
```

### Abrir no Simulador iOS

1. Com o servidor rodando, pressione `i` no terminal
2. Ou abra outro terminal e execute:

```bash
npm run ios
```

### Usar Expo Go no iPhone Físico

1. Instale **Expo Go** no iPhone (App Store)
2. Com `npm start` rodando, escaneie o QR code
3. O app abrirá no iPhone

---

## 4️⃣ Quando a Conta For Aprovada

### Passo 1: Obter Team ID

1. Acesse: https://developer.apple.com/account
2. Vá em **Membership**
3. Copie o **Team ID** (ex: `ABC123DEF4`)

### Passo 2: Atualizar eas.json

```bash
# Abrir eas.json no editor
open -a "Cursor" eas.json
# Ou use: code eas.json (se usar VS Code)
# Ou: nano eas.json (editor de texto)
```

**Localizar linha 101 e substituir:**

```json
"appleTeamId": "SEU_TEAM_ID_AQUI"
```

**Por:**

```json
"appleTeamId": "ABC123DEF4"  // Cole seu Team ID aqui
```

### Passo 3: Criar App no App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Clique em **My Apps** → **+** → **New App**
3. Preencha os dados
4. Copie o **Apple ID** do app (número)

### Passo 4: Atualizar App Store Connect ID

No mesmo arquivo `eas.json`, linha 100:

```json
"ascAppId": "1234567890"  // Cole o Apple ID do app aqui
```

### Passo 5: Fazer Primeiro Build

```bash
# Certifique-se de estar no diretório do projeto
cd ~/Documents/Lion/NossaMaternidade

# Fazer build de produção
eas build --profile production --platform ios
```

**O que acontece:**

- EAS criará certificados automaticamente
- Build levará 15-30 minutos
- Você receberá notificação quando concluir

---

## 5️⃣ Atalhos Úteis no MacBook

### Abrir URLs Rápidas

```bash
# Developer Portal
open https://developer.apple.com/account

# App Store Connect
open https://appstoreconnect.apple.com

# EAS Dashboard
open https://expo.dev/accounts/liongab/projects/nossa-maternidade/builds
```

### Verificar Status do Build

```bash
# Listar builds
eas build:list

# Ver detalhes do último build
eas build:list --platform ios --limit 1
```

---

## 6️⃣ Configurar EAS CLI (Se Ainda Não Fez)

### Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Fazer Login

```bash
eas login
```

**Siga as instruções:**

- Abrirá navegador
- Faça login com sua conta Expo
- Volte ao terminal quando autorizar

### Verificar Login

```bash
eas whoami
```

Deve mostrar seu usuário Expo.

---

## 7️⃣ Comandos Essenciais

### Desenvolvimento

```bash
# Iniciar servidor
npm start

# Limpar cache e iniciar
npm start -- --clear

# Build iOS (quando conta estiver ativa)
eas build --profile production --platform ios

# Ver builds
eas build:list

# Submit para App Store (quando app estiver pronto)
eas submit --profile production --platform ios
```

### Verificação

```bash
# Verificar configuração
bash scripts/verify-production-ready.sh

# TypeScript check
npm run typecheck

# Lint
npm run lint

# Quality gate completo
npm run quality-gate
```

---

## 8️⃣ Troubleshooting MacBook

### Terminal Não Encontra Comandos

```bash
# Verificar se Node está instalado
node --version

# Verificar se npm está instalado
npm --version

# Se não estiver, instale via Homebrew:
brew install node
```

### Permissões Negadas

```bash
# Dar permissão de execução aos scripts
chmod +x scripts/*.sh
```

### Porta Já em Uso

```bash
# Matar processo na porta 8081 (Metro bundler)
lsof -ti:8081 | xargs kill -9

# Ou use:
npx kill-port 8081
```

### Limpar Cache Completo

```bash
# Limpar tudo
npm run clean:all

# Reinstalar dependências
npm install
```

---

## 9️⃣ Checklist Rápido

**Agora (Enquanto Aguarda):**

- [ ] Verificar status em https://developer.apple.com/account
- [ ] Verificar email
- [ ] Continuar desenvolvendo localmente
- [ ] Testar no simulador iOS

**Quando Aprovar:**

- [ ] Copiar Team ID
- [ ] Atualizar `eas.json` linha 101
- [ ] Criar app no App Store Connect
- [ ] Copiar App Store Connect ID
- [ ] Atualizar `eas.json` linha 100
- [ ] Fazer primeiro build: `eas build --profile production --platform ios`

---

## 🔟 Dicas MacBook

### Usar Spotlight para Tudo

- `Cmd + Espaço` → Digite "Terminal", "Safari", "Mail", etc.

### Dividir Tela

- Terminal + Safari lado a lado
- `Cmd + Tab` para alternar apps

### Atalhos Úteis

- `Cmd + K` no Terminal = Limpar tela
- `Cmd + T` no Terminal = Nova aba
- `Cmd + W` = Fechar aba/janela
- `Cmd + Q` = Fechar app completamente

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. **Verificar logs:**

```bash
# Ver último erro
tail -n 50 ~/.npm/_logs/*-debug.log

# Ou no projeto
cat expo.log
```

2. **Reiniciar tudo:**

```bash
# Fechar tudo e começar de novo
killall node
npm start -- --clear
```

3. **Verificar documentação:**

- EAS: https://docs.expo.dev/build/introduction/
- Apple: https://developer.apple.com/documentation/

---

## ✅ Próximos Passos

1. **Agora:** Verificar status da conta Apple Developer
2. **Enquanto aguarda:** Continuar desenvolvendo
3. **Quando aprovar:** Seguir `docs/CHECKLIST_POS_APROVACAO_APPLE.md`

Boa sorte! 🚀
