import { EAgentRequestType } from '@/enums/agent'
import type { IAgentRequest, IAgentResponse } from '@/types/agent.d'

export interface IAgentClientServiceOptions {
  url: string
  onOpen?: ((event: Event) => void) | null
  onMessage?: ((event: IAgentResponse) => void) | null
  onClose?: ((event: CloseEvent) => void) | null
  onError?: ((event: Event) => void) | null
}

class AgentClientService {
  private url: string
  private client?: WebSocket
  private onOpen?: ((event: Event) => void) | null = null
  private onMessage?: ((event: IAgentResponse) => void) | null = null
  private onClose?: ((event: CloseEvent) => void) | null = null
  private onError?: ((event: Event) => void) | null = null


  constructor(options: IAgentClientServiceOptions) {
    this.url = options.url
    this.onOpen = options.onOpen
    this.onMessage = options.onMessage
    this.onClose = options.onClose
    this.onError = options.onError

    this.client = new WebSocket(this.url)
  }

  public connect() {
    this.client = new WebSocket(this.url)

    this.client.onopen = (event) => {
      this.onOpen?.(event)
    }

    this.client.onmessage = (event) => {
      const res = JSON.parse(event.data) as IAgentResponse
      this.onMessage?.(res)
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

  public send(message: IAgentRequest) {
    this.getClient.send(JSON.stringify(message))
  }

  public login(jwt: string) {
    this.send({
      type: EAgentRequestType.LOGIN,
      data: {
        jwt,
      }
    })
  }
}

export default AgentClientService
