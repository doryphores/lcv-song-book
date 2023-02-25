declare module 'electron-devtools-installer'

declare module '*.png';
declare module '*.svg';
declare module '*.worker';

declare const api: typeof import("./api").default

type Credentials = {
  username: string
  password: string
}

type Song = {
  title: string
  url?: string
  sheets: Record<string, string>
  recordings: Record<string, string>
}

interface PlaylistCollection {
  readonly [key: string]: string[]
}

// Temporary: selectedPlaylist should move to Selection
interface PlaylistState {
  readonly selectedPlaylist: string
  readonly playlists: PlaylistCollection
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
  readonly playlist: keyof PlaylistCollection
}

interface ApplicationState {
  readonly selectedSong: string
  readonly selectedVoice: string
  readonly songs: Song[]
  readonly playlists: PlaylistState
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
