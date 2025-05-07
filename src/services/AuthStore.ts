import { defineStore } from 'pinia'
import { authClient } from './auth-client'
import { computed } from 'vue'

const callBackURL = 'http://localhost:3001/propertyId/1'

export const useAuthStore = defineStore('auth', () => {
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
      callbackURL: callBackURL
    })
  }

  const signInMagicLink = async (email: string): Promise<boolean> => {
    const response = await authClient.signIn.magicLink({
      email: email,
      callbackURL: callBackURL
    })
    return !!response.data?.status
  }

  const signOut = async () => {
    await authClient.signOut()
  }

  return {
    isLoading,
    isAuthenticated,
    data,
    signInGoogle,
    signInMagicLink,
    signOut,
  }
}) 