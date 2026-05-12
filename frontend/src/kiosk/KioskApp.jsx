import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const REASONS = ['Emergency', 'Consultation', 'Laboratory', 'Follow-up', 'Vaccination', 'Other']

export default function KioskApp() {
  const navigate = useNavigate()
  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState({ full_name: '', age: '', sex: '', reason: '', is_pwd: false, symptoms: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleFinish() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      navigate('/kiosk/print', { state: { patient: data } })
    } catch {
      setError('Registration failed. Please see a staff member.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-10">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">SpeedCare</h1>
          <p className="text-gray-400 mt-1">Self-Registration Kiosk</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800">Personal Info</h2>
            <input
              name="full_name" value={form.full_name} onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-3">
              <input
                name="age" type="number" value={form.age} onChange={handleChange}
                placeholder="Age"
                className="flex-1 border border-gray-200 rounded-2xl px-5 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                name="sex" value={form.sex} onChange={handleChange}
                className="flex-1 border border-gray-200 rounded-2xl px-5 py-4 text-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Sex</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_pwd" checked={form.is_pwd} onChange={handleChange} className="w-6 h-6 accent-blue-600" />
              <span className="text-lg text-gray-700">Person with Disability (PWD)</span>
            </label>
            {parseInt(form.age) >= 60 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 font-medium">
                ⭐ Senior Citizen priority will be applied
              </div>
            )}
            <button
              onClick={() => { if (form.full_name && form.age && form.sex) setStep(2) }}
              className="w-full bg-blue-600 text-white text-xl font-bold rounded-2xl py-5 hover:bg-blue-700 transition"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800">Reason for Visit</h2>
            <div className="grid grid-cols-2 gap-3">
              {REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setForm(f => ({ ...f, reason: r }))}
                  className={`py-5 rounded-2xl border-2 text-xl font-medium transition-all ${
                    form.reason === r
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 rounded-2xl py-4 text-lg hover:bg-gray-50">← Back</button>
              <button onClick={() => { if (form.reason) setStep(3) }} className="flex-1 bg-blue-600 text-white rounded-2xl py-4 text-lg font-bold hover:bg-blue-700 transition">Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Details</h2>
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <Row label="Name"   value={form.full_name} />
              <Row label="Age"    value={form.age} />
              <Row label="Sex"    value={form.sex === 'M' ? 'Male' : form.sex === 'F' ? 'Female' : 'Other'} />
              <Row label="Reason" value={form.reason} />
              {form.is_pwd           && <Row label="Status"   value="PWD" />}
              {parseInt(form.age) >= 60 && <Row label="Priority" value="Senior Citizen" />}
            </div>
            <textarea
              name="symptoms" value={form.symptoms} onChange={handleChange}
              placeholder="Describe symptoms (optional)"
              rows={3}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 rounded-2xl py-4 text-lg hover:bg-gray-50">← Back</button>
              <button
                onClick={handleFinish} disabled={loading}
                className="flex-1 bg-green-600 text-white rounded-2xl py-4 text-lg font-bold hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? 'Submitting...' : '✓ Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400 text-lg">{label}</span>
      <span className="text-gray-800 font-semibold text-lg">{value}</span>
    </div>
  )
}