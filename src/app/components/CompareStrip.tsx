import type { CSSProperties } from 'react';
import { DGA } from '../styles/dga';

interface CompareStripProps {
  total: number;
  periodValue: number;
  periodLabel: string;
  compact?: boolean;
  display?: boolean;
}

function formatNumber(n: number) {
  return n.toLocaleString('ar-SA');
}

export function CompareStrip({ total, periodValue, periodLabel, compact = false, display = false }: CompareStripProps) {
  const max = Math.max(total, periodValue, 1);

  const rows = [
    { label: 'الإجمالي', value: total, pct: (total / max) * 100, color: DGA.info[700], track: DGA.info[50] },
    { label: periodLabel, value: periodValue, pct: (periodValue / max) * 100, color: DGA.sa[600], track: DGA.sa[50] }
  ];

  const barH = display ? 'h-2' : compact ? 'h-2' : 'h-2.5';
  const labelW = display ? 'w-12' : 'w-12';

  return (
    <div className={display ? 'space-y-1' : compact ? 'space-y-1.5' : 'space-y-2'}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 font-semibold text-[#384250] ${labelW} text-right ${display ? 'text-[9px]' : compact ? 'text-[9px]' : 'text-[10px]'}`}>
            {row.label}
          </span>
          <div
            className={`flex-1 min-w-0 ${barH} rounded-full overflow-hidden`}
            style={{ backgroundColor: row.track }}
          >
            <div
              className="h-full rounded-full compare-bar-fill"
              style={{ '--bar-pct': `${row.pct}%`, backgroundColor: row.color } as CSSProperties}
            />
          </div>
          <span className={`shrink-0 font-bold tabular-nums text-[#111927] text-left ${display ? 'text-[10px] w-14' : compact ? 'text-[10px] w-14' : 'text-xs w-14'}`}>
            {formatNumber(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
