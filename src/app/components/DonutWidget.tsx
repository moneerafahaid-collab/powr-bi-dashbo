import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DGA } from '../styles/dga';
import { WidgetCircleLayout } from './WidgetCircleLayout';

interface DonutWidgetProps {
  total: number;
  periodValue: number;
  periodLabel: string;
  compact?: boolean;
  horizontal?: boolean;
}

function formatNumber(n: number) {
  return n.toLocaleString('ar-SA');
}

const tooltipStyle = {
  backgroundColor: '#fff',
  border: `1px solid ${DGA.gray[300]}`,
  borderRadius: 8,
  direction: 'rtl' as const,
  fontSize: 11,
  fontFamily: 'IBM Plex Sans Arabic, sans-serif'
};

function DonutRing({
  slices,
  pct,
  periodLabel,
  compact,
  showTooltip = true
}: {
  slices: { name: string; value: number; color: string }[];
  pct: string;
  periodLabel: string;
  compact?: boolean;
  showTooltip?: boolean;
}) {
  return (
    <div className="relative w-full h-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="88%"
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {slices.map((s, i) => (
              <Cell key={i} fill={s.color} />
            ))}
          </Pie>
          {showTooltip && <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />}
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`font-bold text-[#111927] tabular-nums ${compact ? 'text-sm' : 'text-lg'}`}>{pct}%</span>
        <span className={`text-[#6C737F] ${compact ? 'text-[7px]' : 'text-[9px]'}`}>{periodLabel}</span>
      </div>
    </div>
  );
}

export function DonutWidget({ total, periodValue, periodLabel, compact = false, horizontal = false }: DonutWidgetProps) {
  const remainder = Math.max(total - periodValue, 0);
  const pct = total > 0 ? ((periodValue / total) * 100).toFixed(0) : '0';

  const slices = [
    { name: periodLabel, value: periodValue, color: DGA.sa[600] },
    { name: 'الباقي', value: remainder, color: '#D1E9FF' }
  ];

  if (horizontal) {
    return (
      <WidgetCircleLayout
        compact={compact}
        circle={<DonutRing slices={slices} pct={pct} periodLabel={periodLabel} compact={compact} />}
      >
        {!compact && (
          <p className="font-bold text-[#111927] tabular-nums text-lg">{pct}%</p>
        )}
        <p className={`text-[#384250] font-medium ${compact ? 'text-[8px]' : 'text-[10px]'}`}>توزيع {periodLabel}</p>
        <div className={`space-y-0.5 ${compact ? '' : 'mt-0.5'}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[8px] text-[#6C737F]">
              <span className="w-2 h-2 rounded-full bg-[#1B8354] shrink-0" />
              {periodLabel}
            </span>
            <span className="text-[9px] font-semibold text-[#1B8354] tabular-nums">{formatNumber(periodValue)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[8px] text-[#6C737F]">
              <span className="w-2 h-2 rounded-full bg-[#D1E9FF] shrink-0" />
              الباقي
            </span>
            <span className="text-[9px] font-semibold text-[#175CD3] tabular-nums">{formatNumber(remainder)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-[#E5E7EB]">
            <span className="text-[8px] text-[#6C737F]">الإجمالي</span>
            <span className="text-[9px] font-bold text-[#111927] tabular-nums">{formatNumber(total)}</span>
          </div>
        </div>
      </WidgetCircleLayout>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-0">
      <div className="relative w-full h-full min-h-0 max-h-full">
        <DonutRing slices={slices} pct={pct} periodLabel={periodLabel} compact={compact} />
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-0.5 pb-0.5">
        <span className="flex items-center gap-1 text-[9px] text-[#6C737F]">
          <span className="w-2 h-2 rounded-full bg-[#1B8354]" />
          {periodLabel}
        </span>
        <span className="flex items-center gap-1 text-[9px] text-[#6C737F]">
          <span className="w-2 h-2 rounded-full bg-[#D1E9FF]" />
          الباقي
        </span>
      </div>
    </div>
  );
}
