import _ from 'lodash'

import { RESTORE, NOTIFY, DISMISS } from '../actions'

const initiaState = []

export const notifications = (state = initiaState, { type, payload }) => {
  switch (type) {
    case NOTIFY:
      return _.concat(state, payload)
    case DISMISS:
      return _.without(state, payload)
    case RESTORE:
      return initiaState
    default:
      return state
  }
}
