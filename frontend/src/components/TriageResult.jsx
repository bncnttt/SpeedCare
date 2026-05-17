import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, HelpCircle, QrCode, RotateCcw, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode.react';

const translations = {
  en: {
    title: 'Your Triage Result',
    queueRef: 'Queue Reference #',
    yourTriage: 'Your Triage Level',
    priority: 'Priority Status',
    priorityYes: '🔴 High Priority',
    priorityNo: '🟢 Standard Priority',
    waitingTime: 'Estimated Wait Time',
    patientInfo: 'Patient Information',
    name: 'Name',
    age: 'Age',
    symptoms: 'Chief Complaint',
    next: 'Next Steps',
    instruction1: 'Please proceed to the waiting area.',
    instruction2: 'Monitor your queue number on the display board.',
    instruction3: 'A staff member will call you when ready.',
    instruction4: 'Keep your reference number safe.',
    saveQR: 'Save or Screenshot this QR code',
    newPatient: 'New Patient',
    adminLogin: 'Hospital Nurse Login',
    levels: {
      0: { name: 'Emergency', color: 'bg-red-100 border-red-500 text-red-700', icon: '🚨' },
      1: { name: 'Urgent', color: 'bg-orange-100 border-orange-500 text-orange-700', icon: '⚠️' },
      2: { name: 'Non-Urgent', color: 'bg-green-100 border-green-500 text-green-700', icon: '✅' },
      3: { name: 'Administrative', color: 'bg-blue-100 border-blue-500 text-blue-700', icon: 'ℹ️' },
    },
    waitTimes: {
      0: '5-15 minutes',
      1: '15-30 minutes',
      2: '30-60 minutes',
      3: '10-20 minutes',
    },
    waitTimesBis: {
      0: '5-15 minuto',
      1: '15-30 minuto',
      2: '30-60 minuto',
      3: '10-20 minuto',
    },
  },
  bis: {
    title: 'Ang Iyong Triage na Resulta',
    queueRef: 'Numero ng Pila #',
    yourTriage: 'Ang Iyong Antas ng Triage',
    priority: 'Katayuan ng Priyoridad',
    priorityYes: '🔴 Mataas na Priyoridad',
    priorityNo: '🟢 Karaniwang Priyoridad',
    waitingTime: 'Inaasahang Oras ng Paghihintay',
    patientInfo: 'Impormasyon ng Pasyente',
    name: 'Pangalan',
    age: 'Edad',
    symptoms: 'Pangunahing Reklamo',
    next: 'Susunod na Hakbang',
    instruction1: 'Mangyaring magpatuloy sa lugar ng paghihintay.',
    instruction2: 'Bantayan ang iyong numero ng pila sa display board.',
    instruction3: 'Tatawagin ka ng isang miyembro ng staff kapag handa na.',
    instruction4: 'Panatilihing ligtas ang iyong numero ng referensya.',
    saveQR: 'I-save o kumuha ng screenshot ng QR code na ito',
    newPatient: 'Bagong Pasyente',
    adminLogin: 'Login ng Hospital Nurse',
    levels: {
      0: { name: 'Emergency', color: 'bg-red-100 border-red-500 text-red-700', icon: '🚨' },
      1: { name: 'Urgent', color: 'bg-orange-100 border-orange-500 text-orange-700', icon: '⚠️' },
      2: { name: 'Non-Urgent', color: 'bg-green-100 border-green-500 text-green-700', icon: '✅' },
      3: { name: 'Administrative', color: 'bg-blue-100 border-blue-500 text-blue-700', icon: 'ℹ️' },
    },
    waitTimes: {
      0: '5-15 minuto',
      1: '15-30 minuto',
      2: '30-60 minuto',
      3: '10-20 minuto',
    },
    waitTimesBis: {
      0: '5-15 minuto',
      1: '15-30 minuto',
      2: '30-60 minuto',
      3: '10-20 minuto',
    },
  },
};

