# Notas para Reviewers - Nossa Maternidade

**Versão:** 1.0.0
**Data:** Dezembro 2025
**Plataformas:** iOS (12+) e Android (Everyone - PEGI 3)

---

## 🔐 Credenciais de Teste

Para facilitar a revisão do aplicativo, criamos uma conta de teste com acesso completo a todas as funcionalidades:

```
Email: reviewer@nossamaternidade.com
Senha: TestReview2025!
```

**Importante:**
- Esta conta contém dados de exemplo (não reais)
- Já possui perfil completo configurado
- Tem acesso a posts na comunidade, histórico de chat e hábitos rastreados
- Nenhum dado real de usuária está exposto

---

## 🎯 Principais Funcionalidades

### 1. Chat IA - "MãesValente" 💬

**Onde encontrar:** Tab "Chat" na navegação inferior (ícone de mensagem)

**O que faz:** Assistente virtual de apoio emocional para mães, baseado em IA generativa.

**Como testar:**
1. Abrir o tab "Chat"
2. Digite uma mensagem como: "Estou me sentindo ansiosa com a amamentação"
3. A IA responderá com apoio empático e sugestões personalizadas
4. Experimente também: "Como melhorar o sono do bebê?" ou "Me sinto sobrecarregada"

**Features:**
- Respostas empáticas e personalizadas
- Sugestões práticas baseadas em contexto
- Histórico de conversas persistente
- Links para fontes confiáveis (quando aplicável)

---

### 2. Comunidade 👥

**Onde encontrar:** Tab "Comunidade" na navegação inferior

**O que faz:** Espaço seguro para mães compartilharem experiências, dúvidas e apoio mútuo.

**Como testar:**
1. Abrir o tab "Comunidade"
2. Navegar pelo feed de posts (já existem posts de exemplo)
3. Comentar em um post existente (opcional)
4. Ver detalhes de um post tocando nele
5. (Opcional) Criar um novo post usando o botão "+" (não obrigatório para review)

**Features:**
- Feed de posts de mães reais
- Sistema de comentários
- Moderação de conteúdo (IA + manual)
- Anonimato opcional
- Filtros de conteúdo sensível

---

### 3. Hábitos de Autocuidado ❤️

**Onde encontrar:** Tab "Hábitos" (ou "Meus Cuidados") na navegação inferior

**O que faz:** Rastreamento diário de hábitos saudáveis (sono, humor, exercícios, hidratação).

**Como testar:**
1. Abrir o tab "Hábitos"
2. Ver hábitos já configurados
3. Adicionar um registro de humor tocando no card de humor
4. Ver progresso semanal e streaks

**Features:**
- Tracking de múltiplos hábitos
- Registro rápido (1 toque)
- Visualização de progresso
- Sistema de streaks/gamificação
- Lembretes opcionais (com notificações)

---

### 4. Mundo Nath 🌟

**Onde encontrar:** Tab "Mundo da Nath" na navegação inferior (ícone de estrela)

**O que faz:** Hub de conteúdo educacional (vídeos, áudios, artigos sobre maternidade).

**Como testar:**
1. Abrir o tab "Mundo da Nath"
2. Navegar pelo feed de conteúdos
3. Abrir um vídeo ou artigo
4. Explorar categorias (se disponível)

**Features:**
- Conteúdo curado por especialistas
- Vídeos, áudios e artigos
- Favoritar conteúdos
- Histórico de visualização

---

### 5. Check-in Emocional 🌈

**Onde encontrar:** Home Screen (primeira tela após login) - card "Como você está se sentindo?"

**O que faz:** Registro rápido do estado emocional diário.

**Como testar:**
1. Na Home, tocar no card de check-in emocional
2. Mover o slider de humor
3. (Opcional) Adicionar uma nota
4. Salvar

**Features:**
- Slider de emoções (triste → feliz)
- Registro rápido
- Histórico de humor ao longo do tempo
- Insights sobre padrões emocionais

---

## 🔔 Permissões Solicitadas

**Todas as permissões são OPCIONAIS** e solicitadas apenas no momento de uso (quando necessárias):

### 📷 Câmera
- **Quando:** Ao tentar tirar foto para postar na comunidade
- **Por quê:** Permitir compartilhar momentos especiais
- **Obrigatório:** Não - pode escolher foto da galeria

### 🖼️ Galeria de Fotos
- **Quando:** Ao escolher foto existente para post
- **Por quê:** Compartilhar fotos já tiradas
- **Obrigatório:** Não - pode tirar nova foto com câmera

