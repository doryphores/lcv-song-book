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

export default class KeyCapture {
  constructor (handlers) {
    this.listeners = {}
    if (handlers) this.registerMany(handlers)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  register (keys, handler) {
    keys.split(' ').forEach(key => {
      this.listeners[this.keyCode(key)] = Object.assign({
        ignoreInForms: this.isChar(key) || ['left', 'right', 'space'].includes(key)
      }, { handler })
    })
  }

  registerMany (handlers) {
    Object.keys(handlers).forEach(k => this.register(k, handlers[k]))
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
      (
        listener.ignoreInForms &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      )
    )
  }

  keyCode (key) {
    if (typeof key === 'number') return key
    if (this.isChar(key)) return key.toUpperCase().charCodeAt()
    if (SPECIAL_KEYS[key]) return SPECIAL_KEYS[key]
    throw new Error(`Unknown key: "${key}"`)
  }

  isChar (s) {
    return (typeof s === 'string' && s.length === 1)
  }
}
