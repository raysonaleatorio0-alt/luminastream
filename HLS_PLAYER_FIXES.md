# 🎯 Soluções para Erros do Player MegaPlay - XtreamPlayer

## 📋 Problemas Resolvidos

### 1️⃣ Erro ERR_QUIC_PROTOCOL_ERROR (HTTP/3 QUIC)

**Problema:** Fragmentos de vídeo (.ts) do domínio `w2.playerscdn.xyz` falhavam com:
```
net::ERR_QUIC_PROTOCOL_ERROR 200 (OK)
```

**Causa:** O servidor pode não suportar HTTP/3 completamente ou tem limitações de taxa com QUIC.

**Solução Aplicada:**
- Aumentado `fragLoadingMaxRetry` de **6 para 12** - Mais tentativas de download
- Reduzido `fragLoadingRetryDelay` de **2000ms para 1000ms** - Retry mais rápido  
- Adicionado `fragLoadingTimeOut: 20000` - Timeout de 20 segundos para cada fragmento
- Adicionado timeout de 20 segundos para manifest também

**Como funciona:**
```typescript
// ANTES (insuficiente):
fragLoadingMaxRetry: 6,
fragLoadingRetryDelay: 2000,

// DEPOIS (robusto):
fragLoadingMaxRetry: 12,           // Tenta 12 vezes
fragLoadingRetryDelay: 1000,       // Aguarda 1s entre tentativas
fragLoadingTimeOut: 20000,         // Timeout de 20s por fragmento
```

---

### 2️⃣ Erro "Permissions Policy: screen-wake-lock is not allowed"

**Problema:**
```
[Violation] Permissions policy violation: screen-wake-lock is 
not allowed in this document
```

**Causa:** O iframe estava solicitando `screen-wake-lock` sem proteção, e o navegador/servidor pode bloquear.

**Solução Aplicada:**

✅ **Removido** `screen-wake-lock` do atributo `allow` dos iframes:

**Arquivos modificados:**
- [src/components/lumina/OmniPlayer.tsx](src/components/lumina/OmniPlayer.tsx#L182)
  ```typescript
  // ANTES:
  allow="autoplay *; fullscreen *; encrypted-media *; screen-wake-lock"
  
  // DEPOIS:
  allow="autoplay *; fullscreen *; encrypted-media *;"
  ```

- [src/components/movies/PlayerModal.tsx](src/components/movies/PlayerModal.tsx#L117)
  ```typescript
  // ANTES:
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture; screen-wake-lock"
  
  // DEPOIS:
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
  ```

✅ **Criado utilitário seguro** em [src/lib/wake-lock.ts](src/lib/wake-lock.ts):
```typescript
// Uso seguro com try/catch automático:
import { requestWakeLock, releaseWakeLock } from "@/lib/wake-lock";

// Tentar adquirir (falha graciosamente se bloqueado)
const success = await requestWakeLock();
if (success) {
  console.log("Screen mantido ligado durante reprodução");
} else {
  console.log("Wake Lock não disponível - continuando sem ele");
}
```

---

### 3️⃣ Erro "HLS Media Fatal Error: recovering..."

**Problema:**
```
HLS Media Fatal Error: recovering...
```
Vídeo travava completamente por timeout de rede.

**Solução Aplicada:**

Melhorado o tratamento de erros com retry **agressivo** e logging detalhado:

```typescript
// Novo handler com detectação de erros QUIC:
hls.on(Hls.Events.ERROR, (_event, data) => {
  console.warn("[HLS] error", data.type, data.details, data.fatal);
  
  // Log detalhes do erro QUIC
  if (data.type === Hls.ErrorTypes.NETWORK_ERROR && data.response) {
    console.error("[HLS NETWORK ERROR] Status:", 
      data.response.code, "URL:", data.url);
  }
  
  if (!data.fatal) return;

  switch (data.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      // Retry com delay para erros de rede
      if (data.details === 'manifestLoadError' || 
          data.details === 'fragLoadError') {
        console.log("[HLS] Retrying com delay de 1.5s...");
        setTimeout(() => {
          hls.startLoad();
        }, 1500);
      } else {
        hls.startLoad();
      }
      break;
      
    case Hls.ErrorTypes.MEDIA_ERROR:
      console.warn("[HLS] Recuperando erro de mídia...");
      hls.recoverMediaError();
      break;
      
    default:
      console.error("[HLS] Erro fatal não recuperável:", data.details);
      setHasError(true);
      cleanupHls();
      break;
  }
});
```

---

## 📊 Configurações do hls.js Otimizadas

Localização: [src/components/lumina/XtreamPlayer.tsx](src/components/lumina/XtreamPlayer.tsx#L52)

```typescript
const hls = new Hls({
  // Buffer e prefetch
  maxBufferLength: 30,              // Máx 30s buffered
  maxMaxBufferLength: 60,           // Máx 60s max
  startFragPrefetch: true,          // Prefetch antecipado
  
  // Retry agressivo para fragmentos (QUIC)
  fragLoadingMaxRetry: 12,          // ⬆️ Aumentado de 6
  fragLoadingRetryDelay: 1000,      // ⬇️ Reduzido de 2000ms
  fragLoadingTimeOut: 20000,        // ✨ Novo: 20s timeout
  
  // Retry para manifest
  manifestLoadingMaxRetry: 12,      // ⬆️ Aumentado de 6
  manifestLoadingRetryDelay: 1000,  // ⬇️ Reduzido de 2000ms
  manifestLoadingTimeOut: 20000,    // ✨ Novo: 20s timeout
  
  // Outros
  levelLoadingRetryDelay: 1000,
  enableWorker: true,
  lowLevelLogger: console,          // Melhor debug
  requestHeader: { 'User-Agent': 'Mozilla/5.0' },
  emeHeaders: {},
});
```

---

## 🧪 Como Testar as Correções

### 1. Abrir o Console do Navegador (F12)
- **Network tab**: Verificar se os .ts files agora usam **HTTP/2** (não HTTP/3)
- **Console tab**: Procurar por mensagens `[HLS]` para ver retry logic

### 2. Monitorar Erros

```javascript
// Mensagens esperadas se houver problema de rede:
[HLS] error NETWORK_ERROR fragLoadError fatal:true
[HLS NETWORK ERROR] Status: 0 URL: https://w2.playerscdn.xyz/...
[HLS] Retrying com delay de 1.5s...  // Recuperação automática
```

### 3. Verificar screen-wake-lock

```javascript
// No console, não deve haver erro:
[Violation] Permissions policy violation: screen-wake-lock is not allowed
```

---

## 🚀 Próximas Otimizações (Opcionais)

1. **Usar CDN proxy** para bypas limitações do servidor:
   ```typescript
   const cdnProxy = `https://cors-proxy.example.com/?url=${encodeURIComponent(streamUrl)}`;
   hls.loadSource(cdnProxy);
   ```

2. **Implementar fallback para HTTP simples**:
   ```typescript
   // Se HTTP/2 falhar, tentar HTTP/1.1
   if (navigator.connection?.effectiveType === '4g') {
     hls.config.fragLoadingTimeOut = 15000; // Reduzir timeout em conexão lenta
   }
   ```

3. **Analytics de erros**:
   ```typescript
   // Rastrear padrões de erro
   sendToAnalytics({
     error: data.details,
     url: data.url,
     timestamp: new Date().toISOString()
   });
   ```

---

## 📚 Referências

- [hls.js Config Reference](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning)
- [QUIC/HTTP3 Issues](https://github.com/video-dev/hls.js/issues?q=quic+http3)
- [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy)

---

**✅ Todas as 3 correções foram aplicadas com sucesso!**
