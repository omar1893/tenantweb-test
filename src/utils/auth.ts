import { emailOTPClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { jwtDecode } from 'jwt-decode'
import env from '@/config/env'

let jwtToken: string | null = null
let jwtExpiresAt: number | null = null

export const authClient = createAuthClient({
  baseURL: env.apiUrl,
  plugins: [
    emailOTPClient()
  ],
  fetchOptions: {
    auth: {
      type:"Bearer",
      token: () => localStorage.getItem("bearer_token") || ""
   },
    onSuccess: (ctx) => {
        const authToken = ctx.response.headers.get("set-auth-token")
        const jwtToken = ctx.response.headers.get("set-auth-jwt")

        console.log('Auth Token:', authToken);
        console.log('JWT Token:', jwtToken);

        if(authToken){
          localStorage.setItem("bearer_token", authToken);
        }

        if(jwtToken){
          localStorage.setItem("jwt_token", jwtToken);
        }
    },
    onError: (ctx) => {
      console.log('Error', ctx);
    },
    onResponse: (ctx) => {
      console.log('Response', ctx);
    }
}
})

const getExpiresAt = (jwtToken: string): number => {
  const decoded = jwtDecode(jwtToken)
  if (!decoded.exp) throw new Error('No expires at found')
  return decoded.exp * 1000
}

export const getJWT = async (): Promise<string> => {
  if (jwtToken && jwtExpiresAt && jwtExpiresAt > Date.now()) {
    return jwtToken
  }
  await authClient.getSession({
    fetchOptions: {
      onSuccess: async (ctx) => {
        jwtToken = ctx.response.headers.get('set-auth-jwt')
        if (!jwtToken) throw new Error('No JWT found')
      }
    }
  })
  if (!jwtToken) throw new Error('No JWT found')
  jwtExpiresAt = getExpiresAt(jwtToken)
  return jwtToken
}
