import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { configureStore } from './store'
import { TOGGLE_SETTINGS } from './store/actions'
import App from './components/app'

import './scss/app.scss'

configureStore().then(store => {
  const root = createRoot(document.getElementById('app'))
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
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
