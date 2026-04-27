import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Keep V1 calm: auto-update on next reload.
  },
  onOfflineReady() {
    // No UI yet; offline readiness is still valuable.
  },
})

