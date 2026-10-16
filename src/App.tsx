import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/pages/Dashboard';
import { DiagnosisPage } from '@/pages/DiagnosisPage';
import { ResultPage } from '@/pages/ResultPage';
import { VoicePage } from '@/pages/VoicePage';
import { HistoryPage } from '@/pages/HistoryPage';
import type { DiagnosisResult } from '@/types';

type Page = 'home' | 'diagnose' | 'voice' | 'history' | 'result';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(null);

  const handleNavigate = (target: string) => {
    setPage(target as Page);
  };

  const handleResult = (result: DiagnosisResult) => {
    setCurrentResult(result);
    setPage('result');
  };

  const handleViewReport = (report: DiagnosisResult) => {
    setCurrentResult(report);
    setPage('result');
  };

  const handleBackToHome = () => {
    setPage('home');
    setCurrentResult(null);
  };

  const handleBackToHistory = () => {
    setPage('history');
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-cream-50 max-w-md mx-auto relative">
      {page === 'home' && <Dashboard onNavigate={handleNavigate} onViewReport={handleViewReport} />}
      {page === 'diagnose' && (
        <DiagnosisPage onBack={() => setPage('home')} onResult={handleResult} />
      )}
      {page === 'result' && currentResult && (
        <ResultPage
          result={currentResult}
          onBack={handleBackToHome}
          onNewDiagnosis={() => setPage('diagnose')}
        />
      )}
      {page === 'voice' && <VoicePage onBack={() => setPage('home')} />}
      {page === 'history' && (
        <HistoryPage onViewReport={handleViewReport} onNavigate={handleNavigate} />
      )}

      {page !== 'result' && page !== 'voice' && <BottomNav current={page} onNavigate={handleNavigate} />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
