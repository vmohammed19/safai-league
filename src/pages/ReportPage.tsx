import { useState } from 'react';
import { Camera, MapPin, Send, CheckCircle2, Flag, ChevronDown } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { demoData } from '@/data/demoData';
import { DemoTag } from '@/components/Logo';

export function ReportPage() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState(t('Garbage', 'குப்பை'));
  const [ward, setWard] = useState(demoData.wards[3].name);
  const [description, setDescription] = useState('');

  const categories = [
    t('Garbage', 'குப்பை'),
    t('Drainage', 'ாய்க்கால்'),
    t('Plastic', 'பிளாஸ்டிக்'),
    t('Road', 'சாலை'),
    t('Other', 'மற்றவை'),
  ];

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
              'Your ward team has been notified. Thank you for keeping Madurai clean.',
              'உங்கள் வார்டு அணிக்கு தெரிவிக்கப்பட்டது. மதுரையை சுத்தமாக வைப்பதற்கு நன்றி.',
            )}
          </p>
          <div className="mt-4 flex justify-center">
            <DemoTag />
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 w-full rounded-2xl bg-teal-600 text-white font-bold py-3 active:scale-95 transition-transform"
          >
            {t('File Another Report', 'மற்றொரு புகார்')}
          </button>
        </div>
      </div>
    );
  }

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
            'Spot something dirty? Tell your ward team.',
            'ஏதாவது அசுத்தம் கண்டீர்களா? உங்கள் வார்டு அணியிடம் சொல்லுங்கள்.',
          )}
        </p>
      </div>

      {/* Photo upload */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Photo', 'படம்')}
        </label>
        <button className="w-full h-36 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <Camera size={24} className="text-teal-600" />
          </div>
          <span className="text-sm font-bold text-teal-500">
            {t('Tap to add a photo', 'படம் சேர்க்க தட்டவும்')}
          </span>
        </button>
      </div>

      {/* Category */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Category', 'வகை')}
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                category === cat
                  ? 'bg-teal-600 text-white shadow-soft'
                  : 'bg-teal-50 text-teal-600 ring-1 ring-teal-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ward */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Ward', 'வார்டு')}
        </label>
        <div className="relative">
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="w-full appearance-none rounded-2xl bg-teal-50 text-teal-800 font-bold text-sm px-4 py-3 ring-1 ring-teal-100 focus:ring-2 focus:ring-teal-400 outline-none"
          >
            {demoData.wards.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Location */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Location', 'இடம்')}
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 ring-1 ring-teal-100">
          <MapPin size={18} className="text-teal-600" />
          <span className="text-sm font-bold text-teal-700 flex-1">
            {t('Auto-detect from GPS', 'GPS-லிருந்து தானாகக் கண்டறி')}
          </span>
          <span className="text-xs font-bold text-teal-400">{t('Detect', 'கண்டறி')}</span>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-teal-50">
        <label className="text-sm font-bold text-teal-700 mb-2 block">
          {t('Description', 'விளக்கம்')}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={t('Describe the issue...', 'பிரச்சனையை விளக்குங்கள்...')}
          className="w-full rounded-2xl bg-teal-50 text-teal-800 text-sm font-semibold px-4 py-3 ring-1 ring-teal-100 focus:ring-2 focus:ring-teal-400 outline-none resize-none placeholder:text-teal-300"
        />
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-leaf-600 text-white font-extrabold py-3.5 shadow-soft active:scale-95 transition-transform"
      >
        <Send size={18} />
        {t('Submit Report', 'புகார் சமர்ப்பி')}
      </button>

      <p className="text-center text-xs text-teal-400 font-semibold">
        {t('Demo mode — reports are not stored.', 'டெமோ முறை — புகார்கள் சேமிக்கப்படாது.')}
      </p>
    </div>
  );
}
