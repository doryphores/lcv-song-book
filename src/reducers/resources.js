import { RESTORE, LOAD_RESOURCES } from '../actions'

let initialState = []

export const resources = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_RESOURCES:
      var songs = payload.reduce((songs, r) => {
        var index = songs.findIndex(s => s.title.toLowerCase() === r.title.toLowerCase())
        if (index > -1) {
          songs[index] = { title: r.title }
        } else {
          songs.push({ title: r.title })
        }
        return songs
      }, [])
      return songs.sort((a, b) => a.title.localeCompare(b.title))
    case RESTORE:
      return state.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return state
  }
}
