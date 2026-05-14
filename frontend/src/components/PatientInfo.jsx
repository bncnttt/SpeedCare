import { useState } from 'react';
import { Accessibility, AlertCircle, CalendarDays, Languages, Star, User, UserRound } from 'lucide-react';

const translations = {
  en: {
    welcome: 'Welcome to SpeedCare',
    description: "Let's start with your basic information",
    fullName: 'Patient Name',
    fullNamePlaceholder: 'Full Name',
    age: 'Patient Age',
    agePlaceholder: 'Age',
    pwd: 'Person with Disability (PWD)',
    pwdHelp: 'Check this if the patient has a disability',
    seniorHelp: 'Already qualified as Senior Citizen',
    priorityLaneStatus: 'Priority Lane Status',
    seniorCitizen: 'Senior Citizen (60+)',
    next: 'Continue',
    errorMessage: 'Name must be at least 2 characters and age must be between 1 and 150.',
  },
  bis: {
    welcome: 'Maayong pag-abot sa SpeedCare',
    description: 'Magsugod ta sa imong basikong impormasyon',
    fullName: 'Ngalan sa Pasyente',
    fullNamePlaceholder: 'Tibuok nga Ngalan',
    age: 'Edad sa Pasyente',
    agePlaceholder: 'Edad',
    pwd: 'Tawo nga Adunay Kapansanan (PWD)',
    pwdHelp: 'Tsek kini kon ang pasyente adunay kapansanan',
    seniorHelp: 'Qualified na isip Senior Citizen',
    priorityLaneStatus: 'Priority Lane Status',
    seniorCitizen: 'Senior Citizen (60+)',
    next: 'Padayon',
    errorMessage: 'Ang ngalan kinahanglan labing menos 2 ka karakter ug ang edad kinahanglan 1-150.',
  },
};

export default function PatientInfo({ language = 'en', onLanguageToggle, onSubmit }) {
  const t = translations[language] || translations.en;
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isPWD, setIsPWD] = useState(false);
  const [error, setError] = useState('');

  const parsedAge = Number(age);
  const isFormValid = name.trim().length >= 2 && parsedAge >= 1 && parsedAge <= 150;
  const isSeniorCitizen = parsedAge >= 60;
  const hasPriority = isSeniorCitizen || isPWD;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError(t.errorMessage);
      return;
    }

    onSubmit(name.trim(), parsedAge, isPWD);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#eef6ff] p-6 text-[#0d2545]">
      <div className="relative w-[358px] rounded-[12px] bg-white px-[25px] pb-[26px] pt-[26px] shadow-[0_18px_35px_rgba(15,35,63,0.16)]">
        <button
          type="button"
          onClick={onLanguageToggle}
          className="absolute right-[14px] top-[14px] z-10 flex h-[44px] min-h-0 items-center justify-center gap-[7px] rounded-[7px] bg-[#173968] px-[13px] text-white shadow-[0_8px_16px_rgba(23,57,104,0.24)] transition-colors hover:bg-[#214b82]"
          aria-label="Toggle language"
        >
          <Languages className="h-[15px] w-[15px]" />
          <span className="text-[13px] font-bold leading-none">{language === 'en' ? 'EN' : 'BIS'}</span>
        </button>

        <div className="mb-[28px] text-center">
          <div className="mx-auto mb-[17px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#173968] text-white">
            <UserRound className="h-[27px] w-[27px]" strokeWidth={2.2} />
          </div>
          <h1 className="m-0 text-[24px] font-bold leading-[29px] text-[#123b70]">{t.welcome}</h1>
          <p className="m-0 mt-[6px] text-[13px] font-medium leading-[16px] text-[#2f4d70]">{t.description}</p>
        </div>

        {error && (
          <div className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-[24px]">
            <label className="mb-[8px] block text-[12px] font-medium leading-[13px] text-[#0d2545]">
              {t.fullName}
            </label>
            <div className="flex h-[50px] items-center rounded-[11px] border border-[#c8d2de] bg-white px-[14px] transition-colors focus-within:border-[#8fc3ff] focus-within:ring-3 focus-within:ring-[#dceeff]">
              <User className="mr-[13px] h-4 w-4 flex-shrink-0 text-[#9aa7b6]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="h-full min-h-0 w-full bg-transparent text-[14px] font-medium text-[#0d2545] outline-none placeholder:text-[#7b8795]"
              />
            </div>
          </div>

          <div className="mb-[20px]">
            <label className="mb-[8px] block text-[12px] font-medium leading-[13px] text-[#0d2545]">
              {t.age}
            </label>
            <div className="flex h-[50px] items-center rounded-[11px] border border-[#c8d2de] bg-white px-[14px] transition-colors focus-within:border-[#8fc3ff] focus-within:ring-3 focus-within:ring-[#dceeff]">
              <CalendarDays className="mr-[13px] h-4 w-4 flex-shrink-0 text-[#9aa7b6]" />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t.agePlaceholder}
                min="1"
                max="150"
                className="h-full min-h-0 w-full bg-transparent text-[14px] font-medium text-[#0d2545] outline-none placeholder:text-[#7b8795]"
              />
            </div>
          </div>

          <label
            htmlFor="pwd"
            className="mb-[19px] flex h-[75px] cursor-pointer items-center gap-[13px] rounded-[11px] border border-[#9dcbff] bg-[#eef6ff] px-[16px] transition-colors hover:border-[#6caeff]"
          >
            <input
              type="checkbox"
              id="pwd"
              checked={isPWD}
              onChange={(e) => setIsPWD(e.target.checked)}
              disabled={isSeniorCitizen}
              className="h-5 w-5 flex-shrink-0 cursor-pointer rounded-none border-[#98a3af] text-[#1d64f2] accent-[#1d64f2] disabled:cursor-not-allowed disabled:opacity-40"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-[8px] text-[14px] font-bold leading-[16px] text-[#1748a5]">
                <Accessibility className="h-4 w-4 flex-shrink-0" strokeWidth={2.4} />
                <span>{t.pwd}</span>
              </div>
              <p className="m-0 mt-[7px] text-[12px] font-semibold leading-[16px] text-[#1d64f2]">{t.pwdHelp}</p>
              {isSeniorCitizen && (
                <p className="m-0 mt-[4px] text-[10px] font-medium leading-[12px] text-[#1d64f2]">
                  ✓ {t.seniorHelp}
                </p>
              )}
            </div>
          </label>

          {hasPriority && (
            <div className="mb-[16px] flex min-h-[64px] items-center justify-between rounded-[10px] border border-[#f5bd00] bg-[#fffdf2] px-[16px] py-[10px]">
              <div>
                <p className="m-0 mb-[5px] text-[11px] font-medium leading-[13px] text-[#0d2545]">
                  {t.priorityLaneStatus}
                </p>
                <p className="m-0 text-[14px] font-bold leading-[16px] text-[#7b3f00]">
                  ✓ {isSeniorCitizen ? t.seniorCitizen : 'PWD'}
                </p>
              </div>
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#ffca1f] text-[#d09b00]">
                <Star className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className="h-[48px] w-full rounded-[10px] bg-[#173968] text-[14px] font-bold text-white transition-colors hover:bg-[#214b82] disabled:cursor-not-allowed disabled:bg-[#c9ced6] disabled:text-white"
          >
            {t.next}
          </button>
        </form>
      </div>
    </div>
  );
}
