import { createSelector } from 'reselect'

const currentSong = createSelector(
  (state: ApplicationState) => state.songs,
  (state: ApplicationState) => state.selectedSong,
  (songs, title) => {
    return songs.find((s) => s.title === title)
  }
)

export const isSongSelected = createSelector(
  currentSong,
  (song) => song !== undefined
)

export const songTitle = createSelector(
  currentSong,
  (song) => song && song.title
)

export const sheetMusicURL = createSelector(
  currentSong,
  (state: ApplicationState) => state.selectedVoice,
  (song, voice) => {
    if (song === undefined) return undefined

    const voiceKey = voice.toLowerCase()

    return song.sheets[voiceKey] ||
      song.sheets[voiceKey.replace(/ [12]/, '')] ||
      song.sheets[voiceKey.replace(/ 1/, ' 2')] ||
      song.sheets[voiceKey.replace(/ 2/, ' 1')] ||
      song.sheets['all parts']
  }
)

export const fullRecordingURL = createSelector(
  currentSong,
  (song) => song.recordings['full song']
)

export const voiceRecordingURL = createSelector(
  currentSong,
  (state: ApplicationState) => state.selectedVoice,
  (song, voice) => {
    if (song === undefined) return undefined

    const voiceKey = voice.toLowerCase()

    return song.recordings[voiceKey] ||
      song.recordings[voiceKey.replace(/ [12]/, '')] ||
      song.recordings[voiceKey.replace(/ [12]/, '') + ' 1 + 2']
  }
)

export const songMarkers = createSelector(
  currentSong,
  (state: ApplicationState) => state.markers,
  (song, markers) => {
    if (song === undefined) return []
    return markers[song.title] || []
  }
)

export const notifications = createSelector(
  (state: ApplicationState) => state.notifications,
  (notifications) => notifications
)
