import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/vue';
import { jwtDecode } from 'jwt-decode';

let jwtToken: string | null = null;
let jwtExpiresAt: number | null = null;

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [
    magicLinkClient()
  ],
});

const getExpiresAt = (jwtToken: string): number => {
  const decoded = jwtDecode(jwtToken);
  if (!decoded.exp) throw new Error('No expires at found');
  return decoded.exp * 1000;
}

export const getJWT = async (): Promise<string> => {
  if (jwtToken && jwtExpiresAt && jwtExpiresAt > Date.now()) {
    return jwtToken;
  }
  await authClient.getSession({
    fetchOptions: {
      onSuccess: async (ctx) => {
        jwtToken = ctx.response.headers.get('set-auth-jwt');
        if (!jwtToken) throw new Error('No JWT found');
      }
    }
  });
  if (!jwtToken) throw new Error('No JWT found');
  jwtExpiresAt = getExpiresAt(jwtToken);
  return jwtToken;
} 