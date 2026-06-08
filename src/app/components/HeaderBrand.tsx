interface HeaderBrandProps {
  variant?: 'desktop' | 'signage';
}

export function HeaderBrand({ variant = 'desktop' }: HeaderBrandProps) {
  const isSignage = variant === 'signage';

  return (
    <div className={isSignage ? 'text-center' : 'text-right border-r border-white/20 pr-5'}>
      <h1
        className={`text-white font-bold leading-tight ${
          isSignage ? 'text-xl tracking-tight' : 'text-lg xl:text-xl tracking-tight'
        }`}
      >
        مؤشرات وكالة التحول الرقمي
      </h1>
      <p className={`text-white/85 font-medium ${isSignage ? 'text-sm mt-1' : 'text-xs mt-0.5'}`}>
        أمانة منطقة حائل
      </p>
    </div>
  );
}
