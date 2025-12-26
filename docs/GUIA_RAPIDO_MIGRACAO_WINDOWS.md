# ⚡ Guia Rápido: MacBook → Windows (5 minutos)

**Resumo executivo**: Passos essenciais para ter o mesmo ambiente nos dois PCs.

---

## 🎯 No MacBook (Agora)

### 1. Habilitar Settings Sync

1. Cursor → `Cmd + Shift + P` → `Settings Sync: Turn On...`
2. Login com GitHub
3. Marcar **TUDO** para sincronizar

### 2. Exportar e Enviar

```bash
cd ~/Documents/Lion/NossaMaternidade
npm run sync:export-claude
git add .
git commit -m "chore: Export settings for Windows"
git push
```

**Pronto no MacBook!** ✅

---

## 🖥️ No Windows PC (Quando chegar em casa)

### 1. Configurar Terminal

**IMPORTANTE**: Instalar Git for Windows (inclui Git Bash)
- Download: https://git-scm.com/download/win
- No Cursor: `Ctrl + Shift + P` → `Terminal: Select Default Profile` → **Git Bash**

### 2. Atualizar Projeto

```bash
cd C:\Users\SeuUsuario\Documents\NossaMaternidade
git pull
npm install
```

### 3. Habilitar Settings Sync

1. Cursor → `Ctrl + Shift + P` → `Settings Sync: Turn On...`
2. **Mesmo GitHub** do MacBook
3. Marcar **TUDO** para sincronizar

### 4. Sincronizar Tudo

```bash
# No Git Bash
npm run sync:all
```

Isso faz:
- ✅ Instala extensões
- ✅ Importa configs do Claude
- ✅ Ajusta paths dos MCPs

### 5. Reiniciar Cursor

**Feche completamente** o Cursor e abra novamente.

---

## ✅ Verificar

```bash
# Verificar se está tudo ok
npm run sync:verify
npm start
```

**Pronto!** 🎉 Ambos os PCs estão sincronizados.

---

## 🔄 Uso Diário

**Sempre que trocar de PC:**

```bash
git pull
npm start
```

**Só isso!** O Settings Sync sincroniza automaticamente o resto.

---

## 🐛 Problemas?

| Problema | Solução |
|----------|---------|
| Scripts `.sh` não funcionam | Use Git Bash (não PowerShell) |
| Settings Sync não funciona | Verifique se está logado no mesmo GitHub |
| MCPs não funcionam | Execute `npm run sync:fix-mcp-paths` |
| Extensões não aparecem | Execute `npm run sync:install-extensions` |

---

**Guia completo**: `docs/MIGRACAO_MACBOOK_PARA_WINDOWS.md`
