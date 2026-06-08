import { useState, useEffect } from 'react';

/** mobile = جوال | signage = شاشة عرض طولية | desktop = سطح مكتب */
export type DisplayMode = 'mobile' | 'signage' | 'desktop';

const MOBILE_MAX = 768;

/** شاشة العرض الفعلية: عرض 50سم × طول 80سم → نسبة 5:8 */
export const SIGNAGE_PHYSICAL = { widthCm: 50, heightCm: 80 } as const;
export const SIGNAGE_ASPECT = SIGNAGE_PHYSICAL.widthCm / SIGNAGE_PHYSICAL.heightCm; // 0.625

const TALL_ASPECT_MIN = 0.52;
const TALL_ASPECT_MAX = 0.68;

function getDisplayMode(): DisplayMode {
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (w <= MOBILE_MAX) return 'mobile';
  if (h > w || w / h < 0.85) return 'signage';
  return 'desktop';
}

export function isTallSignageViewport(w = window.innerWidth, h = window.innerHeight): boolean {
  if (w <= MOBILE_MAX) return false;
  const ratio = w / h;
  return ratio >= TALL_ASPECT_MIN && ratio <= TALL_ASPECT_MAX;
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

export function useSignageTall(): boolean {
  const [tall, setTall] = useState(isTallSignageViewport);

  useEffect(() => {
    const update = () => setTall(isTallSignageViewport());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return tall;
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
