import { Leaf } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { box: 'w-9 h-9', icon: 18, text: 'text-lg' },
    md: { box: 'w-11 h-11', icon: 22, text: 'text-xl' },
    lg: { box: 'w-14 h-14', icon: 28, text: 'text-2xl' },
  }[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims.box} rounded-2xl bg-gradient-to-br from-teal-500 to-leaf-500 flex items-center justify-center shadow-soft shrink-0`}
      >
        <Leaf size={dims.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <div className="leading-none">
        <div className={`${dims.text} font-extrabold text-teal-800 tracking-tight`}>
          Safai League
        </div>
      </div>
    </div>
  );
}

export function DemoTag({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Demo data
    </span>
  );
}
