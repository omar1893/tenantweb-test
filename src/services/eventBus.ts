import mitt from 'mitt'

type Events = {
  'close-login-modal': void
}

export const eventBus = mitt<Events>()
