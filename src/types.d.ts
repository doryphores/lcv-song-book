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

interface MarkerCollection {
  readonly [key: string]: SongMarkers
}

interface INotification {
  readonly icon: string
  readonly message: string
  readonly song?: string
}

interface SavedNotification extends INotification {
  readonly id: number
}

interface Selection {
  readonly song: string
  readonly voice: string
}

type List = 'all' | 'term'

interface ApplicationState {
  readonly selectedSong: string
  readonly selectedVoice: string
  readonly selectedList: List
  readonly songs: Song[]
  readonly markers: MarkerCollection
  readonly notifications: SavedNotification[]
  readonly settings: {
    readonly username: string
    readonly password: string
    readonly lastResourceUpdate: number
  }
  readonly ui: {
    readonly sidebarVisible: boolean
    readonly sidebarWidth: number
    readonly settingsVisible: boolean
    readonly shortcutsVisible: boolean
    readonly hideScrollbars: boolean
  }
}
