#!/bin/bash

# Script para exportar configuração dos MCPs
# Uso: ./export-mcp-config.sh [caminho-do-backup]

set -e

BACKUP_DIR="${1:-./mcp-backup-$(date +%Y%m%d-%H%M%S)}"
BACKUP_FILE="${BACKUP_DIR}.tar.gz"

echo "📦 Exportando configuração dos MCPs..."
echo "📁 Diretório de backup: ${BACKUP_DIR}"

# Criar diretório temporário
mkdir -p "${BACKUP_DIR}"

# 1. Exportar mcp.json (sem credenciais sensíveis)
echo "📄 Exportando mcp.json..."
cp .claude/mcp.json "${BACKUP_DIR}/mcp.json" 2>/dev/null || echo "⚠️  mcp.json não encontrado"

# Copiar também o exemplo como referência
cp .claude/mcp.json.example "${BACKUP_DIR}/mcp.json.example" 2>/dev/null || true

# 2. Exportar secrets do Docker
echo "🔐 Exportando secrets do Docker..."
if docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q "active"; then
    echo "# Docker Secrets - Execute estes comandos no computador destino" > "${BACKUP_DIR}/docker-secrets.sh"
    echo "# Inicialize o Swarm primeiro: docker swarm init" >> "${BACKUP_DIR}/docker-secrets.sh"
    echo "" >> "${BACKUP_DIR}/docker-secrets.sh"
    
    # Exportar github.personal_access_token se existir
    if docker secret inspect github.personal_access_token >/dev/null 2>&1; then
        SECRET_VALUE=$(docker secret inspect github.personal_access_token --format '{{.Spec.Data}}' 2>/dev/null || echo "")
        if [ -n "$SECRET_VALUE" ]; then
            echo "# GitHub Personal Access Token" >> "${BACKUP_DIR}/docker-secrets.sh"
            echo "echo -n '${SECRET_VALUE}' | docker secret create github.personal_access_token -" >> "${BACKUP_DIR}/docker-secrets.sh"
            echo "" >> "${BACKUP_DIR}/docker-secrets.sh"
        fi
    fi
    
    # Exportar postgres.url se existir
    if docker secret inspect postgres.url >/dev/null 2>&1; then
        SECRET_VALUE=$(docker secret inspect postgres.url --format '{{.Spec.Data}}' 2>/dev/null || echo "")
        if [ -n "$SECRET_VALUE" ]; then
            echo "# PostgreSQL Connection String" >> "${BACKUP_DIR}/docker-secrets.sh"
            echo "echo -n '${SECRET_VALUE}' | docker secret create postgres.url -" >> "${BACKUP_DIR}/docker-secrets.sh"
            echo "" >> "${BACKUP_DIR}/docker-secrets.sh"
        fi
    fi
    
    # Lista de todos os secrets
    docker secret ls > "${BACKUP_DIR}/docker-secrets-list.txt" 2>/dev/null || true
else
    echo "⚠️  Docker Swarm não está ativo. Secrets não serão exportados."
    echo "# Docker Swarm não inicializado no computador origem" > "${BACKUP_DIR}/docker-secrets.sh"
fi

# 3. Criar arquivo de instruções
cat > "${BACKUP_DIR}/README-IMPORT.md" << 'EOF'
# 📥 Como Importar Configuração dos MCPs

## Pré-requisitos

1. **Docker Desktop** instalado (versão 4.43+)
2. **Cursor IDE** instalado
3. **Node.js** instalado (para npx)

## Passos para Importar

### 1. Copiar Arquivos

```bash
# Copie o diretório .claude para o novo projeto/computador
cp -r .claude /caminho/do/projeto/.claude
```

### 2. Restaurar mcp.json

```bash
# O arquivo mcp.json já está na pasta .claude
# Certifique-se de que as credenciais estão corretas
```

**⚠️ IMPORTANTE**: Edite `.claude/mcp.json` e verifique/atualize:
- GitHub Personal Access Token
- PostgreSQL Connection String (senha do banco)
- Outras credenciais sensíveis

### 3. Configurar Docker Secrets

```bash
# 1. Inicializar Docker Swarm (se ainda não estiver)
docker swarm init

# 2. Executar o script de secrets (edite antes se necessário)
chmod +x docker-secrets.sh
./docker-secrets.sh

# OU criar manualmente:
echo -n "seu-token-github" | docker secret create github.personal_access_token -
echo -n "postgresql://user:password@host:5432/db" | docker secret create postgres.url -
```

### 4. Verificar Instalação

```bash
# Verificar Docker MCP
docker mcp --version

# Verificar secrets
docker secret ls

# Verificar se o Docker Swarm está ativo
docker info --format '{{.Swarm.LocalNodeState}}'
```

### 5. Reiniciar Cursor

Após importar:
1. Feche completamente o Cursor
2. Abra novamente
3. Vá em **Settings > Tools & MCP**
4. Verifique se todos os servidores MCP aparecem

## Servidores MCP Configurados

