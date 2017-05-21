import { remote } from 'electron'
import { outputJsonSync, readJSON } from 'fs-extra'
import path from 'path'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
import { RESTORE } from './actions'

const CACHE_PATH = path.join(
  remote.app.getPath('userData'),
  'store.json'
)

export function configureStore (...middleware) {
  return new Promise((resolve, reject) => {
    readJSON(CACHE_PATH, (_, data) => {
      try {
        let reducer = combineReducers(reducers)
        let store = createStore(
          reducer,
          reducer(data, { type: RESTORE }),
          applyMiddleware(...middleware, thunk)
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
