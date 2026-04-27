import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type OpenState = null | { kind: 'signup' } | { kind: 'signin' } | { kind: 'offline' }

type AuthModalContextValue = {
  open: OpenState
  openSignUp: () => void
  openSignIn: () => void
  openOffline: () => void
  close: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<OpenState>(null)

  const openSignUp = useCallback(() => {
    setOpen({ kind: 'signup' })
  }, [])

  const openSignIn = useCallback(() => {
    setOpen({ kind: 'signin' })
  }, [])

  const openOffline = useCallback(() => {
    setOpen({ kind: 'offline' })
  }, [])

  const close = useCallback(() => setOpen(null), [])

  const value = useMemo(
    () => ({ open, openSignUp, openSignIn, openOffline, close }),
    [open, openSignUp, openSignIn, openOffline, close],
  )

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }
  return ctx
}
