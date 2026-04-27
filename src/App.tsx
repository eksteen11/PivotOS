import { RouterProvider } from 'react-router-dom'

import { AuthGate } from './app/shell/AuthGate'
import { SyncRunner } from './app/shell/SyncRunner'
import { AppProvider } from './app/state/AppState'
import { router } from './app/router'

export default function App() {
  return (
    <>
      <AuthGate>
        <SyncRunner />
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </AuthGate>
    </>
  )
}
