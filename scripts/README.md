# Scripts Úteis

Scripts auxiliares para desenvolvimento e testes.

## Scripts Disponíveis

### test-supabase-connection.ts

Testa a conexão com o Supabase e valida as variáveis de ambiente.

```bash
# Executar via ts-node
npx ts-node scripts/test-supabase-connection.ts

# Ou adicione ao package.json:
npm run test:supabase
```

Este script verifica:
- ✅ Variáveis de ambiente configuradas
- ✅ Conexão com Supabase
- ✅ Autenticação funcionando
- ✅ Storage buckets acessíveis

## 📝 Nota

Scripts de deploy cloud foram removidos pois este é um projeto mobile-first que usa EAS Build para builds e submissão às lojas.

Para builds e deploy, use os comandos do EAS:
- `npm run build:ios` - Build para iOS
- `npm run build:android` - Build para Android
- `npm run submit:ios` - Submeter para App Store
- `npm run submit:android` - Submeter para Google Play
