import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, AlertCircle } from 'lucide-react';

const translations = {
  en: {
    title: 'Symptom Assessment',
    greeting: 'Hello {name}, please describe your symptoms or reason for visit.',
    placeholder: 'Describe your symptoms here... (e.g., chest pain, fever, headache)',
    send: 'Submit',
    loading: 'Processing your input...',
    character_limit: 'Character limit:',
  },
  bis: {
    title: 'Pagsusuri ng Sintoma',
    greeting: 'Kamusta {name}, mangyaring ilarawan ang iyong mga sintoma o dahilan ng pagbisita.',
    placeholder: 'Ilarawan ang iyong mga sintoma dito... (e.g., sakit sa dughan, lagnat, sakit ng ulo)',
    send: 'Ipadala',
    loading: 'Ginagamit ang iyong input...',
    character_limit: 'Hangganan ng character:',
  },
};

export default function ChatbotAssistant({ language, patientName, onSymptomSubmit }) {
  const t = translations[language];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const MAX_CHARS = 500;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    await onSymptomSubmit(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8" />
            {t.title}
          </h1>
          <p className="text-blue-100">
            {t.greeting.replace('{name}', patientName)}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold mb-2">
                  {language === 'en'
                    ? 'Welcome to SpeedCare Symptom Assessment'
                    : 'Maligayang pagdating sa SpeedCare Pagsusuri ng Sintoma'}
                </p>
                <p className="text-gray-600 text-sm">
                  {language === 'en'
                    ? 'Please describe your symptoms in detail. Be as specific as possible to help us assess your condition accurately. You can include:'
                    : 'Mangyaring ilarawan ang iyong mga sintoma nang detalyado. Maging kasing-specific hangga\'t maaari upang matulungan kaming masuri ang iyong kondisyon. Maaari mong isama ang:'}
                </p>
                <ul className="text-gray-600 text-sm mt-3 ml-4 space-y-1 list-disc">
                  <li>{language === 'en' ? 'Location of pain' : 'Lokasyon ng sakit'}</li>
                  <li>{language === 'en' ? 'Severity (mild, moderate, severe)' : 'Kalubhaan (light, moderate, severe)'}</li>
                  <li>{language === 'en' ? 'Duration of symptoms' : 'Tagal ng mga sintoma'}</li>
                  <li>{language === 'en' ? 'Any recent injuries or incidents' : 'Anumang kamakailang pinsala o insidente'}</li>
                </ul>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="bg-blue-50 rounded-lg shadow-md p-6 flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-700 font-medium">{t.loading}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Input Field */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setInput(e.target.value);
                  }
                }}
                placeholder={t.placeholder}
                disabled={isLoading}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none transition-colors disabled:bg-gray-100"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {input.length}/{MAX_CHARS}
              </div>
            </div>

            {/* Character Warning */}
            {input.length > MAX_CHARS * 0.8 && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{t.character_limit} {input.length}/{MAX_CHARS}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {t.send}
            </button>
          </form>

          {/* Info Footer */}
          <div className="mt-4 p-3 bg-blue-50 rounded text-center text-xs text-gray-600">
            <p>
              {language === 'en'
                ? '⚠️ If you experience severe symptoms (chest pain, difficulty breathing, etc.), please seek immediate medical attention.'
                : '⚠️ Kung nakakaranas ka ng malalang sintoma (sakit sa dughan, lisod og ginhawa, atbp.), mangyaring maghanap ng agarang medikal na atensyon.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
