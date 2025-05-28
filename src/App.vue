<template>
  <div v-if="isPublic">
    <router-view />
  </div>
  <div v-else>
    <AuthLogic>
      <template #signed-in>
        <router-view />
      </template>
      <template #signed-out>
        <LoginInputs />
      </template>
    </AuthLogic>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import LoginInputs from '@/views/Login/LoginInputs.vue'
import AuthLogic from '@/components/AuthLogic.vue'
/* import { DeepLinkService } from '@/services/deepLink.service' */

const route = useRoute()

const isPublic = computed(() => {
  return route.meta.isPublic
})

/* onMounted(async () => {
  await DeepLinkService.getInstance().initialize()
}) */
</script>


