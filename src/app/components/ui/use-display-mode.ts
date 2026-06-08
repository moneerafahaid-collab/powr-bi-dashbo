import { useState, useEffect } from 'react';

/** mobile = جوال | signage = شاشة عرض طولية | desktop = سطح مكتب */
export type DisplayMode = 'mobile' | 'signage' | 'desktop';

const MOBILE_MAX = 768;

function getDisplayMode(): DisplayMode {
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (w <= MOBILE_MAX) return 'mobile';
  if (h > w || w / h < 0.85) return 'signage';
  return 'desktop';
}

export function useDisplayMode(): DisplayMode {
  const [mode, setMode] = useState<DisplayMode>(getDisplayMode);

  useEffect(() => {
    const update = () => setMode(getDisplayMode());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return mode;
}

export function isMobileMode(mode: DisplayMode) {
  return mode === 'mobile';
}

export function isSignageMode(mode: DisplayMode) {
  return mode === 'signage';
}

export function isCompactView(mode: DisplayMode) {
  return mode === 'mobile' || mode === 'signage';
}
