#!/bin/bash
# Gemini CLI Helper Script para Mac/Linux
# Uso: ./scripts/gemini-cli.sh [comandos do gemini]

# Obtém o diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
ENV_FILE="$PROJECT_ROOT/.env"

# Verifica se o .env existe e carrega a API key
if [ -f "$ENV_FILE" ]; then
    # Tenta GEMINI_API_KEY primeiro
    if grep -q "^GEMINI_API_KEY=" "$ENV_FILE"; then
        export GEMINI_API_KEY=$(grep "^GEMINI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' | tr -d "'")
        echo "✅ API Key carregada do .env (GEMINI_API_KEY)"
    # Se não encontrar, tenta EXPO_PUBLIC_GEMINI_API_KEY
    elif grep -q "^EXPO_PUBLIC_GEMINI_API_KEY=" "$ENV_FILE"; then
        export GEMINI_API_KEY=$(grep "^EXPO_PUBLIC_GEMINI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2 | tr -d '"' | tr -d "'")
        echo "✅ API Key carregada do .env (EXPO_PUBLIC_GEMINI_API_KEY)"
    fi
fi

# Se não encontrou no .env, verifica variável de ambiente
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  GEMINI_API_KEY não encontrada no .env"
    echo "   Configure via: export GEMINI_API_KEY='sua_chave'"
fi

# Executa o Gemini CLI
if [ $# -eq 0 ]; then
    # Modo interativo
    echo "🚀 Iniciando Gemini CLI..."
    npx -y @google/gemini-cli
else
    # Passa os argumentos para o CLI
    npx -y @google/gemini-cli "$@"
fi

