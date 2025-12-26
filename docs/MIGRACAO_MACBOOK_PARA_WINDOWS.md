# 🔄 Guia Completo: Migração MacBook → Windows PC

**Objetivo**: Transferir TODAS as configurações do MacBook para o Windows PC para ter ambientes idênticos.

---

## 📋 Checklist Pré-Migração

Antes de começar, verifique se você tem:

- [ ] **Cursor instalado no Windows PC**
- [ ] **Git instalado no Windows PC** (recomendado: Git for Windows com Git Bash)
- [ ] **Node.js/npm instalado no Windows PC** (v18+)
- [ ] **Conta GitHub logada** (para Settings Sync)
- [ ] **Acesso ao repositório** clonado no Windows

---

## 🎯 Estratégia de Sincronização

Usamos **3 métodos** para garantir sincronização completa:

1. **Settings Sync do Cursor** (automático) - Configurações globais, extensões, atalhos
2. **Git** (automático) - Configurações do projeto, scripts, código
3. **Scripts NPM** (manual) - MCPs, configurações específicas do Claude

---

## 🚀 PARTE 1: No MacBook (Fonte)

### 1.1 Habilitar Settings Sync no Cursor

1. Abra o Cursor no MacBook
2. Pressione `Cmd + Shift + P`
3. Digite: `Settings Sync: Turn On...`
4. Escolha **"Sign in with GitHub"**
5. Autorize o Cursor a acessar sua conta GitHub
6. Selecione **TUDO** para sincronizar:
   - ✅ Settings (configurações)
   - ✅ Keyboard Shortcuts (atalhos)
   - ✅ Extensões (extensões)
   - ✅ Snippets (snippets)
   - ✅ UI State (estado da UI)

**Resultado**: Suas configurações globais do Cursor serão sincronizadas automaticamente via nuvem.

### 1.2 Exportar Configurações do Claude Code

No terminal do MacBook:

```bash
cd ~/Documents/Lion/NossaMaternidade

# Exportar configurações do Claude Code
npm run sync:export-claude
```

Isso cria a pasta `.claude-export/` com as configurações do Claude Code.

### 1.3 Commitar e Enviar para o Git

```bash
# Verificar o que foi exportado
git status

# Adicionar arquivos de configuração (se houver novos)
git add .claude-export/ .cursorrules .cursorignore

# Commitar
git commit -m "chore: Export Claude settings for Windows sync"

# Enviar para o repositório
git push
```

### 1.4 Verificar Extensões Instaladas (Opcional)

Para ver quais extensões você tem instaladas:

```bash
# Listar extensões
cursor --list-extensions > extensions-list.txt

# Ou via script
bash scripts/check-cursor-extensions.sh
```

**Anote as extensões importantes** (elas serão sincronizadas automaticamente via Settings Sync, mas é bom ter um backup).

---

## 🖥️ PARTE 2: No Windows PC (Destino)

### 2.1 Configurar Terminal (Git Bash)

**IMPORTANTE**: No Windows, use **Git Bash** para scripts `.sh` (não PowerShell ou CMD).

1. Instalar Git for Windows (inclui Git Bash)
   - Download: https://git-scm.com/download/win
   - Durante instalação: **Selecione "Git Bash Here" nas opções**

2. Configurar Git Bash como terminal padrão do Cursor:
   - Abrir Cursor
   - `Ctrl + Shift + P` → `Terminal: Select Default Profile`
   - Escolher **Git Bash**

3. Configurar Git (primeira vez):

```bash
# No Git Bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Configurar line endings (importante para Windows)
git config --global core.autocrlf true
```

### 2.2 Clonar/Atualizar Repositório

```bash
# Se ainda não clonou
cd C:\Users\SeuUsuario\Documents
git clone <url-do-repositorio>
cd NossaMaternidade

# Se já tem o repositório
cd C:\Users\SeuUsuario\Documents\NossaMaternidade
git pull
```

### 2.3 Instalar Dependências do Projeto

```bash
# Instalar dependências
npm install

# OU se usar bun (mais rápido)
bun install
```

### 2.4 Habilitar Settings Sync no Cursor (Windows)

1. Abra o Cursor no Windows
2. Pressione `Ctrl + Shift + P`
3. Digite: `Settings Sync: Turn On...`
4. Escolha **"Sign in with GitHub"**
5. **Use a MESMA conta GitHub** do MacBook
6. Selecionar **TUDO** para sincronizar:
   - ✅ Settings
   - ✅ Keyboard Shortcuts
   - ✅ Extensões
   - ✅ Snippets
   - ✅ UI State

