# Dependências Necessárias para Migração Web → React Native

## Instalação

Execute o seguinte comando para instalar todas as dependências necessárias:

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install @react-native-community/slider
npm install nativewind tailwindcss
npm install @shopify/flash-list
npm install lucide-react-native react-native-svg
npm install @google/generative-ai
npm install expo-av expo-haptics expo-linear-gradient expo-image
```

## Dependências Já Instaladas

As seguintes dependências já estão no `package.json`:

- `@expo/vector-icons` - Ícones do Expo
- `@google/generative-ai` - API Gemini
- `@react-native-async-storage/async-storage` - Armazenamento local
- `@react-navigation/*` - Navegação
- `@shopify/flash-list` - Lista performática
- `expo` - SDK Expo
- `expo-haptics` - Feedback háptico
- `expo-linear-gradient` - Gradientes
- `lucide-react-native` - Ícones
- `nativewind` - Tailwind para React Native
- `react-native-safe-area-context` - Safe areas
- `react-native-screens` - Screens nativas
- `react-native-svg` - SVG support

## Dependências Adicionais Necessárias

Adicione estas ao `package.json`:

```json
{
  "dependencies": {
    "@react-native-community/slider": "^4.5.2"
  }
}
```

## Configuração do NativeWind

Certifique-se de que o `tailwind.config.js` está configurado corretamente:

```js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  // ... resto da configuração
}
```

E o `babel.config.js`:

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
    plugins: ['react-native-reanimated/plugin']
  };
};
```

