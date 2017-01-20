import {
  PLAYER_LOADED, PLAYER_PLAYING, PLAYER_PAUSED,
  PLAYER_PROGRESS, SONG_SELECTED, RESTORE
} from '../actions'

const initialState = {
  src: '',
  duration: 0,
  progress: 0,
  loading: false,
  playing: false,
  paused: false
}

export const player = (state = initialState, { type, payload }) => {
  switch (type) {
    case SONG_SELECTED:
      return Object.assign({}, initialState, {
        src: payload.recordings.voice
      })
    case PLAYER_LOADED:
      return Object.assign({}, state, {
        duration: payload,
        progress: 0,
        loading: true,
        playing: false,
        paused: false
      })
    case PLAYER_PLAYING:
      return Object.assign({}, state, {
        loading: false,
        playing: true,
        paused: false
      })
    case PLAYER_PAUSED:
      return Object.assign({}, state, {
        loading: false,
        playing: false,
        paused: true
      })
    case PLAYER_PROGRESS:
      return Object.assign({}, state, {
        progress: payload
      })
    case RESTORE:
      return Object.assign({}, initialState, payload, {
        progress: 0,
        loading: false,
        playing: false,
        paused: false
      })
    default:
      return state
  }
}
