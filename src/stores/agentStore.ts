import { defineStore } from 'pinia'

import type { IAgentMessage, IAgentResponse, IAgentComponent, IAgentRequest, IAgentComponentAction } from '@/types/agent.d'
import AgentClientService from '@/services/agentClientService'
import { EAgentMessageRole, EAgentMessageType, EAgentRequestType } from '@/enums/agent'
import { v4 as uuidv4 } from 'uuid'

export interface IAgentStoreState {
  messages: IAgentMessage[]
  components: IAgentComponent[]
  connected: boolean
  client: AgentClientService | null
}

export const useAgentStore = defineStore('agent', {
  state: (): IAgentStoreState => ({
    messages: [],
    components: [],
    connected: false,
    client: null,
  }),
  getters: {
    isConnected: (state) => state.connected,
  },
  actions: {
    connect() {
      this.client = new AgentClientService({
        url: 'ws://localhost:8787/ws',
        onOpen: () => {
          this.connected = true
        },
        onMessage: (message: IAgentResponse) => {
          this.messages.push(...message.messages)
          this.components = message.components || []
        },
        onClose: () => {
          this.connected = false
        },
      })
      this.client.connect()
    },
    send(request: IAgentRequest, message?: string) {
      this.client?.send(request)

      if (message) {
        this.messages.push({
          id: uuidv4(),
          role: EAgentMessageRole.USER,
          type: EAgentMessageType.TEXT,
          data: {
            message,
          },
        })
      }
    },
    sendMessage(message: string) {
      this.send({
        type: EAgentRequestType.SAY,
        data: {
          message,
        },
      }, message)
    },
    sendCommand(command: IAgentComponentAction, message?: string) {
      this.send({
        type: EAgentRequestType.COMMAND,
        code: command.code,
        data: {
          value: command.value,
        },
      }, message)
    },
  },
})
