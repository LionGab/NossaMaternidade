# ⚡ Gemini CLI - Quick Start

Guia rápido para começar a usar o Gemini CLI no projeto Nossa Maternidade.

## 🚀 Setup Rápido (2 minutos)

### 1. Instalar Gemini CLI

```bash
npm install -g @google/gemini-cli
```

### 2. Configurar API Key

**Windows PowerShell:**
```powershell
$env:GEMINI_API_KEY="sua_chave_aqui"
```

**Mac/Linux:**
```bash
export GEMINI_API_KEY="sua_chave_aqui"
```

**Ou use o script helper (carrega automaticamente do .env):**

**Windows:**
```powershell
.\scripts\gemini-cli.ps1
```

**Mac/Linux:**
```bash
chmod +x scripts/gemini-cli.sh
./scripts/gemini-cli.sh
```

### 3. Instalar Extensão do IDE

**Opção A: Automático**
- Execute o script helper acima
- Quando perguntar, confirme a conexão com o IDE

**Opção B: Manual**
- Abra Extensions no Cursor/VS Code (`Ctrl+Shift+X`)
- Procure: `Gemini CLI Companion`
- Instale: `google.gemini-cli-vscode-ide-companion`

### 4. Verificar Status

```powershell
# Windows
.\scripts\gemini-cli.ps1 /ide status

# Mac/Linux
./scripts/gemini-cli.sh /ide status
```

## 🎯 Uso Básico

### Iniciar CLI

**Windows:**
```powershell
.\scripts\gemini-cli.ps1
```

**Mac/Linux:**
```bash
./scripts/gemini-cli.sh
```

### Exemplos de Comandos

```
Você: Refatore Button.tsx para usar design tokens
Você: Corrige o erro TypeScript em HomeScreen.tsx linha 45
Você: Cria um teste para emotionService.ts
Você: Adiciona acessibilidade ao MaternalCard
```

### Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `/ide enable` | Habilita conexão com IDE |
| `/ide disable` | Desabilita conexão |
| `/ide status` | Verifica status |
| `/help` | Lista todos os comandos |
| `/exit` | Sair do CLI |

## 📚 Documentação Completa

Para mais detalhes, veja: [GEMINI_CLI_EXTENSION.md](./GEMINI_CLI_EXTENSION.md)

---

**Última atualização:** 2025-01-XX

