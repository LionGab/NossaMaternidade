/**
 * Services - Exportações Centralizadas
 * 
 * Organização por domínio:
 * - supabase/ - Services do Supabase (auth, database, storage)
 * - ai/ - Services de IA (Gemini, OpenAI, Claude, etc.)
 * - storage/ - Services de armazenamento local
 * - analytics/ - Services de analytics e tracking
 * - aiTools/ - Ferramentas de IA (tools, executors)
 */

// Supabase Services
export * from './supabase';

// AI Services
export * from './ai';

// Storage Services
export * from './storage';

// Analytics Services
export * from './analytics';

// AI Tools
export * from './aiTools';

// Other Services (não categorizados ainda)
export * from './sentry';
