// Import PrimeVue styles
import './styles.css'
import './styles/main.scss'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import PrimeVue from 'primevue/config'
import { DeepLinkService } from './services/deepLink.service'
import { createPinia } from 'pinia'
import primeVueTheme from './prime-vue-theme'

/* Theme variables */
import './theme/variables.css'

// Import custom styles


// Initialize deep link service
console.log('Initializing app with deep link service')

const app = createApp(App)
const pinia = createPinia()

app.use(IonicVue)
app.use(PrimeVue, {
  theme: primeVueTheme,
})
app.use(pinia)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})

// Initialize deep linking
DeepLinkService.getInstance().initialize()
