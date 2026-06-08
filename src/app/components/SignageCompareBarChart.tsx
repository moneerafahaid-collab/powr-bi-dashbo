import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DGA } from '../styles/dga';

interface SignageCompareBarChartProps {
  total: number;
  periodValue: number;
  periodLabel: string;
}

function formatNumber(n: number) {
  return n.toLocaleString('ar-SA');
}

const tooltipStyle = {
  backgroundColor: '#fff',
  border: `1px solid ${DGA.gray[300]}`,
  borderRadius: 8,
  direction: 'rtl' as const,
  fontSize: 12,
  fontFamily: 'IBM Plex Sans Arabic, sans-serif'
};

export function SignageCompareBarChart({ total, periodValue, periodLabel }: SignageCompareBarChartProps) {
  const compareData = [
    { name: 'الإجمالي', value: total, fill: DGA.info[700] },
    { name: periodLabel, value: periodValue, fill: DGA.sa[600] }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={compareData} margin={{ top: 8, right: 6, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={DGA.gray[200]} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: DGA.gray[700], fontSize: 11, fontWeight: 600 }}
          axisLine={{ stroke: DGA.gray[300] }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: DGA.gray[500], fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={34}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {compareData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
