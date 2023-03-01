import { LOAD_SONGS, LoadResourcesAction } from '../actions'

const initialState: Song[] = []

export const songs = (state = initialState, { type, payload }: LoadResourcesAction) => {
  switch (type) {
    case LOAD_SONGS:
      return payload.songs
    default:
      return state
  }
}
