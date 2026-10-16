import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Mic, Send, Trash2, Volume2, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import { speechService, isSpeechRecognitionSupported } from '@/services/speechService';
import { generateVoiceResponse } from '@/services/diagnosisService';
import type { VoiceMessage } from '@/types';

interface VoicePageProps {
  onBack: () => void;
}

export function VoicePage({ onBack }: VoicePageProps) {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const sttSupported = isSpeechRecognitionSupported();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, interimText]);

  const handleStartListening = useCallback(() => {
    if (!sttSupported) {
      // Demo mode: insert a sample phrase
      const demoPhrases: Record<string, string> = {
        en: 'My cotton leaves are turning yellow and curling. What should I do?',
        hi: 'मेरे कपास की पत्तियां पीली हो रही हैं और मुड़ रही हैं। मुझे क्या करना चाहिए?',
        mr: 'माझ्या कापूसची पाने पिवळी होत आहेत. मी काय करावे?',
        te: 'నా పత్తి ఆకులు పసుపు రంగులోకి మారుతున్నాయి. నేను ఏమి చేయాలి?',
        kn: 'ನನ್ನ ಹತ್ತಿ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ. ನಾನು ಏನು ಮಾಡಬೇಕು?',
        ta: 'என் பருத்தி இலைகள் மஞ்சளாகி வளைகின்றன. நான் என்ன செய்ய வேண்டும்?',
      };
      setInputText(demoPhrases[lang] || demoPhrases.en);
      setListening(true);
      setTimeout(() => setListening(false), 1500);
      return;
    }

    setListening(true);
    setInterimText('');
    speechService.startListening(
      lang,
      (result) => {
        if (result.isFinal) {
          setInputText(result.transcript);
          setInterimText('');
        } else {
          setInterimText(result.transcript);
        }
      },
      (error) => {
        setListening(false);
        setInterimText('');
        console.error('Speech recognition error:', error);
      },
      () => {
        setListening(false);
        setInterimText('');
      }
    );
  }, [sttSupported, lang]);

  const handleStopListening = () => {
    speechService.stopListening();
    setListening(false);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: VoiceMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const response = generateVoiceResponse(text, lang);
    const aiMsg: VoiceMessage = {
      id: `msg_${Date.now()}_a`,
      role: 'assistant',
      text: response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText('');
    setInterimText('');

    // Speak the response if TTS is available
    speechService.speak(response, lang);
  };

  const handleClear = () => {
    setMessages([]);
    setInputText('');
    setInterimText('');
    speechService.stopSpeaking();
  };

  const handleSpeakMessage = (text: string) => {
    speechService.speak(text, lang);
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col pb-20">
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-sage-100 sticky top-0 z-40">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-sage-50 active:scale-90 transition-all">
          <ArrowLeft size={22} className="text-forest-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-forest-800">{t.voiceTitle}</h1>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2 rounded-lg hover:bg-sage-50 active:scale-90 transition-all"
            title={t.clear}
          >
            <Trash2 size={18} className="text-sage-400" />
          </button>
        )}
      </div>

      {/* Demo notice */}
      <div className="mx-5 mt-4 bg-sage-50 border border-sage-200 rounded-xl p-3 flex items-start gap-2.5">
        <Sparkles size={16} className="text-sage-500 shrink-0 mt-0.5" />
        <p className="text-xs text-sage-600 leading-relaxed">{t.voiceDemoNotice}</p>
      </div>

      {/* Conversation area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && !interimText && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-20 h-20 rounded-full bg-forest-50 flex items-center justify-center mb-4">
              <Bot size={36} className="text-forest-400" />
            </div>
            <p className="text-forest-700 font-semibold">{t.voiceTitle}</p>
            <p className="text-sm text-sage-400 mt-1 max-w-xs">
              {LANGUAGES.find((l) => l.code === lang)?.nativeLabel}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-forest-100' : 'bg-sage-100'
            }`}>
              {msg.role === 'user' ? (
                <User size={16} className="text-forest-600" />
              ) : (
                <Bot size={16} className="text-sage-600" />
              )}
            </div>
            <div className={`max-w-[75%] group ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-forest-600 text-white rounded-tr-sm'
                  : 'bg-white border border-sage-100 text-forest-800 rounded-tl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleSpeakMessage(msg.text)}
                  className="flex items-center gap-1 mt-1 text-xs text-sage-400 hover:text-forest-600 transition-colors"
                >
                  <Volume2 size={12} />
                  Listen
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Interim transcript */}
        {interimText && (
          <div className="flex gap-2.5 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
              <User size={16} className="text-forest-600" />
            </div>
            <div className="max-w-[75%]">
              <div className="rounded-2xl px-4 py-3 bg-forest-100 text-forest-700 rounded-tr-sm border border-forest-200">
                <p className="text-sm leading-relaxed italic">{interimText}...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-5 py-3 bg-white border-t border-sage-100 space-y-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.yourMessage}
            rows={1}
            className="input-field resize-none flex-1 min-h-[48px] max-h-24"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="btn-primary p-3 disabled:opacity-40"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Mic button */}
        <div className="flex justify-center">
          <button
            onClick={listening ? handleStopListening : handleStartListening}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              listening
                ? 'bg-red-500 shadow-lg shadow-red-200'
                : 'bg-forest-600 shadow-lg shadow-forest-200 hover:bg-forest-700'
            }`}
          >
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" style={{ animationDelay: '0.3s' }} />
              </>
            )}
            <Mic size={26} className="text-white relative z-10" />
          </button>
        </div>
        <p className="text-center text-xs text-sage-400">
          {listening ? t.listening : t.tapToSpeak}
        </p>
      </div>
    </div>
  );
}
