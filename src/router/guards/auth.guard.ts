import type { NavigationGuard } from 'vue-router'
import { AuthService } from '@/services/auth.service'

export const authGuard: NavigationGuard = async (to) => {
  const requiresAuth = to.meta.requiresAuth === true
  const requiresGuest = to.meta.requiresGuest === true
  const requiredRoles = to.meta.roles as string[] | undefined

  const isAuthenticated = AuthService.isAuthenticated()
  const userInfo = AuthService.getAuthState()

  console.log('[AuthGuard] Route check:', {
    path: to.path,
    requiresAuth,
    requiresGuest,
    requiredRoles,
    isAuthenticated,
    userRoles: userInfo.userRoles
  })

  if (requiresAuth && !isAuthenticated) {
    console.log('[AuthGuard] Authentication required, redirecting to login')
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }

  if (requiresGuest && isAuthenticated) {
    console.log('[AuthGuard] Guest only route, redirecting to home')
    return { path: '/' }
  }

  if (requiredRoles && isAuthenticated) {
    const hasRequiredRole = requiredRoles.some(role => userInfo.userRoles.includes(role))
    if (!hasRequiredRole) {
      console.log('[AuthGuard] Missing required roles, redirecting to home')
      return { path: '/' }
    }
  }

  return true
}
