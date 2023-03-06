import {
  RESTORE, RESIZE_SIDEBAR, TOGGLE_SIDEBAR,
  TOGGLE_SETTINGS, TOGGLE_SHORTCUTS, SAVE_SETTINGS,
  RestoreAction, ResizeSidebarAction, ToggleSidebarAction,
  ToggleSettingsAction, ToggleShortcutsAction, SaveSettingsAction, UpdateScraperProgressAction, UPDATE_SCRAPER_PROGRESS,
} from '../actions'

type Actions = RestoreAction
  | ResizeSidebarAction
  | ToggleSidebarAction
  | ToggleSettingsAction
  | ToggleShortcutsAction
  | SaveSettingsAction
  | UpdateScraperProgressAction

const initialState = {
  sidebarVisible: true,
  sidebarWidth: 300,
  settingsVisible: false,
  shortcutsVisible: false,
  hideScrollbars: false,
  scraperProgress: 0,
}

export const ui = (state = initialState, action: Actions) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible,
      }
    case RESIZE_SIDEBAR:
      return {
        ...state,
        sidebarWidth: action.payload,
      }
    case TOGGLE_SETTINGS:
      return {
        ...state,
        settingsVisible: !state.settingsVisible,
        shortcutsVisible: false,
      }
    case TOGGLE_SHORTCUTS:
      return {
        ...state,
        shortcutsVisible: !state.shortcutsVisible,
        settingsVisible: false,
      }
    case UPDATE_SCRAPER_PROGRESS:
      return {
        ...state,
        scraperProgress: action.payload,
      }
    case SAVE_SETTINGS:
      return {
        ...state,
        settingsVisible: false,
        hideScrollbars: action.payload.hideScrollbars,
      }
    case RESTORE:
      return {
        ...initialState,
        ...state,
        settingsVisible: false,
        shortcutsVisible: false,
        scraperProgress: 0,
      }
    default:
      return state
  }
}
