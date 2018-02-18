import _ from 'lodash'
import { putInBy } from 'emerge'

import { ADD_MARKER, REMOVE_MARKER } from '../actions'

const initiaState = {}

export const markers = (state = initiaState, { type, payload }) => {
  switch (type) {
    case ADD_MARKER:
      return putInBy(state, [payload.song], l => _.compact([].concat(l, payload.position)).sort((a, b) => a - b))
    case REMOVE_MARKER:
      return putInBy(state, [payload.song], l => _.without(l, payload.position))
    default:
      return state
  }
}
