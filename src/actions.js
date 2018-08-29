import _ from 'lodash'

export const RESTORE = 'RESTORE'

export const RESIZE_SIDEBAR = 'RESIZE_SIDEBAR'
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS'
export const TOGGLE_SHORTCUTS = 'TOGGLE_SHORTCUTS'

export const SAVE_SETTINGS = 'SAVE_SETTINGS'

export const LOAD_RESOURCES = 'LOAD_RESOURCES'

export const NOTIFY = 'NOTIFY'
export const DISMISS = 'DISMISS'
export const DISMISS_AND_NOTIFY = 'DISMISS_AND_NOTIFY'
export const DISMISS_ALL = 'DISMISS_ALL'

export const SELECT_VOICE = 'SELECT_VOICE'
export const SELECT_SONG = 'SELECT_SONG'

export const SELECT_PLAYLIST = 'SELECT_PLAYLIST'
export const ADD_TO_PLAYLIST = 'ADD_TO_PLAYLIST'
export const REMOVE_FROM_PLAYLIST = 'REMOVE_FROM_PLAYLIST'

export const TOGGLE_PLAY = 'TOGGLE_PLAY'

export const PLAYER_LOADED = 'PLAYER_LOADED'
export const PLAYER_PLAYING = 'PLAYER_PLAYING'
export const PLAYER_PAUSED = 'PLAYER_PAUSED'
export const PLAYER_PROGRESS = 'PLAYER_PROGRESS'

export const ADD_MARKER = 'ADD_MARKER'
export const REMOVE_MARKER = 'REMOVE_MARKER'

export function notify (notification) {
  return {
    type: NOTIFY,
    payload: notification
  }
}

export function alert (message) {
  return {
    type: NOTIFY,
    payload: {
      message,
      icon: 'error'
    }
  }
}

export function success (message) {
  return {
    type: NOTIFY,
    payload: {
      message,
      icon: 'check'
    }
  }
}

export function dismiss (notification) {
  return {
    type: DISMISS,
    payload: notification
  }
}

export function loadResources (resources) {
  return function (dispatch, getState) {
    let songsBefore = getState().songs.map(s => s.title)
    let recordingsBefore = gatherRecordings(getState().songs)

    dispatch({
      type: LOAD_RESOURCES,
      payload: {
        timestamp: Date.now(),
        resources
      }
    })

    let newSongs = _.difference(getState().songs.map(s => s.title), songsBefore)
    let newRecordings = _.difference(gatherRecordings(getState().songs), recordingsBefore)

    if (_.isEmpty(newSongs) && _.isEmpty(newRecordings)) {
      dispatch(notify('No new songs or recordings'))
      return
    }

    if (_.isEmpty(songsBefore)) {
      dispatch(success(`Found ${newSongs.length} songs and ${newRecordings.length} recordings`))
      return
    }

    dispatch(notify(_.concat(
      newSongs.map(s => {
        return {
          message: 'New song:',
          icon: 'audiotrack',
          song: s
        }
      }),
      newRecordings.map(s => {
        return {
          message: 'New recording for',
          icon: 'voicemail',
          song: s
        }
      })
    )))
  }
}

export function selectVoice (voice) {
  return {
    type: SELECT_VOICE,
    payload: voice
  }
}

export function selectSong (title) {
  return {
    type: SELECT_SONG,
    payload: title
  }
}

export function addMarker (position) {
  return function (dispatch, getState) {
    dispatch({
      type: ADD_MARKER,
      payload: {
        song: getState().selectedSong,
        position: position
      }
    })
  }
}

export function removeMarker (position) {
  return function (dispatch, getState) {
    dispatch({
      type: REMOVE_MARKER,
      payload: {
        song: getState().selectedSong,
        position: position
      }
    })
  }
}

function gatherRecordings (songs) {
  return _.compact(songs.map(s => !_.isEmpty(s.recordings) && s.title))
}
