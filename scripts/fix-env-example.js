/**
 * Script para limpar .env.example removendo chaves reais expostas
 * Substitui por placeholders seguros
 */

const fs = require('fs');
const path = require('path');

const ENV_EXAMPLE_PATH = path.join(__dirname, '..', '.env.example');
const ENV_TEMPLATE_PATH = path.join(__dirname, '..', 'env.template');

// Template seguro para .env.example
const SAFE_TEMPLATE = `# ============================================
# NOSSA MATERNIDADE - Environment Variables
# ============================================
# Copie este arquivo para .env e preencha os valores
# NUNCA commite o arquivo .env com valores reais!

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto.supabase.co/functions/v1

# AI APIs
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui
EXPO_PUBLIC_CLAUDE_API_KEY=sua_chave_claude_aqui
EXPO_PUBLIC_OPENAI_API_KEY=sua_chave_openai_aqui
EXPO_PUBLIC_PERPLEXITY_API_KEY=sua_chave_perplexity_aqui

# Brave Search
BRAVE_API_KEY=sua_chave_brave_aqui

# Sentry (opcional)
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# OneSignal (opcional)
EXPO_PUBLIC_ONESIGNAL_APP_ID=seu_app_id_onesignal
`;

function fixEnvExample() {
  try {
    // Verificar se .env.example existe
    if (fs.existsSync(ENV_EXAMPLE_PATH)) {
      console.log('📝 Arquivo .env.example encontrado. Substituindo por template seguro...');
      
      // Fazer backup do arquivo original
      const backupPath = `${ENV_EXAMPLE_PATH}.backup.${Date.now()}`;
      fs.copyFileSync(ENV_EXAMPLE_PATH, backupPath);
      console.log(`✅ Backup criado: ${backupPath}`);
      
      // Escrever template seguro
      fs.writeFileSync(ENV_EXAMPLE_PATH, SAFE_TEMPLATE, 'utf8');
      console.log('✅ .env.example atualizado com template seguro');
      
      console.log('\n⚠️  IMPORTANTE:');
      console.log('1. Rotacione TODAS as chaves nos consoles dos provedores');
      console.log('2. As chaves antigas foram expostas no histórico git');
      console.log('3. Considere limpar o histórico git (BFG ou git filter-branch)');
      console.log('4. O backup do arquivo original foi salvo');
    } else {
      // Criar arquivo se não existir
      fs.writeFileSync(ENV_EXAMPLE_PATH, SAFE_TEMPLATE, 'utf8');
      console.log('✅ .env.example criado com template seguro');
    }
  } catch (error) {
    console.error('❌ Erro ao processar .env.example:', error);
    process.exit(1);
  }
}

// Executar
fixEnvExample();