### 📍 Localização (iOS/Android)
- **Quando:** Ao ativar funcionalidade "Mães Próximas" (futura)
- **Por quê:** Conectar com mães da mesma região
- **Obrigatório:** Não - funcionalidade opcional
- **Nota:** Feature ainda não implementada na v1.0.0

### 🔔 Notificações
- **Quando:** Ao configurar lembretes de hábitos
- **Por quê:** Receber lembretes personalizados
- **Obrigatório:** Não - pode usar sem notificações

### 🎤 Microfone (futura)
- **Quando:** Ao gravar mensagem de áudio para IA (futura feature)
- **Por quê:** Conversar por voz com a assistente
- **Obrigatório:** Não - pode digitar mensagens

**Pode recusar todas as permissões** - o app funcionará normalmente com funcionalidades básicas.

---

## ⚕️ Aviso Médico Importante

### ⚠️ ESTE APP NÃO SUBSTITUI ATENDIMENTO MÉDICO PROFISSIONAL

O "Nossa Maternidade" é uma ferramenta de **apoio emocional** e **organização de rotina** para mães.

**O que o app FAZ:**
- ✅ Oferece apoio emocional através de IA empática
- ✅ Conecta mães em comunidade segura
- ✅ Ajuda a rastrear hábitos saudáveis
- ✅ Fornece conteúdo educacional curado

**O que o app NÃO FAZ:**
- ❌ Não substitui consulta médica
- ❌ Não fornece diagnósticos
- ❌ Não prescreve tratamentos
- ❌ Não é adequado para emergências médicas

### 🚨 Em caso de emergência:

**Brasil:**
- **SAMU:** 192 (emergências médicas)
- **CVV:** 188 ou chat em https://www.cvv.org.br (apoio emocional 24h)
- **Pronto-socorro:** Procure o mais próximo

**Sinais de alerta (procure ajuda imediatamente):**
- Pensamentos de autolesão
- Depressão pós-parto severa
- Emergências médicas com o bebê
- Sangramento vaginal intenso
- Dor abdominal forte

---

## 📱 Fluxo de Teste Sugerido (10-15 min)

Para uma revisão completa do aplicativo, sugerimos o seguinte fluxo:

### Passo 1: Login (1 min)
1. Abrir o app
2. Fazer login com as credenciais fornecidas
3. (Se solicitado) Aceitar termos de uso e política de privacidade

### Passo 2: Explorar Home (2 min)
1. Ver o dashboard principal
2. Observar cards de check-in emocional
3. Ver ações rápidas e sugestões do dia

### Passo 3: Chat IA (3 min)
1. Ir para o tab "Chat"
2. Enviar uma mensagem: "Me sinto cansada e sobrecarregada"
3. Ver a resposta empática da IA
4. Enviar outra mensagem: "Meu bebê não dorme à noite"
5. Observar sugestões práticas fornecidas

### Passo 4: Comunidade (2 min)
1. Ir para o tab "Comunidade"
2. Navegar pelos posts existentes
3. Tocar em um post para ver detalhes e comentários
4. (Opcional) Adicionar um comentário

### Passo 5: Hábitos (2 min)
1. Ir para o tab "Hábitos"
2. Ver hábitos configurados
3. Adicionar um registro de humor (tocar no card de humor)
4. Ver progresso semanal

### Passo 6: Mundo Nath (2 min)
1. Ir para o tab "Mundo da Nath"
2. Navegar pelo feed de conteúdo
3. Abrir um vídeo ou artigo
4. Voltar para explorar outras categorias

### Passo 7: Perfil (1 min)
1. Tocar no avatar no canto superior direito (ou ir em "Perfil")
2. Ver dados do perfil de teste
3. Explorar configurações (se disponível)

**Tempo total:** ~13 minutos

---

## 🌍 Localização

- **Idioma principal:** Português (Brasil)
- **Fuso horário:** GMT-3 (Brasília)
- **Moeda:** BRL (R$) - se aplicável para futuras features premium

---

## 🔒 Privacidade e Segurança

### Dados Coletados

**Dados pessoais:**
- Nome, email, foto de perfil
- Data de nascimento (opcional)
- Localização aproximada (opcional, não implementado na v1.0.0)

**Dados de saúde (sensíveis):**
- Registros de humor
- Hábitos de autocuidado (sono, exercício, etc)
- Mensagens no chat IA
- Posts na comunidade

**Como protegemos:**
- ✅ Criptografia TLS 1.3 em todas as comunicações
- ✅ Dados armazenados com AES-256
- ✅ Row Level Security (RLS) no banco de dados
- ✅ Autenticação segura (Supabase Auth)
- ✅ Moderação de conteúdo (IA + humana)

