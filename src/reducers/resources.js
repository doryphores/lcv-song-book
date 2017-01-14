import { RESTORE, LOAD_RESOURCES } from '../actions'

let initialState = []

export const resources = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_RESOURCES:
      var songs = payload.reduce((songs, r) => {
        let title = ALIASES[r.title.toLowerCase()] || r.title
        let index = songs.findIndex(s => s.title.toLowerCase() === title.toLowerCase())
        let voices = {}
        if (index > -1) {
          voices = songs[index].voices
        } else {
          songs.push({
            title: title,
            voices: voices
          })
        }
        voices[r.voice] = Object.assign({}, voices[r.voice], {
          [/pdf$/.test(r.url) ? 'sheet' : 'recording']: r.url
        })
        return songs
      }, [])
      return sortSongs(songs)
    default:
      return state
  }
}

const ALIASES = {
  'chirstmas in la': 'Christmas in LA',
  'if you don\'t know me': 'If you don\'t know me by now',
  'waking in a winter wonderland': 'Walking In A Winter Wonderland'
}

function sortSongs(songs) {
  return songs.sort((a, b) => a.title.localeCompare(b.title))
}
