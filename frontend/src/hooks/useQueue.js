import { useState, useEffect, useCallback } from 'react'

export function useQueue() {
  const [queue, setQueue]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/patients/')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setQueue(data)
    } catch {
      setError('Failed to load queue.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQueue()
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/queue/')
    ws.onmessage = () => fetchQueue()
    ws.onerror   = () => setError('WebSocket error. Falling back to polling.')
    const poll = setInterval(fetchQueue, 15000)
    return () => { ws.close(); clearInterval(poll) }
  }, [fetchQueue])

  async function updatePatientStatus(id, updates) {
    const res = await fetch(`/api/queue/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('Update failed')
    await fetchQueue()
    return res.json()
  }

  return { queue, loading, error, refetch: fetchQueue, updatePatientStatus }
}