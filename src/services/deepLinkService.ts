import { App } from '@capacitor/app';

class DeepLinkService {
  private static instance: DeepLinkService;
  private currentUrl: string | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService();
    }
    return DeepLinkService.instance;
  }

  private async initialize() {
    console.log('Initializing DeepLinkService');
    
    App.addListener('appUrlOpen', (data: { url: string }) => {
      console.log('Deep link received:', data.url);
      this.handleDeepLink(data.url);
    });

    const appUrl = await App.getLaunchUrl();
    if (appUrl && appUrl.url) {
      console.log('Launch URL:', appUrl.url);
      this.handleDeepLink(appUrl.url);
    }
  }

  private handleDeepLink(url: string) {
    console.log('Handling deep link:', url);
    this.currentUrl = url;

    try {
      // Remove the scheme from the URL for parsing
      const urlWithoutScheme = url.replace('tenantev://', '');
      const [path, queryString] = urlWithoutScheme.split('?');
      const params = new URLSearchParams(queryString || '');

      console.log('Path:', path);
      console.log('Params:', Object.fromEntries(params.entries()));

      switch (path) {
        case 'login':
          this.handleLoginDeepLink(params);
          break;
        case 'property':
          this.handlePropertyDeepLink(params);
          break;
        default:
          console.log('Unknown deep link path:', path);
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  }

  private handleLoginDeepLink(params: URLSearchParams) {
    const email = params.get('email');
    const token = params.get('token');
    if (email && token) {
      console.log('Login deep link:', { email, token });
      // Aquí puedes implementar la lógica de navegación o autenticación
    }
  }

  private handlePropertyDeepLink(params: URLSearchParams) {
    const propertyId = params.get('id');
    if (propertyId) {
      console.log('Property deep link:', { propertyId });
      // Aquí puedes implementar la lógica de navegación
    }
  }

  public getCurrentUrl(): string | null {
    return this.currentUrl;
  }
}

export const deepLinkService = DeepLinkService.getInstance(); 