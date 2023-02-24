import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
import { RESTORE } from '../actions'

export async function configureStore () {
  const data = await api.readStore()
  const rootReducer = combineReducers<ApplicationState>(reducers)
  const store = createStore(
    rootReducer,
    rootReducer(data, { type: RESTORE }),
    applyMiddleware(thunk)
  )

  api.onActionDispatch((actionType) => store.dispatch({ type: actionType }))

  window.addEventListener('beforeunload', () => {
    api.writeStore(store.getState())
  })

  return store
}
