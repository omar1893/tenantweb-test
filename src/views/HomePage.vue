<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
        <button @click="generateTestLink">Generate Test Link</button>
        <p v-if="testLink">Generated Link: {{ testLink }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { ref } from 'vue'
import { DeepLinkService } from '@/services/deepLink.service'

const testLink = ref('')

const generateTestLink = async () => {
  try {
    const deepLinkService = DeepLinkService.getInstance()
    const link = await deepLinkService.createLink({
      propertyId: '123',
      test: 'true'
    })
    testLink.value = link
  } catch (error) {
    console.error('Error generating link:', error)
  }
}
</script>

<style lang="scss" scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: var(--te-spacing-md);

  strong {
    font-size: 20px;
    line-height: 26px;
    color: var(--te-dark);
  }

  p {
    font-size: 16px;
    line-height: 22px;
    color: var(--te-medium);
    margin: 0;
  }

  a {
    text-decoration: none;
    color: var(--te-primary);

    &:hover {
      color: var(--te-secondary);
    }
  }
}
</style>
