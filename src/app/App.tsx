import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PowerBIPage } from './components/PowerBIPage';
import { pagesData, ROTATION_INTERVAL_MS, PERIOD_META } from './data/simpleData';
import { useDisplayMode } from './components/ui/use-display-mode';
import { useAutoFullscreen } from './components/ui/use-auto-fullscreen';
import { HeaderBrand } from './components/HeaderBrand';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Clock
} from 'lucide-react';

export default function App() {
  const displayMode = useDisplayMode();
  const isSignage = displayMode === 'signage';
  useAutoFullscreen(isSignage);

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(ROTATION_INTERVAL_MS / 1000);
  const [currentTime, setCurrentTime] = useState(new Date());
  const totalPages = pagesData.length;
  const current = pagesData[currentPage];

  useEffect(() => {
    document.documentElement.classList.toggle('signage-mode', isSignage);
    return () => document.documentElement.classList.remove('signage-mode');
  }, [isSignage]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    setCountdown(ROTATION_INTERVAL_MS / 1000);
    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentPage((p) => (p + 1) % totalPages);
          return ROTATION_INTERVAL_MS / 1000;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [isPaused, currentPage, totalPages]);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setCountdown(ROTATION_INTERVAL_MS / 1000);
  }, [totalPages]);

  const goToPrevious = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setCountdown(ROTATION_INTERVAL_MS / 1000);
  }, [totalPages]);

  const goToPage = useCallback((index: number) => {
    setCurrentPage(index);
    setCountdown(ROTATION_INTERVAL_MS / 1000);
  }, []);

  const progress = ((ROTATION_INTERVAL_MS / 1000 - countdown) / (ROTATION_INTERVAL_MS / 1000)) * 100;
  const dateStr = currentTime.toLocaleDateString('ar-SA', { timeZone: 'Asia/Riyadh', weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = currentTime.toLocaleTimeString('ar-SA', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`fixed inset-0 flex flex-col overflow-hidden ${
        isSignage ? 'h-[100dvh] w-[100dvw] bg-[#e8ecf1]' : 'h-screen w-screen bg-[#eef2f7]'
      }`}
      dir="rtl"
    >
      {/* Header */}
      <header
        className={`shrink-0 bg-[#0a3d6e] border-b-[3px] border-[#c4a052] ${
          isSignage ? 'px-4 py-3' : 'px-6 py-4 shadow-md'
        }`}
      >
        {isSignage ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <HeaderBrand variant="signage" />
              <div className="text-left shrink-0 border border-white/20 px-3 py-1.5 bg-white/5">
                <p className="text-white/70 text-[10px]">{dateStr}</p>
                <p className="text-white font-mono font-bold text-base tabular-nums flex items-center gap-1.5 justify-end">
                  <Clock className="w-3.5 h-3.5 text-[#c4a052]" />
                  {timeStr}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/15 pt-2 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-white/60 text-xs">{current.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#00635b] text-white">
                    {PERIOD_META[current.period].label}
                  </span>
                </div>
                <h2 className="text-white text-lg font-bold leading-snug">{current.pageName}</h2>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-1 pt-0.5">
              {pagesData.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 ${
                    index === currentPage ? 'bg-[#c4a052] w-7 h-1.5' : 'bg-white/25 w-1.5 h-1.5'
                  }`}
                />
              ))}
              <span className="text-white/50 text-[10px] mr-2 tabular-nums">{currentPage + 1}/{totalPages}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <HeaderBrand variant="desktop" />
            <div className="flex-1 mx-8 text-center">
              <AnimatePresence mode="wait">
                <motion.div key={currentPage} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <span className="text-white/60 text-xs">{current.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#00635b] text-white">{PERIOD_META[current.period].label}</span>
                  </div>
                  <h2 className="text-white text-lg font-bold">{current.pageName}</h2>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="text-left hidden lg:block">
                <p className="font-semibold text-sm">{dateStr}</p>
              </div>
              <div className="border border-white/20 px-4 py-2 bg-white/5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c4a052]" />
                <span className="text-white font-mono font-bold text-lg tabular-nums">{timeStr}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!isSignage && (
          <aside className="w-64 shrink-0 bg-white border-l border-slate-200 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 bg-[#f8fafc]">
              <p className="text-xs font-bold text-[#0a3d6e]">المؤشرات ({totalPages})</p>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {pagesData.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => goToPage(index)}
                  className={`w-full text-right px-3 py-2.5 transition-all duration-200 flex items-start gap-2.5 border-r-2 ${
                    index === currentPage
                      ? 'bg-[#0a3d6e] text-white border-[#c4a052]'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <span className={`shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 ${
                    index === currentPage ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {page.id}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium leading-snug truncate ${index === currentPage ? 'text-white' : 'text-slate-700'}`}>{page.pageName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] ${index === currentPage ? 'text-white/60' : 'text-slate-400'}`}>{page.category}</span>
                      <span className="text-[9px] font-bold px-1.5 py-px bg-[#00635b] text-white">{PERIOD_META[page.period].short}</span>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        )}

        <main className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <PowerBIPage data={current} mode={displayMode} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className={`shrink-0 bg-white border-t-2 border-[#0a3d6e] ${isSignage ? 'px-4 py-2.5' : 'px-6 py-3'}`}>
        {isSignage ? (
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#00635b] font-bold shrink-0">
              {isPaused ? '■ متوقف' : '▶ تشغيل تلقائي'}
            </span>
            <div className="flex-1 h-2 bg-slate-200 overflow-hidden">
              <div className="h-full bg-[#0a3d6e] transition-all duration-1000 ease-linear" style={{ width: isPaused ? '0%' : `${progress}%` }} />
            </div>
            <span className="text-xs font-mono font-bold text-[#0a3d6e] tabular-nums shrink-0">{isPaused ? '—' : `${countdown}ث`}</span>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button onClick={goToPrevious} className="p-2 hover:bg-slate-100 text-slate-600 hover:text-[#0a3d6e] transition-colors" aria-label="السابق"><ChevronRight className="w-5 h-5" /></button>
              <button onClick={() => setIsPaused((p) => !p)} className="p-2.5 bg-[#0a3d6e] text-white hover:bg-[#0d47a1] transition-colors" aria-label={isPaused ? 'تشغيل' : 'إيقاف'}>
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button onClick={goToNext} className="p-2 hover:bg-slate-100 text-slate-600 hover:text-[#0a3d6e] transition-colors" aria-label="التالي"><ChevronLeft className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-200 overflow-hidden">
                <div className="h-full bg-[#0a3d6e] transition-all duration-1000 ease-linear" style={{ width: isPaused ? '0%' : `${progress}%` }} />
              </div>
              <span className="text-sm font-mono font-semibold text-slate-600 tabular-nums w-8 text-center">{isPaused ? '—' : countdown}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {pagesData.map((_, index) => (
                  <button key={index} onClick={() => goToPage(index)} className={`transition-all duration-300 ${index === currentPage ? 'bg-[#0a3d6e] w-6 h-1.5' : 'bg-slate-300 hover:bg-slate-400 w-2 h-2'}`} aria-label={`صفحة ${index + 1}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700 tabular-nums min-w-[3rem] text-center">{currentPage + 1}/{totalPages}</span>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
