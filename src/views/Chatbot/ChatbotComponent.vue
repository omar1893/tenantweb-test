<template>
  <component :is="selectedComponent" v-if="selectedComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EAgentComponent } from '@/enums/agent'

import TestComponent from '@/components/chatbot/TestComponent.vue'

const components = {
  [EAgentComponent.TEST_COMPONENT]: TestComponent,
}

const props = defineProps<{
  component: EAgentComponent
}>()

const selectedComponent = computed(() => components[props.component])
</script>

<style scoped lang="scss">
.chat-message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  border: none
}

.chat-message-agent {
  align-self: flex-start;
  background: #d8c8c8 !important;
  padding: 1.2rem 1.6rem 1.2rem 2rem;
  border: 1px solid #3F39491A;
  border-radius: 4rem 2rem 0.6rem 4rem;
}

.chat-message-user {
  align-self: flex-end;
  background: var(--te-light, #fdd5d1);
  padding: 1.2rem 1.6rem 1.2rem 2rem;
  border: 1px solid #3F39491A;
  border-radius: 4rem 2rem 0.6rem 4rem;
}
</style>
