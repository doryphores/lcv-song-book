export const RESTORE = 'RESTORE'

export const RESIZE_SIDEBAR = 'RESIZE_SIDEBAR'
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS'

export const SAVE_SETTINGS = 'SAVE_SETTINGS'

export const LOAD_RESOURCES = 'LOAD_RESOURCES'

export const SELECT_VOICE = 'SELECT_VOICE'
export const SONG_SELECTED = 'SONG_SELECTED'

export const TOGGLE_PLAY = 'TOGGLE_PLAY'

export const PLAYER_LOADED = 'PLAYER_LOADED'
export const PLAYER_PLAYING = 'PLAYER_PLAYING'
export const PLAYER_PAUSED = 'PLAYER_PAUSED'
export const PLAYER_PROGRESS = 'PLAYER_PROGRESS'

export function loadResources (resources) {
  return function (dispatch, getState) {
    dispatch({
      type: LOAD_RESOURCES,
      payload: {
        timestamp: Date.now(),
        resources
      }
    })
    let selectedSongTitle = getState().selectedSong.title
    if (selectedSongTitle) dispatch(selectSong(selectedSongTitle))
  }
}

export function selectVoice (voice) {
  return function (dispatch, getState) {
    dispatch({
      type: SELECT_VOICE,
      payload: voice
    })
    let songTitle = getState().selectedSong.title
    if (songTitle) dispatch(selectSong(songTitle))
  }
}

export function selectSong (title) {
  return function (dispatch, getState) {
    let song = getState().songs.find(s => s.title === title)
    if (!song) throw new Error(`Song ${title} is unknown`)
    let voice = getState().selectedVoice

    dispatch({
      type: SONG_SELECTED,
      payload: {
        title: title,
        sheet: selectSheet(song, voice),
        recordings: {
          voice: selectVoiceRecording(song, voice),
          full: song.recordings['full song']
        }
      }
    })
  }
}

function selectSheet (song, voice) {
  voice = voice.toLowerCase()
  return song.sheets[voice] ||
    song.sheets[voice.replace(/ [12]/, '')] ||
    song.sheets[voice.replace(/ 1/, ' 2')] ||
    song.sheets[voice.replace(/ 2/, ' 1')] ||
    song.sheets['all parts']
}

function selectVoiceRecording (song, voice) {
  voice = voice.toLowerCase()
  return song.recordings[voice] ||
    song.recordings[voice.replace(/ [12]/, '')] ||
    song.recordings[voice.replace(/ [12]/, '') + ' 1 + 2']
}
