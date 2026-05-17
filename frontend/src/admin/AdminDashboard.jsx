import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ClipboardList,
  LogOut,
  Search,
  Stethoscope,
  Users,
} from 'lucide-react';

const TRIAGE_META = {
  0: { label: 'Emergency', badge: 'badge-red', accent: 'text-red-700' },
  1: { label: 'Urgent', badge: 'badge-orange', accent: 'text-orange-700' },
  2: { label: 'Non-Urgent', badge: 'badge-green', accent: 'text-green-700' },
  3: { label: 'Administrative', badge: 'badge-blue', accent: 'text-blue-700' },
};

const DEMO_PATIENTS = [
  {
    id: 'demo-1',
    queueNumber: 1021,
    patientName: 'Maria Santos',
    patientAge: 67,
    reasonForVisit: 'Chest pain and shortness of breath',
    symptoms: 'Chest pain, difficulty breathing',
    triageLevel: 0,
    isPriority: true,
    status: 'Immediate care',
    registeredAt: '08:12 AM',
    registrationData: {
      phone: '09123456789',
      emergencyContact: 'Ana Santos',
      allergies: 'Penicillin',
    },
  },
  {
    id: 'demo-2',
    queueNumber: 1022,
    patientName: 'Juan Dela Cruz',
    patientAge: 35,
    reasonForVisit: 'Fever and vomiting',
    symptoms: 'Fever, vomiting, body weakness',
    triageLevel: 1,
    isPriority: false,
    status: 'Under review',
    registeredAt: '08:26 AM',
    registrationData: {
      phone: '09987654321',
      emergencyContact: 'Liza Dela Cruz',
      medicalHistory: 'Asthma',
    },
  },
  {
    id: 'demo-3',
    queueNumber: 1023,
    patientName: 'Ben Reyes',
    patientAge: 28,
    reasonForVisit: 'Appointment inquiry',
    symptoms: 'Needs follow-up schedule',
    triageLevel: 3,
    isPriority: false,
    status: 'Waiting',
    registeredAt: '08:41 AM',
    registrationData: {
      email: 'ben@example.com',
      address: 'Cebu City',
    },
  },
];

const EMPTY_VITALS = {
  bloodPressure: '',
  temperature: '',
  heartRate: '',
  respiratoryRate: '',
  oxygenSaturation: '',
  notes: '',
};

