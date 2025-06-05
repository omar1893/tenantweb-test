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
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { ERouter } from '@/enums/router'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const email = route.query.email as string
    const type = route.query.type as string
    const token = route.query.token as string

    if (!email) {
      throw new Error('Missing email')
    }

    let success = false
    if (type === 'email' && token) {
      success = await authService.verifyEmailWithToken(token, email)
    } else if (type === 'provider' && token) {
      await authService.validateProviderCallback(token, email)
      success = true
    } else {
      throw new Error('Invalid verification parameters')
    }

    if (success) {
      router.push({ name: ERouter.PropertyVideo })
    } else {
      throw new Error('Verification failed')
    }
  } catch (error) {
    console.error('Verification failed:', error)
    router.push({ name: ERouter.VideoIntro })
  }
})
</script>

<style scoped>
.pi {
  font-size: inherit;
}
</style>
