import { RESTORE, SAVE_SETTINGS, LOAD_RESOURCES } from '../actions'

const initiaState = {
  password: '',
  lastResourceUpdate: 0
}

export const settings = (state = initiaState, { type, payload }) => {
  switch (type) {
    case LOAD_RESOURCES:
      return Object.assign({}, state, {
        lastResourceUpdate: payload.timestamp
      })
    case SAVE_SETTINGS:
      return Object.assign({}, state, payload)
    case RESTORE:
      return Object.assign({}, initiaState, state)
    default:
      return state
  }
}
