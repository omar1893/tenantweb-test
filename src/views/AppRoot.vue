<template>
  <ion-page>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue'
</script>
