import { defineStore } from 'pinia'

import type { IAgentMessage, IAgentResponse, IAgentQuickAction, IAgentRequest, IAgentQuickActionAction } from '@/types/agent.d'
import AgentClientService from '@/services/agentClientService'
import { EAgentMessageRole, EAgentMessageType, EAgentRequestType } from '@/enums/agent'
import { v4 as uuidv4 } from 'uuid'

export interface IAgentStoreState {
  messages: IAgentMessage[]
  quickActions: IAgentQuickAction[]
  connected: boolean
  client: AgentClientService | null
}

export const useAgentStore = defineStore('agent', {
  state: (): IAgentStoreState => ({
    messages: [],
    quickActions: [],
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
          this.quickActions = message.quickActions || []
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
        type: EAgentRequestType.TEXT,
        data: {
          message,
        },
      }, message)
    },
    sendCommand(command: IAgentQuickActionAction, message?: string) {
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
