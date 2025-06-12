import { ref, onMounted } from 'vue'
import type { AuthState } from '@/types/auth.types'
import { AuthService } from '@/services/auth.service'
import { TokenService } from '@/services/token.service'

export function useAuth() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const authState = ref<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    authType: null
  })

  const updateAuthState = () => {
    authState.value = AuthService.getAuthState()
  }

  const login = async (email: string) => {
    isLoading.value = true
    error.value = null
    try {
      await AuthService.sendPasswordlessEmail(email)
    } catch (err) {
      error.value = 'Failed to send login email. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loginWithProvider = async (provider: 'google' | 'apple') => {
    isLoading.value = true
    error.value = null
    try {
      await AuthService.initiateProviderLogin(provider)
    } catch (err) {
      error.value = 'Failed to initiate provider login. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const verifyEmailToken = async (token: string, email: string) => {
    isLoading.value = true
    error.value = null
    try {
      const success = await AuthService.verifyEmailWithToken(token, email)
      if (success) {
        updateAuthState()
      }
      return success
    } catch (err) {
      error.value = 'Failed to verify email token.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const verifyProviderCallback = async (token: string, email: string) => {
    isLoading.value = true
    error.value = null
    try {
      const success = await AuthService.validateProviderCallback(token, email)
      if (success) {
        updateAuthState()
      }
      return success
    } catch (err) {
      error.value = 'Failed to verify provider callback.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    isLoading.value = true
    error.value = null
    try {
      AuthService.logout()
      updateAuthState()
    } catch (err) {
      error.value = 'Failed to logout. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const verifySession = () => {
    const tokens = TokenService.getStoredTokens()
    if (!tokens) return false

    const isAuthenticated = !TokenService.isTokenExpired(tokens.accessToken)
    if (!isAuthenticated) {
      AuthService.logout()
      updateAuthState()
    }
    return isAuthenticated
  }

  onMounted(() => {
    updateAuthState()
  })

  return {
    isLoading,
    error,
    authState,
    login,
    loginWithProvider,
    verifyEmailToken,
    verifyProviderCallback,
    logout,
    verifySession,
    updateAuthState
  }
}
