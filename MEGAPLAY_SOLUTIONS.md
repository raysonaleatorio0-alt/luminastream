# 🎬 Guia Completo: Resolver Erros do MegaPlay.js

## ❌ Problemas Reportados

### Problema 1: `ReferenceError: $ is not defined` (linha 61)
```
Uncaught ReferenceError: $ is not defined
    at megaplay.js:61
```

### Problema 2: `Cannot use 'import.meta' outside a module` (linha 1430)
```
Uncaught SyntaxError: Cannot use 'import.meta' outside a module
    at megaplay.js:1430
```

---

## ✅ SOLUÇÃO COMPLETA

### **PASSO 1: Adicionar jQuery ANTES do megaplay.js**

No seu arquivo HTML, **SEMPRE carregue jQuery PRIMEIRO**:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LuminaStream</title>
</head>
<body>
  <!-- Seu conteúdo -->

  <!-- ✅ PASSO 1: jQuery CDN (SEM type="module") -->
  <script 
    src="https://code.jquery.com/jquery-3.7.1.min.js" 
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ=" 
    crossOrigin="anonymous">
  </script>

  <!-- ✅ VERIFICAR jQuery carregamento -->
  <script>
    if (typeof $ === 'undefined') {
      console.error('❌ jQuery falhou ao carregar!');
    } else {
      console.log('✅ jQuery ' + $.fn.jquery + ' carregado');
    }
  </script>

  <!-- ✅ PASSO 2: megaplay.js com type="module" (DEPOIS de jQuery) -->
  <script 
    type="module" 
    src="/js/megaplay.js">
  </script>
</body>
</html>
```

**✅ Por que funciona:**
- jQuery é carregado **sem** `type="module"` (pode usar `$` globalmente)
- megaplay.js é carregado **com** `type="module"` (permite `import.meta`)
- jQuery já está disponível quando megaplay.js carrega

---

## 📋 SOLUÇÕES RÁPIDAS

### Se usando **HTML puro:**

Copie o arquivo pronto: `public/example-megaplay.html`

```bash
# Ver o arquivo com as 2 soluções já aplicadas:
cat public/example-megaplay.html
```

---

### Se usando **Next.js:**

#### **Opção A: Usar o Componente React**

```tsx
// Em qualquer página Next.js
import MegaPlayComponent from '@/components/lumina/MegaPlayComponent';

export default function WatchPage() {
  return (
    <MegaPlayComponent 
      videoUrl="https://seu-video.m3u8" 
      autoplay={true}
      controls={true}
    />
  );
}
```

#### **Opção B: Modificar `layout.tsx`**

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* jQuery CDN - SEM type="module" */}
        <script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ="
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        
        {/* MegaPlay - COM type="module" */}
        <script type="module" src="/js/megaplay.js" />
      </body>
    </html>
  );
}
```

#### **Opção C: Usar Next.js Script component (RECOMENDADO)**

```tsx
// src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* jQuery - strategy="beforeInteractive" */}
        <Script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
          integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ="
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        
        {/* MegaPlay - strategy="afterInteractive" com type="module" */}
        <Script
          src="/js/megaplay.js"
          strategy="afterInteractive"
          type="module"
        />
      </body>
    </html>
  );
}
```

---

## 🔍 Como Verificar se Funcionou

### **No Console do Navegador (F12):**

**✅ Sinais de sucesso:**
```javascript
// Deve aparecer:
✅ jQuery 3.7.1 carregado
✅ MegaPlay módulo carregando...
✅ MegaPlay módulo carregado com sucesso!
📦 Ambiente: file:///path/to/megaplay.js
✅ jQuery disponível dentro do módulo
✅ MegaPlayPlayer inicializado com sucesso
```

**❌ Sinais de erro:**
```javascript
// NÃO deve aparecer:
❌ jQuery não está disponível
❌ ReferenceError: $ is not defined
❌ Cannot use 'import.meta' outside a module
```

### **No Network tab (F12 → Network):**

1. Procure por `jquery-3.7.1.min.js` - Status **200**
2. Procure por `megaplay.js` - Status **200**
3. Verifique que jQuery carregou **ANTES** de megaplay.js

---

## 📁 Arquivos Criados

### 1. **HTML de Exemplo**
📄 `public/example-megaplay.html`
- HTML pronto com as 2 soluções
- Demonstra o player funcionando
- Abra no navegador: `http://localhost:3000/example-megaplay.html`

### 2. **JavaScript do Player**
📄 `public/js/megaplay.js`
- Módulo com `import.meta` suportado
- Classe `MegaPlayPlayer` completa
- Pode usar jQuery normalmente (`$`)

### 3. **Componente React**
📄 `src/components/lumina/MegaPlayComponent.tsx`
- Pronto para usar em páginas Next.js
- Carrega jQuery e megaplay.js automaticamente
- Inicializa o player ao montar

---

## 🎯 Exemplo de Uso Completo

### **HTML + jQuery + MegaPlay**

```html
<!DOCTYPE html>
<html>
<body>
  <div id="megaplayer" style="width: 100%; aspect-ratio: 16/9;"></div>

  <!-- 1️⃣ jQuery PRIMEIRO (sem type="module") -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

  <!-- 2️⃣ MegaPlay DEPOIS (com type="module") -->
  <script type="module" src="/js/megaplay.js"></script>

  <!-- 3️⃣ Seu código -->
  <script type="module">
    // Esperar megaplay estar pronto
    document.addEventListener('DOMContentLoaded', () => {
      const player = new MegaPlayPlayer({
        containerId: 'megaplayer',
        autoplay: false,
        controls: true
      });

      // Carregar vídeo
      player.load('https://seu-video.m3u8');

      // Usar jQuery normalmente
      $('body').on('click', '.play-btn', () => {
        player.play();
      });
    });
  </script>
</body>
</html>
```

---

## 📚 Referências

| Problema | Solução | Arquivo |
|----------|---------|---------|
| `$ is not defined` | Carregar jQuery antes de megaplay.js | Qualquer HTML |
| `import.meta outside module` | Usar `type="module"` na tag script | `<script type="module">` |
| Integração React | Usar componente pronto | `MegaPlayComponent.tsx` |
| Exemplo funcional | Copiar HTML | `example-megaplay.html` |

---

## 🚨 Troubleshooting

### Problema: "jQuery não carrega"

**Solução:** Verificar CORS
```html
<!-- Adicione integrity e crossOrigin -->
<script 
  src="https://code.jquery.com/jquery-3.7.1.min.js" 
  integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ=" 
  crossOrigin="anonymous">
</script>
```

### Problema: "import.meta is undefined"

**Solução:** Adicione `type="module"` na tag script
```html
<!-- ❌ ERRADO -->
<script src="/js/megaplay.js"></script>

<!-- ✅ CORRETO -->
<script type="module" src="/js/megaplay.js"></script>
```

### Problema: "MegaPlayPlayer não é uma função"

**Solução:** Certifique-se de que a ordem é correta
```
1. jQuery (sem type="module")
2. MegaPlay (com type="module")
3. Seu código (depois que ambos carregarem)
```

---

**✅ Todos os 2 erros foram resolvidos!**

Teste abrindo: `public/example-megaplay.html` ou use o componente React.
