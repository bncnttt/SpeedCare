import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const TRIAGE_META = {
  0: { label: 'EMERGENCY', color: '#DC2626', bg: '#FEE2E2' },
  1: { label: 'URGENT',    color: '#EA580C', bg: '#FFEDD5' },
  2: { label: 'MODERATE',  color: '#CA8A04', bg: '#FEF9C3' },
  3: { label: 'ROUTINE',   color: '#16A34A', bg: '#DCFCE7' },
}

export default function QRReceipt() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const patient   = state?.patient

  if (!patient) {
    navigate('/')
    return null
  }

  const { urn, full_name, age, reason, triage_suggestion } = patient
  const meta = TRIAGE_META[triage_suggestion] ?? TRIAGE_META[3]

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-sm">

        {/* Success header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-800">You're registered!</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Show this QR code to staff or any scanner
          </p>
        </div>

        {/* Receipt card */}
        <div className="card text-center">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Queue Number</div>
          <div className="text-4xl font-bold text-blue-700 tracking-wide mb-4">
            {urn}
          </div>

          <div className="flex justify-center mb-4 p-3 bg-gray-50 rounded-2xl">
            <QRCodeSVG
              value={urn}
              size={180}
              bgColor="transparent"
              fgColor="#1E3A8A"
              level="H"
            />
          </div>

          <div className="text-left bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
            <Row label="Name"   value={full_name} />
            <Row label="Age"    value={`${age} years old`} />
            <Row label="Reason" value={reason} />
          </div>

          <div
            className="rounded-xl px-4 py-2 mb-4 text-sm font-semibold"
            style={{ background: meta.bg, color: meta.color }}
          >
            AI Suggestion: Level {triage_suggestion} — {meta.label}
          </div>

          <p className="text-xs text-gray-400">
            A staff member will confirm your triage level. Please remain seated.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white border border-gray-200 text-gray-700 font-medium rounded-2xl py-3 hover:bg-gray-50 transition"
          >
            🖨 Print
          </button>
          <button
            onClick={() => navigate('/waiting', { state: { urn } })}
            className="flex-1 bg-blue-600 text-white font-semibold rounded-2xl py-3 hover:bg-blue-700 transition"
          >
            Track Status →
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  )
}