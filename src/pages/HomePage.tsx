import { TrendingUp, Flag, CalendarDays, Trophy, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { demoData } from '@/data/demoData';
import { DemoTag } from '@/components/Logo';
import type { Tab } from '@/components/BottomNav';

export function HomePage({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { t } = useLang();
  const topWard = demoData.wards[0];
  const totalReports = demoData.wards.reduce((s, w) => s + w.reports, 0);
  const totalResolved = demoData.wards.reduce((s, w) => s + w.resolved, 0);

  return (
    <div className="px-4 pt-5 pb-6 space-y-5 animate-fade-up">
      {/* Hero tagline */}
      <section className="rounded-3xl bg-gradient-to-br from-teal-600 via-teal-600 to-leaf-600 p-5 text-white shadow-soft relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -right-10 top-10 w-20 h-20 rounded-full bg-leaf-400/20" />
        <div className="relative">
          <div className="flex items-center gap-2 text-leaf-200 text-xs font-bold mb-1.5">
            <Sparkles size={14} />
            {t('Madurai Ward Competition', 'மதுரை வார்டு போட்டி')}
          </div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight">
            {t('Clean wards, proud city.', 'சுத்தமான வார்டு, பெருமையான நகரம்.')}
          </h1>
          <p className="text-teal-100 text-sm mt-1.5 font-semibold">
            {t(
              'Report issues, join cleanup drives, and help your ward climb the league.',
              'புகார்களைப் பதிவு செய்யுங்கள், துப்புரவு இயக்கங்களில் சேருங்கள், உங்கள் வார்டை முன்னேற்றுங்கள்.',
            )}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onNavigate('report')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-white text-teal-700 font-bold text-sm py-2.5 active:scale-95 transition-transform shadow-sm"
            >
              <Flag size={16} />
              {t('Report now', 'இப்போது புகார்')}
            </button>
            <button
              onClick={() => onNavigate('drives')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-teal-500/30 ring-1 ring-white/30 text-white font-bold text-sm py-2.5 active:scale-95 transition-transform"
            >
              <CalendarDays size={16} />
              {t('Join a drive', 'இயக்கத்தில் சேர்')}
            </button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-3 gap-3">
        <StatCard
          label={t('Reports', 'புகார்கள்')}
          value={totalReports.toString()}
          icon={<Flag size={18} className="text-teal-600" />}
        />
        <StatCard
          label={t('Resolved', 'தீர்க்கப்பட்டது')}
          value={totalResolved.toString()}
          icon={<TrendingUp size={18} className="text-leaf-600" />}
        />
        <StatCard
          label={t('Wards', 'வார்டுகள்')}
          value={demoData.wards.length.toString()}
          icon={<MapPin size={18} className="text-teal-600" />}
        />
      </section>

      {/* Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            <h2 className="text-lg font-extrabold text-teal-800">
              {t('League Standings', 'லீக் தரவரிசை')}
            </h2>
          </div>
          <DemoTag />
        </div>
        <div className="space-y-2.5">
          {demoData.wards.map((ward, i) => (
            <WardRow key={ward.id} ward={ward} isTop={i === 0} />
          ))}
        </div>
      </section>

      {/* Featured drive */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={20} className="text-teal-600" />
          <h2 className="text-lg font-extrabold text-teal-800">
            {t('Upcoming Drive', 'வரவிருக்கும் இயக்கம்')}
          </h2>
          <DemoTag />
        </div>
        <button
          onClick={() => onNavigate('drives')}
          className="w-full text-left rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-extrabold text-teal-800 text-base">
                {demoData.drives[0].title}
              </h3>
              <p className="text-sm text-teal-500 font-semibold mt-0.5">
                {demoData.drives[0].ward}
              </p>
            </div>
            <ArrowRight size={20} className="text-teal-400 shrink-0" />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs font-bold text-teal-600">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {new Date(demoData.drives[0].date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
            <span>{demoData.drives[0].time}</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-bold text-teal-500 mb-1">
              <span>{t('Participants', 'பங்கேற்பாளர்கள்')}</span>
              <span>
                {demoData.drives[0].participants}/{demoData.drives[0].goal}
              </span>
            </div>
            <div className="h-2 rounded-full bg-teal-50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-leaf-500"
                style={{
                  width: `${(demoData.drives[0].participants / demoData.drives[0].goal) * 100}%`,
                }}
              />
            </div>
          </div>
        </button>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-teal-50 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-teal-800">{value}</div>
      <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

function WardRow({
  ward,
  isTop,
}: {
  ward: (typeof demoData.wards)[number];
  isTop: boolean;
}) {
  const { t } = useLang();
  const change = ward.score - ward.lastWeek;
  const up = change >= 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3.5 ring-1 transition-all ${
        isTop
          ? 'bg-gradient-to-r from-amber-50 to-leaf-50 ring-amber-200 shadow-soft'
          : 'bg-white ring-teal-50 shadow-card'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
          ward.rank === 1
            ? 'bg-amber-400 text-white'
            : ward.rank === 2
              ? 'bg-teal-200 text-teal-700'
              : ward.rank === 3
                ? 'bg-orange-200 text-orange-700'
                : 'bg-teal-50 text-teal-500'
        }`}
      >
        {ward.rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-teal-800 text-sm truncate">{ward.name}</div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-teal-400">
          <span>{ward.reports} {t('reports', 'புகார்கள்')}</span>
          <span>·</span>
          <span>{ward.resolved} {t('resolved', 'தீர்க்கப்பட்டது')}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-extrabold text-teal-800 text-base">{ward.score}</div>
        <div
          className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
            up ? 'text-leaf-600' : 'text-rose-500'
          }`}
        >
          <TrendingUp size={11} className={up ? '' : 'rotate-180'} />
          {Math.abs(change)}
        </div>
      </div>
    </div>
  );
}
