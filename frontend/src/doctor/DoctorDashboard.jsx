import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  LogOut,
  Pill,
  Save,
  Search,
  Stethoscope,
  UserRound,
} from 'lucide-react';

const CURRENT_DOCTOR = {
  id: 'dr-santos',
  name: 'Dr. Maria Santos',
  specialty: 'Emergency Medicine',
};

const TRIAGE_META = {
  0: { label: 'Emergency', badge: 'badge-red' },
  1: { label: 'Urgent', badge: 'badge-orange' },
  2: { label: 'Non-Urgent', badge: 'badge-green' },
  3: { label: 'Administrative', badge: 'badge-blue' },
};

const ASSIGNED_PATIENTS = [
  {
    id: 'doctor-1',
    queueNumber: 1021,
    patientName: 'Maria Santos',
    patientAge: 67,
    reasonForVisit: 'Chest pain and shortness of breath',
    symptoms: 'Chest pain, difficulty breathing, dizziness',
    triageLevel: 0,
    isPriority: true,
    status: 'For consultation',
    room: 'Exam 1',
    assignedDoctorId: CURRENT_DOCTOR.id,
    allergies: 'Penicillin',
    vitals: 'BP 150/92, HR 108, SpO2 94%',
    medicalHistory: 'Hypertension',
  },
  {
    id: 'doctor-2',
    queueNumber: 1022,
    patientName: 'Juan Dela Cruz',
    patientAge: 35,
    reasonForVisit: 'Fever and vomiting',
    symptoms: 'Fever, vomiting, body weakness',
    triageLevel: 1,
    isPriority: false,
    status: 'For consultation',
    room: 'Exam 2',
    assignedDoctorId: CURRENT_DOCTOR.id,
    allergies: 'No known allergies',
    vitals: 'Temp 38.7 C, HR 96, BP 118/76',
    medicalHistory: 'Asthma',
  },
  {
    id: 'doctor-other',
    queueNumber: 1034,
    patientName: 'Ana Villanueva',
    patientAge: 9,
    reasonForVisit: 'Cough and fever',
    symptoms: 'Cough, fever, sore throat',
    triageLevel: 2,
    isPriority: false,
    status: 'For consultation',
    room: 'Pediatrics 1',
    assignedDoctorId: 'dr-reyes',
    allergies: 'None listed',
    vitals: 'Temp 37.9 C, HR 88',
    medicalHistory: 'None listed',
  },
];

const EMPTY_FORM = {
  diagnosis: '',
  medicines: '',
  instructions: '',
  consultationFee: '500',
  labFee: '',
  otherFee: '',
  discount: '',
};

const STORAGE_KEY = 'speedcareTreatmentBills';

