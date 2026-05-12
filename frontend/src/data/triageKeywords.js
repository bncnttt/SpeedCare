export const TRIAGE_KEYWORDS = {
  0: [
    'heart attack', 'cardiac arrest', 'stroke', 'unconscious', 'not breathing',
    'chest pain', 'sakit sa dughan', 'seizure', 'severe bleeding', 'major trauma',
    'difficulty breathing', 'lisod ginhawa', 'overdose',
  ],
  1: [
    'high fever', 'broken bone', 'fracture', 'severe pain', 'vomiting blood',
    'head injury', 'allergic reaction', 'faint', 'dizzy', 'shortness of breath',
  ],
  2: [
    'fever', 'abdominal pain', 'moderate pain', 'laceration', 'wound',
    'nausea', 'vomiting', 'diarrhea', 'urinary pain', 'back pain',
  ],
  3: [
    'consultation', 'check-up', 'follow-up', 'vaccination', 'laboratory',
    'prescription', 'referral', 'chronic', 'annual',
  ],
}

export function suggestTriageLevel(symptoms = '', reason = '') {
  const text = `${symptoms} ${reason}`.toLowerCase()
  for (const [level, keywords] of Object.entries(TRIAGE_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return parseInt(level)
  }
  return 3
}