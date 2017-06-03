import {
  RESTORE, RESIZE_SIDEBAR, TOGGLE_SIDEBAR,
  TOGGLE_SETTINGS, TOGGLE_SHORTCUTS, SAVE_SETTINGS
} from '../actions'

const initiaState = {
  sidebarVisible: true,
  sidebarWidth: 300,
  settingsVisible: false,
  shortcutsVisible: false,
  hideScrollbars: false
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
      return Object.assign({}, state, {
        settingsVisible: !state.settingsVisible,
        shortcutsVisible: false
      })
    case TOGGLE_SHORTCUTS:
      return Object.assign({}, state, {
        shortcutsVisible: !state.shortcutsVisible,
        settingsVisible: false
      })
    case SAVE_SETTINGS:
      return Object.assign({}, state, {
        settingsVisible: false,
        hideScrollbars: payload.hideScrollbars
      })
    case RESTORE:
      return Object.assign({}, initiaState, state, {
        settingsVisible: false,
        shortcutsVisible: false
      })
    default:
      return state
  }
}
