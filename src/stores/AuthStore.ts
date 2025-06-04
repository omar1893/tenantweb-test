import { defineStore } from 'pinia'
import { authClient } from '../utils/auth'
import { computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

import Router from '@/router'
import { ERouter } from '@/enums/router'

const getCallBackURL = () => {
  if (window && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform && (window as any).Capacitor.isNativePlatform()) {
    return 'https://d3gs2.test-app.link/auth-callback?auth_callback=1'
  } else {
    const route = Router.resolve({ name: ERouter.AuthCallback })
    const fullPath = `${window.location.origin}${route.fullPath}`
    return fullPath
  }
}

export const useAuthStore = defineStore('auth', () => {
  let jwtToken: string | null = null
  let jwtExpiresAt: number | null = null

  const isLoading = computed(() => {
    const session = authClient.useSession()
    return session.value.isPending || session.value.isRefetching
  })

  const isAuthenticated = computed(() => {
    const session = authClient.useSession()
    return session.value.data?.session
  })

  const data = computed(() => {
    const session = authClient.useSession()
    return session.value.data
  })

  const signInGoogle = async () => {
    const response = await authClient.signIn.social({
      provider: 'google',
      callbackURL: getCallBackURL()
    })
    console.log('Google response', response)
  }

  const sendEmailOTP = async (email: string): Promise<boolean> => {
    const response = await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: 'sign-in'
    })
    console.log('Send OTP response', response)
    return !!response.data
  }

  const verifyEmailOTP = async (email: string, otp: string): Promise<boolean> => {
    const response = await authClient.signIn.emailOtp({
      email: email,
      otp: otp
    }, {
      onSuccess: (ctx) => {
        console.log('Verify OTP response')
        ctx.response.headers.forEach((value, key) => {
          console.log(key, value)
        })
        const authToken = ctx.response.headers.get('set-auth-token')
        const jwtToken = ctx.response.headers.get('set-auth-jwt')

        console.log('Auth Token:', authToken)
        console.log('JWT Token:', jwtToken)

        if (authToken) {
          localStorage.setItem('bearer_token', authToken)
        }

        if (jwtToken) {
          localStorage.setItem('jwt_token', jwtToken)
        }
      }
    })
    console.log('Verify OTP response', response)
    return !!response.data
  }

  const signOut = async () => {
    await authClient.signOut()
    localStorage.removeItem('bearer_token')
    localStorage.removeItem('jwt_token')
    jwtToken = null
    jwtExpiresAt = null
  }

  const getExpiresAt = (jwtToken: string): number => {
    const decoded = jwtDecode(jwtToken)

    if (!decoded.exp) {
      throw new Error('No expires at found')
    }

    return decoded.exp * 1000
  }

  const getJWTFromSession = async (): Promise<string> => {
    try {
      // Make a specific request to get JWT
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://auth.tenantev.dev'}/api/auth/session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bearer_token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const jwtFromHeader = response.headers.get('set-auth-jwt') || response.headers.get('x-auth-jwt')
        if (jwtFromHeader) {
          localStorage.setItem('jwt_token', jwtFromHeader)
          jwtToken = jwtFromHeader
          jwtExpiresAt = getExpiresAt(jwtFromHeader)
          return jwtFromHeader
        }

        // If no JWT in headers, check response body
        const data = await response.json()
        if (data.jwt) {
          localStorage.setItem('jwt_token', data.jwt)
          jwtToken = data.jwt
          jwtExpiresAt = getExpiresAt(data.jwt)
          return data.jwt
        }
      }

      throw new Error('No JWT available')
    } catch (error) {
      console.error('Error getting JWT from session:', error)
      throw error
    }
  }

  const jwt = async (): Promise<string> => {
    if (jwtToken && jwtExpiresAt && jwtExpiresAt > Date.now()) {
      return jwtToken
    }

    // Try to get JWT from localStorage first
    const storedJWT = localStorage.getItem('jwt_token')
    if (storedJWT) {
      try {
        const expiresAt = getExpiresAt(storedJWT)
        if (expiresAt > Date.now()) {
          jwtToken = storedJWT
          jwtExpiresAt = expiresAt
          return jwtToken
        }
      } catch (error) {
        console.log('Stored JWT is invalid, removing it')
        localStorage.removeItem('jwt_token')
      }
    }

    // Try the standard getSession approach first
    try {
      await authClient.getSession({
        fetchOptions: {
          onSuccess: async (ctx) => {
            const receivedJWT = ctx.response.headers.get('set-auth-jwt') || ctx.response.headers.get('x-auth-jwt')
            if (receivedJWT) {
              jwtToken = receivedJWT
              localStorage.setItem('jwt_token', receivedJWT)
            }
          }
        }
      })

      if (jwtToken) {
        jwtExpiresAt = getExpiresAt(jwtToken)
        return jwtToken
      }
    } catch (error) {
      console.log('Standard getSession failed, trying direct approach')
    }

    // Fallback: try direct session request
    return await getJWTFromSession()
  }

  const getJWTDirect = (): string | null => {
    // First try from memory
    if (jwtToken && jwtExpiresAt && jwtExpiresAt > Date.now()) {
      return jwtToken
    }

    // Then try from localStorage
    const storedJWT = localStorage.getItem('jwt_token')
    if (storedJWT) {
      try {
        const expiresAt = getExpiresAt(storedJWT)
        if (expiresAt > Date.now()) {
          jwtToken = storedJWT
          jwtExpiresAt = expiresAt
          return jwtToken
        }
      } catch (error) {
        console.log('Stored JWT is invalid')
        localStorage.removeItem('jwt_token')
      }
    }

    return null
  }

  const generateJWTFromSession = (): string | null => {
    const sessionData = data.value
    if (!sessionData?.user) return null

    // Create a JWT-like payload
    const payload = {
      sub: sessionData.user.id,
      email: sessionData.user.email,
      name: sessionData.user.name,
      emailVerified: sessionData.user.emailVerified,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      iss: 'tenantev-app',
      aud: 'tenantev-client'
    }

    // Create a simple base64 encoded "JWT" (not cryptographically signed, but contains the data)
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
    const payloadEncoded = btoa(JSON.stringify(payload))
    const fakeJWT = `${header}.${payloadEncoded}.fake-signature`

    localStorage.setItem('jwt_token', fakeJWT)
    jwtToken = fakeJWT
    jwtExpiresAt = payload.exp * 1000

    return fakeJWT
  }

  return {
    isLoading,
    isAuthenticated,
    data,
    signInGoogle,
    sendEmailOTP,
    verifyEmailOTP,
    signOut,
    jwt,
    getJWTDirect,
    generateJWTFromSession,
  }
})
