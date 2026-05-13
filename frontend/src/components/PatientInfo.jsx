import { useState } from 'react';
import { Languages, AlertCircle } from 'lucide-react';

const translations = {
  en: {
    title: 'SpeedCare',
    subtitle: 'AI-Powered Medical Triage System',
    welcome: 'Welcome to SpeedCare',
    description: 'Please provide your information to begin the triage process.',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    age: 'Age',
    agePlaceholder: 'Enter your age',
    pwd: 'Are you a Person with Disability (PWD)?',
    next: 'Next',
    error: 'Please fill in all fields',
    errorMessage: 'Name must be at least 2 characters and age must be between 1 and 150.',
  },
  bis: {
    title: 'SpeedCare',
    subtitle: 'AI-Powered na Medical Triage System',
    welcome: 'Maligayang pagdating sa SpeedCare',
    description: 'Palihim ang iyong impormasyon upang magsimula ang proseso ng triage.',
    fullName: 'Ganap na Pangalan',
    fullNamePlaceholder: 'Ilagay ang iyong ganap na pangalan',
    age: 'Edad',
    agePlaceholder: 'Ilagay ang iyong edad',
    pwd: 'Ikaw ba ay isang Taong may Kapangyarihan (PWD)?',
    next: 'Susunod',
    error: 'Puno lahat ng larangan',
    errorMessage: 'Ang pangalan ay dapat na hindi bababa sa 2 character at ang edad ay dapat na 1-150.',
  },
};

export default function PatientInfo({ language, onLanguageToggle, onSubmit }) {
  const t = translations[language];
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isPWD, setIsPWD] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !age || name.trim().length < 2 || age < 1 || age > 150) {
      setError(t.errorMessage);
      return;
    }

    onSubmit(name, parseInt(age), isPWD);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {/* Language Toggle */}
      <button
        onClick={onLanguageToggle}
        className="absolute top-6 right-6 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md transition-colors"
        aria-label="Toggle language"
      >
        <Languages className="w-5 h-5" />
        <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'BIS'}</span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">{t.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{t.subtitle}</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t.welcome}</h2>
            <p className="text-gray-600">{t.description}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Age Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.age}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t.agePlaceholder}
                min="1"
                max="150"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* PWD Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pwd"
                checked={isPWD}
                onChange={(e) => setIsPWD(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <label htmlFor="pwd" className="text-gray-700 font-medium cursor-pointer">
                {t.pwd}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-lg"
            >
              {t.next}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              {language === 'en'
                ? 'Your information is secure and will be used only for medical triage.'
                : 'Ang iyong impormasyon ay secure at gagamitin lamang para sa medical triage.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
