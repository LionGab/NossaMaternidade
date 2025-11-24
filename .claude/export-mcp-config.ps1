# Script PowerShell para exportar configuração dos MCPs
# Uso: .\export-mcp-config.ps1 [caminho-do-backup]

param(
    [string]$BackupDir = ""
)

$ErrorActionPreference = "Stop"

# Detectar localização do script e do projeto
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CurrentDir = Get-Location
$ScriptName = Split-Path -Leaf $MyInvocation.MyCommand.Path

# Se o script está em .claude, usar o diretório pai como raiz do projeto
if ((Split-Path -Leaf $ScriptDir) -eq ".claude") {
    $ProjectRoot = Split-Path -Parent $ScriptDir
    $ClaudeDir = $ScriptDir
} else {
    # Se executado de fora, assumir que está na raiz do projeto
    $ProjectRoot = $CurrentDir
    $ClaudeDir = Join-Path $ProjectRoot ".claude"
}

if (-not $BackupDir) {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $BackupDir = Join-Path $ScriptDir "mcp-backup-$timestamp"
}

$BackupFile = "$BackupDir.zip"

Write-Host "📦 Exportando configuração dos MCPs..." -ForegroundColor Cyan
Write-Host "📁 Diretório do projeto: $ProjectRoot" -ForegroundColor Gray
Write-Host "📁 Diretório .claude: $ClaudeDir" -ForegroundColor Gray
Write-Host "📁 Diretório de backup: $BackupDir" -ForegroundColor Cyan

# Criar diretório temporário
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

# 1. Exportar mcp.json
Write-Host "📄 Exportando mcp.json..." -ForegroundColor Yellow
$mcpJsonPath = Join-Path $ClaudeDir "mcp.json"
if (Test-Path $mcpJsonPath) {
    Copy-Item $mcpJsonPath (Join-Path $BackupDir "mcp.json") -Force
    Write-Host "✅ mcp.json copiado" -ForegroundColor Green
} else {
    Write-Host "⚠️  mcp.json não encontrado em: $mcpJsonPath" -ForegroundColor Yellow
}

# Copiar exemplo
$examplePath = Join-Path $ClaudeDir "mcp.json.example"
if (Test-Path $examplePath) {
    Copy-Item $examplePath (Join-Path $BackupDir "mcp.json.example") -Force
    Write-Host "✅ mcp.json.example copiado" -ForegroundColor Green
}

# 2. Exportar secrets do Docker
Write-Host "🔐 Exportando secrets do Docker..." -ForegroundColor Yellow

# Verificar se Docker Swarm está ativo
$swarmState = docker info --format '{{.Swarm.LocalNodeState}}' 2>$null
if ($swarmState -eq "active") {
    $secretsScript = "$BackupDir\docker-secrets.ps1"
    
    @"
# Docker Secrets - Execute estes comandos no computador destino
# Inicialize o Swarm primeiro: docker swarm init

"@ | Out-File -FilePath $secretsScript -Encoding UTF8
    
    # Exportar github.personal_access_token
    $githubSecretExists = docker secret inspect github.personal_access_token 2>$null
    if ($LASTEXITCODE -eq 0) {
        # Ler valor do secret (nota: Docker não expõe valores diretamente, usar do mcp.json)
        @"
# GitHub Personal Access Token
# Obtenha o valor do mcp.json ou crie novo em: https://github.com/settings/tokens
# `$githubToken = "SEU_TOKEN_AQUI"
# echo -n `$githubToken | docker secret create github.personal_access_token -

"@ | Add-Content -Path $secretsScript
    }
    
    # Exportar postgres.url
    $postgresSecretExists = docker secret inspect postgres.url 2>$null
    if ($LASTEXITCODE -eq 0) {
        @"
# PostgreSQL Connection String
# Obtenha o valor do mcp.json
# `$postgresUrl = "postgresql://user:password@host:5432/db"
# echo -n `$postgresUrl | docker secret create postgres.url -

"@ | Add-Content -Path $secretsScript
    }
    
    # Lista de secrets
    docker secret ls > "$BackupDir\docker-secrets-list.txt" 2>$null
} else {
    Write-Host "⚠️  Docker Swarm não está ativo. Secrets não serão exportados." -ForegroundColor Yellow
    "# Docker Swarm não inicializado no computador origem" | Out-File -FilePath "$BackupDir\docker-secrets.ps1" -Encoding UTF8
}

