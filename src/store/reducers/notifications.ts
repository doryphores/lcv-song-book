import { castArray, concat, reject } from 'lodash'

import { RESTORE, NOTIFY, DISMISS, DISMISS_AND_NOTIFY, DISMISS_ALL } from '../../actions'

let nextID = 0

const initiaState: Notification[] = []

export const notifications = (state = initiaState, { type, payload }) => {
  switch (type) {
    case NOTIFY:
      return concat(state, format(payload))
    case DISMISS:
      return reject(state, n => n.id === payload)
    case DISMISS_AND_NOTIFY:
      return format(payload)
    case DISMISS_ALL:
      return initiaState
    case RESTORE:
      return initiaState
    default:
      return state
  }
}

function format (notification: any): Notification[] {
  return castArray(notification).map(n => {
    return {
      ...(typeof n === 'string') ? { message: n } : n,
      id: nextID++,
      icon: 'info'
    }
  })
}
