import { useState, useEffect } from 'react';

/** ارتفاع مخطط اتجاه الأداء — نسبة من ارتفاع الشاشة */
export function useSignageChartHeight(ratio = 0.24, minPx = 110): number {
  const calc = () => Math.round(Math.max(window.innerHeight * ratio, minPx));

  const [height, setHeight] = useState(calc);

  useEffect(() => {
    const update = () => setHeight(calc());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [ratio, minPx]);

  return height;
}
