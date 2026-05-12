import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hospitalInfo } from '../data/hospitalInfo.js'

const QUICK_QUESTIONS = [
  { en: 'What are your operating hours?',      bi: 'Unsa ang inyong oras sa operasyon?' },
  { en: 'Where is the Emergency Room?',         bi: 'Asa ang Emergency Room?' },
  { en: 'What documents do I need?',            bi: 'Unsa ang mga dokumento nga gikinahanglan?' },
  { en: 'How much is the consultation fee?',    bi: 'Pila ang bayad sa konsultasyon?' },
]

const MEDICAL_KEYWORDS = [
  'pain', 'sakit', 'sick', 'symptom', 'diagnos',
  'medic', 'treat', 'cure', 'medicine', 'gamot',
]

function getBotResponse(question) {
  const q = question.toLowerCase()

  if (MEDICAL_KEYWORDS.some(kw => q.includes(kw))) {
    return "I can only answer administrative questions like schedules, fees, and directions. For medical concerns, please wait for a doctor or notify a staff member immediately. 🏥"
  }
  if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('oras')) {
    return hospitalInfo.hours
  }
  if (q.includes('emergency') || q.includes('er') || q.includes('emerhensya')) {
    return hospitalInfo.emergency_location
  }
  if (q.includes('document') || q.includes('dokumento') || q.includes('bring')) {
    return hospitalInfo.required_documents
  }
  if (q.includes('fee') || q.includes('cost') || q.includes('bayad') || q.includes('much') || q.includes('price')) {
    return hospitalInfo.fees
  }
  if (q.includes('department') || q.includes('floor') || q.includes('where') || q.includes('asa') || q.includes('room')) {
    return hospitalInfo.departments
  }
  if (q.includes('doctor') || q.includes('schedule') || q.includes('doktor')) {
    return hospitalInfo.doctor_schedule
  }
  return "I'm not sure about that. I can help with: operating hours, department locations, required documents, fees, and doctor schedules. For emergencies, please notify the nearest staff member."
}

export default function HospitalChatbot() {
  const navigate = useNavigate()
  const [lang, setLang]     = useState('en')
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm the SpeedCare hospital info assistant. I can answer questions about schedules, departments, fees, and required documents. I cannot give medical advice. How can I help you?",
    },
  ])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function sendMessage(text) {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text: text.trim() }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: getBotResponse(text) }])
      setTyping(false)
    }, 700)
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 p-1 text-xl">
          ←
        </button>
        <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          💬
        </div>
        <div>
          <div className="font-semibold text-gray-800 text-sm">Hospital Info Assistant</div>
          <div className="text-xs text-green-500">● Online</div>
        </div>
        <div className="ml-auto flex gap-1 bg-gray-100 p-1 rounded-lg">
          {['en', 'bi'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                lang === l ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              {l === 'en' ? 'EN' : 'BI'}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-700 text-center">
        ⚠️ Administrative info only. For medical emergencies, contact staff immediately.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'bot' && (
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                🏥
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-sm">🏥</div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(lang === 'bi' ? q.bi : q.en)}
            className="flex-shrink-0 text-xs bg-white border border-indigo-200 text-indigo-700 rounded-full px-3 py-1.5 hover:bg-indigo-50 transition"
          >
            {lang === 'bi' ? q.bi : q.en}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); sendMessage(input) }}
        className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === 'bi' ? 'Pangutana dinhi...' : 'Ask something...'}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-xl px-4 font-medium text-sm hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  )
}