export default function TriageResult({
  queueNumber: providedQueueNumber,
  triageLevel,
  isPriority,
  language,
  patientName,
  patientAge,
  symptoms,
  registrationData,
  onReset,
  onOpenAdminLogin,
}) {
  const t = translations[language];
  const [generatedQueueNumber] = useState(Math.floor(Math.random() * 9000) + 1000);
  const queueNumber = providedQueueNumber ?? generatedQueueNumber;
  const levelInfo = t.levels[triageLevel];
  const waitTime = language === 'en' ? t.waitTimes[triageLevel] : t.waitTimesBis[triageLevel];

  // Generate QR data
  const qrData = JSON.stringify({
    queueNumber,
    triageLevel,
    patientName,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-slate-200">
            {language === 'en'
              ? 'Thank you for using SpeedCare. Please review your information.'
              : 'Salamat sa paggamit ng SpeedCare. Mangyaring suriin ang iyong impormasyon.'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Triage Level Card */}
          <div className={`rounded-xl border-4 shadow-lg p-6 ${levelInfo.color}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold opacity-75 mb-1">{t.yourTriage}</p>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{levelInfo.icon}</span>
                  {levelInfo.name}
                </h2>
              </div>
            </div>

            {triageLevel === 0 && (
              <div className="mt-4 p-3 bg-red-200 bg-opacity-50 rounded text-sm font-semibold">
                {language === 'en'
                  ? '⚠️ Please seek immediate medical attention.'
                  : '⚠️ Mangyaring maghanap ng agarang medikal na atensyon.'}
              </div>
            )}
          </div>

          {/* Queue Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">{t.queueRef}</p>
            <p className="text-4xl font-bold text-blue-600 mb-6">{queueNumber}</p>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t.priority}</p>
                <p className={`font-semibold ${isPriority ? 'text-red-600' : 'text-green-600'}`}>
                  {isPriority ? t.priorityYes : t.priorityNo}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">{t.waitingTime}</p>
                <p className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {waitTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.patientInfo}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">{t.name}</p>
              <p className="text-lg font-semibold text-gray-800">{patientName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">{t.age}</p>
              <p className="text-lg font-semibold text-gray-800">{patientAge} years</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">{t.symptoms}</p>
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">{symptoms}</p>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-gray-200">
          <div className="flex flex-col items-center">
            <QrCode className="w-6 h-6 text-gray-600 mb-2" />
            <p className="text-sm font-semibold text-gray-600 mb-4">{t.saveQR}</p>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCode value={qrData} size={256} level="H" includeMargin={true} />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              {language === 'en'
                ? 'Scan this QR code at information desks or payment counter'
                : 'I-scan ang QR code na ito sa information desk o payment counter'}
            </p>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-blue-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-300">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {t.next}
          </h3>
          <ul className="space-y-3">
            {[t.instruction1, t.instruction2, t.instruction3, t.instruction4].map(
              (instruction, index) => (
                <li key={index} className="flex gap-3 text-blue-900">
                  <span className="font-bold text-blue-600 flex-shrink-0">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Additional Info */}
        {registrationData && (
          <div className="bg-green-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-green-300">
            <p className="text-sm text-green-700">
              {language === 'en'
                ? '✅ Your registration information has been saved and will be available to the medical staff.'
                : '✅ Ang iyong impormasyon sa pagpaparehistro ay nakatipid at magiging available sa medikal na staff.'}
            </p>
          </div>
        )}

        {onOpenAdminLogin && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#173968] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#214b82]"
            >
              <ShieldCheck className="h-5 w-5" />
              {t.adminLogin}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            {t.newPatient}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {language === 'en'
              ? '💡 Keep your queue number safe. You will need it to proceed.'
              : '💡 Panatilihing ligtas ang iyong numero ng pila. Kailangan mo ito upang magpatuloy.'}
          </p>
        </div>
      </div>
    </div>
  );
}
