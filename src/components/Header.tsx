import { Languages } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { Logo } from './Logo';

export function Header() {
  const { lang, toggle, t } = useLang();

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-teal-100/80">
      <div className="mx-auto max-w-md px-4 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-bold text-teal-700 ring-1 ring-teal-200 active:scale-95 transition-transform"
          aria-label="Toggle language"
        >
          <Languages size={16} />
          {lang === 'en' ? 'EN' : 'தம'}
          <span className="text-teal-300 font-normal">/</span>
          <span className="text-teal-400 font-semibold">
            {lang === 'en' ? 'தம' : 'EN'}
          </span>
        </button>
      </div>
    </header>
  );
}
