import { remote } from 'electron'
import { outputJsonSync, readJSON } from 'fs-extra'
import * as path from 'path'
import { createStore, combineReducers, applyMiddleware, Store } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
import { RESTORE } from '../actions'

const CACHE_PATH = path.join(
  remote.app.getPath('userData'),
  'store.json'
)

export function configureStore (): Promise<Store<ApplicationState>> {
  return new Promise((resolve, reject) => {
    readJSON(CACHE_PATH, (_, data) => {
      try {
        const rootReducer = combineReducers<ApplicationState>(reducers)
        const store = createStore(
          rootReducer,
          rootReducer(data, { type: RESTORE }),
          applyMiddleware(thunk)
        )

        window.addEventListener('beforeunload', () => {
          outputJsonSync(CACHE_PATH, store.getState())
        })

        resolve(store)
      } catch (err) {
        reject(err)
      }
    })
  })
}
