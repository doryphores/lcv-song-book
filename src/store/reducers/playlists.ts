import { isEmpty, omitBy, union, without } from 'lodash'

import {
  RESTORE, SELECT_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST,
  RestoreAction, SelectPlaylistAction, AddToPlaylistAction, RemoveFromPlaylistAction
} from '../../actions'

type Actions = RestoreAction
  | SelectPlaylistAction
  | AddToPlaylistAction
  | RemoveFromPlaylistAction

const initialState: PlaylistState = {
  selectedPlaylist: '',
  playlists: {}
}

function cleanup (state: PlaylistState) {
  const playlists = omitBy(state.playlists, l => isEmpty(l))
  let selectedPlaylist = state.selectedPlaylist

  if (!playlists[selectedPlaylist]) selectedPlaylist = ''

  return {
    ...state,
    selectedPlaylist,
    playlists
  }
}

export const playlists = (state = initialState, action: Actions) => {
  switch (action.type) {
    case SELECT_PLAYLIST:
      return cleanup({
        ...state,
        selectedPlaylist: action.payload
      })
    case ADD_TO_PLAYLIST:
      return cleanup({
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload.list]: union(
            state.playlists[action.payload.list],
            [action.payload.song]
          )
        }
      })
    case REMOVE_FROM_PLAYLIST:
      return cleanup({
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload.list]: without(
            state.playlists[action.payload.list],
            action.payload.song
          )
        }
      })
    case RESTORE:
      return cleanup(state)
    default:
      return state
  }
}
