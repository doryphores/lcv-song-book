import { isEmpty, omitBy, union, without } from 'lodash'

import {
  SELECT_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST,
  RESTORE
} from '../../actions'

const initialState: {
  selectedPlaylist: string,
  playlists: { [key: string]: string }
} = {
  selectedPlaylist: '',
  playlists: {}
}

function cleanup (state) {
  const playlists = omitBy(state.playlists, l => isEmpty(l))
  let selectedPlaylist = state.selectedPlaylist

  if (!playlists[selectedPlaylist]) selectedPlaylist = ''

  return {
    ...state,
    selectedPlaylist,
    playlists
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
      return cleanup({
        ...state,
        playlists: {
          ...state.playlists,
          [payload.playlist]: union(state.playlists[payload.playlist], [payload.song])
        }
      })
    case REMOVE_FROM_PLAYLIST:
      return cleanup({
        ...state,
        playlists: {
          ...state.playlists,
          [payload.playlist]: without(state.playlists[payload.playlist], payload.song)
        }
      })
    case RESTORE:
      return cleanup(state)
    default:
      return state
  }
}
