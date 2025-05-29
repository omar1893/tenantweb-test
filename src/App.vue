<template>
  <div v-if="isPublic">
    <router-view />
  </div>
  <div v-else>
    <router-view />
<!--     <AuthLogic>
      <template #signed-in>
      </template>
    </AuthLogic> -->
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
/* import AuthLogic from '@/components/AuthLogic.vue' */
import { DeepLinkService } from '@/services/deepLink.service'

const route = useRoute()

const isPublic = computed(() => {
  return route.meta.isPublic
})

onMounted(async () => {
  await DeepLinkService.getInstance().initialize()
})
</script>


