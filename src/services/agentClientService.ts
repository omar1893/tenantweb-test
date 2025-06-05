import type { IAgentRequest, IAgentResponse } from '@/types/agent.d'
import { EAgentResponseType, EAgentRequestType } from '@/enums/agent'

export interface IAgentClientServiceOptions {
  url: string
  token: string
  onOpen?: ((event: Event) => void) | null
  onMessage?: ((event: IAgentResponse) => void) | null
  onClose?: ((event: CloseEvent) => void) | null
  onError?: ((event: Event) => void) | null
}

class AgentClientService {
  private url: string
  private token: string
  private client?: WebSocket
  private onOpen?: ((event: Event) => void) | null = null
  private onMessage?: ((event: IAgentResponse) => void) | null = null
  private onClose?: ((event: CloseEvent) => void) | null = null
  private onError?: ((event: Event) => void) | null = null
  private currentMessageId: string | null = null
  private currentMessage: string = ''
  private lastMessageTime: number = 0
  private messageTimeout: number = 1000 // 1 second timeout between messages

  constructor(options: IAgentClientServiceOptions) {
    this.url = options.url
    this.token = options.token
    this.onOpen = options.onOpen
    this.onMessage = options.onMessage
    this.onClose = options.onClose
    this.onError = options.onError
  }

  private sendCompleteMessage() {
    if (this.currentMessage && this.currentMessageId) {
      this.onMessage?.({
        id: this.currentMessageId,
        type: EAgentResponseType.TEXT,
        data: {
          message: this.currentMessage.trim()
        }
      })
      this.currentMessageId = null
      this.currentMessage = ''
    }
  }

  public connect() {
    this.client = new WebSocket(this.url)

    this.client.onopen = async (event) => {
      try {
        // Send authentication token as first message
        this.getClient.send(this.token)

        // Wait for auth response
        const authResponse = await new Promise<any>((resolve) => {
          const authHandler = (event: MessageEvent) => {
            const response = JSON.parse(event.data)
            this.client?.removeEventListener('message', authHandler)
            resolve(response)
          }
          this.client?.addEventListener('message', authHandler)
        })

        if (authResponse.status !== 'ok') {
          console.error('Authentication failed:', authResponse.message)
          this.onError?.(new Event('auth_failed'))
          return
        }

        this.onOpen?.(event)
      } catch (error) {
        console.error('Error during authentication:', error)
        this.onError?.(new Event('auth_failed'))
      }
    }

    this.client.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data)

        if (response.type === 'delta') {
          const now = Date.now()

          // If this is a new message or enough time has passed, send the current message and start a new one
          if (!this.currentMessageId || (now - this.lastMessageTime > this.messageTimeout)) {
            this.sendCompleteMessage()
            this.currentMessageId = response.id
          }

          if (response.data.end === true) {
            this.sendCompleteMessage()
          } else if (response.data.content) {
            this.currentMessage += response.data.content
            this.lastMessageTime = now
          }
        } else {
          // Handle other message types
          this.onMessage?.(response)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
        this.onError?.(new Event('parse_error'))
      }
    }

    this.client.onclose = (event) => {
      this.onClose?.(event)
    }

    this.client.onerror = (event) => {
      this.onError?.(event)
    }
  }

  private get getClient() {
    if (!this.client) {
      throw new Error('Client not connected')
    }
    return this.client
  }

  public isReady(): boolean {
    return this.client?.readyState === WebSocket.OPEN
  }

  public getReadyState(): number | undefined {
    return this.client?.readyState
  }

  public send(message: IAgentRequest) {
    if (!this.isReady()) {
      throw new Error('WebSocket connection is not ready')
    }

    try {
      let formattedMessage

      if (message.type === EAgentRequestType.TEXT) {
        formattedMessage = {
          type: 'message',
          content: message.data.message
        }
      } else if (message.type === EAgentRequestType.COMMAND) {
        formattedMessage = {
          type: 'COMMAND',
          data: {
            type: message.data.type,
            value: message.data.value
          }
        }
      }
      console.log('Formatted message', formattedMessage)
      this.getClient.send(JSON.stringify(formattedMessage))
    } catch (error) {
      console.error(error)
      if (error instanceof DOMException && error.name === 'InvalidStateError') {
        console.warn('WebSocket is not in OPEN state, cannot send message')
        throw new Error('WebSocket connection is not available')
      }
      throw error
    }
  }
}

export default AgentClientService
