<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
    <h1 class="text-2xl font-bold mb-4">Redirecting to the app...</h1>
    <p v-if="!clicked" class="mb-6">If nothing happens, tap the button below.</p>

    <a
      v-if="!clicked"
      :href="deepLink"
      class="px-6 py-3 bg-white text-black rounded-full text-lg font-semibold"
      @click="handleClick"
    >
      Open App
    </a>

    <p v-if="isWebView" class="mt-8 text-red-400 text-sm max-w-md">
      You're in a browser (e.g. Outlook, Instagram) that may not support app opening. Please open this page in Safari or Chrome.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const token = route.query.token as string || ''
const email = route.query.email as string || ''
const type = route.query.type as string || ''

const deepLink = `https://d3gs2.test-app.link/auth-verify?token=${token}&email=${email}&type=${type}`

const clicked = ref(false)
const isWebView = ref(false)

const detectWebView = () => {
  const ua = navigator.userAgent || ''
  return /FBAN|FBAV|Instagram|Line|LinkedIn|Outlook/i.test(ua)
}

const handleClick = () => {
  clicked.value = true
  // el href del <a> ya redirige, pero lo dejamos por claridad
  window.location.href = deepLink
}

onMounted(() => {
  isWebView.value = detectWebView()

  // redirección automática si no hay interacción
  setTimeout(() => {
    if (!clicked.value) {
      window.location.href = deepLink
    }
  }, 2000)
})
</script>
