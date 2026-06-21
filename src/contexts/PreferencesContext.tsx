import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark'

interface PreferencesState {
  theme: ThemeMode
}

interface PreferencesContextValue extends PreferencesState {
  setTheme: (theme: ThemeMode) => void
}

const STORAGE_KEY = '@financeiro:preferences'

function loadPreferences(): PreferencesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { theme: 'light' }
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesState>(loadPreferences)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
  }, [preferences])

  const setTheme = useCallback((theme: ThemeMode) => {
    setPreferences(p => ({ ...p, theme }))
  }, [])

  return (
    <PreferencesContext.Provider value={{ ...preferences, setTheme }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences deve ser usado dentro de <PreferencesProvider>')
  return ctx
}