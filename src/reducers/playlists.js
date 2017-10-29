import _ from 'lodash'
import { patch, putInBy } from 'emerge'

import {
  SELECT_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST,
  RESTORE
} from '../actions'

const initialState = {
  selectedPlaylist: '',
  playlists: {}
}

function cleanup (state) {
  return patch(state, {
    selectedPlaylist: state.playlists[state.selectedPlaylist] ? state.selectedPlaylist : ''
  })
}

export const playlists = (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECT_PLAYLIST:
      return cleanup(patch(state, { selectedPlaylist: payload }))
    case ADD_TO_PLAYLIST:
      return cleanup(putInBy(state, ['playlists', payload.playlist], list => {
        return _.union(list, [payload.song])
      }))
    case REMOVE_FROM_PLAYLIST:
      return cleanup(putInBy(state, ['playlists', payload.playlist], list => {
        list = _.without(list, payload.song)
        return list.length ? list : null
      }))
    case RESTORE:
      if (state.playlists) return state
      return Object.assign({}, initialState, { playlists: state })
    default:
      return state
  }
}