**Resultado**: O Cursor vai baixar automaticamente todas as configurações do MacBook (pode levar alguns minutos).

### 2.5 Importar Configurações do Claude Code

```bash
# No Git Bash (Windows)
cd C:\Users\SeuUsuario\Documents\NossaMaternidade

# Importar configurações do Claude Code
npm run sync:import-claude
```

Isso copia as configurações de `.claude-export/` para `%USERPROFILE%\.config\claude-code\`.

### 2.6 Configurar MCPs no Windows

Os MCPs precisam ser configurados manualmente no Windows (paths diferentes do macOS).

#### Opção A: Script Automático (Recomendado)

```bash
# No Git Bash
cd C:\Users\SeuUsuario\Documents\NossaMaternidade
bash scripts/setup-mcps.sh
```

#### Opção B: Configuração Manual

1. Abrir Cursor Settings: `Ctrl + ,`
2. Buscar por: `mcp` ou `Model Context Protocol`
3. Clicar em "Edit in settings.json"
4. Adicionar os MCPs:

```json
{
  "mcpServers": {
    "expo-mcp": {
      "description": "Expo MCP Server para builds iOS/Android",
      "transport": "http",
      "url": "https://mcp.expo.dev/mcp"
    },
    "context7": {
      "description": "Documentação atualizada de libraries",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "memory-keeper": {
      "description": "Persistência de contexto entre sessões",
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "env": {
        "MCP_MEMORY_DB_PATH": ".claude/context.db"
      }
    },
    "playwright": {
      "description": "Testes visuais automatizados",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-playwright"]
    },
    "figma-devmode": {
      "description": "Figma Dev Mode MCP Server (local)",
      "transport": "sse",
      "url": "http://127.0.0.1:3845/sse",
      "requires": ["Figma Desktop App com Dev Mode MCP habilitado"]
    }
  }
}
```

**Localização do arquivo no Windows:**

```
%APPDATA%\Cursor\User\settings.json
```

Caminho completo exemplo:

```
C:\Users\SeuUsuario\AppData\Roaming\Cursor\User\settings.json
```

### 2.7 Configurar Supabase CLI (Se usar Supabase)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Ou via Scoop (Windows package manager)
scoop install supabase

# Login
supabase login

# Link do projeto (após git pull)
cd C:\Users\SeuUsuario\Documents\NossaMaternidade
supabase link --project-ref SEU_PROJECT_REF
```

### 2.8 Ajustar Paths do Filesystem MCP (Se necessário)

O MCP Filesystem precisa do caminho absoluto do projeto no Windows.

Editar `.claude/mcp-config.json` e atualizar o path do filesystem MCP:

```json
{
  "filesystem": {
    "args": [
      "@modelcontextprotocol/server-filesystem",
      "C:\\Users\\SeuUsuario\\Documents\\NossaMaternidade"
    ]
  }
}
```

**Nota**: Use barras invertidas duplas (`\\`) no Windows para paths JSON.

Ou use o script automático:

```bash
npm run sync:fix-mcp-paths
```

### 2.9 Instalar Extensões Recomendadas do Projeto

As extensões são sincronizadas automaticamente via Settings Sync, mas você pode instalar manualmente as recomendadas do projeto:

```bash
# Via script (recomendado)
npm run sync:install-extensions

# Ou manualmente via Cursor
# Cmd/Ctrl + Shift + X → Buscar e instalar:
# - ESLint
# - Prettier
# - Tailwind CSS IntelliSense
# - GitLens
# - Expo Tools
# - Error Lens
```

### 2.10 Reiniciar o Cursor

**CRÍTICO**: Após todas as configurações, **feche completamente o Cursor** e abra novamente para aplicar todas as mudanças.

```bash
# No Git Bash, você pode usar:
cursor --reuse-window
```

Ou simplesmente: Feche todas as janelas do Cursor e abra novamente.

---

## ✅ PARTE 3: Verificação Final

### 3.1 Verificar Settings Sync

1. Abra Cursor no Windows
2. `Ctrl + Shift + P` → `Settings Sync: Show Synced Data`
3. Verifique se mostra: **"Synced with GitHub"**
4. Verifique se todas as extensões estão instaladas

### 3.2 Verificar MCPs

1. Abra Cursor
2. Use o Composer (`Ctrl + I`)
3. Tente usar uma ferramenta MCP (ex: `@supabase` ou `@context7`)
4. Se funcionar, os MCPs estão configurados corretamente

Ou via script:

```bash
npm run sync:verify
```

### 3.3 Verificar Configurações do Projeto

```bash
# Verificar se tudo está ok
npm run typecheck
npm run lint
npm run quality-gate
```

### 3.4 Testar Execução do Projeto

```bash
# Iniciar Expo
npm start

# Ou rodar no Android Emulator
npm run android

# Ou rodar no navegador
npm run web
```

---

## 🔄 Uso Diário (Após Migração)

### Ao Trocar de Computador

**Sempre que você sentar para trabalhar:**

```bash
# 1. Atualizar código do Git
git pull

# 2. Instalar dependências (se necessário)
npm install

# 3. Iniciar projeto
npm start
```

**Só isso!** ✨

O Settings Sync do Cursor sincroniza automaticamente:

- ✅ Configurações globais
- ✅ Extensões instaladas
- ✅ Atalhos de teclado
- ✅ Snippets customizados

O Git sincroniza automaticamente:

- ✅ Configurações do projeto (`.vscode/`, `.claude/`)
- ✅ Scripts NPM
- ✅ Código

---

## 🛠️ Comandos Úteis de Sincronização

| Comando                           | Uso                                 | Quando Executar             |
| --------------------------------- | ----------------------------------- | --------------------------- |
| `npm run sync:verify`             | Verifica se está tudo sincronizado  | Quando tiver dúvida         |
| `npm run sync:install-extensions` | Instala extensões recomendadas      | Primeira vez no Windows     |
| `npm run sync:export-claude`      | Exporta configs do Claude (MacBook) | Quando mudar configs no Mac |
| `npm run sync:import-claude`      | Importa configs do Claude (Windows) | Primeira vez no Windows     |
| `npm run sync:fix-mcp-paths`      | Ajusta paths do MCP                 | Se MCPs não funcionarem     |
| `npm run sync:all`                | Faz tudo de uma vez                 | Primeira vez no Windows     |

---

## 🐛 Troubleshooting

### Settings Sync não está funcionando

1. Verifique se está logado com a mesma conta GitHub em ambos os PCs
2. Verifique conexão com internet
3. Tente desligar e religar o Settings Sync:
   - `Ctrl + Shift + P` → `Settings Sync: Turn Off...`
   - Aguarde 10 segundos
   - `Ctrl + Shift + P` → `Settings Sync: Turn On...`

### MCPs não estão funcionando

1. Verifique se o arquivo `settings.json` está correto (sintaxe JSON válida)
2. Verifique se os paths estão corretos para Windows (use `C:\\` não `/`)
3. Reinicie o Cursor completamente
4. Execute: `npm run sync:fix-mcp-paths`

### Extensões não sincronizaram

1. Verifique Settings Sync (veja acima)
2. Instale manualmente: `npm run sync:install-extensions`
3. Ou instale via interface: `Ctrl + Shift + X`

### Scripts `.sh` não funcionam

**IMPORTANTE**: No Windows, use **Git Bash** (não PowerShell ou CMD).

1. Instalar Git for Windows (inclui Git Bash)
2. Configurar Git Bash como terminal padrão no Cursor
3. Execute scripts no Git Bash: `bash scripts/nome-do-script.sh`

### Paths diferentes entre Mac e Windows

Alguns arquivos têm paths específicos do sistema operacional:

- **MCP Filesystem**: Precisa do path absoluto do projeto (já corrigido pelo script `sync:fix-mcp-paths`)
- **Supabase**: Paths são relativos (funciona igual)
- **Node modules**: Paths são relativos (funciona igual)

---

## 📚 Referências

- **Guia Rápido**: `docs/GUIA_RAPIDO_SYNC.md`
- **Sincronização Definitiva**: `docs/SINCRONIZACAO_DEFINITIVA.md`
- **MCP Setup Windows**: `docs/MCP_SETUP_WINDOWS.md`
- **Windows Setup**: `docs/WINDOWS_SETUP.md`
- **Cursor Setup**: `docs/CURSOR_CLAUDE_SETUP.md`

---

## ✅ Checklist Final

Após seguir todos os passos, você deve ter:

- [ ] Settings Sync habilitado e funcionando (mesmo GitHub em ambos PCs)
- [ ] Todas as extensões instaladas
- [ ] MCPs configurados e funcionando
- [ ] Projeto rodando (`npm start`)
- [ ] Scripts funcionando no Git Bash
- [ ] TypeScript e lint sem erros
- [ ] Git configurado corretamente

**Se todos os itens estão marcados: PARABÉNS! 🎉** Seu ambiente Windows está 100% sincronizado com o MacBook.

---

**Criado em**: 2025-01-XX
**Última atualização**: 2025-01-XX
**Versão**: 1.0.0
