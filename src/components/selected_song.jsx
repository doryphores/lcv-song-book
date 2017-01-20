import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Sheet from './sheet'
import Player from './player'
import { TOGGLE_PLAY } from '../actions'

const SelectedSong = ({ className, sheetMusicURL, player, togglePlay }) => (
  <div className={classnames(className, 'u-flex u-flex--vertical')}>
    <Sheet className='u-flex__panel u-flex__panel--grow'
      pdfURL={sheetMusicURL} />
    <Player className='u-flex__panel' {...player} togglePlay={togglePlay} />
  </div>
)

function mapStateToProps (state) {
  return {
    sheetMusicURL: state.selectedSong.sheet,
    player: state.player
  }
}

function mapDispatchToProps (dispatch) {
  return {
    togglePlay: () => dispatch({ type: TOGGLE_PLAY })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSong)
