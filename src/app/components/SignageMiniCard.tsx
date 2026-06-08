import type { ReactNode } from 'react';

interface SignageMiniCardProps {
  title: string;
  accent?: 'green' | 'blue' | 'gold' | 'neutral';
  children: ReactNode;
}

const accentBar = {
  green: 'bg-[#1B8354]',
  blue: 'bg-[#175CD3]',
  gold: 'bg-[#DBA102]',
  neutral: 'bg-[#384250]'
};

export function SignageMiniCard({ title, accent = 'neutral', children }: SignageMiniCardProps) {
  return (
    <div className="signage-mini-card dga-widget">
      <div className={`shrink-0 h-0.5 ${accentBar[accent]}`} />
      <p className="signage-mini-card__title shrink-0 border-b border-[#E5E7EB] text-[#384250] font-semibold">
        {title}
      </p>
      <div className="signage-mini-card__body">{children}</div>
    </div>
  );
}
