const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Adicionar extensões suportadas
config.resolver.sourceExts.push('mjs');

// Excluir arquivos de configuração do bundle (especialmente eslint.config.mjs que usa import.meta)
// Esses arquivos não devem ser incluídos no bundle da aplicação
config.resolver.blockList = [
  // Arquivos de configuração que não devem estar no bundle
  /eslint\.config\.mjs$/,
  /\.eslintrc\.js$/,
  /jest\.config\.js$/,
  /jest\.setup\.js$/,
  /babel\.config\.js$/,
  /tailwind\.config\.js$/,
  /metro\.config\.js$/,
  /app\.config\.js$/,
];

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
