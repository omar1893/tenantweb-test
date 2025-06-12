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
import { ERouter } from '@/enums/router'
import { useAuth } from '@/composables/useAuth'
import { eventBus } from '@/services/eventBus'

const route = useRoute()
const router = useRouter()
const { verifyProviderCallback, verifyEmailToken } = useAuth()

const checkPropertyVideoViewed = (propertyId: string): boolean => {
  return localStorage.getItem(`property_video_viewed_${propertyId}`) === 'true'
}

const redirectAfterAuth = () => {
  eventBus.emit('close-login-modal')

  const storedPropertyId = localStorage.getItem('current_property_id')
  if (!storedPropertyId) {
    console.log('[AuthVerify] No property ID found, redirecting to chatbot')
    router.push({ name: ERouter.Chatbot })
    return
  }

  if (checkPropertyVideoViewed(storedPropertyId)) {
    console.log('[AuthVerify] Property video already viewed, redirecting to chatbot')
    router.push({ name: ERouter.Chatbot })
  } else {
    console.log('[AuthVerify] Redirecting to property video')
    router.push({ name: ERouter.PropertyVideo })
  }
}

onMounted(async () => {
  try {
    const email = route.query.email as string
    const type = route.query.type as string
    const token = route.query.token as string
    const skipTokenCheck = route.query.skipTokenCheck === 'true'

    if (!email || !token || !type) {
      console.error('[AuthVerify] Missing required parameters:', { email, token, type })
      throw new Error('Missing required parameters')
    }

    console.log('[AuthVerify] Processing authentication with:', { type, email, skipTokenCheck })

    let success = false
    if (type === 'provider') {
      success = await verifyProviderCallback(token, email)
    } else {
      success = await verifyEmailToken(token, email)
    }

    if (!success) {
      throw new Error('Authentication verification failed')
    }

    redirectAfterAuth()
  } catch (error) {
    console.error('[AuthVerify] Authentication failed:', error)
    router.push({ name: ERouter.VideoIntro })
  }
})
</script>

<style scoped>
.pi {
  font-size: inherit;
}
</style>
