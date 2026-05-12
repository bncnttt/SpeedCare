import React from 'react'
import { Routes, Route } from 'react-router-dom'

import PreRegistrationForm from './components/PreRegistrationForm.jsx'
import QRReceipt           from './components/QRReceipt.jsx'
import WaitingScreen       from './components/WaitingScreen.jsx'
import PatientInfo         from './components/PatientInfo.jsx'
import HospitalChatbot     from './components/HospitalChatbot.jsx'

import KioskApp   from './kiosk/KioskApp.jsx'
import KioskPrint from './kiosk/KioskPrint.jsx'

import ScannerStation from './scanner/ScannerStation.jsx'

import Dashboard       from './staff/Dashboard.jsx'
import AssignmentPanel from './staff/AssignmentPanel.jsx'
import DoctorBoard     from './staff/DoctorBoard.jsx'
import AuditLog        from './staff/AuditLog.jsx'
import ShiftNotes      from './staff/ShiftNotes.jsx'

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

      {/* Staff portal */}
      <Route path="/staff"            element={<Dashboard />} />
      <Route path="/staff/assign/:id" element={<AssignmentPanel />} />
      <Route path="/staff/doctors"    element={<DoctorBoard />} />
      <Route path="/staff/audit"      element={<AuditLog />} />
      <Route path="/staff/notes"      element={<ShiftNotes />} />
    </Routes>
  )
}