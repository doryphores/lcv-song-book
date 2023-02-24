type Listener = {
  handler: () => boolean
  ignoreInForms: boolean
}

export default class KeyCapture {
  listeners: { [key: string]: Listener } = {}

  constructor (handlers?: { [key: string]: () => void }) {
    this.listeners = {}
    if (handlers) this.registerMany(handlers)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  register (keys: string, handler: () => void) {
    keys.split(' ').forEach(key => {
      this.listeners[key] = Object.assign({
        ignoreInForms: this.isChar(key) || ['ArrowLeft', 'ArrowRight', 'Space'].includes(key)
      }, { handler: handler.bind(null, key) })
    })
  }

  registerMany (handlers: { [key: string]: () => void }) {
    Object.keys(handlers).forEach(k => this.register(k, handlers[k]))
  }

  activate () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown (e: KeyboardEvent) {
    const listener = this.listeners[e.key] || this.listeners[e.code]
    if (!listener || this.shouldIgnore(listener, e)) return
    if (!listener.handler()) e.preventDefault()
  }

  shouldIgnore (listener: Listener, e: KeyboardEvent) {
    const target = e.target as HTMLElement

    return (
      listener.ignoreInForms &&
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    )
  }

  isChar (s: unknown) {
    return (typeof s === 'string' && s.length === 1)
  }
}
