import { TOGGLE_SIDEBAR } from '../actions'

let initiaState = {
  sidebarVisible: true
}

export const ui = (state = initiaState, { type, payload }) => {
  switch (type) {
    case TOGGLE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarVisible: !state.sidebarVisible
      })
    default:
      return state
  }
}
