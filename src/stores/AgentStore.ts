import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

import type { IAgentMessage, IAgentResponse, IAgentRequest, IAgentQuickActionData, IAgentQuickActionItem } from '@/types/agent.d'
import AgentClientService from '@/services/agentClientService'
import { EAgentMessageRole, EAgentRequestType, EAgentMessageType, EAgentResponseType } from '@/enums/agent'

export interface IAgentStoreState {
  waiting: boolean
  messages: IAgentMessage[]
  quickAction: IAgentQuickActionData | null
  connected: boolean
  client: AgentClientService | null
}
export const useAgentStore = defineStore('agent', {
  state: (): IAgentStoreState => ({
    waiting: false,
    messages: [],
    quickAction: null,
    connected: false,
    client: null,
  }),
  getters: {
    isConnected: (state) => state.connected && state.client?.isReady() === true,
  },
  actions: {
    _addTextMessage (message: IAgentResponse) {
      if (message.type !== EAgentResponseType.TEXT) {
        throw new Error('Invalid message type')
      }

      const existingMessage = this.messages.find((m) => m.id === message.id)
      if (existingMessage && existingMessage.type !== EAgentMessageType.TEXT) return

      if (existingMessage) {
        const existingData = existingMessage.data
        existingData.message += message.data.message
      } else {
        this.messages.push({
          id: message.id,
          role: EAgentMessageRole.AGENT,
          type: EAgentMessageType.TEXT,
          data: message.data,
        })
      }
    },
    _addComponentMessage (message: IAgentResponse) {
      if (message.type !== EAgentResponseType.COMPONENT) {
        throw new Error('Invalid message type')
      }

      this.messages.push({
        id: message.id,
        role: EAgentMessageRole.AGENT,
        type: EAgentMessageType.COMPONENT,
        data: message.data,
      })
    },
    _cleanState() {
      this.connected = false
      this.messages = []
      this.quickAction = null
    },
    connect() {
      this._cleanState()
      this.client = new AgentClientService({
        url: 'ws://localhost:8787/ws',
        onOpen: () => {
          this.connected = true
        },
        onMessage: (message: IAgentResponse) => {
          switch (message.type) {
            case EAgentResponseType.START:
              this.waiting = true
              break
            case EAgentResponseType.END:
              this.waiting = false
              break
            case EAgentResponseType.TEXT:
              this._addTextMessage(message)
              break
            case EAgentResponseType.COMPONENT:
              this._addComponentMessage(message)
              break
            case EAgentResponseType.QUICK_ACTION:
              this.quickAction = message.data
              break
            default:
              console.error('Unknown message type', message)
              break
          }
        },
        onClose: () => {
          this.connected = false
        },
        onError: (event: Event) => {
          console.error('Agent client error', event)
        },
      })
      this.client.connect()
    },
    send(request: IAgentRequest, message?: string) {
      this.quickAction = null

      // Check if client exists and is ready to send messages
      if (!this.client || !this.client.isReady()) {
        console.error('Agent client is not ready to send messages')
        this.connected = false
        throw new Error('Agent client is not ready to send messages')
      }

      try {
        this.client.send(request)

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
      } catch (error) {
        console.error('Failed to send message to agent:', error)
        // If it's a connection error, update the connected state
        if (error instanceof Error && (
          error.message.includes('WebSocket connection is not available') ||
          error.message.includes('WebSocket connection is not ready')
        )) {
          this.connected = false
        }
        throw error
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
    sendCommand(command: IAgentQuickActionItem, message?: string) {
      this.send({
        type: EAgentRequestType.COMMAND,
        data: {
          type: command.type,
          value: command.value,
        },
      }, message)
    },
  },
})
