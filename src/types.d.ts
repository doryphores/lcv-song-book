declare module 'electron-devtools-installer'

declare module '*.png';
declare module '*.svg';
declare module '*.worker';

declare const api: typeof import("./api").default

type IPCResult = {
  value?: unknown
  error?: Error
}

type Credentials = {
  username: string
  password: string
}

type Song = {
  title: string
  url?: string
  thisTerm: boolean
  sheets: Record<string, string>
  recordings: Record<string, string>
}

type SongMarkers = Array<number>

type MarkerCollection = {
  readonly [key: string]: SongMarkers
}

type INotification = {
  icon: string
  message: string
  song?: string
  id?: number
}

type Selection = {
  song: string
  voice: string
}

type List = 'all' | 'term'

type ApplicationState = {
  selectedSong: string
  selectedVoice: string
  selectedList: List
  songs: Song[]
  markers: MarkerCollection
  notifications: SavedNotification[]
  settings: {
    username: string
    password: string
    lastResourceUpdate: number
  }
  ui: {
    sidebarVisible: boolean
    sidebarWidth: number
    settingsVisible: boolean
    shortcutsVisible: boolean
    hideScrollbars: boolean
  }
}
