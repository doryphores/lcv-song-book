import { RESTORE, RESIZE_SIDEBAR, TOGGLE_SIDEBAR } from '../actions'

let initiaState = {
  sidebarVisible: true,
  sidebarWidth: 300
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
    case RESTORE:
      return Object.assign({}, initiaState, state)
    default:
      return state
  }
}
