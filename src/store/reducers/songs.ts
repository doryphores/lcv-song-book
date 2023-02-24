import { LOAD_RESOURCES, LoadResourcesAction } from '../../actions'

const ALIASES: { [key: string]: string } = {
  '80s dance medley': "80's Dance Medley",
  '80s pop medley': "80's Pop Medley",
  'chirstmas in la': 'Christmas in LA',
  'if you don\'t know me': 'If you don\'t know me by now',
  'waking in a winter wonderland': 'Walking In A Winter Wonderland',
  'if you leave me know': 'if you leave me now'
}

const initialState: Resource[] = []

function formatTitle (title: string) {
  return ALIASES[title.toLowerCase()] || title
}

function addSong (songs: Resource[], title: string): Resource {
  const formattedTitle = formatTitle(title)
  const keyTitle = formattedTitle.toLowerCase()
  let song = songs.find(s => s.title.toLowerCase() === keyTitle)
  if (song) return song
  song = {
    title: formattedTitle,
    recordings: {},
    sheets: {}
  }
  songs.push(song)
  return song
}

function sortSongs (songs: Resource[]) {
  return songs.sort((a, b) => a.title.localeCompare(b.title))
}

export const songs = (state = initialState, { type, payload }: LoadResourcesAction) => {
  switch (type) {
    case LOAD_RESOURCES:
      return sortSongs(payload.resources.reduce((songs, r) => {
        const song = addSong(songs, r.title)
        const type: keyof Resource = /pdf$/.test(r.url) ? 'sheets' : 'recordings'
        song[type][r.voice.toLowerCase()] = r.url.replace('http://', 'https://')
        return songs
      }, []))
    default:
      return state
  }
}
