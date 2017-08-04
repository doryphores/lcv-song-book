import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Sheet from './sheet'
import Player from './player'
import { TOGGLE_PLAY } from '../actions'

const SelectedSong = ({ className, sheetMusicURL, fullRecordingURL, voiceRecordingURL }) => (
  <div className={classnames(className, 'u-flex u-flex--vertical')}>
    {sheetMusicURL
      ? <Sheet className='u-flex__panel u-flex__panel--grow'
        pdfURL={sheetMusicURL} />
      : <span className='sheet sheet--empty u-flex__panel--grow u-flex u-flex--center u-flex--vertical-center'>
        Missing sheet music
      </span>
    }
    <Player className='u-flex__panel'
      fullRecordingURL={fullRecordingURL}
      voiceRecordingURL={voiceRecordingURL} />
  </div>
)

function mapStateToProps (state) {
  return {
    sheetMusicURL: state.selectedSong.sheet,
    fullRecordingURL: state.selectedSong.recordings.full,
    voiceRecordingURL: state.selectedSong.recordings.voice
  }
}

function mapDispatchToProps (dispatch) {
  return {
    togglePlay: () => dispatch({ type: TOGGLE_PLAY })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSong)
