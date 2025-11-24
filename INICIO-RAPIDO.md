# 🚀 Início Rápido - Nossa Maternidade Mobile

Guia rápido para começar a desenvolver em **menos de 5 minutos**.

---

## ✅ Pré-requisitos

1. **Node.js 18+** instalado
2. **Expo Go** instalado no celular:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## 🏃 Passos Rápidos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

**Criar arquivo `.env` na raiz do projeto:**

```env
# Obrigatórias
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://mnszbkeuerjcevjvdqme.supabase.co/functions/v1
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui

# Opcionais
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

**Ou copiar do exemplo:**
```bash
# O arquivo .env já está configurado com as credenciais do projeto
# Se precisar recriar, copie .env.example para .env
```

### 3️⃣ Iniciar Servidor Expo

```bash
npm start
```

### 4️⃣ Escanear QR Code

- **iOS:** Abra a Câmera e escaneie
- **Android:** Abra Expo Go → "Scan QR Code"

---

## ✨ Pronto!

O app deve abrir no seu celular com todas as funcionalidades.

---

## 🔧 Comandos Úteis

```bash
# Reiniciar com cache limpo (se tiver problemas)
npm start -- --clear

# Modo tunnel (para redes diferentes)
npm start -- --tunnel

# Abrir no iOS Simulator (Mac)
npm run ios

# Abrir no Android Emulator
npm run android

# Abrir no navegador
npm run web
```

---

## 🆘 Problemas?

### App não carrega?
```bash
# Limpar tudo e reinstalar
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### Variáveis não funcionam?
1. Verifique se começam com `EXPO_PUBLIC_`
2. Reinicie o servidor: `npm start -- --clear`
3. Verifique se `.env` está na raiz do projeto

### Mais ajuda?
- 📖 Veja [GUIA-TESTE-EXPO-GO.md](./GUIA-TESTE-EXPO-GO.md) - Guia completo
- 📖 Veja [ENV_SETUP.md](./ENV_SETUP.md) - Configuração de variáveis
- 📖 Veja [README.md](./README.md) - Documentação completa

---

**Dúvidas?** Consulte a documentação ou abra uma issue no GitHub.

