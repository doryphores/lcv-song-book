import { findIndex, sortedIndex, without } from 'lodash'

import {
  ADD_MARKER, REMOVE_MARKER,
  AddMarkerAction, RemoveMarkerAction
} from '../../actions'

type Actions = AddMarkerAction | RemoveMarkerAction

const TOLERANCE = 4

const initiaState: MarkerCollection = {}

export const markers = (state = initiaState, action: Actions) => {
  switch (action.type) {
    case ADD_MARKER:
      const markers = {
        ...state,
        [action.payload.song]: addMarker(state[action.payload.song], action.payload.position)
      }
      return markers
    case REMOVE_MARKER:
      return {
        ...state,
        [action.payload.song]: without(state[action.payload.song], action.payload.position)
      }
    default:
      return state
  }
}

function addMarker (markers: SongMarkers, position: number) {
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
