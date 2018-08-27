export function debounce (func: Function, wait = 100) {
  let timeout: number
  return (...args: []) => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(func.apply(null, args), wait)
  }
}

export function range (end: number) {
  return Array(end).fill(0).map((_, i: number) => i)
}
