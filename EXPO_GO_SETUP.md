# 🚀 Configuração para Expo Go

Este app está configurado para funcionar no **Expo Go** (desenvolvimento rápido sem build nativo).

## ✅ O que foi configurado:

1. **Removido `expo-router`** - Não funciona no Expo Go
2. **Adicionado `expo-constants`** - Para acessar variáveis de ambiente
3. **Criado `app.config.js`** - Processa variáveis do `.env` para Expo Go
4. **Ajustado `config/api.ts`** - Suporta `Constants.expoConfig.extra` (Expo Go)
5. **Ajustado `services/supabase.ts`** - Não quebra se variáveis não estiverem configuradas

## 📱 Como usar:

### 1. Instalar dependências:

```bash
npm install
# ou
pnpm install
```

### 2. Configurar variáveis de ambiente:

O arquivo `.env` já está criado com suas credenciais. Certifique-se de que está na raiz do projeto.

### 3. Iniciar o Expo:

```bash
npm start
# ou
expo start
```

### 4. Escanear QR Code:

- **iOS**: Abra a câmera e escaneie o QR code
- **Android**: Abra o app Expo Go e escaneie o QR code

## ⚠️ Notas importantes:

- **Expo Go** carrega variáveis de ambiente do `.env` automaticamente quando você usa `expo start`
- As variáveis são acessadas via `Constants.expoConfig.extra` no código
- Se as variáveis do Supabase não estiverem configuradas, o app continuará funcionando (apenas com aviso no console)

## 🔧 Troubleshooting:

### Variáveis de ambiente não carregam:

1. Certifique-se de que o arquivo `.env` está na raiz do projeto
2. Reinicie o servidor Expo: `expo start --clear`
3. Verifique se as variáveis começam com `EXPO_PUBLIC_`

### App não inicia no Expo Go:

1. Verifique se todas as dependências estão instaladas: `npm install`
2. Limpe o cache: `expo start --clear`
3. Verifique se não há erros no console

## 📦 Dependências compatíveis com Expo Go:

Todas as dependências atuais são compatíveis com Expo Go:
- ✅ `@supabase/supabase-js` - Funciona no Expo Go
- ✅ `@react-native-async-storage/async-storage` - Funciona no Expo Go
- ✅ `expo-av`, `expo-camera`, `expo-image-picker` - Funcionam no Expo Go
- ✅ `@react-navigation/*` - Funciona no Expo Go
- ✅ `@google/genai` - Funciona no Expo Go

## 🚫 Limitações do Expo Go:

- Não suporta módulos nativos customizados
- Alguns plugins do Expo podem não funcionar
- Performance pode ser menor que build nativo

Para produção, considere fazer um build nativo com `eas build`.

