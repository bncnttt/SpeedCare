import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueue } from '../hooks/useQueue.js'
import { usePriority } from '../hooks/usePriority.js'

const TRIAGE_MAP = {
  0: { label: 'Emergency', cls: 'badge-red' },
  1: { label: 'Urgent',    cls: 'badge-orange' },
  2: { label: 'Moderate',  cls: 'badge-yellow' },
  3: { label: 'Routine',   cls: 'badge-green' },
}

const STATUS_FILTERS = ['All', 'Submitted', 'Under Review', 'Assigned', 'Your Turn']

export default function Dashboard() {
  const navigate = useNavigate()
  const { queue, loading, error, refetch } = useQueue()
  const sorted = usePriority(queue)

  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch]             = useState('')

  const filtered = sorted.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    const matchSearch = p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.urn?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    total:    queue.length,
    waiting:  queue.filter(p => p.status !== 'Your Turn' && p.status !== 'Done').length,
    critical: queue.filter(p => p.triage_level === 0 || p.triage_suggestion === 0).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700">SpeedCare Staff Portal</h1>
        <div className="flex gap-2">
          <NavBtn label="Doctors"    onClick={() => navigate('/staff/doctors')} />
          <NavBtn label="Audit Log"  onClick={() => navigate('/staff/audit')} />
          <NavBtn label="Shift Notes" onClick={() => navigate('/staff/notes')} />
          <button
            onClick={refetch}
            className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Patients" value={counts.total}    color="text-blue-700" />
          <StatCard label="In Queue"       value={counts.waiting}  color="text-amber-600" />
          <StatCard label="Critical (L0)"  value={counts.critical} color="text-red-600" />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap items-center">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or URN..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-56"
          />
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : error ? (
          <div className="card text-red-600 text-center py-8">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="card text-center text-gray-400 py-12">No patients found.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['#', 'Queue No.', 'Name', 'Age', 'Reason', 'Triage', 'Status', 'Flags', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const level = p.triage_level ?? p.triage_suggestion ?? 3
                  const tm    = TRIAGE_MAP[level] ?? TRIAGE_MAP[3]
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-blue-700">{p.urn}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.full_name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.age}</td>
                      <td className="px-4 py-3 text-gray-600">{p.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tm.cls}`}>
                          {tm.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.status}</td>
                      <td className="px-4 py-3">
                        {p.age >= 60 && <span title="Senior">⭐</span>}
                        {p.is_pwd   && <span title="PWD">♿</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/staff/assign/${p.id}`)}
                          className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-blue-100 transition"
                        >
                          Assign →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  )
}

function NavBtn({ label, onClick }) {
  return (
    <button onClick={onClick} className="text-sm text-gray-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-gray-100">
      {label}
    </button>
  )
}