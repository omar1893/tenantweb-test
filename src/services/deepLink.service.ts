import { BranchDeepLinks } from 'capacitor-branch-deep-links'
import { BRANCH_CONFIG } from '@/config/branch'
import { Capacitor } from '@capacitor/core'

interface BranchError extends Error {
  message: string
  name: string
  stack?: string
  code?: string
  cause?: unknown
}

export class DeepLinkService {
  private static instance: DeepLinkService
  private isInitialized = false

  private constructor() {}

  static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService()
    }
    return DeepLinkService.instance
  }

  private logPluginStatus() {
    console.log('=== Branch Plugin Status ===')
    console.log('BranchDeepLinks object:', BranchDeepLinks)
    console.log('Available methods:', Object.getOwnPropertyNames(BranchDeepLinks))
    console.log('Platform:', Capacitor.getPlatform())
    console.log('Is native:', Capacitor.isNativePlatform())
    console.log('========================')
  }

  async initialize(): Promise<void> {
    try {
      this.logPluginStatus()

      if (this.isInitialized) {
        console.log('Branch already initialized')
        return
      }

      const platform = Capacitor.getPlatform()
      console.log('Current platform:', platform)

      if (platform === 'web') {
        console.log('Branch initialization skipped on web platform')
        return
      }

      if (!Capacitor.isNativePlatform()) {
        console.log('Not running on native platform, skipping Branch initialization')
        return
      }

      if (!BranchDeepLinks) {
        throw new Error('BranchDeepLinks plugin is not available')
      }

      console.log('Attempting to initialize Branch session...')

      // Add listener for deep link data
      BranchDeepLinks.addListener('init', (event) => {
        console.log('=== Branch Init Event ===')
        console.log('Raw event data:', event)
        alert(JSON.stringify(event))
      })

      // Add listener for deep link data
      BranchDeepLinks.addListener('deeplink', (event) => {
        console.log('=== Branch Deeplink Event ===')
        console.log('Raw event data:', event)
        alert(JSON.stringify(event))
      })

      // @ts-expect-error: BranchDeepLinks plugin puede emitir 'initError' aunque no esté en los tipos
      BranchDeepLinks.addListener('initError', (event) => {
        console.error('=== Branch Init Error Event ===')
        console.error('Raw event data:', event)
      })

      this.isInitialized = true
      console.log('Branch initialized successfully')
    } catch (error) {
      console.error('=== Branch Initialization Error ===')
      console.error(error)
      this.isInitialized = false
      throw error
    }
  }

  async createLink(params: Record<string, any>): Promise<string> {
    try {
      if (!this.isInitialized) {
        console.warn('Branch not initialized, returning fallback URL')
        return BRANCH_CONFIG.DESKTOP_URL
      }

      const platform = Capacitor.getPlatform()
      if (platform === 'web') {
        return BRANCH_CONFIG.DESKTOP_URL
      }

      console.log('Generating Branch link with params:', params)
      const { url } = await BranchDeepLinks.generateShortUrl({
        properties: {
          $android_url: BRANCH_CONFIG.ANDROID_URL,
          $desktop_url: BRANCH_CONFIG.DESKTOP_URL,
          $ios_url: BRANCH_CONFIG.IOS_URL,
          $always_deeplink: true,
          $uri_redirect_mode: 2,
          custom_data: params,
          propertyId: params.propertyId
        }
      })
      console.log('Generated Branch URL:', url)
      return url
    } catch (error) {
      const branchError = error as BranchError
      console.error('Error creating Branch link:', {
        name: branchError.name,
        message: branchError.message,
        code: branchError.code,
        stack: branchError.stack
      })
      return BRANCH_CONFIG.DESKTOP_URL
    }
  }
}
