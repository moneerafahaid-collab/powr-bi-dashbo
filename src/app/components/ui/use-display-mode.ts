import { useState, useEffect } from 'react';

/** mobile = جوال | signage = شاشة عرض طولية | desktop = سطح مكتب */
export type DisplayMode = 'mobile' | 'signage' | 'desktop';

const MOBILE_MAX = 768;
const FORCE_MODE_KEY = 'powr-display-mode';

/** شاشة العرض الفعلية: عرض 50سم × طول 80سم → نسبة 5:8 */
export const SIGNAGE_PHYSICAL = { widthCm: 50, heightCm: 80 } as const;
export const SIGNAGE_ASPECT = SIGNAGE_PHYSICAL.widthCm / SIGNAGE_PHYSICAL.heightCm; // 0.625
/** مرجع المعاينة على الكمبيوتر: 500×800 بكسل */
export const SIGNAGE_REF = { width: 500, height: 800 } as const;

function readForcedMode(): DisplayMode | null {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('mode') ?? params.get('display');
  if (fromUrl === 'signage' || fromUrl === 'kiosk') {
    try {
      localStorage.setItem(FORCE_MODE_KEY, 'signage');
    } catch {
      /* ignore */
    }
    return 'signage';
  }
  if (fromUrl === 'desktop') {
    try {
      localStorage.setItem(FORCE_MODE_KEY, 'desktop');
    } catch {
      /* ignore */
    }
    return 'desktop';
  }
  if (fromUrl === 'mobile') return 'mobile';

  try {
    const stored = localStorage.getItem(FORCE_MODE_KEY);
    if (stored === 'signage' || stored === 'desktop' || stored === 'mobile') return stored;
  } catch {
    /* ignore */
  }
  return null;
}

function getDisplayMode(): DisplayMode {
  const forced = readForcedMode();
  if (forced) return forced;

  const w = window.innerWidth;
  const h = window.innerHeight;

  if (w <= MOBILE_MAX) return 'mobile';
  /** أي شاشة طولية أو قريبة من 5:8 = وضع العرض */
  if (h > w || w / h < 0.92) return 'signage';
  return 'desktop';
}

/** معامل القياس لشاشة 50×80 — يوحّد المقاس بين الكمبيوتر والشاشة الفعلية */
export function getSignageScale(w = window.innerWidth, h = window.innerHeight): number {
  const byW = w / SIGNAGE_REF.width;
  const byH = h / SIGNAGE_REF.height;
  const raw = Math.min(byW, byH);
  return Math.min(Math.max(raw, 0.55), 1.4);
}

export function applySignageScale(): void {
  const scale = getSignageScale();
  const root = document.documentElement;
  root.style.setProperty('--signage-scale', String(scale));
  root.style.setProperty('--signage-vw', `${window.innerWidth * 0.01}px`);
  root.style.setProperty('--signage-vh', `${window.innerHeight * 0.01}px`);
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

/** كل شاشات العرض الطولية تستخدم مقاس 50×80 */
export function useSignageScaleEffect(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.removeProperty('--signage-scale');
      document.documentElement.style.removeProperty('--signage-vw');
      document.documentElement.style.removeProperty('--signage-vh');
      return;
    }
    applySignageScale();
    const update = () => applySignageScale();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      document.documentElement.style.removeProperty('--signage-scale');
      document.documentElement.style.removeProperty('--signage-vw');
      document.documentElement.style.removeProperty('--signage-vh');
    };
  }, [enabled]);
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
