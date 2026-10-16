export type Language = 'en' | 'hi' | 'mr' | 'te' | 'kn' | 'ta';

export type CropType = 'cotton' | 'soybean' | 'tomato' | 'chilli' | 'rice';

export type GrowthStage =
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'fruiting'
  | 'maturity';

export interface CropInfo {
  id: CropType;
  name: string;
  icon: string;
  stages: GrowthStage[];
}

export interface DiagnosisResult {
  id: string;
  crop: CropType;
  stage: GrowthStage;
  location: string;
  symptoms: string;
  photoUrls: string[];
  suspectedProblem: string;
  confidence: number;
  alternatives: { name: string; likelihood: number }[];
  severity: 'low' | 'moderate' | 'high';
  category: 'pest' | 'disease' | 'nutrient' | 'environmental';
  nextSteps: string[];
  preventiveGuidance: string[];
  sources: { label: string; url: string } | null;
  isVerified: boolean;
  createdAt: string;
}

export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AppTranslation {
  appName: string;
  tagline: string;
  // Nav
  navHome: string;
  navDiagnose: string;
  navVoice: string;
  navHistory: string;
  // Dashboard
  welcome: string;
  selectLanguage: string;
  diagnoseCrop: string;
  diagnoseCropDesc: string;
  voiceAssistant: string;
  voiceAssistantDesc: string;
  recentReports: string;
  viewAll: string;
  noReportsYet: string;
  noReportsDesc: string;
  // Diagnosis form
  selectCrop: string;
  selectStage: string;
  yourLocation: string;
  locationPlaceholder: string;
  describeSymptoms: string;
  symptomsPlaceholder: string;
  uploadPhotos: string;
  uploadHint: string;
  uploadMore: string;
  remove: string;
  replace: string;
  analyze: string;
  analyzing: string;
  // Growth stages
  stage_seedling: string;
  stage_vegetative: string;
  stage_flowering: string;
  stage_fruiting: string;
  stage_maturity: string;
  // Results
  diagnosisResult: string;
  suspectedProblem: string;
  confidence: string;
  alternativeCauses: string;
  severity: string;
  severity_low: string;
  severity_moderate: string;
  severity_high: string;
  recommendedNextSteps: string;
  preventiveGuidance: string;
  sources: string;
  sampleResultNotice: string;
  consultExpert: string;
  shareOnWhatsApp: string;
  saveReport: string;
  newDiagnosis: string;
  // Voice
  voiceTitle: string;
  voiceDemoNotice: string;
  tapToSpeak: string;
  listening: string;
  yourMessage: string;
  send: string;
  clear: string;
  conversation: string;
  // History
  historyTitle: string;
  reportOn: string;
  deleteReport: string;
  // Common
  back: string;
  cancel: string;
  demoMode: string;
}

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}
