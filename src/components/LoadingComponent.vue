<template>
  <ProgressSpinner
    :style="{ width: size, height: size }"
    stroke-width="4"
    fill="transparent"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps<{
  color?: string;
  size?: string;
}>()

const color = computed(() => props.color || 'var(--p-primary-color)')
const size = computed(() => props.size || '60px')
</script>


<style lang="scss" scoped>
:deep(.p-progressspinner-circle) {
  stroke: v-bind(color) !important;
}
</style>
