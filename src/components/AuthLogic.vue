<template>
  <div v-if="authStore.isLoading"> Loading... </div>
  <template v-else-if="authStore.isAuthenticated">
    <slot name="signed-in" />
  </template>
  <template v-else>
    <slot name="signed-out" />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
</script>
