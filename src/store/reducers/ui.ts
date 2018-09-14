import {
  RESTORE, RESIZE_SIDEBAR, TOGGLE_SIDEBAR,
  TOGGLE_SETTINGS, TOGGLE_SHORTCUTS, SAVE_SETTINGS,
  RestoreAction, ResizeSidebarAction, ToggleSidebarAction,
  ToggleSettingsAction, ToggleShortcutsAction, SaveSettingsAction
} from '../../actions'

type Actions = RestoreAction
  | ResizeSidebarAction
  | ToggleSidebarAction
  | ToggleSettingsAction
  | ToggleShortcutsAction
  | SaveSettingsAction

const initialState = {
  sidebarVisible: true,
  sidebarWidth: 300,
  settingsVisible: false,
  shortcutsVisible: false,
  hideScrollbars: false
}

export const ui = (state = initialState, action: Actions) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible
      }
    case RESIZE_SIDEBAR:
      return {
        ...state,
        sidebarWidth: action.payload
      }
    case TOGGLE_SETTINGS:
      return {
        ...state,
        settingsVisible: !state.settingsVisible,
        shortcutsVisible: false
      }
    case TOGGLE_SHORTCUTS:
      return {
        ...state,
        shortcutsVisible: !state.shortcutsVisible,
        settingsVisible: false
      }
    case SAVE_SETTINGS:
      return {
        ...state,
        settingsVisible: false,
        hideScrollbars: action.payload.hideScrollbars
      }
    case RESTORE:
      return {
        ...initialState,
        ...state,
        settingsVisible: false,
        shortcutsVisible: false
      }
    default:
      return state
  }
}
