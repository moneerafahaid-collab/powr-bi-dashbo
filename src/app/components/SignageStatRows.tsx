import type { ReactNode } from 'react';

interface SignageStatRowProps {
  label: ReactNode;
  value: string;
  valueTone?: 'default' | 'green' | 'blue';
}

export function SignageStatRow({ label, value, valueTone = 'default' }: SignageStatRowProps) {
  const toneClass =
    valueTone === 'green' ? 'signage-stat-value--green' : valueTone === 'blue' ? 'signage-stat-value--blue' : '';
  return (
    <div className="signage-stat-row">
      <span className="signage-stat-label">{label}</span>
      <span className={`signage-stat-value tabular-nums ${toneClass}`}>{value}</span>
    </div>
  );
}

export function SignageLegendDot({ color }: { color: string }) {
  return <span className="signage-legend-dot shrink-0" style={{ backgroundColor: color }} />;
}
