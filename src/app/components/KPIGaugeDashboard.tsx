import type { CSSProperties } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DGA } from '../styles/dga';
import { WidgetCircleLayout } from './WidgetCircleLayout';

interface KPIGaugeDashboardProps {
  total: number;
  periodValue: number;
  periodLabel: string;
  target?: number;
  growth?: number;
  compact?: boolean;
  embedded?: boolean;
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

function PowerBIGauge({
  pct,
  centerValue,
  centerLabel,
  minLabel,
  maxLabel,
  accentColor,
  embedded = false,
  tight = false,
  gradientId = 'pbi-gauge-fill'
}: {
  pct: number;
  centerValue: string;
  centerLabel: string;
  minLabel: string;
  maxLabel: string;
  accentColor: string;
  embedded?: boolean;
  tight?: boolean;
  gradientId?: string;
}) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  const vbW = tight ? 240 : embedded ? 260 : 240;
  const vbH = tight ? 138 : embedded ? 162 : 150;
  const cx = vbW / 2;
  const cy = tight ? 112 : embedded ? 128 : 118;
  const r = tight ? 82 : embedded ? 94 : 88;
  const stroke = tight ? 15 : embedded ? 20 : 16;
  const start = 180;
  const end = 0;
  const valAngle = start - (clamped / 100) * 180;

  const polar = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };

  const describeArc = (from: number, to: number) => {
    const s = polar(from);
    const e = polar(to);
    const largeArc = Math.abs(from - to) > 180 ? 1 : 0;
    const sweepFlag = from > to ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${e.x} ${e.y}`;
  };

  const valueSize = tight ? 28 : embedded ? 36 : 28;
  const labelSize = tight ? 10 : embedded ? 12 : 11;
  const pctSize = embedded || tight ? 0 : 20;
  const edgeSize = tight ? 8 : embedded ? 10 : 9;

  return (
    <div className="w-full h-full flex flex-col items-center min-h-0 justify-center overflow-hidden">
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className={`w-full h-full ${tight ? 'max-h-[92px]' : embedded ? 'max-h-[118px]' : 'max-h-full'}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={DGA.info[700]} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
        </defs>

        <path d={describeArc(start, end)} fill="none" stroke={DGA.gray[200]} strokeWidth={stroke} strokeLinecap="round" />

        {clamped > 0 && (
          <path
            d={describeArc(start, valAngle)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        )}

        <text x={cx} y={cy - (tight ? 24 : embedded ? 30 : 28)} textAnchor="middle" fill={DGA.gray[900]} fontSize={valueSize} fontWeight="700" fontFamily="IBM Plex Sans Arabic, sans-serif">
          {centerValue}
        </text>
        <text x={cx} y={cy - (tight ? 8 : embedded ? 10 : 6)} textAnchor="middle" fill={DGA.sa[600]} fontSize={labelSize} fontWeight="700" fontFamily="IBM Plex Sans Arabic, sans-serif">
          {centerLabel}
        </text>
        {pctSize > 0 && (
          <text x={cx} y={cy + 16} textAnchor="middle" fill={accentColor} fontSize={pctSize} fontWeight="700" fontFamily="IBM Plex Sans Arabic, sans-serif">
            {clamped.toFixed(0)}%
          </text>
        )}

        <text x={embedded ? 30 : 28} y={cy + 16} textAnchor="middle" fill={DGA.gray[500]} fontSize={edgeSize} fontWeight="600" fontFamily="IBM Plex Sans Arabic, sans-serif">
          {minLabel}
        </text>
        <text x={embedded ? vbW - 30 : 212} y={cy + 16} textAnchor="middle" fill={DGA.gray[500]} fontSize={edgeSize} fontWeight="600" fontFamily="IBM Plex Sans Arabic, sans-serif">
          {maxLabel}
        </text>
      </svg>
    </div>
  );
}

