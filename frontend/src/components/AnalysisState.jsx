import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const translations = {
  en: {
    analyzing: 'Analyzing your symptoms...',
    processing: 'Our AI is processing your information',
    subtitle: 'This should take about 30 seconds',
    pleaseWait: 'Please wait...',
  },
  bis: {
    analyzing: 'Nagsusuri sa imong mga sintomas...',
    processing: 'Ang aming AI ay nagpoproseso ng iyong impormasyon',
    subtitle: 'Ito ay dapat tumagal ng humigit-kumulang 30 segundo',
    pleaseWait: 'Palihug maghintay...',
  },
};

export default function AnalysisState({ language = 'en' }) {
  const [progress, setProgress] = useState(0);
  const t = translations[language] || translations.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="size-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      {/* Animated Loading Spinner */}
      <div className="mb-8">
        <div className="relative w-24 h-24">
          <Loader className="w-24 h-24 text-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl font-bold text-blue-600">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      {/* Main Message */}
      <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">{t.analyzing}</h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 text-center mb-8">{t.processing}</p>

      {/* Additional Info */}
      <p className="text-sm text-gray-500 text-center mb-8">{t.subtitle}</p>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Wait Message */}
      <p className="text-gray-700 font-medium animate-pulse">{t.pleaseWait}</p>
    </div>
  );
}
