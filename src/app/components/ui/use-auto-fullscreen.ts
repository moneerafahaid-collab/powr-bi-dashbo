import { useEffect, useCallback } from 'react';

export function useAutoFullscreen(enabled: boolean) {
  const enterFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (document.fullscreenElement) return;
    el.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(enterFullscreen, 800);
    const onInteract = () => {
      enterFullscreen();
      document.removeEventListener('click', onInteract);
      document.removeEventListener('keydown', onInteract);
    };

    document.addEventListener('click', onInteract);
    document.addEventListener('keydown', onInteract);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', onInteract);
      document.removeEventListener('keydown', onInteract);
    };
  }, [enabled, enterFullscreen]);
}
