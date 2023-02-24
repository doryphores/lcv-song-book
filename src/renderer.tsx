import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { configureStore } from './store'
import { TOGGLE_SETTINGS } from './actions'
import App from './components/app'

import './scss/app.scss'

configureStore().then(store => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  )

  store.subscribe(() => setTitle(store.getState()))
  setTitle(store.getState())

  if (store.getState().settings.password === '' || store.getState().settings.username === '') {
    store.dispatch({ type: TOGGLE_SETTINGS })
  }
}).catch(err => console.error(err))

async function setTitle ({ selectedSong, selectedVoice }: ApplicationState) {
  let title = await api.getAppName()
  if (selectedVoice) title = `${selectedVoice} — ${title}`
  if (selectedSong) title = `${selectedSong} — ${title}`
  document.title = title
}
