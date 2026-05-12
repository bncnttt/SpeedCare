import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuditLog() {
  const navigate = useNavigate()
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/staff/audit-log/')
      .then(r => r.json())
      .then(setLogs)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/staff')} className="text-blue-600 mb-4 text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Audit Log</h1>
        <p className="text-gray-400 text-sm mb-6">
          All AI triage overrides are recorded here for clinical review and liability.
        </p>

        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <div className="card text-center text-gray-400 py-12">No audit records found.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['Time', 'Patient', 'AI Level', 'Staff Level', 'Staff ID', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-blue-700 text-xs">{log.patient_urn}</td>
                    <td className="px-4 py-3">
                      <span className="badge-blue rounded-full px-2 py-0.5 text-xs">L{log.ai_suggestion}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        log.final_level < log.ai_suggestion ? 'badge-red' :
                        log.final_level > log.ai_suggestion ? 'badge-green' : 'badge-yellow'
                      }`}>
                        L{log.final_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{log.staff_id}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}