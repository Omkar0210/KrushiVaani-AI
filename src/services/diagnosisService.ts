import type { CropType, GrowthStage, DiagnosisResult } from '@/types';

interface KnowledgeEntry {
  keywords: string[];
  problem: string;
  confidence: number;
  category: 'pest' | 'disease' | 'nutrient' | 'environmental';
  severity: 'low' | 'moderate' | 'high';
  alternatives: { name: string; likelihood: number }[];
  nextSteps: string[];
  preventiveGuidance: string[];
  sources: { label: string; url: string } | null;
}

const generalPreventiveGuidance = [
  'Maintain proper plant spacing for good air circulation',
  'Use balanced fertilization based on soil testing',
  'Practice crop rotation to break pest and disease cycles',
  'Remove and destroy infected plant debris after harvest',
];

const generalNextSteps = [
  'Monitor the affected area daily for changes',
  'Isolate severely affected plants if possible',
  'Consult your local Krishi Vigyan Kendra (KVK) for field verification',
];

export const knowledgeBase: Record<CropType, KnowledgeEntry[]> = {
  cotton: [
    {
      keywords: ['yellow', 'leaf', 'curl', 'stunt', 'virus', 'leaf curl'],
      problem: 'Cotton Leaf Curl Virus (CLCuV)',
      confidence: 0.72,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Nutrient deficiency (Nitrogen)', likelihood: 0.18 },
        { name: 'Leafhopper damage', likelihood: 0.10 },
      ],
      nextSteps: [
        'Remove and destroy infected plants to prevent spread',
        'Control whitefly population, the vector for this virus',
        'Plant resistant cotton varieties in the next season',
        'Consult your nearest agricultural extension officer',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use virus-resistant cotton varieties',
        'Control whitefly vectors early in the season',
        'Avoid planting cotton near already-infected fields',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-CICR (Central Institute for Cotton Research)',
        url: 'https://www.cicr.org.in/',
      },
    },
    {
      keywords: ['bollworm', 'boll', 'fruit', 'damage', 'hole', 'worm', 'larva'],
      problem: 'Cotton Bollworm (Helicoverpa armigera)',
      confidence: 0.68,
      category: 'pest',
      severity: 'high',
      alternatives: [
        { name: 'Spotted bollworm (Earias spp.)', likelihood: 0.20 },
        { name: 'Pink bollworm (Pectinophora)', likelihood: 0.12 },
      ],
      nextSteps: [
        'Install pheromone traps to monitor adult moth activity',
        'Consider biological controls like Trichogramma egg parasitoids',
        'Hand-pick and destroy affected bolls in small plots',
        'Consult a qualified agricultural expert before any chemical intervention',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use Bt cotton varieties approved for your region',
        'Practice crop rotation with non-host crops',
        'Avoid continuous cotton monoculture',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-CICR Pest Management',
        url: 'https://www.cicr.org.in/',
      },
    },
    {
      keywords: ['wilt', 'dry', 'drying', 'droop', 'sudden', 'yellow lower'],
      problem: 'Cotton Wilt (Fusarium / Verticillium)',
      confidence: 0.65,
      category: 'disease',
      severity: 'moderate',
      alternatives: [
        { name: 'Water stress / drought', likelihood: 0.20 },
        { name: 'Root rot (Rhizoctonia)', likelihood: 0.15 },
      ],
      nextSteps: [
        'Improve soil drainage in affected areas',
        'Avoid excessive irrigation that promotes fungal growth',
        'Test soil for pathogen presence through a local lab',
        'Consult your agricultural extension officer for resistant varieties',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Plant wilt-resistant varieties suitable for your region',
        'Ensure good drainage and avoid waterlogging',
        'Practice deep ploughing in summer to expose pathogens',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-CICR Disease Management',
        url: 'https://www.cicr.org.in/',
      },
    },
  ],
  soybean: [
    {
      keywords: ['yellow', 'pale', 'chlorosis', 'leaf', 'green veins', 'iron'],
      problem: 'Nutrient Deficiency (Nitrogen / Iron Chlorosis)',
      confidence: 0.70,
      category: 'nutrient',
      severity: 'moderate',
      alternatives: [
        { name: 'Rhizoctonia root rot', likelihood: 0.15 },
        { name: 'Soybean mosaic virus', likelihood: 0.15 },
      ],
      nextSteps: [
        'Conduct a soil test to identify specific nutrient deficiencies',
        'Apply recommended fertilizers based on soil test results',
        'Ensure proper Rhizobium inoculation for nitrogen fixation',
        'Consult your local KVK for a soil testing service',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Apply balanced NPK based on soil test recommendations',
        'Use Rhizobium culture for seed treatment before sowing',
        'Apply micronutrients (Fe, Zn) if deficiency is recurrent',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IISR (Indian Institute of Soybean Research)',
        url: 'https://iisr.icar.gov.in/',
      },
    },
    {
      keywords: ['pest', 'worm', 'caterpillar', 'defoliation', 'leaf eating', 'holes'],
      problem: 'Soybean Defoliator (Semilooper / Tobacco Caterpillar)',
      confidence: 0.66,
      category: 'pest',
      severity: 'moderate',
      alternatives: [
        { name: 'Stem fly (Melanagromyza)', likelihood: 0.18 },
        { name: 'Girdle beetle', likelihood: 0.16 },
      ],
      nextSteps: [
        'Install light traps to monitor adult populations',
        'Use NPV (Nuclear Polyhedrosis Virus) biopesticide for caterpillar control',
        'Hand-pick larvae in small plots',
        'Consult an agricultural expert for appropriate pest management',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Monitor pest populations regularly using traps',
        'Avoid late sowing which increases pest incidence',
        'Encourage natural predators like spiders and ladybird beetles',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IISR Pest Management',
        url: 'https://iisr.icar.gov.in/',
      },
    },
    {
      keywords: ['rust', 'brown', 'orange', 'pustule', 'powdery', 'fungal'],
      problem: 'Soybean Rust (Phakopsora pachyrhizi)',
      confidence: 0.64,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Bacterial blight', likelihood: 0.20 },
        { name: 'Anthracnose', likelihood: 0.16 },
      ],
      nextSteps: [
        'Remove infected leaves and destroy them',
        'Improve air circulation by maintaining proper plant spacing',
        'Consult a qualified plant pathologist for appropriate fungicide guidance',
        'Report suspected rust to your agricultural extension officer',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Plant early-maturing varieties to escape rust infection',
        'Avoid overhead irrigation which spreads spores',
        'Remove volunteer soybean plants that harbor the pathogen',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IISR Disease Management',
        url: 'https://iisr.icar.gov.in/',
      },
    },
  ],
  tomato: [
    {
      keywords: ['blight', 'brown', 'dark', 'lesion', 'stem', 'fruit rot', 'early'],
      problem: 'Tomato Early Blight (Alternaria solani)',
      confidence: 0.71,
      category: 'disease',
      severity: 'moderate',
      alternatives: [
        { name: 'Late blight (Phytophthora)', likelihood: 0.15 },
        { name: 'Septoria leaf spot', likelihood: 0.14 },
      ],
      nextSteps: [
        'Remove and destroy affected lower leaves',
        'Apply mulch to prevent soil splashing onto leaves',
        'Ensure stakes or cages for proper plant ventilation',
        'Consult a plant pathologist for appropriate fungicide guidance',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use disease-free certified seeds or seedlings',
        'Practice 2-3 year crop rotation with non-solanaceous crops',
        'Avoid overhead irrigation; use drip irrigation instead',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIVR (Indian Institute of Vegetable Research)',
        url: 'https://iivr.icar.gov.in/',
      },
    },
    {
      keywords: ['whitefly', 'yellow', 'curl', 'stunt', 'virus', 'mosaic'],
      problem: 'Tomato Leaf Curl Virus (ToLCV)',
      confidence: 0.69,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Whitefly direct damage', likelihood: 0.16 },
        { name: 'Nutrient deficiency', likelihood: 0.15 },
      ],
      nextSteps: [
        'Control whitefly populations using yellow sticky traps',
        'Remove and destroy infected plants immediately',
        'Use virus-resistant tomato varieties in the next season',
        'Consult your agricultural extension officer',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Plant whitefly-resistant tomato varieties',
        'Use reflective mulches to deter whiteflies',
        'Maintain a whitefly-free period between crops',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIVR Virus Management',
        url: 'https://iivr.icar.gov.in/',
      },
    },
    {
      keywords: ['fruit', 'borer', 'worm', 'hole', 'damage', 'larva', 'helicoverpa'],
      problem: 'Tomato Fruit Borer (Helicoverpa armigera)',
      confidence: 0.67,
      category: 'pest',
      severity: 'high',
      alternatives: [
        { name: 'Spotted bollworm', likelihood: 0.18 },
        { name: 'Bacterial wilt', likelihood: 0.15 },
      ],
      nextSteps: [
        'Install pheromone traps for monitoring and mass trapping',
        'Use Trichogramma biocontrol for egg parasitism',
        'Pick and destroy affected fruits regularly',
        'Consult an agricultural expert for appropriate management',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use marigold as a trap crop around tomato fields',
        'Practice crop rotation with non-host crops',
        'Avoid proximity to other solanaceous crops',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIVR Pest Management',
        url: 'https://iivr.icar.gov.in/',
      },
    },
  ],
  chilli: [
    {
      keywords: ['yellow', 'curl', 'stunt', 'virus', 'leaf curl', 'mosaic', 'mottle'],
      problem: 'Chilli Leaf Curl Virus (ChiLCV)',
      confidence: 0.73,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Thrips damage', likelihood: 0.14 },
        { name: 'Nutrient deficiency', likelihood: 0.13 },
      ],
      nextSteps: [
        'Control thrips and whitefly vectors using blue/yellow sticky traps',
        'Remove and destroy infected plants immediately',
        'Use virus-resistant chilli varieties next season',
        'Consult your agricultural extension officer',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Plant resistant varieties recommended for your region',
        'Use insect-proof nets in nursery beds',
        'Maintain a vector-free period between crops',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIVR Chilli Diseases',
        url: 'https://iivr.icar.gov.in/',
      },
    },
    {
      keywords: ['powdery', 'mildew', 'white', 'fungal', 'powdery growth'],
      problem: 'Powdery Mildew (Leveillula taurica)',
      confidence: 0.66,
      category: 'disease',
      severity: 'moderate',
      alternatives: [
        { name: 'Cercospora leaf spot', likelihood: 0.18 },
        { name: 'Anthracnose', likelihood: 0.16 },
      ],
      nextSteps: [
        'Remove severely infected leaves',
        'Improve air circulation by proper spacing and pruning',
        'Avoid excessive nitrogen fertilization',
        'Consult a plant pathologist for appropriate fungicide guidance',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Maintain adequate plant spacing for ventilation',
        'Avoid overhead irrigation',
        'Remove crop debris after harvest',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIVR Disease Management',
        url: 'https://iivr.icar.gov.in/',
      },
    },
    {
      keywords: ['anthracnose', 'fruit', 'rot', 'dark', 'spot', 'sunken', 'black'],
      problem: 'Chilli Anthracnose (Colletotrichum spp.)',
      confidence: 0.65,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Bacterial spot', likelihood: 0.20 },
        { name: 'Fruit rot (Phytophthora)', likelihood: 0.15 },
      ],
      nextSteps: [
        'Remove and destroy infected fruits immediately',
        'Avoid overhead irrigation and water splashing',
        'Harvest fruits at proper maturity to reduce infection',
        'Consult a plant pathologist for appropriate management',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use disease-free certified seeds',
        'Treat seeds with hot water before sowing',
        'Practice crop rotation with non-host crops',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIVR Chilli Anthracnose',
        url: 'https://iivr.icar.gov.in/',
      },
    },
  ],
  rice: [
    {
      keywords: ['blast', 'neck', 'node', 'rot', 'brown', ' lesion', 'fungal', 'spot'],
      problem: 'Rice Blast (Magnaporthe oryzae)',
      confidence: 0.72,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Brown spot (Bipolaris oryzae)', likelihood: 0.15 },
        { name: 'Sheath blight', likelihood: 0.13 },
      ],
      nextSteps: [
        'Maintain proper water level in the field to reduce stress',
        'Avoid excessive nitrogen fertilization which increases susceptibility',
        'Remove infected plant debris after harvest',
        'Consult a qualified plant pathologist for appropriate fungicide guidance',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use blast-resistant varieties recommended for your region',
        'Avoid excess nitrogen; use balanced NPK fertilization',
        'Treat seeds with recommended seed treatment before sowing',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIRR (Indian Institute of Rice Research)',
        url: 'https://www.iirr.icar.gov.in/',
      },
    },
    {
      keywords: ['bph', 'brown', 'plant', 'hopper', 'hopperburn', 'yellow', 'drying', 'insect'],
      problem: 'Brown Planthopper (Nilaparvata lugens)',
      confidence: 0.68,
      category: 'pest',
      severity: 'high',
      alternatives: [
        { name: 'White-backed planthopper', likelihood: 0.16 },
        { name: 'Stem borer', likelihood: 0.16 },
      ],
      nextSteps: [
        'Monitor with light traps at night',
        'Avoid excessive nitrogen which attracts planthoppers',
        'Maintain proper water management; avoid continuous flooding',
        'Consult an agricultural expert for appropriate management',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Plant resistant varieties',
        'Avoid dense planting and excessive nitrogen',
        'Conserve natural enemies like spiders and mirid bugs',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIRR Pest Management',
        url: 'https://www.iirr.icar.gov.in/',
      },
    },
    {
      keywords: ['yellow', 'stunt', 'grass', 'stunted', 'tungro', 'virus'],
      problem: 'Rice Tungro Disease',
      confidence: 0.64,
      category: 'disease',
      severity: 'high',
      alternatives: [
        { name: 'Nutrient deficiency', likelihood: 0.20 },
        { name: 'Water stress', likelihood: 0.16 },
      ],
      nextSteps: [
        'Control green leafhopper vectors with appropriate measures',
        'Uproot and destroy infected plants',
        'Plant resistant varieties in the next season',
        'Consult your agricultural extension officer',
        ...generalNextSteps,
      ],
      preventiveGuidance: [
        'Use tungro-resistant varieties',
        'Practice synchronous planting to break vector cycles',
        'Maintain a fallow period between rice crops',
        ...generalPreventiveGuidance,
      ],
      sources: {
        label: 'ICAR-IIRR Disease Management',
        url: 'https://www.iirr.icar.gov.in/',
      },
    },
  ],
};

