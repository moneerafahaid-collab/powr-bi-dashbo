import { SimpleMetrics, PERIOD_META } from '../data/simpleData';
import type { DisplayMode } from './ui/use-display-mode';
import { DGA } from '../styles/dga';
import { DashboardWidget } from './DashboardWidget';
import { StatWidgets } from './StatWidgets';
import { KPIGaugeDashboard } from './KPIGaugeDashboard';
import { DonutWidget } from './DonutWidget';
import { CompareStrip } from './CompareStrip';
import { CompareWidget } from './CompareWidget';
import { SummaryWidget } from './SummaryWidget';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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
          <p className="text-[10px] font-semibold text-[#384250] mb-1">توزيع {periodMeta.label}</p>
          <DonutWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} compact horizontal />
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
    <div className="signage-layout signage-dashboard">
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

        <div className="signage-charts-row signage-charts-row-4">
          <div className="signage-chart-slot p-1">
            <p className="text-[8px] font-semibold text-[#384250] shrink-0 mb-0.5">تحقيق الهدف</p>
            <div className="signage-chart-body">
              <KPIGaugeDashboard
                total={data.total}
                periodValue={data.periodValue}
                periodLabel={periodMeta.label}
                target={data.target}
                growth={growth}
                compact
                embedded
                horizontal
              />
            </div>
          </div>
          <div className="signage-chart-slot p-1">
            <p className="text-[8px] font-semibold text-[#384250] shrink-0 mb-0.5">توزيع {periodMeta.label}</p>
            <div className="signage-chart-body">
              <DonutWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} compact horizontal />
            </div>
          </div>
          <div className="signage-chart-slot p-1">
            <p className="text-[8px] font-semibold text-[#384250] shrink-0 mb-0.5">مقارنة</p>
            <div className="signage-chart-body">
              <CompareWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} compact horizontal />
            </div>
          </div>
          <div className="signage-chart-slot p-1">
            <p className="text-[8px] font-semibold text-[#384250] shrink-0 mb-0.5">ملخص الأداء</p>
            <div className="signage-chart-body">
              <SummaryWidget
                total={data.total}
                periodValue={data.periodValue}
                periodLabel={periodMeta.label}
                target={data.target}
                growth={growth}
                compact
                horizontal
              />
            </div>
          </div>
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

  const trendData = Array.from({ length: 6 }, (_, i) => ({
    label: `ف${i + 1}`,
    value: Math.round(data.periodValue * (0.78 + (i / 5) * 0.22))
  }));

  return (
    <div className="dashboard-shell h-full min-h-0 overflow-hidden flex flex-col p-3 gap-2.5">
      <StatWidgets data={data} />

      <div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2.5 overflow-hidden">
        <DashboardWidget title={data.target ? 'تحقيق الهدف' : 'نسبة الإنجاز'} accent="green" className="min-h-0">
          <KPIGaugeDashboard
            total={data.total}
            periodValue={data.periodValue}
            periodLabel={periodMeta.label}
            target={data.target}
            growth={growth}
            embedded
            horizontal
          />
        </DashboardWidget>

        <DashboardWidget title={`توزيع ${periodMeta.label}`} accent="blue" className="min-h-0">
          <DonutWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} horizontal />
        </DashboardWidget>

        <DashboardWidget title="مقارنة" accent="gold" className="min-h-0">
          <CompareWidget total={data.total} periodValue={data.periodValue} periodLabel={periodMeta.label} horizontal />
        </DashboardWidget>

        <DashboardWidget title="ملخص الأداء" accent="neutral" className="min-h-0">
          <SummaryWidget
            total={data.total}
            periodValue={data.periodValue}
            periodLabel={periodMeta.label}
            target={data.target}
            growth={growth}
            horizontal
          />
        </DashboardWidget>

        <DashboardWidget title={`اتجاه الأداء — ${periodMeta.label}`} accent="blue" className="col-span-4 min-h-0">
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
