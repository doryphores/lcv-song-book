import { castArray, concat, reject } from 'lodash'

import { RESTORE, NOTIFY, DISMISS, DISMISS_ALL } from '../../actions'

let nextID = 0

const initiaState: SavedNotification[] = []

export const notifications = (state = initiaState, { type, payload }) => {
  switch (type) {
    case NOTIFY:
      return concat(state, castArray(payload).map((notification) => ({
        id: nextID++,
        ...notification
      })))
    case DISMISS:
      return reject(state, n => n.id === payload)
    case DISMISS_ALL:
      return initiaState
    case RESTORE:
      return initiaState
    default:
      return state
  }
}
