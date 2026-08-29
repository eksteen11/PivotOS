import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { isProduction } from '@/lib/env'

export default function SettingsPage() {
  return <SettingsPanel allowDemoReset={!isProduction} />
}
