import type { ReactNode } from 'react';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  accent?: 'green' | 'blue' | 'gold' | 'neutral';
  className?: string;
  noPadding?: boolean;
}

const accentBar: Record<NonNullable<DashboardWidgetProps['accent']>, string> = {
  green: 'bg-[#1B8354]',
  blue: 'bg-[#175CD3]',
  gold: 'bg-[#DBA102]',
  neutral: 'bg-[#384250]'
};

export function DashboardWidget({ title, children, accent = 'neutral', className = '', noPadding = false, dense = false }: DashboardWidgetProps & { dense?: boolean }) {
  return (
    <div className={`dga-widget flex flex-col min-h-0 overflow-hidden ${className}`}>
      <div className={`shrink-0 ${dense ? 'h-0.5' : 'h-1'} ${accentBar[accent]}`} />
      <div className={`shrink-0 border-b border-[#E5E7EB] bg-white ${dense ? 'px-2 py-1' : 'px-3 py-2'}`}>
        <p className={`font-semibold text-[#384250] ${dense ? 'text-[9px]' : 'text-[11px]'}`}>{title}</p>
      </div>
      <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${noPadding ? '' : dense ? 'p-1' : 'p-3'}`}>{children}</div>
    </div>
  );
}
