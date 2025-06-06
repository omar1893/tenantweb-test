<template>
  <div class="flex flex-col h-screen relative justify-end chatbot-container">
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
      <ChatbotMessage v-for="msg in props.messages" :key="msg.id" :message="msg" />
    </div>
    <div v-if="props.quickAction" class="flex flex-col gap-3 px-6 py-2">
      <ChatbotQuickAction :quick-action="props.quickAction" />
    </div>
    <div class="px-6 mb-8">
      <div class="bg-white flex flex-col items-center px-6 py-3 gap-2 border-t border-gray-200 input-container">
        <input
          v-model="input"
          class="text-te-secondary flex-1 border-none outline-none text-base bg-transparent mb-4 px-3 w-full chatbot-input"
          type="text"
          placeholder="Ask me anything"
          @keyup.enter="send"
        >
        <div class="flex flex-row justify-between w-full text-te-secondary button-bar">
          <button class="rounded-full flex items-center justify-center">+</button>
          <button
            v-if="mediaStream"
            class="rounded-full w-9 h-9 flex items-center justify-center"
            :disabled="permissionStatus === 'prompt' || permissionStatus === 'unavailable'"
            @click="handleStopMicrophone()"
          >
            <i class="pi pi-stop" />
          </button>
          <button
            v-else
            class="rounded-full flex items-center justify-center"
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
<!--         <button class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl" @click="send">⮞</button>
        {{ permissionStatus }} -->
      </div>
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
.chatbot-container {
  background-image: url('@/assets/chat-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.input-container {
  border-radius: 2.4rem;
  border: 1px solid #2825311F;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
}

.button-bar {

  button {
    width: 3.2rem;
    height: 3.2rem;
    font-size: 2rem!important;
    border: 1px solid #2825311F;

    .pi {
      font-size: 1.5rem!important;
    }
  }
}
</style>
