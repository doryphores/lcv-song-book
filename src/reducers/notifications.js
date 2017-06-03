import _ from 'lodash'

import { RESTORE, NOTIFY, DISMISS, DISMISS_AND_NOTIFY, DISMISS_ALL } from '../actions'

let nextID = 0

const initiaState = []

export const notifications = (state = initiaState, { type, payload }) => {
  switch (type) {
    case NOTIFY:
      return _.concat(state, format(payload))
    case DISMISS:
      return _.reject(state, n => n.id === payload)
    case DISMISS_AND_NOTIFY:
      return format(payload)
    case DISMISS_ALL:
      return initiaState
    case RESTORE:
      return format(initiaState)
    default:
      return state
  }
}

function format (notification) {
  return _.castArray(notification).map(n => {
    if (_.isString(n)) n = { message: n }
    return Object.assign({
      id: nextID++,
      icon: 'info'
    }, n)
  })
}
