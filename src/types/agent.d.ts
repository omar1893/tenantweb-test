import {
  EAgentMessageType,
  EAgentComponentType,
  EAgentComponentItemType,
  EAgentComponentActionType,
  EAgentRequestType,
  EAgentMessageRole,
} from '@/enums/agent'

export interface IAgentMessage {
  id: string
  type: EAgentMessageType
  data: any
  role: EAgentMessageRole
}

export interface IAgentComponentAction {
  type: EAgentComponentActionType
  code: string
  value: string
  showMessage: boolean
}

export interface IAgentComponentItem {
  type: EAgentComponentItemType
  label: string
  style?: string
  action: IAgentComponentAction
}

export interface IAgentComponent {
  type: EAgentComponentType
  items: IAgentComponentItem[]
}

export interface IAgentResponse {
  messages: IAgentMessage[]
  components?: IAgentComponent[]
  nextRoute?: string
}


export interface IAgentRequest {
  type: EAgentRequestType
  code?: string
  data?: object
  showMessage?: boolean
}
