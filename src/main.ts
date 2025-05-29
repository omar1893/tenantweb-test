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
import axios from 'axios'

/* Theme variables */
import './theme/variables.css'

// Import custom styles


// Initialize deep link service
console.log('Initializing app with deep link service')
// Initialize deep linking
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
      if (url.protocol.startsWith('http')) {
        const propertyId = url.searchParams.get('id')
        if (propertyId) {
          router.push({
            name: 'PropertyLanding',
            params: { propertyId }
          })
        }
      } else if (url.protocol.startsWith('tenantev')) {
        const linkClickId = url.searchParams.get('link_click_id')
        if (linkClickId) {
          try {
            const resp = await axios.post('https://api2.branch.io/v1/open', {
              link_identifier: linkClickId,
              branch_key: 'key_test_oCzipvLcpzA0cZx0bh7m8lldywiF4TGR',
              branch_secret: 'secret_test_d7REYmTWAOfL17rBbkckjieKQQqITctY',
              os: 'Android',
              server_to_server: true,
              app_version: '1.0.0',
              model: 'Android Emulator',
              os_version: '14',
              user_agent: navigator.userAgent,
              is_hardware_id_real: true,
              ad_tracking_enabled: false
            })
            console.log('Branch link data:', resp.data)
            const propertyId = resp.data.data_parsed?.id
            if (propertyId) {
              router.push({
                name: 'PropertyLanding',
                params: { propertyId }
              })
            } else {
              /* alert('No se encontró el parámetro de la propiedad en el deep link.') */
            }
          } catch (e) {
            console.error('Error fetching Branch link data:', e)
            console.dir(e)
            /* alert('No se pudo obtener la información del deep link.') */
          }
        }
      }
    } catch (e) {
      console.log('Error parsing url:', e)
    }
  }
})
