const SPECIAL_KEYS = {
  'space': 32,
  'left': 37,
  'up': 38,
  'down': 40,
  'enter': 13,
  'escape': 27
}

export default class KeyCapture {
  constructor () {
    this.listeners = {}
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  register (key, handler, opts = {}) {
    let listener = this.listeners[this.keyCode(key)] = Object.assign({
      active: true,
      preventDefault: true,
      ignoreInForms: typeof key === 'string' && key.length === 1
    }, opts, { handler })

    return {
      activate () {
        listener.active = true
        console.log(listener)
      },
      deactivate () { listener.active = false }
    }
  }

  activate () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  destroy () {
    this.deactivate()
    delete this.listeners
  }

  handleKeyDown (e) {
    let listener = this.listeners[e.which]
    if (this.shouldIgnore(listener, e)) return
    if (listener.preventDefault) e.preventDefault()
    this.listeners[e.which].handler()
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
