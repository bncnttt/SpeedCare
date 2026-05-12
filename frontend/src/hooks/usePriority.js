import { useMemo } from 'react'

export function usePriority(queue = []) {
  return useMemo(() => {
    return [...queue].sort((a, b) => {
      // Rule 1: lower triage_level = higher priority
      const aLevel = a.triage_level ?? a.triage_suggestion ?? 3
      const bLevel = b.triage_level ?? b.triage_suggestion ?? 3
      if (aLevel !== bLevel) return aLevel - bLevel
      // Rule 2: seniors (60+) and PWDs first
      const aPriority = (a.age >= 60 || a.is_pwd) ? 0 : 1
      const bPriority = (b.age >= 60 || b.is_pwd) ? 0 : 1
      if (aPriority !== bPriority) return aPriority - bPriority
      // Rule 3: earliest arrival wins
      return new Date(a.registered_at) - new Date(b.registered_at)
    })
  }, [queue])
}