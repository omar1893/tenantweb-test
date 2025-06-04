import axios from 'axios'
import env from '@/config/env'

const API_URL = env.audioApiUrl
const API_KEY = env.audioApiKey

interface PropertyFiles {
  audio_url: string
  captions_url: string
}

export const propertyAudioService = {
  async getPropertyFiles(propertyCode: string): Promise<PropertyFiles | null> {
    try {
      console.log('Fetching audio files for property:', propertyCode)
      console.log('API URL:', `${API_URL}/properties/${propertyCode}/files`)

      const response = await axios.get(`${API_URL}/properties/${propertyCode}/files`, {
        headers: {
          'x-api-key': API_KEY
        }
      })

      console.log('Audio service response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching property files:', error)
      return null
    }
  }
}
