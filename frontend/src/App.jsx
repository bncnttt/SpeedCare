import { useState } from 'react';
import { Languages } from 'lucide-react';
import PatientInfo from './components/PatientInfo';
import ChatbotAssistant from './components/ChatbotAssistant';
import AnalysisState from './components/AnalysisState';
import PreRegistrationForm from './components/PreRegistrationForm';
import TriageResult from './components/TriageResult';

export default function App() {
  const [state, setState] = useState('patient-info');
  const [language, setLanguage] = useState('en');

  // Patient data
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(0);
  const [symptoms, setSymptoms] = useState('');
  const [registrationData, setRegistrationData] = useState(undefined);
  const [reasonForVisit, setReasonForVisit] = useState('');

  // Triage data
  const [triageLevel, setTriageLevel] = useState(2);
  const [isPriority, setIsPriority] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'bis' : 'en');
  };

  const handlePatientInfoSubmit = (name, age, isPWD, reason) => {
    setPatientName(name);
    setPatientAge(age);
    setReasonForVisit(reason);
    // Priority Logic: Age >= 60 OR PWD = True
    const priorityStatus = age >= 60 || isPWD;
    setIsPriority(priorityStatus);
    setState('chat');
  };

  const handleSymptomSubmit = async (symptomText) => {
    setSymptoms(symptomText);
    setState('analyzing');

    // Simulate BERT model processing with mock data
    // In production, this would call your actual backend API
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock triage level determination based on keywords
    const lowerSymptoms = symptomText.toLowerCase();
    let level = 2; // Default to non-urgent

    // Emergency keywords (Red - Level 0)
    if (
      lowerSymptoms.includes('chest pain') ||
      lowerSymptoms.includes('sakit sa dughan') ||
      lowerSymptoms.includes('difficulty breathing') ||
      lowerSymptoms.includes('lisod og ginhawa') ||
      lowerSymptoms.includes('unconscious') ||
      lowerSymptoms.includes('bleeding') ||
      lowerSymptoms.includes('dugo') ||
      lowerSymptoms.includes('heart') ||
      lowerSymptoms.includes('puso')
    ) {
      level = 0;
    }
    // Urgent keywords (Orange - Level 1)
    else if (
      lowerSymptoms.includes('fever') ||
      lowerSymptoms.includes('hilanat') ||
      lowerSymptoms.includes('vomiting') ||
      lowerSymptoms.includes('suka') ||
      lowerSymptoms.includes('severe pain') ||
      lowerSymptoms.includes('grabe nga sakit') ||
      lowerSymptoms.includes('burn') ||
      lowerSymptoms.includes('sunog')
    ) {
      level = 1;
    }
    // Administrative keywords (Blue - Level 3)
    else if (
      lowerSymptoms.includes('question') ||
      lowerSymptoms.includes('pangutana') ||
      lowerSymptoms.includes('inquiry') ||
      lowerSymptoms.includes('appointment') ||
      lowerSymptoms.includes('schedule') ||
      lowerSymptoms.includes('iskidyul')
    ) {
      level = 3;
    }
    // Default: Non-urgent (Green - Level 2)

    setTriageLevel(level);
    setState('pre-registration');
  };

  const handleRegistrationSubmit = (data) => {
    setRegistrationData(data);
    setState('result');
  };

  const handleRegistrationSkip = () => {
    setRegistrationData(undefined);
    setState('result');
  };

  const handleReset = () => {
    setState('patient-info');
    setPatientName('');
    setPatientAge(0);
    setSymptoms('');
    setRegistrationData(undefined);
    setTriageLevel(2);
    setIsPriority(false);
    setReasonForVisit('');
    setLanguage('en');
  };

  return (
    <div className="size-full relative bg-white">
      {/* Floating Language Toggle - Available on all screens except patient-info */}
      {state !== 'patient-info' && state !== 'chat' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 bg-[#1a365d] hover:bg-[#2d4a7c] text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-5 h-5" />
            <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'BIS'}</span>
          </button>
        </div>
      )}

      {/* Step 1: Patient Info (Name & Age) */}
      {state === 'patient-info' && (
        <PatientInfo
          language={language}
          onLanguageToggle={handleLanguageToggle}
          onSubmit={handlePatientInfoSubmit}
        />
      )}

      {/* Step 2: Chatbot Assistant */}
      {state === 'chat' && (
        <ChatbotAssistant
          language={language}
          patientName={patientName}
          onSymptomSubmit={handleSymptomSubmit}
        />
      )}

      {/* Step 3: Analysis */}
      {state === 'analyzing' && (
        <AnalysisState language={language} />
      )}

      {/* Step 4: Pre-Registration */}
      {state === 'pre-registration' && (
        <PreRegistrationForm
          language={language}
          patientName={patientName}
          onSubmit={handleRegistrationSubmit}
          onSkip={handleRegistrationSkip}
        />
      )}

      {/* Step 5: Triage Result with QR Code */}
      {state === 'result' && (
        <TriageResult
          triageLevel={triageLevel}
          isPriority={isPriority}
          language={language}
          patientName={patientName}
          patientAge={patientAge}
          symptoms={symptoms}
          reasonForVisit={reasonForVisit}
          registrationData={registrationData}
          onReset={handleReset}
        />
      )}
    </div>
  );
}