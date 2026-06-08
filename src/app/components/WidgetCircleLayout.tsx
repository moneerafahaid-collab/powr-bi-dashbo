import type { ReactNode } from 'react';

interface WidgetCircleLayoutProps {
  circle: ReactNode;
  children: ReactNode;
  compact?: boolean;
  className?: string;
}

/** RTL: الدائرة يميناً والمحتوى يساراً */
export function WidgetCircleLayout({ circle, children, compact = false, className = '' }: WidgetCircleLayoutProps) {
  return (
    <div className={`widget-circle-layout flex flex-row items-center h-full min-h-0 ${compact ? 'gap-1.5' : 'gap-3'} ${className}`}>
      <div
        className={`signage-circle-slot shrink-0 flex items-center justify-center min-h-0 ${
          compact ? 'is-compact' : 'is-regular'
        }`}
      >
        {circle}
      </div>
      <div className="widget-circle-content flex-1 min-w-0 flex flex-col justify-center gap-0.5">{children}</div>
    </div>
  );
}
