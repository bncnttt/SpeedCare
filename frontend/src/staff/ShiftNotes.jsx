import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ShiftNotes() {
  const navigate = useNavigate()
  const [notes, setNotes]     = useState([])
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    fetch('/api/staff/shift-notes/')
      .then(r => r.json())
      .then(setNotes)
      .catch(() => {})
  }, [])

  async function addNote() {
    if (!newNote.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/staff/shift-notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      })
      const data = await res.json()
      setNotes(prev => [data, ...prev])
      setNewNote('')
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate('/staff')} className="text-blue-600 mb-4 text-sm">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shift Notes</h1>

        <div className="card mb-4">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Add a shift handover note..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-3"
          />
          <button
            onClick={addNote}
            disabled={saving || !newNote.trim()}
            className="bg-blue-600 text-white rounded-xl px-5 py-2.5 font-medium text-sm hover:bg-blue-700 transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add Note'}
          </button>
        </div>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="card text-center text-gray-400 py-8">No shift notes yet.</div>
          ) : notes.map(n => (
            <div key={n.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
                <span className="text-xs font-medium text-blue-600">{n.staff_name || 'Staff'}</span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}