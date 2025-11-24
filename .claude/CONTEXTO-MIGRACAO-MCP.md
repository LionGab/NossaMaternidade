# 📋 Contexto: Migração de Configuração MCP

**Data:** 2025-01-27  
**Projeto:** Nossa Maternidade Mobile  
**Configuração:** MCPs (Model Context Protocol) exportada

---

## 🎯 O Que Foi Configurado

Este projeto tem 4 servidores MCP configurados:

1. **Supabase MCP** (HTTP)
   - URL: `https://mcp.supabase.com/mcp`
   - Tipo: HTTP (sem configuração adicional necessária)

2. **PostgreSQL MCP** (Stdio via npx)
   - Comando: `npx -y @modelcontextprotocol/server-postgres`
   - Connection String: configurada no `mcp.json`
   - Requer: PostgreSQL connection string válida

3. **GitHub MCP** (Stdio via npx)
   - Comando: `npx -y @modelcontextprotocol/server-github`
   - Requer: GitHub Personal Access Token
   - Token: configurado em `mcp.json` e Docker secret

4. **Docker MCP** (Gateway)
   - Comando: `docker mcp gateway run`
   - Requer: Docker Swarm + secrets configurados
   - Secrets necessários:
     - `github.personal_access_token`
     - `postgres.url`

---

## 📁 Estrutura de Arquivos

```
projeto/
└── .claude/
    ├── mcp.json                    # Configuração completa (COM credenciais)
    ├── mcp.json.example            # Template (SEM credenciais)
    ├── README.md                   # Documentação geral
    ├── PASSO-A-PASSO-IMPORTAR.md   # Guia de importação
    └── GUIA-EXPORTAR-IMPORTAR.md   # Guia completo export/import
```

**⚠️ IMPORTANTE:**
- `.claude/mcp.json` contém credenciais sensíveis
- Está no `.gitignore` (não é versionado)
- NUNCA commite este arquivo

---

## 🔐 Credenciais Necessárias

### 1. GitHub Personal Access Token
- Onde obter: https://github.com/settings/tokens
- Configurado em: `.claude/mcp.json` → `mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN`
- Docker secret: `github.personal_access_token`

### 2. PostgreSQL Connection String
- Formato: `postgresql://user:password@host:port/database`
- Configurado em: `.claude/mcp.json` → `mcpServers.postgres.args[2]`
- Docker secret: `postgres.url`

### 3. Supabase
- URL e ANON_KEY configurados (não usado nos MCPs, apenas no app)

---

## 🚀 Como Importar (Resumo Rápido)

### 1. Pré-requisitos
```powershell
# Verificar instalações
docker --version      # Deve ser 4.43+
cursor --version      # Cursor IDE
node --version        # Node.js para npx
```

### 2. Extrair Backup
```powershell
Expand-Archive -Path mcp-backup-*.zip -DestinationPath .
cd mcp-backup-*
```

### 3. Copiar mcp.json
```powershell
# Criar pasta .claude no projeto
New-Item -ItemType Directory -Force -Path "[projeto]\.claude"

# Copiar mcp.json
Copy-Item ".\mcp.json" "[projeto]\.claude\mcp.json"
```

### 4. Configurar Docker
```powershell
# Inicializar Swarm
docker swarm init

# Criar secrets (valores em secrets-values.txt)
$githubToken = "VALOR_DO_ARQUIVO"
echo -n $githubToken | docker secret create github.personal_access_token -

$postgresUrl = "VALOR_DO_ARQUIVO"
echo -n $postgresUrl | docker secret create postgres.url -

# Verificar
docker secret ls
```

### 5. Reiniciar Cursor
- Fechar completamente
- Abrir novamente
- Verificar em Settings > Tools & MCP

---

## 📝 Formato do mcp.json

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:PASSWORD@db.host.supabase.co:5432/postgres"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_TOKEN_AQUI"
      }
    },
    "docker": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"],
      "type": "stdio"
    }
  }
}
```

---

## 🆘 Problemas Comuns

### "mcp.json não encontrado"
- Verificar: `[projeto]\.claude\mcp.json` existe
- Não confundir com: `[projeto]\.claude\.claude\mcp.json`

### "Docker Swarm não inicializado"
```powershell
docker swarm init
```

### "Secret não encontrado"
```powershell
# Verificar secrets existentes
docker secret ls

# Recriar se necessário
docker secret rm github.personal_access_token postgres.url
# Depois recriar conforme passo 4
```

### "MCPs não aparecem no Cursor"
1. Verificar sintaxe JSON: `Get-Content mcp.json | ConvertFrom-Json`
2. Verificar localização correta
3. Reiniciar Cursor completamente
4. Verificar logs do Cursor

---

## 📚 Arquivos de Referência no Backup

- `mcp.json` - Configuração completa (COM credenciais)
- `secrets-values.txt` - Valores das credenciais (⚠️ DELETE após usar)
- `docker-secrets.ps1` - Script para criar secrets
- `README-IMPORT.md` - Instruções detalhadas
- `docker-secrets-list.txt` - Lista de secrets criados

---

## ✅ Checklist de Verificação

Após importar, verificar:

- [ ] Docker instalado e rodando
- [ ] Docker Swarm inicializado (`docker swarm init`)
- [ ] Secrets criados (`docker secret ls` mostra 2 secrets)
- [ ] `mcp.json` em `[projeto]\.claude\mcp.json`
- [ ] Cursor reiniciado completamente
- [ ] MCPs aparecem em Settings > Tools & MCP:
  - [ ] supabase
  - [ ] postgres
  - [ ] github
  - [ ] docker

---

## 🔒 Segurança

**Após importar:**
1. Delete `secrets-values.txt` (contém senhas)
2. Não compartilhe `mcp.json` publicamente
3. Não commite `mcp.json` no Git (já está no .gitignore)

---

## 💡 Dicas Rápidas

### Verificar se tudo está funcionando:
```powershell
# Docker
docker mcp --version
docker info --format '{{.Swarm.LocalNodeState}}'
docker secret ls

# Arquivo
Test-Path "[projeto]\.claude\mcp.json"

# JSON válido
Get-Content "[projeto]\.claude\mcp.json" | ConvertFrom-Json
```

### Localização correta do mcp.json:
- ✅ Correto: `C:\projeto\.claude\mcp.json`
- ❌ Errado: `C:\projeto\.claude\.claude\mcp.json`
- ❌ Errado: `C:\projeto\mcp.json`

---

## 📞 Comandos Úteis

```powershell
# Ver status completo
docker info --format '{{.Swarm.LocalNodeState}}'
docker secret ls
docker mcp --version

# Remover e recriar secrets
docker secret rm github.personal_access_token postgres.url
# Depois recriar conforme instruções

# Reiniciar Swarm
docker swarm leave --force
docker swarm init
```

---

## 📖 Documentação Completa

Para mais detalhes, consulte:
- `.claude/PASSO-A-PASSO-IMPORTAR.md` - Guia passo a passo
- `.claude/GUIA-EXPORTAR-IMPORTAR.md` - Guia completo
- `.claude/README.md` - Documentação geral dos MCPs

---

**Última atualização:** 2025-01-27  
**Status:** Configuração exportada e pronta para importação  
**Backup criado:** mcp-backup-YYYYMMDD-HHMMSS.zip

