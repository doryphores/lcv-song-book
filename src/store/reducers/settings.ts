import {
  RESTORE, SAVE_SETTINGS, LOAD_RESOURCES,
  RestoreAction, SaveSettingsAction, LoadResourcesAction
} from '../../actions'

type Actions = RestoreAction | SaveSettingsAction | LoadResourcesAction

const initialState = {
  username: '',
  password: '',
  lastResourceUpdate: 0
}

export const settings = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LOAD_RESOURCES:
      return {
        ...state,
        lastResourceUpdate: action.payload.timestamp
      }
    case SAVE_SETTINGS:
      return {
        ...state,
        ...action.payload
      }
    case RESTORE:
      return {
        ...initialState,
        ...state
      }
    default:
      return state
  }
}
