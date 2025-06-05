import {
  EAgentMessageType,
  EAgentRequestType,
  EAgentMessageRole,
  EAgentResponseType,
  EAgentQuickActionComponent,
  EAgentQuickActionAction,
  EAgentComponent,
} from '@/enums/agent'

// ------------- RESPONSE -------------

export interface IAgentErrorResponse {
  status: 'error'
  detail: string
}

export interface IAgentAuthResponse {
  status: 'ok' | 'error'
  message?: string
  user_id?: string
  session_id?: string
}

export interface IAgentDeltaData {
  content?: string
  end?: boolean
}

export interface IAgentDeltaResponse {
  type: 'delta'
  id: string
  data: IAgentDeltaData
}

export interface IAgentQuickActionItem {
  component: EAgentQuickActionItemComponent
  label: string
  style?: string
  action: EAgentQuickActionAction
  type: string
  value: string
  showMessage: boolean
}

export interface IAgentQuickActionData {
  component: EAgentQuickActionComponent
  options: IAgentQuickActionItem[]
}

export interface IAgentTextData {
  message: string
}

export interface IAgentComponentData {
  component: EAgentComponent
  properties: any
}

export interface IAgentStartData {}

export interface IAgentEndData {
  nextView?: string
}

export type IAgentResponse =
  | { id: string; type: EAgentResponseType.START; data: IAgentStartData }
  | { id: string; type: EAgentResponseType.END; data: IAgentEndData }
  | { id: string; type: EAgentResponseType.TEXT; data: IAgentTextData }
  | { id: string; type: EAgentResponseType.COMPONENT; data: IAgentComponentData }
  | { id: string; type: EAgentResponseType.QUICK_ACTION; data: IAgentQuickActionData }
  | IAgentErrorResponse
  | IAgentAuthResponse
  | IAgentDeltaResponse

// ------------- REQUEST -------------

export interface IAgentRequest {
  type: EAgentRequestType
  data?: any
  showMessage?: boolean
}

// ------------- MESSAGE -------------

export type IAgentMessage =
  | { id: string; type: EAgentMessageType.TEXT; data: IAgentTextData; role: EAgentMessageRole }
  | { id: string; type: EAgentMessageType.COMPONENT; data: IAgentComponentData; role: EAgentMessageRole }
