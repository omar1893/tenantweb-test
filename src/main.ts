// Import PrimeVue styles
import './styles.css'
import './styles/main.scss'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
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
app.use(ToastService)
app.component('PrimeToast', Toast)
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
      uiStore.hideLoginModal()
      console.log('url', url)
      console.log('protocol', url.protocol)
      console.log('pathname', url.pathname)

      if (url.protocol === 'tenantev:') {
        if (url.pathname === '//open' || url.pathname === '') {
          console.log('Processing tenantev:// deeplink')

          const searchParams = new URLSearchParams(url.search)
          console.log('Auth params received:', Object.fromEntries(searchParams.entries()))
          router.push({
            name: 'AuthVerify',
            query: Object.fromEntries(searchParams.entries())
          })
          return
        }

        // Handle property deep link
        if (url.pathname === '//property') {
          const searchParams = new URLSearchParams(url.search)
          const propertyId = searchParams.get('id')
          if (propertyId) {
            localStorage.setItem('current_property_id', propertyId)
          }
          return
        }
      }

      // Mantener el soporte para URLs http/https
      if (url.protocol.startsWith('http')) {
        // Manejar auth-callback
        if (url.pathname === '/auth-callback' || url.searchParams.get('auth_callback') === '1') {
          router.push({ name: 'AuthCallback', query: Object.fromEntries(url.searchParams.entries()) })
          return
        }

        // Manejar auth-verify
        if (url.pathname === '/auth-verify') {
          const searchString = url.search.substring(1)
          const decodedSearch = decodeURIComponent(searchString)
          const searchParams = new URLSearchParams(decodedSearch)

          console.log('AuthVerify event received:', Object.fromEntries(searchParams.entries()))
          router.push({
            name: 'AuthVerify',
            query: Object.fromEntries(searchParams.entries())
          })
          return
        }

        // Manejar property landing
        const propertyId = url.searchParams.get('id')
        if (propertyId) {
          localStorage.setItem('current_property_id', propertyId)
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
