import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { loadSongs } from '../store/actions'

import ToolbarPanel from './toolbar_panel'

type UpdaterProps = {
  className: string
  progress: number
  onLoadSongs: () => Promise<void>
}

const Updater: React.FC<UpdaterProps> = ({
  className,
  progress,
  onLoadSongs,
}) => {
  const [started, setStarted] = useState(false)
  const start = useCallback(async () => {
    setStarted(true)
    await onLoadSongs()
    setStarted(false)
  }, [])

  return (
    <ToolbarPanel
      className={className}
      toggleIcon='refresh'
      onToggle={start}
      spinToggle={started}
    >
      {progress > 0 && <span style={{ verticalAlign: 'middle' }}>{Math.round(progress * 100)}%</span>}
    </ToolbarPanel>
  )
}

function mapStateToProps (state: ApplicationState) {
  return {
    progress: state.ui.scraperProgress,
  }
}

function mapDispatchToProps (dispatch: ThunkDispatch<ApplicationState, void, Action>) {
  return {
    onLoadSongs: async () => await dispatch(loadSongs()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Updater)
