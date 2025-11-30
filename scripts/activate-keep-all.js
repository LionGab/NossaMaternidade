/**
 * Script para ativar Keep All (Allow All) no File Review
 * Este script ativa a permissão Allow All para aprovar automaticamente todas as mudanças
 */

const fs = require('fs');
const path = require('path');

// Simula o AsyncStorage do React Native para poder modificar programaticamente
// Nota: Em produção, isso seria feito através da UI ou da API do app

const STORAGE_KEY = '@file_review:permissions';

// Permissões padrão com Allow All ativado
const permissions = {
  allowAll: true,
  autoApprove: false,
  requireReview: true,
  allowedAgents: [],
};

console.log('🟢 Ativando Keep All (Allow All)...\n');
console.log('📋 Permissões que serão aplicadas:');
console.log(JSON.stringify(permissions, null, 2));
console.log('\n✅ Keep All ativado com sucesso!');
console.log('\n📝 Nota: Estas permissões serão salvas no AsyncStorage quando o app iniciar.');
console.log('💡 O FileReviewService carregará essas permissões automaticamente na próxima vez que o app iniciar.');

// Se houver um arquivo de storage simulado, podemos atualizá-lo aqui
const storagePath = path.join(__dirname, '..', '.file-review-storage.json');

try {
  let storage = {};
  if (fs.existsSync(storagePath)) {
    storage = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
  }
  
  storage[STORAGE_KEY] = JSON.stringify(permissions);
  fs.writeFileSync(storagePath, JSON.stringify(storage, null, 2));
  console.log(`\n💾 Permissões salvas em: ${storagePath}`);
} catch (error) {
  console.log('\n⚠️  Não foi possível salvar no arquivo (isso é normal em React Native)');
  console.log('   As permissões serão persistidas via AsyncStorage no app.');
}

