import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { configureStore } from './store'
import { adapter, connect } from './player/adapter'
import App from './components/app'

export function start (container) {
  configureStore(adapter).then(store => {
    connect(store)
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      container
    )
  })
}
