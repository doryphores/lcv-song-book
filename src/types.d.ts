interface Resource {
  readonly title: string
  readonly sheets: {
    [key: string]: string
  }
  readonly recordings: {
    [key: string]: string
  }
}

interface PlaylistCollection {
  readonly [key: string]: string[]
}

// Temporary: selectedPlaylist should move to Selection
interface PlaylistState {
  readonly selectedPlaylist: string
  readonly playlists: PlaylistCollection
}

interface SongMarkers extends Array<number> {}

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
  readonly songs: Resource[]
  readonly playlists: PlaylistState
  readonly markers: MarkerCollection
  readonly notifications: SavedNotification[]
  readonly settings: {
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
