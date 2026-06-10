import React, { useEffect, useRef } from 'react';

/**
 * Componente React para carregar megaplay.js como módulo
 * 
 * Uso:
 * <MegaPlayComponent videoUrl="https://..." />
 */
export default function MegaPlayComponent({ videoUrl, autoplay = false, controls = true }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Verificar se jQuery está disponível
    if (typeof window !== 'undefined') {
      // Adicionar jQuery se não existir
      if (typeof $ === 'undefined') {
        console.warn('⚠️ jQuery não encontrado. Carregando...');
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        script.integrity = 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ=';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = () => {
          loadMegaPlay();
        };
      } else {
        loadMegaPlay();
      }
    }

    function loadMegaPlay() {
      // Verificar se MegaPlayPlayer já foi carregado
      if (typeof window !== 'undefined' && !window.MegaPlayPlayer) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/js/megaplay.js';
        document.body.appendChild(script);

        script.onload = () => {
          initializePlayer();
        };
      } else {
        initializePlayer();
      }
    }

    function initializePlayer() {
      const MegaPlayPlayer = (window as any).MegaPlayPlayer;
      if (!MegaPlayPlayer) {
        console.error('❌ MegaPlayPlayer não disponível');
        return;
      }

      try {
        const player = new MegaPlayPlayer({
          containerId: 'megaplayer-react',
          autoplay,
          controls,
        });

        if (videoUrl) {
          player.load(videoUrl);
        }

        // Guardar referência para cleanup
        (window as any).megaplayInstance = player;
      } catch (error) {
        console.error('❌ Erro ao inicializar player:', error);
      }
    }

    return () => {
      // Cleanup
      const player = (window as any).megaplayInstance;
      if (player) {
        player.destroy?.();
      }
    };
  }, [videoUrl, autoplay, controls]);

  return (
    <div
      ref={containerRef}
      id="megaplayer-react"
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
