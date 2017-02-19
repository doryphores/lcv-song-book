import { RESTORE, SONG_SELECTED } from '../actions'

const initialState = {
  title: '',
  sheet: '',
  recordings: {
    voice: '',
    full: ''
  }
}

export const selectedSong = (state = initialState, { type, payload }) => {
  switch (type) {
    case SONG_SELECTED:
      return payload
    case RESTORE:
      try {
        return Object.assign({}, initialState, state)
      } catch (e) {
        return Object.assign({}, initialState)
      }
    default:
      return state
  }
}
