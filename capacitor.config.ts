import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tenantev.app',
  appName: 'TenantEV',
  webDir: 'dist',
  ios: {
    scheme: 'TenantEv',
    webContentsDebuggingEnabled: true,
    limitsNavigationsToAppBoundDomains: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#FFFFFF'
    },
    BranchDeepLinks: {
      enableTestMode: true,
      androidAppScheme: 'tenantev',
      androidDeepLinkDomain: 'd3gs2.test-app.link',
      androidPrefix: '/app',
      androidTestMode: true,
      androidDebugMode: true,
      iosAppScheme: 'tenantev',
      iosDeepLinkDomain: 'd3gs2.test-app.link',
      iosPrefix: '/app',
      iosTestMode: true,
      iosDebugMode: true
    },
    CapacitorCookies: {
      enabled: true,
    },
  },
  android: {
    appendUserAgent: 'TenantEV Android App',
    allowMixedContent: true
  }
}

export default config
