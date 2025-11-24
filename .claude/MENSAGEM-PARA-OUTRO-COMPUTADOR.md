# 💬 Mensagem Pronta para Outro Computador

Copie e cole esta mensagem quando precisar de ajuda no outro computador:

---

**Olá! Estou tentando importar a configuração dos MCPs que foi exportada de outro computador.**

**Contexto:**
- Projeto: Nossa Maternidade Mobile
- Arquivo de backup: `mcp-backup-YYYYMMDD-HHMMSS.zip`
- Configuração: 4 servidores MCP (Supabase, PostgreSQL, GitHub, Docker)

**Já fiz:**
- [ ] Extraí o backup
- [ ] Copiei o mcp.json para `.claude/mcp.json` do projeto
- [ ] Inicializei Docker Swarm
- [ ] Criei os secrets do Docker
- [ ] Reiniciei o Cursor completamente

**Problema atual:**
[Descreva o problema ou dúvida aqui]

**Informações úteis:**
- Sistema Operacional: [Windows/Mac/Linux]
- Docker version: `docker --version`
- Docker Swarm status: `docker info --format '{{.Swarm.LocalNodeState}}'`
- Secrets criados: `docker secret ls`
- Localização do mcp.json: `[caminho completo]`

**Arquivos de contexto disponíveis:**
- `.claude/CONTEXTO-MIGRACAO-MCP.md` - Contexto completo
- `.claude/PASSO-A-PASSO-IMPORTAR.md` - Guia de importação
- `README-IMPORT.md` - Instruções do backup

---

## 🔍 Diagnóstico Rápido

Execute estes comandos e me envie o resultado:

```powershell
# 1. Docker
docker --version
docker info --format '{{.Swarm.LocalNodeState}}'
docker secret ls

# 2. Arquivo
Test-Path ".\.claude\mcp.json"
Get-Content ".\.claude\mcp.json" | ConvertFrom-Json | Select-Object -First 5

# 3. Docker MCP
docker mcp --version
```

---

## 📋 Checklist Rápido

**Pré-requisitos:**
- [ ] Docker Desktop instalado e rodando
- [ ] Cursor IDE instalado
- [ ] Node.js instalado

**Passos de importação:**
- [ ] Backup extraído
- [ ] `mcp.json` copiado para `[projeto]\.claude\mcp.json`
- [ ] Docker Swarm inicializado
- [ ] Secrets criados (github.personal_access_token, postgres.url)
- [ ] Cursor reiniciado completamente
- [ ] MCPs aparecem em Settings > Tools & MCP

---

**Arquivo de contexto completo:** Veja `.claude/CONTEXTO-MIGRACAO-MCP.md`

