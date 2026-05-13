import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const translations = {
  en: {
    additional_info: 'Additional Information',
    phone: 'Phone Number',
    email: 'Email Address',
    address: 'Address',
    emergency_contact: 'Emergency Contact Name',
    medical_history: 'Medical History (Optional)',
    allergies: 'Known Allergies',
    none: 'None',
    register: 'Complete Registration',
    skip: 'Skip & Continue',
    optional: 'optional',
    required: 'required'
  },
  bis: {
    additional_info: 'Dagdag na Impormasyon',
    phone: 'Numero sa Telepono',
    email: 'Email Address',
    address: 'Adres',
    emergency_contact: 'Ngalan ng Emergency Contact',
    medical_history: 'Kasaysayan sa Kalusugan (Opsyonal)',
    allergies: 'Kilalang Alerhiya',
    none: 'Wala',
    register: 'Kumpletuhin ang Pagparehistro',
    skip: 'Balsa & Magpatuloy',
    optional: 'opsyonal',
    required: 'kinahanglanon'
  }
};

export default function PreRegistrationForm({ language = 'en', patientName, onSubmit, onSkip }) {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key) => translations[language]?.[key] || translations.en[key];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic email validation if provided
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = language === 'bis' ? 'Hindi balido ang email' : 'Invalid email format';
    }
    
    // Phone validation if provided
    if (formData.phone && !formData.phone.match(/^\d{10,}$/)) {
      newErrors.phone = language === 'bis' ? 'Kinahanglanon ang valid na numero' : 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate a brief delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit({ ...formData });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-blue-700">{t('additional_info')}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {language === 'bis' 
            ? `Salamat, ${patientName}. Ang mga sumusunod ay opsyonal.` 
            : `Thank you, ${patientName}. The following information is optional.`}
        </p>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          
          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('phone')}
              <span className="text-gray-400 text-xs font-normal ml-1">({t('optional')})</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09123456789"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                errors.phone
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500'
              } focus:outline-none`}
            />
            {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('email')}
              <span className="text-gray-400 text-xs font-normal ml-1">({t('optional')})</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@example.com"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                errors.email
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500'
              } focus:outline-none`}
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('address')}
              <span className="text-gray-400 text-xs font-normal ml-1">({t('optional')})</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={language === 'bis' ? 'Adres' : 'Street Address'}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Emergency Contact */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('emergency_contact')}
              <span className="text-gray-400 text-xs font-normal ml-1">({t('optional')})</span>
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder={language === 'bis' ? 'Ngalan' : 'Full Name'}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Medical History */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('medical_history')}
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder={language === 'bis' 
                ? 'hal. Diabetes, Asthma...' 
                : 'e.g. Diabetes, High Blood Pressure...'}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Allergies */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('allergies')}
              <span className="text-gray-400 text-xs font-normal ml-1">({t('optional')})</span>
            </label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder={language === 'bis' ? 'hal. Penicillin' : 'e.g. Penicillin, Shellfish...'}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {language === 'bis' ? 'Pinapadala...' : 'Submitting...'}
            </>
          ) : (
            <>
              {t('register')}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          onClick={handleSkip}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {t('skip')}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
