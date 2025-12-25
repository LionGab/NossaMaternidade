#!/bin/bash

# ===========================================
# Fix Claude CLI Permission Error (macOS)
# Corrige erro EPERM: operation not permitted, uv_cwd
# ===========================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Corrigindo erro de permissão do Claude CLI${NC}"
echo "=========================================="
echo ""

PROJECT_DIR="$HOME/Documents/Lion/NossaMaternidade"

# Verificar se está no diretório correto
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${RED}❌ Erro: Diretório do projeto não encontrado${NC}"
    exit 1
fi

echo -e "${YELLOW}1. Verificando permissões do diretório...${NC}"
cd "$PROJECT_DIR"
PERMS=$(stat -f "%Sp %u %g" "$PROJECT_DIR")
echo "   Permissões: $PERMS"

# Verificar extended attributes
echo ""
echo -e "${YELLOW}2. Verificando extended attributes...${NC}"
XATTRS=$(xattr -l "$PROJECT_DIR" 2>&1 | wc -l | tr -d ' ')
if [ "$XATTRS" -gt "0" ]; then
    echo "   ⚠️  Extended attributes encontrados:"
    xattr -l "$PROJECT_DIR" 2>&1 | sed 's/^/      /'
    echo ""
    read -p "   Remover extended attributes? (y/N): " REMOVE_XATTR
    if [ "$REMOVE_XATTR" == "y" ] || [ "$REMOVE_XATTR" == "Y" ]; then
        xattr -c "$PROJECT_DIR"
        echo -e "   ${GREEN}✅ Extended attributes removidos${NC}"
    fi
else
    echo -e "   ${GREEN}✅ Nenhum extended attribute problemático${NC}"
fi

# Verificar se o diretório está acessível
echo ""
echo -e "${YELLOW}3. Testando acesso ao diretório...${NC}"
if [ -r "$PROJECT_DIR" ] && [ -w "$PROJECT_DIR" ] && [ -x "$PROJECT_DIR" ]; then
    echo -e "   ${GREEN}✅ Diretório acessível (r/w/x)${NC}"
else
    echo -e "   ${RED}❌ Problema de permissão detectado${NC}"
    echo "   Corrigindo permissões..."
    chmod 755 "$PROJECT_DIR"
    echo -e "   ${GREEN}✅ Permissões corrigidas${NC}"
fi

# Verificar instalação do Claude CLI
echo ""
echo -e "${YELLOW}4. Verificando instalação do Claude CLI...${NC}"
if command -v claude &> /dev/null; then
    CLAUDE_PATH=$(which claude)
    echo "   Localização: $CLAUDE_PATH"
    
    # Verificar se é via Bun
    if [[ "$CLAUDE_PATH" == *".bun"* ]]; then
        echo "   Instalado via: Bun"
        echo ""
        echo -e "${YELLOW}5. Soluções alternativas:${NC}"
        echo ""
        echo "   Opção A: Usar npx diretamente (recomendado)"
        echo "   ──────────────────────────────────────────"
        echo "   npx -y @anthropic-ai/claude-code mcp add ..."
        echo ""
        echo "   Opção B: Reinstalar Claude CLI"
        echo "   ───────────────────────────────"
        echo "   bun remove -g @anthropic-ai/claude-code"
        echo "   bun install -g @anthropic-ai/claude-code"
        echo ""
        echo "   Opção C: Usar caminho absoluto"
        echo "   ──────────────────────────────"
        echo "   cd /tmp"
        echo "   claude mcp add ..."
        echo ""
    else
        echo "   Instalado via: $(which -a claude | head -1)"
    fi
else
    echo -e "   ${RED}❌ Claude CLI não encontrado${NC}"
    echo ""
    echo "   Instale com:"
    echo "   bun install -g @anthropic-ai/claude-code"
fi

# Testar comando alternativo
echo ""
echo -e "${YELLOW}6. Testando solução alternativa...${NC}"
cd /tmp
if npx -y @anthropic-ai/claude-code --version &> /dev/null; then
    echo -e "   ${GREEN}✅ npx funciona corretamente${NC}"
    echo ""
    echo "   Use este comando em vez de 'claude':"
    echo "   npx -y @anthropic-ai/claude-code mcp add ..."
else
    echo -e "   ${YELLOW}⚠️  npx também apresenta problemas${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Diagnóstico concluído${NC}"
echo ""
echo "Próximos passos:"
echo "1. Tente executar o comando de um diretório temporário:"
echo "   cd /tmp && claude mcp add ..."
echo ""
echo "2. Ou use npx diretamente:"
echo "   npx -y @anthropic-ai/claude-code mcp add ..."
echo ""
echo "3. Para configurar MCPs no Cursor, edite diretamente:"
echo "   ~/Library/Application Support/Cursor/User/settings.json"

