const SPECIAL_KEYS = {
  'space': 32,
  'left': 37,
  'up': 38,
  'down': 40,
  'enter': 13,
  'escape': 27
}

export default class KeyCapture {
  constructor (handlers) {
    this.listeners = {}
    if (handlers) this.registerMany(handlers)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  register (key, handler) {
    let listener = this.listeners[this.keyCode(key)] = Object.assign({
      active: true,
      ignoreInForms: typeof key === 'string' && key.length === 1
    }, { handler })

    return {
      activate () { listener.active = true },
      deactivate () { listener.active = false }
    }
  }

  registerMany (handlers) {
    return Object.keys(handlers).map(k => this.register(k, handlers[k]))
  }

  activate () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown (e) {
    let listener = this.listeners[e.which]
    if (this.shouldIgnore(listener, e)) return
    if (!this.listeners[e.which].handler()) e.preventDefault()
  }

  shouldIgnore (listener, e) {
    return (
      typeof listener === 'undefined' ||
      !listener.active ||
      (
        listener.ignoreInForms &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      )
    )
  }

  keyCode (key) {
    if (typeof key === 'number') return key
    if (typeof key === 'string') {
      if (key.length === 1) return key.toUpperCase().charCodeAt()
      if (SPECIAL_KEYS[key]) return SPECIAL_KEYS[key]
    }
    throw new Error(`Unknown key: "${key}"`)
  }
}
