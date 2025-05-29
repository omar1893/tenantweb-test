declare module 'capacitor-branch-deep-links' {
  export interface BranchEvent {
    data_parsed?: {
      propertyId?: string
      [key: string]: any
    }
    [key: string]: any
  }

  export interface BranchDeepLinksPlugin {
    addListener(eventName: 'init' | 'deeplink', callback: (event: BranchEvent) => void): Promise<void>
    generateShortUrl(options: {
      properties: {
        $ios_url?: string
        $android_url?: string
        $desktop_url?: string
        [key: string]: any
      }
    }): Promise<{ url: string }>
  }

  export const BranchDeepLinks: BranchDeepLinksPlugin
}
