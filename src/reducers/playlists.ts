import { isEmpty, omitBy, union, without } from 'lodash'

import {
  SELECT_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST,
  RESTORE
} from '../actions'

const initialState: {
  selectedPlaylist: string,
  playlists: { [key: string]: string }
} = {
  selectedPlaylist: '',
  playlists: {}
}

function cleanup (state) {
  return {
    ...state,
    selectedPlaylist: state.playlists[state.selectedPlaylist] ? state.selectedPlaylist : '',
    playlists: omitBy(state.playlists, l => isEmpty(l))
  }
}

export const playlists = (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECT_PLAYLIST:
      return cleanup({
        ...state,
        selectedPlaylist: payload
      })
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [payload.playlist]: union(state.playlists[payload.playlist], [payload.song])
        }
      }
    case REMOVE_FROM_PLAYLIST:
      return cleanup({
        ...state,
        playlists: {
          ...state.playlists,
          [payload.playlist]: without(state.playlists[payload.playlist], payload.song)
        }
      })
    default:
      return state
  }
}
