<template>
  <ion-page class="video-intro-page">
    <video ref="videoRef" autoplay muted loop playsinline class="background-video">
      <source src="../../assets/property-requirements.mp4" type="video/mp4">
    </video>

    <audio ref="audioRef" preload="auto">
      <source src="../../assets/test-audio.mp3" type="audio/mpeg">
    </audio>

    <div v-if="currentCaption" class="caption-container">
      <p class="caption-text text-large">{{ currentCaption.text }}</p>
    </div>

    <div class="text-container">
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
        />
        <TButton
          class="w-full !rounded-[100px] button-large"
          :text="true"
          label="Watch Video Again"
          @click="restartMedia"
        />
      </template>
    </div>

    <!-- <div class="w-full p-4 z-10">
    </div> -->

    <LoginInputs ref="loginModal" />

    <ion-modal
      :is-open="infoModalVisible" :initial-breakpoint="1" :breakpoints="[0, 1]" class="bottom-modal"
      @did-dismiss="closeInfoModal" @will-dismiss="closeInfoModal"
    >
      <div class="p-12">
        <h2 class="mb-1 text-medium">Welcome to La Perla!</h2>
        <h3 class="mb-4 text-medium">Here's the quick rundown <span>👇</span></h3>
        <ul class="body-large text-gray-800 mb-2 list-disc pl-4">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage, IonModal } from '@ionic/vue'
import TButton from '@/components/TButton.vue'
import LoginInputs from './LoginInputs.vue'

interface Caption {
  type: string
  text: string
  time: number
  nextTime: number
}

const showContinueButtons = ref(false)

const captions: Caption[] = [
  {
    'type': 'WELCOME',
    'text': 'Welcome to Oakwood Apartments, your new home awaits.',
    'time': 0.0,
    'nextTime': 2.8
  },
  {
    'type': 'CREDIT',
    'text': "We have a flexible approach to credit scores, so there's no minimum credit score required.",
    'time': 3.5,
    'nextTime': 7.0
  },
  {
    'type': 'PETS',
    'text': "If you're a pet lover, you're in luck – we allow up to two pets, with a combined weight limit of 75 pounds.",
    'time': 8.0,
    'nextTime': 13.5
  },
  {
    'type': 'VEHICLES',
    'text': "You're free to park up to two cars on the premises.",
    'time': 15.0,
    'nextTime': 19.0
  },
  {
    'type': 'LEASE',
    'text': 'We offer a minimum lease term of 12 months.',
    'time': 20.0,
    'nextTime': 23.5
  }
]

const loginModal = ref()
const videoRef = ref()
const audioRef = ref()
const currentCaption = ref<Caption | null>(null)
let timeUpdateInterval: number | null = null

const isPlaying = ref(true)
const isAudioMuted = ref(false)

const infoModalVisible = ref(false)
const showInfoModal = () => { infoModalVisible.value = true }
const closeInfoModal = () => {
  console.log('closing modal')
  infoModalVisible.value = false
}

const showLoginModal = () => {
  loginModal.value.visible = true
}

const togglePlayback = async () => {
  if (videoRef.value && audioRef.value) {
    if (isPlaying.value) {
      await videoRef.value.pause()
      await audioRef.value.pause()
    } else {
      await videoRef.value.play()
      await audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const toggleAudioMute = () => {
  if (audioRef.value) {
    audioRef.value.muted = !audioRef.value.muted
    isAudioMuted.value = !isAudioMuted.value
  }
}

const updateCaption = () => {
  if (!audioRef.value) return

  const currentTime = audioRef.value.currentTime
  const caption = captions.find(c => currentTime >= c.time && currentTime < c.nextTime)
  currentCaption.value = caption || null
}

const restartMedia = async () => {
  if (videoRef.value && audioRef.value) {
    await videoRef.value.play()
    await audioRef.value.play()
    showContinueButtons.value = false
    isPlaying.value = true
  }
}

onMounted(() => {
  if (videoRef.value && audioRef.value) {
    setTimeout(() => {
      videoRef.value.play().catch((err: Error) => console.error('Error playing video:', err))
      audioRef.value.play().catch((err: Error) => console.error('Error playing audio:', err))

      timeUpdateInterval = window.setInterval(updateCaption, 100)

      // Detect when audio ends
      audioRef.value.addEventListener('ended', async () => {
        if (videoRef.value) {
          await videoRef.value.pause()
        }
        showContinueButtons.value = true
      })
    }, 1000)
  }
})

onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})
</script>

<style scoped lang="scss">
.video-intro-page {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #F15B4E;
  justify-content: flex-end;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: 100vh;
  z-index: 1;
  object-fit: cover;
}

.caption-container {
  position: absolute;
  top: 2rem;
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
  position: relative;

  p {
    color: #FFFFFFE5;
    margin-top: 0;
    margin-bottom: 0.6rem !important;
  }
}
</style>
