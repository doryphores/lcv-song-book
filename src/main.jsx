import { ipcRenderer } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { configureStore } from './store'
import { TOGGLE_SETTINGS } from './actions'
import App from './components/app'

export function start (container) {
  configureStore().then(store => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      container
    )

    if (store.getState().settings.password === '') {
      store.dispatch({ type: TOGGLE_SETTINGS })
    }

    ipcRenderer.on('dispatch-action', (e, actionType) => {
      store.dispatch({ type: actionType })
    })
  })
}
