# 🔒 Guia de Segurança - Proteção de Chaves de API

Este guia explica como proteger chaves de API no projeto Nossa Maternidade e restringir acesso de colaboradores.

## 🎯 Objetivo

Garantir que:

- ✅ Chaves de API nunca sejam commitadas no Git
- ✅ Colaboradores não tenham acesso a secrets sensíveis
- ✅ Verificações automáticas detectem vazamentos
- ✅ Histórico do Git seja limpo de secrets

## 📋 Checklist de Segurança

### ✅ Configuração Inicial

- [ ] Verificar se `.env` está no `.gitignore`
- [ ] Verificar se `env.template` contém apenas placeholders
- [ ] Configurar todos os secrets no GitHub (Settings → Secrets)
- [ ] Executar `npm run check:secrets` localmente
- [ ] Verificar histórico do Git por chaves expostas

### ✅ Restrição de Acesso

- [ ] Configurar branch protection rules
- [ ] Limitar permissões de Actions para colaboradores
- [ ] Configurar environments protegidos (opcional)
- [ ] Adicionar required reviewers para merges

### ✅ Verificações Automáticas

- [ ] Workflow de secret scanning ativo
- [ ] Pre-commit hooks configurados
- [ ] CI/CD validando antes de merge

## 🔍 Verificações Manuais

### 1. Verificar Histórico do Git

```bash
# Verificar se há arquivos .env commitados
git log --all --full-history --source -- .env .env.local .env.production

# Verificar padrões de chaves no histórico
git log -p --all -S "sk-" --source -- "*.ts" "*.tsx" "*.js" "*.json"
git log -p --all -S "AIza" --source -- "*.ts" "*.tsx" "*.js" "*.json"
git log -p --all -S "ghp_" --source -- "*.ts" "*.tsx" "*.js" "*.json"
```

### 2. Executar Scan Local

```bash
# Verificar secrets no código atual
npm run check:secrets

# Verificar variáveis de ambiente
npm run validate:env
```

### 3. Verificar GitHub Secrets

1. Acesse: `https://github.com/LionGab/NossaMaternidade/settings/secrets/actions`
2. Verifique se todos os secrets necessários estão configurados:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_GEMINI_API_KEY`
   - `EXPO_PUBLIC_CLAUDE_API_KEY`
   - `EXPO_PUBLIC_OPENAI_API_KEY`
   - `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL`
   - `EAS_TOKEN`
   - `EAS_PROJECT_ID`
   - `ASC_KEY_ID` (iOS)
   - `ASC_ISSUER_ID` (iOS)
   - `ASC_KEY_CONTENT` (iOS)
   - `GOOGLE_PLAY_SERVICE_ACCOUNT` (Android)

## 🛡️ Restringir Acesso de Colaboradores

### Opção 1: Limitar Permissões de Actions (Recomendado)

1. **Settings → Actions → General**
2. Em **"Workflow permissions"**:
   - Selecione: **"Read repository contents and packages permissions"**
   - Desmarque: **"Allow GitHub Actions to create and approve pull requests"**
3. Em **"Workflow permissions"** → **"Allow GitHub Actions to create and approve pull requests"**:
   - Desmarque esta opção para colaboradores

### Opção 2: Branch Protection Rules

1. **Settings → Branches**
2. Clique em **"Add rule"** ou edite regra existente para `main`
3. Configure:
   - ✅ **Require pull request reviews before merging**
     - Required approving reviews: `1`
     - Dismiss stale pull request approvals when new commits are pushed: ✅
   - ✅ **Require status checks to pass before merging**
     - Selecione: `design-tokens`, `typescript`, `secret-scanning`
   - ✅ **Restrict who can push to matching branches**
     - Adicione apenas você (owner) e administradores
   - ✅ **Do not allow bypassing the above settings**

### Opção 3: Environments com Proteção

1. **Settings → Environments**
2. Clique em **"New environment"** → Nome: `production`
3. Configure:
   - **Deployment branches**: Restrict to `main` only
   - **Required reviewers**: Adicione você como revisor
   - **Secrets**: Adicione os secrets necessários
4. Atualize workflows para usar o environment:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: production # Adicione esta linha
    steps:
      # ... resto do workflow
```

### Opção 4: Repository Settings

