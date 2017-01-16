import { SELECT_SONG } from '../actions'

export { songs } from './songs'

export const selectedSong = (state = '', { type, payload }) => {
  switch (type) {
    case SELECT_SONG:
      return payload
    default:
      return state
  }
}
