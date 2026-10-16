import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Camera, X, Sparkles, Sprout, Leaf, Cherry, Flame, Wheat, MapPin, Type, ImagePlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROPS } from '@/data/translations';
import type { CropType, GrowthStage, DiagnosisResult } from '@/types';
import { generateDiagnosis } from '@/services/diagnosisService';

const CROP_ICON_MAP: Record<string, typeof Sprout> = {
  cotton: Sprout,
  soybean: Leaf,
  tomato: Cherry,
  chilli: Flame,
  rice: Wheat,
};

const STAGES: GrowthStage[] = ['seedling', 'vegetative', 'flowering', 'fruiting', 'maturity'];

interface DiagnosisPageProps {
  onBack: () => void;
  onResult: (result: DiagnosisResult) => void;
}

export function DiagnosisPage({ onBack, onResult }: DiagnosisPageProps) {
  const { t } = useLanguage();
  const [crop, setCrop] = useState<CropType | null>(null);
  const [stage, setStage] = useState<GrowthStage | null>(null);
  const [location, setLocation] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be selected again
    e.target.value = '';
  }, []);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const replacePhoto = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => {
          const next = [...prev];
          next[index] = reader.result as string;
          return next;
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAnalyze = () => {
    setError('');
    if (!crop) {
      setError(t.selectCrop);
      return;
    }
    if (!stage) {
      setError(t.selectStage);
      return;
    }
    if (!symptoms.trim()) {
      setError(t.describeSymptoms);
      return;
    }

    setAnalyzing(true);
    // Simulate analysis delay for UX
    setTimeout(() => {
      const result = generateDiagnosis({
        crop,
        stage,
        location: location.trim(),
        symptoms: symptoms.trim(),
        photoUrls: photos,
      });
      setAnalyzing(false);
      onResult(result);
    }, 1800);
  };

  return (
    <div className="animate-fade-in min-h-screen pb-24">
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-sage-100 sticky top-0 z-40">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-sage-50 active:scale-90 transition-all">
          <ArrowLeft size={22} className="text-forest-700" />
        </button>
        <h1 className="text-lg font-bold text-forest-800">{t.diagnoseCrop}</h1>
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Crop selection */}
        <div>
          <label className="label">{t.selectCrop}</label>
          <div className="grid grid-cols-5 gap-2">
            {CROPS.map((c) => {
              const Icon = CROP_ICON_MAP[c.id] || Sprout;
              const selected = crop === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCrop(c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all active:scale-95 ${
                    selected
                      ? 'border-forest-600 bg-forest-50'
                      : 'border-sage-100 bg-white hover:border-sage-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-forest-600' : 'bg-sage-100'}`}>
                    <Icon size={20} className={selected ? 'text-white' : 'text-sage-500'} />
                  </div>
                  <span className={`text-xs font-medium ${selected ? 'text-forest-700' : 'text-sage-500'}`}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Growth stage */}
        <div>
          <label className="label">{t.selectStage}</label>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => {
              const selected = stage === s;
              return (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`chip ${selected ? 'chip-selected' : 'chip-unselected'}`}
                >
                  {t[`stage_${s}` as keyof typeof t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="label">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-forest-500" />
              {t.yourLocation}
            </span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t.locationPlaceholder}
            className="input-field"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label className="label">
            <span className="flex items-center gap-1.5">
              <Type size={15} className="text-forest-500" />
              {t.describeSymptoms}
            </span>
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={t.symptomsPlaceholder}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="label">
            <span className="flex items-center gap-1.5">
              <Camera size={15} className="text-forest-500" />
              {t.uploadPhotos}
            </span>
          </label>
          <p className="text-xs text-sage-400 mb-3">{t.uploadHint}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <div className="grid grid-cols-3 gap-3">
            {photos.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-sage-200 group">
                <img src={url} alt={`Crop ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-1">
                  <button
                    onClick={() => replacePhoto(index)}
                    className="bg-white/90 rounded-lg p-1.5 active:scale-90 transition-transform"
                    title={t.replace}
                  >
                    <Camera size={16} className="text-forest-700" />
                  </button>
                  <button
                    onClick={() => removePhoto(index)}
                    className="bg-white/90 rounded-lg p-1.5 active:scale-90 transition-transform"
                    title={t.remove}
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 active:scale-90 transition-transform sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ))}

            {photos.length < 6 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-sage-300 flex flex-col items-center justify-center gap-1.5 text-sage-400 hover:border-forest-400 hover:text-forest-500 transition-all active:scale-95"
              >
                <ImagePlus size={24} />
                <span className="text-xs font-medium">{t.uploadMore}</span>
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 animate-slide-up">
            {error}
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
        >
          {analyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Sparkles size={20} />
              {t.analyze}
            </>
          )}
        </button>

        <p className="text-xs text-sage-400 text-center">{t.demoMode}</p>
      </div>
    </div>
  );
}
