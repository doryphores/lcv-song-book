import { SelectSongAction, SELECT_SONG } from '../../actions'

export const selectedSong = (state = '', action: SelectSongAction) => {
  switch (action.type) {
    case SELECT_SONG:
      return action.payload
    default:
      return state
  }
}
