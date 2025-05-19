// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any

export default {
  production: win.TE_ENV === 'production',
  apiUrl: win.TE_API_URL || 'http://localhost:3000',
  propertyUrl: win.TE_AI_PROPERTY_URL || 'http://localhost:3000/properties'
}
