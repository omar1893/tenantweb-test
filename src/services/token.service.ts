import type { DecodedToken, TokenPair, AuthType } from '@/types/auth.types'
import { AuthService } from './auth.service'

export class TokenService {
  private static readonly TOKEN_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    AUTH_TYPE: 'auth_type'
  }

  private static readonly REFRESH_THRESHOLD = 5 * 60 // 5 minutos antes de expirar

  public static decodeToken(token: string): DecodedToken {
    try {
      console.log('[TokenService] Decoding token:', `${token.substring(0, 20)}...`)
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const decoded = JSON.parse(window.atob(base64))
      // Force token expiration for testing
      //decoded.exp = 1749566077
      console.log('[TokenService] Decoded token:', decoded)
      return decoded
    } catch (error) {
      console.error('[TokenService] Error decoding token:', error)
      throw new Error('Invalid token format')
    }
  }

  public static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token)
      const currentTime = Date.now() / 1000
      const expirationTime = decoded.exp - this.REFRESH_THRESHOLD
      const isExpired = expirationTime < currentTime
      console.log('[TokenService] Token expiration check:', {
        currentTime,
        expirationTime,
        isExpired
      })
      return isExpired
    } catch {
      console.log('[TokenService] Token expiration check failed, considering token expired')
      return true
    }
  }

  public static hasStoredTokens(): boolean {
    const accessToken = localStorage.getItem(this.TOKEN_KEYS.ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(this.TOKEN_KEYS.REFRESH_TOKEN)
    const authType = localStorage.getItem(this.TOKEN_KEYS.AUTH_TYPE)
    const hasTokens = !!(accessToken && refreshToken && authType)
    console.log('[TokenService] Checking stored tokens:', { hasTokens })
    return hasTokens
  }

  public static getStoredTokens(): { accessToken: string; refreshToken: string; authType: AuthType } | null {
    const accessToken = localStorage.getItem(this.TOKEN_KEYS.ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(this.TOKEN_KEYS.REFRESH_TOKEN)
    const authType = localStorage.getItem(this.TOKEN_KEYS.AUTH_TYPE) as AuthType

    console.log('[TokenService] Getting stored tokens:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      authType
    })

    if (!accessToken || !refreshToken || !authType) {
      console.log('[TokenService] Missing required tokens')
      return null
    }

    return { accessToken, refreshToken, authType }
  }

  public static setTokens(tokens: TokenPair, authType: AuthType): void {
    console.log('[TokenService] Setting new tokens:', {
      accessToken: `${tokens.access_token.substring(0, 20)}...`,
      hasRefreshToken: !!tokens.refresh_token,
      authType
    })
    localStorage.setItem(this.TOKEN_KEYS.ACCESS_TOKEN, tokens.access_token)
    localStorage.setItem(this.TOKEN_KEYS.REFRESH_TOKEN, tokens.refresh_token)
    localStorage.setItem(this.TOKEN_KEYS.AUTH_TYPE, authType)
  }

  public static clearTokens(): void {
    console.log('[TokenService] Clearing all tokens')
    localStorage.removeItem(this.TOKEN_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(this.TOKEN_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(this.TOKEN_KEYS.AUTH_TYPE)
  }

  public static async refreshTokens(): Promise<TokenPair | null> {
    return AuthService.refreshTokens()
  }

  public static getUserInfo(): { email: string; roles: string[] } | null {
    const tokens = this.getStoredTokens()
    if (!tokens) {
      console.log('[TokenService] No tokens available for getting user info')
      return null
    }

    try {
      const decoded = this.decodeToken(tokens.accessToken)
      const userInfo = {
        email: decoded.em,
        roles: decoded.roles
      }
      console.log('[TokenService] Retrieved user info:', userInfo)
      return userInfo
    } catch {
      console.log('[TokenService] Failed to get user info')
      return null
    }
  }
}
