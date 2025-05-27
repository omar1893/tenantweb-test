import {
  EAgentMessageType,
  EAgentQuickActionType,
  EAgentQuickActionItemType,
  EAgentQuickActionActionType,
  EAgentRequestType,
  EAgentMessageRole,
} from '@/enums/agent'

export interface IAgentMessage {
  id: string
  type: EAgentMessageType
  data: any
  role: EAgentMessageRole
}

export interface IAgentQuickActionAction {
  type: EAgentQuickActionActionType
  code: string
  value: string
  showMessage: boolean
}

export interface IAgentQuickActionItem {
  type: EAgentQuickActionItemType
  label: string
  style?: string
  action: IAgentQuickActionAction
}

export interface IAgentQuickAction {
  type: EAgentQuickActionType
  items: IAgentQuickActionItem[]
}

export interface IAgentResponse {
  messages: IAgentMessage[]
  quickActions?: IAgentQuickAction[]
  nextRoute?: string
}


export interface IAgentRequest {
  type: EAgentRequestType
  code?: string
  data?: object
  showMessage?: boolean
}
