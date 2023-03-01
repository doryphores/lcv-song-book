import { SelectListAction, SELECT_LIST } from '../actions'

export const selectedList = (state: List = 'all', action: SelectListAction): List => {
  switch (action.type) {
    case SELECT_LIST:
      return action.payload
    default:
      return state
  }
}
