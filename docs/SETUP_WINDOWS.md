# 🪟 Setup Windows - Nossa Maternidade

**Guia completo para configurar o ambiente de desenvolvimento no Windows (mesma conta GitHub)**

---

## 📋 PRÉ-REQUISITOS

### 1. Instalar Git para Windows
```powershell
# Baixar e instalar:
# https://git-scm.com/download/win

# Verificar instalação:
git --version
```

### 2. Instalar Node.js (LTS)
```powershell
# Baixar e instalar:
# https://nodejs.org/ (versão LTS)

# Verificar instalação:
node --version
npm --version
```

### 3. Instalar Bun (opcional, mas recomendado - mais rápido)
```powershell
# PowerShell (como administrador):
irm bun.sh/install.ps1 | iex

# Verificar:
bun --version
```

### 4. Instalar Git Bash (para scripts .sh)
- Vem junto com Git for Windows
- Ou instalar separadamente: https://git-scm.com/download/win

---

## 🔑 CONFIGURAR SSH KEY (se ainda não tiver)

### Opção 1: Usar a mesma SSH key do MacBook
```powershell
# 1. Copiar a chave do MacBook para Windows
#    No MacBook, copie: ~/.ssh/id_rsa e ~/.ssh/id_rsa.pub
#    Cole em: C:\Users\SEU_USUARIO\.ssh\

# 2. No Windows, configurar permissões (Git Bash):
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# 3. Testar conexão:
ssh -T git@github.com
```

### Opção 2: Gerar nova SSH key no Windows
```powershell
# Git Bash:
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Adicionar ao ssh-agent:
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública:
cat ~/.ssh/id_ed25519.pub
# Cole no GitHub: Settings > SSH and GPG keys > New SSH key
```

---

## 📥 CLONAR REPOSITÓRIO

### Opção 1: Via SSH (recomendado)
```powershell
# Git Bash ou PowerShell:
cd C:\Users\SEU_USUARIO\Documents
git clone git@github.com:LionGab/NossaMaternidade.git
cd NossaMaternidade
```

### Opção 2: Via HTTPS
```powershell
git clone https://github.com/LionGab/NossaMaternidade.git
cd NossaMaternidade
```

---

## ⚙️ CONFIGURAR GIT

```powershell
# Configurar usuário (se ainda não configurou):
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Verificar configuração:
git config --list
```

---

## 📦 INSTALAR DEPENDÊNCIAS

### Opção 1: Com Bun (mais rápido)
```powershell
# No diretório do projeto:
cd C:\Users\SEU_USUARIO\Documents\NossaMaternidade
bun install
```

### Opção 2: Com npm
```powershell
npm install
```

**Nota:** O script `postinstall` vai executar automaticamente e corrigir problemas do LightningCSS no Windows.

---

## 🔐 CONFIGURAR VARIÁVEIS DE AMBIENTE

### 1. Criar arquivo `.env.local`
```powershell
# No diretório raiz do projeto:
# Copie o conteúdo do .env.local do MacBook
# Ou crie novo baseado no env.template

# Windows PowerShell:
Copy-Item env.template .env.local

# Editar com Notepad ou VS Code:
notepad .env.local
```

### 2. Preencher variáveis necessárias:
```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=sua_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_key
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=sua_url

# APIs
EXPO_PUBLIC_OPENAI_API_KEY=sua_key
EXPO_PUBLIC_GEMINI_API_KEY=sua_key
EXPO_PUBLIC_ELEVENLABS_API_KEY=sua_key
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=sua_id

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=sua_key

# Outros
EXPO_PUBLIC_SENTRY_DSN=sua_dsn
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

---

## ✅ VALIDAR INSTALAÇÃO

### 1. Verificar TypeScript
```powershell
npx tsc --noEmit
# Deve retornar sem erros
```

### 2. Verificar ESLint
```powershell
npm run lint
# Deve retornar sem erros
```

### 3. Verificar Quality Gate
```powershell
# Git Bash (scripts .sh precisam do Git Bash):
git bash scripts/quality-gate.sh

# Ou via npm:
npm run quality-gate
```

### 4. Verificar Build Readiness
```powershell
npm run check-build-ready
```

---

## 🚀 COMANDOS ÚTEIS (Windows)

### Desenvolvimento
```powershell
# Iniciar Expo dev server:
npm start
# ou
bun start

# Rodar no iOS (precisa Mac):
npm run ios

# Rodar no Android:
npm run android

# Rodar no web:
npm run web
```

### Scripts importantes
```powershell
# TypeScript check:
npm run typecheck
# ou
npx tsc --noEmit

# Lint:
npm run lint

# Format:
npm run format

# Quality gate completo:
npm run quality-gate
```

### Git (mesmos comandos)
```powershell
# Status:
git status

# Pull (atualizar do GitHub):
git pull origin main

# Ver commits:
git log --oneline -10

# Criar branch:
git checkout -b nome-da-branch

# Commit:
git add .
git commit -m "mensagem"

# Push:
git push origin main
```

---

## 🛠️ TROUBLESHOOTING

### Problema: Scripts .sh não funcionam
**Solução:** Use Git Bash ao invés de PowerShell/CMD
```powershell
# Abrir Git Bash e executar:
git bash scripts/quality-gate.sh
```

### Problema: LightningCSS erro no Windows
**Solução:** O script `postinstall` deve corrigir automaticamente. Se não:
```powershell
node scripts/fix-lightningcss.js
```

### Problema: Permissões SSH
**Solução:** No Git Bash:
```bash
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Problema: Node modules corrompidos
**Solução:**
```powershell
# Limpar e reinstalar:
npm run clean:all
# ou
rm -rf node_modules
npm install
```

### Problema: Expo não encontra .env.local
**Solução:** Verificar que o arquivo está na raiz do projeto e tem o nome exato `.env.local`

---

## 📝 NOTAS IMPORTANTES

1. **Scripts .sh:** Sempre use Git Bash para executar scripts shell (não PowerShell/CMD)
2. **Caminhos:** Windows usa `\` mas Git Bash aceita `/`
3. **Variáveis de ambiente:** `.env.local` funciona igual no Windows
4. **SSH:** Pode usar a mesma chave do MacBook ou gerar nova
5. **Dependências:** `bun` é mais rápido, mas `npm` também funciona

---

## 🔄 SINCRONIZAÇÃO ENTRE MACBOOK E WINDOWS

### Workflow recomendado:
```powershell
# No Windows (antes de trabalhar):
git pull origin main

# Trabalhar normalmente...

# Antes de finalizar (no Windows):
git add .
git commit -m "feat: descrição"
git push origin main

# No MacBook (depois):
git pull origin main
```

---

## ✅ CHECKLIST FINAL

- [ ] Git instalado e configurado
- [ ] Node.js instalado
- [ ] Bun instalado (opcional)
- [ ] Repositório clonado
- [ ] Dependências instaladas (`bun install` ou `npm install`)
- [ ] `.env.local` configurado
- [ ] SSH key configurada
- [ ] TypeScript validado (`npx tsc --noEmit`)
- [ ] ESLint validado (`npm run lint`)
- [ ] Quality gate passou (`npm run quality-gate`)

---

**Pronto!** Agora você pode trabalhar no Windows e sincronizar com o MacBook via GitHub. 🎉

