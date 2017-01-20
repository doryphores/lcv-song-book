export const RESTORE = 'RESTORE'

export const LOAD_RESOURCES = 'LOAD_RESOURCES'

export const SELECT_SONG = 'SELECT_SONG'
export const SELECT_VOICE = 'SELECT_VOICE'
export const SONG_SELECTED = 'SONG_SELECTED'

export const TOGGLE_PLAY = 'TOGGLE_PLAY'

export const PLAYER_LOADED = 'PLAYER_LOADED'
export const PLAYER_PLAYING = 'PLAYER_PLAYING'
export const PLAYER_PAUSED = 'PLAYER_PAUSED'
export const PLAYER_PROGRESS = 'PLAYER_PROGRESS'

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
          full: song.recordings['Full song']
        }
      }
    })
  }
}

function selectSheet (song, voice) {
  return song.sheets[voice] ||
    song.sheets[voice.replace(/ [12]/, '')] ||
    song.sheets['All parts']
}

function selectVoiceRecording (song, voice) {
  return song.recordings[voice] ||
    song.recordings[voice.replace(/ [12]/, '')]
}
