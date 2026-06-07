import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PowerBIPage } from './components/PowerBIPage';
import { pagesData, ROTATION_INTERVAL_MS, PERIOD_META } from './data/simpleData';
import { useDisplayMode } from './components/ui/use-display-mode';
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

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(ROTATION_INTERVAL_MS / 1000);
  const [currentTime, setCurrentTime] = useState(new Date());
  const totalPages = pagesData.length;
  const current = pagesData[currentPage];

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

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#eef2f7] flex flex-col" dir="rtl">
      {/* Header */}
      <header className={`shrink-0 bg-gradient-to-l from-[#0a3d7a] via-[#0d47a1] to-[#1565c0] shadow-lg ${isSignage ? 'px-4 py-3' : 'px-6 py-4'}`}>
        {isSignage ? (
          <div className="flex flex-col items-center text-center gap-2">
            <HeaderBrand variant="signage" />
            <p className="text-white/50 text-[10px]">
              {currentTime.toLocaleDateString('ar-SA', { timeZone: 'Asia/Riyadh', weekday: 'long', day: 'numeric', month: 'long' })}
              {' · '}
              {currentTime.toLocaleTimeString('ar-SA', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit' })}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-white/60 text-xs">{current.category}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: PERIOD_META[current.period].color }}
                  >
                    {PERIOD_META[current.period].label}
                  </span>
                </div>
                <h2 className="text-white text-xl font-bold leading-snug px-2">{current.pageName}</h2>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-1.5">
              {pagesData.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentPage ? 'bg-white w-8 h-2' : 'bg-white/30 w-2 h-2'
                  }`}
                />
              ))}
              <span className="text-white/60 text-xs mr-2 tabular-nums">{currentPage + 1}/{totalPages}</span>
            </div>
          </div>
        ) : (
          /* ── تخطيط الكمبيوتر ── */
          <div className="flex items-center justify-between">
            <HeaderBrand variant="desktop" />

            <div className="flex-1 mx-8 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <span className="text-white/60 text-xs">{current.category}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: PERIOD_META[current.period].color }}
                    >
                      {PERIOD_META[current.period].label}
                    </span>
                  </div>
                  <h2 className="text-white text-lg font-bold">{current.pageName}</h2>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="text-left hidden lg:block">
                <p className="font-semibold text-sm">
                  {currentTime.toLocaleDateString('ar-SA', { timeZone: 'Asia/Riyadh', weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/80" />
                <span className="text-white font-mono font-bold text-lg tabular-nums">
                  {currentTime.toLocaleTimeString('ar-SA', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* الشريط الجانبي — يظهر على الكمبيوتر فقط */}
        {!isSignage && (
          <aside className="w-64 shrink-0 bg-white border-l border-slate-200 flex flex-col shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">المؤشرات ({totalPages})</p>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {pagesData.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => goToPage(index)}
                  className={`w-full text-right px-3 py-2.5 rounded-lg transition-all duration-200 flex items-start gap-2.5 group ${
                    index === currentPage
                      ? 'bg-[#0d47a1] text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 ${
                    index === currentPage ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {page.id}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium leading-snug truncate ${index === currentPage ? 'text-white' : 'text-slate-700'}`}>
                      {page.pageName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] ${index === currentPage ? 'text-white/60' : 'text-slate-400'}`}>
                        {page.category}
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-px rounded text-white"
                        style={{ backgroundColor: index === currentPage ? 'rgba(255,255,255,0.25)' : PERIOD_META[page.period].color }}
                      >
                        {PERIOD_META[page.period].short}
                      </span>
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
              initial={{ opacity: 0, x: isSignage ? 0 : 30, y: isSignage ? 20 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: isSignage ? 0 : -30, y: isSignage ? -20 : 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="h-full"
            >
              <PowerBIPage data={current} mode={displayMode} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className={`shrink-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] ${isSignage ? 'px-5 py-4' : 'px-6 py-3'}`}>
        {isSignage ? (
          /* شاشة العرض: شريط تقدم فقط */
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                {!isPaused && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                {isPaused ? 'متوقف' : 'تشغيل تلقائي'}
              </span>
              <span className="text-sm font-mono font-bold text-slate-600 tabular-nums">
                {isPaused ? '—' : `${countdown} ث`}
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-[#0d47a1] to-[#42a5f5] rounded-full transition-all duration-1000 ease-linear"
                style={{ width: isPaused ? '0%' : `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* الكمبيوتر: تحكم كامل */
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button onClick={goToPrevious} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#0d47a1] transition-colors" aria-label="السابق">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={() => setIsPaused((p) => !p)} className="p-2.5 rounded-lg bg-[#0d47a1] text-white hover:bg-[#1565c0] transition-colors shadow-sm" aria-label={isPaused ? 'تشغيل' : 'إيقاف'}>
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button onClick={goToNext} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#0d47a1] transition-colors" aria-label="التالي">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-[#0d47a1] to-[#42a5f5] rounded-full transition-all duration-1000 ease-linear" style={{ width: isPaused ? '0%' : `${progress}%` }} />
              </div>
              <span className="text-sm font-mono font-semibold text-slate-600 tabular-nums w-8 text-center">{isPaused ? '—' : countdown}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {pagesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`rounded-full transition-all duration-300 ${index === currentPage ? 'bg-[#0d47a1] w-6 h-2' : 'bg-slate-300 hover:bg-slate-400 w-2 h-2'}`}
                    aria-label={`صفحة ${index + 1}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700 tabular-nums min-w-[3rem] text-center">{currentPage + 1}/{totalPages}</span>
              {!isPaused && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  تشغيل تلقائي
                </span>
              )}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
