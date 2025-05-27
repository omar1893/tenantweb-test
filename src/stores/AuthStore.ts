import { defineStore } from 'pinia'
import { authClient } from '../utils/auth'
import { computed } from 'vue'

import Router from '@/router'
import { ERouter } from '@/enums/router'

const callBackName = ERouter.AudioTesting


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

  const getCallBackURL = () => {
    const route = Router.resolve({ name: callBackName })
    const fullPath = `${window.location.origin}${route.fullPath}`

    return fullPath
  }

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

  return {
    isLoading,
    isAuthenticated,
    data,
    signInGoogle,
    signInMagicLink,
    signOut,
  }
})