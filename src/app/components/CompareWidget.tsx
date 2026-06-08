import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DGA } from '../styles/dga';
import type { CSSProperties } from 'react';
import { WidgetCircleLayout } from './WidgetCircleLayout';
import { CompareStrip } from './CompareStrip';

interface CompareWidgetProps {
  total: number;
  periodValue: number;
  periodLabel: string;
  compact?: boolean;
  horizontal?: boolean;
}

function CompareRing({
  total,
  periodValue,
  periodLabel,
  compact,
  showSubLabel = true
}: CompareWidgetProps & { showSubLabel?: boolean }) {
  const remainder = Math.max(total - periodValue, 0);
  const pct = total > 0 ? ((periodValue / total) * 100).toFixed(0) : '0';
  const slices = [
    { name: periodLabel, value: periodValue, color: DGA.sa[600] },
    { name: 'الباقي', value: remainder, color: DGA.gray[200] }
  ];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={slices} cx="50%" cy="50%" innerRadius="62%" outerRadius="88%" paddingAngle={1} dataKey="value" strokeWidth={0}>
            {slices.map((s, i) => (
              <Cell key={i} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="signage-ring-pct font-bold text-[#111927] tabular-nums">{pct}%</span>
        {showSubLabel && <span className="signage-ring-sub text-[#384250]">مقارنة</span>}
      </div>
    </div>
  );
}

export function CompareWidget({ total, periodValue, periodLabel, compact = false, horizontal = false }: CompareWidgetProps) {
  const ratio = total > 0 ? ((periodValue / total) * 100).toFixed(1) : '0';

  if (!horizontal) {
    return <CompareStrip total={total} periodValue={periodValue} periodLabel={periodLabel} compact={compact} />;
  }

  if (compact) {
    return (
      <div className="signage-indicator-stack signage-compare-stack">
        <div className="signage-indicator-stack__ring">
          <CompareRing
            total={total}
            periodValue={periodValue}
            periodLabel={periodLabel}
            compact={compact}
            showSubLabel={false}
          />
        </div>
        <p className="signage-indicator-stack__caption">نسبة {periodLabel} من الإجمالي</p>
      </div>
    );
  }

  return (
    <WidgetCircleLayout
      compact={compact}
      circle={<CompareRing total={total} periodValue={periodValue} periodLabel={periodLabel} compact={compact} />}
    >
      {!compact && <p className="signage-stat-value font-bold text-[#111927] tabular-nums">{ratio}%</p>}
      <p className="signage-stat-heading">نسبة {periodLabel} من الإجمالي</p>
      {!compact && (
        <div className="space-y-1 mt-1 compare-widget-bars">
          {[
            { label: 'الإجمالي', value: total, color: DGA.info[700], track: DGA.info[50] },
            { label: periodLabel, value: periodValue, color: DGA.sa[600], track: DGA.sa[50] }
          ].map((row) => {
            const barPct = (row.value / Math.max(total, periodValue, 1)) * 100;
            return (
              <div key={row.label} className="flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 text-[7px] font-semibold text-[#384250] w-10 text-right">{row.label}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: row.track }}>
                  <div className="h-full rounded-full compare-bar-fill" style={{ '--bar-pct': `${barPct}%`, backgroundColor: row.color } as CSSProperties} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCircleLayout>
  );
}
