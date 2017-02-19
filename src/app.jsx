import { ipcRenderer } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { configureStore } from './store'
import { TOGGLE_SETTINGS } from './actions'
import Toolbar from './components/toolbar'
import Sidebar from './components/sidebar'
import SelectedSong from './components/selected_song'

export function start (container) {
  configureStore().then(store => {
    ReactDOM.render(
      <Provider store={store}>
        <div className='u-flex u-flex--full u-flex--horizontal'>
          <Sidebar className='u-flex__panel' />
          <div className='u-flex__panel u-flex__panel--grow u-flex u-flex--vertical'>
            <Toolbar className='u-flex__panel' />
            <SelectedSong className='u-flex__panel u-flex__panel--grow' />
          </div>
        </div>
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
