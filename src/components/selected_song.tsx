import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { addMarker, removeMarker, AddMarkerAction, RemoveMarkerAction } from '../actions'
import { fullRecordingURL, sheetMusicURL, songMarkers, voiceRecordingURL } from '../selectors'
import Player from './player'
import Sheet from './sheet'

type SelectedSongProps = {
  className: string
  sheetMusicURL: string | undefined
  fullRecordingURL: string
  voiceRecordingURL: string
  songMarkers: SongMarkers
  onAddMarker: (position: number) => void
  onRemoveMarker: (position: number) => void
}

const SelectedSong: React.FC<SelectedSongProps> = ({
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

function mapDispatchToProps (dispatch: ThunkDispatch<ApplicationState, void, AddMarkerAction | RemoveMarkerAction>) {
  return {
    onAddMarker: (position: number) => dispatch(addMarker(position)),
    onRemoveMarker: (position: number) => dispatch(removeMarker(position))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSong)
