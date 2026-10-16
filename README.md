# KrushiVaani AI

A multilingual AI agricultural assistant for Indian farmers. Built with React, TypeScript, Tailwind CSS, and Lucide icons.

## Features

- **Home Dashboard** — Welcome screen, language selector (6 languages), quick access to diagnosis and voice assistant, and recent reports.
- **Crop Diagnosis** — Select crop (cotton, soybean, tomato, chilli, rice), growth stage, and location; describe symptoms; upload crop photos with preview, remove, and replace controls.
- **Voice Assistant** — Microphone controls with Web Speech API integration, editable text input, conversation area, and text-to-speech playback. Falls back to demo mode when speech recognition is unavailable.
- **Diagnosis Results** — Shows suspected problem, confidence level, alternative causes, severity, recommended next steps, preventive guidance, and source references. All results clearly labeled as sample/demo.
- **Report Sharing** — Generates a readable crop-health report and opens WhatsApp with a prefilled message for the farmer to review and send.
- **History** — Stores previous reports in localStorage with useful empty states and delete capability.

## Supported Languages

- English, Hindi, Marathi, Telugu, Kannada, Tamil

## Running the App

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Architecture

```
src/
├── components/        # Reusable UI (BottomNav, AppHeader, LanguageSelector)
├── contexts/          # Language context (global state)
├── data/              # Translations and crop metadata
├── pages/             # Dashboard, DiagnosisPage, ResultPage, VoicePage, HistoryPage
├── services/          # diagnosisService, storageService, speechService
├── types.ts           # Shared TypeScript types
└── App.tsx            # Navigation and page routing
```

### Service Layer

The app uses a clean service layer with mock data that can later connect to a real backend:

- **diagnosisService.ts** — Keyword-based mock diagnosis engine with a curated knowledge base per crop. Integration point for a vision-capable AI model.
- **storageService.ts** — localStorage-based report persistence. Integration point for Supabase or another backend.
- **speechService.ts** — Web Speech API wrapper for STT/TTS. Integration point for Gnani Prisma (STT) and Gnani Timbre (TTS).

## Future Integration Steps

### 1. Gnani Prisma (Speech-to-Text)

Replace `startListening` in `src/services/speechService.ts` with a call to the Gnani Prisma API:
- Stream audio from `getUserMedia` to the API endpoint
- Return the transcript text to the UI
- Store API credentials server-side (never in client code)

### 2. Gnani Timbre (Text-to-Speech)

Replace `speak` in `src/services/speechService.ts` with a call to the Gnani Timbre TTS API:
- Send text + language code to the API
- Play the returned audio buffer

### 3. Vision Model for Crop Photo Analysis

Replace `generateDiagnosis` in `src/services/diagnosisService.ts` with a call to a vision-capable AI model:
- Upload crop photos to a backend endpoint
- Send photos + symptom text + metadata to the model
- Parse the model's response into the `DiagnosisResult` structure

### 4. Agricultural Knowledge Base

Expand the `knowledgeBase` in `src/services/diagnosisService.ts` or connect to a curated database:
- Map verified pest/disease data per crop and region
- Include only authoritative source references (ICAR, KVK, etc.)

### 5. Backend with Supabase

- Replace `storageService.ts` localStorage calls with Supabase queries
- Add authentication for farmer accounts
- Store diagnosis requests and reports in PostgreSQL with RLS policies

## Safety

- All diagnosis results are clearly labeled as sample/demo
- No pesticide brand names, dosages, or official approvals are fabricated
- Recommendations focus on preventive guidance and consulting qualified agricultural experts
- Source references link only to genuine ICAR institution websites

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Lucide React (icons)
- Web Speech API (browser-native speech recognition/synthesis)
