import axios from 'axios'
import env from '@/config/env'
import { TokenService } from './token.service'
import type { TokenPair } from '@/types/auth.types'

const API_URL = env.apiUrl

export class AuthService {
  public static getAuthState() {
    const tokens = TokenService.getStoredTokens()
    const userInfo = TokenService.getUserInfo()

    return {
      isAuthenticated: tokens !== null,
      user: userInfo,
      accessToken: tokens?.accessToken || null,
      authType: tokens?.authType || null
    }
  }

  public static async refreshTokens(): Promise<TokenPair | null> {
    try {
      const tokens = TokenService.getStoredTokens()
      if (!tokens) {
        console.log('[AuthService] No tokens available for refresh')
        return null
      }

      console.log('[AuthService] Attempting to refresh tokens')
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refresh_token: tokens.refreshToken,
        access_token: tokens.accessToken
      })

      if (response.data?.access_token) {
        TokenService.setTokens(response.data, tokens.authType)
        return response.data
      }

      return null
    } catch (error) {
      console.error('[AuthService] Error refreshing tokens:', error)
      TokenService.clearTokens()
      return null
    }
  }

  public static async sendPasswordlessEmail(email: string): Promise<boolean> {
    try {
      await axios.post(`${API_URL}/auth/password-less`, { email })
      return true
    } catch (error) {
      console.error('Error sending passwordless email:', error)
      throw error
    }
  }

  public static async verifyEmailWithToken(token: string, email: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/password-less/${token}`, {
        params: { email }
      })

      if (response.data?.access_token) {
        TokenService.setTokens(response.data, 'password-less')
        return true
      }
      return false
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  }

  public static async initiateProviderLogin(provider: 'google' | 'apple') {
    window.location.href = `https://auth-qa.tenantev.dev/oauth2/authorization/${provider}`
  }

  public static async validateProviderCallback(token: string, email: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/provider/${token}`, {
        params: { email }
      })

      if (response.data?.access_token) {
        TokenService.setTokens(response.data, 'provider')
        return true
      }
      return false
    } catch (error) {
      console.error('Error validating provider callback:', error)
      throw error
    }
  }

  public static async handleProviderCallback(url: string): Promise<boolean> {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1])
      const token = urlParams.get('token')
      const email = urlParams.get('email')
      const type = urlParams.get('type')

      if (!token || !email || type !== 'provider') {
        throw new Error('Invalid callback parameters')
      }

      return this.validateProviderCallback(token, email)
    } catch (error) {
      console.error('Error handling provider callback:', error)
      throw error
    }
  }

  public static isAuthenticated(): boolean {
    const tokens = TokenService.getStoredTokens()
    return tokens !== null
  }

  public static getAccessToken(): string | null {
    const tokens = TokenService.getStoredTokens()
    return tokens?.accessToken || null
  }

  public static logout() {
    TokenService.clearTokens()
  }
}
