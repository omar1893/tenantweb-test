export enum EAgentMessageType {
  TEXT = 'TEXT',
  COMPONENT = 'COMPONENT',
}

export enum EAgentResponseType {
  START = 'START',
  END = 'END',
  TEXT = 'TEXT',
  COMPONENT = 'COMPONENT',
  QUICK_ACTION = 'QUICK_ACTION',
}

export enum EAgentQuickActionComponent {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_CHOICE_PLATINUM = 'MULTIPLE_CHOICE_PLATINUM',
}

export enum EAgentQuickActionItemComponent {
  BUTTON = 'BUTTON',
}

export enum EAgentQuickActionAction {
  COMMAND = 'COMMAND',
}

export enum EAgentRequestType {
  TEXT = 'TEXT',
  COMMAND = 'COMMAND',
  LOGIN = 'LOGIN',
}

export enum EAgentMessageRole {
  USER = 'USER',
  AGENT = 'AGENT',
}

export enum EAgentComponent {
  TEST_COMPONENT = 'TEST_COMPONENT',
  APPLICATION_FEE_COMPONENT = 'FEE_REPORT',
  PLATINUM_SERVICE = 'PLATINUM_SERVICE'
}
