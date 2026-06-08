import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DGA } from '../styles/dga';

interface DonutWidgetProps {
  total: number;
  periodValue: number;
  periodLabel: string;
  compact?: boolean;
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

export function DonutWidget({ total, periodValue, periodLabel, compact = false }: DonutWidgetProps) {
  const remainder = Math.max(total - periodValue, 0);
  const pct = total > 0 ? ((periodValue / total) * 100).toFixed(0) : '0';

  const slices = [
    { name: periodLabel, value: periodValue, color: DGA.sa[600] },
    { name: 'الباقي', value: remainder, color: '#D1E9FF' }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-0">
      <div className="relative w-full h-full min-h-0 max-h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {slices.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-bold text-[#111927] tabular-nums ${compact ? 'text-base' : 'text-lg'}`}>{pct}%</span>
          <span className={`text-[#6C737F] ${compact ? 'text-[8px]' : 'text-[9px]'}`}>{periodLabel}</span>
        </div>
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
