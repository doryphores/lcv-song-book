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
  readonly selectedPlaylist: keyof PlaylistCollection
  readonly playlists: PlaylistCollection
}

interface SongMarkers extends Array<number> {}

interface MarkerCollection {
  readonly [key: string]: SongMarkers
}

interface Notification {
  readonly id: number
  readonly icon: string
  readonly message: string
  readonly song?: string
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
  readonly notifications: Notification[]
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
