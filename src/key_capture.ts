const SPECIAL_KEYS = {
  'enter': 13,
  'escape': 27,
  'space': 32,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'pageup': 33,
  'pagedown': 34
}

interface Listener {
  readonly handler: Function
  readonly ignoreInForms: boolean
}

export default class KeyCapture {
  listeners: { [key: number]: Listener } = {}

  constructor (handlers) {
    this.listeners = {}
    if (handlers) this.registerMany(handlers)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  register (keys: string, handler: Function) {
    keys.split(' ').forEach(key => {
      this.listeners[this.keyCode(key)] = Object.assign({
        ignoreInForms: this.isChar(key) || ['left', 'right', 'space'].includes(key)
      }, { handler: handler.bind(null, key) })
    })
  }

  registerMany (handlers: { [key: string]: Function }) {
    Object.keys(handlers).forEach(k => this.register(k, handlers[k]))
  }

  activate () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown (e: KeyboardEvent) {
    let listener = this.listeners[e.keyCode]
    if (this.shouldIgnore(listener, e)) return
    if (!this.listeners[e.keyCode].handler()) e.preventDefault()
  }

  shouldIgnore (listener: Listener, e: KeyboardEvent) {
    const target = e.target as HTMLElement

    return (
      typeof listener === 'undefined' ||
      (
        listener.ignoreInForms &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      )
    )
  }

  keyCode (key: number | string) {
    if (typeof key === 'number') return key
    if (this.isChar(key)) return key.toUpperCase().charCodeAt(0)
    if (SPECIAL_KEYS[key]) return SPECIAL_KEYS[key]
    throw new Error(`Unknown key: "${key}"`)
  }

  isChar (s) {
    return (typeof s === 'string' && s.length === 1)
  }
}
