import { last } from 'lodash'

import { LOAD_RESOURCES } from '../../actions'

const initialState = []

export const songs = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_RESOURCES:
      return sortSongs(payload.resources.reduce((songs, r) => {
        let song = addSong(songs, r.title)
        let type = /pdf$/.test(r.url) ? 'sheets' : 'recordings'
        song[type][r.voice.toLowerCase()] = r.url.replace('http://', 'https://')
        return songs
      }, []))
    default:
      return state
  }
}

function addSong (songs, title) {
  title = ALIASES[title.toLowerCase()] || title
  let song = songs.find(s => s.title.toLowerCase() === title.toLowerCase())
  if (song) return song
  return songs.push({
    title: title,
    recordings: {},
    sheets: {}
  }) && last(songs)
}

function sortSongs (songs) {
  return songs.sort((a, b) => a.title.localeCompare(b.title))
}

const ALIASES = {
  'chirstmas in la': 'Christmas in LA',
  'if you don\'t know me': 'If you don\'t know me by now',
  'waking in a winter wonderland': 'Walking In A Winter Wonderland',
  'if you leave me know': 'if you leave me now'
}
