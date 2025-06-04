<template>
  <div class="flex flex-col h-screen relative justify-end">
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
      <ChatbotMessage v-for="msg in props.messages" :key="msg.id" :message="msg" />
    </div>
    <div v-if="props.quickAction" class="flex flex-col gap-3 px-1.5 py-2">
      <ChatbotQuickAction :quick-action="props.quickAction" />
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
      {{ permissionStatus }}
      <button
        v-if="mediaStream"
        class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl"
        :disabled="permissionStatus === 'prompt' || permissionStatus === 'unavailable'"
        @click="handleStopMicrophone()"
      >
        <i class="pi pi-stop" />
      </button>
      <button
        v-else
        class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl"
        @click="handleMicrophoneAccess()"
      >
        <LoadingComponent
          v-if="permissionStatus === 'prompt'"
          style="width: 1rem; height: 1rem;"
          color="var(--te-secondary)"
        />
        <i
          v-else
          class="pi pi-microphone"
          :class="{
            'text-red-500': permissionStatus === 'denied',
            'text-green-500': permissionStatus === 'granted',
            'text-gray-500': permissionStatus === 'unavailable'
          }"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

import { useMicrophone } from '@/composables/useMicrophone'

import LoadingComponent from '@/components/LoadingComponent.vue'

import ChatbotMessage from '@/components/chatbot/ChatbotMessage.vue'
import ChatbotQuickAction from '@/components/chatbot/ChatbotQuickAction.vue'

import type { IAgentMessage, IAgentQuickActionData } from '@/types/agent.d'

const input = ref('')
const messagesContainer = ref<HTMLDivElement | null>(null)

const {
  requestMicrophoneAccess,
  mediaStream,
  stopMicrophone,
  permissionStatus
} = useMicrophone()

const props = defineProps<{
  messages: IAgentMessage[]
  quickAction: IAgentQuickActionData | null
}>()

const emit = defineEmits<{
  send: [message: string]
}>()

const send = () => {
  emit('send', input.value)
  input.value = ''
}

const handleMicrophoneAccess = async () => {
  const stream = await requestMicrophoneAccess()
  if (stream) {
    console.log('Microphone access granted')
  } else {
    console.error('Microphone access denied')
  }
}

const handleStopMicrophone = () => {
  stopMicrophone()
}

watch(props.messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

watch(permissionStatus, () => {
  console.log('Permission status changed:', permissionStatus.value)

  if (permissionStatus.value === 'denied') {
    console.error('Microphone access denied')
  }
})
</script>

<style scoped lang="scss">
</style>
