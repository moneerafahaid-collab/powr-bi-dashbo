interface HeaderBrandProps {
  variant?: 'desktop' | 'signage' | 'signage-tall';
}

export function HeaderBrand({ variant = 'desktop' }: HeaderBrandProps) {
  const isTall = variant === 'signage-tall';
  const isSignage = variant === 'signage' || isTall;

  return (
    <div className={isSignage ? (isTall ? 'text-right shrink-0' : 'text-center') : 'text-right border-r border-white/20 pr-5'}>
      <h1
        className={`text-white font-bold leading-tight ${
          isTall ? 'text-sm' : isSignage ? 'text-xl tracking-tight' : 'text-lg xl:text-xl tracking-tight'
        }`}
      >
        مؤشرات وكالة التحول الرقمي
      </h1>
      <p className={`text-white/85 font-medium ${isTall ? 'text-[10px]' : isSignage ? 'text-sm mt-1' : 'text-xs mt-0.5'}`}>
        أمانة منطقة حائل
      </p>
    </div>
  );
}
