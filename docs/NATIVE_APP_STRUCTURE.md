# Estrutura do App Nativo - App da Nathália

## Resumo

Este documento descreve a estrutura completa do app nativo para iOS (Swift/SwiftUI) e Android (Kotlin), pronto para submissão na App Store e Google Play Store.

---

## Informações do App

| Campo | Valor |
|-------|-------|
| Nome | App da Nathália |
| Versão | 1.0.0 |
| Build | 1 |
| Bundle ID (iOS) | com.nathalia.maternidade.app |
| Package Name (Android) | com.nathalia.maternidade |
| Backend | Supabase |
| Mínimo iOS | 14.0 |
| Mínimo Android | API 24 (Android 7.0) |
| Target Android | API 34 (Android 14) |

---

## Estrutura de Navegação (5 Tabs)

```
┌─────────────────────────────────────────────────────────┐
│                    APP DA NATHÁLIA                      │
├─────────┬─────────┬─────────┬─────────┬─────────────────┤
│  Home   │ NathIA  │ Mães    │ Mundo   │    Hábitos     │
│   🏠    │   💬   │ Valentes │  Nath   │      ✅        │
│         │         │   ❤️    │   🎬    │                │
└─────────┴─────────┴─────────┴─────────┴─────────────────┘
```

---

## Estrutura iOS

```
ios/
├── AppNathalia/
│   ├── App/
│   │   ├── AppNathaliaApp.swift       # Entry point + MainTabView
│   │   └── AppDelegate.swift          # App lifecycle
│   │
│   ├── Models/
│   │   ├── User.swift                 # Modelo de usuário
│   │   ├── ChatMessage.swift          # Mensagens do chat
│   │   ├── Post.swift                 # Posts da comunidade
│   │   ├── Video.swift                # Vídeos do MundoNath
│   │   ├── Habit.swift                # Hábitos
│   │   └── Subscription.swift         # Assinaturas
│   │
│   ├── Views/
│   │   ├── Home/
│   │   │   └── HomeView.swift
│   │   ├── NathIA/
│   │   │   └── NathIAView.swift       # Chat com IA
│   │   ├── MaesValentes/
│   │   │   └── MaesValentesView.swift # Comunidade
│   │   ├── MundoNath/
│   │   │   └── MundoNathView.swift    # Conteúdo premium
│   │   ├── Habits/
│   │   │   └── HabitsView.swift       # Rastreador
│   │   ├── Auth/
│   │   │   ├── LoginView.swift
│   │   │   └── SignUpView.swift
│   │   └── Onboarding/
│   │       └── OnboardingView.swift
│   │
│   ├── ViewModels/
│   │   └── AuthViewModel.swift
│   │
│   ├── Services/
│   │   └── SupabaseService.swift      # Cliente Supabase
│   │
│   ├── Utils/
│   │   ├── Constants.swift
│   │   └── Validators.swift
│   │
│   └── Resources/
│       ├── Info.plist
│       └── Assets.xcassets/
│
└── Podfile                            # Dependências CocoaPods
```

---

## Estrutura Android

```
android/
├── app/
│   └── src/
│       └── main/
│           ├── java/com/nathalia/maternidade/
│           │   ├── App.kt                    # Application class
│           │   │
│           │   ├── data/
│           │   │   └── models/
│           │   │       ├── Models.kt         # Todos os modelos
│           │   │       └── User.kt
│           │   │
│           │   ├── ui/
│           │   │   └── main/
│           │   │       ├── MainActivity.kt   # Activity principal
│           │   │       ├── home/
│           │   │       │   └── HomeFragment.kt
│           │   │       ├── chat/
│           │   │       │   ├── ChatFragment.kt
│           │   │       │   └── ChatViewModel.kt
│           │   │       ├── community/
│           │   │       │   ├── CommunityFragment.kt
│           │   │       │   └── CommunityViewModel.kt
│           │   │       ├── mundo/
│           │   │       │   ├── MundoNathFragment.kt
│           │   │       │   └── MundoNathViewModel.kt
│           │   │       └── habits/
│           │   │           ├── HabitsFragment.kt
│           │   │           └── HabitsViewModel.kt
│           │   │
│           │   └── utils/
│           │       └── Constants.kt
│           │
│           ├── res/
│           │   ├── values/
│           │   │   ├── colors.xml
│           │   │   ├── strings.xml
│           │   │   └── themes.xml
│           │   └── values-night/
│           │       └── themes.xml
│           │
│           └── AndroidManifest.xml
│
├── build.gradle                       # Project-level
└── app/build.gradle                   # App-level
```

