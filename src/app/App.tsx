import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PowerBIPage } from './components/PowerBIPage';
import { pagesData, ROTATION_INTERVAL_MS, PERIOD_META } from './data/simpleData';
import { useDisplayMode, isSignageMode, isCompactView, useSignageScaleEffect } from './components/ui/use-display-mode';
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
  const isSignage = isSignageMode(displayMode);
  const isMobile = displayMode === 'mobile';
  const isCompact = isCompactView(displayMode);
  useSignageScaleEffect(isSignage);
  useAutoFullscreen(isSignage);

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(ROTATION_INTERVAL_MS / 1000);
  const [currentTime, setCurrentTime] = useState(new Date());
  const totalPages = pagesData.length;
  const current = pagesData[currentPage];

  useEffect(() => {
    document.documentElement.classList.toggle('signage-mode', isSignage);
    document.documentElement.classList.toggle('mobile-mode', isMobile);
    return () => {
      document.documentElement.classList.remove('signage-mode', 'mobile-mode');
    };
  }, [isSignage, isMobile]);

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
        isCompact ? 'h-[100dvh] w-[100dvw] bg-[#F9FAFB]' : 'h-screen w-screen bg-[#F9FAFB]'
      }`}
      dir="rtl"
    >
      {/* Header */}
      <header
        className={`shrink-0 border-b-[3px] border-[#1B8354] ${
          isSignage ? 'signage-header px-1 py-1' : isCompact ? 'px-3 py-2' : 'px-6 py-4'
        }`}
        style={{ background: 'var(--dga-header-gradient)' }}
      >
        {isSignage ? (
          <div className="signage-tall-header flex items-center gap-2 min-h-0">
            <HeaderBrand variant="signage-tall" />
            <div className="flex-1 min-w-0 text-center px-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <span className="signage-header-meta text-white/70">{current.category}</span>
                    <span className="signage-header-badge font-semibold px-1.5 py-px bg-[#1B8354] text-white rounded">
                      {PERIOD_META[current.period].label}
                    </span>
                  </div>
                  <h2 className="signage-header-title text-white font-bold leading-tight">{current.pageName}</h2>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="signage-header-clock text-left shrink-0 border border-white/25 px-1.5 py-0.5 bg-white/10 rounded-md">
              <p className="text-white/80 font-medium leading-tight">{dateStr}</p>
              <p className="text-white font-semibold tabular-nums flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-[#DFF6E7]" />
                {timeStr}
              </p>
            </div>
          </div>
        ) : isCompact ? (
          <div className={`flex flex-col ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
            <div className="flex items-start justify-between gap-2">
              <HeaderBrand variant="signage" />
              <div className={`text-left shrink-0 border border-white/25 bg-white/10 rounded-lg ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'}`}>
                <p className={`text-white/80 font-medium ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>{dateStr}</p>
                <p className={`text-white font-semibold tabular-nums flex items-center gap-1 justify-end ${isMobile ? 'text-sm' : 'text-base'}`}>
                  <Clock className={`text-[#DFF6E7] ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
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
                className="border-t border-white/15 pt-1.5 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className={`text-white/60 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{current.category}</span>
                  <span className="text-[9px] font-semibold px-1.5 py-px bg-[#1B8354] text-white rounded">
                    {PERIOD_META[current.period].label}
                  </span>
                </div>
                <h2 className={`text-white font-bold leading-snug ${isMobile ? 'text-sm' : 'text-base'}`}>{current.pageName}</h2>
              </motion.div>
            </AnimatePresence>

            {!isMobile && (
              <div className="flex items-center justify-center gap-1 pt-0.5">
                {pagesData.map((_, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 ${
                      index === currentPage ? 'bg-[#DFF6E7] w-7 h-1.5' : 'bg-white/30 w-1.5 h-1.5'
                    }`}
                  />
                ))}
                <span className="text-white/50 text-[10px] mr-2 tabular-nums">{currentPage + 1}/{totalPages}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <HeaderBrand variant="desktop" />
            <div className="flex-1 mx-8 text-center">
              <AnimatePresence mode="wait">
                <motion.div key={currentPage} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <span className="text-white/60 text-xs">{current.category}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#1B8354] text-white rounded">{PERIOD_META[current.period].label}</span>
                  </div>
                  <h2 className="text-white text-lg font-bold">{current.pageName}</h2>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="text-left hidden lg:block">
                <p className="font-semibold text-sm">{dateStr}</p>
              </div>
              <div className="border border-white/25 px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#DFF6E7]" />
                <span className="text-white font-mono font-bold text-lg tabular-nums">{timeStr}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!isCompact && (
          <aside className="w-64 shrink-0 bg-white border-l border-[#D2D6DB] flex flex-col">
            <div className="px-4 py-3 border-b border-[#D2D6DB] bg-[#FCFCFD]">
              <p className="text-xs font-semibold text-[#384250]">المؤشرات ({totalPages})</p>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {pagesData.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => goToPage(index)}
                  className={`w-full text-right px-3 py-2.5 transition-all duration-200 flex items-start gap-2.5 border-r-[3px] rounded-l-sm ${
                    index === currentPage
                      ? 'bg-[#EFF8FF] text-[#111927] border-[#1B8354]'
                      : 'text-[#384250] hover:bg-[#F9FAFB] border-transparent'
                  }`}
                >
                  <span className={`shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 rounded ${
                    index === currentPage ? 'bg-[#1B8354] text-white' : 'bg-[#F3F4F6] text-[#6C737F]'
                  }`}>
                    {page.id}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium leading-snug truncate ${index === currentPage ? 'text-[#111927]' : 'text-[#384250]'}`}>{page.pageName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#6C737F]">{page.category}</span>
                      <span className="text-[9px] font-semibold px-1.5 py-px bg-[#1B8354] text-white rounded">{PERIOD_META[page.period].short}</span>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        )}

        <main className={`flex-1 min-w-0 ${isMobile ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={isMobile ? 'min-h-0' : 'h-full min-h-0'}
            >
              <PowerBIPage data={current} mode={displayMode} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className={`shrink-0 bg-white border-t border-[#D2D6DB] ${isSignage ? 'signage-footer px-1 py-1' : isCompact ? 'px-3 py-2' : 'px-6 py-3'}`}>
        {isCompact ? (
          <div className="flex items-center gap-2">
            {isSignage ? (
              <span className="text-[8px] text-[#6C737F] shrink-0">أمانة حائل</span>
            ) : !isMobile ? (
              <span className="text-[10px] text-[#6C737F] shrink-0 hidden sm:inline">
                لوحة استعراض للزوار — أمانة منطقة حائل
              </span>
            ) : null}
            {isMobile && (
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={goToPrevious} className="p-1.5 text-[#384250] rounded-lg" aria-label="السابق"><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => setIsPaused((p) => !p)} className="p-1.5 bg-[#1B8354] text-white rounded-lg" aria-label={isPaused ? 'تشغيل' : 'إيقاف'}>
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button onClick={goToNext} className="p-1.5 text-[#384250] rounded-lg" aria-label="التالي"><ChevronLeft className="w-4 h-4" /></button>
              </div>
            )}
            <span className="text-[10px] text-[#1B8354] font-semibold shrink-0">
              {isPaused ? '■ متوقف' : '▶ تلقائي'}
            </span>
            <div className="flex-1 h-1.5 bg-[#E5E7EB] overflow-hidden rounded-full">
              <div className="h-full bg-[#1B8354] transition-all duration-1000 ease-linear rounded-full" style={{ width: isPaused ? '0%' : `${progress}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-[#384250] tabular-nums shrink-0">
              {isSignage
                ? `${currentPage + 1}/${totalPages} · ${isPaused ? '—' : `${countdown}ث`}`
                : isMobile
                  ? `${currentPage + 1}/${totalPages}${isPaused ? '' : ` · ${countdown}ث`}`
                  : isPaused ? '—' : `${countdown}ث`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button onClick={goToPrevious} className="p-2 hover:bg-[#F3F4F6] text-[#384250] hover:text-[#1570EF] transition-colors rounded-lg" aria-label="السابق"><ChevronRight className="w-5 h-5" /></button>
              <button onClick={() => setIsPaused((p) => !p)} className="p-2.5 bg-[#1B8354] text-white hover:bg-[#166A45] transition-colors rounded-lg" aria-label={isPaused ? 'تشغيل' : 'إيقاف'}>
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button onClick={goToNext} className="p-2 hover:bg-[#F3F4F6] text-[#384250] hover:text-[#1570EF] transition-colors rounded-lg" aria-label="التالي"><ChevronLeft className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-2 bg-[#E5E7EB] overflow-hidden rounded-full">
                <div className="h-full bg-[#1B8354] transition-all duration-1000 ease-linear rounded-full" style={{ width: isPaused ? '0%' : `${progress}%` }} />
              </div>
              <span className="text-sm font-semibold text-[#384250] tabular-nums w-8 text-center">{isPaused ? '—' : countdown}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {pagesData.map((_, index) => (
                  <button key={index} onClick={() => goToPage(index)} className={`transition-all duration-300 rounded-full ${index === currentPage ? 'bg-[#1B8354] w-6 h-1.5' : 'bg-[#D2D6DB] hover:bg-[#9DA4AE] w-2 h-2'}`} aria-label={`صفحة ${index + 1}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#384250] tabular-nums min-w-[3rem] text-center">{currentPage + 1}/{totalPages}</span>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
