import { RESTORE, SELECT_SONG } from '../actions'

const initialState = ''

export const selectedSong = (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECT_SONG:
      return payload
    case RESTORE:
      return (typeof state === 'string') ? state : initialState
    default:
      return state
  }
}