---

## Dependências

### iOS (Podfile)
- Supabase (~> 2.0)
- Alamofire (~> 5.8)
- SDWebImageSwiftUI (~> 2.2)
- lottie-ios (~> 4.3)
- RevenueCat (~> 4.31)
- Sentry (~> 8.17)
- KeychainAccess (~> 4.2)

### Android (build.gradle)
- Supabase BOM (~> 2.0.4)
- Ktor Client (~> 2.3.7)
- Retrofit (~> 2.9.0)
- Coil (~> 2.5.0)
- ExoPlayer (~> 1.2.0)
- Lottie (~> 6.3.0)
- Google Billing (~> 6.1.0)
- Sentry (~> 7.0.0)

---

## Funcionalidades por Tela

### 1. Home 🏠
- Dashboard personalizado
- Resumo do progresso diário
- Cards de ação rápida
- Recomendações personalizadas

### 2. NathIA 💬
- Chat com IA 24h
- Sugestões rápidas de perguntas
- Histórico de conversas
- Aviso médico permanente
- Indicador de digitação

### 3. MãesValentes ❤️
- Feed de publicações
- Filtros (todos/populares/recentes/seguindo)
- Criar publicação (normal/anônima)
- Like, comentário, compartilhar
- Denúncia de conteúdo
- Regras da comunidade

### 4. MundoNath 🎬
- Header premium com gradiente dourado
- Séries de vídeos em carousel
- Categorias (gestação, pós-parto, amamentação, etc.)
- Continue assistindo
- Paywall para não-assinantes
- Player de vídeo nativo

### 5. Hábitos ✅
- Lista de hábitos do dia
- Progresso circular e barra
- Streak (sequência de dias)
- Calendário semanal
- Criar/editar/excluir hábitos
- Categorias e cores
- Lembretes

---

## Telas de Suporte

### Autenticação
- Login (email/senha)
- Login social (Google, Apple)
- Cadastro
- Recuperação de senha
- Termos de uso

### Onboarding
- 4 telas com page control
- Cores diferentes por página
- Botão pular/próximo/começar

### Perfil
- Dados do usuário
- Configurações
- Assinatura
- Ajuda
- Logout

---

## Configuração do Supabase

### Tabelas Necessárias
- `users` - Dados dos usuários
- `chat_messages` - Histórico do chat
- `posts` - Publicações da comunidade
- `comments` - Comentários
- `videos` - Metadados de vídeos
- `series` - Séries de vídeos
- `habits` - Hábitos dos usuários
- `habit_logs` - Registros de conclusão
- `subscriptions` - Assinaturas

### Auth Providers
- Email/Password
- Google
- Apple (iOS)

### Storage Buckets
- `avatars` - Fotos de perfil
- `post-images` - Imagens de posts
- `audio-messages` - Mensagens de áudio

### Edge Functions
- `chat-ai` - Processamento do chat com IA
- `moderate-content` - Moderação de conteúdo
- `send-notification` - Notificações push

---

## Metadados das Lojas

```
store-metadata/
├── app-store/
│   └── pt-BR/
│       ├── description.txt
│       ├── keywords.txt
│       ├── promotional_text.txt
│       └── subtitle.txt
│
├── google-play/
│   └── pt-BR/
│       ├── full_description.txt
│       ├── short_description.txt
│       └── title.txt
│
└── release-notes/
    └── v1.0.0.txt
```

---

## Próximos Passos

1. **Configurar Supabase**
   - Criar projeto
   - Criar tabelas com RLS
   - Configurar Auth providers
   - Deployar Edge Functions

2. **Assets Visuais**
   - App Icons
   - Screenshots das lojas
   - Feature Graphic (Android)
   - Launch Screen

3. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes em dispositivos físicos

4. **Publicação**
   - Seguir CHECKLIST_PRE_LAUNCH.md
   - Seguir CHECKLIST_PUBLICATION.md

---

## Contato

- Suporte: suporte@appdanathalia.com
- Redes: @appdanathalia
