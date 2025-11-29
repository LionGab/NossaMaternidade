# 🌐 Teste do App no Navegador (Localhost)

## ✅ Servidor Web Iniciado!

O servidor Expo Web está rodando em background na **porta 8082**.

### 📍 Como Acessar:

1. **Aguarde alguns segundos** para o Expo compilar o app
2. **Abra seu navegador** e acesse:
   ```
   http://localhost:8082
   ```
3. O app **Nossa Maternidade** será carregado automaticamente

---

## 🎯 O Que Você Verá:

### Página Inicial (HomeScreen)
- ✨ Hero Banner com gradiente warm (dark mode)
- 💡 Card "Dica do Dia" com estrela amarela
- 📱 Cards de conteúdo com badges exclusivos
- 🎨 Design system completo (tokens, cores, tipografia)

### Recursos Testáveis:
- ✅ **Theme Toggle** (Dark/Light mode) - Canto superior direito
- ✅ **Cards interativos** - Clique para navegar
- ✅ **Design tokens** - Cores, espaçamentos, tipografia
- ✅ **Responsividade** - Teste redimensionando a janela

---

## 🔧 Comandos Úteis:

### Reiniciar o Servidor Web:
```bash
npm run web
```

### Parar o Servidor:
Pressione `Ctrl+C` no terminal onde o servidor está rodando

### Limpar Cache e Reiniciar:
```bash
npm run web -- --clear
```

### Verificar se o Servidor Está Rodando:
Abra o navegador e tente acessar `http://localhost:8082`

---

## 🐛 Troubleshooting:

### Porta 8082 já está em uso?
```bash
# Use outra porta
npx expo start --web --port 3000
```

### App não carrega no navegador?
1. Verifique se há erros no console do navegador (F12)
2. Verifique se o servidor está rodando: `http://localhost:8082`
3. Tente limpar o cache: `npm run web -- --clear`

### Variáveis de ambiente não carregam?
- Verifique se o arquivo `.env` existe na raiz do projeto
- As variáveis devem começar com `EXPO_PUBLIC_`
- Reinicie o servidor após alterar o `.env`

---

## 📱 Funcionalidades Web vs Mobile:

### ✅ Funcionam no Web:
- Theme switching (dark/light mode)
- Navegação entre telas
- Design system completo
- Componentes visuais
- Formulários básicos

### ⚠️ Limitados no Web:
- Haptic feedback (não disponível no navegador)
- Alguns recursos nativos (câmera, notificações push)
- Performance pode variar (melhor em mobile)

---

## 🎨 Próximos Passos:

1. **Teste o Dark/Light Mode** - Clique no toggle no canto superior direito
2. **Explore os Cards** - Veja os diferentes variants do MaternalCard
3. **Verifique Responsividade** - Redimensione a janela do navegador
4. **Inspecione Elementos** - Use DevTools (F12) para ver os tokens aplicados

---

**✨ Aproveite testando o app!**

