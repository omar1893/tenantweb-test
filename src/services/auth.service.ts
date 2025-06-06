import axios from 'axios'
import env from '@/config/env'
import { tokenService } from './token.service'

const API_URL = env.apiUrl

export const authService = {
  async sendPasswordlessEmail(email: string): Promise<boolean> {
    try {
      await axios.post(`${API_URL}/auth/password-less`, { email })
      return true
    } catch (error) {
      console.error('Error sending passwordless email:', error)
      throw error
    }
  },

  async verifyEmailWithToken(token: string, email: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/password-less/${token}`, {
        params: { email }
      })

      if (response.data?.access_token) {
        tokenService.setTokens(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Error verifying email:', error)
      throw error
    }
  },

  async initiateProviderLogin(provider: 'google' | 'apple') {
    window.location.href = `https://auth-qa.tenantev.dev/oauth2/authorization/${provider}`
  },

  async validateProviderCallback(token: string, email: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/provider/${token}`, {
        params: { email }
      })

      if (response.data?.access_token) {
        tokenService.setTokens(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Error validating provider callback:', error)
      throw error
    }
  },

  async handleProviderCallback(url: string): Promise<boolean> {
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
  },

  isAuthenticated(): boolean {
    return tokenService.isAuthenticated()
  },

  getAccessToken(): string | null {
    return tokenService.getAccessToken()
  },

  logout() {
    tokenService.clearTokens()
  }
}
