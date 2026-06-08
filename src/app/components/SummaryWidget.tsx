import type { CSSProperties } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DGA } from '../styles/dga';
import { WidgetCircleLayout } from './WidgetCircleLayout';

interface SummaryWidgetProps {
  total: number;
  periodValue: number;
  periodLabel: string;
  target?: number;
  growth?: number;
  compact?: boolean;
  horizontal?: boolean;
}

function formatNumber(n: number) {
  return n.toLocaleString('ar-SA');
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(0)}K`;
  return formatNumber(n);
}

function ProgressRing({ pct, compact }: { pct: number; compact?: boolean }) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  const data = [
    { value: clamped, color: DGA.sa[600] },
    { value: 100 - clamped, color: DGA.gray[200] }
  ];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius="62%" outerRadius="88%" startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
            {data.map((s, i) => (
              <Cell key={i} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="signage-ring-pct font-bold text-[#111927] tabular-nums">{clamped.toFixed(0)}%</span>
        <span className="signage-ring-sub text-[#384250]">ملخص</span>
      </div>
    </div>
  );
}

export function SummaryWidget({
  total,
  periodValue,
  periodLabel,
  target,
  growth = 0,
  compact = false,
  horizontal = false
}: SummaryWidgetProps) {
  const targetPct = target ? Math.min((total / target) * 100, 100) : null;
  const periodPct = total > 0 ? (periodValue / total) * 100 : 0;
  const ringPct = targetPct ?? periodPct;
  const isPositive = growth >= 0;

  if (!horizontal) {
    return (
      <div className="flex flex-col justify-center h-full gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#EFF8FF] px-2 py-1.5 text-center">
            <p className="text-[9px] text-[#6C737F]">الإجمالي</p>
            <p className="text-sm font-bold text-[#111927] tabular-nums">{formatCompact(total)}</p>
          </div>
          <div className="rounded-lg bg-[#F3FCF6] px-2 py-1.5 text-center">
            <p className="text-[9px] text-[#6C737F]">{periodLabel}</p>
            <p className="text-sm font-bold text-[#1B8354] tabular-nums">{formatCompact(periodValue)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WidgetCircleLayout compact={compact} circle={<ProgressRing pct={ringPct} compact={compact} />}>
      {!compact && <p className="signage-stat-heading">ملخص الأداء</p>}
      <div className="signage-stat-boxes">
        <div className="signage-stat-box signage-stat-box--blue">
          <p className="signage-stat-box__label">الإجمالي</p>
          <p className="signage-stat-box__value">{formatCompact(total)}</p>
        </div>
        <div className="signage-stat-box signage-stat-box--green">
          <p className="signage-stat-box__label">{periodLabel}</p>
          <p className="signage-stat-box__value">{formatCompact(periodValue)}</p>
        </div>
      </div>
      {targetPct !== null && (
        <div className="signage-progress-block">
          <div className="signage-stat-row">
            <span className="signage-stat-label">تقدم الهدف</span>
            <span className="signage-stat-value signage-stat-value--green">{targetPct.toFixed(1)}%</span>
          </div>
          <div className="signage-progress-track">
            <div
              className="signage-progress-fill gauge-progress-fill"
              style={{ '--gauge-pct': `${targetPct}%` } as CSSProperties}
            />
          </div>
        </div>
      )}
      <p className={`signage-growth-badge ${isPositive ? 'signage-growth-badge--up' : 'signage-growth-badge--down'}`}>
        النمو {isPositive ? '+' : ''}{growth.toFixed(1)}%
      </p>
    </WidgetCircleLayout>
  );
}
