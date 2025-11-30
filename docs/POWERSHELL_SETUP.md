# 🔧 Guia Completo: PowerShell no Nossa Maternidade

**Projeto:** Nossa Maternidade  
**Última atualização:** 29/11/2025  
**Objetivo:** Configurar e usar PowerShell no Cursor/VS Code

---

## 📋 Índice

1. [Instalação e Configuração](#instalação-e-configuração)
2. [Scripts Disponíveis](#scripts-disponíveis)
3. [Troubleshooting](#troubleshooting)
4. [Melhores Práticas](#melhores-práticas)
5. [Referência Rápida](#referência-rápida)

---

## 🚀 Instalação e Configuração

### 1. Instalar PowerShell 7+

**Windows:**

```powershell
# Via winget (recomendado)
winget install --id Microsoft.PowerShell --source winget

# Ou baixe em: https://aka.ms/powershell-release
```

**Verificar instalação:**

```powershell
pwsh --version
# Deve mostrar: PowerShell 7.x.x
```

### 2. Instalar PowerShell Extension

**No Cursor/VS Code:**

1. Pressione `Ctrl+Shift+X` (Extensions)
2. Procure por "PowerShell"
3. Instale: **ms-vscode.powershell** (Microsoft)

**Verificar instalação:**

```powershell
# Execute no terminal integrado
Get-Command pwsh
```

### 3. Configurar Execution Policy

**Para permitir execução de scripts locais:**

```powershell
# Verificar política atual
Get-ExecutionPolicy -Scope CurrentUser

# Configurar (recomendado para desenvolvimento)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ou usar Bypass apenas para este projeto
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

**Políticas disponíveis:**

- `Restricted` - Nenhum script pode executar ❌
- `RemoteSigned` - Scripts locais OK, remotos precisam assinatura ✅ (recomendado)
- `AllSigned` - Todos os scripts precisam assinatura ⚠️
- `Bypass` - Sem restrições (apenas desenvolvimento) ⚠️

### 4. Verificar Configuração

**Execute o script de diagnóstico:**

```powershell
# Via npm
npm run diagnose:powershell

# Ou diretamente
pwsh -ExecutionPolicy Bypass -File scripts/diagnose-powershell.ps1
```

**O script verifica:**

- ✅ Versão do PowerShell
- ✅ PowerShell Extension instalada
- ✅ Execution Policy
- ✅ Processos PSES rodando
- ✅ Logs de erros
- ✅ Configurações do extension
- ✅ Scripts do projeto
- ✅ Variáveis de ambiente

---

## 📜 Scripts Disponíveis

### Scripts de Ambiente

#### `create-env.ps1`

Cria arquivo `.env` a partir do `env.template`.

```powershell
# Executar
.\create-env.ps1
# ou
pwsh -ExecutionPolicy Bypass -File create-env.ps1
```

**O que faz:**

- Verifica se `env.template` existe
- Copia para `.env`
- Avisa sobre não commitar valores reais

---

#### `update-env.ps1`

Atualiza `.env` com valores de **exemplo** (para desenvolvimento).

```powershell
.\update-env.ps1
```

**⚠️ ATENÇÃO:** Usa valores de exemplo, não valores reais.

---

#### `update-env-values.ps1`

Atualiza `.env` com valores **reais** de API keys.

```powershell
.\update-env-values.ps1
```

**⚠️ CRÍTICO:**

- Contém valores REAIS de API keys
- NUNCA commite o `.env` após executar
- Verifique que está no `.gitignore`

---

### Scripts de Verificação

#### `scripts/check-ready.ps1`

Verifica se o projeto está pronto para build/deploy.

```powershell
# Via npm
npm run check-ready

# Ou diretamente
pwsh -ExecutionPolicy Bypass -File scripts/check-ready.ps1
```

**Verifica:**

- ✅ `app.json` ou `app.config.js`
- ✅ `eas.json`
- ✅ `.env.example`
- ✅ `.env` (não no Git)
- ✅ Assets (ícone, splash, screenshots)
- ✅ `README.md`

**Saída:**

- Score: X/8 checks aprovados
- Lista de erros críticos
- Lista de avisos
- Próximos passos

---

#### `scripts/diagnose-powershell.ps1`

Diagnostica problemas com PowerShell Extension.

```powershell
# Diagnóstico básico
pwsh -ExecutionPolicy Bypass -File scripts/diagnose-powershell.ps1

# Com correções automáticas
pwsh -ExecutionPolicy Bypass -File scripts/diagnose-powershell.ps1 -Fix

# Modo verboso
pwsh -ExecutionPolicy Bypass -File scripts/diagnose-powershell.ps1 -Verbose
```

**O que verifica:**

1. Versão do PowerShell
2. PowerShell Extension instalada
3. Execution Policy
4. Processos PSES
5. Logs de erros
6. Configurações
7. Scripts do projeto
8. Variáveis de ambiente
9. Teste de execução

**Saída:**

- Lista de problemas encontrados
- Lista de avisos
- Correções sugeridas
- Próximos passos

---

### Scripts de Configuração

#### `scripts/fix-claude-code-bash.ps1`

Configura variável de ambiente para Claude Code usar Git Bash.

```powershell
# Via npm
npm run fix:claude-bash

# Ou diretamente
pwsh -ExecutionPolicy Bypass -File scripts/fix-claude-code-bash.ps1
```

**O que faz:**

1. Verifica se Git está instalado
2. Encontra `bash.exe`
3. Configura variável `CLAUDE_CODE_GIT_BASH_PATH`
4. Verifica configuração

**Após executar:**

- Feche COMPLETAMENTE o Cursor
- Reabra o Cursor
- Tente usar Claude Code novamente

---

#### `scripts/verify-claude-code-bash.ps1`

Verifica se a configuração do Claude Code Git Bash está correta.

```powershell
# Via npm
npm run verify:claude-bash

# Ou diretamente
pwsh -ExecutionPolicy Bypass -File scripts/verify-claude-code-bash.ps1
```

---

### Scripts de Deploy

#### `supabase/functions/deploy.ps1`

Faz deploy das Edge Functions do Supabase.

```powershell
# Deploy todas as funções
cd supabase/functions
.\deploy.ps1

# Deploy função específica
.\deploy.ps1 -Function chat-ai

# Com secrets
.\deploy.ps1 -SetSecrets

# Com teste após deploy
.\deploy.ps1 -TestAfterDeploy

# Tudo junto
.\deploy.ps1 -SetSecrets -TestAfterDeploy -Logs
```

**Parâmetros:**

- `-Function <nome>` - Deploy apenas uma função
- `-SetSecrets` - Configurar secrets do `.env`
- `-TestAfterDeploy` - Testar função após deploy
- `-Logs` - Mostrar logs após deploy

---

## 🔧 Troubleshooting

### Problema: "Connection to PowerShell Editor Services was closed"

**Sintomas:**

- Logs mostram: `Connection to PowerShell Editor Services (the Extension Terminal) was closed`
- IntelliSense não funciona
- Terminal PowerShell não abre

**Soluções:**

1. **Reiniciar PowerShell Extension:**

   - `Ctrl+Shift+P` → "PowerShell: Restart Current Session"
   - Ou feche e reabra o Cursor completamente

2. **Verificar Execution Policy:**

   ```powershell
   Get-ExecutionPolicy -Scope CurrentUser
   # Deve ser: RemoteSigned ou Bypass
   ```

3. **Executar diagnóstico:**

   ```powershell
   npm run diagnose:powershell
   ```

4. **Reinstalar Extension:**

   - `Ctrl+Shift+X` → Procure "PowerShell"
   - Desinstale e reinstale

5. **Verificar logs:**
   - `View > Output` → Selecione "PowerShell"
   - Procure por erros ou warnings

---

### Problema: "Scripts cannot be loaded because running scripts is disabled"

**Erro:**

```
Scripts cannot be loaded because running scripts is disabled on this system.
```

**Solução:**

```powershell
# Verificar política atual
Get-ExecutionPolicy -Scope CurrentUser

# Configurar (recomendado)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ou para este processo apenas
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

---

### Problema: "PowerShell Extension não encontrada"

**Sintomas:**

- IntelliSense não funciona
- Terminal PowerShell não disponível

**Soluções:**

1. **Instalar Extension:**

   - `Ctrl+Shift+X` → Procure "PowerShell"
   - Instale: **ms-vscode.powershell**

2. **Verificar se está habilitada:**

   - `Ctrl+Shift+X` → Procure "PowerShell"
   - Verifique se está habilitada (não desabilitada)

3. **Reiniciar Cursor:**
   - Feche completamente
   - Reabra

---

### Problema: "Scripts com encoding incorreto"

**Sintomas:**

- Scripts não executam corretamente
- Caracteres especiais aparecem errados

**Solução:**

```powershell
# Verificar encoding
Get-Content script.ps1 -Encoding UTF8 | Select-Object -First 1

# Converter para UTF8 com BOM
$content = Get-Content script.ps1 -Raw
$content | Out-File -FilePath script.ps1 -Encoding utf8
```

**Prevenção:**

- Use sempre `Out-File -Encoding utf8` ao criar scripts
- Configure editor para salvar como UTF-8

---

## ✅ Melhores Práticas

### 1. Sempre use `-ExecutionPolicy Bypass` para scripts locais

```powershell
# ✅ BOM
pwsh -ExecutionPolicy Bypass -File script.ps1

# ❌ EVITE (pode falhar se Execution Policy restritiva)
.\script.ps1
```

### 2. Trate erros adequadamente

```powershell
# ✅ BOM
$ErrorActionPreference = "Stop"
try {
    # código
} catch {
    Write-Host "Erro: $_" -ForegroundColor Red
    exit 1
}

# ❌ EVITE
# código sem tratamento de erro
```

### 3. Use encoding UTF-8

```powershell
# ✅ BOM
$content | Out-File -FilePath "file.txt" -Encoding utf8

# ❌ EVITE
$content | Out-File -FilePath "file.txt"  # Encoding padrão pode variar
```

### 4. Verifique se está na raiz do projeto

```powershell
# ✅ BOM
if (-not (Test-Path "package.json")) {
    Write-Host "Erro: Execute na raiz do projeto" -ForegroundColor Red
    exit 1
}

# ❌ EVITE
# Assumir que está na raiz
```

### 5. Use mensagens de saída claras

```powershell
# ✅ BOM
Write-Host "✅ Sucesso!" -ForegroundColor Green
Write-Host "❌ Erro!" -ForegroundColor Red
Write-Host "⚠️  Aviso!" -ForegroundColor Yellow

# ❌ EVITE
Write-Output "ok"  # Não é claro
```

### 6. Documente scripts

```powershell
# ✅ BOM
# Script PowerShell para criar arquivo .env
# Uso: pwsh -ExecutionPolicy Bypass -File create-env.ps1
# Autor: Nossa Maternidade Team
# Data: 29/11/2025

# ❌ EVITE
# Script sem documentação
```

---

## 📚 Referência Rápida

### Comandos NPM

```bash
# Diagnóstico PowerShell
npm run diagnose:powershell

# Verificar prontidão para deploy
npm run check-ready

# Fix Claude Code Bash
npm run fix:claude-bash

# Verify Claude Code Bash
npm run verify:claude-bash
```

### Comandos PowerShell Diretos

```powershell
# Executar script
pwsh -ExecutionPolicy Bypass -File script.ps1

# Verificar versão
pwsh --version

# Verificar Execution Policy
Get-ExecutionPolicy -Scope CurrentUser

# Configurar Execution Policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verificar processos PSES
Get-Process | Where-Object { $_.ProcessName -like "*powershell*" }
```

### Atalhos do Cursor/VS Code

| Ação                       | Atalho                                                 |
| -------------------------- | ------------------------------------------------------ |
| Abrir Terminal             | `` Ctrl+` ``                                           |
| Abrir Extensions           | `Ctrl+Shift+X`                                         |
| Command Palette            | `Ctrl+Shift+P`                                         |
| Restart PowerShell Session | `Ctrl+Shift+P` → "PowerShell: Restart Current Session" |

---

## 📞 Suporte

**Problemas?**

1. Execute diagnóstico: `npm run diagnose:powershell`
2. Verifique logs: `View > Output > PowerShell`
3. Consulte documentação: `docs/POWERSHELL_SETUP.md`
4. Abra issue no GitHub: [LionGab/NossaMaternidade](https://github.com/LionGab/NossaMaternidade)

---

**Última atualização:** 29/11/2025  
**Mantido por:** Nossa Maternidade Team
