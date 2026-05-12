import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doctors } from '../data/doctors.js'

const TRIAGE_OPTIONS = [
  { level: 0, label: 'Emergency', color: '#DC2626', bg: '#FEE2E2', desc: 'Immediate life-threatening condition' },
  { level: 1, label: 'Urgent',    color: '#EA580C', bg: '#FFEDD5', desc: 'Serious, requires prompt care' },
  { level: 2, label: 'Moderate',  color: '#CA8A04', bg: '#FEF9C3', desc: 'Stable but needs timely attention' },
  { level: 3, label: 'Routine',   color: '#16A34A', bg: '#DCFCE7', desc: 'Non-urgent, can wait' },
]

export default function AssignmentPanel() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [patient, setPatient]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')
  const [triageLevel, setTriageLevel] = useState(null)
  const [doctorId, setDoctorId]     = useState('')
  const [room, setRoom]             = useState('')
  const [notes, setNotes]           = useState('')

  useEffect(() => {
    fetch(`/api/patients/${id}/`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => {
        setPatient(data)
        setTriageLevel(data.triage_suggestion ?? 3)
        setRoom(data.room || '')
        setDoctorId(data.doctor || '')
      })
      .catch(() => setError('Failed to load patient.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAssign() {
    if (triageLevel === null || !doctorId || !room) {
      setError('Please select triage level, doctor, and room.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/staff/assign/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: id,
          triage_level: triageLevel,
          doctor_id: doctorId,
          room,
          staff_notes: notes,
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setTimeout(() => navigate('/staff'), 1500)
    } catch {
      setError('Assignment failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
    </div>
  )

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card text-center">
        <div className="text-5xl mb-3">✓</div>
        <h2 className="text-xl font-bold text-green-700">Patient Assigned!</h2>
        <p className="text-gray-500 mt-2">Returning to dashboard...</p>
      </div>
    </div>
  )

  const isOverride = triageLevel !== patient?.triage_suggestion

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate('/staff')} className="text-blue-600 mb-4 text-sm">← Back to Dashboard</button>

        {/* Patient summary */}
        {patient && (
          <div className="card mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Patient: {patient.full_name}</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-400">URN: </span><span className="font-mono font-bold text-blue-700">{patient.urn}</span></div>
              <div><span className="text-gray-400">Age: </span>{patient.age}{patient.age >= 60 && ' ⭐'}</div>
              <div><span className="text-gray-400">Reason: </span>{patient.reason}</div>
              <div><span className="text-gray-400">PWD: </span>{patient.is_pwd ? '♿ Yes' : 'No'}</div>
            </div>
            {patient.symptoms && (
              <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
                <span className="text-gray-400 text-xs block mb-1">Symptoms:</span>
                {patient.symptoms}
              </div>
            )}
            <div className="mt-3 bg-blue-50 rounded-xl p-3">
              <span className="text-xs text-blue-500 block mb-1">AI Suggestion:</span>
              <span className="font-semibold text-blue-800">
                Level {patient.triage_suggestion} — {TRIAGE_OPTIONS[patient.triage_suggestion]?.label}
              </span>
            </div>
          </div>
        )}

        {/* Triage selection */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            Set Triage Level
            {isOverride && (
              <span className="ml-2 text-xs text-amber-600 font-normal">
                ⚠ Override (AI suggested L{patient?.triage_suggestion})
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {TRIAGE_OPTIONS.map(opt => (
              <button
                key={opt.level}
                onClick={() => setTriageLevel(opt.level)}
                style={triageLevel === opt.level
                  ? { background: opt.bg, borderColor: opt.color, color: opt.color }
                  : {}
                }
                className={`rounded-xl border-2 px-3 py-3 text-left transition-all ${
                  triageLevel === opt.level ? 'border-2 font-bold' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Level {opt.level}</div>
                <div className="text-sm">{opt.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Doctor selection */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Assign Doctor</h3>
          <div className="space-y-2">
            {doctors.filter(d => d.status !== 'off_duty').map(doc => (
              <button
                key={doc.id}
                onClick={() => { setDoctorId(doc.id); setRoom(doc.room) }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  doctorId === doc.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium text-gray-800 text-sm">{doc.name}</div>
                  <div className="text-xs text-gray-400">{doc.specialty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Room {doc.room}</span>
                  <div className={`w-2 h-2 rounded-full ${doc.status === 'available' ? 'bg-green-500' : 'bg-amber-500'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Room override */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Room Number</h3>
          <input
            value={room}
            onChange={e => setRoom(e.target.value)}
            placeholder="e.g. ER-1, 201, OR-3"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Notes */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Staff Notes (optional)</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Additional notes for the doctor..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleAssign}
          disabled={saving}
          className="w-full bg-blue-600 text-white font-bold rounded-2xl py-4 text-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {saving ? 'Assigning...' : 'Confirm Assignment'}
        </button>
      </div>
    </div>
  )
}