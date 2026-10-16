import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language, AppTranslation } from '@/types';
import { translations, LANGUAGES } from '@/data/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: AppTranslation;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'krushivaani_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && translations[saved]) return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export { LANGUAGES };
