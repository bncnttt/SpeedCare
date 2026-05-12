import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const STATUSES = ['Submitted', 'Under Review', 'Assigned', 'Your Turn']

const STATUS_META = {
  'Submitted':    { icon: '📋', color: 'text-blue-600',  bg: 'bg-blue-50',  desc: 'Your registration has been received.' },
  'Under Review': { icon: '🔍', color: 'text-amber-600', bg: 'bg-amber-50', desc: 'A staff member is reviewing your case.' },
  'Assigned':     { icon: '👨‍⚕️', color: 'text-green-600', bg: 'bg-green-50', desc: 'You have been assigned to a doctor.' },
  'Your Turn':    { icon: '🔔', color: 'text-red-600',   bg: 'bg-red-50',   desc: 'Please proceed to the assigned room now.' },
}

const TRIAGE_MAP = {
  0: { label: 'Emergency', cls: 'badge-red' },
  1: { label: 'Urgent',    cls: 'badge-orange' },
  2: { label: 'Moderate',  cls: 'badge-yellow' },
  3: { label: 'Routine',   cls: 'badge-green' },
}

export default function WaitingScreen() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const urn = state?.urn || localStorage.getItem('speedcare_urn')

  const [info, setInfo]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchStatus = useCallback(async () => {
    if (!urn) return
    try {
      const res = await fetch(`/api/patients/${urn}/status/`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setInfo(data)
    } catch {
      setError('Could not load status. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [urn])

  useEffect(() => {
    if (urn) localStorage.setItem('speedcare_urn', urn)
    fetchStatus()

    const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/queue/')
    ws.onmessage = () => fetchStatus()

    const poll = setInterval(fetchStatus, 15000)
    return () => { ws.close(); clearInterval(poll) }
  }, [urn, fetchStatus])

  if (!urn) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">No active queue ticket found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white rounded-xl px-6 py-3"
          >
            Register Now
          </button>
        </div>
      </div>
    )
  }

  const currentStatus = info?.status || 'Submitted'
  const meta          = STATUS_META[currentStatus]
  const stepIndex     = STATUSES.indexOf(currentStatus)

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Queue Status</h1>
        <p className="text-gray-400 text-sm mb-6">
          Ticket: <span className="font-mono font-bold text-blue-700">{urn}</span>
        </p>

        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-500">Loading status...</p>
          </div>
        ) : error ? (
          <div className="card bg-red-50 border border-red-200 text-center py-8">
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={fetchStatus} className="text-blue-600 underline">Try again</button>
          </div>
        ) : (
          <>
            {/* Status card */}
            <div className={`card mb-4 text-center border-0 ${meta.bg}`}>
              <div className="text-5xl mb-3">{meta.icon}</div>
              <div className={`text-xl font-bold mb-1 ${meta.color}`}>{currentStatus}</div>
              <p className="text-gray-600 text-sm">{meta.desc}</p>

              {info?.room && (
                <div className="mt-4 bg-white rounded-xl px-4 py-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Room</div>
                  <div className="text-2xl font-bold text-gray-800">{info.room}</div>
                </div>
              )}
              {info?.doctor_name && (
                <div className="mt-2 text-sm text-gray-600">
                  Dr. <span className="font-semibold">{info.doctor_name}</span>
                </div>
              )}
            </div>

            {/* Progress stepper */}
            <div className="card mb-4">
              <div className="flex items-start gap-2">
                {STATUSES.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      i < stepIndex   ? 'bg-blue-600 border-blue-600 text-white' :
                      i === stepIndex ? 'bg-white border-blue-600 text-blue-600' :
                                        'bg-gray-100 border-gray-200 text-gray-400'
                    }`}>
                      {i < stepIndex ? '✓' : i + 1}
                    </div>
                    <div className={`text-center text-[10px] leading-tight ${
                      i <= stepIndex ? 'text-blue-700 font-medium' : 'text-gray-400'
                    }`}>
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue position */}
            {info?.queue_position && (
              <div className="card text-center mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Position in Queue</div>
                <div className="text-4xl font-bold text-blue-700">#{info.queue_position}</div>
                {info.estimated_wait && (
                  <p className="text-sm text-gray-500 mt-1">~{info.estimated_wait} min wait</p>
                )}
              </div>
            )}

            {/* Triage level */}
            {info?.triage_level !== undefined && info?.triage_level !== null && (
              <div className={`rounded-xl px-4 py-2 text-sm font-semibold text-center ${
                TRIAGE_MAP[info.triage_level]?.cls || 'badge-green'
              }`}>
                Triage Level {info.triage_level} — {TRIAGE_MAP[info.triage_level]?.label}
              </div>
            )}

            <button
              onClick={fetchStatus}
              className="w-full mt-3 text-sm text-blue-600 py-3 hover:underline"
            >
              ↻ Refresh Status
            </button>
          </>
        )}
      </div>
    </div>
  )
}