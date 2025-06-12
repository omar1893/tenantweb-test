<template>
  <ion-page class="video-intro-page">
    <video
      ref="videoRef"
      playsinline
      preload="auto"
      :muted="isVideoMuted"
      loop
      class="background-video"
    >
      <source src="../../assets/application-intro.mp4" type="video/mp4">
    </video>

    <audio ref="audioRef" loop preload="auto">
      <source src="../../assets/application-intro.mp4" type="video/mp4">
    </audio>

    <div class="absolute bottom-[1rem] w-full p-4 z-10">
      <TButton
        class="w-full !rounded-[100px] button-large"
        variant="white"
        label="Get started"
        @click="handleGetStarted"
      />
    </div>

    <LoginInputs ref="loginModal" :is-open="isOpen" @close-modal="handleModalClose" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IonPage } from '@ionic/vue'
import TButton from '@/components/TButton.vue'
import LoginInputs from '../Login/LoginInputs.vue'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { eventBus } from '@/services/eventBus'

const VIDEO_VIEWED_KEY = 'intro_video_viewed'

const videoRef = ref()
const audioRef = ref()
const isVideoMuted = ref(true)
const loginModal = ref()
const isOpen = ref(false)
const hasViewedVideo = ref(localStorage.getItem(VIDEO_VIEWED_KEY) === 'true')

const showLoginModal = () => {
  isOpen.value = true
}

const closeLoginModal = () => {
  isOpen.value = false
  startMedia()
}

const handleModalClose = () => {
  isOpen.value = false
  startMedia()
}

const handleGetStarted = () => {
  pauseAllMedia()
  localStorage.setItem(VIDEO_VIEWED_KEY, 'true')
  hasViewedVideo.value = true
  showLoginModal()
}

const startMedia = async () => {
  if (!videoRef.value || !audioRef.value) return

  try {
    if (Capacitor.getPlatform() === 'ios') {
      videoRef.value.muted = false
      try {
        await videoRef.value.play()
        audioRef.value.muted = true
      } catch (error) {
        console.log('Fallback to audio element')
        videoRef.value.muted = true
        audioRef.value.muted = false
        await Promise.all([
          videoRef.value.play(),
          audioRef.value.play()
        ])
      }
    } else {
      videoRef.value.muted = false
      audioRef.value.muted = true
      try {
        await videoRef.value.play()
      } catch (error) {
        console.log('Fallback to audio element')
        videoRef.value.muted = true
        audioRef.value.muted = false
        await Promise.all([
          videoRef.value.play(),
          audioRef.value.play()
        ])
      }
    }
  } catch (error) {
    console.error('Error starting media:', error)
    videoRef.value.muted = true
    audioRef.value.muted = true
    videoRef.value.play()
  }
}

const pauseAllMedia = async () => {
  if (videoRef.value && audioRef.value) {
    try {
      await Promise.all([
        videoRef.value.pause(),
        audioRef.value.pause()
      ])
    } catch (err) {
      console.error('Error pausing media:', err)
    }
  }
}

onMounted(async () => {
  eventBus.on('close-login-modal', closeLoginModal)

  if (hasViewedVideo.value) {
    showLoginModal()
    return
  }

  await new Promise(resolve => setTimeout(resolve, 500))
  await startMedia()

  App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
    if (!isActive) {
      pauseAllMedia()
    } else if (!isOpen.value) {
      startMedia()
    }
  })
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
