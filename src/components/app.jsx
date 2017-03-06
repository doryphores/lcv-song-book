import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Sidebar from './sidebar'
import Toolbar from './toolbar'
import SelectedSong from './selected_song'

const App = ({ hideScrollbars }) => (
  <div className={classnames('u-flex u-flex--full u-flex--horizontal', { 'u-hide-scrollbars': hideScrollbars })}>
    <Sidebar className='u-flex__panel' />
    <div className='u-flex__panel u-flex__panel--grow u-flex u-flex--vertical'>
      <Toolbar className='u-flex__panel' />
      <SelectedSong className='u-flex__panel u-flex__panel--grow' />
    </div>
  </div>
)

function mapStateToProps (state) {
  return {
    hideScrollbars: state.ui.hideScrollbars
  }
}

export default connect(mapStateToProps)(App)
