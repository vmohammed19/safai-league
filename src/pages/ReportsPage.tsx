import { useState, useEffect, useCallback } from 'react';
import { Flag, Clock, MapPin, Image as ImageIcon, Loader2, Inbox, Plus } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { supabase, type Report } from '@/lib/supabase';
import type { Tab } from '@/components/BottomNav';

export function ReportsPage({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { t } = useLang();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('reports')
      .select('id, ward_id, photo_url, note, status, created_at, wards(id, name, short_name, points, created_at)')
      .order('created_at', { ascending: false });

    if (err) {
      setError(t('Could not load reports. Please try again.', 'புகார்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'));
      setLoading(false);
      return;
    }
    setReports(data || []);
    setLoading(false);
  }, [t]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="px-4 pt-5 pb-6 space-y-5 animate-fade-up">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flag size={22} className="text-teal-600" />
          <h1 className="text-2xl font-extrabold text-teal-800">
            {t('Community Reports', 'சமூக புகார்கள்')}
          </h1>
        </div>
        <p className="text-sm text-teal-500 font-semibold">
          {t('Recent issues reported across all wards.', 'அனைத்து வார்டுகளிலும் சமீபத்திய புகார்கள்.')}
        </p>
      </div>

      {/* New report button */}
      <button
        onClick={() => onNavigate('report')}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-leaf-600 text-white font-bold py-3 shadow-soft active:scale-95 transition-transform"
      >
        <Plus size={18} />
        {t('File a New Report', 'புதிய புகார் பதிவு')}
      </button>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <Loader2 size={28} className="animate-spin text-teal-400" />
          <span className="text-sm font-bold text-teal-400">
            {t('Loading reports...', 'புகார்கள் ஏறப்படுகின்றன...')}
          </span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 ring-1 ring-rose-200">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && reports.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
            <Inbox size={32} className="text-teal-300" />
          </div>
          <h2 className="font-extrabold text-teal-700">
            {t('No reports yet', 'இன்னும் புகார்கள் இல்லை')}
          </h2>
          <p className="text-sm text-teal-400 font-semibold max-w-xs">
            {t('Be the first to report a cleanliness issue in your ward.', 'உங்கள் வார்டில் முதலில் புகார் செய்பவராக இருங்கள்.')}
          </p>
          <button
            onClick={() => onNavigate('report')}
            className="mt-2 rounded-2xl bg-teal-600 text-white font-bold px-6 py-2.5 active:scale-95 transition-transform"
          >
            {t('Report now', 'இப்போது புகார்')}
          </button>
        </div>
      )}

      {/* Report cards */}
      {!loading && !error && reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <ReportCard key={report.id} report={report} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report, index }: { report: Report; index: number }) {
  const { t } = useLang();
  const wardName = (Array.isArray(report.wards) ? report.wards[0]?.name : report.wards?.name) || t('Unknown ward', 'தெரியாத வார்டு');
  const timeStr = formatTime(report.created_at, t('Just now', 'இப்போது'));

  const statusStyles: Record<string, string> = {
    open: 'bg-rose-50 text-rose-600 ring-rose-200',
    'in-progress': 'bg-amber-50 text-amber-600 ring-amber-200',
    resolved: 'bg-leaf-50 text-leaf-600 ring-leaf-200',
  };
  const statusLabels: Record<string, { en: string; ta: string }> = {
    open: { en: 'Open', ta: 'திறந்த' },
    'in-progress': { en: 'In Progress', ta: 'நடந்து கொண்டிருக்கிறது' },
    resolved: { en: 'Resolved', ta: 'தீர்க்கப்பட்டது' },
  };
  const status = report.status in statusLabels ? report.status : 'open';

  return (
    <div
      className="rounded-3xl bg-white overflow-hidden shadow-card ring-1 ring-teal-50 animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {/* Photo */}
      {report.photo_url ? (
        <img
          src={report.photo_url}
          alt={report.note || 'Report photo'}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-32 bg-teal-50 flex items-center justify-center">
          <ImageIcon size={32} className="text-teal-300" />
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-teal-700 min-w-0">
            <MapPin size={15} className="text-teal-500 shrink-0" />
            <span className="truncate">{wardName}</span>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${statusStyles[status] || statusStyles.open}`}
          >
            {statusLabels[status].en === 'Open' ? t('Open', 'திறந்த') : statusLabels[status].en === 'In Progress' ? t('In Progress', 'நடந்து கொண்டிருக்கிறது') : t('Resolved', 'தீர்க்கப்பட்டது')}
          </span>
        </div>

        {report.note && (
          <p className="text-sm text-teal-600 font-semibold mb-2 line-clamp-2">
            {report.note}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
          <Clock size={13} />
          {timeStr}
        </div>
      </div>
    </div>
  );
}

function formatTime(iso: string, fallback: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return fallback;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
