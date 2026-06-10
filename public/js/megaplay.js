/**
 * megaplay.js - Player HLS com suporte a jQuery
 * 
 * ✅ Este arquivo deve ser carregado como type="module"
 * ✅ jQuery deve estar carregado ANTES deste arquivo
 * 
 * Uso no HTML:
 * <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
 * <script type="module" src="/js/megaplay.js"></script>
 */

console.log('📦 MegaPlay módulo carregando...');

// ✅ SOLUÇÃO 1: Verificar jQuery disponibilidade
function checkJQuery() {
  if (typeof $ === 'undefined') {
    console.error('❌ jQuery não está disponível. Certifique-se de carregar jQuery ANTES de megaplay.js');
    return false;
  }
  console.log('✅ jQuery disponível na versão:', $.fn.jquery);
  return true;
}

// ✅ SOLUÇÃO 2: Usar import.meta (disponível em type="module")
function getModuleInfo() {
  try {
    const moduleUrl = import.meta.url;
    const modulePath = new URL('.', moduleUrl).href;
    console.log('📍 URL do módulo:', moduleUrl);
    console.log('📁 Diretório do módulo:', modulePath);
    return { moduleUrl, modulePath };
  } catch (error) {
    console.error('❌ Erro ao acessar import.meta:', error.message);
    return null;
  }
}

/**
 * Classe principal do player MegaPlay
 */
class MegaPlayPlayer {
  constructor(options = {}) {
    this.containerId = options.containerId || 'megaplayer';
    this.container = document.getElementById(this.containerId);
    this.player = null;
    this.hlsInstance = null;
    
    if (!this.container) {
      throw new Error(`Container com ID "${this.containerId}" não encontrado`);
    }

    this.config = {
      autoplay: options.autoplay !== false,
      controls: options.controls !== false,
      preload: options.preload || 'metadata',
      muted: options.muted || false,
      ...options
    };

    this.init();
  }

  /**
   * Inicializa o player
   */
  init() {
    console.log('🎬 Inicializando MegaPlayPlayer...');
    
    // Verificar jQuery
    if (!checkJQuery()) {
      return;
    }

    // Obter informações do módulo
    getModuleInfo();

    // Criar elemento video
    this.createVideoElement();
    
    // Configurar listeners
    this.setupListeners();

    // Tentar carregar HLS.js se necessário
    this.setupHLS();

    console.log('✅ MegaPlayPlayer inicializado com sucesso');
  }

  /**
   * Cria o elemento video
   */
  createVideoElement() {
    const video = document.createElement('video');
    video.id = `${this.containerId}-video`;
    video.controls = this.config.controls;
    video.autoplay = this.config.autoplay;
    video.preload = this.config.preload;
    video.muted = this.config.muted;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    
    this.container.appendChild(video);
    this.player = video;
  }

  /**
   * Configura listeners de eventos
   */
  setupListeners() {
    if (!this.player) return;

    this.player.addEventListener('play', () => {
      console.log('▶️ Reprodução iniciada');
      this.onPlay?.();
    });

    this.player.addEventListener('pause', () => {
      console.log('⏸️ Pausado');
      this.onPause?.();
    });

    this.player.addEventListener('ended', () => {
      console.log('🏁 Reprodução finalizada');
      this.onEnded?.();
    });

    this.player.addEventListener('error', (e) => {
      console.error('❌ Erro na reprodução:', e);
      this.onError?.(e);
    });

    this.player.addEventListener('loadstart', () => {
      console.log('📥 Carregando conteúdo...');
    });

    this.player.addEventListener('canplay', () => {
      console.log('✅ Pronto para reproduzir');
    });
  }

  /**
   * Configura suporte HLS
   */
  setupHLS() {
    // Se o navegador suporta HLS nativo (Safari)
    if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('📱 Suporte HLS nativo detectado');
      return;
    }

    // Tentar carregar HLS.js dinamicamente
    import('https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js')
      .then((module) => {
        const Hls = module.default || module;
        if (Hls && Hls.isSupported()) {
          this.hlsInstance = new Hls({
            debug: false,
            fragLoadingMaxRetry: 12,
            fragLoadingRetryDelay: 1000,
            fragLoadingTimeOut: 20000,
            manifestLoadingMaxRetry: 12,
            manifestLoadingRetryDelay: 1000,
            manifestLoadingTimeOut: 20000,
          });
          console.log('✅ HLS.js carregado e configurado');
        }
      })
      .catch((err) => {
        console.warn('⚠️ HLS.js não disponível:', err.message);
      });
  }

  /**
   * Carrega uma URL de vídeo
   */
  load(url) {
    if (!this.player || !url) {
      console.error('❌ Player ou URL inválida');
      return;
    }

    console.log('📹 Carregando:', url);

    if (url.endsWith('.m3u8')) {
      // URL HLS
      if (this.hlsInstance) {
        this.hlsInstance.attachMedia(this.player);
        this.hlsInstance.loadSource(url);
      } else if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
        this.player.src = url;
      } else {
        console.error('❌ Navegador não suporta HLS');
      }
    } else {
      // URL de vídeo comum
      this.player.src = url;
    }
  }

  /**
   * Reproduz o vídeo
   */
  play() {
    this.player?.play().catch((err) => {
      console.error('❌ Erro ao reproduzir:', err);
    });
  }

  /**
   * Pausa a reprodução
   */
  pause() {
    this.player?.pause();
  }

  /**
   * Define o volume
   */
  setVolume(volume) {
    if (this.player) {
      this.player.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Define o tempo atual
   */
  setCurrentTime(time) {
    if (this.player) {
      this.player.currentTime = time;
    }
  }

  /**
   * Obtém a duração do vídeo
   */
  getDuration() {
    return this.player?.duration || 0;
  }

  /**
   * Destrói o player
   */
  destroy() {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }
    if (this.player) {
      this.player.remove();
      this.player = null;
    }
    console.log('🗑️ Player destruído');
  }
}

// ✅ Exportar para uso global
window.MegaPlayPlayer = MegaPlayPlayer;

// ✅ Exemplo de uso automático se houver elemento com id="megaplayer"
document.addEventListener('DOMContentLoaded', () => {
  const defaultContainer = document.getElementById('megaplayer');
  if (defaultContainer) {
    try {
      window.megaplayer = new MegaPlayPlayer();
      console.log('✅ MegaPlayPlayer inicializado automaticamente');
    } catch (error) {
      console.error('❌ Erro ao inicializar player:', error);
    }
  }
});

// ✅ Handlers opcionais
window.MegaPlayPlayer.prototype.onPlay = null;
window.MegaPlayPlayer.prototype.onPause = null;
window.MegaPlayPlayer.prototype.onEnded = null;
window.MegaPlayPlayer.prototype.onError = null;

console.log('✅ MegaPlay módulo carregado com sucesso!');
