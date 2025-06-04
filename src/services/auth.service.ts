import axios from 'axios'
import env from '@/config/env'

const API_URL = env.apiUrl

export const authService = {
  async sendPasswordlessEmail(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_URL}/auth/password-less`, { email })
      return response.status === 200
    } catch (error) {
      console.error('Error sending passwordless email:', error)
      return false
    }
  },

  async verifyEmailWithToken(token: string, email: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/password-less/${token}`, {
        params: { email }
      })
      return response.status === 200
    } catch (error) {
      console.error('Error verifying email with token:', error)
      return false
    }
  },

  async initiateGoogleLogin() {
    window.location.href = 'https://auth.tenantev.dev/oauth2/authorization/google'
  },

  async initiateAppleLogin() {
    window.location.href = 'https://auth.tenantev.dev/oauth2/authorization/apple'
  },

  async validateGoogleCallback(token: string, email: string): Promise<string> {
    try {
      const response = await axios.get(`${API_URL}/auth/google/${token}`, {
        params: { email }
      })

      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token)
        return response.data.access_token
      }
      throw new Error('No token received')
    } catch (error) {
      console.error('Error validating Google callback:', error)
      throw error
    }
  },

  async validateAppleCallback(token: string, email: string): Promise<string> {
    try {
      const response = await axios.get(`${API_URL}/auth/apple/${token}`, {
        params: { email }
      })

      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token)
        return response.data.access_token
      }
      throw new Error('No token received')
    } catch (error) {
      console.error('Error validating Apple callback:', error)
      throw error
    }
  },

  async handleGoogleCallback(url: string): Promise<string> {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1])
      const token = urlParams.get('token')
      const email = urlParams.get('email')

      if (!token || !email) {
        throw new Error('Missing token or email in callback URL')
      }

      return await this.validateGoogleCallback(token, email)
    } catch (error) {
      console.error('Error handling Google callback:', error)
      throw error
    }
  },

  async handleAppleCallback(url: string): Promise<string> {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1])
      const token = urlParams.get('token')
      const email = urlParams.get('email')

      if (!token || !email) {
        throw new Error('Missing token or email in callback URL')
      }

      return await this.validateAppleCallback(token, email)
    } catch (error) {
      console.error('Error handling Apple callback:', error)
      throw error
    }
  }
}
