import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tenantev.app',
  appName: 'TenantEv',
  webDir: 'dist',
  ios: {
    scheme: 'TenantEv'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#FFFFFF"
    }
  }
}

export default config
