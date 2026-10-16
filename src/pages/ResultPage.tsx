import { ArrowLeft, AlertTriangle, CheckCircle2, Info, ExternalLink, Share2, Save, Microscope, Sprout, Leaf, Cherry, Flame, Wheat, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROPS } from '@/data/translations';
import type { DiagnosisResult } from '@/types';
import { reportStorage, formatDate } from '@/services/storageService';

const CROP_ICON_MAP: Record<string, typeof Sprout> = {
  cotton: Sprout,
  soybean: Leaf,
  tomato: Cherry,
  chilli: Flame,
  rice: Wheat,
};

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; icon: typeof AlertTriangle }> = {
  low: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2 },
  moderate: { color: 'text-amber-700', bg: 'bg-amber-100', icon: AlertTriangle },
  high: { color: 'text-red-700', bg: 'bg-red-100', icon: AlertTriangle },
};

const CATEGORY_LABELS: Record<string, string> = {
  pest: 'Pest',
  disease: 'Disease',
  nutrient: 'Nutrient',
  environmental: 'Environmental',
};

interface ResultPageProps {
  result: DiagnosisResult;
  onBack: () => void;
  onNewDiagnosis: () => void;
}

export function ResultPage({ result, onBack, onNewDiagnosis }: ResultPageProps) {
  const { t } = useLanguage();
  const sev = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.moderate;
  const SeverityIcon = sev.icon;
  const cropInfo = CROPS.find((c) => c.id === result.crop);
  const CropIcon = CROP_ICON_MAP[result.crop] || Sprout;
  const confidencePct = Math.round(result.confidence * 100);

  const handleShareWhatsApp = () => {
    const lines = [
      `*${t.appName} - ${t.diagnosisResult}*`,
      '',
      `*${t.suspectedProblem}:* ${result.suspectedProblem}`,
      `*${t.severity}:* ${t[`severity_${result.severity}` as keyof typeof t]}`,
      `*${t.confidence}:* ${confidencePct}%`,
      `*Crop:* ${cropInfo?.name || result.crop}`,
      `*Stage:* ${t[`stage_${result.stage}` as keyof typeof t]}`,
      result.location ? `*Location:* ${result.location}` : '',
      '',
      `*${t.recommendedNextSteps}:*`,
      ...result.nextSteps.map((s, i) => `${i + 1}. ${s}`),
      '',
      `*${t.preventiveGuidance}:*`,
      ...result.preventiveGuidance.map((s, i) => `${i + 1}. ${s}`),
      '',
      `_${t.sampleResultNotice}_`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleSave = () => {
    reportStorage.save(result);
    onBack();
  };

  return (
    <div className="animate-fade-in min-h-screen pb-24">
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-sage-100 sticky top-0 z-40">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-sage-50 active:scale-90 transition-all">
          <ArrowLeft size={22} className="text-forest-700" />
        </button>
        <h1 className="text-lg font-bold text-forest-800">{t.diagnosisResult}</h1>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Sample notice banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{t.sampleResultNotice}</p>
        </div>

        {/* Main result card */}
        <div className="card-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center">
              <CropIcon size={24} className="text-forest-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-sage-400">
                {cropInfo?.name} · {t[`stage_${result.stage}` as keyof typeof t]}
                {result.location ? ` · ${result.location}` : ''}
              </p>
              <p className="text-xs text-sage-400">{formatDate(result.createdAt)}</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 chip ${sev.bg} ${sev.color} mb-3`}>
            <SeverityIcon size={14} />
            {t.severity}: {t[`severity_${result.severity}` as keyof typeof t]}
          </div>

          <h2 className="text-xl font-bold text-forest-900 mb-1">{result.suspectedProblem}</h2>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-sage-100 text-sage-700 text-xs">
              {CATEGORY_LABELS[result.category]}
            </span>
            <span className="chip bg-forest-50 text-forest-700 text-xs">
              <ShieldCheck size={12} />
              {t.confidence}: {confidencePct}%
            </span>
          </div>

          {/* Confidence bar */}
          <div className="mt-3">
            <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-500 rounded-full transition-all duration-1000"
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        {result.photoUrls.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-forest-700 mb-3 text-sm">{t.uploadPhotos}</h3>
            <div className="grid grid-cols-3 gap-2">
              {result.photoUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-sage-200">
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives */}
        {result.alternatives.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-forest-700 mb-3 flex items-center gap-2">
              <Info size={16} className="text-sage-400" />
              {t.alternativeCauses}
            </h3>
            <div className="space-y-3">
              {result.alternatives.map((alt, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-forest-700">{alt.name}</span>
                    <span className="text-sage-400 font-medium">{Math.round(alt.likelihood * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round(alt.likelihood * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="card">
          <h3 className="font-semibold text-forest-700 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-forest-500" />
            {t.recommendedNextSteps}
          </h3>
          <ol className="space-y-2.5">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-forest-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Preventive guidance */}
        <div className="card">
          <h3 className="font-semibold text-forest-700 mb-3 flex items-center gap-2">
            <ShieldCheck size={16} className="text-sage-500" />
            {t.preventiveGuidance}
          </h3>
          <ul className="space-y-2">
            {result.preventiveGuidance.map((g, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0 mt-2" />
                <span className="text-sm text-forest-700 leading-relaxed">{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources */}
        {result.sources && (
          <div className="card">
            <h3 className="font-semibold text-forest-700 mb-2 text-sm">{t.sources}</h3>
            <a
              href={result.sources.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-700 hover:underline"
            >
              <ExternalLink size={14} />
              {result.sources.label}
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleShareWhatsApp}
            className="w-full bg-[#25D366] text-white font-semibold rounded-xl px-5 py-3.5 transition-all active:scale-95 hover:bg-[#1da851] flex items-center justify-center gap-2 text-base"
          >
            <Share2 size={20} />
            {t.shareOnWhatsApp}
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {t.saveReport}
            </button>
            <button
              onClick={onNewDiagnosis}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Microscope size={18} />
              {t.newDiagnosis}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
