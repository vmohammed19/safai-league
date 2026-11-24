import { User, Award, Flag, CalendarDays, Star, TrendingUp, Settings, ChevronRight } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { demoData } from '@/data/demoData';
import { DemoTag } from '@/components/Logo';

export function ProfilePage() {
  const { t } = useLang();
  const p = demoData.profile;

  const badges = [
    { name: t('First Report', 'முதல் புகார்'), icon: Flag, color: 'bg-teal-100 text-teal-600' },
    { name: t('Drive Hero', 'இயக்க நாயகன்'), icon: Award, color: 'bg-leaf-100 text-leaf-600' },
    { name: t('7-Day Streak', '7-நாள் தொடர்'), icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="px-4 pt-5 pb-6 space-y-5 animate-fade-up">
      {/* Profile card */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-leaf-600 p-5 text-white shadow-soft relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-12 top-8 w-16 h-16 rounded-full bg-leaf-400/20" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center shrink-0">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold truncate">{p.name}</h1>
            <p className="text-teal-100 text-sm font-semibold truncate">{p.ward}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Star size={14} className="text-amber-300 fill-amber-300" />
              <span className="font-extrabold text-sm">{p.points} {t('points', 'புள்ளிகள்')}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <DemoTag className="bg-white/15 text-white ring-white/20" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatBox
          icon={<Flag size={20} className="text-teal-600" />}
          value={p.reportsFiled}
          label={t('Reports Filed', 'புகார்கள்')}
        />
        <StatBox
          icon={<CalendarDays size={20} className="text-leaf-600" />}
          value={p.drivesJoined}
          label={t('Drives Joined', 'இயக்கங்கள்')}
        />
      </div>

      {/* Badges */}
      <section>
        <h2 className="text-lg font-extrabold text-teal-800 mb-3 flex items-center gap-2">
          <Award size={20} className="text-amber-500" />
          {t('Your Badges', 'உங்கள் பதக்கங்கள்')}
        </h2>
        <div className="space-y-2.5">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.name}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-card ring-1 ring-teal-50"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                  <Icon size={20} />
                </div>
                <span className="font-bold text-teal-800 text-sm flex-1">{b.name}</span>
                <ChevronRight size={18} className="text-teal-300" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Your ward */}
      <section>
        <h2 className="text-lg font-extrabold text-teal-800 mb-3">
          {t('Your Ward', 'உங்கள் வார்டு')}
        </h2>
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-teal-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-teal-800 text-sm">{p.ward}</div>
              <div className="text-xs font-bold text-leaf-600 mt-0.5">
                {t('Rank 1 · 1820 points', 'தரவரிசை 1 · 1820 புள்ளிகள்')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center font-extrabold text-white text-sm">
              1
            </div>
          </div>
        </div>
      </section>

      {/* Settings */}
      <button className="w-full flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-teal-50 active:scale-[0.98] transition-transform">
        <Settings size={20} className="text-teal-500" />
        <span className="font-bold text-teal-700 text-sm flex-1 text-left">
          {t('Settings', 'அமைப்புகள்')}
        </span>
        <ChevronRight size={18} className="text-teal-300" />
      </button>

      <p className="text-center text-xs text-teal-400 font-semibold">
        {t('Member since September 2026', 'செப்டம்பர் 2026 முதல் உறுப்பினர்')}
      </p>
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-teal-50">
      <div className="mb-1.5">{icon}</div>
      <div className="text-2xl font-extrabold text-teal-800">{value}</div>
      <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}
