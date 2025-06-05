interface TokenResponse {
  access_token: string
  challenge: string
  refresh_token: string
}

interface DecodedToken {
  exp: number
  [key: string]: any
}

export const tokenService = {
  setTokens(response: TokenResponse) {
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  },

  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    if (!token) return false

    try {
      const decoded = this.decodeToken(token)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch {
      return false
    }
  },

  decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
