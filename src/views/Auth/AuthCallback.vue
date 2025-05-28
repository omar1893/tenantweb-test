<template>
  <ion-page>
    <div class="flex items-center justify-center h-full">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonSpinner } from '@ionic/vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { ERouter } from '@/enums/router'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const jwt = await authStore.jwt()
    console.log('JWT:', jwt)
    console.log('Session Data:', authStore.data)
    router.push({ name: ERouter.PropertyVideo })
  } catch (error) {
    console.error('Error during auth callback:', error)
    router.push({ name: ERouter.VideoIntro })
  }
})
</script>
