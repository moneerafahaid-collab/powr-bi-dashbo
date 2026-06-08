import type { CSSProperties } from 'react';
import { TrendingUp, TrendingDown, Target, Calendar, BarChart3, Activity } from 'lucide-react';
import { SimpleMetrics, PERIOD_META } from '../data/simpleData';

function formatNumber(n: number) {
  return n.toLocaleString('ar-SA');
}

interface StatWidgetsProps {
  data: SimpleMetrics;
  compact?: boolean;
  signage?: boolean;
  mobile?: boolean;
}

export function StatWidgets({ data, compact = false, signage = false, mobile = false }: StatWidgetsProps) {
  const periodMeta = PERIOD_META[data.period];
  const growth = data.growth ?? 0;
  const isPositive = growth >= 0;
  const periodShare = data.total > 0 ? (data.periodValue / data.total) * 100 : 0;
  const targetPct = data.target ? Math.min((data.total / data.target) * 100, 100) : null;

  const items = [
    { label: 'الإجمالي', value: formatNumber(data.total), sub: 'إجمالي المؤشر', icon: BarChart3, accent: '#175CD3', bg: '#EFF8FF' },
    { label: periodMeta.label, value: formatNumber(data.periodValue), sub: `${periodShare.toFixed(1)}%`, icon: Calendar, accent: '#1B8354', bg: '#F3FCF6' },
    {
      label: data.target ? 'المستهدف' : 'الحصة',
      value: data.target ? formatNumber(data.target) : `${periodShare.toFixed(0)}%`,
      sub: data.target && targetPct !== null ? `${targetPct.toFixed(0)}%` : periodMeta.short,
      icon: Target,
      accent: '#DBA102',
      bg: '#FFFAEB'
    },
    {
      label: 'النمو',
      value: `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
      sub: isPositive ? '▲' : '▼',
      icon: Activity,
      accent: isPositive ? '#079455' : '#D92D20',
      bg: isPositive ? '#ECFDF3' : '#FEF3F2'
    }
  ];

  if (mobile) {
    return (
      <div className="mobile-kpi-grid shrink-0">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="dga-widget-stat flex items-center gap-2 p-2 min-w-0"
              style={{ '--stat-accent': item.accent, '--stat-bg': item.bg } as CSSProperties}
            >
              <div className="stat-icon-box stat-icon-box-sm shrink-0">
                <Icon className="w-3 h-3" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[8px] text-[#6C737F] font-medium truncate">{item.label}</p>
                <p className="text-sm font-bold text-[#111927] tabular-nums leading-tight truncate">{item.value}</p>
                <p className="text-[7px] text-[#9DA4AE] truncate">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (signage) {
    return (
      <div className="signage-kpi-row grid grid-cols-4 gap-1 shrink-0">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="dga-widget-stat flex flex-col items-center text-center p-1.5 min-w-0"
              style={{ '--stat-accent': item.accent, '--stat-bg': item.bg } as CSSProperties}
            >
              <div className="stat-icon-box stat-icon-box-sm mb-0.5">
                <Icon className="w-3 h-3" />
              </div>
              <p className="signage-kpi-label text-[#6C737F] font-medium truncate w-full">{item.label}</p>
              <p className="signage-kpi-value text-sm font-bold text-[#111927] tabular-nums leading-tight">{item.value}</p>
              <p className="signage-kpi-sub text-[#9DA4AE]">{item.sub}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid shrink-0 ${compact ? 'grid-cols-2 gap-1.5' : 'grid-cols-4 gap-2'}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`dga-widget-stat flex items-start gap-2 min-w-0 ${compact ? 'p-2' : 'p-2.5'}`}
            style={{ '--stat-accent': item.accent, '--stat-bg': item.bg } as CSSProperties}
          >
            <div className="stat-icon-box shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-[#6C737F] font-medium truncate ${compact ? 'text-[8px]' : 'text-[9px]'}`}>{item.label}</p>
              <p className={`font-bold text-[#111927] tabular-nums leading-tight truncate ${compact ? 'text-sm' : 'text-base'}`}>{item.value}</p>
              <p className={`text-[#9DA4AE] truncate ${compact ? 'text-[7px]' : 'text-[8px]'}`}>{item.sub}</p>
            </div>
            {item.label === 'النمو' && (
              <span className="shrink-0 mt-0.5">
                {isPositive ? <TrendingUp className="w-3 h-3 text-[#079455]" /> : <TrendingDown className="w-3 h-3 text-[#D92D20]" />}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
