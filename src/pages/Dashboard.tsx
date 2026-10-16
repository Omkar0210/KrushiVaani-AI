import { Microscope, Mic, Clock, ChevronRight, Sprout, Leaf, Cherry, Flame, Wheat, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { reportStorage, formatDate } from '@/services/storageService';
import { CROPS } from '@/data/translations';
import type { DiagnosisResult } from '@/types';

const CROP_ICON_MAP: Record<string, typeof Sprout> = {
  cotton: Sprout,
  soybean: Leaf,
  tomato: Cherry,
  chilli: Flame,
  rice: Wheat,
};

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewReport: (report: DiagnosisResult) => void;
}

export function Dashboard({ onNavigate, onViewReport }: DashboardProps) {
  const { t, lang } = useLanguage();
  const reports = reportStorage.getAll();
  const recent = reports.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-forest-700 to-forest-900 px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-forest-200 text-sm">{t.welcome}</p>
            <h2 className="text-2xl font-bold text-white mt-0.5">{t.appName}</h2>
            <p className="text-forest-300 text-sm mt-1">{t.tagline}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mt-4">
          <p className="text-forest-200 text-xs mb-2 font-medium">{t.selectLanguage}</p>
          <LanguageSelector variant="full" />
        </div>
      </div>

      {/* Main actions */}
      <div className="px-5 -mt-4 space-y-3">
        <button
          onClick={() => onNavigate('diagnose')}
          className="w-full bg-white rounded-2xl shadow-lg border border-sage-100 p-4 flex items-center gap-4 transition-all active:scale-[0.98] hover:shadow-xl group"
        >
          <div className="w-14 h-14 rounded-2xl bg-forest-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Microscope size={28} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-forest-800 text-lg">{t.diagnoseCrop}</h3>
            <p className="text-sm text-sage-500">{t.diagnoseCropDesc}</p>
          </div>
          <ChevronRight size={24} className="text-sage-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate('voice')}
          className="w-full bg-white rounded-2xl shadow-lg border border-sage-100 p-4 flex items-center gap-4 transition-all active:scale-[0.98] hover:shadow-xl group"
        >
          <div className="w-14 h-14 rounded-2xl bg-sage-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mic size={28} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-forest-800 text-lg">{t.voiceAssistant}</h3>
            <p className="text-sm text-sage-500">{t.voiceAssistantDesc}</p>
          </div>
          <ChevronRight size={24} className="text-sage-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Recent reports */}
      <div className="px-5 mt-6 mb-24">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-forest-800 text-lg">{t.recentReports}</h3>
          {reports.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="text-sm font-medium text-forest-600 hover:text-forest-700 flex items-center gap-1"
            >
              {t.viewAll}
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="card text-center py-10">
            <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-3">
              <Clock size={28} className="text-sage-300" />
            </div>
            <p className="font-semibold text-forest-700">{t.noReportsYet}</p>
            <p className="text-sm text-sage-400 mt-1 max-w-xs mx-auto">{t.noReportsDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((report) => {
              const Icon = CROP_ICON_MAP[report.crop] || Sprout;
              const cropName = CROPS.find((c) => c.id === report.crop)?.name || report.crop;
              return (
                <button
                  key={report.id}
                  onClick={() => onViewReport(report)}
                  className="w-full card flex items-center gap-3 text-left transition-all active:scale-[0.98] hover:shadow-md"
                >
                  <div className="w-11 h-11 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-forest-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-forest-800 truncate">{report.suspectedProblem}</p>
                    <p className="text-xs text-sage-400">
                      {cropName} · {formatDate(report.createdAt)}
                    </p>
                  </div>
                  <span className={`chip text-xs ${SEVERITY_COLORS[report.severity] || ''}`}>
                    {t[`severity_${report.severity}` as keyof typeof t]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
