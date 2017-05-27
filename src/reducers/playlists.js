import { ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST } from '../actions'

const initialState = {
  'Spring 2017': [],
  'Summer 2017': []
}

export const playlists = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_TO_PLAYLIST:
      return Object.assign({}, state, {
        [payload.playlist]: addToPlaylist(state[payload.playlist], payload.song)
      })
    case REMOVE_FROM_PLAYLIST:
      if (!state[payload.playlist]) return state
      return Object.assign({}, state, {
        [payload.playlist]: removeFromPlaylist(state[payload.playlist], payload.song)
      })
    default:
      return state
  }
}

function addToPlaylist (playlist, song) {
  return (playlist || []).concat(song).filter((s, i, l) => l.indexOf(s) === i)
}

function removeFromPlaylist (playlist, song) {
  return (playlist || []).filter(s => s !== song)
}
