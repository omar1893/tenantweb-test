<template>
  <ion-page class="video-intro-page">
    <video autoplay muted loop playsinline class="background-video">
      <source src="../../assets/application-intro.mp4" type="video/mp4">
    </video>

    <div class="absolute bottom-[1rem] w-full p-4 z-10">
      <TButton
        class="w-full !rounded-[100px] button-large"
        variant="white"
        label="Apply Now"
        @click="showLoginModal"
      />
    </div>

    <LoginInputs ref="loginModal" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage } from '@ionic/vue'
import TButton from '@/components/TButton.vue'
import LoginInputs from '../Login/LoginInputs.vue'

const loginModal = ref()

const showLoginModal = () => {
  loginModal.value.visible = true
}
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
