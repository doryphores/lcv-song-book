import { findIndex, sortedIndex, without } from 'lodash'

import { ADD_MARKER, REMOVE_MARKER } from '../actions'

const TOLERANCE = 4

const initiaState: { [key: string]: number[] } = {}

export const markers = (state = initiaState, { type, payload }) => {
  switch (type) {
    case ADD_MARKER:
      const markers = {
        ...state,
        [payload.song]: addMarker(state[payload.song], payload.position)
      }
      return markers
    case REMOVE_MARKER:
      return {
        ...state,
        [payload.song]: without(state[payload.song], payload.position)
      }
    default:
      return state
  }
}

function addMarker (markers: number[], position: number) {
  if (!markers || markers.length === 0) return [position]

  let result = markers.concat()

  let index = findIndex(markers, m => Math.abs(m - position) < TOLERANCE)

  if (index > -1) {
    result.splice(index, 1, position)
  } else {
    result.splice(sortedIndex(markers, position), 0, position)
  }

  return result
}
