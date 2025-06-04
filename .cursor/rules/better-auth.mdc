---
description: Auth and Route protection Implementation Guide
globs: 
alwaysApply: false
---


# Better Auth Implementation Guide

## Overview
Better Auth is a modern authentication library that provides a complete authentication solution for web applications. This guide covers the implementation used in this Vue 3 + Pinia project.

## Configuration Setup

### Base Configuration
Create a centralized config file for authentication endpoints:

```typescript
// src/config.ts
const config = {
  api: {
    baseURL: 'http://localhost:8000',
  },
  auth: {
    baseURL: 'http://localhost:3000', // Better Auth server URL
  },
  storage: {
    prefix: 'te-hub',
  },
};
```

## Client Setup

### Auth Client Configuration
```typescript
// src/lib/auth-client.ts
import { magicLinkClient, twoFactorClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { jwtDecode } from 'jwt-decode'
import config from '@/config'

export const authClient = createAuthClient({
  baseURL: config.auth.baseURL,
  plugins: [
    magicLinkClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/2fa"
      }
    })
  ],
});
```

### JWT Token Management
```typescript
// JWT caching and validation
let jwtToken: string | null = null;
let jwtExpiresAt: number | null = null;

const getExpiresAt = (jwtToken: string): number => {
  const decoded = jwtDecode(jwtToken);
  if (!decoded.exp) {
    throw new Error("No expires at found");
  }
  return decoded.exp * 1000;
}

export const getJWT = async (): Promise<string> => {
  // Development mock token
  if (import.meta.env.DEV) {
    return 'MOCK_JWT_TOKEN'
  }

  // Return cached token if still valid
  if (jwtToken && jwtExpiresAt && jwtExpiresAt > Date.now()) {
    return jwtToken;
  }

  // Fetch new token
  await authClient.getSession({
    fetchOptions: {
      onSuccess: async (ctx) => {
        jwtToken = ctx.response.headers.get("set-auth-jwt");
        if (!jwtToken) {
          throw new Error("No JWT found");
        }
      }
    }
  });

  if (!jwtToken) {
    throw new Error("No JWT found");
  }

  jwtExpiresAt = getExpiresAt(jwtToken);
  return jwtToken;
}
```

## Pinia Store Integration

### Auth Store Implementation
```typescript
// src/stores/auth-store.ts
import { defineStore } from 'pinia'
import { authClient } from '@/lib/auth-client'
import { computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import Router from '@/router'
import Routes, { type TRoute } from '@/constants/routes'

export const useAuthStore = defineStore('auth', () => {
  // Reactive state from better-auth
  const isLoading = computed(() => {
    const session = authClient.useSession()
    return session.value.isPending || session.value.isRefetching
  })

  const isAuthenticated = computed(() => {
    const session = authClient.useSession()
    return !!session.value.data?.session
  })

  const data = computed(() => {
    const session = authClient.useSession()
    return session.value.data
  })

  // Authentication methods
  const signInGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.href
    })
  }

  const signInApple = async () => {
    await authClient.signIn.social({
      provider: "apple",
    })
  }

  const signInMagicLink = async (email: string): Promise<boolean> => {
    const response = await authClient.signIn.magicLink({
      email: email,
      callbackURL: window.location.href
    })
    return !!response.data?.status
  }

  const signOut = async () => {
    await authClient.signOut()
  }

  // Password management
  const forgetPassword = async (email: string) => {
    const response = await authClient.forgetPassword({
      email: email,
      redirectTo: getRedirectTo(Routes.ResetPassword),
    })
    return response
  }

  const resetPassword = async (password: string, token: string) => {
    const response = await authClient.resetPassword({
      newPassword: password,
      token: token,
    })
    return response
  }

  // Two-factor authentication
  const twoFactorEnable = async (password: string) => {
    const response = await authClient.twoFactor.enable({
      password: password,
      issuer: "TenantEv",
    })
    return response
  }

  return {
    isLoading,
    isAuthenticated,
    data,
    signInGoogle,
    signInApple,
    signInMagicLink,
    signOut,
    jwt,
    twoFactorEnable,
    forgetPassword,
    resetPassword,
  }
})
```

## Component Integration

### Auth Logic Component
```vue
<!-- src/components/auth/AuthLogic.vue -->
<template>
  <div v-if="authStore.isLoading">Loading...</div>
  <template v-else-if="authStore.isAuthenticated">
    <slot name="signed-in" />
  </template>
  <template v-else>
    <slot name="signed-out" />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
</script>
```

