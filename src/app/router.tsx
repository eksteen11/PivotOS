import { Navigate, Outlet, createHashRouter } from 'react-router-dom'

import { AppLayout } from './shell/AppLayout'
import { AuthGate } from './shell/AuthGate'
import { MarketingLayout } from './shell/MarketingLayout'
import { AgentsPage } from './views/AgentsPage'
import { CommandCentrePage } from './views/CommandCentrePage'
import { ContactsPage } from './views/ContactsPage'
import { DealsPage } from './views/DealsPage'
import { DocumentsPage } from './views/DocumentsPage'
import { InboxPage } from './views/InboxPage'
import { LibraryPage } from './views/LibraryPage'
import { MeetingsPage } from './views/MeetingsPage'
import { HomePage } from './views/HomePage'
import { JoinPage } from './views/JoinPage'
import { SettingsPage } from './views/SettingsPage'
import { ProjectsPage } from './views/ProjectsPage'
import { TasksPage } from './views/TasksPage'
import { TodayPage } from './views/TodayPage'

export const router = createHashRouter([
  {
    path: '/home',
    element: <MarketingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'join', element: <JoinPage /> },
    ],
  },
  {
    element: (
      <AuthGate>
        <Outlet />
      </AuthGate>
    ),
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/command" replace /> },
          { path: '/command', element: <CommandCentrePage /> },
          { path: '/today', element: <TodayPage /> },
          { path: '/tasks', element: <TasksPage /> },
          { path: '/projects', element: <ProjectsPage /> },
          { path: '/contacts', element: <ContactsPage /> },
          { path: '/deals', element: <DealsPage /> },
          { path: '/documents', element: <DocumentsPage /> },
          { path: '/inbox', element: <InboxPage /> },
          { path: '/library', element: <LibraryPage /> },
          { path: '/meetings', element: <MeetingsPage /> },
          { path: '/agents', element: <AgentsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/command" replace /> },
        ],
      },
    ],
  },
])

