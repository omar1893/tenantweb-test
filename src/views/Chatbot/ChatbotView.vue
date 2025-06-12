<template>
  <div class="flex flex-col h-screen chatbot-background">
    <div v-if="state.loading && !agentStore.connected" class="flex flex-col h-screen items-center justify-center">
      <ion-spinner name="crescent" />
    </div>
    <div v-else-if="state.error" class="flex flex-col h-screen items-center justify-center">
      <h1>{{ state.error }}</h1>
      <Button @click="tryAgain()">Try again</Button>
    </div>
    <ChatbotMain
      v-else-if="agentStore.connected"
      :messages="agentStore.messages"
      :quick-action="agentStore.quickAction"
      @send="send"
    />
    <div v-else-if="!agentStore.connected && !state.loading" class="flex flex-col h-screen items-center justify-center">
      <h1>Agent is not connected</h1>
      <Button @click="connect()">Connect</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '@/stores/AgentStore'
import { useAuth } from '@/composables/useAuth'
import { TokenService } from '@/services/token.service'
import { ERouter } from '@/enums/router'

import Button from 'primevue/button'
import { IonSpinner } from '@ionic/vue'

import ChatbotMain from '@/components/chatbot/ChatbotMain.vue'

const router = useRouter()
const agentStore = useAgentStore()
const { authState } = useAuth()

interface IState {
  loading: boolean
  error: string | null
  messageLoading: boolean
}

const state = reactive<IState>({
  loading: true,
  error: null,
  messageLoading: false
})

const send = async (message: string) => {
  try {
    state.messageLoading = true
    await agentStore.sendMessage(message)
  } finally {
    state.messageLoading = false
  }
}

const connect = async () => {
  try {
    if (!authState.value.isAuthenticated) {
      console.log('[ChatbotView] User not authenticated, redirecting to auth verify')
      router.push({ name: ERouter.AuthVerify })
      return
    }

    const tokens = TokenService.getStoredTokens()
    if (!tokens?.accessToken) {
      console.log('[ChatbotView] No access token found, redirecting to auth verify')
      router.push({ name: ERouter.AuthVerify })
      return
    }

    state.loading = true
    state.error = null
    console.log('[ChatbotView] Connecting to agent...')
    await agentStore.connect(encodeURIComponent(tokens.accessToken))
    console.log('[ChatbotView] Successfully connected to agent')
  } catch (error) {
    console.error('[ChatbotView] Error connecting to agent:', error)
    state.error = 'Error connecting to agent'
    state.loading = false
  }
}

const tryAgain = () => {
  connect()
}

onMounted(() => {
  connect()
})
</script>

<style scoped lang="scss">
.chatbot-background {
  background-image: url('@/assets/chat-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
