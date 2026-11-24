import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  Flag,
  ChevronDown,
  X,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { supabase, type Ward } from '@/lib/supabase';

export function ReportPage() {
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingWards, setLoadingWards] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wardId, setWardId] = useState<string>('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('wards')
        .select('id, name, short_name, points, created_at')
        .order('short_name');
      if (err) {
        setError(t('Could not load wards. Please try again.', 'வார்டுகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'));
        setLoadingWards(false);
        return;
      }
      const sorted = (data || []).sort((a, b) => {
        const na = parseInt(a.short_name.replace(/\D/g, ''), 10) || 0;
        const nb = parseInt(b.short_name.replace(/\D/g, ''), 10) || 0;
        return na - nb;
      });
      setWards(sorted);
      if (sorted.length > 0) setWardId(sorted[0].id);
      setLoadingWards(false);
    })();
  }, [t]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setError(null);
    if (!wardId) {
      setError(t('Please select a ward.', 'வார்டைத் தேர்ந்தெடுக்கவும்.'));
      return;
    }

    setSubmitting(true);

    let photoUrl: string | null = null;

    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('report-photos')
        .upload(fileName, selectedFile, { contentType: selectedFile.type });

      if (uploadErr) {
        setError(t('Photo upload failed. Please try again.', 'படப் பதிவேற்றம் தோல்வி. மீண்டும் முயற்சிக்கவும்.'));
        setSubmitting(false);
        return;
      }

      const { data: pubData } = supabase.storage
        .from('report-photos')
        .getPublicUrl(fileName);
      photoUrl = pubData.publicUrl;
    }

    const { error: insertErr } = await supabase.from('reports').insert({
      ward_id: wardId,
      photo_url: photoUrl,
      note: note.trim() || null,
      status: 'open',
    });

    if (insertErr) {
      setError(t('Could not submit report. Please try again.', 'புகாரைச் சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
    clearPhoto();
    setNote('');
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
  };

  // ── Success screen ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className="px-4 pt-10 pb-6 animate-pop-in">
        <div className="rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-teal-50">
          <div className="w-16 h-16 rounded-full bg-leaf-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-leaf-600" />
          </div>
          <h2 className="text-xl font-extrabold text-teal-800">
            {t('Report Submitted!', 'புகார் சமர்ப்பிக்கப்பட்டது!')}
          </h2>
          <p className="text-sm text-teal-500 font-semibold mt-2">
            {t(
              'Your ward has been awarded 10 points. Thank you for keeping Madurai clean.',
              'உங்கள் வார்டுக்கு 10 புள்ளிகள் வழங்கப்பட்டன. மதுரையை சுத்தமாக வைப்பதற்கு நன்றி.',
            )}
          </p>
          <button
            onClick={resetForm}
            className="mt-6 w-full rounded-2xl bg-teal-600 text-white font-bold py-3 active:scale-95 transition-transform"
          >
            {t('File Another Report', 'மற்றொரு புகார்')}
          </button>
        </div>
      </div>
    );
  }

  // ── Report form ─────────────────────────────────────────────
  return (
    <div className="px-4 pt-5 pb-6 space-y-5 animate-fade-up">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flag size={22} className="text-teal-600" />
          <h1 className="text-2xl font-extrabold text-teal-800">
            {t('Report an Issue', 'புகார் பதிவு')}
          </h1>
        </div>
        <p className="text-sm text-teal-500 font-semibold">
          {t(
            'Spot something dirty? Tell your ward team and earn 10 points.',
            'ஏதாவது அசுத்தம் கண்டீர்களா? உங்கள் வார்டு அணியிடம் சொல்லுங்கள், 10 புள்ளிகள் பெறுங்கள்.',
          )}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 ring-1 ring-rose-200 animate-pop-in">
          {error}
        </div>
      )}

      {/* Photo upload */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Photo', 'படம்')}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-teal-100">
            <img src={previewUrl} alt="Report preview" className="w-full h-52 object-cover" />
            <button
              onClick={clearPhoto}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center active:scale-90 transition-transform"
              aria-label="Remove photo"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <Camera size={24} className="text-teal-600" />
            </div>
            <span className="text-sm font-bold text-teal-500">
              {t('Take or upload a photo', 'படம் எடுக்க அல்லது பதிவேற்றவும்')}
            </span>
          </button>
        )}
      </div>

      {/* Ward dropdown */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Your Ward', 'உங்கள் வார்டு')}
        </label>
        {loadingWards ? (
          <div className="flex items-center gap-2 text-sm font-bold text-teal-400 py-3">
            <Loader2 size={16} className="animate-spin" />
            {t('Loading wards...', 'வார்டுகள் ஏறப்படுகின்றன...')}
          </div>
        ) : (
          <div className="relative">
            <select
              value={wardId}
              onChange={(e) => setWardId(e.target.value)}
              className="w-full appearance-none rounded-2xl bg-teal-50 text-teal-800 font-bold text-sm px-4 py-3 ring-1 ring-teal-100 focus:ring-2 focus:ring-teal-400 outline-none"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Optional note */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Note (optional)', 'குறிப்பு (விரும்பினால்)')}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={t('Describe the issue...', 'பிரச்சனையை விளக்குங்கள்...')}
          className="w-full rounded-2xl bg-teal-50 text-teal-800 text-sm font-semibold px-4 py-3 ring-1 ring-teal-100 focus:ring-2 focus:ring-teal-400 outline-none resize-none placeholder:text-teal-300"
        />
      </div>

      {/* Points badge */}
      <div className="flex items-center gap-2 rounded-2xl bg-leaf-50 px-4 py-3 ring-1 ring-leaf-200">
        <div className="w-8 h-8 rounded-full bg-leaf-500 flex items-center justify-center shrink-0">
          <span className="text-white font-extrabold text-sm">+10</span>
        </div>
        <span className="text-sm font-bold text-leaf-700">
          {t('Your ward earns 10 points on submit', 'சமர்ப்பிக்கும்போது உங்கள் வார்டு 10 புள்ளிகள் பெறும்')}
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || loadingWards}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-leaf-600 text-white font-extrabold py-3.5 shadow-soft active:scale-95 transition-transform disabled:opacity-60 disabled:active:scale-100"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t('Submitting...', 'சமர்ப்பிக்கப்படுகிறது...')}
          </>
        ) : (
          <>
            <Send size={18} />
            {t('Submit Report', 'புகார் சமர்ப்பி')}
          </>
        )}
      </button>
    </div>
  );
}

export function NoPhotoIcon({ className = '' }: { className?: string }) {
  return <ImageIcon className={className} />;
}
