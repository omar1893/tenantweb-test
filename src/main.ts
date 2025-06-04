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
import { App as CapacitorApp } from '@capacitor/app'
import { useUIStore } from './stores/UIStore'

/* Theme variables */
import './theme/variables.css'


console.log('Initializing app with deep link service')
DeepLinkService.getInstance().initialize()

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


CapacitorApp.addListener('appUrlOpen', async (data: any) => {
  console.log('AppUrlOpen event received:', data)
  if (data && data.url) {
    try {
      const url = new URL(data.url)
      const uiStore = useUIStore()
      uiStore.hideLoginModal() // Close modal when receiving any deeplink

      if (url.pathname === '/auth-callback' || url.searchParams.get('auth_callback') === '1') {
        router.push({ name: 'AuthCallback', query: Object.fromEntries(url.searchParams.entries()) })
        return
      }

      if (url.pathname === '/auth-verify') {
        console.log(url)
        // Decode and split the search params correctly
        const searchString = url.search.substring(1) // Remove the leading '?'
        const decodedSearch = decodeURIComponent(searchString)
        const searchParams = new URLSearchParams(decodedSearch)

        console.log('AuthVerify event received:', Object.fromEntries(searchParams.entries()))
        router.push({
          name: 'AuthVerify',
          query: Object.fromEntries(searchParams.entries())
        })
        return
      }

      if (url.protocol.startsWith('http')) {
        const propertyId = url.searchParams.get('id')
        if (propertyId) {
          router.push({
            name: 'PropertyLanding',
            params: { propertyId }
          })
        }
      }
    } catch (e) {
      console.log('Error parsing url:', e)
    }
  }
})
