import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS_OPTS = ['available', 'busy', 'off_duty']
const STATUS_META = {
  available: { label: 'Available', dot: 'bg-green-500', cls: 'badge-green' },
  busy:      { label: 'Busy',      dot: 'bg-amber-500', cls: 'badge-yellow' },
  off_duty:  { label: 'Off Duty',  dot: 'bg-gray-400',  cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
}

export default function DoctorBoard() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/doctors/')
      .then(r => r.json())
      .then(setDoctors)
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id, status) {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    await fetch(`/api/doctors/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/staff')} className="text-blue-600 mb-4 text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Availability Board</h1>

        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-3">
            {doctors.map(doc => {
              const m = STATUS_META[doc.status] ?? STATUS_META.off_duty
              return (
                <div key={doc.id} className="card flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.dot}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{doc.name}</div>
                    <div className="text-sm text-gray-400">{doc.specialty} — Room {doc.room}</div>
                  </div>
                  <div className="flex gap-2">
                    {STATUS_OPTS.map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(doc.id, s)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          doc.status === s
                            ? STATUS_META[s].cls
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {STATUS_META[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}