# 📥 Passo a Passo: Importar MCPs no Outro Desktop

Guia rápido e direto para importar a configuração dos MCPs em outro computador.

---

## 📋 Pré-requisitos (Instalar antes)

1. ✅ **Docker Desktop** (versão 4.43+)
   - Download: https://www.docker.com/products/docker-desktop/
   - Instalar e iniciar o Docker

2. ✅ **Cursor IDE** instalado
   - Download: https://cursor.sh/

3. ✅ **Node.js** instalado (para npx funcionar)
   - Download: https://nodejs.org/

---

## 🚀 Passo a Passo

### 1️⃣ **Transferir o Backup**

Copie o arquivo `mcp-backup-YYYYMMDD-HHMMSS.zip` para o novo computador:
- Via USB drive
- Via Google Drive / Dropbox / OneDrive
- Via email (⚠️ apenas se seguro)

---

### 2️⃣ **Extrair o Backup**

Abra o PowerShell no novo computador e execute:

```powershell
# Navegue até onde você salvou o arquivo .zip
cd C:\caminho\do\backup

# Extraia o arquivo
Expand-Archive -Path mcp-backup-YYYYMMDD-HHMMSS.zip -DestinationPath .

# Entre na pasta extraída
cd mcp-backup-YYYYMMDD-HHMMSS
```

**Resultado:** Você terá uma pasta com:
- `mcp.json`
- `mcp.json.example`
- `docker-secrets.ps1`
- `secrets-values.txt` (⚠️ contém senhas)
- `README-IMPORT.md`
- `docker-secrets-list.txt`

---

### 3️⃣ **Copiar mcp.json para o Projeto**

```powershell
# Criar a pasta .claude no seu projeto (se não existir)
New-Item -ItemType Directory -Force -Path "C:\caminho\do\projeto\.claude"

# Copiar mcp.json
Copy-Item ".\mcp.json" "C:\caminho\do\projeto\.claude\mcp.json"
```

**⚠️ IMPORTANTE:** 
- Verifique se o caminho do projeto está correto
- O arquivo deve estar em: `[seu-projeto]\.claude\mcp.json`

**Editar credenciais (se necessário):**
```powershell
# Abrir no editor (opcional - apenas se precisar editar)
notepad "C:\caminho\do\projeto\.claude\mcp.json"
```

---

### 4️⃣ **Configurar Docker**

#### 4.1 - Verificar Docker instalado:
```powershell
docker --version
# Deve mostrar: Docker version 28.x.x ou superior
```

#### 4.2 - Verificar se Docker está rodando:
```powershell
docker info
# Se der erro, inicie o Docker Desktop
```

#### 4.3 - Inicializar Docker Swarm:
```powershell
# Verificar status atual
docker info --format '{{.Swarm.LocalNodeState}}'

# Se mostrar "inactive", inicializar:
docker swarm init
```

#### 4.4 - Criar Secrets do Docker:

**Opção A - Usando o arquivo secrets-values.txt:**

```powershell
# Abrir o arquivo para ver os valores
notepad .\secrets-values.txt

# Copiar os valores e executar:

# 1. Criar secret do GitHub
$githubToken = "COLE_O_TOKEN_AQUI"
echo -n $githubToken | docker secret create github.personal_access_token -

# 2. Criar secret do PostgreSQL
$postgresUrl = "COLE_A_CONNECTION_STRING_AQUI"
echo -n $postgresUrl | docker secret create postgres.url -

# 3. Verificar se foram criados
docker secret ls
```

**Opção B - Editar e executar docker-secrets.ps1:**

```powershell
# Abrir o script
notepad .\docker-secrets.ps1

# Editar os valores (linhas com "seu-token-aqui" ou "seu-valor-aqui")
# Salvar e executar:
.\docker-secrets.ps1
```

**Resultado esperado:**
```
ID                          NAME                           DRIVER    CREATED
d12kbr32g9cf8kl4qi4222blp   github.personal_access_token             2 seconds ago
imedurt76txf5a1zj8bp5wqfq   postgres.url                             1 second ago
```

---

### 5️⃣ **Verificar Instalação**

```powershell
# 1. Verificar Docker MCP Toolkit
docker mcp --version
# Deve mostrar: Docker MCP Toolkit's CLI versão X.X.X

# 2. Verificar Docker Swarm ativo
docker info --format '{{.Swarm.LocalNodeState}}'
# Deve mostrar: active

# 3. Verificar Secrets criados
docker secret ls
# Deve mostrar: github.personal_access_token e postgres.url

# 4. Verificar mcp.json existe
Test-Path "C:\caminho\do\projeto\.claude\mcp.json"
# Deve mostrar: True
```

