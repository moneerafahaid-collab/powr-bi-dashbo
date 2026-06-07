import { SimpleMetrics, PERIOD_META } from '../data/simpleData';
import type { DisplayMode } from './ui/use-display-mode';
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
import {
  TrendingUp,
  TrendingDown,
  Target,
  Sigma,
  CalendarRange,
  Clock
} from 'lucide-react';

interface PowerBIPageProps {
  data: SimpleMetrics;
  mode?: DisplayMode;
}

function formatNumber(n: number) {
  return n.toLocaleString('ar-SA');
}

export function PowerBIPage({ data, mode = 'desktop' }: PowerBIPageProps) {
  const isSignage = mode === 'signage';
  const periodMeta = PERIOD_META[data.period];
  const growth = data.growth ?? 0;
  const isPositive = growth >= 0;
  const periodShare = data.total > 0 ? (data.periodValue / data.total) * 100 : 0;
  const targetProgress = data.target ? Math.min((data.total / data.target) * 100, 100) : null;

  const compareData = [
    { name: 'الإجمالي', value: data.total, fill: '#0d47a1' },
    { name: periodMeta.label, value: data.periodValue, fill: periodMeta.color }
  ];

  const trendPoints = 6;
  const trendData = Array.from({ length: trendPoints }, (_, i) => ({
    label: `ف${i + 1}`,
    value: Math.round(data.periodValue * (0.78 + (i / (trendPoints - 1)) * 0.22))
  }));

  const tableRows = [
    { label: 'الإجمالي', sub: 'إجمالي المؤشر', value: data.total, color: '#0d47a1', highlight: false },
    { label: periodMeta.label, sub: periodMeta.sub, value: data.periodValue, color: periodMeta.color, highlight: true },
    ...(data.target ? [{ label: 'المستهدف', sub: 'الهدف المحدد', value: data.target, color: '#f59e0b', highlight: false }] : [])
  ];

  /* ── تخطيط شاشة العرض الطولية ── */
  if (isSignage) {
    return (
      <div className="flex flex-col h-full gap-2 px-3 py-2 overflow-hidden">
        {/* الإجمالي */}
        <div className="bg-gradient-to-bl from-[#0d47a1] to-[#1565c0] rounded-xl p-4 text-white shadow-lg relative overflow-hidden shrink-0">
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sigma className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs font-medium">الإجمالي</span>
            </div>
            <p className="text-4xl font-bold tracking-tight">{formatNumber(data.total)}</p>
            {targetProgress !== null && (
              <div className="mt-2 max-w-xs mx-auto">
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>تحقيق الهدف</span>
                  <span className="font-bold">{targetProgress.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${targetProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* الفترة المحددة */}
        <div className="bg-white rounded-xl p-3 shadow-sm border-2 shrink-0" style={{ borderColor: periodMeta.color }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CalendarRange className="w-4 h-4" style={{ color: periodMeta.color }} />
              <span className="text-xs font-bold text-slate-600">الفترة — {periodMeta.label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{formatNumber(data.periodValue)}</p>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="text-xs text-slate-400">{periodShare.toFixed(1)}% من الإجمالي</span>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}{growth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* جدول مضغوط */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 px-3 py-1 shrink-0">
          <table className="w-full text-xs">
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.label} className={`border-b border-slate-50 last:border-0 ${row.highlight ? 'bg-slate-50/60' : ''}`}>
                  <td className="py-2 pr-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                      <span className="font-semibold text-slate-800">{row.label}</span>
                    </div>
                  </td>
                  <td className="py-2 text-left font-bold text-slate-800 tabular-nums">{formatNumber(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* مخططات — تأخذ المساحة المتبقية */}
        <div className="flex-1 min-h-0 grid grid-rows-2 gap-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-2 flex flex-col min-h-0">
            <p className="text-xs font-bold text-slate-800 mb-1 text-center shrink-0">مقارنة الإجمالي والفترة</p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', direction: 'rtl' }} formatter={(v: number) => [formatNumber(v), '']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {compareData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-2 flex flex-col min-h-0">
            <div className="flex items-center justify-center gap-1.5 mb-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-xs font-bold text-slate-800">توجه {periodMeta.label}</p>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id={`trend-s-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={periodMeta.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={periodMeta.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', direction: 'rtl' }} formatter={(v: number) => [formatNumber(v), '']} />
                  <Area type="monotone" dataKey="value" stroke={periodMeta.color} strokeWidth={2} fill={`url(#trend-s-${data.id})`} dot={{ fill: periodMeta.color, r: 2, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── تخطيط الكمبيوتر (أفقي) ── */
  return (
    <div className="flex flex-col h-full gap-4 p-5 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 shrink-0">
        <div className="col-span-5 bg-gradient-to-bl from-[#0d47a1] to-[#1565c0] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/15 rounded-lg"><Sigma className="w-5 h-5" /></div>
              <span className="text-white/80 text-sm font-medium">الإجمالي</span>
            </div>
            <p className="text-5xl font-bold tracking-tight mb-2">{formatNumber(data.total)}</p>
            <p className="text-white/60 text-sm">إجمالي {data.pageName}</p>
            {targetProgress !== null && (
              <div className="mt-5">
                <div className="flex justify-between text-xs text-white/70 mb-1.5">
                  <span>نسبة تحقيق الهدف</span>
                  <span className="font-bold text-white">{targetProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${targetProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-sm border-2 relative overflow-hidden" style={{ borderColor: periodMeta.color }}>
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: periodMeta.color }} />
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${periodMeta.color}18` }}>
                <CalendarRange className="w-5 h-5" style={{ color: periodMeta.color }} />
              </div>
              <div>
                <p className="text-slate-500 text-xs">الفترة المحددة</p>
                <p className="font-bold text-slate-800">{periodMeta.label}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: periodMeta.color }}>{periodMeta.sub}</span>
          </div>
          <p className="text-4xl font-bold text-slate-900 tracking-tight mb-2">{formatNumber(data.periodValue)}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{periodShare.toFixed(1)}% من الإجمالي</span>
            <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{growth.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-bold text-slate-700">ملخص المؤشر</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs text-slate-400">الفترة</span>
              <span className="text-sm font-bold" style={{ color: periodMeta.color }}>{periodMeta.label}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs text-slate-400">الإجمالي</span>
              <span className="text-sm font-bold text-[#0d47a1]">{formatNumber(data.total)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs text-slate-400">قيمة الفترة</span>
              <span className="text-sm font-bold text-slate-800">{formatNumber(data.periodValue)}</span>
            </div>
            {data.target && (
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-slate-400">المستهدف</span>
                <span className="text-sm font-bold text-amber-600">{formatNumber(data.target)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-5 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col min-h-0">
          <div className="mb-4 shrink-0">
            <h3 className="text-base font-bold text-slate-800">مقارنة الإجمالي والفترة</h3>
            <p className="text-xs text-slate-400 mt-0.5">الإجمالي مقابل {periodMeta.label}</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} barSize={72}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', direction: 'rtl', fontSize: 13 }} formatter={(value: number) => [formatNumber(value), 'القيمة']} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {compareData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col min-h-0">
          <div className="mb-4 shrink-0">
            <h3 className="text-base font-bold text-slate-800">تفاصيل المؤشر</h3>
            <p className="text-xs text-slate-400 mt-0.5">الإجمالي والفترة المحددة</p>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-right py-2.5 text-slate-500 font-medium text-xs">البند</th>
                  <th className="text-left py-2.5 text-slate-500 font-medium text-xs">القيمة</th>
                  <th className="text-left py-2.5 text-slate-500 font-medium text-xs">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.label} className={`border-b border-slate-50 transition-colors ${row.highlight ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{row.label}</p>
                          <p className="text-xs text-slate-400">{row.sub}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-left font-bold text-slate-800 tabular-nums">{formatNumber(row.value)}</td>
                    <td className="py-3.5 text-left">
                      {row.label === 'الإجمالي' ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">100%</span>
                      ) : row.label === 'المستهدف' && data.target ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">{((data.total / data.target) * 100).toFixed(1)}%</span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{periodShare.toFixed(1)}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-base font-bold text-slate-800">توجه {periodMeta.label}</h3>
              <p className="text-xs text-slate-400 mt-0.5">آخر {trendPoints} فترات</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id={`trend-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={periodMeta.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={periodMeta.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', direction: 'rtl', fontSize: 12 }} formatter={(value: number) => [formatNumber(value), periodMeta.label]} />
                <Area type="monotone" dataKey="value" stroke={periodMeta.color} strokeWidth={2.5} fill={`url(#trend-${data.id})`} dot={{ fill: periodMeta.color, r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
