import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const TRIAGE_META = {
  0: { label: 'EMERGENCY', color: '#DC2626' },
  1: { label: 'URGENT',    color: '#EA580C' },
  2: { label: 'MODERATE',  color: '#CA8A04' },
  3: { label: 'ROUTINE',   color: '#16A34A' },
}

export default function KioskPrint() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const patient   = state?.patient

  useEffect(() => {
    if (patient) setTimeout(() => window.print(), 800)
  }, [patient])

  if (!patient) { navigate('/kiosk'); return null }

  const { urn, full_name, age, reason, triage_suggestion } = patient
  const tm = TRIAGE_META[triage_suggestion] ?? TRIAGE_META[3]

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-80 p-8 text-center print:shadow-none print:rounded-none print:w-full">

        <div className="text-2xl font-bold text-blue-700 mb-1">SpeedCare</div>
        <div className="text-xs text-gray-400 mb-4 border-b border-dashed border-gray-200 pb-4">
          {new Date().toLocaleString()}
        </div>

        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Queue Number</div>
        <div className="text-5xl font-black text-blue-700 mb-4 tracking-wide">{urn}</div>

        <div className="flex justify-center mb-4">
          <QRCodeSVG value={urn} size={150} level="H" />
        </div>

        <div className="text-left bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
          <Row label="Name"   value={full_name} />
          <Row label="Age"    value={`${age} yrs`} />
          <Row label="Reason" value={reason} />
        </div>

        <div
          className="rounded-xl py-2 px-3 text-sm font-bold mb-4"
          style={{ background: tm.color + '20', color: tm.color }}
        >
          {tm.label}
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Please remain seated. A staff member will confirm your triage level.
        </p>

        <div className="border-t border-dashed border-gray-200 pt-4 text-xs text-gray-400">
          Scan QR at any checkpoint to check your status
        </div>

        <div className="flex gap-2 mt-6 print:hidden">
          <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-medium">🖨 Print</button>
          <button onClick={() => navigate('/kiosk')} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-medium">Done</button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  )
}