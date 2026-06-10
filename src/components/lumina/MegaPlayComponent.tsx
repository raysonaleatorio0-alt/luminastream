import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

/**
 * Componente React para carregar megaplay.js como módulo
 * 
 * Estratégia:
 * 1. jQuery carrega com strategy="beforeInteractive" (máxima prioridade)
 * 2. jQuery onLoad callback cria uma função global de inicialização
 * 3. megaplay.js carrega e registra MegaPlayPlayer no window
 * 4. Componente inicializa player com a URL do vídeo no useEffect
 * 
 * Uso:
 * <MegaPlayComponent videoUrl="https://..." />
 */
export default function MegaPlayComponent({ videoUrl, autoplay = false, controls = true }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // Inicializa o player quando jQuery + megaplay.js estão prontos
  function initializePlayer() {
    if (typeof window === 'undefined') return;

    // Aguardar jQuery estar disponível
    const waitForJQuery = setInterval(() => {
      if (typeof (window as any).$ === 'undefined') {
        console.log('⏳ Aguardando jQuery...');
        return;
      }

      clearInterval(waitForJQuery);
      console.log('✅ jQuery detectado');

      // Aguardar MegaPlayPlayer estar disponível
      const waitForPlayer = setInterval(() => {
        const MegaPlayPlayer = (window as any).MegaPlayPlayer;
        if (!MegaPlayPlayer) {
          console.log('⏳ Aguardando MegaPlayPlayer...');
          return;
        }

        clearInterval(waitForPlayer);
        console.log('✅ MegaPlayPlayer detectado');

        if (!containerRef.current) {
          console.error('❌ Container não encontrado');
          return;
        }

        try {
          const player = new MegaPlayPlayer({
            containerId: 'megaplayer-react',
            autoplay,
            controls,
          });

          playerRef.current = player;
          console.log('✅ MegaPlayPlayer instância criada');

          // Carregar URL do vídeo
          if (videoUrl) {
            console.log('📹 Carregando vídeo:', videoUrl);
            player.load(videoUrl);
          } else {
            console.warn('⚠️ Nenhuma videoUrl fornecida');
          }

          (window as any).megaplayInstance = player;
        } catch (error) {
          console.error('❌ Erro ao inicializar player:', error);
        }
      }, 100);
    }, 100);
  }

  useEffect(() => {
    // Inicializar player quando o componente monta
    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
      }
    };
  }, [videoUrl, autoplay, controls]);

  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="beforeInteractive"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYQABXQ="
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('✅ jQuery script onLoad disparado');
        }}
      />
      <Script
        src="/js/megaplay.js"
        strategy="afterInteractive"
        type="module"
        onLoad={() => {
          console.log('✅ megaplay.js script onLoad disparado');
          // Dar um pequeno tempo para o módulo ser executado
          setTimeout(() => {
            if (typeof (window as any).MegaPlayPlayer !== 'undefined') {
              console.log('✅ MegaPlayPlayer registrado no window');
            }
          }, 100);
        }}
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
