import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tenantev.app',
  appName: 'TenantEv',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'app',
    cleartext: true
  },
  plugins: {
    App: {
      deepLinks: {
        ios: {
          scheme: 'app'
        },
        android: {
          scheme: 'app'
        }
      }
    }
  }
};

export default config; 