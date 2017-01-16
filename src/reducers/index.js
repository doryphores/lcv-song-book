import { SELECT_SONG, SELECT_VOICE } from '../actions'

export { songs } from './songs'

export const selectedSong = (state = '', { type, payload }) => {
  switch (type) {
    case SELECT_SONG:
      return payload
    default:
      return state
  }
}

export const selectedVoice = (state = '', { type, payload }) => {
  switch (type) {
    case SELECT_VOICE:
      return payload
    default:
      return state
  }
}
