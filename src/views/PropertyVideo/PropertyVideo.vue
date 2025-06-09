<template>
  <ion-page class="bg-te-black video-intro-page" @ion-view-will-leave="handleIonViewWillLeave">
    <!-- Loading State -->
    <div v-if="assetsLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <ion-spinner name="crescent" class="text-white" />
    </div>

    <video
      ref="videoRef"
      playsinline
      preload="auto"
      :muted="isVideoMuted"
      class="background-video"
      @loadedmetadata="handleVideoMetadata"
    >
      <source src="../../assets/video-test6.mp4" type="video/mp4">
    </video>

    <audio ref="audioRef" preload="auto">
      <source :src="state.audioUrl" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <div v-if="currentCaption" class="caption-container body-large">
      <p class="caption-text">{{ currentCaption.text }}</p>
    </div>

    <div class="text-container w-full">
      <p class="text-medium">La Perla</p>
      <p class="body-large">We're thrilled to have you at La Perla...</p>
      <p class="button-large" style="cursor:pointer;" @click="showInfoModal">Read more</p>
      <div v-if="!showContinueButtons" class="controls-container">
        <div class="control-group">
          <button class="control-button" @click="togglePlayback">
            <i :class="isPlaying ? 'pi pi-pause' : 'pi pi-play'" />
          </button>
          <button class="control-button" @click="toggleAudioMute">
            <i :class="isAudioMuted ? 'pi pi-volume-off' : 'pi pi-volume-up'" />
          </button>
        </div>
      </div>
      <template v-if="showContinueButtons">
        <TButton
          class="w-full !rounded-[100px] button-large"
          variant="white"
          label="Start Application"
          @click="handleStartApplication"
        />
        <TButton
          class="w-full !rounded-[100px] button-large"
          :text="true"
          variant="text"
          label="Watch Video Again"
          @click="restartMedia"
        />
      </template>
    </div>

    <ion-modal
      :is-open="infoModalVisible"
      :initial-breakpoint="1"
      :breakpoints="[1]"
      class="bottom-modal"
      :backdrop-dismiss="!assetsLoading"
      :backdrop-breakpoint="1"
      :swipe-to-close="false"
      :presenting-element="null"
      :handle="false"
      @did-dismiss="handleModalDismiss"
    >
      <div class="p-7">
        <div class="flex justify-between items-center mb-6 text-2xl">
          <i class="pi pi-times text-xl cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': assetsLoading }" @click="handleCloseClick" />
        </div>

        <h2 class="mb-1 text-medium">{{ state.propertyData?.name || 'Welcome!' }}</h2>
        <h3 class="mb-4 text-medium">Here's the quick rundown <span>👇</span></h3>
        <ul v-if="state.propertyData?.configuration?.[0]" class="body-large text-gray-800 mb-2 list-disc pl-4">
          <li
            v-for="(requirement, index) in state.propertyData.configuration[0].requirements"
            :key="index"
            class="mb-4"
          >
            {{ requirement }}
          </li>
        </ul>
        <ul v-else class="body-large text-gray-800 mb-2 list-disc pl-4">
          <li class="mb-4">Processing Time: up to 5 business days</li>
          <li class="mb-4">No Pets only ESA / SA</li>
          <li class="mb-4">Short-Term Lease applications only</li>
          <li class="mb-4">Everyone +18 Applies</li>
          <li class="mb-4">Airbnb booking screenshots required</li>
        </ul>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TButton from '@/components/TButton.vue'
import { propertyAudioService } from '@/services/property.audio.service'
import { propertyCaptionsService } from '@/services/property.captions.service'
import { propertyService } from '@/services/propertyService'
import { IonPage, IonModal, IonSpinner } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { authService } from '@/services/auth.service'
import { ERouter } from '@/enums/router'

interface Caption {
  type: string
  text: string
  time: number
  endTime: number
}

interface State {
  loading: boolean
  property: any
  audioUrl: string
  captionsUrl: string
  propertyData: any
}

