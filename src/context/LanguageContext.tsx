import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta';

type LanguageContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  toggle: () => void;
  t: (en: string, ta: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggle = () => setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
  const t = (en: string, ta: string) => (lang === 'en' ? en : ta);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
