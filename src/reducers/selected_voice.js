import { SELECT_VOICE } from '../actions'

export const selectedVoice = (state = '', { type, payload }) => {
  switch (type) {
    case SELECT_VOICE:
      return payload
    default:
      return state
  }
}
