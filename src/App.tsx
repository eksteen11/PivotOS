import { RouterProvider } from 'react-router-dom'

import { SyncRunner } from './app/shell/SyncRunner'
import { AppProvider } from './app/state/AppState'
import { router } from './app/router'

export default function App() {
  return (
    <AppProvider>
      <SyncRunner />
      <RouterProvider router={router} />
    </AppProvider>
  )
}
