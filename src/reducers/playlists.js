import _ from 'lodash'

import {
  SELECT_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST,
  RESTORE
} from '../actions'

const initialState = {
  selectedPlaylist: 'ALL',
  playlists: {}
}

export const playlists = (state = initialState, { type, payload }) => {
  let playlists
  let selectedPlaylist = state.selectedPlaylist

  switch (type) {
    case SELECT_PLAYLIST:
      return Object.assign({}, state, { selectedPlaylist: payload })
    case ADD_TO_PLAYLIST:
      playlists = Object.assign({}, state.playlists, {
        [payload.playlist]: _.union(state[payload.playlist], [payload.song])
      })
      return Object.assign({}, state, { playlists })
    case REMOVE_FROM_PLAYLIST:
      if (!state.playlists[payload.playlist]) return state

      let newPlaylist = _.without(state.playlists[payload.playlist], payload.song)

      if (_.isEmpty(newPlaylist)) {
        // Remove empty playlist
        playlists = _.omit(state.playlists, payload.playlist)
        if (selectedPlaylist === payload.playlist) {
          selectedPlaylist = ''
        }
      } else {
        playlists = Object.assign({}, playlists, {
          [payload.playlist]: newPlaylist
        })
      }

      return Object.assign({}, state, {
        selectedPlaylist: selectedPlaylist,
        playlists: playlists
      })
    case RESTORE:
      if (state.playlists) return state
      return Object.assign({}, initialState, { playlists: state })
    default:
      return state
  }
}
