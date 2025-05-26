<template>
  <ion-page class="bg-black video-intro-page">
    <video ref="videoRef" autoplay playsinline class="background-video">
      <source src="../../assets/video-test5.mp4" type="video/mp4">
    </video>

    <audio ref="audioRef" preload="auto">
      <source src="../../assets/test-audio5.mp3" type="audio/mpeg">
    </audio>

    <div v-if="currentCaption" class="caption-container body-large">
      <p class="caption-text">{{ currentCaption.text }}</p>
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

    <!-- <LoginInputs ref="loginModal" /> -->

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
/* import LoginInputs from './LoginInputs.vue' */

interface Caption {
  type: string
  text: string
  time: number
  endTime: number
}

const showContinueButtons = ref(false)

const captions: Caption[] = [
  {
    'type': 'WELCOME',
    'text': "🌟 Hey there, welcome to Foster's Mill Homeowners Association Incorporated.",
    'time': 0.0,
    'endTime': 4.0
  },
  {
    'type': 'CREDIT',
    'text': "💳 No credit score needed, you're all set.",
    'time': 4.1,
    'endTime': 7.0
  },
  {
    'type': 'PETS',
    'text': '🐾 Bring two pets under 50 pounds, keep them leashed outside and ESAs are always okay.',
    'time': 7.1,
    'endTime': 12.0
  },
  {
    'type': 'BREEDS',
    'text': '🚫 Aggressive breeds must be muzzled or removed.',
    'time': 12.1,
    'endTime': 15.0
  },
  {
    'type': 'VEHICLES',
    'text': '🚗 Park up to two cars in your garage or driveway.',
    'time': 15.1,
    'endTime': 18.0
  },
  {
    'type': 'PARKING',
    'text': '🚫 No street parking overnight or on the grass.',
    'time': 18.1,
    'endTime': 20.0
  },
  {
    'type': 'LEASE',
    'text': '📅 Flexible leases from 6 to 12 months.',
    'time': 20.1,
    'endTime': 23.0
  },
  {
    'type': 'RENEW',
    'text': '🔄 Renew and stay as long as you like.',
    'time': 23.1,
    'endTime': 25.0
  },
  {
    'type': 'REVIEW',
    'text': "📄 Next, you'll review the full property requirements before agreeing and continuing with your application.",
    'time': 25.1,
    'endTime': 28.9
  }
]

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
  const caption = captions.find(c => currentTime >= c.time && currentTime < c.endTime)
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
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  width: auto;
  height: 88vh;
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
  position: relative;
  padding-bottom: 0;
  margin-bottom: 12vh;

  p {
    color: #FFFFFFE5;
    margin-top: 0;
    margin-bottom: 0.6rem !important;
  }
}
</style>
