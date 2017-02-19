import { RESTORE, SAVE_SETTINGS } from '../actions'

const initiaState = {
  password: ''
}

export const settings = (state = initiaState, { type, payload }) => {
  switch (type) {
    case SAVE_SETTINGS:
      return Object.assign({}, state, payload)
    case RESTORE:
      return Object.assign({}, initiaState, state)
    default:
      return state
  }
}
