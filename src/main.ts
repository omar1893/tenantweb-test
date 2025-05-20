// Import PrimeVue styles
import './styles.css'
import '@/styles/variables.scss'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import PrimeVue from 'primevue/config'
import { deepLinkService } from './services/deepLinkService'
import { createPinia } from 'pinia'
import primeVueTheme from './prime-vue-theme'

/* Theme variables */
import './theme/variables.css'

// Import custom styles
import './styles/main.scss'

// Initialize deep link service
console.log('Initializing app with deep link service')
deepLinkService // This will trigger the singleton initialization

const app = createApp(App)
  .use(IonicVue)
  .use(PrimeVue, {
    theme: primeVueTheme,
  })
  .use(createPinia())
  .use(router)

router.isReady().then(() => {
  app.mount('#app')
})
