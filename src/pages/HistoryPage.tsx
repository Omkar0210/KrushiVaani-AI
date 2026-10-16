import { Clock, Trash2, Sprout, Leaf, Cherry, Flame, Wheat, ChevronRight, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROPS } from '@/data/translations';
import { reportStorage, formatDate } from '@/services/storageService';
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

interface HistoryPageProps {
  onViewReport: (report: DiagnosisResult) => void;
  onNavigate: (page: string) => void;
}

export function HistoryPage({ onViewReport, onNavigate }: HistoryPageProps) {
  const { t } = useLanguage();
  const reports = reportStorage.getAll();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    reportStorage.delete(id);
    // Force re-render by navigating to same page
    onNavigate('history');
  };

  if (reports.length === 0) {
    return (
      <div className="animate-fade-in min-h-screen pb-24">
        <div className="px-5 py-4 bg-white border-b border-sage-100 sticky top-0 z-40">
          <h1 className="text-lg font-bold text-forest-800">{t.historyTitle}</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-sage-50 flex items-center justify-center mb-4">
            <FileText size={32} className="text-sage-300" />
          </div>
          <p className="font-semibold text-forest-700 text-lg">{t.noReportsYet}</p>
          <p className="text-sm text-sage-400 mt-1 max-w-xs">{t.noReportsDesc}</p>
          <button
            onClick={() => onNavigate('diagnose')}
            className="btn-primary mt-6 flex items-center gap-2"
          >
            <Sprout size={18} />
            {t.diagnoseCrop}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen pb-24">
      <div className="px-5 py-4 bg-white border-b border-sage-100 sticky top-0 z-40 flex items-center justify-between">
        <h1 className="text-lg font-bold text-forest-800">{t.historyTitle}</h1>
        <span className="chip bg-sage-100 text-sage-600 text-xs">{reports.length}</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {reports.map((report) => {
          const Icon = CROP_ICON_MAP[report.crop] || Sprout;
          const cropName = CROPS.find((c) => c.id === report.crop)?.name || report.crop;
          return (
            <div
              key={report.id}
              className="card flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98] hover:shadow-md group"
              onClick={() => onViewReport(report)}
            >
              <div className="w-11 h-11 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-forest-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-forest-800 truncate">{report.suspectedProblem}</p>
                <p className="text-xs text-sage-400">
                  {t.reportOn} {cropName} · {formatDate(report.createdAt)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`chip text-xs ${SEVERITY_COLORS[report.severity] || ''}`}>
                    {t[`severity_${report.severity}` as keyof typeof t]}
                  </span>
                  <span className="chip bg-sage-50 text-sage-500 text-xs">
                    {Math.round(report.confidence * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => handleDelete(report.id, e)}
                  className="p-2 rounded-lg hover:bg-red-50 active:scale-90 transition-all"
                  title={t.deleteReport}
                >
                  <Trash2 size={16} className="text-sage-300 group-hover:text-red-500 transition-colors" />
                </button>
                <ChevronRight size={18} className="text-sage-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
