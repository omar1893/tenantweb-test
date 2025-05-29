import { defineStore } from 'pinia'
import { authClient } from '../utils/auth'
import { computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

import Router from '@/router'
import { ERouter } from '@/enums/router'

const getCallBackURL = () => {
  const route = Router.resolve({ name: ERouter.AuthCallback })
  const fullPath = `${window.location.origin}${route.fullPath}`
  return fullPath
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
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: getCallBackURL()
    })
  }

  const signInMagicLink = async (email: string): Promise<boolean> => {
    const response = await authClient.signIn.magicLink({
      email: email,
      callbackURL: getCallBackURL()
    })
    return !!response.data?.status
  }

  const signOut = async () => {
    await authClient.signOut()
  }

  const getExpiresAt = (jwtToken: string): number => {
    const decoded = jwtDecode(jwtToken)

    if (!decoded.exp) {
      throw new Error('No expires at found')
    }

    return decoded.exp * 1000
  }

  const jwt = async (): Promise<string> => {
    if (jwtToken && jwtExpiresAt && jwtExpiresAt > Date.now()) {
      return jwtToken
    }

    await authClient.getSession({
      fetchOptions: {
        onSuccess: async (ctx) => {
          jwtToken = ctx.response.headers.get('set-auth-jwt')
          if (!jwtToken) {
            throw new Error('No JWT found')
          }
        }
      }
    })

    if (!jwtToken) {
      throw new Error('No JWT found')
    }

    jwtExpiresAt = getExpiresAt(jwtToken)

    return jwtToken
  }

  return {
    isLoading,
    isAuthenticated,
    data,
    signInGoogle,
    signInMagicLink,
    signOut,
    jwt,
  }
})
