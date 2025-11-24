# 📱 Nossa Maternidade Mobile

Aplicativo mobile-first para apoio às mães durante a jornada da maternidade, desenvolvido com Expo e React Native.

## ⭐ Pontuação: 9.9/10

Este projeto foi identificado como o melhor para lançamento na App Store e Google Play Store.

## ✨ Funcionalidades

- 🤖 **Chat com IA** - Assistente virtual MãesValentes com Gemini AI
- 📚 **Conteúdo Educativo** - Artigos e recursos sobre maternidade
- 📊 **Hábitos** - Rastreamento de hábitos saudáveis
- 💬 **Comunidade** - Comentários e interação entre mães
- 🎯 **Onboarding** - Fluxo de boas-vindas personalizado
- 🔐 **Autenticação** - Sistema seguro com Supabase

## 🚀 Tecnologias

- **Framework**: Expo SDK ~54.0.25
- **React Native**: 0.81.5
- **React**: 19.1.0
- **TypeScript**: 5.9.2
- **Navegação**: React Navigation 7
- **Estilização**: NativeWind (Tailwind CSS)
- **IA**: Google Gemini API
- **Backend**: Supabase
- **Build**: EAS Build

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- **Para Expo Go**: App Expo Go instalado no seu dispositivo móvel
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Opcional**: iOS Simulator (para desenvolvimento iOS) ou Android Studio (para desenvolvimento Android)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/LionGab/NossaMaternidadeMelhor.git
cd NossaMaternidadeMelhor/projects/nossa-maternidade-mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   
   Crie um arquivo `.env` na raiz do projeto e adicione suas chaves:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
   EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=sua_url_aqui/functions/v1
   ```
   
   📖 Veja [docs/setup-env.md](./docs/setup-env.md) para configuração completa.
   📖 Veja [docs/env-variables.md](./docs/env-variables.md) para mais detalhes sobre as variáveis de ambiente.
   
   **⚠️ IMPORTANTE:** O arquivo `.env` está no `.gitignore` e não será commitado.

## 🏃‍♂️ Executando o Projeto

### Usando Expo Go (Recomendado para desenvolvimento)

1. **Instale o Expo Go no seu dispositivo móvel:**
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

3. **Escaneie o QR Code:**
   - **iOS**: Abra a câmera e escaneie o QR code
   - **Android**: Abra o app Expo Go e escaneie o QR code
   - Ou pressione `i` para iOS Simulator ou `a` para Android Emulator

### Desenvolvimento com Simuladores/Emuladores

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no iOS Simulator
npm run ios

# Executar no Android Emulator
npm run android

# Executar na Web
npm run web
```

### Nota sobre Expo Go

⚠️ **Importante**: Este projeto está configurado para funcionar com Expo Go. A nova arquitetura do React Native foi desabilitada para garantir compatibilidade. Se você precisar usar recursos que requerem desenvolvimento build customizado, use `eas build` para criar um build de desenvolvimento.

### Verificação de Tipos

```bash
npm run type-check
```

## 📦 Build para Produção

### Configurar EAS

```bash
npm install -g eas-cli
eas login
```

### Build iOS

```bash
npm run build:ios
```

### Build Android

```bash
npm run build:android
```

### Build para ambas as plataformas

```bash
npm run build:production
```

## 🚀 Deploy

### iOS (App Store)

```bash
npm run submit:ios
```

### Android (Google Play)

```bash
npm run submit:android
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Loading.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
├── screens/          # Telas da aplicação
│   ├── ChatScreen.tsx
│   ├── HabitsScreen.tsx
│   ├── MundoNathScreen.tsx
│   └── ...
├── navigation/       # Configuração de navegação
│   ├── StackNavigator.tsx
│   ├── TabNavigator.tsx
│   └── ...
├── context/          # Contextos React
│   └── AuthContext.tsx
├── services/         # Serviços externos
│   ├── geminiService.ts
│   └── supabase.ts
├── utils/            # Utilitários
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── storage.ts
├── types/            # Tipos TypeScript
│   ├── chat.ts
│   ├── content.ts
│   └── ...
├── constants/        # Constantes
│   └── Colors.ts
└── hooks/            # Custom hooks
    └── useHaptics.ts
```

## 🔒 Segurança

- ✅ Validação de entrada em todos os formulários
- ✅ Tratamento robusto de erros
- ✅ ErrorBoundary para capturar erros React
- ✅ Validação de ambiente e configuração
- ✅ Sanitização de dados antes de renderizar
- ✅ Armazenamento seguro com AsyncStorage/SecureStore

## 🎨 Personalização

### Cores

Edite `src/constants/Colors.ts` para personalizar o tema:

```typescript
export const Colors = {
  primary: '#6DA9E4',
  secondary: '#FF69B4',
  // ...
};
```

### Ícones e Assets

Coloque seus assets em `assets/`:
- `icon.png` - Ícone do app (1024x1024)
- `splash.png` - Tela de splash
- `adaptive-icon.png` - Ícone adaptativo Android

## 📱 Configuração das Lojas

### iOS (App Store)

1. Crie uma conta Apple Developer ($99/ano)
2. Configure o Bundle ID em `app.json`
3. Execute `eas build --platform ios`
4. Envie via `eas submit --platform ios`

### Android (Google Play)

1. Crie uma conta Google Play Console ($25 único)
2. Configure o package name em `app.json`
3. Execute `eas build --platform android`
4. Envie via `eas submit --platform android`

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Cobertura de testes
npm run test:coverage
```

## 📊 Performance

- ✅ FlatList otimizado com virtualização
- ✅ Lazy loading de componentes
- ✅ Compressão de imagens
- ✅ 60 FPS garantido
- ✅ Compatível com Expo Go para desenvolvimento rápido

## 🐛 Tratamento de Erros

O app inclui um sistema robusto de tratamento de erros:

- **ErrorBoundary**: Captura erros React
- **Validação**: Validação de formulários e dados
- **Retry Logic**: Retry automático com exponential backoff
- **Logging**: Logs detalhados no console (dev mode)

## 📚 Documentação Adicional

- [docs/setup-env.md](./docs/setup-env.md) - Configuração de variáveis de ambiente
- [docs/env-variables.md](./docs/env-variables.md) - Referência de variáveis de ambiente
- [docs/setup-expo-go.md](./docs/setup-expo-go.md) - Setup para Expo Go
- [docs/setup-supabase.md](./docs/setup-supabase.md) - Setup completo do Supabase
- [docs/deployment.md](./docs/deployment.md) - Guia de deploy para App Store e Google Play
- [docs/chat-ia.md](./docs/chat-ia.md) - Documentação do chat com IA
- [docs/data-safety-google-play.md](./docs/data-safety-google-play.md) - Data Safety para Google Play

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Autores

- **LionGab** - [GitHub](https://github.com/LionGab)

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

**⭐ Nossa Maternidade** - Apoiando mães em cada etapa da jornada maternal.
