import React from 'react'

import Scraper from './scraper'
import Sidebar from './sidebar'
import Sheet from './sheet'

const App = () => (
  <div className='u-flex u-flex--full u-flex--horizontal'>
    {/* <Scraper /> */}
    <Sidebar className='u-flex__panel' />
    <Sheet className='u-flex__panel--grow' />
  </div>
)

export default App
