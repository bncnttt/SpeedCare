import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VISIT_REASONS = [
  { en: 'Emergency',    bi: 'Emerhensya' },
  { en: 'Consultation', bi: 'Konsultasyon' },
  { en: 'Laboratory',   bi: 'Laboratoryo' },
  { en: 'Follow-up',    bi: 'Follow-up' },
  { en: 'Vaccination',  bi: 'Bakuna' },
  { en: 'Other',        bi: 'Uban pa' },
]

export default function PreRegistrationForm() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('en')
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    sex: '',
    reason: '',
    is_pwd: false,
    symptoms: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const t = (en, bi) => lang === 'bi' ? bi : en

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.full_name || !form.age || !form.sex || !form.reason) {
      setError(t(
        'Please fill in all required fields.',
        'Palihug pun-a ang tanan nga kinahanglanon.'
      ))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      navigate('/receipt', { state: { patient: data } })
    } catch {
      setError(t(
        'Something went wrong. Please try again.',
        'May sayop. Palihug sulayi pag-usab.'
      ))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white px-4 py-8 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">SpeedCare</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {t('Hospital Fast-Track System', 'Sistema sa Paspas nga Pagparehistro')}
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {['en', 'bi'].map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                lang === l
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {l === 'en' ? 'English' : 'Bisaya'}
            </button>
          ))}
        </div>
      </div>

      {/* Chatbot button — prominent, before the form */}
      <button
        type="button"
        onClick={() => navigate('/chatbot')}
        className="mb-6 w-full flex items-center gap-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-2xl px-4 py-3.5 hover:bg-indigo-100 transition-colors"
      >
        <span className="text-2xl">💬</span>
        <div className="text-left">
          <div className="font-semibold text-sm">
            {t('Hospital Info Chatbot', 'Chatbot sa Impormasyon sa Ospital')}
          </div>
          <div className="text-xs text-indigo-500">
            {t(
              'Ask about schedules, rooms, fees & more',
              'Pangutana bahin sa oras, kwarto, bayad ug uban pa'
            )}
          </div>
        </div>
        <span className="ml-auto text-indigo-400 text-lg">›</span>
      </button>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card flex-1 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-gray-800">
          {t('Patient Registration', 'Pagparehistro sa Pasyente')}
        </h2>

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t('Full Name', 'Tibuok Ngalan')} <span className="text-red-500">*</span>
          </label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Juan Dela Cruz"
            className="border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Age + Sex */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-gray-700">
              {t('Age', 'Edad')} <span className="text-red-500">*</span>
            </label>
            <input
              name="age"
              type="number"
              min="0"
              max="130"
              value={form.age}
              onChange={handleChange}
              placeholder="0"
              className="border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium text-gray-700">
              {t('Sex', 'Kasarian')} <span className="text-red-500">*</span>
            </label>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">{t('Select', 'Pili')}</option>
              <option value="M">{t('Male', 'Lalaki')}</option>
              <option value="F">{t('Female', 'Babaye')}</option>
              <option value="O">{t('Other', 'Uban')}</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t('Reason for Visit', 'Hinungdan sa Pagbisita')} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VISIT_REASONS.map(r => (
              <button
                key={r.en}
                type="button"
                onClick={() => setForm(f => ({ ...f, reason: r.en }))}
                className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                  form.reason === r.en
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                {lang === 'bi' ? r.bi : r.en}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t(
              'Describe your symptoms (optional)',
              'Ihulagway ang imong mga sintomas (opsyonal)'
            )}
          </label>
          <textarea
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            placeholder={t(
              'e.g. Chest pain, difficulty breathing...',
              'hal. Sakit sa dughan, lisod ginhawa...'
            )}
            rows={3}
            className="border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* PWD */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_pwd"
            checked={form.is_pwd}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-blue-600"
          />
          <span className="text-sm text-gray-700">
            {t(
              'I am a Person with Disability (PWD)',
              'Ako ay Taong May Kapansanan (PWD)'
            )}
          </span>
        </label>

        {/* Senior auto-detect */}
        {parseInt(form.age) >= 60 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span>🌟</span>
            <span className="text-sm text-amber-800 font-medium">
              {t(
                'Senior citizen priority detected (60+)',
                'Nakita ang prioridad ng senior citizen (60+)'
              )}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-auto bg-blue-600 text-white font-semibold rounded-2xl py-4 text-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading
            ? t('Submitting...', 'Gipadala...')
            : t('Register & Get Queue Number', 'Magparehistro ug Kuhaon ang Numero')}
        </button>
      </form>
    </div>
  )
}