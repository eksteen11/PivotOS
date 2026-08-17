export type NavIconName =
  | 'home'
  | 'inbox'
  | 'approval'
  | 'calendar'
  | 'activity'
  | 'process'
  | 'agent'
  | 'tools'
  | 'settings'
  | 'more'
  | 'map'

const paths: Record<NavIconName, string> = {
  home: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z',
  inbox: 'M4 4h16v13H4V4Zm0 9h5l2 3h2l2-3h5M8 8h8',
  approval: 'M6 3h12v18H6V3Zm3 9 2 2 4-5',
  calendar: 'M4 6h16v14H4V6Zm4-3v6m8-6v6M4 10h16',
  activity: 'M4 19V9m5 10V5m6 14v-7m5 7V3',
  process: 'M5 5h5v5H5V5Zm9 9h5v5h-5v-5ZM10 7.5h4a3 3 0 0 1 3 3V14M7.5 10v4a3 3 0 0 0 3 3H14',
  agent: 'M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM5 21a7 7 0 0 1 14 0M19 5v4m-2-2h4',
  tools: 'M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 2-3-3 2-3Z',
  settings: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  map: 'M4 6h16v12H4V6Zm8 0v12M4 12h16',
}

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  )
}
