import { Home, Flag, CalendarDays, User } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export type Tab = 'home' | 'report' | 'drives' | 'profile';

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  const { t } = useLang();

  const items: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: t('Home', 'முகப்பு'), icon: Home },
    { id: 'report', label: t('Report', 'புகார்'), icon: Flag },
    { id: 'drives', label: t('Drives', 'இயக்கங்கள்'), icon: CalendarDays },
    { id: 'profile', label: t('Profile', 'சுயவிவரம்'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-nav border-t border-teal-100">
      <div className="mx-auto max-w-md flex items-stretch justify-around px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5 transition-colors"
              aria-label={item.label}
            >
              {isActive && (
                <span className="absolute -top-0.5 h-1 w-8 rounded-full bg-gradient-to-r from-teal-500 to-leaf-500" />
              )}
              <Icon
                size={23}
                strokeWidth={isActive ? 2.5 : 2}
                className={
                  isActive
                    ? 'text-teal-600 transition-transform'
                    : 'text-teal-400/70'
                }
              />
              <span
                className={`text-[11px] font-bold tracking-wide transition-colors ${
                  isActive ? 'text-teal-700' : 'text-teal-400/70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
