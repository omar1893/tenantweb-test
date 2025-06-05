<template>
  <div class="flex flex-col h-screen">
    <div v-if="state.loading" class="flex flex-col h-screen items-center justify-center">
      <h1>Connecting...</h1>
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
    <div v-else-if="!agentStore.connected" class="flex flex-col h-screen items-center justify-center">
      <h1>Agent is not connected</h1>
      <Button @click="connect()">Connect</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '@/stores/AgentStore'
import { authService } from '@/services/auth.service'
import { ERouter } from '@/enums/router'

import Button from 'primevue/button'

import ChatbotMain from '@/components/chatbot/ChatbotMain.vue'

const router = useRouter()
const agentStore = useAgentStore()

interface IState {
  loading: boolean
  error: string | null
}

const state = reactive<IState>({
  loading: true,
  error: null,
})

const send = (message: string) => {
  agentStore.sendMessage(message)
}

const connect = async () => {
  try {
    if (!authService.isAuthenticated()) {
      router.push({ name: ERouter.AuthVerify })
      return
    }

    const token = authService.getAccessToken()
    if (!token) {
      router.push({ name: ERouter.AuthVerify })
      return
    }

    state.loading = true
    state.error = null
    await agentStore.connect(encodeURIComponent(token))
  } catch (error) {
    console.error('Error connecting to agent', error)
    state.error = 'Error connecting to agent'
  } finally {
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
</style>