function matchEntry(
  crop: CropType,
  symptoms: string
): { entry: KnowledgeEntry; score: number } {
  const entries = knowledgeBase[crop];
  const lowerSymptoms = symptoms.toLowerCase();
  let best: { entry: KnowledgeEntry; score: number } = {
    entry: entries[0],
    score: 0,
  };

  for (const entry of entries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lowerSymptoms.includes(keyword)) {
        score += 1;
      }
    }
    // Slight baseline so we always return something
    score += 0.1;
    if (score > best.score) {
      best = { entry, score };
    }
  }

  return best;
}

export function generateDiagnosis(params: {
  crop: CropType;
  stage: GrowthStage;
  location: string;
  symptoms: string;
  photoUrls: string[];
}): DiagnosisResult {
  const { crop, stage, location, symptoms, photoUrls } = params;
  const { entry } = matchEntry(crop, symptoms || '');

  // Adjust confidence slightly based on how much info we have
  let confidence = entry.confidence;
  if (!symptoms || symptoms.trim().length < 10) {
    confidence -= 0.1;
  }
  if (photoUrls.length === 0) {
    confidence -= 0.05;
  }
  confidence = Math.max(0.4, Math.min(0.9, confidence));

  return {
    id: `diag_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    crop,
    stage,
    location,
    symptoms,
    photoUrls,
    suspectedProblem: entry.problem,
    confidence,
    alternatives: entry.alternatives,
    severity: entry.severity,
    category: entry.category,
    nextSteps: entry.nextSteps,
    preventiveGuidance: entry.preventiveGuidance,
    sources: entry.sources,
    isVerified: false,
    createdAt: new Date().toISOString(),
  };
}

export function generateVoiceResponse(message: string, lang: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaste') || lower.includes('नमस्ते')) {
    return lang === 'hi'
      ? 'नमस्ते! मैं KrushiVaani हूं। अपनी फसल की समस्या बताएं और मैं आपकी मदद करूंगा।'
      : 'Hello! I am KrushiVaani. Tell me about your crop problem and I will help you.';
  }
  if (lower.includes('pest') || lower.includes('insect') || lower.includes('कीड़ा') || lower.includes('bug')) {
    return lang === 'hi'
      ? 'कीट नियंत्रण के लिए: पहले कीट की पहचान करें, फिर ट्रैप या जैविक नियंत्रण का उपयोग करें। कोई रासायनिक दवा उपयोग करने से पहले कृषि विशेषज्ञ से सलाह लें।'
      : 'For pest control: first identify the pest, then use traps or biological controls. Consult an agricultural expert before using any chemical treatment.';
  }
  if (lower.includes('disease') || lower.includes('sick') || lower.includes('rot') || lower.includes('रोग')) {
    return lang === 'hi'
      ? 'फसल की बीमारी के लिए: प्रभावित पौधों को अलग करें, सही सिंचाई और खाद का ध्यान रखें। सत्यापित सलाह के लिए अपने स्थानीय कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
      : 'For crop disease: isolate affected plants, maintain proper irrigation and fertilization. Contact your local Krishi Vigyan Kendra (KVK) for verified advice.';
  }
  if (lower.includes('yellow') || lower.includes('pale') || lower.includes('पीला')) {
    return lang === 'hi'
      ? 'पीली पत्तियां अक्सर पोषक तत्व की कमी या जल अतिरिक्त का संकेत हैं। मिट्टी परीक्षण कराएं और संतुलित खाद का उपयोग करें।'
      : 'Yellow leaves often indicate nutrient deficiency or overwatering. Get a soil test done and apply balanced fertilizers.';
  }
  if (lower.includes('water') || lower.includes('irrigation') || lower.includes('पानी') || lower.includes('सिंचाई')) {
    return lang === 'hi'
      ? 'सिंचाई सही समय पर करें। सुबह या शाम को पानी दें, दोपहर में नहीं। जल निकासी का ध्यान रखें।'
      : 'Irrigate at the right time. Water in the morning or evening, not midday. Ensure proper drainage.';
  }

  return lang === 'hi'
    ? 'मैं आपकी फसल की समस्या समझने की कोशिश कर रहा हूं। कृपया और विस्तार से बताएं — कौन सी फसल है, लक्षण क्या हैं, और कब से हैं?'
    : 'I am trying to understand your crop problem. Please tell me more — which crop, what are the symptoms, and since when?';
}
