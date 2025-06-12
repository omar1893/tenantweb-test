<template>
  <ChatbotText
    v-if="message.type === EAgentMessageType.TEXT"
    :message="message"
    :instant="true"
  />
  <ChatbotComponent
    v-if="message.type === EAgentMessageType.COMPONENT"
    :component="message.data.type"
    :properties="message.data.parameters"
  />
</template>

<script setup lang="ts">
import { EAgentMessageType } from '@/enums/agent'
import type { IAgentMessage } from '@/types/agent.d'

import ChatbotText from '@/components/chatbot/ChatbotText.vue'
import ChatbotComponent from '@/components/chatbot/ChatbotComponent.vue'

const props = defineProps<{
  message: IAgentMessage
}>()
console.log('message', props.message)
</script>

<style scoped lang="scss">
.text-te-secondary {
  color: var(--te-secondary);
}
</style>
