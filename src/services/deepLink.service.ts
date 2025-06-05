import { BranchDeepLinks } from 'capacitor-branch-deep-links'
import { BRANCH_CONFIG } from '@/config/branch'
import { Capacitor } from '@capacitor/core'
import router from '@/router'

interface BranchError extends Error {
  message: string
  name: string
  stack?: string
  code?: string
  cause?: unknown
}

export class DeepLinkService {
  private static instance: DeepLinkService
  private isInitialized: boolean = false

  private constructor() {}

  public static getInstance(): DeepLinkService {
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

  private handleBranchParams(params: any) {
    console.log('Processing Branch params:', params)

    // Verify if this is a Branch link click
    if (!params['+clicked_branch_link']) {
      console.log('Not a Branch link click')
      return
    }

    try {
      // Handle property view deep links
      if (params['$canonical_url']?.includes('property-view')) {
        const propertyId = params['propertyId'] || params['id']
        if (propertyId) {
          router.push({
            name: 'PropertyLanding',
            params: { propertyId }
          })
          return
        }
      }

      // Handle other deep link types here
      // ...

    } catch (error) {
      console.error('Error processing Branch params:', error)
    }
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

        if (event.referringParams) {
          this.handleBranchParams(event.referringParams)
        }
      })

      // Add listener for errors
      BranchDeepLinks.addListener('initError', (error) => {
        console.error('=== Branch Init Error Event ===')
        console.error('Error initializing Branch:', error)
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
        analytics: {
          feature: 'sharing',
          channel: 'app',
          campaign: 'property_view'
        },
        properties: {
          $android_url: BRANCH_CONFIG.ANDROID_URL,
          $desktop_url: BRANCH_CONFIG.DESKTOP_URL,
          $ios_url: BRANCH_CONFIG.IOS_URL,
          $always_deeplink: true,
          $uri_redirect_mode: 2,
          propertyId: params.propertyId,
          ...params
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
