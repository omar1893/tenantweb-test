<template>
  <ChatbotText v-if="message.type === EAgentMessageType.TEXT" :message="message" :instant="true" />
  <ChatbotComponent v-if="message.type === EAgentMessageType.COMPONENT" :component="message.data.component" />
</template>

<script setup lang="ts">
import { EAgentMessageType } from '@/enums/agent'
import type { IAgentMessage } from '@/types/agent.d'

import ChatbotText from '@/components/chatbot/ChatbotText.vue'
import ChatbotComponent from '@/components/chatbot/ChatbotComponent.vue'

defineProps<{
  message: IAgentMessage
}>()
</script>
