<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 class="text-2xl font-bold mb-4">Deep Link Landing</h1>
    <div class="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md">
      <div v-if="params">
        <div v-for="(value, key) in params" :key="key" class="mb-2">
          <span class="font-semibold">{{ key }}:</span> {{ value }}
        </div>
      </div>
      <div v-else>
        <span>No parameters received.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const params = computed(() => route.query)
</script>

<style scoped>
.bg-white {
  background: #fff;
}
</style> 