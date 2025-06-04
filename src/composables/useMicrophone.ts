import { ref, onUnmounted } from 'vue'
import { App } from '@capacitor/app'

/**
 * A Vue 3 composable for managing and checking microphone permissions.
 * It provides the permission status and a method to request access.
 */
export function useMicrophone() {
  // Reactive state for microphone permission status
  const permissionStatus = ref<'granted' | 'denied' | 'prompt' | 'unavailable' | ''>('')
  // Reactive state for any errors
  const error = ref<string | null>(null)
  // Reference to the microphone MediaStream if active
  const mediaStream = ref<MediaStream | null>(null)

  /**
   * Attempts to get microphone access and updates the permission status.
   * If successful, it returns the MediaStream; otherwise, it returns null.
   */
  const requestMicrophoneAccess = async (): Promise<MediaStream | null> => {
    // Reset states before the request
    permissionStatus.value = 'prompt'
    error.value = null

    // Stop any active stream before requesting a new one
    if (mediaStream.value) {
      stopMicrophone()
    }

    try {
      // Attempt to get microphone access.
      // Capacitor bridges this call to the native API if the app runs on a device.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.value = stream
      permissionStatus.value = 'granted'
      console.log('useMicrophonePermissions: Microphone access granted.')
      return stream
    } catch (err: any) {
      console.log('useMicrophonePermissions: Error requesting microphone access:', err)
      mediaStream.value = null // Ensure stream is null on failure
      // Specific error handling based on the error type
      if (err.name === 'NotAllowedError') {
        permissionStatus.value = 'denied'
        error.value = 'Microphone access denied by the user.'
        console.warn('useMicrophonePermissions: Microphone access denied by user.')
      } else if (err.name === 'NotFoundError') {
        permissionStatus.value = 'unavailable'
        error.value = 'No microphone found on your device.'
        console.error('useMicrophonePermissions: No microphone found.')
      } else if (err.name === 'NotReadableError') {
        permissionStatus.value = 'unavailable'
        error.value = 'The microphone is in use or inaccessible (e.g., by another app).'
        console.error('useMicrophonePermissions: Microphone not accessible.')
      } else if (err.name === 'AbortError') {
        permissionStatus.value = 'unavailable'
        error.value = 'The microphone access operation was aborted.'
        console.error('useMicrophonePermissions: Operation aborted.')
      } else {
        permissionStatus.value = 'unavailable'
        error.value = `Unexpected error accessing microphone: ${err.message}`
        console.error('useMicrophonePermissions: Unknown error:', err)
      }
      return null
    }
  }

  /**
   * Stops the microphone MediaStream if it's active.
   */
  const stopMicrophone = () => {
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach(track => track.stop())
      mediaStream.value = null
      console.log('useMicrophonePermissions: Microphone stopped.')
      // Optional: you could reset permissionStatus to '' or 'stopped'
    }
  }

  // --- App State Handling (Capacitor only) ---
  // Listen for the app coming back to the foreground to re-check permission status.
  // This is useful if the user changes permissions from system settings.
  if (typeof App !== 'undefined' && App.addListener) { // Check if Capacitor App is available
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive && permissionStatus.value === 'denied') {
        // If the app becomes active again and permission was denied,
        // you might want to re-request it or at least clear the error
        // to allow the user to try again.
        // Optional: requestMicrophoneAccess(); // Uncomment if you want it to retry automatically
        error.value = null // Clear error for a new attempt
        console.log('useMicrophone: App became active again.')
      }
    })
  }

  // Ensure the microphone is stopped when the component using this composable is unmounted
  onUnmounted(() => {
    stopMicrophone()
  })

  return {
    permissionStatus,
    error,
    mediaStream,
    requestMicrophoneAccess,
    stopMicrophone,
  }
}
