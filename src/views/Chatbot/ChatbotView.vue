<template>
  <div class="flex flex-col h-screen relative justify-end">
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
      <ChatbotMessage v-for="msg in agentStore.messages" :key="msg.id" :message="msg" />
    </div>
    <div v-if="agentStore.quickActions?.length" class="flex flex-col gap-3 px-1.5 py-2">
      <ChatbotQuickAction v-for="(quickAction, index) in agentStore.quickActions" :key="`quickAction-${index}`" :quick-action="quickAction" />
    </div>
    <div class="bg-white flex items-center px-4 py-3 gap-2 border-t border-gray-200">
      <button class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl">+</button>
      <input
        v-model="input"
        class="flex-1 border-none outline-none text-base bg-transparent px-3"
        type="text"
        placeholder="Ask me anything"
        @keyup.enter="send"
      >
      <button class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl" @click="send">⮞</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useAgentStore } from '@/stores/agentStore'

import ChatbotMessage from '@/views/Chatbot/ChatbotMessage.vue'
import ChatbotQuickAction from '@/views/Chatbot/ChatbotQuickAction.vue'
const agentStore = useAgentStore()

const input = ref('')
const messagesContainer = ref<HTMLDivElement | null>(null)

const send = () => {
  agentStore.sendMessage(input.value)
  input.value = ''
}

watch(agentStore.messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

onMounted(() => {
  agentStore.connect()
})
</script>

<style scoped lang="scss">
</style>
