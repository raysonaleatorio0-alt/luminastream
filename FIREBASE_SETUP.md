# 🔐 Autenticação com Google e Persistência de Watchlist

Este guia explica como configurar a autenticação do Google e a persistência de dados com Firestore na sua aplicação LuminaStream.

## 📋 O que foi implementado

✅ **Login com Google** - Botão de login na navbar  
✅ **Foto de Perfil** - Mostra a foto do email do usuário logado  
✅ **Watchlist Persistente** - Dados salvos no Firestore (sincronizam entre dispositivos)  
✅ **Logout** - Menu do perfil com opção de logout  
✅ **Proteção de Rota** - Watchlist apenas visível para usuários logados  

## 🔧 Configuração do Firebase

### Passo 1: Obter Credenciais do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione o projeto: **studio-164154723-b3527**
3. Vá para **Configurações do Projeto** (engrenagem no menu esquerdo)
4. Clique na aba **Contas de Serviço**
5. Clique em **Gerar Nova Chave Privada** (se não tiver uma)
6. Na seção de **SDK de Administração**, localize o código JavaScript
7. Copie os valores de:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Passo 2: Habilitar Autenticação do Google

1. No Console do Firebase, vá para **Authentication** (Autenticação)
2. Clique na aba **Sign-in method** (Método de login)
3. Clique em **Google**
4. Ative o provedor de Google
5. Defina um **Email de suporte do projeto**
6. Clique em **Salvar**

### Passo 3: Configurar Firestore

1. No Console do Firebase, vá para **Firestore Database**
2. Clique em **Criar Banco de Dados**
3. Escolha o modo de início: **Modo de teste** (para desenvolvimento)
4. Selecione a localização: **us-central1** (ou próxima a você)
5. Clique em **Criar**

### Passo 4: Configurar as Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores placeholder pelos dados do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=Seu_API_Key_Aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-id-do-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

3. Salve o arquivo

## 🎯 Como Usar

### Para Usuários

1. **Login com Google**
   - Clique no botão "Login com Google" na navbar
   - Autorize o acesso com sua conta Google
   - Sua foto de perfil será exibida automaticamente

2. **Adicionar à Watchlist**
   - Faça login com sua conta Google
   - Adicione filmes e séries à sua lista
   - Os itens são salvos automaticamente no Firestore

3. **Acessar Minha Lista**
   - Clique em "Minha Lista" na navbar
   - Veja todos os itens que adicionou
   - Remova itens clicando no ícone ✕

4. **Logout**
   - Clique na sua foto de perfil
   - Clique em "Logout"

### Para Desenvolvedores

#### Usando o Hook `useWatchlist`

```typescript
import { useWatchlist } from '@/hooks/use-watchlist';

function MyComponent() {
  const { 
    watchlist,      // Array de itens na lista
    isLoading,      // Indicador de carregamento
    error,          // Mensagem de erro (se houver)
    addItem,        // Função para adicionar item
    removeItem,     // Função para remover item
    checkIfInWatchlist,  // Verificar se um item está na lista
    refetch,        // Recarregar a watchlist
  } = useWatchlist();

  // Seu código aqui
}
```

#### Usando os Serviços Diretamente

```typescript
import { 
  getUserWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from '@/lib/watchlistService';

// Adicionar item
const itemId = await addToWatchlist(userId, {
  mediaId: '12345',
  mediaType: 'movie',
  title: 'Exemplo de Filme',
  posterPath: '/w500/path-to-poster.jpg',
});

// Obter lista completa
const items = await getUserWatchlist(userId);

// Remover item
await removeFromWatchlist(itemId);
```

## 🔍 Estrutura de Dados no Firestore

A coleção `watchlist` armazena documentos com a seguinte estrutura:

```javascript
{
  userId: "uid-do-usuario",              // ID do usuário Firebase
  mediaId: "12345",                      // ID do filme/série na TMDB
  mediaType: "movie" | "series",         // Tipo de mídia
  title: "Título do Filme",              // Título da mídia
  posterPath: "/w500/path-to-poster",    // URL relativa do poster
  addedAt: Timestamp,                    // Data de adição
}
```

## 🛡️ Segurança

Para colocar em produção, você deve implementar regras de segurança no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /watchlist/{document=**} {
      allow read, write: if request.auth.uid != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🐛 Troubleshooting

### Erro: "CORS policy: Access to XMLHttpRequest has been blocked"
- Verifique se o projeto está rodando em `http://localhost:3000` ou `http://localhost:9002`
- Adicione seu domínio às origens autorizadas no Console do Firebase

### Erro: "Invalid API Key"
- Verifique se o `NEXT_PUBLIC_FIREBASE_API_KEY` está correto
- Confirme que a chave é para um aplicativo web

### A foto não carrega
- Verifique se `user.photoURL` está sendo retornado pelo Google
- Alguns usuários podem não ter foto configurada na conta Google

### Watchlist vazia mesmo após adicionar itens
- Verifique se o Firestore foi criado corretamente
- Veja o console do navegador para mensagens de erro
- Confirme que a regra de segurança permite leitura/escrita

## 📚 Documentação Adicional

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Next.js Documentation](https://nextjs.org/docs)

## 📧 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12) - Abra a aba "Console" para ver mensagens de erro
2. Network (F12) - Verifique se as chamadas ao Firebase estão sendo feitas
3. Firestore - Verifique se os dados estão sendo salvos no banco
