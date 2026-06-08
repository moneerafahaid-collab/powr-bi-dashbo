import type { CSSProperties } from 'react';
import { SimpleMetrics, PERIOD_META } from '../data/simpleData';
import type { DisplayMode } from './ui/use-display-mode';
import { DGA } from '../styles/dga';
import { DashboardWidget } from './DashboardWidget';
import { StatWidgets } from './StatWidgets';
import { KPIGaugeDashboard } from './KPIGaugeDashboard';
import { DonutWidget } from './DonutWidget';
import { CompareStrip } from './CompareStrip';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PowerBIPageProps {
  data: SimpleMetrics;
  mode?: DisplayMode;
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

/** جوال — تمرير عمودي، كل قسم بمقاس واضح */
function MobileDashboard({ data }: { data: SimpleMetrics }) {
  const periodMeta = PERIOD_META[data.period];
  const growth = data.growth ?? 0;
  const targetPct = data.target ? Math.min((data.total / data.target) * 100, 100) : null;

  const trendData = Array.from({ length: 6 }, (_, i) => ({
    label: `ف${i + 1}`,
    value: Math.round(data.periodValue * (0.78 + (i / 5) * 0.22))
  }));

  return (
    <div className="mobile-layout">
      <StatWidgets data={data} mobile />

      <div className="mobile-section dga-widget">
        <div className="h-0.5 shrink-0 bg-[#1B8354]" />
        <div className="shrink-0 px-3 py-1.5 border-b border-[#E5E7EB] flex items-center justify-between">
          <p className="text-[11px] font-semibold text-[#384250]">تحليل المؤشر</p>
          {targetPct !== null && (
            <span className="text-[9px] font-semibold text-[#1B8354] bg-[#F3FCF6] px-2 py-0.5 rounded">
              {targetPct.toFixed(0)}% من الهدف
            </span>
          )}
        </div>

        <div className="mobile-gauge-box p-2 border-b border-[#E5E7EB]">
          <KPIGaugeDashboard
            total={data.total}
            periodValue={data.periodValue}
            periodLabel={periodMeta.label}
            target={data.target}
            growth={growth}
            compact
            embedded
          />
        </div>

        <div className="mobile-donut-box p-2 border-b border-[#E5E7EB]">
          <p className="text-[10px] font-semibold text-[#384250] text-center mb-1">توزيع {periodMeta.label}</p>
          <DonutWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} compact />
        </div>

        <div className="shrink-0 px-3 py-2 bg-[#FCFCFD]">
          <CompareStrip total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} display />
        </div>
      </div>

      <div className="mobile-section dga-widget mobile-trend-box flex flex-col">
        <div className="h-0.5 shrink-0 bg-[#175CD3]" />
        <div className="shrink-0 px-3 py-1.5 border-b border-[#E5E7EB]">
          <p className="text-[11px] font-semibold text-[#384250]">اتجاه الأداء — {periodMeta.label}</p>
        </div>
        <div className="flex-1 min-h-[140px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`trend-m-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={DGA.info[600]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={DGA.info[600]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={DGA.gray[200]} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: DGA.gray[500], fontSize: 9 }} axisLine={{ stroke: DGA.gray[300] }} tickLine={false} />
              <YAxis tick={{ fill: DGA.gray[500], fontSize: 9 }} axisLine={false} tickLine={false} width={28} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />
              <Area type="monotone" dataKey="value" stroke={DGA.info[600]} strokeWidth={2} fill={`url(#trend-m-${data.id})`} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/** شاشة العرض — شبكة ثابتة بدون تداخل */
function SignageDashboard({ data }: { data: SimpleMetrics }) {
  const periodMeta = PERIOD_META[data.period];
  const growth = data.growth ?? 0;
  const targetPct = data.target ? Math.min((data.total / data.target) * 100, 100) : null;

  const trendData = Array.from({ length: 6 }, (_, i) => ({
    label: `ف${i + 1}`,
    value: Math.round(data.periodValue * (0.78 + (i / 5) * 0.22))
  }));

  return (
    <div className="signage-layout">
      {/* صف 1: KPI */}
      <StatWidgets data={data} signage />

      {/* صف 2: تحليل المؤشر */}
      <div className="signage-panel dga-widget">
        <div className="h-0.5 shrink-0 bg-[#1B8354]" />
        <div className="shrink-0 px-2 py-1 border-b border-[#E5E7EB] flex items-center justify-between">
          <p className="text-[10px] font-semibold text-[#384250]">تحليل المؤشر</p>
          {targetPct !== null && (
            <span className="text-[8px] font-semibold text-[#1B8354] bg-[#F3FCF6] px-1.5 py-px rounded">
              {targetPct.toFixed(0)}% من الهدف
            </span>
          )}
        </div>

        <div className="signage-charts-row">
          <div className="signage-chart-slot">
            <div className="signage-chart-body">
              <KPIGaugeDashboard
                total={data.total}
                periodValue={data.periodValue}
                periodLabel={periodMeta.label}
                target={data.target}
                growth={growth}
                compact
                embedded
              />
            </div>
          </div>
          <div className="signage-chart-slot p-1">
            <p className="text-[8px] font-semibold text-[#384250] text-center shrink-0">توزيع {periodMeta.label}</p>
            <div className="signage-chart-body">
              <DonutWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} compact />
            </div>
          </div>
        </div>

        <div className="shrink-0 px-2 pb-1.5 pt-1 border-t border-[#E5E7EB] bg-[#FCFCFD]">
          <CompareStrip total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} display />
        </div>
      </div>

      {/* صف 3: اتجاه الأداء — نفس ارتفاع التحليل */}
      <DashboardWidget title={`اتجاه الأداء — ${periodMeta.label}`} accent="blue" dense className="signage-panel">
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 2, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`trend-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={DGA.info[600]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={DGA.info[600]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={DGA.gray[200]} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: DGA.gray[500], fontSize: 8 }} axisLine={{ stroke: DGA.gray[300] }} tickLine={false} />
              <YAxis tick={{ fill: DGA.gray[500], fontSize: 8 }} axisLine={false} tickLine={false} width={24} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />
              <Area type="monotone" dataKey="value" stroke={DGA.info[600]} strokeWidth={2} fill={`url(#trend-${data.id})`} dot={false} activeDot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardWidget>
    </div>
  );
}

