import React from 'react'

import Toolbar from './toolbar'
import Sidebar from './sidebar'
import SelectedSong from './selected_song'

const App = () => (
  <div className='u-flex u-flex--full u-flex--vertical'>
    <Toolbar className='u-flex__panel' />
    <div className='u-flex__panel u-flex__panel--grow u-flex u-flex--full u-flex--horizontal'>
      <Sidebar className='u-flex__panel' />
      <SelectedSong className='u-flex__panel u-flex__panel--grow' />
    </div>
  </div>
)

export default App
