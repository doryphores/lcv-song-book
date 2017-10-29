import { patch } from 'emerge'

import {
  RESTORE, RESIZE_SIDEBAR, TOGGLE_SIDEBAR,
  TOGGLE_SETTINGS, TOGGLE_SHORTCUTS, SAVE_SETTINGS
} from '../actions'

const initialState = {
  sidebarVisible: true,
  sidebarWidth: 300,
  settingsVisible: false,
  shortcutsVisible: false,
  hideScrollbars: false
}

export const ui = (state = initialState, { type, payload }) => {
  switch (type) {
    case TOGGLE_SIDEBAR:
      return patch(state, {
        sidebarVisible: !state.sidebarVisible
      })
    case RESIZE_SIDEBAR:
      return patch(state, {
        sidebarWidth: payload
      })
    case TOGGLE_SETTINGS:
      return patch(state, {
        settingsVisible: !state.settingsVisible,
        shortcutsVisible: false
      })
    case TOGGLE_SHORTCUTS:
      return patch(state, {
        shortcutsVisible: !state.shortcutsVisible,
        settingsVisible: false
      })
    case SAVE_SETTINGS:
      return patch(state, {
        settingsVisible: false,
        hideScrollbars: payload.hideScrollbars
      })
    case RESTORE:
      return Object.assign({}, initialState, state, {
        settingsVisible: false,
        shortcutsVisible: false
      })
    default:
      return state
  }
}
