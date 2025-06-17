import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
/* import { Capacitor } from "@capacitor/core"; */

import type {
  IAgentMessage,
  IAgentResponse,
  IAgentRequest,
  IAgentQuickActionData,
  IAgentQuickActionItem,
} from '@/types/agent.d'
import AgentClientService from '@/services/agentClientService'
import {
  EAgentMessageRole,
  EAgentRequestType,
  EAgentMessageType,
  EAgentResponseType,
} from '@/enums/agent'

export interface IAgentStoreState {
  waiting: boolean;
  messages: IAgentMessage[];
  quickAction: IAgentQuickActionData | null;
  connected: boolean;
  client: AgentClientService | null;
  lastMessageTimestamp: number;
  currentStreamingId: string | null;
}

const WEBSOCKET_URL = 'wss://supervisor-qa.tenantev.dev/ws'

export const useAgentStore = defineStore('agent', {
  state: (): IAgentStoreState => ({
    waiting: false,
    messages: [],
    quickAction: null,
    connected: false,
    client: null,
    lastMessageTimestamp: 0,
    currentStreamingId: null,
  }),
  getters: {
    isConnected: (state) => state.connected && state.client?.isReady() === true,
  },
  actions: {
    _addTextMessage(message: IAgentResponse) {
      if (!('type' in message) || message.type !== EAgentResponseType.TEXT) {
        return
      }

      const now = Date.now()
      const timeSinceLastMessage = now - this.lastMessageTimestamp
      const shouldCreateNewBubble =
        timeSinceLastMessage > 1000 || this.currentStreamingId !== message.id

      if (shouldCreateNewBubble) {
        this.currentStreamingId = message.id
        this.messages.push({
          id: message.id,
          role: EAgentMessageRole.AGENT,
          type: EAgentMessageType.TEXT,
          data: { message: message.data.message.trim() },
        })
      } else {
        const existingMessage = this.messages[this.messages.length - 1]
        if (
          existingMessage &&
          existingMessage.type === EAgentMessageType.TEXT
        ) {
          existingMessage.data.message += message.data.message
        }
      }

      this.lastMessageTimestamp = now
    },
    _addComponentMessage(message: IAgentResponse) {
      if (
        !('type' in message) ||
        message.type !== EAgentResponseType.COMPONENT
      ) {
        return
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
      this.lastMessageTimestamp = 0
      this.currentStreamingId = null
    },
    connect(token: string) {
      this._cleanState()
      this.client = new AgentClientService({
        url: WEBSOCKET_URL,
        token,
        onOpen: () => {
          this.connected = true
        },
        onMessage: (message: IAgentResponse) => {
          if (!('type' in message)) {
            if (
              'status' in message &&
              message.status === 'error' &&
              'message' in message
            ) {
              console.error('Server error:', message.message)
              this.connected = false
            }
            return
          }

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
              console.log('QUICK_ACTION', message)
              console.log('Message', message.data)
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
          this.connected = false
        },
      })
      this.client.connect()
    },
    send(request: IAgentRequest, message?: string) {
      this.quickAction = null
      this.waiting = true

      // Check if client exists and is ready to send messages
      if (!this.client || !this.client.isReady()) {
        console.error('Agent client is not ready to send messages')
        this.connected = false
        this.waiting = false
        throw new Error('Agent client is not ready to send messages')
      }

      console.log('Request', request)
      console.log('Message 2', message)

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
        this.waiting = false
        // If it's a connection error, update the connected state
        if (
          error instanceof Error &&
          (error.message.includes('WebSocket connection is not available') ||
            error.message.includes('WebSocket connection is not ready'))
        ) {
          this.connected = false
        }
        throw error
      }
    },
    sendMessage(message: string) {
      this.send(
        {
          type: EAgentRequestType.TEXT,
          data: {
            message,
          },
        },
        message
      )
    },
    sendCommand(command: IAgentQuickActionItem, message?: string) {
      console.log('Send command', command)
      this.send(
        {
          type: EAgentRequestType.COMMAND,
          data: {
            type: command.type,
            value: command.value,
          },
        },
        message
      )
    },
  },
})
