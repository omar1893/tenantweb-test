import axios from 'axios'

interface Caption {
  type: string
  text: string
  time: number
  endTime: number
}

export const propertyCaptionsService = {
  async getCaptions(url: string): Promise<Caption[]> {
    try {
      console.log('Fetching captions from URL:', url)
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json'
        },
        responseType: 'text'
      })

      // Ensure we have a valid JSON string
      const jsonString = response.data.trim()
      console.log('Raw captions response:', jsonString)

      const parsedCaptions = JSON.parse(jsonString)
      console.log('Parsed captions:', parsedCaptions)

      // Ensure the captions are properly formatted
      const validCaptions = parsedCaptions.map((caption: any) => ({
        type: caption.type || 'subtitle',
        text: caption.text || '',
        time: Number(caption.time) || 0,
        endTime: Number(caption.endTime) || 0
      })).filter((caption: Caption) =>
        caption.text &&
        !isNaN(caption.time) &&
        !isNaN(caption.endTime) &&
        caption.endTime > caption.time
      )

      console.log('Validated captions:', validCaptions)
      return validCaptions
    } catch (error) {
      console.error('Error fetching captions:', error)
      return []
    }
  }
}
