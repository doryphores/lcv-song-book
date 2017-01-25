import { RESIZE_SIDEBAR, TOGGLE_SIDEBAR } from '../actions'

let initiaState = {
  sidebarWidth: 350,
  sidebarVisible: true
}

export const ui = (state = initiaState, { type, payload }) => {
  switch (type) {
    case TOGGLE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarVisible: !state.sidebarVisible
      })
    case RESIZE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarWidth: payload
      })
    default:
      return state
  }
}