export function KPIGaugeDashboard({
  total,
  periodValue,
  periodLabel,
  target,
  growth = 0,
  compact = false,
  embedded = false,
  horizontal = false
}: KPIGaugeDashboardProps) {
  const isPositive = growth >= 0;
  const targetPct = target ? Math.min((total / target) * 100, 100) : null;
  const periodPct = total > 0 ? (periodValue / total) * 100 : 0;
  const gaugePct = targetPct ?? periodPct;
  const gaugeTitle = target ? 'تحقيق الهدف' : 'نسبة الإنجاز';
  const gaugeId = `pbi-gauge-${total}-${periodValue}`;

  const showTarget = targetPct !== null;
  const centerValue = showTarget ? `${gaugePct.toFixed(0)}%` : formatCompact(periodValue);
  const centerLabel = showTarget ? 'تحقيق الهدف' : periodLabel;

  const stats = [
    { label: 'الإجمالي', value: formatCompact(total), accent: DGA.info[700], bg: DGA.info[50] },
    { label: periodLabel, value: formatCompact(periodValue), accent: DGA.sa[600], bg: DGA.sa[50] },
    {
      label: target ? 'المستهدف' : 'النمو',
      value: target ? formatCompact(target) : `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
      accent: target ? DGA.gold[600] : isPositive ? DGA.success[600] : DGA.error[600],
      bg: target ? '#FFFAEB' : isPositive ? DGA.success[50] : DGA.error[50]
    }
  ];

  const gaugeNode = (
    <PowerBIGauge
      pct={gaugePct}
      centerValue={centerValue}
      centerLabel={centerLabel}
      minLabel="0"
      maxLabel={target ? formatCompact(target) : formatCompact(total)}
      accentColor={DGA.sa[600]}
      embedded={embedded || horizontal}
      tight={(embedded && compact) || horizontal}
      gradientId={gaugeId}
    />
  );

  if (horizontal && embedded) {
    return (
      <WidgetCircleLayout compact={compact} circle={gaugeNode}>
        {!compact && <p className="font-semibold text-[#384250] text-[10px]">{gaugeTitle}</p>}
        {compact && <p className="font-semibold text-[#384250] text-[8px] leading-tight">{gaugeTitle}</p>}
        {!compact && <p className="font-bold text-[#111927] tabular-nums text-lg">{centerValue}</p>}
        <span className={`inline-flex items-center gap-1 w-fit text-[8px] font-semibold px-1.5 py-px rounded ${isPositive ? 'bg-[#ECFDF3] text-[#079455]' : 'bg-[#FEF3F2] text-[#D92D20]'}`}>
          {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {isPositive ? '+' : ''}{growth.toFixed(1)}%
        </span>
        <div className={`grid grid-cols-1 ${compact ? 'gap-px' : 'gap-0.5 mt-0.5'}`}>
          {stats.slice(0, compact ? 2 : 3).map((s) => (
            <div key={s.label} className="flex justify-between items-center text-[7px] leading-tight">
              <span className="text-[#6C737F] truncate">{s.label}</span>
              <span className="font-semibold text-[#111927] tabular-nums shrink-0 mr-1">{s.value}</span>
            </div>
          ))}
        </div>
        {target && targetPct !== null && (
          <div className="mt-0.5">
            <div className="flex justify-between text-[8px] text-[#6C737F] mb-0.5">
              <span>تقدم الهدف</span>
              <span className="font-semibold text-[#1B8354]">{targetPct.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-l from-[#1B8354] to-[#175CD3] gauge-progress-fill" style={{ '--gauge-pct': `${targetPct}%` } as CSSProperties} />
            </div>
          </div>
        )}
      </WidgetCircleLayout>
    );
  }

  return (
    <div className={`flex flex-col min-h-0 overflow-hidden ${embedded ? 'flex-1 h-full' : 'dga-card h-full'}`}>
      {!embedded && (
        <div className="dga-card-header shrink-0 flex items-center justify-between px-4 py-2.5">
          <p className="text-xs font-semibold text-[#384250]">{gaugeTitle}</p>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${isPositive ? 'bg-[#ECFDF3] text-[#079455]' : 'bg-[#FEF3F2] text-[#D92D20]'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{growth.toFixed(1)}%
          </span>
        </div>
      )}

      <div className={`flex-1 flex flex-col min-h-0 ${embedded ? 'py-1 px-1' : compact ? 'px-3 pb-2 pt-1' : 'px-4 pb-3 pt-2'}`}>
        {embedded && !compact && !horizontal && (
          <p className="text-[10px] font-bold text-[#384250] text-center shrink-0 mb-0.5">{gaugeTitle}</p>
        )}

        {gaugeNode}

        {embedded && showTarget && target && !horizontal && (
          <div className="shrink-0 px-1 pb-0.5">
            {!compact && (
              <div className="flex justify-between text-[8px] text-[#6C737F] mb-0.5">
                <span>{formatCompact(total)}</span>
                <span>{formatCompact(target)}</span>
              </div>
            )}
            <div className={`bg-[#EFF8FF] rounded-full overflow-hidden ${compact ? 'h-1' : 'h-1.5'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-l from-[#175CD3] to-[#1B8354] gauge-progress-fill"
                style={{ '--gauge-pct': `${targetPct}%` } as CSSProperties}
              />
            </div>
          </div>
        )}

        {!embedded && (
          <>
            <div className={`grid grid-cols-3 gap-1.5 shrink-0 ${compact ? 'mt-1' : 'mt-2'}`}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-md px-2 py-1.5 text-center border border-[#E5E7EB] min-w-0 stat-chip"
                  style={{ backgroundColor: s.bg, '--stat-accent': s.accent } as CSSProperties}
                >
                  <p className="text-[9px] font-medium truncate stat-chip-label">{s.label}</p>
                  <p className={`font-bold text-[#111927] tabular-nums truncate ${compact ? 'text-xs' : 'text-sm'}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {target && (
              <div className={`shrink-0 ${compact ? 'mt-1.5' : 'mt-2'}`}>
                <div className="flex justify-between text-[9px] text-[#6C737F] mb-0.5">
                  <span>تقدم نحو الهدف</span>
                  <span className="font-semibold text-[#1B8354]">{targetPct!.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-l from-[#1B8354] to-[#175CD3] gauge-progress-fill" style={{ '--gauge-pct': `${targetPct}%` } as CSSProperties} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
