import * as React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  title: string
  message?: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const showToast = React.useCallback(
    (title: string, message?: string, type: ToastType = 'success') => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, title, message, type }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    },
    [],
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Top Right Toast Notification Container with Safe-Area Inset */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 sm:top-5 sm:right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-3 pt-safe"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl animate-scale-in transition-all duration-200',
              'bg-surface/95 border-border/90 text-ink',
              toast.type === 'success' && 'border-emerald-500/30 shadow-[0_4px_24px_rgba(16,185,129,0.18)]',
              toast.type === 'error' && 'border-rose-500/30 shadow-[0_4px_24px_rgba(244,63,94,0.18)]',
              toast.type === 'info' && 'border-indigo-500/30 shadow-[0_4px_24px_rgba(99,102,241,0.18)]',
            )}
          >
            {/* Icon Badge */}
            {toast.type === 'success' && (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald mt-0.5">
                <CheckCircle2 className="size-4 stroke-[2.5]" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500 mt-0.5">
                <AlertCircle className="size-4 stroke-[2.5]" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500 mt-0.5">
                <Info className="size-4 stroke-[2.5]" />
              </div>
            )}

            {/* Content Text */}
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-ink leading-snug">{toast.title}</span>
              {toast.message && (
                <span className="text-xs text-ink-muted leading-relaxed break-words">{toast.message}</span>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-ink-subtle hover:text-ink transition-colors p-1 rounded-lg hover:bg-muted-surface cursor-pointer select-none active:scale-90"
              aria-label="Close notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)
  if (!context) {
    return {
      showToast: () => {},
    }
  }
  return context
}