const DEFAULT_PROPERTY_ID = '14791'

const videoRef = ref()
const audioRef = ref()
const assetsLoading = ref(true)
const currentCaption = ref<Caption | null>(null)
const captions = ref<Caption[]>([])
let timeUpdateInterval: number | null = null

const isPlaying = ref(false)
const isAudioMuted = ref(false)
const isVideoMuted = ref(true)
const infoModalVisible = ref(true)
const showContinueButtons = ref(false)
const isFirstInteraction = ref(true)

const state = reactive<State>({
  loading: true,
  property: {},
  audioUrl: '',
  captionsUrl: '',
  propertyData: null
})

const router = useRouter()

const propertyId = ref('')

const loadPropertyAssets = async () => {
  try {
    const propertyId = localStorage.getItem('current_property_id') || DEFAULT_PROPERTY_ID
    const propertyUid = localStorage.getItem('current_property_uid')
    console.log('Loading assets for property:', propertyId)

    // Fetch property data if we have the uid
    if (propertyUid) {
      try {
        state.propertyData = await propertyService.getPropertyLandingPage(propertyUid)
        console.log('Property data loaded:', state.propertyData)
      } catch (error) {
        console.error('Error loading property data:', error)
      }
    }

    const files = await propertyAudioService.getPropertyFiles(propertyId)

    if (files) {
      console.log('Received files:', files)
      state.audioUrl = files.audio_url
      state.captionsUrl = files.captions_url
      console.log('Audio URL set to:', state.audioUrl)

      if (audioRef.value && state.audioUrl) {
        audioRef.value.src = state.audioUrl
        await new Promise((resolve) => {
          audioRef.value.addEventListener('loadeddata', resolve, { once: true })
          audioRef.value.addEventListener('error', resolve, { once: true })
        })
      }

      if (state.captionsUrl) {
        captions.value = await propertyCaptionsService.getCaptions(state.captionsUrl)
      }
    }
  } catch (error) {
    console.error('Error loading property assets:', error)
  } finally {
    assetsLoading.value = false
  }
}

const handleVideoMetadata = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
  }
}

const handleModalDismiss = async () => {
  console.log('handleModalDismiss')
  if (!videoRef.value || !audioRef.value) return

  // Only start video on first interaction
  if (!isFirstInteraction.value) return
  isFirstInteraction.value = false

  try {
    videoRef.value.currentTime = 0
    audioRef.value.currentTime = 0

    if (Capacitor.getPlatform() === 'ios') {
      // Intentamos reproducir primero el video
      await videoRef.value.play()
      await audioRef.value.play()
      // Una vez que ambos están reproduciendo, intentamos activar el audio del video
      try {
        isVideoMuted.value = false
        audioRef.value.volume = 0 // Bajamos el volumen del audio de respaldo
      } catch (error) {
        console.log('Fallback to audio element')
        isVideoMuted.value = true
        audioRef.value.volume = 1
      }
    } else {
      await Promise.all([
        videoRef.value.play(),
        audioRef.value.play()
      ])
    }

    isPlaying.value = true
    timeUpdateInterval = window.setInterval(updateCaption, 100)

    audioRef.value.addEventListener('ended', async () => {
      if (videoRef.value) {
        await videoRef.value.pause()
      }
      showContinueButtons.value = true
    })
  } catch (error) {
    console.error('Error starting media:', error)
  }
}

const showInfoModal = () => {
  if (!assetsLoading.value) {
    infoModalVisible.value = true
  }
}

const handleCloseClick = () => {
  if (!assetsLoading.value) {
    infoModalVisible.value = false
  }
}

const togglePlayback = async () => {
  if (videoRef.value && audioRef.value) {
    try {
      if (isPlaying.value) {
        await Promise.all([
          videoRef.value.pause(),
          audioRef.value.pause()
        ])
      } else {
        await Promise.all([
          videoRef.value.play(),
          audioRef.value.play()
        ])

        if (Capacitor.getPlatform() === 'ios') {
          try {
            isVideoMuted.value = false
            audioRef.value.volume = 0
          } catch {
            isVideoMuted.value = true
            audioRef.value.volume = 1
          }
        }
      }
      isPlaying.value = !isPlaying.value
    } catch (err) {
      console.error('Error toggling playback:', err)
    }
  }
}

