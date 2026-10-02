import * as React from 'react'
import { translations, type Language, type TranslationKey } from './translations'

interface LanguageContextValue {
  language: Language
  dir: 'rtl' | 'ltr'
  isRTL: boolean
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  formatDate: (iso: string) => string
  formatNumber: (num: number) => string
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'taqyeem_lang_pref'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null
      if (stored === 'ar' || stored === 'en') return stored
    }
    return 'ar'
  })

  const isRTL = language === 'ar'
  const dir: 'rtl' | 'ltr' = isRTL ? 'rtl' : 'ltr'

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir
      document.documentElement.lang = language
      localStorage.setItem(STORAGE_KEY, language)
    }
  }, [language, dir])

  const setLanguage = React.useCallback((newLang: Language) => {
    setLanguageState(newLang)
  }, [])

  const toggleLanguage = React.useCallback(() => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }, [])

  const t = React.useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = translations[language] || translations.ar
      let text = (dict[key] as string) || (translations.ar[key] as string) || String(key)

      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal))
        })
      }

      return text
    },
    [language],
  )

  const formatDate = React.useCallback(
    (iso: string) => {
      try {
        const date = new Date(iso)
        return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      } catch {
        return iso
      }
    },
    [language],
  )

  const formatNumber = React.useCallback(
    (num: number) => {
      return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(num)
    },
    [language],
  )

  const value = React.useMemo(
    () => ({
      language,
      dir,
      isRTL,
      setLanguage,
      toggleLanguage,
      t,
      formatDate,
      formatNumber,
    }),
    [language, dir, isRTL, setLanguage, toggleLanguage, t, formatDate, formatNumber],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
