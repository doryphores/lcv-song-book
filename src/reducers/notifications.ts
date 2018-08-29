import { castArray, concat, isString, reject } from 'lodash'

import { RESTORE, NOTIFY, DISMISS, DISMISS_AND_NOTIFY, DISMISS_ALL } from '../actions'

let nextID = 0

interface INotification {
  readonly id: number
  readonly icon: string
  readonly message: string
  readonly song?: string
}

const initiaState: INotification[] = []

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

function format (notification): INotification[] {
  return castArray(notification).map(n => {
    if (isString(n)) n = { message: n }
    return {
      ...n,
      id: nextID++,
      icon: 'info'
    }
  })
}