const toggleAudioMute = () => {
  if (Capacitor.getPlatform() === 'ios') {
    try {
      isVideoMuted.value = !isVideoMuted.value
      audioRef.value.volume = isVideoMuted.value ? 1 : 0
    } catch {
      isVideoMuted.value = true
      audioRef.value.volume = 1
    }
    isAudioMuted.value = isVideoMuted.value
  } else if (audioRef.value) {
    audioRef.value.muted = !audioRef.value.muted
    isAudioMuted.value = audioRef.value.muted
  }
}

const updateCaption = () => {
  if (!audioRef.value) return

  const currentTime = audioRef.value.currentTime
  const caption = captions.value.find(c => currentTime >= c.time && currentTime < c.endTime)
  currentCaption.value = caption || null
}

const restartMedia = async () => {
  if (videoRef.value && audioRef.value) {
    videoRef.value.currentTime = 0
    audioRef.value.currentTime = 0
    await handleModalDismiss()
    showContinueButtons.value = false
  }
}

const handleIonViewWillLeave = () => {
  infoModalVisible.value = false
}

const handleStartApplication = async () => {
  if (!authService.isAuthenticated()) {
    // If not authenticated, redirect to login
    router.push({ name: ERouter.AuthVerify })
    return
  }

  // If authenticated, proceed to chatbot
  router.push({ name: ERouter.Chatbot })
}

const pauseAllMedia = async () => {
  if (videoRef.value && audioRef.value) {
    try {
      await Promise.all([
        videoRef.value.pause(),
        audioRef.value.pause()
      ])
      isPlaying.value = false
    } catch (err) {
      console.error('Error pausing media:', err)
    }
  }
}

onMounted(async () => {
  loadPropertyAssets()

  // Aseguramos que el video empiece muteado para permitir la precarga
  isVideoMuted.value = true

  if (Capacitor.getPlatform() === 'android') {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  propertyId.value = localStorage.getItem('current_property_id') || ''

  // Add app state change listeners
  App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
    if (!isActive) {
      pauseAllMedia()
    }
  })
})

onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
  // Remove app state change listeners
  App.removeAllListeners()
})
</script>

<style lang="scss" scoped>
.video-intro-page {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  justify-content: flex-end;
}

.background-video {
  position: absolute;
  top: 0;
  min-width: 100%;
  width: auto;
  height: 85vh;
  z-index: 1;
  object-fit: cover;
}

.caption-container {
  position: absolute;
  top: 10rem;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.caption-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-align: center;
  max-width: 80%;
}

.controls-container {
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
  right: 1rem;
  z-index: 3;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.control-button {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #FFFFFF21;
  border: 1px solid #FFFFFF33;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  i {
    font-size: 1.7rem;
  }
}

.content-container {
  position: relative;
  z-index: 2;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 40px;
}

.get-started-btn {
  width: calc(100% - 32px);
  margin: 0 16px;
  height: 56px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-container {
  z-index: 2;
  padding: 4rem 0.8rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1));
  position: absolute;
  padding-bottom: 0;
  margin-bottom: 12vh;
  bottom: 0;

  p {
    color: #FFFFFFE5;
    margin-top: 0;
    margin-bottom: 0.6rem !important;
  }
}

:deep(.bottom-modal) {
  --height: auto;
  --max-height: 90%;
  --width: 100%;
  --border-radius: 24px;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  touch-action: none;

  .ion-page {
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    background: white;
    position: fixed;
    touch-action: none;
  }

  .modal-wrapper {
    border-radius: var(--border-radius);
    touch-action: none;
  }

  ion-modal {
    -webkit-user-select: none;
    user-select: none;
  }

  .modal-handle {
    display: none;
  }
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
</style>
