import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

/**
 * Componente React para carregar megaplay.js como módulo
 * 
 * Uso:
 * <MegaPlayComponent videoUrl="https://..." />
 */
export default function MegaPlayComponent({ videoUrl, autoplay = false, controls = true }) {
  const containerRef = useRef<HTMLDivElement>(null);

  function initializePlayer() {
    if (typeof window === 'undefined' || !containerRef.current) return;

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

      (window as any).megaplayInstance = player;
    } catch (error) {
      console.error('❌ Erro ao inicializar player:', error);
    }
  }

  useEffect(() => {
    return () => {
      const player = (window as any).megaplayInstance;
      if (player) {
        player.destroy?.();
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="beforeInteractive"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ="
        crossOrigin="anonymous"
      />
      <Script
        src="/js/megaplay.js"
        strategy="afterInteractive"
        type="module"
        onLoad={initializePlayer}
      />
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
    </>
  );
}
