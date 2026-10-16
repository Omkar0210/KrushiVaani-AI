import { Home, Microscope, Mic, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  current: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();

  const items = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'diagnose', label: t.navDiagnose, icon: Microscope },
    { id: 'voice', label: t.navVoice, icon: Mic },
    { id: 'history', label: t.navHistory, icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sage-100 shadow-lg">
      <div className="flex items-stretch justify-around max-w-md mx-auto px-2 py-1.5 safe-area-bottom">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 flex-1 ${
                active ? 'text-forest-600' : 'text-sage-400'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${active ? 'bg-forest-50 scale-110' : ''}`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
