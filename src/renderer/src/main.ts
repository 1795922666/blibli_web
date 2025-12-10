import '@renderer/assets/main.ts'
import { setupPinia } from '@renderer/plugin/pinia'
import { setupRouter } from '@renderer/router'
import { createApp } from 'vue'
import App from './App.vue'
import { setupNaiveUIMessage } from './plugin/navie-uis'
const app = createApp(App)
setupPinia(app)
setupRouter(app)
setupNaiveUIMessage()
app.mount('#app')
