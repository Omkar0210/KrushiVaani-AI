/**
 * Speech service — integration point for Gnani Prisma (STT) and Gnani Timbre (TTS).
 *
 * Currently uses the browser's Web Speech API when available, with demo mode fallback.
 * To integrate Gnani Prisma for STT:
 *   - Replace `startListening` with a call to the Gnani Prisma API endpoint
 *   - Stream audio from getUserMedia to the API
 *   - Return the transcript text
 *
 * To integrate Gnani Timbre for TTS:
 *   - Replace `speak` with a call to the Gnani Timbre TTS API
 *   - Send the text + language code
 *   - Play the returned audio buffer
 */

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Minimal type for the Web Speech API (not in standard TS lib)
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') return null;
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  return new Ctor() as SpeechRecognitionLike;
}

const LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
};

export class SpeechService {
  private recognition: SpeechRecognitionLike | null = null;
  private listening = false;

  startListening(
    lang: string,
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (this.listening) return true;

    const recognition = getRecognition();
    if (!recognition) return false;

    recognition.lang = LANG_MAP[lang] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) {
        onResult({ transcript: final, isFinal: true });
      } else if (interim) {
        onResult({ transcript: interim, isFinal: false });
      }
    };

    recognition.onerror = (event: any) => {
      this.listening = false;
      onError(event.error || 'speech-error');
    };

    recognition.onend = () => {
      this.listening = false;
      onEnd();
    };

    try {
      recognition.start();
      this.listening = true;
      this.recognition = recognition;
      return true;
    } catch {
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.listening) {
      this.recognition.stop();
      this.listening = false;
    }
  }

  speak(text: string, lang: string): void {
    if (!isSpeechSynthesisSupported()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[lang] || 'en-IN';
    utterance.rate = 0.9;
    synth.speak(utterance);
  }

  stopSpeaking(): void {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  get isListening(): boolean {
    return this.listening;
  }
}

export const speechService = new SpeechService();