export default function DoctorDashboard({ latestPatient, patientVitals = {}, onBackToAdmin, onBackToKiosk, onLogout }) {
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('doctor-1');
  const [records, setRecords] = useState({});
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    try {
      setRecords(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch {
      setRecords({});
    }
  }, []);

  const assignedPatients = useMemo(() => {
    const livePatient = latestPatient
      ? {
          ...latestPatient,
          status: 'For consultation',
          room: latestPatient.triageLevel === 0 ? 'Exam 1' : 'Exam 3',
          assignedDoctorId: CURRENT_DOCTOR.id,
          allergies: latestPatient.registrationData?.allergies || 'No allergies recorded',
          vitals: patientVitals[latestPatient.queueNumber]?.summary || 'Pending nurse intake',
          medicalHistory: latestPatient.registrationData?.medicalHistory || 'Not recorded',
        }
      : null;

    return [livePatient, ...ASSIGNED_PATIENTS]
      .filter(Boolean)
      .filter((patient) => patient.assignedDoctorId === CURRENT_DOCTOR.id)
      .map((patient) => ({
        ...patient,
        vitals: patientVitals[patient.queueNumber]?.summary || patient.vitals,
      }));
  }, [latestPatient, patientVitals]);

  const visiblePatients = assignedPatients.filter((patient) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      patient.patientName.toLowerCase().includes(query) ||
      String(patient.queueNumber).includes(query) ||
      patient.reasonForVisit.toLowerCase().includes(query)
    );
  });

  const selectedPatient =
    assignedPatients.find((patient) => patient.id === selectedPatientId) ||
    visiblePatients[0] ||
    assignedPatients[0];
  const selectedRecord = selectedPatient ? records[selectedPatient.queueNumber] : null;
  const selectedTriage = TRIAGE_META[selectedPatient?.triageLevel] || TRIAGE_META[3];

  useEffect(() => {
    if (!selectedPatient) return;

    const record = records[selectedPatient.queueNumber];
    setForm(record ? record.form : EMPTY_FORM);
    setSavedMessage('');
  }, [records, selectedPatient]);

  const totals = useMemo(() => calculateTotals(form), [form]);
  const completedCount = assignedPatients.filter((patient) => records[patient.queueNumber]).length;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedPatient) return;

    const record = {
      queueNumber: selectedPatient.queueNumber,
      patientName: selectedPatient.patientName,
      patientAge: selectedPatient.patientAge,
      doctorId: CURRENT_DOCTOR.id,
      doctorName: CURRENT_DOCTOR.name,
      room: selectedPatient.room,
      triageLevel: selectedPatient.triageLevel,
      reasonForVisit: selectedPatient.reasonForVisit,
      symptoms: selectedPatient.symptoms,
      status: 'Ready for billing',
      form,
      totals,
      updatedAt: new Date().toISOString(),
    };
    const nextRecords = { ...records, [selectedPatient.queueNumber]: record };

    setRecords(nextRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    setSavedMessage(`Saved treatment and bill for queue #${selectedPatient.queueNumber}.`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">SpeedCare</p>
            <h1 className="text-2xl font-bold text-[#123b70]">Doctor Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              {CURRENT_DOCTOR.name} - {CURRENT_DOCTOR.specialty}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {onBackToAdmin && (
              <button
                type="button"
                onClick={onBackToAdmin}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Nurse dashboard
              </button>
            )}
            <button
              type="button"
              onClick={onBackToKiosk}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <CalendarClock className="h-4 w-4" />
              Patient kiosk
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg bg-[#173968] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#214b82]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Assigned Patients</h2>
              <p className="text-sm text-slate-500">{completedCount} of {assignedPatients.length} records completed</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <UserRound className="h-5 w-5" />
            </div>
          </div>

          <div className="mb-4 flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <Search className="mr-2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search assigned patients"
              className="h-full min-h-0 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-3">
            {visiblePatients.map((patient) => {
              const triage = TRIAGE_META[patient.triageLevel] || TRIAGE_META[3];
              const hasRecord = Boolean(records[patient.queueNumber]);
              const isSelected = selectedPatient?.id === patient.id;

              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-bold text-blue-700">#{patient.queueNumber}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${triage.badge}`}>{triage.label}</span>
                  </div>
                  <p className="font-bold text-slate-900">{patient.patientName}</p>
                  <p className="mt-1 text-sm text-slate-500">Age {patient.patientAge} - {patient.room}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="rounded-md bg-white px-2 py-1 text-slate-600">{patient.status}</span>
                    {hasRecord && (
                      <span className="rounded-md bg-green-100 px-2 py-1 text-green-700">Billing saved</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {selectedPatient && (
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-sm font-bold text-blue-700">Queue #{selectedPatient.queueNumber}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedTriage.badge}`}>{selectedTriage.label}</span>
                    {selectedPatient.isPriority && <span className="badge-yellow rounded-full px-2 py-1 text-xs font-bold">Priority</span>}
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedPatient.patientName}</h2>
                  <p className="mt-1 text-sm text-slate-500">Age {selectedPatient.patientAge} - {selectedPatient.reasonForVisit}</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <p className="font-bold text-slate-900">QR billing lookup</p>
                  <p className="mt-1 text-slate-500">Counter scans queue #{selectedPatient.queueNumber}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <InfoBlock icon={Stethoscope} label="Symptoms" value={selectedPatient.symptoms || selectedPatient.reasonForVisit} />
                <InfoBlock icon={ClipboardList} label="Vitals" value={selectedPatient.vitals} />
                <InfoBlock icon={FileText} label="Allergies / History" value={`${selectedPatient.allergies}; ${selectedPatient.medicalHistory}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Treatment Record</h3>
                    <p className="text-sm text-slate-500">Medicine and instructions saved for hospital records.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Diagnosis / clinical impression</span>
                    <input
                      value={form.diagnosis}
                      onChange={(event) => updateField('diagnosis', event.target.value)}
                      placeholder="e.g. Acute gastritis, dehydration"
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Medicine given / prescribed</span>
                    <textarea
                      value={form.medicines}
                      onChange={(event) => updateField('medicines', event.target.value)}
                      placeholder="Medicine name, dose, frequency, quantity"
                      rows={5}
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Doctor instructions</span>
                    <textarea
                      value={form.instructions}
                      onChange={(event) => updateField('instructions', event.target.value)}
                      placeholder="Follow-up schedule, rest advice, warnings, lab requests"
                      rows={4}
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Patient Bill</h3>
                    <p className="text-sm text-slate-500">Amount due at counter.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <MoneyInput label="Consultation fee" value={form.consultationFee} onChange={(value) => updateField('consultationFee', value)} />
                  <MoneyInput label="Lab / procedure fee" value={form.labFee} onChange={(value) => updateField('labFee', value)} />
                  <MoneyInput label="Other fee" value={form.otherFee} onChange={(value) => updateField('otherFee', value)} />
                  <MoneyInput label="Discount" value={form.discount} onChange={(value) => updateField('discount', value)} />
                </div>

                <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
                  <Row label="Discount" value={`-${formatCurrency(totals.discount)}`} />
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <Row label="Amount due" value={formatCurrency(totals.total)} strong />
                  </div>
                </div>

                {savedMessage && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-bold text-green-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    {savedMessage}
                  </div>
                )}

                {selectedRecord && !savedMessage && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                    Last saved amount due: {formatCurrency(selectedRecord.totals.total)}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#173968] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#214b82]"
                >
                  <Save className="h-4 w-4" />
                  Save treatment and bill
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

function calculateTotals(form) {
  const consultationFee = toAmount(form.consultationFee);
  const labFee = toAmount(form.labFee);
  const otherFee = toAmount(form.otherFee);
  const discount = toAmount(form.discount);
  const subtotal = consultationFee + labFee + otherFee;

  return {
    consultationFee,
    labFee,
    otherFee,
    discount,
    subtotal,
    total: Math.max(subtotal - discount, 0),
  };
}

function toAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value);
}

function InfoBlock({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </div>
      <p className="text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function MoneyInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={strong ? 'font-bold text-slate-900' : 'text-slate-500'}>{label}</span>
      <span className={strong ? 'text-lg font-bold text-green-700' : 'font-bold text-slate-700'}>{value}</span>
    </div>
  );
}