# 3. Criar README de importação
$readmeContent = @"
# 📥 Como Importar Configuração dos MCPs

## Pré-requisitos

1. **Docker Desktop** instalado (versão 4.43+)
2. **Cursor IDE** instalado
3. **Node.js** instalado (para npx)

## Passos para Importar

### 1. Copiar Arquivos

``````powershell
# Copie o diretório .claude para o novo projeto/computador
Copy-Item -Recurse .claude C:\caminho\do\projeto\.claude
``````

### 2. Restaurar mcp.json

O arquivo mcp.json já está na pasta .claude

**⚠️ IMPORTANTE**: Edite `.claude\mcp.json` e verifique/atualize:
- GitHub Personal Access Token
- PostgreSQL Connection String (senha do banco)
- Outras credenciais sensíveis

### 3. Configurar Docker Secrets

``````powershell
# 1. Inicializar Docker Swarm (se ainda não estiver)
docker swarm init

# 2. Executar o script de secrets (edite antes se necessário)
# Edite docker-secrets.ps1 e adicione os valores corretos
# Execute manualmente os comandos
``````

### 4. Verificar Instalação

``````powershell
# Verificar Docker MCP
docker mcp --version

# Verificar secrets
docker secret ls

# Verificar se o Docker Swarm está ativo
docker info --format '{{.Swarm.LocalNodeState}}'
``````

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
``````powershell
# Recriar secrets
docker secret rm github.personal_access_token postgres.url

# Depois recriar conforme instruções acima
``````

### Docker Swarm não inicializa
``````powershell
# Verificar se Docker está rodando
docker info

# Tentar inicializar novamente
docker swarm leave --force
docker swarm init
``````

### MCPs não aparecem no Cursor
1. Verificar se `.claude\mcp.json` está no lugar correto
2. Verificar sintaxe JSON
3. Verificar logs do Cursor
4. Reiniciar Cursor completamente
"@

$readmeContent | Out-File -FilePath "$BackupDir\README-IMPORT.md" -Encoding UTF8

# 4. Criar arquivo com valores (lendo do mcp.json atual)
Write-Host "⚠️  Criando arquivo com valores dos secrets..." -ForegroundColor Yellow

$mcpJsonPathForSecrets = Join-Path $ClaudeDir "mcp.json"
if (Test-Path $mcpJsonPathForSecrets) {
    $mcpJson = Get-Content $mcpJsonPathForSecrets | ConvertFrom-Json
    
    $secretsFile = "$BackupDir\secrets-values.txt"
    @"
# ⚠️  ATENÇÃO: Este arquivo contém credenciais sensíveis!
# NÃO compartilhe este arquivo publicamente
# Delete após importar no computador destino

# GitHub Personal Access Token
# Obtenha do mcp.json ou crie novo em: https://github.com/settings/tokens
GITHUB_TOKEN=$($mcpJson.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN)

# PostgreSQL Connection String
# Formato: postgresql://user:password@host:port/database
POSTGRES_URL=$($mcpJson.mcpServers.postgres.args[2])

# Para criar os secrets no Windows PowerShell:
# `$githubToken = "$($mcpJson.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN)"
# echo -n `$githubToken | docker secret create github.personal_access_token -
# `$postgresUrl = "$($mcpJson.mcpServers.postgres.args[2])"
# echo -n `$postgresUrl | docker secret create postgres.url -
"@ | Out-File -FilePath $secretsFile -Encoding UTF8
    
    Write-Host "⚠️  REMOVA O ARQUIVO secrets-values.txt APÓS IMPORTAR!" -ForegroundColor Red
}

# 5. Compactar
Write-Host "📦 Compactando backup..." -ForegroundColor Yellow
Compress-Archive -Path "$BackupDir\*" -DestinationPath $BackupFile -Force

Write-Host ""
Write-Host "✅ Exportação concluída!" -ForegroundColor Green
Write-Host "📁 Backup criado: $BackupFile" -ForegroundColor Cyan
Write-Host "📂 Diretório: $BackupDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Para importar em outro computador:" -ForegroundColor Yellow
Write-Host "   1. Copie o arquivo $BackupFile" -ForegroundColor White
Write-Host "   2. Extraia: Expand-Archive -Path $BackupFile -DestinationPath ." -ForegroundColor White
Write-Host "   3. Siga as instruções em $BackupDir\README-IMPORT.md" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  CUIDADO: secrets-values.txt contém senhas! Delete após usar." -ForegroundColor Red

