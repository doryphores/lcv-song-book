import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { loadSongs } from '../actions'

import ToolbarPanel from './toolbar_panel'

type UpdaterProps = {
  className: string
  onLoadSongs: () => Promise<void>
}

const Updater: React.FC<UpdaterProps> = ({
  className,
  onLoadSongs
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
    />
  )
}

function mapStateToProps (state: ApplicationState) {
  return {
    lastUpdate: state.settings.lastResourceUpdate
  }
}

function mapDispatchToProps (dispatch: ThunkDispatch<ApplicationState, void, Action>) {
  return {
    onLoadSongs: async () => await dispatch(loadSongs())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Updater)
