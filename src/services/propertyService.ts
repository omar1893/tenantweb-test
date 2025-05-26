import axios from 'axios'
import config from '@/config/env'

interface PropertyInfo {
  id: string
  name: string
  address: string
  description?: string
  amenities?: string[]
  images?: string[]
}

interface PropertyLandingPage {
  id: string
  code: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zip_code: string
  }
  configuration: {
    type: string
    requirements: string[]
  }[]
}

export const propertyService = {
  async getPropertyInfo(propertyId: string): Promise<PropertyInfo> {
    try {
      const response = await axios.get(`${config.propertyUrl}/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching property info:', error)
      throw error
    }
  },

  async getPropertyLandingPage(propertyId: string): Promise<PropertyLandingPage> {
    try {
      const response = await axios.get(`${config.propertyUrl}/${propertyId}/landing-page`)
      return response.data
    } catch (error) {
      console.error('Error fetching property landing page:', error)
      throw error
    }
  }
}
