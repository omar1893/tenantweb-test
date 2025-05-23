import { App } from '@capacitor/app'
import router from '@/router'
import { nextTick } from 'vue'

class DeepLinkService {
  private static instance: DeepLinkService
  private currentUrl: string | null = null

  private constructor() {
    this.initialize()
  }

  public static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService()
    }
    return DeepLinkService.instance
  }

  private async initialize() {
    console.log('Initializing DeepLinkService')

    App.addListener('appUrlOpen', (data: { url: string }) => {
      console.log('Deep link received:', data.url)
      this.handleDeepLink(data.url)
    })

    const appUrl = await App.getLaunchUrl()
    if (appUrl && appUrl.url) {
      console.log('Launch URL:', appUrl.url)
      this.handleDeepLink(appUrl.url)
    }
  }

  private async handleDeepLink(url: string) {
    console.log('Handling deep link:', url)
    this.currentUrl = url

    try {
      const urlWithoutScheme = url.replace('app://', '').replace('tenantev://', '')
      const [path, queryString] = urlWithoutScheme.split('?')
      const params = new URLSearchParams(queryString || '')
      const paramsObj = Object.fromEntries(params.entries())

      console.log('Path:', path)
      console.log('Params:', paramsObj)

      await router.isReady()
      await nextTick()
      router.replace({ name: 'DeepLinkLanding', query: paramsObj })
    } catch (error) {
      console.error('Error handling deep link:', error)
    }
  }

  public getCurrentUrl(): string | null {
    return this.currentUrl
  }
}

export const deepLinkService = DeepLinkService.getInstance()
