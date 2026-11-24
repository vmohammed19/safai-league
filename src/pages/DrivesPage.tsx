import { CalendarDays, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { demoData } from '@/data/demoData';
import { DemoTag } from '@/components/Logo';

export function DrivesPage() {
  const { t } = useLang();

  return (
    <div className="px-4 pt-5 pb-6 space-y-5 animate-fade-up">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={22} className="text-teal-600" />
          <h1 className="text-2xl font-extrabold text-teal-800">
            {t('Cleanup Drives', 'துப்புரவு இயக்கங்கள்')}
          </h1>
        </div>
        <p className="text-sm text-teal-500 font-semibold">
          {t('Join your neighbours. Win points for your ward.', 'உங்கள் அண்டை வீட்டாருடன் சேர். உங்கள் வார்டுக்கு புள்ளிகள் பெறுங்கள்.')}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-teal-400 uppercase tracking-wide">
          {t('Upcoming', 'வரவிருக்கும்')}
        </h2>
        <DemoTag />
      </div>

      <div className="space-y-4">
        {demoData.drives.map((drive) => (
          <DriveCard key={drive.id} drive={drive} />
        ))}
      </div>

      {/* Past drives */}
      <div className="pt-2">
        <h2 className="text-sm font-extrabold text-teal-400 uppercase tracking-wide mb-3">
          {t('Recently Completed', 'சமீபத்தில் முடிந்தது')}
        </h2>
        <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="text-leaf-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-teal-800 text-sm">
                {t('Anna Nagar Tree Plantation', 'அண்ணா நகர் மரம் நடுதல்')}
              </div>
              <div className="text-xs font-bold text-teal-400 mt-0.5">
                {t('52 participants · 80 trees planted', '52 பங்கேற்பாளர்கள் · 80 மரங்கள் நடப்பட்டன')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriveCard({ drive }: { drive: (typeof demoData.drives)[number] }) {
  const { t } = useLang();
  const pct = Math.round((drive.participants / drive.goal) * 100);
  const dateObj = new Date(drive.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-IN', { month: 'short' });

  return (
    <div className="rounded-3xl bg-white overflow-hidden shadow-card ring-1 ring-teal-50">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-br from-teal-500 to-leaf-500 relative">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/15" />
        <div className="absolute right-8 top-3 w-14 h-14 rounded-full bg-white/10" />
        <div className="absolute left-4 top-3 bg-white rounded-2xl px-3 py-1.5 text-center shadow-soft">
          <div className="text-lg font-extrabold text-teal-700 leading-none">{day}</div>
          <div className="text-[10px] font-bold text-teal-500 uppercase">{month}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-extrabold text-teal-800 text-base">{drive.title}</h3>
        <p className="text-sm text-teal-500 font-semibold mt-0.5">{drive.ward}</p>

        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
            <Clock size={14} />
            {drive.time}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
            <MapPin size={14} />
            {drive.location}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-teal-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Users size={13} />
              {drive.participants} {t('joined', 'சேர்ந்தனர்')}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-teal-50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-leaf-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-2xl bg-teal-600 text-white font-bold text-sm py-3 active:scale-95 transition-transform">
          {t('Join Drive', 'இயக்கத்தில் சேர்')}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
