export function debounce (func, wait = 250) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      func(...args)
    }, wait)
  }
}

export function range (start, stop) {
  if (stop === undefined) {
    stop = start
    start = 0
  }
  return Array(stop - start).fill().map((_, i) => i + start)
}
