# 📦 Guia Completo: Exportar e Importar Configuração dos MCPs

Este guia explica como salvar e transferir a configuração dos MCPs para outro terminal ou computador.

## 🎯 Método 1: Script Automático (Recomendado)

### No Computador Origem (Exportar)

#### Windows (PowerShell):
```powershell
cd .claude
.\export-mcp-config.ps1
```

#### Linux/Mac (Bash):
```bash
cd .claude
chmod +x export-mcp-config.sh
./export-mcp-config.sh
```

Isso criará um arquivo compactado com:
- ✅ `mcp.json` (com credenciais)
- ✅ `mcp.json.example` (template)
- ✅ `docker-secrets.ps1` / `docker-secrets.sh` (scripts para recriar secrets)
- ✅ `secrets-values.txt` (valores das credenciais - ⚠️ CUIDADO!)
- ✅ `README-IMPORT.md` (instruções de importação)
- ✅ `docker-secrets-list.txt` (lista de secrets)

### No Computador Destino (Importar)

1. **Copiar o arquivo compactado**
   ```bash
   # Copie o arquivo .zip ou .tar.gz para o novo computador
   ```

2. **Extrair**
   ```bash
   # Linux/Mac
   tar -xzf mcp-backup-YYYYMMDD-HHMMSS.tar.gz
   
   # Windows PowerShell
   Expand-Archive -Path mcp-backup-YYYYMMDD-HHMMSS.zip -DestinationPath .
   ```

3. **Seguir README-IMPORT.md**
   - Copiar `.claude/mcp.json` para o projeto
   - Configurar Docker Secrets
   - Reiniciar Cursor

---

## 🎯 Método 2: Manual (Passo a Passo)

### 1. Exportar Configuração

#### a) Copiar Arquivos de Configuração

```bash
# Criar diretório de backup
mkdir mcp-backup
cd mcp-backup

# Copiar mcp.json (contém todas as configurações)
cp ../.claude/mcp.json .

# Copiar exemplo também
cp ../.claude/mcp.json.example .
```

#### b) Salvar Credenciais dos Secrets do Docker

```bash
# Listar secrets existentes
docker secret ls > docker-secrets-list.txt

# Criar arquivo com valores (EDITAR MANUALMENTE com os valores corretos)
cat > secrets-values.txt << 'EOF'
# GitHub Personal Access Token
GITHUB_TOKEN=seu-token-aqui

# PostgreSQL Connection String
POSTGRES_URL=postgresql://user:password@host:5432/db
EOF
```

**⚠️ IMPORTANTE**: Você precisará copiar manualmente os valores das credenciais do `.claude/mcp.json`:
- `GITHUB_PERSONAL_ACCESS_TOKEN` → do `mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN`
- `POSTGRES_URL` → do `mcpServers.postgres.args[2]`

#### c) Criar Script de Restauração

**Windows (PowerShell):**
```powershell
# Criar docker-secrets-restore.ps1
@"
# Restaurar Docker Secrets

# 1. Inicializar Swarm
docker swarm init

# 2. Criar secrets (EDITAR OS VALORES)
`$githubToken = "seu-token-aqui"
echo -n `$githubToken | docker secret create github.personal_access_token -

`$postgresUrl = "postgresql://user:password@host:5432/db"
echo -n `$postgresUrl | docker secret create postgres.url -

# Verificar
docker secret ls
"@ | Out-File -FilePath docker-secrets-restore.ps1
```

**Linux/Mac (Bash):**
```bash
# Criar docker-secrets-restore.sh
cat > docker-secrets-restore.sh << 'EOF'
#!/bin/bash
# Restaurar Docker Secrets

# 1. Inicializar Swarm
docker swarm init

# 2. Criar secrets (EDITAR OS VALORES)
echo -n "seu-token-aqui" | docker secret create github.personal_access_token -
echo -n "postgresql://user:password@host:5432/db" | docker secret create postgres.url -

# Verificar
docker secret ls
EOF

chmod +x docker-secrets-restore.sh
```

### 2. Transferir para Outro Computador

Copie a pasta `mcp-backup` completa para o novo computador via:
- USB drive
- Cloud storage (Google Drive, Dropbox, OneDrive)
- Git (⚠️ NUNCA commite secrets-values.txt!)
- Rede compartilhada
- Email (⚠️ apenas se seguro, não recomendado para produção)

### 3. Importar no Computador Destino

#### a) Copiar Arquivos

```bash
# No projeto destino
cp mcp-backup/mcp.json .claude/mcp.json

# Verificar credenciais
cat .claude/mcp.json
# ⚠️ Editar se necessário
```

