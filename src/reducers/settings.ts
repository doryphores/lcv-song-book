import { RESTORE, SAVE_SETTINGS, LOAD_RESOURCES } from '../actions'

const initialState = {
  password: '',
  lastResourceUpdate: 0
}

export const settings = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_RESOURCES:
      return {
        ...state,
        lastResourceUpdate: payload.timestamp
      }
    case SAVE_SETTINGS:
      return {
        ...state,
        payload
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