### Compartilhamento de Dados

**NÃO compartilhamos dados com terceiros**, exceto:
- **Processadores técnicos** (sob contrato):
  - Supabase (hospedagem de banco de dados)
  - Google AI (processamento de IA)
  - Sentry (monitoramento de erros)
  - OneSignal (notificações push)
- **Exigido por lei** (ordem judicial)

**Nunca vendemos dados de usuárias.**

### Direitos do Usuário (LGPD/GDPR)

- ✅ **Acessar** seus dados: export em JSON via app
- ✅ **Corrigir** dados incorretos: editar perfil
- ✅ **Excluir** conta: botão "Excluir Conta" nas configurações
- ✅ **Portabilidade**: download de todos os dados

**Contato do DPO (Data Protection Officer):**
- Email: privacy@nossamaternidade.com.br
- Resposta em até 48h úteis

---

## 📖 Links Importantes

**Políticas:**
- Privacy Policy: [https://nossamaternidade.vercel.app/privacy](URL_A_DEFINIR)
- Terms of Service: [https://nossamaternidade.vercel.app/terms](URL_A_DEFINIR)
- Medical Disclaimer: Ver na tela de login ou termos

**Suporte:**
- Email: contato@nossamaternidade.com.br
- Instagram: @nossamaternidade (em breve)
- Site: https://nossamaternidade.com.br (em construção)

---

## 🐛 Reportar Problemas Durante Review

Se encontrar bugs ou problemas durante a revisão:

**Para Apple App Review:**
- Usar o "Resolution Center" no App Store Connect
- Descrever o problema e anexar screenshots

**Para Google Play Review:**
- Responder via Google Play Console
- Incluir device, OS version e passos para reproduzir

**Contato direto:**
- Email: eugabrielmktd@gmail.com
- Resposta em até 24h

---

## 🎨 Créditos e Agradecimentos

**Desenvolvido por:**
- Lion Gabriel (Desenvolvedor Full-Stack)
- Design: Maternal Wellness Design System

**Tecnologias:**
- React Native / Expo SDK 54
- Supabase (Backend)
- Google Gemini (IA)
- Sentry (Monitoramento)

**Inspiração:**
- Comunidade de mães do Brasil
- Especialistas em saúde materna
- Feedback de usuárias beta

---

## ✅ Checklist de Revisão

Para facilitar a revisão, aqui está um checklist do que verificar:

### Funcionalidades Core
- [ ] Login funciona com as credenciais fornecidas
- [ ] Home exibe dashboard correto
- [ ] Chat IA responde adequadamente
- [ ] Comunidade exibe posts
- [ ] Hábitos podem ser registrados
- [ ] Mundo Nath exibe conteúdo

### Interface
- [ ] Navegação entre tabs funciona
- [ ] Animações são suaves
- [ ] Textos estão legíveis
- [ ] Botões têm áreas de toque adequadas (44pt+)
- [ ] Safe areas respeitadas (notch/home indicator)

### Permissões
- [ ] Permissões solicitadas apenas quando necessárias
- [ ] Descrições de permissões claras e em português
- [ ] App funciona sem conceder permissões opcionais

### Conteúdo
- [ ] Aviso médico presente e claro
- [ ] Links para emergência visíveis
- [ ] Política de privacidade acessível
- [ ] Termos de uso acessíveis

### Segurança
- [ ] Login seguro
- [ ] Dados sensíveis protegidos
- [ ] Logout funciona
- [ ] Sessão persiste entre aberturas do app

---

## 💬 Mensagem Final

Obrigado por revisar o **Nossa Maternidade**!

Este app foi criado com amor e cuidado para apoiar mães em uma das fases mais desafiadoras e recompensadoras da vida.

Nosso objetivo é:
- 💙 Reduzir o isolamento materno
- 💙 Oferecer apoio emocional 24/7
- 💙 Criar uma comunidade acolhedora
- 💙 Facilitar o autocuidado

Estamos comprometidos em:
- ✅ Proteger a privacidade das usuárias
- ✅ Fornecer informações confiáveis
- ✅ Melhorar continuamente baseado em feedback
- ✅ Manter um ambiente seguro e respeitoso

Se tiver qualquer dúvida ou sugestão durante a revisão, por favor, não hesite em nos contactar.

**Equipe Nossa Maternidade** 💜

---

**Última atualização:** Dezembro 2025
**Versão do app:** 1.0.0
**Preparado por:** Lion Gabriel (Developer)
