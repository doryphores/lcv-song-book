import { LOAD_RESOURCES } from '../actions'

const initialState = []

export const songs = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_RESOURCES:
      return sortSongs(payload.reduce((songs, r) => {
        let song = addSong(songs, r.title)
        let type = /pdf$/.test(r.url) ? 'sheets' : 'recordings'
        song[type][r.voice.toLowerCase()] = r.url
        return songs
      }, []))
    default:
      return state
  }
}

function addSong (songs, title) {
  title = ALIASES[title.toLowerCase()] || title
  let idx = songs.findIndex(s => s.title.toLowerCase() === title.toLowerCase())
  if (idx === -1) {
    songs.push({
      title: title,
      recordings: {},
      sheets: {}
    })
    idx = songs.length - 1
  }
  return songs[idx]
}

function sortSongs (songs) {
  return songs.sort((a, b) => a.title.localeCompare(b.title))
}

const ALIASES = {
  'chirstmas in la': 'Christmas in LA',
  'if you don\'t know me': 'If you don\'t know me by now',
  'waking in a winter wonderland': 'Walking In A Winter Wonderland'
}