export default function AdminDashboard({
  adminUser,
  latestPatient,
  patientVitals = {},
  onSaveVitals,
  onLogout,
  onBackToKiosk,
  onOpenDoctor,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatientId, setSelectedPatientId] = useState('demo-1');
  const [vitalsForm, setVitalsForm] = useState(EMPTY_VITALS);
  const [savedMessage, setSavedMessage] = useState('');

  const patients = useMemo(() => {
    if (!latestPatient) return DEMO_PATIENTS;

    return [
      {
        ...latestPatient,
        status: latestPatient.triageLevel === 0 ? 'Immediate care' : 'Waiting',
        registeredAt: 'Just now',
      },
      ...DEMO_PATIENTS,
    ];
  }, [latestPatient]);

  const statuses = ['All', ...Array.from(new Set(patients.map((patient) => patient.status)))];
  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ||
    patients[0];

  const filteredPatients = patients.filter((patient) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      patient.patientName.toLowerCase().includes(query) ||
      String(patient.queueNumber).includes(query) ||
      patient.reasonForVisit.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPatients = patients.length;
  const priorityPatients = patients.filter((patient) => patient.isPriority).length;
  const emergencyPatients = patients.filter((patient) => patient.triageLevel === 0).length;
  const waitingPatients = patients.filter((patient) => patient.status === 'Waiting').length;
  const vitalsCompleted = patients.filter((patient) => patientVitals[patient.queueNumber]).length;

  useEffect(() => {
    if (!selectedPatient) return;

    setVitalsForm(patientVitals[selectedPatient.queueNumber] || EMPTY_VITALS);
    setSavedMessage('');
  }, [patientVitals, selectedPatient]);

  function updateVitals(field, value) {
    setVitalsForm((current) => ({ ...current, [field]: value }));
  }

  function handleVitalsSubmit(event) {
    event.preventDefault();
    if (!selectedPatient || !onSaveVitals) return;

    const savedVitals = {
      ...vitalsForm,
      summary: formatVitals(vitalsForm),
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: adminUser?.name || 'Nurse',
    };

    onSaveVitals(selectedPatient.queueNumber, savedVitals);
    setSavedMessage(`Vitals saved for ${selectedPatient.patientName}.`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-600">SpeedCare</p>
            <h1 className="text-2xl font-bold text-[#123b70]">Hospital Nurse Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Signed in as {adminUser?.name || 'Nurse'} - Frontend demo data
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {onOpenDoctor && (
              <button
                type="button"
                onClick={onOpenDoctor}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <ClipboardList className="h-4 w-4" />
                Doctor dashboard
              </button>
            )}
            <button
              type="button"
              onClick={onBackToKiosk}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
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

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard icon={Users} label="Total Patients" value={totalPatients} tone="text-blue-700" />
          <StatCard icon={Clock} label="Waiting" value={waitingPatients} tone="text-amber-700" />
          <StatCard icon={AlertTriangle} label="Emergency" value={emergencyPatients} tone="text-red-700" />
          <StatCard icon={CheckCircle2} label="Vitals Done" value={vitalsCompleted} tone="text-green-700" />
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Patient Search</h2>
                <p className="text-sm text-slate-500">Search a patient, select the row, then record vitals for the doctor.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                  <Search className="mr-2 h-4 w-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search patient name"
                    className="h-full min-h-0 w-44 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">Queue</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Triage</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Vitals</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    const triage = TRIAGE_META[patient.triageLevel] || TRIAGE_META[3];
                    const hasVitals = Boolean(patientVitals[patient.queueNumber]);
                    const isSelected = selectedPatient?.id === patient.id;

                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={`cursor-pointer border-b border-slate-100 transition hover:bg-slate-50 ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-4 font-mono text-base font-bold text-blue-700">#{patient.queueNumber}</td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900">{patient.patientName}</div>
                          <div className="text-xs text-slate-500">Age {patient.patientAge} - {patient.registeredAt}</div>
                        </td>
                        <td className="max-w-[250px] px-4 py-4 text-slate-600">
                          <div className="line-clamp-2">{patient.reasonForVisit || patient.symptoms}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${triage.badge}`}>
                            {triage.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{patient.status}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {hasVitals ? (
                              <span className="badge-green rounded-full px-2 py-1 text-xs font-bold">Recorded</span>
                            ) : (
                              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-500">Pending</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Vitals Intake</h2>
                <p className="text-xs text-slate-500">Sent to the doctor dashboard</p>
              </div>
            </div>

            {selectedPatient && (
              <form onSubmit={handleVitalsSubmit} className="space-y-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="font-bold text-slate-900">#{selectedPatient.queueNumber} {selectedPatient.patientName}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{selectedPatient.symptoms || selectedPatient.reasonForVisit}</p>
                </div>

                <VitalsInput label="Blood pressure" placeholder="120/80" value={vitalsForm.bloodPressure} onChange={(value) => updateVitals('bloodPressure', value)} />
                <VitalsInput label="Temperature" placeholder="37.0 C" value={vitalsForm.temperature} onChange={(value) => updateVitals('temperature', value)} />
                <VitalsInput label="Heart rate" placeholder="82 bpm" value={vitalsForm.heartRate} onChange={(value) => updateVitals('heartRate', value)} />
                <VitalsInput label="Respiratory rate" placeholder="18/min" value={vitalsForm.respiratoryRate} onChange={(value) => updateVitals('respiratoryRate', value)} />
                <VitalsInput label="Oxygen saturation" placeholder="98%" value={vitalsForm.oxygenSaturation} onChange={(value) => updateVitals('oxygenSaturation', value)} />

                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-slate-700">Nurse notes</span>
                  <textarea
                    value={vitalsForm.notes}
                    onChange={(event) => updateVitals('notes', event.target.value)}
                    placeholder="Pain score, alertness, or other observations"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                {savedMessage && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-bold text-green-700">
                    {savedMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173968] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#214b82]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Save vitals
                </button>
              </form>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

function formatVitals(vitals) {
  const parts = [
    vitals.bloodPressure && `BP ${vitals.bloodPressure}`,
    vitals.temperature && `Temp ${vitals.temperature}`,
    vitals.heartRate && `HR ${vitals.heartRate}`,
    vitals.respiratoryRate && `RR ${vitals.respiratoryRate}`,
    vitals.oxygenSaturation && `SpO2 ${vitals.oxygenSaturation}`,
  ].filter(Boolean);

  const summary = parts.length ? parts.join(', ') : 'Vitals recorded';
  return vitals.notes ? `${summary}. Notes: ${vitals.notes}` : summary;
}

function VitalsInput({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