### Login Component
```vue
<!-- src/views/auth/LoginView.vue -->
<template>
  <div>
    <Button label="Login with Google" @click="loginWithGoogle" />
    <Button label="Login with Apple" @click="loginWithApple" />
    
    <form @submit.prevent="handleMagicLink">
      <InputText v-model="email" placeholder="Email" />
      <Button type="submit" label="Send Magic Link" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth-store'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const authStore = useAuthStore()
const email = ref('')

const loginWithGoogle = () => {
  authStore.signInGoogle()
}

const loginWithApple = () => {
  authStore.signInApple()
}

const handleMagicLink = async () => {
  if (email.value) {
    await authStore.signInMagicLink(email.value)
  }
}
</script>
```

## API Integration

### Automatic JWT Injection
```typescript
// src/lib/api-call.ts
import { getJWT } from '@/lib/auth-client'

class ApiCall {
  private async setDefaultHeaders(options: IApiCallRequestOptions): Promise<IApiCallHeaders> {
    const headers: IApiCallHeaders = {
      ...options.headers,
    };

    // Automatically inject JWT token for authenticated requests
    if (options.auth !== false) {
      headers.Authorization = `Bearer ${await getJWT()}`;
    }

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }
}
```

## Router Integration

### Route Protection
```typescript
// src/router/auth-routes.ts
import { type RouteRecordRaw } from 'vue-router'
import Routes from '@/constants/routes'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: Routes.Login,
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      public: true, // Mark as public route
    },
  },
  {
    path: '/forgot-password',
    name: Routes.ForgotPassword,
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/reset-password',
    name: Routes.ResetPassword,
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: {
      public: true,
    },
  },
]
```

### App-Level Auth Logic
```vue
<!-- src/App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <AuthLogic v-if="requireAuth">
      <template #signed-in>
        <router-view />
      </template>
      <template #signed-out>
        <LoginView />
      </template>
    </AuthLogic>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLogic from '@/components/auth/AuthLogic.vue'
import LoginView from '@/views/auth/LoginView.vue'

const route = useRoute()
const requireAuth = computed(() => route.meta.requireAuth ?? true)
</script>
```

## Available Plugins

### Magic Link Authentication
```typescript
import { magicLinkClient } from 'better-auth/client/plugins'

// Usage in store
const signInMagicLink = async (email: string): Promise<boolean> => {
  const response = await authClient.signIn.magicLink({
    email: email,
    callbackURL: window.location.href
  })
  return !!response.data?.status
}
```

### Two-Factor Authentication
```typescript
import { twoFactorClient } from 'better-auth/client/plugins'

// Configuration
twoFactorClient({
  onTwoFactorRedirect() {
    window.location.href = "/2fa"
  }
})

// Usage in store
const twoFactorEnable = async (password: string) => {
  const response = await authClient.twoFactor.enable({
    password: password,
    issuer: "TenantEv",
  })
  return response
}
```

### Social Authentication
```typescript
// Google OAuth
const signInGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.href
  })
}

// Apple OAuth
const signInApple = async () => {
  await authClient.signIn.social({
    provider: "apple",
  })
}
```

## Best Practices

### State Management
- Use Pinia store for centralized auth state
- Leverage better-auth's reactive `useSession()` composable
- Cache JWT tokens with expiration validation
- Handle loading states properly

### Security
- Always validate JWT expiration
- Use secure callback URLs
- Implement proper error handling
- Store sensitive data securely

### Performance
- Cache JWT tokens to avoid unnecessary API calls
- Use computed properties for reactive auth state
- Implement proper loading states
- Lazy load auth-related components

### Error Handling
```typescript
try {
  await authStore.signInGoogle()
} catch (error) {
  console.error('Authentication failed:', error)
  // Handle error appropriately
}
```

### Development vs Production
```typescript
// Use mock tokens in development
if (import.meta.env.DEV) {
  return 'MOCK_JWT_TOKEN'
}
```

## Common Patterns

### Conditional Rendering Based on Auth State
```vue
<template>
  <div v-if="authStore.isAuthenticated">
    <Button @click="authStore.signOut">Sign Out</Button>
  </div>
  <div v-else>
    <Button @click="authStore.signInGoogle">Sign In</Button>
  </div>
</template>
```

### Protected API Calls
```typescript
// API calls automatically include JWT when auth !== false
const response = await apiCall.get('/protected-endpoint')

// Explicitly disable auth for public endpoints
const publicResponse = await apiCall.get('/public-endpoint', { auth: false })
```

### Route Guards
```typescript
// Check authentication in route meta
const requireAuth = computed(() => route.meta.requireAuth ?? true)
```

This implementation provides a robust, scalable authentication system using Better Auth with Vue 3 and Pinia, supporting multiple authentication methods and proper state management. 