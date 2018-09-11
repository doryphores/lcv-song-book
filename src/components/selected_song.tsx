import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { addMarker, removeMarker, TOGGLE_PLAY } from '../actions'
import { fullRecordingURL, sheetMusicURL, songMarkers, voiceRecordingURL } from '../selectors'
import Player from './player'
import Sheet from './sheet'

interface SelectedSongProps {
  readonly className: string
  readonly sheetMusicURL: string | undefined
  readonly fullRecordingURL: string
  readonly voiceRecordingURL: string
  readonly songMarkers: SongMarkers
  readonly onAddMarker: (position: number) => void
  readonly onRemoveMarker: (position: number) => void
}

const SelectedSong: React.SFC<SelectedSongProps> = ({
  className,
  sheetMusicURL,
  fullRecordingURL,
  voiceRecordingURL,
  songMarkers,
  onAddMarker,
  onRemoveMarker
}) => (
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
      onAddMarker={onAddMarker}
      onRemoveMarker={onRemoveMarker} />
  </div>
)

function mapStateToProps (state: ApplicationState) {
  return {
    sheetMusicURL: sheetMusicURL(state),
    fullRecordingURL: fullRecordingURL(state),
    voiceRecordingURL: voiceRecordingURL(state),
    songMarkers: songMarkers(state)
  }
}

function mapDispatchToProps (dispatch: ThunkDispatch<ApplicationState, void, Action>) {
  return {
    onTogglePlay: () => dispatch({ type: TOGGLE_PLAY }),
    onAddMarker: (position: number) => dispatch(addMarker(position)),
    onRemoveMarker: (position: number) => dispatch(removeMarker(position))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSong)
