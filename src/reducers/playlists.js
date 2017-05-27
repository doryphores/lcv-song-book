import _ from 'lodash'

import { ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST } from '../actions'

const initialState = {}

export const playlists = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_TO_PLAYLIST:
      return Object.assign({}, state, {
        [payload.playlist]: _.union(state[payload.playlist], [payload.song])
      })
    case REMOVE_FROM_PLAYLIST:
      if (!state[payload.playlist]) return state

      let newPlaylist = _.without(state[payload.playlist], payload.song)

      if (_.isEmpty(newPlaylist)) {
        // Remove empty playlist
        return _.omit(state, payload.playlist)
      }

      return Object.assign({}, state, {
        [payload.playlist]: newPlaylist
      })
    default:
      return state
  }
}
