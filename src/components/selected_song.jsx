import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Sheet from './sheet'
import Player from './player'
import { TOGGLE_PLAY } from '../actions'

const SelectedSong = ({ className, sheetMusicURL, recordingURL }) => (
  <div className={classnames(className, 'u-flex u-flex--vertical')}>
    <Sheet className='u-flex__panel u-flex__panel--grow'
      pdfURL={sheetMusicURL} />
    <Player className='u-flex__panel' recordingURL={recordingURL} />
  </div>
)

function mapStateToProps (state) {
  return {
    sheetMusicURL: state.selectedSong.sheet,
    recordingURL: state.selectedSong.recordings.voice,
    player: state.player
  }
}

function mapDispatchToProps (dispatch) {
  return {
    togglePlay: () => dispatch({ type: TOGGLE_PLAY })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSong)
