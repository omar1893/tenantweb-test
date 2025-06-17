<template>
  <ion-app>
    <div class="ion-safe-area">
      <router-view />
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { DeepLinkService } from '@/services/deepLink.service'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'
import { IonApp } from '@ionic/vue'

const initializeStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setStyle({ style: Style.Dark })
      if (Capacitor.getPlatform() === 'ios') {
        await StatusBar.setOverlaysWebView({ overlay: true })
      }
    } catch (error) {
      console.error('Error configuring StatusBar:', error)
    }
  }
}

onMounted(async () => {
  await DeepLinkService.getInstance().initialize()
  await initializeStatusBar()
})
</script>

<style>
.ion-safe-area {
  padding-top: var(--ion-safe-area-top);
  padding-bottom: var(--ion-safe-area-bottom);
  padding-left: var(--ion-safe-area-left);
  padding-right: var(--ion-safe-area-right);
}
</style>


