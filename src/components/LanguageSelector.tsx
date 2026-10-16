import { Globe, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full';
}

export function LanguageSelector({ variant = 'compact' }: LanguageSelectorProps) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  if (variant === 'full') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`chip justify-center py-2.5 ${
              lang === l.code ? 'chip-selected' : 'chip-unselected'
            }`}
          >
            <span className="font-medium">{l.nativeLabel}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-sage-100 hover:bg-sage-200 rounded-full px-3 py-2 transition-all active:scale-95"
      >
        <Globe size={18} className="text-forest-600" />
        <span className="text-sm font-medium text-forest-700">{current.nativeLabel}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-sage-100 py-1 min-w-[160px] z-50 animate-scale-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-sage-50 transition-colors text-left"
            >
              <span className="text-sm text-forest-700">
                {l.nativeLabel}
                <span className="text-sage-400 ml-2 text-xs">{l.label}</span>
              </span>
              {lang === l.code && <Check size={16} className="text-forest-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
