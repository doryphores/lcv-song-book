import _ from 'lodash'
import { putInBy } from 'emerge'

import { ADD_MARKER, REMOVE_MARKER } from '../actions'

const TOLERANCE = 4

const initiaState = {}

export const markers = (state = initiaState, { type, payload }) => {
  switch (type) {
    case ADD_MARKER:
      return putInBy(state, [payload.song], l => addMarker(l, payload.position))
    case REMOVE_MARKER:
      return putInBy(state, [payload.song], l => _.without(l, payload.position))
    default:
      return state
  }
}

function addMarker (markers, position) {
  if (!markers || markers.length === 0) return [position]

  let result = markers.concat()

  let index = _.findIndex(markers, m => Math.abs(m - position) < TOLERANCE)

  if (index > -1) {
    result.splice(index, 1, position)
  } else {
    result.splice(_.sortedIndex(markers, position), 0, position)
  }

  return result
}
