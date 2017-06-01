import _ from 'lodash'

import { RESTORE, NOTIFY, DISMISS, DISMISS_AND_NOTIFY } from '../actions'

const initiaState = []

export const notifications = (state = initiaState, { type, payload }) => {
  switch (type) {
    case NOTIFY:
      return _.concat(state, _.castArray(payload))
    case DISMISS:
      return _.without(state, payload)
    case DISMISS_AND_NOTIFY:
      return _.castArray(payload)
    case RESTORE:
      return initiaState
    default:
      return state
  }
}
