import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Banknote, ClipboardList, QrCode, RotateCcw, Search } from 'lucide-react';

const STORAGE_KEY = 'speedcareTreatmentBills';

const STATUS_META = {
  Submitted: {
    label: 'Submitted',
    msg: 'Registration is received. Please remain seated.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  'Under Review': {
    label: 'Under Review',
    msg: 'A staff member is reviewing this case.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  Assigned: {
    label: 'Assigned',
    msg: 'The patient has been assigned to a room or doctor.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  'Ready for billing': {
    label: 'Ready for Billing',
    msg: 'Doctor treatment and billing details are ready for counter payment.',
    color: 'text-green-700',
    bg: 'bg-green-50',
  },
  'Your Turn': {
    label: 'Your Turn',
    msg: 'Please proceed to the assigned room.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
};

export default function ScannerStation() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanMode, setScanMode] = useState(true);
  const [manualUrn, setManualUrn] = useState('');
  const scannerObj = useRef(null);

  useEffect(() => {
    if (!scanMode) return undefined;

    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
    scanner.render(onScanSuccess, () => {});
    scannerObj.current = scanner;

    return () => scanner.clear().catch(() => {});
  }, [scanMode]);

  async function onScanSuccess(scannedValue) {
    scannerObj.current?.pause();
    await lookupPatient(scannedValue);
  }

  async function lookupPatient(scannedValue) {
    const identifier = getPatientIdentifier(scannedValue);

    if (!identifier) {
      setError('No queue number was found in this QR code.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const billingRecord = getBillingRecord(identifier);

    try {
      const res = await fetch(`/api/patients/${identifier}/status/`);
      if (!res.ok) throw new Error('Backend lookup failed');
      const backendResult = await res.json();

      setResult({
        ...backendResult,
        urn: backendResult.urn || identifier,
        status: billingRecord?.status || backendResult.status,
        billingRecord,
      });
    } catch {
      if (billingRecord) {
        setResult({
          urn: identifier,
          status: billingRecord.status,
          room: billingRecord.room,
          billingRecord,
        });
      } else {
        setError('QR code not found or no doctor bill has been saved yet.');
      }
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError('');
    setManualUrn('');
    scannerObj.current?.resume();
  }

  const billing = result?.billingRecord;
  const meta = result ? STATUS_META[result.status] || STATUS_META.Submitted : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-700">SpeedCare</h1>
          <p className="text-sm text-gray-500">Payment Counter QR Scanner</p>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setScanMode(true);
              reset();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
              scanMode ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </button>
          <button
            type="button"
            onClick={() => {
              setScanMode(false);
              reset();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
              !scanMode ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Search className="h-4 w-4" />
            Enter Code
          </button>
        </div>

        {!result && !loading && (
          <>
            {scanMode ? (
              <div id="qr-reader" className="overflow-hidden rounded-2xl" />
            ) : (
              <div className="space-y-3">
                <input
                  value={manualUrn}
                  onChange={(event) => setManualUrn(event.target.value)}
                  placeholder="Queue number or QR text"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-mono tracking-wide outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => lookupPatient(manualUrn)}
                  disabled={!manualUrn.trim()}
                  className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Check Patient Bill
                </button>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-gray-500">Looking up the patient record...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-4 font-semibold text-red-700">{error}</p>
            <button type="button" onClick={reset} className="rounded-xl bg-blue-600 px-6 py-2 font-bold text-white">
              Try Again
            </button>
          </div>
        )}

        {result && meta && (
          <div className="space-y-4">
            <div className={`rounded-2xl p-5 text-center ${meta.bg}`}>
              <div className={`mb-2 text-xl font-bold ${meta.color}`}>{meta.label}</div>
              <p className="text-sm text-gray-700">{meta.msg}</p>
              {result.room && (
                <div className="mt-4 rounded-xl bg-white p-3">
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">Room</div>
                  <div className="text-2xl font-bold text-gray-800">{result.room}</div>
                </div>
              )}
              <div className="mt-4 font-mono text-sm font-bold text-gray-500">{result.urn}</div>
            </div>

            {billing ? (
              <div className="rounded-2xl border border-green-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Payment Summary</h2>
                    <p className="text-sm text-gray-500">Saved by {billing.doctorName}</p>
                  </div>
                </div>

                <div className="mb-4 rounded-xl bg-green-50 p-4 text-center">
                  <div className="text-xs font-bold uppercase tracking-wide text-green-700">Amount Due</div>
                  <div className="mt-1 text-4xl font-bold text-green-800">{formatCurrency(billing.totals.total)}</div>
                </div>

                <div className="space-y-2 rounded-xl bg-gray-50 p-4">
                  <BillingRow label="Patient" value={billing.patientName} />
                  <BillingRow label="Queue" value={`#${billing.queueNumber}`} />
                  <BillingRow label="Consultation" value={formatCurrency(billing.totals.consultationFee)} />
                  <BillingRow label="Lab / procedure" value={formatCurrency(billing.totals.labFee)} />
                  <BillingRow label="Other" value={formatCurrency(billing.totals.otherFee)} />
                  <BillingRow label="Discount" value={`-${formatCurrency(billing.totals.discount)}`} />
                </div>

                <div className="mt-4 rounded-xl border border-gray-100 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <ClipboardList className="h-4 w-4 text-gray-400" />
                    Doctor Record
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{billing.form.diagnosis || 'No diagnosis entered'}</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{billing.form.medicines || 'No medicines recorded'}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-semibold text-amber-800">
                No billing record has been saved by the doctor yet.
              </div>
            )}

            <button
              type="button"
              onClick={reset}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Scan Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getPatientIdentifier(scannedValue) {
  const text = String(scannedValue || '').trim();
  if (!text) return '';

  try {
    const parsed = JSON.parse(text);
    return String(parsed.queueNumber || parsed.urn || parsed.patientId || '').trim();
  } catch {
    return text;
  }
}

function getBillingRecord(identifier) {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return records[String(identifier)] || null;
  } catch {
    return null;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function BillingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );
}
