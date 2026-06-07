interface HeaderBrandProps {
  variant?: 'desktop' | 'signage';
}

export function HeaderBrand({ variant = 'desktop' }: HeaderBrandProps) {
  const isSignage = variant === 'signage';

  return (
    <div className={`flex items-center shrink-0 ${isSignage ? 'flex-col gap-2' : 'gap-4'}`}>
      <img
        src="/logos/hail-municipality.png"
        alt="أمانة منطقة حائل"
        className={`object-contain mix-blend-screen ${
          isSignage ? 'h-14 w-auto max-w-[200px]' : 'h-11 w-auto max-w-[150px]'
        }`}
        draggable={false}
      />

      {!isSignage && <div className="w-px h-9 bg-white/25 shrink-0" />}

      <div className={isSignage ? 'text-center' : 'text-right'}>
        <h1
          className={`text-white font-bold leading-tight ${
            isSignage ? 'text-xl' : 'text-lg xl:text-xl'
          }`}
        >
          مؤشرات وكالة التحول الرقمي
        </h1>
      </div>
    </div>
  );
}
