<template>
  <ion-page class="video-intro-page">
    <video ref="videoRef" autoplay muted loop playsinline class="background-video">
      <source src="../../assets/property-requirements.mp4" type="video/mp4">
    </video>

    <audio ref="audioRef" preload="auto">
      <source src="../../assets/test-audio.mp3" type="audio/mpeg">
    </audio>

    <div v-if="currentCaption" class="caption-container">
      <p class="caption-text">{{ currentCaption.text }}</p>
    </div>

    <div class="absolute bottom-[1rem] w-full p-4 z-10">
      <!-- <TButton
        class="w-full !rounded-[100px] button-large"
        variant="white"
        label="Apply Now"
        @click="showLoginModal"
      /> -->
    </div>

    <LoginInputs ref="loginModal" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IonPage } from '@ionic/vue'
import TButton from '@/components/TButton.vue'
import LoginInputs from './LoginInputs.vue'

interface Caption {
  type: string
  text: string
  time: number
  nextTime: number
}

const captions: Caption[] = [
  {
    'type': 'WELCOME',
    'text': 'Welcome to Oakwood Apartments, your new home awaits.',
    'time': 0.0,
    'nextTime': 2.8
  },
  {
    'type': 'CREDIT',
    'text': 'We have a flexible approach to credit scores, so there’s no minimum credit score required.',
    'time': 3.5,
    'nextTime': 7.0
  },
  {
    'type': 'PETS',
    'text': 'If you’re a pet lover, you’re in luck – we allow up to two pets, with a combined weight limit of 75 pounds.',
    'time': 8.0,
    'nextTime': 13.5
  },
  {
    'type': 'VEHICLES',
    'text': 'You’re free to park up to two cars on the premises.',
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

const showLoginModal = () => {
  loginModal.value.visible = true
}

const updateCaption = () => {
  if (!audioRef.value) return

  const currentTime = audioRef.value.currentTime
  const caption = captions.find(c => currentTime >= c.time && currentTime < c.nextTime)
  currentCaption.value = caption || null
}

onMounted(() => {
  if (videoRef.value && audioRef.value) {
    setTimeout(() => {
      videoRef.value.play().catch((err: Error) => console.error('Error playing video:', err))
      audioRef.value.play().catch((err: Error) => console.error('Error playing audio:', err))

      timeUpdateInterval = window.setInterval(updateCaption, 100)
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
  font-size: 1.25rem;
  text-align: center;
  max-width: 80%;
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
</style>
