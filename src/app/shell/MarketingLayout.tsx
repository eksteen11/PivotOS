import { AuthModalProvider } from './authModal/AuthModalContext'
import { MarketingShell } from './MarketingShell'

export function MarketingLayout() {
  return (
    <AuthModalProvider>
      <MarketingShell />
    </AuthModalProvider>
  )
}