#### b) Configurar Docker

```bash
# 1. Verificar se Docker está instalado
docker --version

# 2. Verificar se Docker Swarm está ativo
docker info --format '{{.Swarm.LocalNodeState}}'

# 3. Se não estiver ativo, inicializar
docker swarm init

# 4. Executar script de restauração (EDITAR VALORES PRIMEIRO!)
# Windows:
.\docker-secrets-restore.ps1

# Linux/Mac:
./docker-secrets-restore.sh

# 5. Verificar secrets criados
docker secret ls
```

#### c) Verificar Configuração

```bash
# Verificar Docker MCP
docker mcp --version

# Listar secrets
docker secret ls
# Deve mostrar:
# - github.personal_access_token
# - postgres.url
```

#### d) Reiniciar Cursor

1. Feche completamente o Cursor
2. Abra novamente
3. Vá em **Settings > Tools & MCP**
4. Verifique se os servidores aparecem:
   - ✅ Supabase
   - ✅ postgres
   - ✅ github
   - ✅ docker

---

## 🔒 Segurança

### ⚠️ O QUE NÃO FAZER:

1. ❌ **NÃO commite** `mcp.json` ou `secrets-values.txt` no Git
2. ❌ **NÃO compartilhe** credenciais publicamente
3. ❌ **NÃO envie** secrets por email não criptografado
4. ❌ **NÃO deixe** `secrets-values.txt` em locais públicos

### ✅ O QUE FAZER:

1. ✅ Use os scripts de exportação que criam avisos
2. ✅ Delete `secrets-values.txt` após importar
3. ✅ Use variáveis de ambiente quando possível
4. ✅ Revise `mcp.json.example` (sem credenciais) como template
5. ✅ Use gerenciadores de senhas (1Password, LastPass, etc.)

---

## 📋 Checklist de Migração

### Antes de Exportar:
- [ ] Docker Swarm inicializado
- [ ] Secrets do Docker criados
- [ ] `mcp.json` atualizado com credenciais corretas
- [ ] Scripts de exportação executados

### Ao Transferir:
- [ ] Backup compactado criado
- [ ] Arquivo transferido com segurança
- [ ] `secrets-values.txt` protegido (não público)

### Ao Importar:
- [ ] Docker instalado no destino
- [ ] Docker Swarm inicializado
- [ ] Secrets criados corretamente
- [ ] `mcp.json` copiado e credenciais verificadas
- [ ] Cursor reiniciado
- [ ] MCPs aparecendo em Settings > Tools & MCP

---

## 🆘 Troubleshooting

### Secrets não funcionam após importar

```bash
# Recriar secrets
docker secret rm github.personal_access_token postgres.url
# Depois recriar com valores corretos
```

### Docker Swarm não inicializa

```bash
# Verificar se Docker está rodando
docker info

# Forçar reinicialização
docker swarm leave --force
docker swarm init
```

### MCPs não aparecem no Cursor

1. Verificar sintaxe do JSON:
   ```bash
   cat .claude/mcp.json | jq .
   ```

2. Verificar localização:
   - Arquivo deve estar em: `[projeto]/.claude/mcp.json`

3. Verificar logs do Cursor:
   - Ver logs de erro no console do Cursor

4. Reiniciar completamente:
   - Fechar todas as janelas do Cursor
   - Abrir novamente

### Erro "No server info found"

Normal durante inicialização. Se persistir:
1. Verifique se Docker está rodando
2. Verifique secrets do Docker
3. Verifique sintaxe do `mcp.json`

---

## 📚 Arquivos Criados pelos Scripts

```
mcp-backup-YYYYMMDD-HHMMSS/
├── mcp.json                    # Configuração completa (COM credenciais)
├── mcp.json.example            # Template (SEM credenciais)
├── docker-secrets.sh/.ps1      # Script para recriar secrets
├── docker-secrets-list.txt     # Lista de secrets
├── secrets-values.txt          # Valores das credenciais (⚠️ CUIDADO!)
├── README-IMPORT.md            # Instruções de importação
└── import-mcp-config.sh/.ps1   # Script automático de importação
```

---

## 🎯 Resumo Rápido

**Exportar:**
```bash
cd .claude
./export-mcp-config.sh    # Linux/Mac
.\export-mcp-config.ps1   # Windows
```

**Importar:**
1. Extrair backup
2. Copiar `mcp.json` para `.claude/`
3. Executar `docker-secrets-restore.sh/.ps1`
4. Reiniciar Cursor

---

**Última atualização**: 2025-01-27  
**Criado por**: Sistema de Exportação Automática

