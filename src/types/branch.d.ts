declare module 'capacitor-branch-deep-links' {
  export interface BranchDeepLinksPlugin {
    initSession(): Promise<{ data_parsed: any }>
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
