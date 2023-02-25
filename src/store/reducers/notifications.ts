import { castArray, concat, reject } from 'lodash'

import {
  RESTORE, NOTIFY, DISMISS, DISMISS_ALL,
  RestoreAction, NotifyAction, DismissAction, DismissAllAction
} from '../../actions'

type Actions = RestoreAction | NotifyAction | DismissAction | DismissAllAction

let nextID = 0

export const notifications = (state: INotification[] = [], action: Actions) => {
  switch (action.type) {
    case NOTIFY:
      return concat(state, castArray(action.payload).map((notification) => ({
        id: nextID++,
        ...notification
      })))
    case DISMISS:
      return reject(state, n => n.id === action.payload)
    case DISMISS_ALL:
    case RESTORE:
      return []
    default:
      return state
  }
}
