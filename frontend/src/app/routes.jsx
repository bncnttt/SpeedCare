import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PreRegistrationForm from '../components/PreRegistrationForm.jsx'
import QRReceipt           from '../components/QRReceipt.jsx'
import WaitingScreen       from '../components/WaitingScreen.jsx'
import PatientInfo         from '../components/PatientInfo.jsx'
import HospitalChatbot     from '../components/ChatbotAssistant.jsx'

import KioskApp   from '../kiosk/KioskApp.jsx'
import KioskPrint from '../kiosk/KioskPrint.jsx'

import ScannerStation from '../scanner/ScannerStation.jsx'

import AdminLogin      from '../admin/AdminLogin.jsx'
import AdminDashboard  from '../admin/AdminDashboard.jsx'
import DoctorDashboard from '../doctor/DoctorDashboard.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Patient flow */}
      <Route path="/"             element={<PreRegistrationForm />} />
      <Route path="/receipt"      element={<QRReceipt />} />
      <Route path="/waiting"      element={<WaitingScreen />} />
      <Route path="/patient/:urn" element={<PatientInfo />} />
      <Route path="/chatbot"      element={<HospitalChatbot />} />

      {/* Kiosk */}
      <Route path="/kiosk"       element={<KioskApp />} />
      <Route path="/kiosk/print" element={<KioskPrint />} />

      {/* Scanner checkpoint */}
      <Route path="/scanner" element={<ScannerStation />} />

      {/* Nurse and doctor dashboards */}
      <Route path="/admin"            element={<AdminLogin />} />
      <Route path="/admin/dashboard"  element={<AdminDashboard />} />
      <Route path="/nurse"            element={<AdminLogin />} />
      <Route path="/nurse/dashboard"  element={<AdminDashboard />} />
      <Route path="/doctor"           element={<DoctorDashboard />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    </Routes>
  )
}
