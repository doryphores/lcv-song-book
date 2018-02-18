import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Sheet from './sheet'
import Player from './player'
import { TOGGLE_PLAY, addMarker, removeMarker } from '../actions'

const SelectedSong = ({ className, sheetMusicURL, fullRecordingURL, voiceRecordingURL, songMarkers, addMarker, removeMarker }) => (
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
      voiceRecordingURL={voiceRecordingURL}
      markers={songMarkers}
      onAddMarker={addMarker}
      onRemoveMarker={removeMarker} />
  </div>
)

function mapStateToProps (state) {
  return {
    sheetMusicURL: state.selectedSong.sheet,
    fullRecordingURL: state.selectedSong.recordings.full,
    voiceRecordingURL: state.selectedSong.recordings.voice,
    songMarkers: state.markers[state.selectedSong.title] || []
  }
}

function mapDispatchToProps (dispatch) {
  return {
    togglePlay: () => dispatch({ type: TOGGLE_PLAY }),
    addMarker: (position) => dispatch(addMarker(position)),
    removeMarker: (position) => dispatch(removeMarker(position))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSong)
