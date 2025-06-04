// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any

export default {
  production: win.TE_ENV === 'production',
  apiUrl: win.TE_API_URL || 'http://localhost:3000',
  propertyUrl: win.TE_AI_PROPERTY_URL || 'http://localhost:3000/properties',
  audioApiUrl: win.TE_AUDIO_API_URL || 'https://testaudio.tenantev.dev',
  audioApiKey: win.TE_AUDIO_API_KEY || '6iiX22sypsg695OriH7RoSD4d9DhpR'
}
