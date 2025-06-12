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
import { AppStateService } from './services/appState.service'
import { createPinia } from 'pinia'
import primeVueTheme from './prime-vue-theme'
import { App as CapacitorApp } from '@capacitor/app'
import { useUIStore } from './stores/UIStore'

/* Theme variables */
import './theme/variables.css'

console.log('Initializing app services')
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

// Inicializar la app después de que el router esté listo
router.isReady().then(() => {
  console.log('[main] Router is ready, initializing AppStateService')
  try {
    AppStateService.initialize()
    console.log('[main] AppStateService initialized successfully')
  } catch (error) {
    console.error('[main] Error initializing AppStateService:', error)
  }
  app.mount('#app')
})

interface AppUrlOpenData {
  url: string
}
/* const uiStore = useUIStore() */
const handlePropertyDeepLink = async (url: URL) => {
  const searchParams = new URLSearchParams(url.search)
  const propertyId = searchParams.get('id')
  const propertyUid = searchParams.get('property_uid')
  console.log('propertyId', propertyId)
  console.log('propertyUid', propertyUid)

  if (propertyId && propertyUid) {
    await new Promise(resolve => {
      localStorage.setItem('current_property_id', propertyId)
      localStorage.setItem('current_property_uid', propertyUid)
      resolve(true)
    })
  }
}

const handleAuthDeepLink = (url: URL) => {
  const searchParams = new URLSearchParams(url.search)
  const params = Object.fromEntries(searchParams.entries())
  console.log('Auth params received:', params)

  // Marcar que estamos en un proceso de autenticación por deep link
  AppStateService.setIsAuthDeepLink(true)

  // Si es un deep link de proveedor, procesarlo directamente
  if (params.type === 'provider' && params.token && params.email) {
    /* uiStore.hideLoginModal() */
    console.log('Processing provider auth deep link')
    router.push({
      name: 'AuthVerify',
      query: {
        ...params,
        isDeepLink: 'true',
        skipTokenCheck: 'true'
      }
    })
    return
  }

  // Para otros tipos de auth deep links
  router.push({
    name: 'AuthVerify',
    query: {
      ...params,
      isDeepLink: 'true'
    }
  })
}

const handleHttpDeepLink = (url: URL) => {
  // Marcar que estamos en un proceso de autenticación si es necesario
  const isAuthPath = url.pathname === '/auth-callback' ||
                    url.pathname === '/auth-verify' ||
                    url.searchParams.get('auth_callback') === '1'

  if (isAuthPath) {
    AppStateService.setIsAuthDeepLink(true)
  }

  // Manejar auth-callback
  if (url.pathname === '/auth-callback' || url.searchParams.get('auth_callback') === '1') {
    const params = Object.fromEntries(url.searchParams.entries())
    router.push({
      name: 'AuthCallback',
      query: {
        ...params,
        isDeepLink: 'true',
        skipTokenCheck: 'true'
      }
    })
    return
  }

  // Manejar auth-verify
  if (url.pathname === '/auth-verify') {
    const searchString = url.search.substring(1)
    const decodedSearch = decodeURIComponent(searchString)
    const searchParams = new URLSearchParams(decodedSearch)
    const params = Object.fromEntries(searchParams.entries())

    console.log('AuthVerify event received:', params)
    router.push({
      name: 'AuthVerify',
      query: {
        ...params,
        isDeepLink: 'true',
        skipTokenCheck: params.type === 'provider' ? 'true' : 'false'
      }
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

CapacitorApp.addListener('appUrlOpen', async (data: AppUrlOpenData) => {
  console.log('AppUrlOpen event received:', data)
  if (!data?.url) return

  try {
    const url = new URL(data.url)

    console.log('Deep link processing:', {
      url: url.toString(),
      protocol: url.protocol,
      pathname: url.pathname
    })

    if (url.protocol === 'tenantev:') {
      if (url.host.includes('property')) {
        await handlePropertyDeepLink(url)
        return
      }

      if (url.host.includes('open') || url.host === '') {
        console.log('Auth deep link received:', url)
        handleAuthDeepLink(url)
        return
      }
    }

    if (url.protocol.startsWith('http')) {
      handleHttpDeepLink(url)
    }
  } catch (e) {
    console.error('Error processing deep link:', e)
  }
})