export function PowerBIPage({ data, mode = 'desktop' }: PowerBIPageProps) {
  if (mode === 'mobile') {
    return <MobileDashboard data={data} />;
  }

  if (mode === 'signage') {
    return <SignageDashboard data={data} />;
  }

  const periodMeta = PERIOD_META[data.period];
  const growth = data.growth ?? 0;
  const targetPct = data.target ? Math.min((data.total / data.target) * 100, 100) : null;

  const compareData = [
    { name: 'الإجمالي', value: data.total, fill: DGA.info[700] },
    { name: periodMeta.label, value: data.periodValue, fill: DGA.sa[600] }
  ];

  const trendData = Array.from({ length: 6 }, (_, i) => ({
    label: `ف${i + 1}`,
    value: Math.round(data.periodValue * (0.78 + (i / 5) * 0.22))
  }));

  return (
    <div className="dashboard-shell h-full min-h-0 overflow-hidden flex flex-col p-3 gap-2.5">
      <StatWidgets data={data} />

      <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-[1fr_minmax(0,1fr)] gap-2.5 overflow-hidden">
        <DashboardWidget title={data.target ? 'تحقيق الهدف' : 'نسبة الإنجاز'} accent="green" noPadding className="col-span-4 min-h-0">
          <KPIGaugeDashboard
            total={data.total}
            periodValue={data.periodValue}
            periodLabel={periodMeta.label}
            target={data.target}
            growth={growth}
            embedded
          />
        </DashboardWidget>

        <div className="col-span-4 min-h-0 grid grid-rows-2 gap-2.5">
          <DashboardWidget title={`توزيع ${periodMeta.label}`} accent="blue" className="min-h-0">
            <DonutWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} />
          </DashboardWidget>
          <DashboardWidget title="مقارنة سريعة" accent="gold" className="min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={DGA.gray[200]} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={52} tick={{ fill: DGA.gray[700], fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                  {compareData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </DashboardWidget>
        </div>

        <DashboardWidget title="ملخص الأرقام" accent="neutral" className="col-span-4 min-h-0">
          <div className="flex flex-col justify-center h-full gap-3">
            <CompareStrip total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} />
            {targetPct !== null && (
              <div>
                <div className="flex justify-between text-[10px] text-[#6C737F] mb-1">
                  <span>تقدم الهدف</span>
                  <span className="font-semibold text-[#1B8354]">{targetPct.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#1B8354] to-[#175CD3] gauge-progress-fill"
                    style={{ '--gauge-pct': `${targetPct}%` } as CSSProperties}
                  />
                </div>
              </div>
            )}
          </div>
        </DashboardWidget>

        <DashboardWidget title={`اتجاه الأداء — ${periodMeta.label}`} accent="blue" className="col-span-12 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`trend-d-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={DGA.info[600]} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={DGA.info[600]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={DGA.gray[200]} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: DGA.gray[500], fontSize: 10 }} axisLine={{ stroke: DGA.gray[300] }} tickLine={false} />
              <YAxis tick={{ fill: DGA.gray[500], fontSize: 9 }} axisLine={false} tickLine={false} width={32} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatNumber(v), '']} />
              <Area type="monotone" dataKey="value" stroke={DGA.info[600]} strokeWidth={2} fill={`url(#trend-d-${data.id})`} dot={{ r: 2, fill: DGA.info[700], strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardWidget>
      </div>
    </div>
  );
}