---

### 6️⃣ **Reiniciar Cursor**

1. **Fechar completamente o Cursor:**
   - Clique com botão direito no ícone do Cursor na barra de tarefas
   - Selecione "Sair" ou "Close"
   - Certifique-se de que todas as janelas estão fechadas

2. **Abrir Cursor novamente**

3. **Verificar MCPs configurados:**
   - Vá em **Settings** (ou **File > Preferences > Settings**)
   - Procure por **"MCP"** ou **"Tools & MCP"**
   - Você deve ver listados:
     - ✅ **supabase**
     - ✅ **postgres**
     - ✅ **github**
     - ✅ **docker**

4. **Testar um MCP:**
   - Tente usar algum comando que requeira MCP
   - Por exemplo, pergunte algo sobre GitHub ou banco de dados

---

## ✅ Checklist Final

Marque conforme completar:

- [ ] Docker Desktop instalado e rodando
- [ ] Docker Swarm inicializado (`docker swarm init`)
- [ ] Secrets criados (`docker secret ls` mostra 2 secrets)
- [ ] `mcp.json` copiado para `.claude/mcp.json` do projeto
- [ ] Cursor fechado completamente
- [ ] Cursor reaberto
- [ ] MCPs aparecem em Settings > Tools & MCP
- [ ] Secrets funcionando (sem erros nos logs)

---

## 🆘 Problemas Comuns

### ❌ "docker: command not found"
**Solução:** Instalar Docker Desktop e reiniciar o terminal

### ❌ "Swarm is not initialized"
**Solução:** 
```powershell
docker swarm init
```

### ❌ "Error response from daemon: no such secret"
**Solução:** Criar os secrets novamente:
```powershell
# Verificar se os secrets existem
docker secret ls

# Se não existirem, criar conforme passo 4.4
```

### ❌ "mcp.json não encontrado"
**Solução:** 
```powershell
# Verificar se existe
Test-Path "C:\caminho\do\projeto\.claude\mcp.json"

# Se não existir, copiar novamente
Copy-Item ".\mcp.json" "C:\caminho\do\projeto\.claude\mcp.json"
```

### ❌ MCPs não aparecem no Cursor
**Soluções:**
1. Verificar sintaxe do JSON:
   ```powershell
   Get-Content "C:\caminho\do\projeto\.claude\mcp.json" | ConvertFrom-Json
   # Se der erro, o JSON está inválido
   ```

2. Verificar localização:
   - Deve estar em: `[projeto]\.claude\mcp.json`
   - Não em: `[projeto]\.claude\.claude\mcp.json`

3. Reiniciar Cursor completamente:
   - Fechar todas as janelas
   - Abrir novamente

4. Verificar logs do Cursor:
   - Ver se há erros nos logs do console

### ❌ Erro "couldn't read secret"
**Solução:** Os secrets não foram criados ou foram criados com nomes diferentes:
```powershell
# Verificar secrets existentes
docker secret ls

# Recriar se necessário
docker secret rm github.personal_access_token postgres.url
# Depois criar novamente conforme passo 4.4
```

---

## 🔒 Segurança

**Após importar com sucesso:**

1. ✅ **Delete o arquivo `secrets-values.txt`** (contém senhas em texto claro)
   ```powershell
   Remove-Item ".\secrets-values.txt"
   ```

2. ✅ **Não compartilhe** o arquivo `.zip` publicamente

3. ✅ **Não commite** `mcp.json` no Git (já está no .gitignore)

---

## 📚 Comandos Rápidos de Referência

```powershell
# Inicializar Swarm
docker swarm init

# Criar secrets
echo -n "valor" | docker secret create nome.secret -

# Listar secrets
docker secret ls

# Remover secret
docker secret rm nome.secret

# Verificar Swarm
docker info --format '{{.Swarm.LocalNodeState}}'

# Verificar Docker MCP
docker mcp --version
```

---

## 🎯 Resumo Ultra-Rápido

1. Extrair `.zip` → entrar na pasta
2. Copiar `mcp.json` para `[projeto]\.claude\mcp.json`
3. `docker swarm init`
4. Criar secrets (usando valores de `secrets-values.txt`)
5. Reiniciar Cursor completamente
6. Verificar em Settings > Tools & MCP

**Tempo estimado:** 5-10 minutos

---

**Dúvidas?** Consulte `README-IMPORT.md` no backup para mais detalhes.

