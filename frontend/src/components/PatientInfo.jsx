import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const TRIAGE_MAP = {
  0: { label: 'Emergency', cls: 'badge-red' },
  1: { label: 'Urgent',    cls: 'badge-orange' },
  2: { label: 'Moderate',  cls: 'badge-yellow' },
  3: { label: 'Routine',   cls: 'badge-green' },
}

export default function PatientInfo() {
  const { urn }  = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch(`/api/patients/${urn}/`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setPatient)
      .catch(() => setError('Patient record not found.'))
      .finally(() => setLoading(false))
  }, [urn])

  if (loading) return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
    </div>
  )

  if (error) return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="card text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 underline">Go back</button>
      </div>
    </div>
  )

  const {
    full_name, age, sex, reason, symptoms,
    is_pwd, is_senior, triage_level,
    triage_suggestion, status, doctor_name,
    room, registered_at,
  } = patient

  const displayLevel = triage_level ?? triage_suggestion
  const tm = TRIAGE_MAP[displayLevel] ?? TRIAGE_MAP[3]

  return (
    <div className="min-h-dvh bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 flex items-center gap-1 text-sm">
          ← Back
        </button>

        <div className="card mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{full_name}</h1>
              <div className="text-gray-400 text-sm font-mono">{urn}</div>
            </div>
            <span className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${tm.cls}`}>
              {tm.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Age"    value={`${age} yrs`} />
            <Field label="Sex"    value={sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : 'Other'} />
            <Field label="Reason" value={reason} />
            <Field label="Status" value={status} />
            {doctor_name && <Field label="Doctor" value={`Dr. ${doctor_name}`} />}
            {room        && <Field label="Room"   value={room} />}
            <Field label="Registered" value={new Date(registered_at).toLocaleTimeString()} />
          </div>

          {(is_senior || is_pwd) && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {is_senior && <span className="badge-yellow rounded-full px-3 py-1 text-xs font-semibold">⭐ Senior Citizen</span>}
              {is_pwd    && <span className="badge-blue  rounded-full px-3 py-1 text-xs font-semibold">♿ PWD</span>}
            </div>
          )}
        </div>

        {symptoms && (
          <div className="card mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Symptoms</h2>
            <p className="text-gray-800">{symptoms}</p>
          </div>
        )}

        <div className="card">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">AI Triage Suggestion</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${TRIAGE_MAP[triage_suggestion]?.cls || 'badge-green'}`}>
              Level {triage_suggestion} — {TRIAGE_MAP[triage_suggestion]?.label}
            </span>
            {triage_level !== null && triage_level !== triage_suggestion && (
              <span className="text-xs text-gray-400">→ Staff set: Level {triage_level}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            AI suggestion is for reference only. Final triage is set by clinical staff.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  )
}