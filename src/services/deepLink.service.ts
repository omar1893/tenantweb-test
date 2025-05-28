import { BranchDeepLinks } from 'capacitor-branch-deep-links'
import { EPropertyRouter } from '@/enums/router'
import { BRANCH_CONFIG } from '@/config/branch'
import router from '@/router'

export class DeepLinkService {
  private static instance: DeepLinkService

  private constructor() {}

  static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService()
    }
    return DeepLinkService.instance
  }

  async initialize(): Promise<void> {
    try {
      const { data_parsed } = await BranchDeepLinks.initSession()
      if (data_parsed?.propertyId) {
        router.push({
          name: EPropertyRouter.PropertyLanding,
          params: { id: data_parsed.propertyId }
        })
      }
    } catch (error) {
      console.error('Error initializing Branch session:', error)
    }
  }

  async createLink(params: Record<string, any>): Promise<string> {
    try {
      const { url } = await BranchDeepLinks.generateShortUrl({
        properties: {
          $android_url: BRANCH_CONFIG.ANDROID_URL,
          $desktop_url: BRANCH_CONFIG.DESKTOP_URL,
          ...params
        }
      })
      return url
    } catch (error) {
      console.error('Error creating Branch link:', error)
      throw error
    }
  }
}
