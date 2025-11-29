# 🔧 Fix Definitivo: Claude Code Git Bash no Windows

**Problema:** `Error: Claude Code on Windows requires git-bash`

**Causa:** Variável de ambiente `CLAUDE_CODE_GIT_BASH_PATH` não está acessível ao Claude Code.

---

## ✅ SOLUÇÃO DEFINITIVA (Escolha uma)

### Opção 1: Interface Gráfica do Windows (Recomendado - Mais Fácil)

1. **Abrir Configurações do Sistema:**
   - Pressione `Win + R`
   - Digite: `sysdm.cpl`
   - Pressione Enter

2. **Adicionar Variável:**
   - Aba "Avançado"
   - Clique em "Variáveis de Ambiente"
   - Em "Variáveis do usuário", clique em "Novo"
   - **Nome:** `CLAUDE_CODE_GIT_BASH_PATH`
   - **Valor:** `C:\Program Files\Git\bin\bash.exe`
   - Clique "OK" em todas as janelas

3. **Reiniciar Cursor:**
   - Feche COMPLETAMENTE o Cursor (todas as janelas)
   - Reabra o Cursor
   - Tente usar o Claude Code novamente

---

### Opção 2: PowerShell como Administrador (Permanente)

1. **Abrir PowerShell como Administrador:**
   - Clique com botão direito no PowerShell
   - Selecione "Executar como administrador"

2. **Executar Comando:**
   ```powershell
   [Environment]::SetEnvironmentVariable(
       "CLAUDE_CODE_GIT_BASH_PATH",
       "C:\Program Files\Git\bin\bash.exe",
       "User"
   )
   ```

3. **Verificar:**
   ```powershell
   [Environment]::GetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", "User")
   ```
   Deve retornar: `C:\Program Files\Git\bin\bash.exe`

4. **Reiniciar Cursor:**
   - Feche COMPLETAMENTE o Cursor
   - Reabra o Cursor

---

### Opção 3: Verificar Caminho Correto Primeiro

Se o caminho `C:\Program Files\Git\bin\bash.exe` não existir, encontre o correto:

```powershell
# Verificar caminhos possíveis
$paths = @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files\Git\usr\bin\bash.exe",
    "$env:ProgramFiles\Git\bin\bash.exe",
    "$env:ProgramFiles\Git\usr\bin\bash.exe"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "✓ ENCONTRADO: $path" -ForegroundColor Green
        Write-Host "Use este caminho na variável de ambiente" -ForegroundColor Yellow
        break
    } else {
        Write-Host "✗ Não encontrado: $path" -ForegroundColor Red
    }
}
```

Depois use o caminho encontrado nas Opções 1 ou 2.

---

## 🔍 VERIFICAÇÃO

### Verificar se Variável Está Definida

**No PowerShell:**
```powershell
[Environment]::GetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", "User")
```

**No CMD:**
```cmd
echo %CLAUDE_CODE_GIT_BASH_PATH%
```

**Deve retornar:** `C:\Program Files\Git\bin\bash.exe` (ou caminho encontrado)

### Verificar se Arquivo Existe

```powershell
Test-Path "C:\Program Files\Git\bin\bash.exe"
```

**Deve retornar:** `True`

---

## ⚠️ IMPORTANTE

### Por Que Precisa Reiniciar o Cursor?

O Claude Code lê variáveis de ambiente apenas na inicialização. Mesmo que você defina a variável, o Cursor precisa ser **fechado completamente** e **reaberto** para reconhecer.

### Verificar se Git Bash Está Instalado

Se nenhum caminho funcionar, o Git pode não estar instalado:

```powershell
git --version
```

Se retornar erro, instale o Git:
- Download: https://git-scm.com/downloads/win
- Durante instalação, certifique-se de marcar "Add Git to PATH"

---

## 🚨 SE AINDA NÃO FUNCIONAR

### Alternativa: Usar Cursor AI (Nativo)

O **Cursor AI** (que você está usando agora) **não precisa** do git-bash. Ele funciona nativamente.

O **Claude Code** é uma extensão opcional que adiciona funcionalidades extras, mas não é obrigatório para desenvolvimento.

**Recomendação:** Se o erro persistir, continue usando o Cursor AI nativo, que já está funcionando perfeitamente.

---

## 📝 CHECKLIST FINAL

- [ ] Variável `CLAUDE_CODE_GIT_BASH_PATH` definida no sistema (não só na sessão)
- [ ] Caminho aponta para arquivo que existe (`Test-Path` retorna `True`)
- [ ] Cursor foi **fechado completamente** (todas as janelas)
- [ ] Cursor foi **reaberto**
- [ ] Claude Code testado novamente

---

**Última atualização:** 2025-11-29

