<template>
  <div
    v-if="message.type === EAgentMessageType.TEXT"
    class="chat-message"
    :class="message.role === EAgentMessageRole.AGENT ? 'chat-text-agent body-large' : 'chat-text-user body-medium'"
  >
    <span>{{ message.data.message }}</span>
  </div>
</template>

<script setup lang="ts">
import { EAgentMessageRole, EAgentMessageType } from '@/enums/agent'
import type { IAgentMessage } from '@/types/agent.d'

defineProps<{
  message: IAgentMessage
}>()
</script>

<style scoped lang="scss">
.chat-message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  border: none
}

.chat-text-agent {
  align-self: flex-start;
  background: #d8c8c8 !important;
  padding: 1.2rem 1.6rem 1.2rem 2rem;
  border: 1px solid #3F39491A;
  border-radius: 4rem 2rem 0.6rem 4rem;
}

.chat-text-user {
  align-self: flex-end;
  background: var(--te-light, #fdd5d1);
  padding: 1.2rem 1.6rem 1.2rem 2rem;
  border: 1px solid #3F39491A;
  border-radius: 4rem 2rem 0.6rem 4rem;
}
</style>
