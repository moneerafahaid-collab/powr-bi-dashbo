import { useState, useEffect } from 'react';

/** شاشة طولية (مثل 3م × 1م) — بدون شريط جانبي */
export type DisplayMode = 'signage' | 'desktop';

function getDisplayMode(): DisplayMode {
  const { innerWidth, innerHeight } = window;
  // طولي: الارتفاع أكبر من العرض (شاشة العرض الكبيرة)
  if (innerHeight > innerWidth) return 'signage';
  // مستطيل طولي ضيق حتى لو landscape بصرياً
  if (innerWidth / innerHeight < 0.85) return 'signage';
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