- ✅ **Supabase** (HTTP) - Não requer configuração adicional
- ✅ **PostgreSQL** (Stdio via npx) - Requer connection string no mcp.json
- ✅ **GitHub** (Stdio via npx) - Requer token no mcp.json
- ✅ **Docker** (Gateway) - Requer Docker Swarm + secrets

## Troubleshooting

### Secrets não encontrados
```bash
# Recriar secrets
docker secret rm github.personal_access_token postgres.url 2>/dev/null || true
# Depois recriar conforme instruções acima
```

### Docker Swarm não inicializa
```bash
# Verificar se Docker está rodando
docker info

# Tentar inicializar novamente
docker swarm leave --force 2>/dev/null || true
docker swarm init
```

### MCPs não aparecem no Cursor
1. Verificar se `.claude/mcp.json` está no lugar correto
2. Verificar sintaxe JSON: `cat .claude/mcp.json | jq .`
3. Verificar logs do Cursor
4. Reiniciar Cursor completamente
EOF

# 4. Criar script de importação
cat > "${BACKUP_DIR}/import-mcp-config.sh" << 'EOF'
#!/bin/bash

# Script para importar configuração dos MCPs
# Uso: ./import-mcp-config.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "📥 Importando configuração dos MCPs..."
echo "📁 Diretório do projeto: ${PROJECT_ROOT}"

# 1. Criar diretório .claude se não existir
mkdir -p "${PROJECT_ROOT}/.claude"

# 2. Copiar mcp.json
if [ -f "${SCRIPT_DIR}/mcp.json" ]; then
    echo "📄 Copiando mcp.json..."
    cp "${SCRIPT_DIR}/mcp.json" "${PROJECT_ROOT}/.claude/mcp.json"
    echo "⚠️  EDITAR .claude/mcp.json e atualizar credenciais sensíveis!"
else
    echo "⚠️  mcp.json não encontrado no backup"
fi

# 3. Copiar mcp.json.example se existir
if [ -f "${SCRIPT_DIR}/mcp.json.example" ]; then
    cp "${SCRIPT_DIR}/mcp.json.example" "${PROJECT_ROOT}/.claude/mcp.json.example"
fi

# 4. Inicializar Docker Swarm
echo "🐳 Verificando Docker Swarm..."
if ! docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q "active"; then
    echo "🔧 Inicializando Docker Swarm..."
    docker swarm init
else
    echo "✅ Docker Swarm já está ativo"
fi

# 5. Criar secrets do Docker
if [ -f "${SCRIPT_DIR}/docker-secrets.sh" ]; then
    echo "🔐 Configurando Docker Secrets..."
    echo "⚠️  Execute manualmente: ${SCRIPT_DIR}/docker-secrets.sh"
    echo "⚠️  OU edite o arquivo e execute:"
    echo "   cd ${SCRIPT_DIR}"
    echo "   chmod +x docker-secrets.sh"
    echo "   ./docker-secrets.sh"
else
    echo "⚠️  docker-secrets.sh não encontrado"
fi

echo ""
echo "✅ Importação concluída!"
echo "📖 Veja README-IMPORT.md para próximos passos"
EOF

chmod +x "${BACKUP_DIR}/import-mcp-config.sh"

# 5. Criar arquivo com valores dos secrets (CUIDADO: contém senhas!)
echo "⚠️  Criando arquivo com valores dos secrets (EDITAR COM CUIDADO)..."
cat > "${BACKUP_DIR}/secrets-values.txt" << EOF
# ⚠️  ATENÇÃO: Este arquivo contém credenciais sensíveis!
# NÃO compartilhe este arquivo publicamente
# Delete após importar no computador destino

# GitHub Personal Access Token
# Obtenha do mcp.json ou crie novo em: https://github.com/settings/tokens
GITHUB_TOKEN=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

# PostgreSQL Connection String
# Formato: postgresql://user:password@host:port/database
POSTGRES_URL=postgresql://postgres:9E2XLJVsYzGGhuKP@db.mnszbkeuerjcevjvdqme.supabase.co:5432/postgres

# Para criar os secrets:
# echo -n "\$GITHUB_TOKEN" | docker secret create github.personal_access_token -
# echo -n "\$POSTGRES_URL" | docker secret create postgres.url -
EOF

echo "⚠️  REMOVA O ARQUIVO secrets-values.txt APÓS IMPORTAR!"

# 6. Compactar tudo
echo "📦 Compactando backup..."
tar -czf "${BACKUP_FILE}" "${BACKUP_DIR}"

echo ""
echo "✅ Exportação concluída!"
echo "📁 Backup criado: ${BACKUP_FILE}"
echo "📂 Diretório: ${BACKUP_DIR}"
echo ""
echo "📖 Para importar em outro computador:"
echo "   1. Copie o arquivo ${BACKUP_FILE}"
echo "   2. Extraia: tar -xzf ${BACKUP_FILE}"
echo "   3. Siga as instruções em ${BACKUP_DIR}/README-IMPORT.md"
echo ""
echo "⚠️  CUIDADO: secrets-values.txt contém senhas! Delete após usar."

