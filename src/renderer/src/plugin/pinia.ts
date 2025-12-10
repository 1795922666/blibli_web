import { createPinia } from 'pinia'
import type { App } from 'vue'
import { piniaElectronSync } from './pinia-electron-sync'
export function setupPinia(app: App): void {
  const pinia = createPinia()
  pinia.use(piniaElectronSync)
  app.use(pinia)
}
