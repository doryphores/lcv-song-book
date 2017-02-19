import { RESTORE, RESIZE_SIDEBAR, TOGGLE_SIDEBAR, TOGGLE_SETTINGS, SAVE_SETTINGS } from '../actions'

const initiaState = {
  sidebarVisible: true,
  sidebarWidth: 300,
  settingsVisible: false
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
    case TOGGLE_SETTINGS:
    case SAVE_SETTINGS:
      return Object.assign({}, state, {
        settingsVisible: !state.settingsVisible
      })
    case RESTORE:
      return Object.assign({}, initiaState, state, {
        settingsVisible: false
      })
    default:
      return state
  }
}
