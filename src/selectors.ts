import { createSelector } from 'reselect'

interface IState {
  readonly songs: ISong[]
  readonly selectedSong: string
  readonly selectedVoice: string
}

interface ISong {
  readonly title: string
  readonly sheets: { [key: string]: string }
  readonly recordings: { [key: string]: string }
}

const currentSong = createSelector(
  (state: IState) => state.songs,
  (state: IState) => state.selectedSong,
  (songs, title) => {
    return songs.find((s: ISong) => s.title === title)
  }
)

export const songIsSelected = createSelector(
  currentSong,
  (song) => song !== undefined
)

export const songTitle = createSelector(
  currentSong,
  (song) => song && song.title
)

export const sheetMusicURL = createSelector(
  currentSong,
  (state: IState) => state.selectedVoice,
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
  (state: IState) => state.selectedVoice,
  (song, voice) => {
    if (song === undefined) return undefined

    const voiceKey = voice.toLowerCase()

    return song.recordings[voiceKey] ||
      song.recordings[voiceKey.replace(/ [12]/, '')] ||
      song.recordings[voiceKey.replace(/ [12]/, '') + ' 1 + 2']
  }
)
