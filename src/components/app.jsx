import React from 'react'

import Toolbar from './toolbar'
import Sidebar from './sidebar'
import Sheet from './sheet'

const App = () => (
  <div className='u-flex u-flex--full u-flex--vertical'>
    <Toolbar className='u-flex__panel' />
    <div className='u-flex__panel u-flex__panel--grow u-flex u-flex--full u-flex--horizontal'>
      <Sidebar className='u-flex__panel' />
      <Sheet className='u-flex__panel u-flex__panel--grow' />
    </div>
  </div>
)

export default App
