import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

const STATUS_META = {
  'Submitted':    { icon: '📋', msg: 'Your registration is received. Please remain seated.',           color: 'text-blue-600',  bg: 'bg-blue-50' },
  'Under Review': { icon: '🔍', msg: 'A staff member is reviewing your case. Please wait.',            color: 'text-amber-600', bg: 'bg-amber-50' },
  'Assigned':     { icon: '👨‍⚕️', msg: 'You have been assigned. Wait for your number to be called.',   color: 'text-green-600', bg: 'bg-green-50' },
  'Your Turn':    { icon: '🔔', msg: "IT'S YOUR TURN! Please proceed to the assigned room.",           color: 'text-red-600',   bg: 'bg-red-50' },
}

export default function ScannerStation() {
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [scanMode, setScanMode] = useState(true)
  const [manualUrn, setManualUrn] = useState('')
  const scannerObj = useRef(null)

  useEffect(() => {
    if (!scanMode) return
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false)
    scanner.render(onScanSuccess, () => {})
    scannerObj.current = scanner
    return () => scanner.clear().catch(() => {})
  }, [scanMode])

  async function onScanSuccess(urn) {
    scannerObj.current?.pause()
    await lookupUrn(urn)
  }

  async function lookupUrn(urn) {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/api/patients/${urn}/status/`)
      if (!res.ok) throw new Error()
      setResult(await res.json())
    } catch {
      setError('QR code not found. Please check with a staff member.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setError('')
    setManualUrn('')
    scannerObj.current?.resume()
  }

  const meta = result ? (STATUS_META[result.status] ?? STATUS_META['Submitted']) : null

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">SpeedCare</h1>
          <p className="text-gray-400 text-sm">Queue Status Checkpoint</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setScanMode(true); reset() }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${scanMode ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >
            📷 Scan QR
          </button>
          <button
            onClick={() => { setScanMode(false); reset() }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!scanMode ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >
            ⌨️ Enter Code
          </button>
        </div>

        {!result && !loading && (
          <>
            {scanMode ? (
              <div id="qr-reader" className="rounded-2xl overflow-hidden" />
            ) : (
              <div className="space-y-3">
                <input
                  value={manualUrn}
                  onChange={e => setManualUrn(e.target.value.toUpperCase())}
                  placeholder="SC-2025-XXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => lookupUrn(manualUrn)}
                  disabled={!manualUrn}
                  className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Check Status
                </button>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-500">Looking up your status...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={reset} className="bg-blue-600 text-white rounded-xl px-6 py-2 font-medium">Try Again</button>
          </div>
        )}

        {result && meta && (
          <div className={`rounded-2xl p-6 text-center ${meta.bg}`}>
            <div className="text-5xl mb-3">{meta.icon}</div>
            <div className={`text-xl font-bold mb-2 ${meta.color}`}>{result.status}</div>
            <p className="text-gray-700 mb-4">{meta.msg}</p>
            {result.room && (
              <div className="bg-white rounded-xl p-3 mb-4">
                <div className="text-xs text-gray-400 mb-1">Room</div>
                <div className="text-2xl font-bold text-gray-800">{result.room}</div>
              </div>
            )}
            <div className="text-sm text-gray-500 mb-4 font-mono font-bold">{result.urn}</div>
            <button onClick={reset} className="bg-blue-600 text-white rounded-xl px-8 py-3 font-semibold w-full">← Scan Another</button>
          </div>
        )}
      </div>
    </div>
  )
}