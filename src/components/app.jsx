import React from 'react'

// import Scraper from './scraper'
import SongList from './song_list'
import Sheet from './sheet'

const App = () => (
  <div className='u-flex u-flex--full u-flex--horizontal'>
    <SongList className='u-flex__panel' />
    <Sheet className='u-flex__panel--grow' />
  </div>
)

export default App
