import { SelectVoiceAction, SELECT_VOICE } from '../actions'

export const selectedVoice = (state = 'Tenor 1', action: SelectVoiceAction) => {
  switch (action.type) {
    case SELECT_VOICE:
      return action.payload
    default:
      return state
  }
}
