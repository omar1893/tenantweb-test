<template>
  <div class="rounded-xl bg-white shadow p-6 w-full max-w-4xl mx-auto text-te-secondary">
    <div v-for="(item, idx) in items" :key="idx" class="flex justify-between mb-4 te-text-sm">
      <span>{{ item.label }}</span>
      <span class="font-medium">{{ item.value }}</span>
    </div>
    <hr class="my-6 opacity-20">
    <div class="flex justify-between items-center te-text-base">
      <span class="font-semibold">{{ total.label }}</span>
      <span class="font-bold">{{ total.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  properties: {
    items: { label: string; value: string }[]
    total: { label: string; value: string }
  }
}

const props = defineProps<IProps>()

const items = computed(() => props.properties.items)
const total = computed(() => props.properties.total)
</script>
