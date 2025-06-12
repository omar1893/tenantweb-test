import { App } from '@capacitor/app'
import { TokenService } from './token.service'
import { AuthService } from './auth.service'
import router from '@/router'
import { ERouter } from '@/enums/router'
import { Capacitor } from '@capacitor/core'

export class AppStateService {
  private static isAuthDeepLink = false
  private static isInitialized = false
  private static lastActiveTime = Date.now()

  public static initialize() {
    if (this.isInitialized) {
      console.log('[AppStateService] Service already initialized, skipping')
      return
    }

    console.log('[AppStateService] Initializing app state service')
    this.isInitialized = true

    // Validar sesión al inicio
    this.validateSession()

    // Configurar listeners para cambios de estado
    console.log('[AppStateService] Setting up app state change listeners')

    // Listener principal de cambio de estado
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('[AppStateService] App state changed, isActive:', isActive)
      const now = Date.now()
      const timeSinceLastActive = now - this.lastActiveTime

      if (isActive) {
        // En Android, solo validamos si han pasado más de 2 segundos
        if (Capacitor.getPlatform() === 'android' && timeSinceLastActive < 2000) {
          console.log('[AppStateService] Skipping validation, too soon since last active state')
          return
        }
        this.lastActiveTime = now
        this.handleAppActive()
      }
    })

    // Listener adicional para Android
    if (Capacitor.getPlatform() === 'android') {
      document.addEventListener('visibilitychange', () => {
        console.log('[AppStateService] Visibility changed:', document.visibilityState)
        if (document.visibilityState === 'visible') {
          const now = Date.now()
          const timeSinceLastActive = now - this.lastActiveTime

          if (timeSinceLastActive < 2000) {
            console.log('[AppStateService] Skipping validation, too soon since last active state')
            return
          }

          this.lastActiveTime = now
          this.handleAppActive()
        }
      })
    }

    console.log('[AppStateService] App state change listeners setup complete')
  }

  public static setIsAuthDeepLink(value: boolean) {
    console.log('[AppStateService] Setting auth deep link state:', value)
    this.isAuthDeepLink = value
  }

  public static getIsAuthDeepLink(): boolean {
    return this.isAuthDeepLink
  }

  public static async validateSession() {
    // Si estamos en un proceso de autenticación por deep link, no verificamos tokens
    if (this.isAuthDeepLink) {
      console.log('[AppStateService] Skipping session validation due to auth deep link')
      return
    }

    const currentRoute = router.currentRoute.value
    if (currentRoute.meta.isPublic) {
      console.log('[AppStateService] Current route is public, skipping session validation')
      return true
    }

    console.log('[AppStateService] Validating session')
    const tokens = TokenService.getStoredTokens()

    if (!tokens) {
      console.log('[AppStateService] No tokens found, redirecting to intro')
      router.push({ name: ERouter.VideoIntro })
      return false
    }

    const isTokenValid = !TokenService.isTokenExpired(tokens.accessToken)
    if (!isTokenValid) {
      console.log('[AppStateService] Token expired, attempting refresh')
      const refreshed = await TokenService.refreshTokens()
      console.log('[AppStateService] Token refreshed:', refreshed)
      if (!refreshed) {
        console.log('[AppStateService] Token refresh failed, logging out')
        AuthService.logout()
        router.push({ name: ERouter.VideoIntro })
        return false
      }
    }

    // Si llegamos aquí, la sesión es válida
    console.log('[AppStateService] Session is valid, checking current route')

    const isAuthRoute = [
      ERouter.VideoIntro,
      ERouter.AuthVerify,
      ERouter.AuthCallback
    ].includes(currentRoute.name as ERouter)

    // Si estamos en una ruta de autenticación y la sesión es válida, redirigir
    if (isAuthRoute) {
      console.log('[AppStateService] User is authenticated but on auth route, redirecting')
      const propertyId = localStorage.getItem('current_property_id')

      if (propertyId) {
        const videoViewed = localStorage.getItem(`property_video_viewed_${propertyId}`) === 'true'
        if (videoViewed) {
          console.log('[AppStateService] Property video viewed, redirecting to chatbot')
          router.push({ name: ERouter.Chatbot })
        } else {
          console.log('[AppStateService] Property video not viewed, redirecting to video')
          router.push({ name: ERouter.PropertyVideo })
        }
      } else {
        console.log('[AppStateService] No property ID found, redirecting to chatbot')
        router.push({ name: ERouter.Chatbot })
      }
    }

    return true
  }

  private static async handleAppActive() {
    console.log('[AppStateService] App became active, starting session validation')
    try {
      const result = await this.validateSession()
      console.log('[AppStateService] Session validation result:', result)
      return result
    } catch (error) {
      console.error('[AppStateService] Error validating session:', error)
      return false
    }
  }

  public static reset() {
    console.log('[AppStateService] Resetting state')
    this.isAuthDeepLink = false
  }
}

