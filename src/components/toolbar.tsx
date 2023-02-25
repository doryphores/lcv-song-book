import classnames from 'classnames'
import React, { ChangeEvent, useCallback } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { selectVoice } from '../actions'
import { sheetMusicURL } from '../selectors'
import Downloader from './downloader'
import Settings from './settings'
import Shortcuts from './shortcuts'
import Icon from './icon'
import Updater from './updater'

type ToolbarProps = {
  className: string
  selectedVoice: string
  sheetMusicURL: string
  onSelectVoice: (voice: string) => void
}

const VOICES = [
  'Soprano 1',
  'Soprano 2',
  'Alto 1',
  'Alto 2',
  'Tenor 1',
  'Tenor 2',
  'Bass 1',
  'Bass 2'
]

const Toolbar: React.FC<ToolbarProps> = ({
  className,
  selectedVoice,
  sheetMusicURL,
  onSelectVoice
}) => {
  const selectVoice = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onSelectVoice(e.target.value)
    e.target.blur()
  }, [selectedVoice])

  return (
    <div className={classnames(className, 'toolbar u-flex u-flex--horizontal')}>
      <div className='toolbar__voice-selector u-flex__panel theme--dark'>
        <label className='field field--dropdown'>
          <select className='field__input field__input--select'
            value={selectedVoice}
            onChange={selectVoice}>
            {VOICES.map(v => <option key={v}>{v}</option>)}
          </select>
          <Icon className='field__icon' icon='arrow_drop_down' />
        </label>
      </div>

      <Updater className='u-flex__panel' />
      <Downloader className='u-flex__panel' pdfURL={sheetMusicURL} />
      <Settings className='u-flex__panel' />
      <Shortcuts className='u-flex__panel' />
    </div>
  )
}

function mapStateToProps (state: ApplicationState) {
  return {
    selectedVoice: state.selectedVoice,
    sheetMusicURL: sheetMusicURL(state)
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onSelectVoice: (voice: string) => dispatch(selectVoice(voice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
