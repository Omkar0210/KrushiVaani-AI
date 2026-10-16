import { Sprout } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface AppHeaderProps {
  showLanguage?: boolean;
}

export function AppHeader({ showLanguage = true }: AppHeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md border-b border-sage-100 sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
          <Sprout size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-forest-800 leading-tight">{t.appName}</h1>
          <p className="text-xs text-sage-500 leading-tight">{t.tagline}</p>
        </div>
      </div>
      {showLanguage && <LanguageSelector />}
    </header>
  );
}
