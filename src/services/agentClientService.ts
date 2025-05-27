class AgentClientService {
  private url: string
  private client?: WebSocket

  private constructor(url: string) {
    this.url = url
  }

  public connect() {
    this.client = new WebSocket(this.url)
  }

  private getClient() {
    if (!this.client) {
      this.client = new WebSocket(this.url)
    }
    return this.client
  }

  private send(message: object) {
    this.getClient().send(JSON.stringify(message))
  }

  public login(jwt: string) {
    this.send({
      type: 'login',
      jwt: jwt
    })
  }
}

export default AgentClientService
