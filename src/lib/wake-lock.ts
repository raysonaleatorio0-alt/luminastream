/**
 * Utilitário seguro para gerenciar Screen Wake Lock com proteção contra Permissions Policy
 * Útil para manter a tela ligada durante reprodução de vídeo
 */

let wakeLock: any = null;

/**
 * Tenta adquirir Screen Wake Lock de forma segura
 * Se a Permissions Policy bloquear, falha graciosamente
 */
export async function requestWakeLock(): Promise<boolean> {
  try {
    // Verificar se a API está disponível no navegador
    if (!("wakeLock" in navigator)) {
      console.warn("[WakeLock] API não suportada neste navegador");
      return false;
    }

    // Tentar adquirir o lock
    wakeLock = await (navigator as any).wakeLock.request("screen");
    console.log("[WakeLock] Screen Wake Lock adquirido com sucesso");

    // Listener para quando o lock é liberado (ex: usuário alterna abas)
    wakeLock.addEventListener("release", () => {
      console.log("[WakeLock] Screen Wake Lock foi liberado");
    });

    return true;
  } catch (err: any) {
    console.warn("[WakeLock] Erro ao adquirir Screen Wake Lock:", err.message);
    // Falhas comuns:
    // - NotSupportedError: API não suportada
    // - NotAllowedError: Permissions Policy bloqueia o recurso
    // - InvalidStateError: Document não está visível
    return false;
  }
}

/**
 * Libera o Screen Wake Lock
 */
export async function releaseWakeLock(): Promise<void> {
  try {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
      console.log("[WakeLock] Screen Wake Lock liberado");
    }
  } catch (err) {
    console.warn("[WakeLock] Erro ao liberar Screen Wake Lock:", err);
  }
}

/**
 * Re-adquire o Wake Lock quando o documento fica visível novamente
 */
export function setupWakeLockReacquisition(): void {
  try {
    if (!("wakeLock" in navigator)) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !wakeLock) {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
  } catch (err) {
    console.warn("[WakeLock] Erro ao configurar re-aquisição:", err);
  }
}