1. **Settings → Collaborators & teams**
2. Para cada colaborador:
   - **Read**: Pode ler código, mas não pode fazer push direto em `main`
   - **Triage**: Pode gerenciar issues, mas não pode fazer push
   - **Write**: Pode fazer push em branches, mas precisa de PR para `main`

## 🧹 Limpar Histórico do Git (Se Necessário)

⚠️ **CUIDADO:** Isso reescreve o histórico. Avise colaboradores antes!

### Método 1: Usando git-filter-repo (Recomendado)

```bash
# Instalar git-filter-repo
pip install git-filter-repo

# Remover arquivo .env do histórico
git filter-repo --path .env --invert-paths

# Remover chave específica (substituir por placeholder)
git filter-repo --replace-text <(echo "EXPO_PUBLIC_GEMINI_API_KEY==>EXPO_PUBLIC_GEMINI_API_KEY=REMOVED")

# ⚠️ AVISO: Force push deve ser feito apenas pelo mantenedor do projeto
# Isso reescreve o histórico do Git e requer coordenação com colaboradores
```

### Método 2: Usando BFG Repo-Cleaner

```bash
# Download: https://rtyley.github.io/bfg-repo-cleaner/

# Remover arquivo .env
bfg --delete-files .env

# Remover chave específica
echo "EXPO_PUBLIC_GEMINI_API_KEY==>EXPO_PUBLIC_GEMINI_API_KEY=REMOVED" > passwords.txt
bfg --replace-text passwords.txt

# Limpar
git reflog expire --expire=now --all
git gc --prune=now --aggressive
# ⚠️ Force push deve ser feito apenas pelo mantenedor do projeto
```

## 🔄 Regenerar Chaves Expostas

Se uma chave foi exposta, **REGENERE-A IMEDIATAMENTE**:

### Google Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Revogue a chave antiga
3. Crie uma nova chave
4. Atualize no GitHub Secrets

### OpenAI

1. Acesse: https://platform.openai.com/api-keys
2. Revogue a chave antiga
3. Crie uma nova chave
4. Atualize no GitHub Secrets

### Claude (Anthropic)

1. Acesse: https://console.anthropic.com/settings/keys
2. Revogue a chave antiga
3. Crie uma nova chave
4. Atualize no GitHub Secrets

### Supabase

1. Acesse: Dashboard do Supabase → Settings → API
2. Gere nova anon key (se necessário)
3. Atualize no GitHub Secrets

## 📊 Monitoramento

### Verificar Workflow de Secret Scanning

1. Acesse: **Actions → 🔒 Secret Scanning**
2. Verifique se está rodando em cada PR
3. Se falhar, revise o código antes de fazer merge

### Logs de Segurança

O workflow de secret scanning:

- ✅ Roda em cada push para `main` e `develop`
- ✅ Roda em cada Pull Request
- ✅ Roda diariamente às 2h UTC (schedule)
- ✅ Falha se detectar secrets

## 🚨 Resposta a Incidentes

Se uma chave foi exposta:

1. **Imediato:**
   - [ ] Regenerar a chave comprometida
   - [ ] Atualizar no GitHub Secrets
   - [ ] Atualizar no Supabase Secrets (se aplicável)

2. **Análise:**
   - [ ] Verificar quando a chave foi exposta: `git log -p -S "chave-exposta"`
   - [ ] Verificar se foi commitada: `git log --all -- .env`
   - [ ] Verificar se está em algum PR aberto

3. **Limpeza:**
   - [ ] Remover do histórico do Git (se necessário)
   - [ ] Notificar colaboradores sobre o incidente
   - [ ] Documentar o incidente

4. **Prevenção:**
   - [ ] Revisar processos de segurança
   - [ ] Adicionar verificações adicionais
   - [ ] Treinar colaboradores

## 📚 Recursos Adicionais

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [TruffleHog Secret Scanning](https://github.com/trufflesecurity/trufflehog)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

## ✅ Checklist Final

Antes de adicionar um novo colaborador:

- [ ] Verificar se branch protection está ativa
- [ ] Verificar se secret scanning está funcionando
- [ ] Verificar se pre-commit hooks estão configurados
- [ ] Enviar documentação de setup para o colaborador
- [ ] Explicar políticas de segurança
- [ ] Configurar permissões apropriadas

---

**Lembre-se:** Segurança é um processo contínuo, não um evento único! 🔒
