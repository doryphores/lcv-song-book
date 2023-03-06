import { concat, difference, differenceWith, isEmpty, isEqual } from 'lodash'
import { Dispatch, Action as ReduxAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface Action<T, P> extends ReduxAction<T> {
  readonly type: T
  readonly payload: P
}

function createAction<T extends string, P> (type: T, payload: P): Action<T, P> {
  return { type, payload }
}

// =============================================================================

export const RESTORE = 'RESTORE'
export type RestoreAction = Action<typeof RESTORE, null>

export function restore (): RestoreAction {
  return createAction(RESTORE, null)
}

// =============================================================================

export const RESIZE_SIDEBAR = 'RESIZE_SIDEBAR'
export type ResizeSidebarAction = Action<typeof RESIZE_SIDEBAR, number>

export function resizeSidebar (width: number): ResizeSidebarAction {
  return createAction(RESIZE_SIDEBAR, width)
}

// =============================================================================

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export type ToggleSidebarAction = Action<typeof TOGGLE_SIDEBAR, null>

export function toggleSidebar (): ToggleSidebarAction {
  return createAction(TOGGLE_SIDEBAR, null)
}

// =============================================================================

export const TOGGLE_SETTINGS = 'TOGGLE_SETTINGS'
export type ToggleSettingsAction = Action<typeof TOGGLE_SETTINGS, null>

export function toggleSettings (): ToggleSettingsAction {
  return createAction(TOGGLE_SETTINGS, null)
}

// =============================================================================

export const TOGGLE_SHORTCUTS = 'TOGGLE_SHORTCUTS'
export type ToggleShortcutsAction = Action<typeof TOGGLE_SHORTCUTS, null>

export function toggleShortcuts (): ToggleShortcutsAction {
  return createAction(TOGGLE_SHORTCUTS, null)
}

// =============================================================================

export const SAVE_SETTINGS = 'SAVE_SETTINGS'
export type SaveSettingsAction = Action<typeof SAVE_SETTINGS, { username: string, password: string, hideScrollbars: boolean }>

export function saveSettings (username: string, password: string, hideScrollbars: boolean): SaveSettingsAction {
  return createAction(SAVE_SETTINGS, { username, password, hideScrollbars })
}


// =============================================================================

export const UPDATE_SCRAPER_PROGRESS = 'UPDATE_SCRAPER_PROGRESS'
export type UpdateScraperProgressAction = Action<typeof UPDATE_SCRAPER_PROGRESS, number>

export function updateScraperProgress (progress: number): UpdateScraperProgressAction {
  return createAction(UPDATE_SCRAPER_PROGRESS, progress)
}

// =============================================================================

export const LOAD_SONGS = 'LOAD_SONGS'
export type LoadResourcesAction = Action<typeof LOAD_SONGS, { songs: Song[], timestamp: number }>

export function loadSongs () {
  return async function (dispatch: Dispatch, getState: () => ApplicationState): Promise<void> {
    const stateBefore = getState()

    dispatch(dismissAll())

    let songs: Song[]

    try {
      songs = await api.scrape({
        username: getState().settings.username,
        password: getState().settings.password,
      }, (progress) => {
        if (progress.total > 0) dispatch(updateScraperProgress(progress.collected / progress.total))
      })
    } catch (error) {
      dispatch(alert(error.message))
      return
    } finally {
      dispatch(updateScraperProgress(0))
    }

    dispatch(createAction(LOAD_SONGS, {
      timestamp: Date.now(),
      songs,
    }))

    const newSongs = difference(getState().songs.map(s => s.title), stateBefore.songs.map(s => s.title))
    let updatedSongs = differenceWith(getState().songs, stateBefore.songs, (a, b) => isEqual(a, b)).map(s => s.title)
    updatedSongs = difference(updatedSongs, newSongs)

    if (isEmpty(newSongs) && isEmpty(updatedSongs)) {
      dispatch(info('No new songs or recordings'))
      return
    }

    if (newSongs.length + updatedSongs.length > 5) {
      dispatch(success(`Found ${newSongs.length} new songs and ${updatedSongs.length} changed songs`))
      return
    }

    const notifications: INotification[] = concat(
      newSongs.map(s => ({
        message: 'New song:',
        icon: 'audiotrack',
        song: s,
      })),
      updatedSongs.map(s => ({
        message: 'Changed song',
        icon: 'audiotrack',
        song: s,
      })),
    )

    dispatch(notify(notifications))
  }
}

// =============================================================================

export const NOTIFY = 'NOTIFY'
export type NotifyAction = Action<typeof NOTIFY, INotification[]>

export function notify (notifications: INotification[]): NotifyAction {
  return createAction(NOTIFY, notifications)
}

export function info (message: string) {
  return notify([{
    message,
    icon: 'info',
  }])
}

export function alert (message: string) {
  return notify([{
    message,
    icon: 'error',
  }])
}

export function success (message: string) {
  return notify([{
    message,
    icon: 'check',
  }])
}

// =============================================================================

export const DISMISS = 'DISMISS'
export type DismissAction = Action<typeof DISMISS, number>

export function dismiss (notificationId: number): DismissAction {
  return createAction(DISMISS, notificationId)
}

// =============================================================================

export const DISMISS_ALL = 'DISMISS_ALL'
export type DismissAllAction = Action<typeof DISMISS_ALL, null>

export function dismissAll (): DismissAllAction {
  return createAction(DISMISS_ALL, null)
}

// =============================================================================

export const SELECT_VOICE = 'SELECT_VOICE'
export type SelectVoiceAction = Action<typeof SELECT_VOICE, string>

export function selectVoice (voice: string): SelectVoiceAction {
  return createAction(SELECT_VOICE, voice)
}

// =============================================================================

export const SELECT_SONG = 'SELECT_SONG'
export type SelectSongAction = Action<typeof SELECT_SONG, string>

export function selectSong (title: string): SelectSongAction {
  return createAction(SELECT_SONG, title)
}

// =============================================================================

export const SELECT_LIST = 'SELECT_LIST'
export type SelectListAction = Action<typeof SELECT_LIST, List>

export function selectList (list: List): SelectListAction {
  return createAction(SELECT_LIST, list)
}

// =============================================================================

export const ADD_MARKER = 'ADD_MARKER'
export type AddMarkerAction = Action<typeof ADD_MARKER, { song: string, position: number }>

export function addMarker (position: number): ThunkAction<void, ApplicationState, void, AddMarkerAction> {
  return function (dispatch, getState) {
    dispatch(createAction(ADD_MARKER, {
      song: getState().selectedSong,
      position,
    }))
  }
}

// =============================================================================

export const REMOVE_MARKER = 'REMOVE_MARKER'
export type RemoveMarkerAction = Action<typeof REMOVE_MARKER, { song: string, position: number }>

export function removeMarker (position: number): ThunkAction<void, ApplicationState, void, RemoveMarkerAction> {
  return function (dispatch, getState) {
    dispatch(createAction(REMOVE_MARKER, {
      song: getState().selectedSong,
      position,
    }))
  }
}
